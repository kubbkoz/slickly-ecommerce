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

  modules: ['@pinia/nuxt', '@nuxt/image', '@vueuse/motion/nuxt', 'nuxt-lenis'],

  image: {
    domains: ['lh3.googleusercontent.com'],
    format: ['avif', 'webp'],
    quality: 80,
  },

  lenis: {
    autoRaf: true,
    root: true,
    options: {
      lerp: 0.1,
      smoothWheel: true,
    },
  },

  motion: {
    directives: {
      'slide-up': {
        initial: { opacity: 0, y: 24 },
        visibleOnce: { opacity: 1, y: 0, transition: { duration: 600, ease: 'easeOut' } },
      },
      'fade-in': {
        initial: { opacity: 0 },
        visibleOnce: { opacity: 1, transition: { duration: 500, ease: 'easeOut' } },
      },
      'slide-left': {
        initial: { opacity: 0, x: -24 },
        visibleOnce: { opacity: 1, x: 0, transition: { duration: 600, ease: 'easeOut' } },
      },
      'slide-right': {
        initial: { opacity: 0, x: 24 },
        visibleOnce: { opacity: 1, x: 0, transition: { duration: 600, ease: 'easeOut' } },
      },
    },
  },

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

  // Static pages (homepage, catalog, blog, legal) are prerendered at build
  // time for near-zero TTFB. Cart/checkout/account keep default SSR since
  // their content is driven by client-side state. Hashed assets and
  // optimised images get immutable cache headers.
  routeRules: {
    '/**': { headers: securityHeaders },
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/_ipx/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/': { prerender: true },
    '/produkty': { prerender: true },
    '/produkty/**': { prerender: true },
    '/blog': { prerender: true },
    '/blog/**': { prerender: true },
    '/certifikaty': { prerender: true },
    '/obchodne-podmienky': { prerender: true },
    '/ochrana-sukromia': { prerender: true },
    '/msds': { prerender: true },
  },

  nitro: {
    compressPublicAssets: { gzip: true, brotli: true },
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      ignore: ['/kosik', '/pokladna', '/ucet', '/oblubene', '/coming-soon', '/_ipx'],
    },
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-vue': ['vue', 'vue-router'],
            'vendor-pinia': ['pinia'],
            'vendor-motion': ['@vueuse/motion'],
          },
        },
      },
    },
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'sk' },
      title: 'SLICKLY | Umenie Čistoty',
      style: [
        {
          innerHTML: `
            body{margin:0;background:#f7f9fb;color:#191c1e;font-family:"Hanken Grotesk",ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
            .main-content-safe{padding-top:calc(64px + env(safe-area-inset-top,0px));padding-bottom:calc(64px + env(safe-area-inset-bottom,0px))}
            @media(min-width:768px){.main-content-safe{padding-top:0;padding-bottom:0}}
          `.replace(/\n\s+/g, ''),
        },
      ],
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
        { rel: 'preconnect', href: 'https://lh3.googleusercontent.com' },
        {
          rel: 'preload',
          as: 'image',
          href: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI8N-dfsByjce2Dl-vav0-QgPBBhmacpaNSRluOPskO-O3r55efCUmVjquZr_LtOSJkXrZhlUUuT15Hxj4_0vkLVGIOHygbmfDXbkA-cjm6RRTYd_706Ji-jSBbBAOeDQQZ-KEPELBVMtWn4NwqtNhL3tsbFUk_hoQbaLwXFN-ltZBSNHnG3VJI1jyoXO6DOxtZrBtsQhXJJbijIuU5v9nxwWgfZP8k9bxLyErqzWrfF_5Ra9Ok8Y817xctq5K2BIycgsITFTx6VGh',
          fetchpriority: 'high',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&display=optional',
          media: 'print',
          onload: "this.media='all'",
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@400,0..1&display=swap',
          media: 'print',
          onload: "this.media='all'",
        },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.json' },
      ],
    },
  },
})
