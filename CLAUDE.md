# CLAUDE.md

Tento súbor poskytuje kontext pre Claude Code pri práci s týmto repozitárom.

## Aktuálna architektúra (od portu mtsport → SLICKLY)

Repozitár bol prepísaný na **headless Shopware storefront** (Shopware Frontends stack),
zduplikovaný z `mtsport-nuxt` a prebrandovaný na **SLICKLY**. Layout je monorepo:

```
repo-root/
├── vue-starter-template/   # základný Nuxt layer (Shopware Frontends starter)
├── slickly-store/          # HLAVNÁ aplikácia (rozširuje template cez file:../ + extends)
├── shopware-plugins/       # backend PHP pluginy (Mtsport*; nasadzujú sa na Shopware server)
└── _legacy-slickly/        # PÔVODNÝ slickly frontend (Tailwind v4 + mock dáta) — archív
```

Pracuj v **`slickly-store/`**. `_legacy-slickly/` je len archív (needituj).

### Tech stack (slickly-store)
- **Nuxt 4** + **Vue 3** `<script setup lang="ts">`, `app/` srcDir.
- **Shopware Frontends**: `@shopware/api-client`, `@shopware/composables` (nuxt-layer),
  `@shopware/cms-base-layer`, `@shopware/nuxt-module`, `@shopware/helpers` (canary).
  Commerce logika (košík, listing, checkout, účet, wishlist, search) = composables z týchto balíkov.
- **UnoCSS** (NIE Tailwind) — všetky tokeny/shortcuts v `slickly-store/uno.config.ts`.
- **Pinia**, **@nuxtjs/i18n** (SK default; CZ/PL/EN/DE/HU), **@nuxt/image**, **@nuxt/icon**.
- Server: Nitro API routes (`server/api/**`), Redis (ioredis), SMTP (nodemailer),
  WebAuthn, AI chat (Anthropic/Gemini), loyalty, returns, comparison, SPS.

## PRAVIDLO: Dizajnový systém

Drž sa `slickly-store/design.md` a tokenov v `slickly-store/uno.config.ts`. SLICKLY identita
„Minimalist Precision":
- **Farby:** `brand` = čierna `#000000` (primárne CTA/header/logo), `amber` = `#FFBF00`
  (akcenty/badge/highlight), `success #1B7D3A`, `error #BA1A1A`. Surface tóny svetlé.
  Používaj tokeny/shortcuts (`bg-brand`, `text-amber`, `btn-checkout`…), NIE hardcoded hex.
- **Typografia:** **Space Grotesk** — jediný font na celom webe (`font-tech` aj `font-sans`
  mapujú naň: nadpisy, ceny, technické dáta, body, labely, formuláre). Self-hosted cez
  `@fontsource/space-grotesk`, NIE Google Fonts CDN.
- **Shape:** `rounded-default` (6px) na CTA/inputy/karty. NIKDY `rounded-full` na tlačidlá,
  žiadne agresívne `skew`/`italic`.
- **Shortcuts:** `section-h2`, `section-decorator`, `brand-badge`, `btn-nav-arrow`,
  `btn-tab-active/inactive`, `btn-action-grid`, `form-input`, `btn-checkout` — definované v `uno.config.ts`.

## Príkazy (v slickly-store/)
```bash
npm install        # @shopware/* canary + fontsource (vyžaduje npm registry)
npm run dev        # dev server
npm run build      # nuxt prepare && nuxt build
npm run generate   # SSG
```
`vue-starter-template/` má vlastné `node_modules` — spusti v nej `npm install` tiež
(je to file:../ layer dependency).

## Runtime prerekvizity (.env — pozri slickly-store/.env.example)
- **Shopware Store + Admin API** s nainštalovanými `shopware-plugins/Mtsport*` (loyalty, returns,
  badges, SPS, blog, prices). Default dátový backend ostáva `mtsport.store` (športový katalóg) —
  prepíš `NUXT_PUBLIC_SHOPWARE_ENDPOINT`/`SHOPWARE_ADMIN_*` na slickly Shopware.
- Redis, SMTP, `ANTHROPIC_API_KEY`/`GEMINI_API_KEY`, Google/Facebook OAuth, WebAuthn doména
  (`WEBAUTHN_RP_ID=slickly.sk`), n8n webhook. Brand doména = `slickly.sk`.

## Rebrand poznámky
- User-facing wordmarky `MTSPORT/MT-SPORT` → `SLICKLY`. Logo „SLICK"+„LY" (amber), favicon „S".
- **Backend-contract identifikátory ponechané** (`mtsport-sps`, `mtsport-badge`, `mtsport_ico`,
  `mtsport-return`, redis `mtsport:` prefixy) — zodpovedajú nasadeným Shopware pluginom; meniť ich
  len ak prebranduješ aj `shopware-plugins/` a redeployneš backend.

## Známy problém prostredia (build)
V niektorých sandbox CPU/libc prostrediach `nuxt prepare/build` padá na **SIGBUS** v natívnom
`@oxc-transform` napi binárne (pri dostatku RAM — nie je to OOM). Workaround (len v takom prostredí):
nainštaluj `@oxc-transform/binding-wasm32-wasi` a odstav natívne `@oxc-transform/binding-linux-x64-*`,
aby loader spadol na WASI. Na štandardnom hoste/CI build beží natívne bez zásahu. Build bol takto
overený (`npm run build` → `.output/`, „Build complete").
