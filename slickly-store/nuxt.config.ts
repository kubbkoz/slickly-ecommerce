import { fileURLToPath } from 'url';
import { createResolver } from "@nuxt/kit";

const { resolve } = createResolver(import.meta.url);

// Environment detection — dev (localhost) vs production (slickly.sk)
// Pri `pnpm dev` → NODE_ENV=development; pri `pnpm build` → NODE_ENV=production
const isProd = process.env.NODE_ENV === 'production';

// Auto-switch defaults pre URL + WebAuthn config podľa prostredia.
// .env premenné majú vždy prednosť (override).
// Pozn.: Shopware Store/Admin API a media CDN ostávajú na pôvodnom backende
// (mtsport.store) — to je dátový zdroj, nie brand doména. Meň cez .env.
const DEFAULT_SITE_URL = isProd ? 'https://slickly.sk' : 'http://localhost:3000';
const DEFAULT_WEBAUTHN_RP_ID = isProd ? 'slickly.sk' : 'localhost';

// Redis storage helper — Unix socket (VPS) alebo TCP URL, s fallbackom
const redisDriver = (base: string, fallback: Record<string, unknown>) => {
  if (process.env.REDIS_SOCKET) {
    // VPS Unix socket (napr. /dev/shm/sock-redis-p62577)
    return { driver: 'redis', path: process.env.REDIS_SOCKET, base } as const;
  }
  if (process.env.REDIS_URL) {
    // TCP / Upstash (napr. redis://localhost:6379)
    return { driver: 'redis', url: process.env.REDIS_URL, base } as const;
  }
  return fallback;
};

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
extends: ["../vue-starter-template", "./features/blog"],
  compatibilityDate: "2025-12-05",
  // Vypnuté sourcemapy → výrazne nižší peak-memory pri builde (kvôli OOM na
  // pamäťovo limitovanom shared-hosting build kontajneri) + menší .output.
  sourcemap: false,
  modules: ["@unocss/nuxt", "@pinia/nuxt", "@nuxtjs/fontaine"],
  // Fontaine: generuje size-adjust fallback @font-face metriky pre brand font
  // → eliminuje CLS pri swape z fallback fontu na Space Grotesk.
  // Nezasahuje do @fontsource loadovania ani manuálnych preloadov. (audit P1 #7)
  fontMetrics: {
    fonts: ['Space Grotesk'],
  },
  i18n: {
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL,
    strategy: "prefix_except_default",
    defaultLocale: "sk" as any,
    // INTLIFY-FIX: fallbackLocale silences [intlify] "Not found '...'" warnings.
    // When a key is missing, i18n uses sk (master) instead of logging SSR spam.
    // @ts-expect-error — fallbackLocale is valid at runtime; Nuxt type lags behind @nuxtjs/i18n
    fallbackLocale: "sk",
    detectBrowserLanguage: false,
    langDir: "../app/locales",
    vueI18n: resolve("../vue-starter-template/i18n/config"),
    locales: [
      {
        code: "sk",
        iso: "sk-SK",
        language: "sk-SK",
        file: "sk-SK.ts",
        name: "Slovak",
        shopwareId: process.env.NUXT_PUBLIC_SW_ID_LANG_SK
      },
      {
        code: "cz",
        iso: "cs-CZ",
        language: "cs-CZ",
        file: "cs-CZ.ts",
        name: "Czech",
        shopwareId: process.env.NUXT_PUBLIC_SW_ID_LANG_CZ
      },
      {
        code: "de",
        iso: "de-DE",
        language: "de-DE",
        file: "de-DE.ts",
        name: "Deutsch",
        shopwareId: process.env.NUXT_PUBLIC_SW_ID_LANG_DE
      },
      {
        code: "hu",
        iso: "hu-HU",
        language: "hu-HU",
        file: "hu-HU.ts",
        name: "Magyar",
        shopwareId: process.env.NUXT_PUBLIC_SW_ID_LANG_HU
      },
      {
        code: "en",
        iso: "en-GB", // Keeping standard english fallback
        language: "en-GB",
        file: "en-GB.ts",
        name: "English",
        shopwareId: process.env.NUXT_PUBLIC_SW_ID_LANG_EN
      },
      {
        code: "pl",
        iso: "pl-PL",
        language: "pl-PL",
        file: "pl-PL.ts",
        name: "Polski",
        shopwareId: process.env.NUXT_PUBLIC_SW_ID_LANG_PL
      },
    ],
    bundle: {},
  },
  css: [
    // Local fonts via @fontsource (no Google Fonts CDN needed)
    // latin = basic A-Z | latin-ext = Slovak/Czech diacritics subset
    // Space Grotesk (jediný font na celom webe — nadpisy aj body text)
    "@fontsource/space-grotesk/300.css",
    "@fontsource/space-grotesk/400.css",
    "@fontsource/space-grotesk/500.css",
    "@fontsource/space-grotesk/600.css",
    "@fontsource/space-grotesk/700.css",
    // App base styles
    "~/assets/css/main.css",
    // Blog & static page content typography
    "~/assets/css/blog-content.css",
    // vanilla-cookieconsent: base layout CSS + SLICKLY brand theme overrides
    "vanilla-cookieconsent/dist/cookieconsent.css",
    "~/assets/css/cookieconsent-theme.css",
  ],

  routeRules: {
    // 1. Zabezpečenie úplnej asynchrónnosti pre privátne/dynamické stránky (ZÁKAZ SWR)
    "/cart": { ssr: false, swr: false, prerender: false, headers: { 'cache-control': 'no-store, no-cache' } },
    "/checkout/**": { ssr: false, swr: false, prerender: false, headers: { 'cache-control': 'no-store, no-cache' } },
    "/account/**": { ssr: false, swr: false, prerender: false, headers: { 'cache-control': 'no-store, no-cache' } },
    "/login": { ssr: false, swr: false, prerender: false },
    "/register": { ssr: false, swr: false, prerender: false },
    "/search": { swr: false, prerender: false },

    // Sitemap — cachovať 1 hodinu, nikdy neprerendrovávať
    "/sitemap.xml": { swr: 3600, prerender: false },

    // Blog — SWR 30 minút (obsah sa mení zriedka) + CDN/nginx cache-control (audit P0 #4)
    "/blog": { swr: 1800, headers: { 'cache-control': 's-maxage=1800, stale-while-revalidate=86400' } },
    "/blog/**": { swr: 1800, headers: { 'cache-control': 's-maxage=1800, stale-while-revalidate=86400' } },

    // 2. Extrémna agresívna statická analýza pre SEO routing (Kategórie, Produkty, CMS)
    // swr = Stale-While-Revalidate - doručí z Nitro cache okamžite, asynchrónne zrevaliduje na pozadí
    // + s-maxage hlavička → CDN/nginx pred Nuxtom cachuje rovnako (TTFB ~0). (audit P0 #4)
    "/**": process.env.NODE_ENV === "development"
      ? { swr: false }
      : { swr: 3600, headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=86400' } },
  },
  // @nuxt/image: povolené externé domény pre Shopware media CDN
  // Bez tohto NuxtImg nevygeneruje optimalizovaný srcset pre mtsport.store/media/*
  image: {
    domains: ['mtsport.store'],
    format: ['webp', 'avif'],
    // Tuning (audit P1 #8): nižšia kvalita = menej bajtov bez viditeľnej straty,
    // retina varianty cez densities, jednotné breakpointy pre srcset.
    quality: 78,
    densities: [1, 2],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536,
    },
  },
  runtimeConfig: {
    // Server-only — never exposed to client bundle
    // Google Places API (New) — Reviews, ~$0.017/req, free within $200/month credit
    googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY || '',
    // Google Business Profile API (OAuth — pre prípad schválenia Reviews API)
    googleBusinessClientId:     process.env.GOOGLE_BUSINESS_CLIENT_ID || '',
    googleBusinessClientSecret: process.env.GOOGLE_BUSINESS_CLIENT_SECRET || '',
    googleBusinessRefreshToken: process.env.GOOGLE_BUSINESS_REFRESH_TOKEN || '',
    googleBusinessLocationName: process.env.GOOGLE_BUSINESS_LOCATION_NAME || '',
    claudeApiKey: process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY || '',
    shopwareAdminEndpoint: process.env.SHOPWARE_ADMIN_ENDPOINT || 'https://mtsport.store/api/',
    shopwareAdminClientId: process.env.SHOPWARE_ADMIN_CLIENT_ID || '',
    shopwareAdminClientSecret: process.env.SHOPWARE_ADMIN_CLIENT_SECRET || '',
    // OAuth providers
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    facebookAppId: process.env.FACEBOOK_APP_ID || '',
    facebookAppSecret: process.env.FACEBOOK_APP_SECRET || '',
    // WebAuthn / Passkeys
    webauthnRpId: process.env.WEBAUTHN_RP_ID || DEFAULT_WEBAUTHN_RP_ID,
    webauthnRpName: process.env.WEBAUTHN_RP_NAME || 'SLICKLY',
    // AES-256 encryption key for OAuth credentials in cache
    oauthEncryptionKey: process.env.OAUTH_ENCRYPTION_KEY || '',
    // Webhook secret — overuje požiadavky z n8n
    webhookSecret: process.env.WEBHOOK_SECRET || '',
    // n8n webhook URL — fallback pre order lookup
    n8nWebhookUrl: process.env.N8N_WEBHOOK_URL || '',
    // SMTP
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: process.env.SMTP_PORT || '587',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    smtpFrom: process.env.SMTP_FROM || 'info@mtsport.sk',
    public: {
      shopware: {
        endpoint: process.env.NUXT_PUBLIC_SHOPWARE_ENDPOINT || "https://mtsport.store/store-api/",
        accessToken: process.env.NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN || '',
        devStorefrontUrl: "http://localhost:3000",
        ids: {
          // Global
          salesChannel: process.env.NUXT_PUBLIC_SW_ID_SALES_CHANNEL,
          rootCategory: process.env.NUXT_PUBLIC_SW_ID_ROOT_CATEGORY,
          
          // Languages
          languages: {
            sk: process.env.NUXT_PUBLIC_SW_ID_LANG_SK,
            cz: process.env.NUXT_PUBLIC_SW_ID_LANG_CZ,
            pl: process.env.NUXT_PUBLIC_SW_ID_LANG_PL,
            en: process.env.NUXT_PUBLIC_SW_ID_LANG_EN,
            de: process.env.NUXT_PUBLIC_SW_ID_LANG_DE,
            hu: process.env.NUXT_PUBLIC_SW_ID_LANG_HU,
          },

          // Categories
          categories: {
            homeSlider: process.env.NUXT_PUBLIC_SW_ID_CAT_HOME_SLIDER,
            homeGridSub: process.env.NUXT_PUBLIC_SW_ID_CAT_HOME_GRID_SUB,
            featured: process.env.NUXT_PUBLIC_SW_ID_CAT_FEATURED,
            flashSales: process.env.NUXT_PUBLIC_SW_ID_CAT_FLASH_SALES,
            bikes: process.env.NUXT_PUBLIC_SW_ID_CAT_BIKES,
            ebikes: process.env.NUXT_PUBLIC_SW_ID_CAT_EBIKES,
            doplnky: process.env.NUXT_PUBLIC_SW_ID_CAT_DOPLNKY,
            komponenty: process.env.NUXT_PUBLIC_SW_ID_CAT_KOMPONENTY,
            oblecenie: process.env.NUXT_PUBLIC_SW_ID_CAT_OBLECENIE,
            kamennaPredajna: process.env.NUXT_PUBLIC_SW_ID_CAT_KAMENNA_PREDAJNA,
            kamenna: process.env.NUXT_PUBLIC_SW_ID_CAT_KAMENNA,
            faq: process.env.NUXT_PUBLIC_SW_ID_CAT_FAQ,
            reviews: process.env.NUXT_PUBLIC_SW_ID_CAT_REVIEWS,
          },

          shipping: {
            balikovo: process.env.NUXT_PUBLIC_SW_ID_SHIPPING_BALIKOVO,
            toptrans: process.env.NUXT_PUBLIC_SW_ID_SHIPPING_TOPTRANS,
            toptransCz: process.env.NUXT_PUBLIC_SW_ID_SHIPPING_TOPTRANS_CZ,
            toptransPl: process.env.NUXT_PUBLIC_SW_ID_SHIPPING_TOPTRANS_PL,
            sps: process.env.NUXT_PUBLIC_SW_ID_SHIPPING_SPS,
            osobnyOdber: process.env.NUXT_PUBLIC_SW_ID_SHIPPING_OSOBNY_ODBER,
          },

          payment: {
            prevod: process.env.NUXT_PUBLIC_SW_ID_PAYMENT_PREVOD,
            dobierka: process.env.NUXT_PUBLIC_SW_ID_PAYMENT_DOBIERKA,
            hotovost: process.env.NUXT_PUBLIC_SW_ID_PAYMENT_HOTOVOST,
            googlePay: process.env.NUXT_PUBLIC_SW_ID_PAYMENT_GOOGLE_PAY,
            applePay: process.env.NUXT_PUBLIC_SW_ID_PAYMENT_APPLE_PAY,
            creditCard: process.env.NUXT_PUBLIC_SW_ID_PAYMENT_CREDIT_CARD,
          },

          // Products
          products: {
            expressShipping: process.env.NUXT_PUBLIC_SW_ID_PRODUCTS_EXPRESS_SHIPPING,
            dobierka: process.env.NUXT_PUBLIC_SW_ID_PRODUCTS_DOBIERKA,
            balneBike: process.env.NUXT_PUBLIC_SW_ID_PRODUCTS_BALNE_BIKE,
            balneEbike: process.env.NUXT_PUBLIC_SW_ID_PRODUCTS_BALNE_EBIKE,
          },

          // Properties
          properties: {
            frameSize: process.env.NUXT_PUBLIC_SW_ID_PROP_GROUP_FRAME_SIZE,
            size: process.env.NUXT_PUBLIC_SW_ID_PROP_GROUP_SIZE,
            color: process.env.NUXT_PUBLIC_SW_ID_PROP_GROUP_COLOR,
          },

          // Currencies
          currencies: {
            eur: process.env.NUXT_PUBLIC_SW_ID_CURRENCY_EUR,
          }
        }
      },
      // Root navigation category ID (was hardcoded in useCategory.ts)
      rootCategoryId: process.env.NUXT_PUBLIC_SW_ID_ROOT_CATEGORY,
      // Sales channel ID for SEO URL filter (was hardcoded in [...all].vue)
      salesChannelId: process.env.NUXT_PUBLIC_SW_ID_SALES_CHANNEL,
      // Canonical site URL — replaces all hardcoded 'https://mtsport.store' references
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL,
    },
  },
  components: [
    {
      path: resolve('./app/components'),
      // FIX-XSS: Priority 30 ensures our local components win over:
      // - vue-starter-template (priority 2)
      // - @shopware/cms-base-layer (no explicit priority = lower than 10)
      // This makes our clean CmsElementProductDescriptionReviews override the xss-laden base layer one.
      priority: 30,
      // FIX-CRITICAL: pathPrefix: false = komponenty sa registrujú bez prefixu adresára.
      // Bez tohto: layout/Navbar.vue → "LayoutNavbar" (nenájdené v <template> ako <Navbar />)
      // S týmto:   layout/Navbar.vue → "Navbar" ✅
      pathPrefix: false,
      global: true,
      extensions: [".vue"],
    },
  ],
  alias: {
    "@babel/traverse": resolve("./babel-shim.mjs"),
    "@babel/parser": resolve("./babel-shim.mjs"),
    "source-map-js": resolve("./babel-shim.mjs"),
    "source-map": resolve("./babel-shim.mjs"),
    // FIX-XSS: xss is a CJS-only package used in @shopware/cms-base-layer.
    // Vite resolves it from vue-starter-template/node_modules, causing:
    // SyntaxError: does not provide an export named 'default'
    // Shimming it completely removes the dependency from the bundle.
    "xss": resolve("./babel-shim.mjs"),
  },
  build: {
    transpile: [],
  },
  vite: {
    plugins: [
      {
        name: 'neutralize-build-tech',
        enforce: 'pre',
        resolveId(id) {
          if (
            /(@babel\/(traverse|parser|generator|template|types)|source-map(-js)?|css-tree\/lib\/generator\/sourceMap|sourceMap\.js|^xss$)/.test(id)
          ) {
            return resolve("./babel-shim.mjs");
          }
        }
      }
    ],
    server: {
      fs: {
        allow: [resolve('..')],
      },
      hmr: {
        protocol: 'ws',
        port: 3000,
      },
    },
    resolve: {
      alias: {
        // babel + source-map are aliased globally above via nuxt `alias`, repeated here for Vite client bundle
        // FIX-DEP0155: Remove trailing slashes from Iconify exports
        '@iconify/utils/lib/loader/install-pkg': '@iconify/utils/lib/loader/install-pkg.js',
      },
      // FIX-2.1: Deduplicate Vue and Shopware packages across the dual node_modules monorepo.
      dedupe: [
        'vue',
        '@shopware/composables',
        '@shopware/api-client',
        '@shopware/helpers',
        '@shopware/nuxt-module',
        '@vueuse/core',
      ],
    },
    optimizeDeps: {
      include: ['defu', 'scule', 'xss', 'lucide-vue-next'],
      exclude: ['@shopware/api-client', '@iconify/utils'],
    },
    build: {
      // FIX: Vlastné manualChunks (entry/vendor/vendor-shopware…) lámali init poradie
      // chunkov → klient padal na "Cannot access 'cX' before initialization" (TDZ /
      // cyklická závislosť medzi chunkami) → appka sa nehydratovala a zasekla sa na
      // loaderi. Necháme automatické chunkovanie Rollupu (rešpektuje init poradie).
      commonjsOptions: {
        include: [/node_modules/],
        // FIX-1.1: Force CJS modules to produce proper named ESM exports.
        transformMixedEsModules: true,
      },
    },
  },
  experimental: {
    payloadExtraction: false,
    appManifest: false,
  },
  // @ts-expect-error - nitro type not recognized in this project's tsconfig but works at runtime
  nitro: {
    // FIX: pri npm workspaces je `vue` hoistnuté do root node_modules a Nitro tracer
    // (nft) nezahrnul subpath `vue/server-renderer` → runtime ERR_MODULE_NOT_FOUND →
    // 500 na KAŽDOM requeste pred akýmkoľvek render/Shopware callom. Vynútime jeho
    // zahrnutie do .output/server/node_modules.
    externals: {
      traceInclude: ['vue/server-renderer'],
    },
    // Pre-kompresia statiky (JS/CSS/fonty) — brotli + gzip varianty na disku.
    // nginx/CDN servuje .br/.gz priamo → −60-80 % prenos. (audit P0 #1)
    compressPublicAssets: { gzip: true, brotli: true },
    storage: {
      // mtsport:cart:*  — zdieľaný Redis so Shopware, prefix zabraňuje kolíziám
      'cart-saves': redisDriver('mtsport:cart:', { driver: 'fs', base: './.data/cart-saves' }),
      // mtsport:catalog:* — AI produktový katalóg (5-min TTL)
      'catalog': redisDriver('mtsport:catalog:', { driver: 'memory' }),
      // db — globálny KV store pre watchdog, cache, atď. (Redis na VPS, filesystem na dev)
      'db': redisDriver('mtsport:', { driver: 'fs', base: './.data/db' }),
    },
    devProxy: {
      // Proxy Shopware media/thumbnails through local Nitro server in dev.
      // This bypasses Chrome's ORB (Opaque Response Blocking) which blocks
      // cross-origin PNG requests from localhost to mtsport.store.
      '/mts-proxy': {
        target: 'https://mtsport.store',
        changeOrigin: true,
        headers: {
          // Shopware may return 403 if Referer/Origin are missing or from localhost.
          // Spoofing these headers makes the proxied request look like it originates
          // from the same domain, bypassing hotlink protection.
          'referer': 'https://mtsport.store/',
          'origin': 'https://mtsport.store',
        },
        rewrite: (path: string) => path.replace(/^\/mts-proxy/, ''),
      },
    },
  },
  hooks: {
    // Rieši warning "Two component files resolving to the same name" — vue-starter-template
    // override komponentov z @shopware/cms-base-layer. Warning padá keď majú obe rovnakú
    // prioritu (>0). Beží PRED scanom (components:dirs) a zvýši prioritu starter dir-u
    // (mimo node_modules) → starter override vyhrá a kolízia zmizne.
    'components:dirs'(dirs: any[]) {
      for (const d of dirs) {
        const path = typeof d === 'string' ? d : d?.path;
        if (
          typeof d === 'object' && path &&
          path.includes('vue-starter-template') &&
          !path.includes('node_modules') &&
          /[\\/]app[\\/]components$/.test(path)
        ) {
          d.priority = 10; // > cms-base-layer (0/2) → override deterministicky vyhrá
        }
      }
    },
  },
  app: {
    // Page fade (180ms, CSS v main.css §page-transition) — pages boli upravené na single
    // root node, aby <Transition> fungoval. layoutTransition ostáva vypnutý.
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: false,
    head: {
      titleTemplate: '%s | SLICKLY',
      style: [
        {
          innerHTML: `
            /* =====================================================
               CRITICAL LOADER CSS — Inlined to block FOUC.
               Space Grotesk sa načítava cez @fontsource (css[]).
               ===================================================== */

            #mt-page-loader {
              position: fixed !important;
              inset: 0 !important;
              z-index: 999999 !important;
              background: #000000 !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: center;
              justify-content: center;
              opacity: 1;
              transition: opacity 0.4s ease-in-out;
              overflow: hidden;
            }
            .mt-loader-bg-video {
              position: absolute;
              inset: 0;
              width: 100%;
              height: 100%;
              object-fit: cover;
              z-index: 0;
            }
            .mt-loader-bg-overlay {
              position: absolute;
              inset: 0;
              background: rgba(0, 0, 0, 0.55);
              z-index: 1;
            }
            .mt-loader-inner {
              position: relative;
              z-index: 2;
            }
            .mt-loader-logo {
              font-family: 'Space Grotesk', 'Arial Black', Arial, sans-serif;
              font-size: 2.5rem;
              font-weight: 900;
              text-transform: uppercase;
              display: flex;
              gap: 0px;
              line-height: 1;
              letter-spacing: 0.02em;
              color: #ffffff;
            }
            .mt-logo-i { position: relative; display: inline-block; }
            .mt-logo-i-dot {
              position: absolute;
              top: -0.32em;
              left: 50%;
              transform: translateX(-50%);
              width: 0.16em;
              height: 0.16em;
              border-radius: 9999px;
              background: #FFBF00;
            }
            .mt-loader-text {
               color: #555555;
               font-family: sans-serif;
               font-size: 10px;
               text-transform: uppercase;
               letter-spacing: 0.2em;
               margin-top: 15px;
            }
            /* Hide layout content while loader is present in SSR, fade it in
               smoothly once ready instead of popping in all at once. */
            .layout-wrapper > *:not(#mt-page-loader) {
              transition: opacity 0.25s ease-out;
            }
            .layout-wrapper[data-loading="true"] > *:not(#mt-page-loader),
            .layout-wrapper[data-loading="true"] #main-content {
              opacity: 0 !important;
              visibility: hidden !important;
              transition: none !important;
            }
          `
        }
      ],
      script: [
        {
          type: 'text/javascript',
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied'
            });
          `
        }
      ],
      meta: [
        // viewport-fit=cover → env(safe-area-inset-*) vracia reálne hodnoty (notch/home
        // indicator) v standalone PWA; bez neho sú safe-area utility vždy 0.
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        // PWA installability — biely status bar pri nainštalovanej appke
        { name: "theme-color", content: "#ffffff" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "default" },
        { name: "apple-mobile-web-app-title", content: "SLICKLY" },
      ],
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicon.svg",
        },
        { rel: "manifest", href: "/manifest.webmanifest" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        // Preconnect — Shopware media CDN (product images, thumbnails)
        { rel: 'preconnect', href: 'https://mtsport.store' },
        { rel: 'dns-prefetch', href: 'https://mtsport.store' },
      ],
    },
  },
});

