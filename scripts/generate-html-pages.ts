import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PAGES_SEO, generateXmlSitemap } from '../src/data/seoData';
import { injectSeoIntoHtml } from '../src/server/seoInjector';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');

function run() {
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('dist/index.html not found! Run vite build first.');
    return;
  }

  const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

  // Update root index.html with home page SEO
  const homeHtml = injectSeoIntoHtml(baseHtml, 'home');
  fs.writeFileSync(indexHtmlPath, homeHtml, 'utf-8');
  console.log('✓ Prerendered dist/index.html (Home Page)');

  // Generate distinct HTML files and directories for each page segment
  for (const [key, cfg] of Object.entries(PAGES_SEO)) {
    if (key === 'home') continue;

    const pageHtml = injectSeoIntoHtml(baseHtml, key);
    const pageDir = path.join(distDir, key);

    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true });
    }

    // Write dist/<key>/index.html
    fs.writeFileSync(path.join(pageDir, 'index.html'), pageHtml, 'utf-8');
    // Also write dist/<key>.html for static hosts
    fs.writeFileSync(path.join(distDir, `${key}.html`), pageHtml, 'utf-8');
    console.log(`✓ Generated distinct HTML page: dist/${key}/index.html & dist/${key}.html (${cfg.categoryNameBn})`);
  }

  // Ensure sitemap.xml and robots.txt in dist
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), generateXmlSitemap(), 'utf-8');
  console.log('✓ Generated dist/sitemap.xml');

  const robotsTxt = `User-agent: *
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
`;
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf-8');
  console.log('✓ Generated dist/robots.txt');

  console.log('\nAll multi-page HTML documents generated successfully for Google Search & SEO!');
}

run();
