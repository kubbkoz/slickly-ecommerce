import tailwindcss from '@tailwindcss/vite'

const isProd = process.env.NODE_ENV === 'production'

// Security headers applied site-wide. The Content-Security-Policy is only
// enabled in production so it does not interfere with Vite HMR / Nuxt
// Devtools (which need ws: and eval in dev). Sources allow-list: self,
// Google Fonts (stylesheet + font files) and the current image CDN.
const securityHeaders: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
}

if (isProd) {
  securityHeaders['Content-Security-Policy'] = [
    "default-src 'self'",
    "img-src 'self' https://lh3.googleusercontent.com data:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "script-src 'self' 'unsafe-inline'",
    "media-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')
  securityHeaders['Strict-Transport-Security'] = 'max-age=63072000; includeSubDomains; preload'
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt'],

  // Public runtime config — `siteUrl` is the canonical production origin used
  // to build absolute URLs for canonical tags, Open Graph, JSON-LD and the
  // sitemap. Override at deploy time via NUXT_PUBLIC_SITE_URL.
  runtimeConfig: {
    public: {
      siteUrl: 'https://slickly.sk',
    },
  },

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  css: ['~/assets/css/main.css'],

  // Route-level caching rules. The homepage is static enough to prerender at
  // build time. Marketing/catalog pages are cached (SWR) so they're served
  // instantly while revalidating in the background. Cart/checkout/account
  // keep default SSR (no caching) since their content is driven by
  // client-side cart state (localStorage today, Shopware context token
  // later).
  routeRules: {
    '/**': { headers: securityHeaders },
    '/': { prerender: true },
    '/produkty': { swr: 3600 },
    '/produkty/**': { swr: 3600 },
  },

  nitro: {
    compressPublicAssets: true,
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-vue': ['vue', 'vue-router'],
            'vendor-pinia': ['pinia'],
          },
        },
      },
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'sk' },
      title: 'SLICKLY | Umenie Čistoty',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#000000' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=Geist:wght@400;500;600;700&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
        },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.json' },
      ],
    },
  },
})
