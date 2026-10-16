import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer, loadEnv } from 'vite';
import { generateXmlSitemap, PAGES_SEO } from './src/data/seoData.ts';
import { injectSeoIntoHtml } from './src/server/seoInjector.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '5mb' }));

const CANDIDATE_MODELS = ['gemini-flash-latest'];

// Default hospital system instruction
const DEFAULT_SYSTEM_INSTRUCTION = `You are the thoughtful, intelligent official AI Health Assistant for Anowara Medical Complex (আনোয়ারা মেডিকেল কমপ্লেক্স), located in Palash, Narsingdi, Bangladesh.
Location: WAPDA Sadar Road, Medical Mor, Palash, Narsingdi.
Emergency Hotline (24/7): 01972-692504, 01944-874304
Serial Booking: 01944-874304, 01972-692504
Website: anowaramedicalcomplex.com
Specialties: Medicine, Cardiology, Gynecology, Pediatrics, Orthopedics, Surgery.
Services: 24/7 Emergency, Ambulance, Digital Pathology Lab, 4D USG, Digital X-Ray, ECG, OT, Pharmacy.
Answer questions on any topic politely and accurately. Understand Bengali, English, and mixed-language messages; reply in the user's language, or in both languages when requested. For medical questions, provide general information without claiming to diagnose or replace a clinician. For hospital-specific questions, use verified hospital information and never invent details.`;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Dynamic XML Sitemap for Search Engines (Google Search Console, Bing)
app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.send(generateXmlSitemap());
});

// Standard Robots.txt for Web Crawlers
app.get('/robots.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /receptionist

User-agent: Googlebot
Allow: /
Disallow: /admin
Disallow: /receptionist

User-agent: Bingbot
Allow: /
Disallow: /admin
Disallow: /receptionist

Host: https://anowaramedicalcomplex.com
Sitemap: https://anowaramedicalcomplex.com/sitemap.xml
`);
});

// Dedicated Chatbot API Route
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], systemInstruction } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const effectiveKey = process.env.GEMINI_API_KEY || '';

    // Prepare contents payload
    const contentsPayload = [
      ...history.slice(-8).map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    const activeSystemInstruction = systemInstruction || DEFAULT_SYSTEM_INSTRUCTION;
    const requestBody = {
      system_instruction: {
        parts: [{ text: activeSystemInstruction }]
      },
      contents: contentsPayload,
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 2048,
      }
    };

    let replyText: string | null = null;
    let lastError: any = null;

    if (effectiveKey) {
      // Loop through candidate models
      for (const model of CANDIDATE_MODELS) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(effectiveKey)}`;
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
          });

          if (response.ok) {
            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text && text.trim()) {
              replyText = text.trim();
              break;
            }
          } else {
            const errorJson = await response.json().catch(() => ({}));
            lastError = errorJson?.error || { status: response.status, message: response.statusText };
            console.warn(`[Gemini Server API] Model ${model} returned:`, lastError);

          }
        } catch (callErr: any) {
          lastError = callErr;
          console.warn(`[Gemini Server API] Error calling model ${model}:`, callErr.message);
        }
      }
    }

    if (replyText) {
      return res.json({ text: replyText, status: 'success' });
    }

    if (!effectiveKey) {
      return res.status(503).json({ error: 'AI chat is not configured. Add a valid GEMINI_API_KEY on the server.' });
    }

    console.error('[Gemini Server API] No model returned an answer:', lastError?.message || lastError || 'Unknown error');
    return res.status(502).json({ error: 'AI could not generate an answer. Please try again later.' });
  } catch (err: any) {
    console.error('[Gemini Server API] Unexpected handler error:', err);
    return res.status(500).json({ error: 'Server error processing chat request' });
  }
});

async function main() {
  const isDev = process.env.NODE_ENV !== 'production';
  const mode = isDev ? 'development' : 'production';
  const env = loadEnv(mode, process.cwd(), '');
  const configuredApiKey = [
    process.env.GEMINI_API_KEY,
    env.GEMINI_API_KEY,
  ].find((value) => value && !/^(YOUR_|MY_)/.test(value.trim()));
  if (configuredApiKey) process.env.GEMINI_API_KEY = configuredApiKey.trim();

  if (isDev) {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {
          ignored: ['**/public/**', '**/*.mp4', '**/*.webm', '**/*.avi', '**/dist/**']
        },
      },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    // Serve HTML with custom SEO pre-rendering for all pages & .html endpoints
    app.use('*', async (req, res, next) => {
      // Don't intercept API routes or non-HTML asset files (e.g. .js, .css, .jpg, .svg, .json)
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      
      const cleanUrlPath = req.originalUrl.split('?')[0];
      const hasNonHtmlExtension = cleanUrlPath.includes('.') && !cleanUrlPath.endsWith('.html');
      if (hasNonHtmlExtension) {
        return next();
      }

      try {
        const url = req.originalUrl.split('?')[0];
        const pageKey = url.replace(/^\/+|\/+$/g, '').replace(/\.html$/i, '') || 'home';
        
        let templatePath = path.resolve(__dirname, `${pageKey}.html`);
        if (!fs.existsSync(templatePath)) {
          templatePath = path.resolve(__dirname, 'index.html');
        }
        
        let template = fs.readFileSync(templatePath, 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        const customizedHtml = injectSeoIntoHtml(template, pageKey);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(customizedHtml);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    // Serve static assets without defaulting root to standard index.html immediately
    app.use(express.static(path.resolve(__dirname, 'dist'), { index: false }));

    // Serve specific pre-rendered HTML file for each route if it exists, otherwise fallback to root index.html
    app.use('*', (req, res) => {
      const url = req.originalUrl.split('?')[0];
      const pageKey = url.replace(/^\/+|\/+$/g, '').replace(/\.html$/i, '') || 'home';
      const pageFlatFile = path.resolve(__dirname, 'dist', `${pageKey}.html`);
      const pageDirFile = path.resolve(__dirname, 'dist', `${pageKey}/index.html`);

      if (fs.existsSync(pageFlatFile)) {
        return res.sendFile(pageFlatFile);
      } else if (fs.existsSync(pageDirFile)) {
        return res.sendFile(pageDirFile);
      }
      return res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Anowara Medical Complex server listening on http://0.0.0.0:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
