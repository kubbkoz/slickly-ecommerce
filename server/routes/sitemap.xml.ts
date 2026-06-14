import { products, categories } from '../../app/data/products'

// Dynamic XML sitemap generated from the product catalog. When the catalog
// moves to Shopware, swap the static imports for a Store API fetch — the URL
// shapes (/produkty, /produkty?kategoria=, /produkty/[slug]) stay the same.
export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const base = (config.public.siteUrl as string).replace(/\/$/, '')
  const today = new Date().toISOString().split('T')[0]

  type Entry = { loc: string; changefreq: string; priority: string }
  const entries: Entry[] = [
    { loc: `${base}/`, changefreq: 'weekly', priority: '1.0' },
    { loc: `${base}/produkty`, changefreq: 'daily', priority: '0.9' },
  ]

  for (const category of categories) {
    entries.push({
      loc: `${base}/produkty?kategoria=${category.slug}`,
      changefreq: 'weekly',
      priority: '0.8',
    })
  }

  for (const product of products) {
    entries.push({
      loc: `${base}/produkty/${product.slug}`,
      changefreq: 'weekly',
      priority: '0.7',
    })
  }

  const urls = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'cache-control', 'max-age=3600, s-maxage=3600')
  return xml
})
