import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt'],

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
      ],
    },
  },
})
