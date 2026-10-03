import { PAGES_SEO, generatePageJsonLd, SITE_DOMAIN } from '../data/seoData.ts';

export function injectSeoIntoHtml(html: string, rawPageKey: string): string {
  const pageKey = rawPageKey.replace(/^\/+|\/+$/g, '').toLowerCase() || 'home';
  const page = PAGES_SEO[pageKey] || PAGES_SEO.home;
  const canonicalUrl = `${SITE_DOMAIN}${page.path === '/' ? '' : page.path}`;
  const jsonLd = generatePageJsonLd(pageKey);

  let updated = html;

  // 1. Replace Title
  updated = updated.replace(/<title>.*?<\/title>/is, `<title>${page.titleBn}</title>`);

  // 2. Replace Meta Name Title
  if (updated.includes('<meta name="title"')) {
    updated = updated.replace(/<meta name="title"[^>]*>/i, `<meta name="title" content="${page.titleBn}" />`);
  }

  // 3. Replace Meta Description
  if (updated.includes('<meta name="description"')) {
    updated = updated.replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${page.descBn}" />`);
  }

  // 4. Replace Meta Keywords
  if (updated.includes('<meta name="keywords"')) {
    updated = updated.replace(/<meta name="keywords"[^>]*>/i, `<meta name="keywords" content="${page.keywordsBn}, ${page.keywordsEn}" />`);
  }

  // 5. Replace Canonical Link
  if (updated.includes('<link rel="canonical"')) {
    updated = updated.replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
  }

  // 6. Replace OpenGraph Title, Description, URL
  if (updated.includes('<meta property="og:title"')) {
    updated = updated.replace(/<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${page.titleBn}" />`);
  }
  if (updated.includes('<meta property="og:description"')) {
    updated = updated.replace(/<meta property="og:description"[^>]*>/i, `<meta property="og:description" content="${page.descBn}" />`);
  }
  if (updated.includes('<meta property="og:url"')) {
    updated = updated.replace(/<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
  }

  // 7. Replace Twitter Title, Description
  if (updated.includes('<meta name="twitter:title"')) {
    updated = updated.replace(/<meta name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${page.titleBn}" />`);
  }
  if (updated.includes('<meta name="twitter:description"')) {
    updated = updated.replace(/<meta name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${page.descBn}" />`);
  }

  // 8. Inject or replace JSON-LD script
  if (updated.includes('application/ld+json')) {
    updated = updated.replace(
      /<script type="application\/ld\+json">.*?<\/script>/is,
      `<script type="application/ld+json">\n${jsonLd}\n    </script>`
    );
  } else {
    updated = updated.replace('</head>', `    <script type="application/ld+json">\n${jsonLd}\n    </script>\n  </head>`);
  }

  return updated;
}
