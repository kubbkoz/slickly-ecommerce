import type { Product } from '~/data/products'

const SITE_NAME = 'SLICKLY'
const DEFAULT_OG_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAI8N-dfsByjce2Dl-vav0-QgPBBhmacpaNSRluOPskO-O3r55efCUmVjquZr_LtOSJkXrZhlUUuT15Hxj4_0vkLVGIOHygbmfDXbkA-cjm6RRTYd_706Ji-jSBbBAOeDQQZ-KEPELBVMtWn4NwqtNhL3tsbFUk_hoQbaLwXFN-ltZBSNHnG3VJI1jyoXO6DOxtZrBtsQhXJJbijIuU5v9nxwWgfZP8k9bxLyErqzWrfF_5Ra9Ok8Y817xctq5K2BIycgsITFTx6VGh'

export function useSiteUrl(): string {
  return (useRuntimeConfig().public.siteUrl as string).replace(/\/$/, '')
}

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path
  return `${useSiteUrl()}${path.startsWith('/') ? '' : '/'}${path}`
}

interface SeoOptions {
  title: string
  description: string
  /** Canonical path (without origin). Defaults to the current route path. */
  canonicalPath?: string
  /** Absolute or relative OG/Twitter image URL. */
  image?: string
  /** og:type — "website", "product", etc. */
  type?: string
  /** Set true for thank-you/cart/account pages that should not be indexed. */
  noindex?: boolean
}

/**
 * Single entry point for per-page SEO: title, meta description, canonical
 * link, Open Graph + Twitter Card tags and robots directive. Keeps every
 * page consistent and Shopware-ready (only the data source changes later).
 */
export function useSeo(opts: SeoOptions) {
  const route = useRoute()
  const canonical = absoluteUrl(opts.canonicalPath ?? route.path)
  const image = opts.image ? absoluteUrl(opts.image) : DEFAULT_OG_IMAGE

  useSeoMeta({
    title: opts.title,
    description: opts.description,
    ogTitle: opts.title,
    ogDescription: opts.description,
    ogType: opts.type ?? 'website',
    ogUrl: canonical,
    ogImage: image,
    ogSiteName: SITE_NAME,
    ogLocale: 'sk_SK',
    twitterCard: 'summary_large_image',
    twitterTitle: opts.title,
    twitterDescription: opts.description,
    twitterImage: image,
    robots: opts.noindex ? 'noindex, follow' : 'index, follow',
  })

  useHead({
    link: [{ rel: 'canonical', href: canonical }],
  })
}

/** Serialize a JS object as a JSON-LD <script> in the document head. */
export function useJsonLd(data: Record<string, unknown> | Record<string, unknown>[]) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(data),
      },
    ],
  })
}

interface Breadcrumb {
  name: string
  path: string
}

/** Emit BreadcrumbList JSON-LD from an ordered list of crumbs. */
export function useBreadcrumbJsonLd(crumbs: Breadcrumb[]) {
  useJsonLd({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  })
}

/** Emit Product + Offer + AggregateRating + Review JSON-LD for a product. */
export function useProductJsonLd(product: Product) {
  const url = absoluteUrl(`/produkty/${product.slug}`)
  const reviewCount = product.reviews.length
  const avg = reviewCount
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / reviewCount
    : 0

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.gallery.length ? product.gallery : [product.image],
    brand: { '@type': 'Brand', name: SITE_NAME },
    category: product.category,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'EUR',
      price: product.price.toFixed(2),
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  }

  if (reviewCount) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avg.toFixed(1),
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    }
    data.review = product.reviews.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      datePublished: r.date,
      reviewBody: r.text,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
    }))
  }

  useJsonLd(data)
}
