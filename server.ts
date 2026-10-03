import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { generateXmlSitemap, PAGES_SEO } from './src/data/seoData.ts';
import { injectSeoIntoHtml } from './src/server/seoInjector.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '5mb' }));

// Supported candidate models
const CANDIDATE_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.8-flash',
  'gemini-flash-latest'
];

// Default hospital system instruction
const DEFAULT_SYSTEM_INSTRUCTION = `You are the thoughtful, intelligent official AI Health Assistant for Anowara Medical Complex (আনোয়ারা মেডিকেল কমপ্লেক্স), located in Palash, Narsingdi, Bangladesh.
Location: WAPDA Sadar Road, Medical Mor, Palash, Narsingdi.
Emergency Hotline (24/7): 01972-692504, 01944-874304
Serial Booking: 01944-874304, 01972-692504
Website: anowaramedicalcomplex.com
Specialties: Medicine, Cardiology, Gynecology, Pediatrics, Orthopedics, Surgery.
Services: 24/7 Emergency, Ambulance, Digital Pathology Lab, 4D USG, Digital X-Ray, ECG, OT, Pharmacy.
Always answer politely and warmly in Bengali (or English if asked in English). Refuse off-topic tasks (programming, politics, homework).`;

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
    const { message, history = [], systemInstruction, customKey } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Determine the API Key to use: custom key provided by user, or server environment key
    const effectiveKey = (customKey && customKey !== 'YOUR_GEMINI_API_KEY') 
      ? customKey 
      : (process.env.GEMINI_API_KEY || '');

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
        maxOutputTokens: 800,
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

            // If permission denied on custom key, try falling back to server environment key if different
            if (response.status === 403 && customKey && process.env.GEMINI_API_KEY && customKey !== process.env.GEMINI_API_KEY) {
              const fallbackEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;
              const fbRes = await fetch(fallbackEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
              });
              if (fbRes.ok) {
                const fbData = await fbRes.json();
                const fbText = fbData?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (fbText && fbText.trim()) {
                  replyText = fbText.trim();
                  break;
                }
              }
            }
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

    // If Gemini was unavailable or returned permission denied / quota exceeded, return fallback status with explanation
    return res.json({ 
      text: null, 
      status: 'fallback', 
      notice: lastError?.message ? `Notice: ${lastError.message}` : 'Gemini AI is processing your request via local reasoning engine'
    });
  } catch (err: any) {
    console.error('[Gemini Server API] Unexpected handler error:', err);
    return res.status(500).json({ error: 'Server error processing chat request' });
  }
});

async function main() {
  const isDev = process.env.NODE_ENV !== 'production';

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
