import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const metadataPath = path.join(projectRoot, 'src', 'seo', 'metadata.json');
const publicDirectory = path.join(projectRoot, 'public');
const metadata = JSON.parse(await readFile(metadataPath, 'utf8'));

const { site, routes } = metadata;
const siteUrl = site.url.replace(/\/+$/, '');
const languages = site.languages;

if (!/^https:\/\//.test(siteUrl)) {
  throw new Error('SEO site URL must be an absolute HTTPS URL.');
}

if (!Array.isArray(languages) || languages.length === 0) {
  throw new Error('SEO metadata must define at least one site language.');
}

const escapeXml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const localizedUrl = (routePath, language) => {
  const normalizedPath = String(routePath || '').replace(/^\/+|\/+$/g, '');
  if (language === 'fa') return `${siteUrl}${normalizedPath ? `/${normalizedPath}` : '/'}`;
  return `${siteUrl}/${language}${normalizedPath ? `/${normalizedPath}` : ''}`;
};

const hrefLanguageTag = (language) => (language === 'fa' ? 'fa-IR' : language);

const sitemapRoutes = routes.filter((route) => route.sitemap && !route.noIndex);

for (const route of sitemapRoutes) {
  if (route.path.includes(':')) {
    throw new Error(
      `Dynamic route "${route.path}" needs concrete URLs before entering the sitemap.`,
    );
  }
}

const sitemapEntries = sitemapRoutes.flatMap((route) =>
  languages.map((language) => {
    const canonicalPath = route.canonicalPath ?? route.path;
    const alternateLinks = languages
      .map(
        (alternateLanguage) =>
          `    <xhtml:link rel="alternate" hreflang="${escapeXml(hrefLanguageTag(alternateLanguage))}" href="${escapeXml(localizedUrl(canonicalPath, alternateLanguage))}" />`,
      )
      .concat(
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(localizedUrl(canonicalPath, site.defaultLanguage))}" />`,
      )
      .join('\n');

    return [
      '  <url>',
      `    <loc>${escapeXml(localizedUrl(canonicalPath, language))}</loc>`,
      alternateLinks,
      `    <changefreq>${escapeXml(route.changefreq)}</changefreq>`,
      `    <priority>${Number(route.priority).toFixed(2)}</priority>`,
      '  </url>',
    ].join('\n');
  }),
);

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...sitemapEntries,
  '</urlset>',
  '',
].join('\n');

const blockedPaths = routes
  .filter((route) => route.noIndex)
  .flatMap((route) =>
    languages.map((language) => {
      const normalizedPath = String(route.path).replace(/^\/+|\/+$/g, '');
      return `Disallow: /${language === 'fa' ? '' : `${language}/`}${normalizedPath}`;
    }),
  );

const robots = [
  'User-agent: *',
  'Allow: /',
  ...blockedPaths,
  '',
  `Sitemap: ${siteUrl}/sitemap.xml`,
  '',
].join('\n');

const htmlEscape = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

function updateMeta(html, attribute, key, value) {
  const pattern = new RegExp(`<meta\\s+${attribute}="${key}"[^>]*>`, 'i');
  const tag = `<meta ${attribute}="${key}" content="${htmlEscape(value)}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n  </head>`);
}

const home = routes.find((route) => route.id === 'home').meta[site.defaultLanguage];
const homeUrl = localizedUrl('', site.defaultLanguage);
const imageUrl = `${siteUrl}${site.image}`;
const organizationId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;
const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': organizationId,
    name: site.name.fa,
    alternateName: 'آمازون',
    url: siteUrl,
    telephone: site.contact.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.contact.address,
      addressLocality: 'زاهدان',
      addressCountry: 'IR',
    },
    sameAs: [site.contact.instagram],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: site.contact.phone,
      url: site.contact.whatsapp,
      contactType: 'customer service',
      availableLanguage: ['fa'],
    },
    image: imageUrl,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    url: siteUrl,
    name: site.name.fa,
    inLanguage: 'fa-IR',
    publisher: { '@id': organizationId },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${homeUrl}#webpage`,
    url: homeUrl,
    name: home.title,
    description: home.description,
    inLanguage: 'fa-IR',
    isPartOf: { '@id': websiteId },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: site.imageWidth,
      height: site.imageHeight,
    },
  },
];

const indexPath = path.join(projectRoot, 'index.html');
let indexHtml = await readFile(indexPath, 'utf8');
indexHtml = indexHtml
  .replace(/<title>[\s\S]*?<\/title>/i, `<title>${htmlEscape(home.title)}</title>`)
  .replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${homeUrl}" />`)
  .replace(/<link\s+rel="alternate"\s+hreflang="[^"]+"[^>]*>\s*/gi, '')
  .replace(
    /<script\s+id="seo-structured-data"[^>]*>[\s\S]*?<\/script>/i,
    `<script id="seo-structured-data" type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, '\\u003c')}</script>`,
  );

const alternates = [
  ...languages.map(
    (language) => `<link rel="alternate" hreflang="${hrefLanguageTag(language)}" href="${localizedUrl('', language)}" />`,
  ),
  `<link rel="alternate" hreflang="x-default" href="${homeUrl}" />`,
].join('\n    ');
indexHtml = indexHtml.replace(/<link\s+rel="canonical"[^>]*>/i, (tag) => `${tag}\n    ${alternates}`);

for (const [attribute, key, value] of [
  ['name', 'description', home.description],
  ['name', 'theme-color', site.themeColor],
  ['property', 'og:locale', 'fa_IR'],
  ['property', 'og:site_name', site.name.fa],
  ['property', 'og:url', homeUrl],
  ['property', 'og:title', home.title],
  ['property', 'og:description', home.description],
  ['property', 'og:image', imageUrl],
  ['property', 'og:image:secure_url', imageUrl],
  ['property', 'og:image:width', site.imageWidth],
  ['property', 'og:image:height', site.imageHeight],
  ['property', 'og:image:alt', home.title],
  ['name', 'twitter:title', home.title],
  ['name', 'twitter:description', home.description],
  ['name', 'twitter:image', imageUrl],
  ['name', 'twitter:image:alt', home.title],
]) {
  indexHtml = updateMeta(indexHtml, attribute, key, value);
}
indexHtml = indexHtml.replace(/<meta\s+property="og:locale:alternate"[^>]*>\s*/gi, '');

await Promise.all([
  writeFile(path.join(publicDirectory, 'sitemap.xml'), sitemap, 'utf8'),
  writeFile(path.join(publicDirectory, 'robots.txt'), robots, 'utf8'),
  writeFile(indexPath, indexHtml, 'utf8'),
]);

console.log(
  `Generated robots.txt and sitemap.xml for ${sitemapEntries.length} localized public URLs.`,
);
