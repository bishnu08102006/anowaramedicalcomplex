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
