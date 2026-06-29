# Nasadenie SLICKLY na HostCreators (slickly.sk)

Nové SLICKLY je **monorepo** (headless Shopware storefront). HostCreators „GIT aplikácia"
buduje a spúšťa z **koreňa repa**, preto je v koreni `package.json` s npm **workspaces**,
ktorý deleguje `build`/`start` na hlavnú appku `slickly-store/`.

```
repo-root/
├── package.json            # workspaces: [vue-starter-template, slickly-store]; build/start → slickly-store
├── vue-starter-template/   # Nuxt layer (Shopware Frontends starter)
├── slickly-store/          # hlavná Nuxt app → build do slickly-store/.output
└── shopware-plugins/       # backend PHP pluginy (nasadzujú sa na Shopware server, NIE sem)
```

## Princíp (rovnaký ako predtým)

HostCreators „GIT aplikácia" pri každom push-i na sledovaný branch:
1. naklonuje repo do nového `release_<timestamp>`,
2. spustí build krok (`npm install` + `npm run build`),
3. prepne `current` symlink.

Doména `slickly.sk` je **reverse proxy na bežiaci Node proces** → appka musí po builde bežať
ako server (Nitro `node-server` preset, `npm run build`), **nie** `nuxt generate` (statický
výstup = `502 Bad Gateway`).

## Nastavenia v paneli HostCreators

- **Build krok:** `npm run build`
  (root workspace → `npm install` nainštaluje obe workspace balíky, `build` spustí
  `nuxt prepare && nuxt build` v `slickly-store`; výstup `slickly-store/.output/`).
- **Start krok:** `npm run start`
  (root → `node .output/server/index.mjs` v `slickly-store`).
- **Premenné prostredia** — minimum pre beh za proxy:
  ```
  PORT=3000
  HOST=0.0.0.0
  ```
  Plus runtime premenné (pozri nižšie / `slickly-store/.env.example`).
- **Relatívna public cesta k webu:** nechať **prázdne** (proxy režim).

## Runtime premenné prostredia (pridať do panela)

Bez backendu sa nič nevyrenderuje (CMS-driven). Minimum:
```
NUXT_PUBLIC_SITE_URL=https://slickly.sk
NUXT_PUBLIC_SHOPWARE_ENDPOINT=https://<shopware>/store-api/
NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN=<store-api-access-key>
NUXT_PUBLIC_SW_ID_SALES_CHANNEL=<id>
NUXT_PUBLIC_SW_ID_ROOT_CATEGORY=<id>
```
Voliteľné podľa použitých funkcií (pozri `slickly-store/.env.example` — kompletný zoznam):
- Admin API: `SHOPWARE_ADMIN_ENDPOINT`, `SHOPWARE_ADMIN_CLIENT_ID`, `SHOPWARE_ADMIN_CLIENT_SECRET`
- AI chat: `ANTHROPIC_API_KEY` / `GEMINI_API_KEY`
- OAuth: `GOOGLE_CLIENT_ID/SECRET`, `FACEBOOK_APP_ID/SECRET`
- WebAuthn: `WEBAUTHN_RP_ID=slickly.sk`, `WEBAUTHN_RP_NAME=SLICKLY`, `OAUTH_ENCRYPTION_KEY`
- SMTP: `SMTP_*`; n8n: `N8N_WEBHOOK_URL`, `WEBHOOK_SECRET`
- **Redis je voliteľné** — bez `REDIS_URL`/`REDIS_SOCKET` appka spadne na filesystem cache
  (`.data/`), takže na shared hostingu beží aj bez Redisu.

> Pozn.: default dátový backend ostáva `mtsport.store` (športový katalóg). Pre reálnu SLICKLY
> prevádzku nastav `NUXT_PUBLIC_SHOPWARE_ENDPOINT`/`SHOPWARE_ADMIN_*` na vlastnú Shopware
> inštanciu s nainštalovanými `shopware-plugins/Mtsport*`.

## Po každom deployi

Build beží automaticky, ale **Node proces sa nemusí reštartovať**. Po „Aplikácia bola úspešne
aktualizovaná" klikni v „Viac o aplikácii" na **Spustiť aplikáciu** (reštart na nový `current`).

## Diagnostika

| Chyba | Príčina | Riešenie |
|---|---|---|
| `403 Forbidden` | chýba `start` skript / doc root bez bežiaceho procesu | build `npm run build`, start `npm run start` |
| `502 Bad Gateway` | proxy nemá kam smerovať — statický build alebo proces nebeží/zlý host | `npm run build` (nie generate), `PORT=3000 HOST=0.0.0.0`, „Spustiť aplikáciu" |
| build padá `Cannot find module .../workspace` | nekompletný workspace install | overiť root `package.json` workspaces, `npm install` v koreni |
| build padá `Bus error` / SIGBUS pri `nuxt prepare` | natívny `@oxc-transform` napi binárny nekompatibilný s CPU/libc hostingu | nainštaluj `@oxc-transform/binding-wasm32-wasi` a odstav `node_modules/@oxc-transform/binding-linux-x64-*` (loader spadne na WASI). Na štandardnom x64 hoste netreba. |
| starý obsah po deployi | proces nereštartovaný | „Spustiť aplikáciu" |

## Lokálny build/preview (rovnaké ako hosting)

```bash
npm install            # v koreni — nainštaluje workspaces
npm run build          # → slickly-store/.output
PORT=3000 HOST=0.0.0.0 npm run start
```
