# CLAUDE.md

Tento súbor poskytuje kontext pre Claude Code (claude.ai/code) pri práci s týmto repozitárom.

## PRAVIDLO: Dizajnový systém (DESIGN.md)

**STRIKTNE sa drž `DESIGN.md` pri každej zmene UI.** Pred akoukoľvek úpravou komponentu alebo
stránky si prečítaj `DESIGN.md` a použi VÝLUČNE tam definované tokeny:

- **Farby:** Len `@theme` tokeny (`bg-primary`, `text-on-surface-variant`, `bg-secondary-container`…).
  NIKDY nepoužívaj raw Tailwind farby (`bg-green-100`, `bg-blue-500`, `bg-white`, `text-red-800`…).
- **Typografia:** Len `font-*` a `text-*` tokeny z `@theme` (`font-headline-lg text-headline-lg`,
  `font-technical-data text-technical-data`…). Font Hanken Grotesk pre text, Geist pre technické dáta.
- **Shape:** `rounded-default` (6px) pre všetky CTA, inputy, karty. NIKDY `rounded-full` na tlačidlá.
- **Spacing:** Len `stack-xs/sm/md/lg`, `gutter`, `grid-margin`, `section-padding(-lg)`.
- **Tlačidlá:** Primárne = `bg-primary text-on-primary h-12 font-label-sm text-label-sm uppercase tracking-widest rounded-default`.
  Outline = `border border-outline-variant text-on-background h-12 rounded-default`.
  NIKDY pill-shaped.
- **Ikony:** Výlučne Material Symbols Outlined ligatures. NIKDY emoji, NIKDY SVG ikony.
- **Stav badge:** Amber `bg-secondary-container` pre akcie, `bg-primary` pre nové, `bg-error` pre vypredané.
- **Formuláre:** Input = `h-12 bg-surface-container-lowest border border-outline-variant rounded-default focus:ring-2 focus:ring-primary`.
  Label = `font-technical-data text-technical-data uppercase text-on-surface-variant`.
- **Status farby:** Použiť design system farby s opacity variantmi, nie raw Tailwind.
  Success = `bg-primary/10 text-primary`. Warning = `bg-secondary-container/20 text-on-secondary-container`.
  Error = `bg-error/10 text-error`. Info = `bg-primary/5 text-on-surface-variant`.

## Prehľad projektu

**SLICKLY** ("Umenie Čistoty") je **prémiový multi-brand marketplace** pre starostlivosť o auto
(keramická ochrana, detailing, autokozmetika). Ide o kurátorský výber najlepších svetových značiek
predávaných pod hlavičkou SLICKLY — **nie vlastná výroba ani vlastné formulácie**. Vlastný private
label je plánovaný do budúcna, ale aktuálne je SLICKLY výlučne multi-brand e-shop.

Frontend je postavený na **Nuxt 4**, dizajn vychádza z dizajnového systému **"Minimalist
Precision"**. Aplikácia je v slovenčine (`lang="sk"`).

Backendová architektúra je plánovaná rovnako ako pri projekte `mtstore-nuxt` — **headless
Shopware 6 (Store API)**. Aktuálne beží frontend nad mockovanými dátami (`app/data/products.ts`),
ktoré sú navrhnuté tak, aby sa dali priamo nahradiť volaniami Shopware Store API bez väčšieho
refaktoru komponentov.

## Príkazy

```bash
npm run dev       # spustí dev server (http://localhost:3000)
npm run build     # produkčný build (Nuxt Nitro)
npm run generate  # statická generácia (SSG)
npm run preview   # náhľad produkčného buildu
```

## Tech stack

- **Nuxt 4** (`app/` ako srcDir)
- **Vue 3** + `<script setup lang="ts">` všade
- **Tailwind CSS v4** cez `@tailwindcss/vite` — žiadny `tailwind.config.js`, všetky tokeny sú
  definované cez `@theme` v `app/assets/css/main.css`
- **Pinia** (`@pinia/nuxt`) — globálny stav (zatiaľ len košík)
- **Material Symbols Outlined** — ikony cez font ligatures (`<span class="material-symbols-outlined">name</span>`),
  načítané cez Google Fonts v `nuxt.config.ts`
- Fonty: **Hanken Grotesk** (text/nadpisy) + **Geist** (technické dáta, labely)

## Štruktúra projektu

```
app/
├── assets/css/main.css       # Tailwind v4 @theme — všetky design tokeny
├── components/
│   ├── layout/                # AppHeader, AppFooter, MobileBottomNav, TrustBadges
│   ├── home/                  # sekcie homepage (Hero, CategoryGrid, ...)
│   └── product/                # ProductCard a ďalšie produktové komponenty
├── data/products.ts           # mock dáta produktov a kategórií + helper funkcie
├── stores/cart.ts              # Pinia store pre košík (localStorage perzistencia)
├── layouts/default.vue
└── pages/
    ├── index.vue                       # Homepage
    ├── produkty/index.vue              # Listing s filtrami a triedením
    ├── produkty/[slug].vue             # Detail produktu
    ├── kosik.vue                       # Košík
    ├── pokladna.vue                    # Pokladňa (checkout)
    └── ucet.vue                        # Účet (placeholder)
```

## Dizajnový systém: Minimalist Precision

Všetky tokeny sú definované v `app/assets/css/main.css` v bloku `@theme` a používajú sa ako
Tailwind utility triedy (napr. `bg-primary`, `text-on-surface-variant`, `font-headline-lg`,
`text-headline-lg`, `gap-stack-md`, `rounded-default`).

### Farby

- **Primary**: čierna (`#000000`) — hlavné CTA, header na desktope, logo
- **Secondary container — "Slickly Amber"**: `#FFBF00` — akcenty, badge, highlight
- **Surface**: svetlé sivo-biele tóny (`surface`, `surface-container-*`) pre pozadia kariet/sekcií
- **Error**: `#BA1A1A` — stavy "Vypredané" a podobne
- Všetky farby majú `on-*` páry pre kontrastný text (Material You konvencia)

### Typografia

| Token | Veľkosť | Použitie |
|---|---|---|
| `display-lg` | 72px | veľké hero nadpisy (desktop) |
| `headline-xl` | 48px | hero / page nadpisy desktop |
| `headline-lg` | 32px | hlavné nadpisy stránok |
| `headline-md` | 24px | nadpisy sekcií |
| `headline-sm` | 20px | menšie nadpisy (karty, produkt v košíku) |
| `body-lg` / `body-md` | 18px / 16px | bežný text |
| `price-display` | 22px | ceny |
| `technical-data` | 12px | SKU, štítky, technické info (font Geist) |
| `label-sm` | 11px | uppercase tlačidlá/labely, tracking-widest |
| `badge-label` | 11px | badge na produktoch |

`headline-xl`, `headline-sm`, `body-lg`, `label-sm`, `display-lg`, `section-padding-lg` a
`grid-margin` sú rozšírenia nad rámec pôvodného `.md` špecifika — pridané pre desktopovú škálu
asymetrického gridu.

### Spacing & shape

- `stack-xs/sm/md/lg` (4/8/16/24px) pre väčšinu medzier
- `gutter` (20px) — mobilný horizontálny padding
- `grid-margin` (24px) — desktopový horizontálny padding/max-width kontajner
- `section-padding` / `section-padding-lg` (64px / 120px) — vertikálne medzery sekcií na desktope
- `radius-*` — zaoblenia (`rounded-default` zodpovedá `radius-md`/`radius-lg` podľa kontextu)

### Responzívne komponenty

Každý komponent kombinuje desktopový asymetrický grid layout a mobilný layout **v jednom Vue
súbore** pomocou Tailwind `md:` variantov — žiadne oddelené desktop/mobile stránky ani
komponenty. Mobile-first prístup: základné triedy = mobil, `md:` = desktop (≥768px).

## Stav košíka (`app/stores/cart.ts`)

`useCartStore` (Pinia) drží `items: CartLineItem[]` s tvarom:

```ts
interface CartLineItem {
  productId: string
  slug: string
  name: string
  price: number
  image: string
  sku: string
  quantity: number
}
```

- Perzistuje sa do `localStorage` (`slickly-cart`), hydratuje sa v `layouts/default.vue` cez
  `cart.hydrate()` po mounte (client-only).
- Gettery: `itemCount`, `subtotal`.
- Akcie: `addItem`, `updateQuantity`, `removeItem`, `clear`.

Tento tvar je zámerne blízky Shopware Store API `cart.lineItems` (id produktu, množstvo,
jednotková cena), aby sa pri napojení na backend dal store rozšíriť/nahradiť bez zmeny
komponentov, ktoré ho používajú (`ProductCard`, `produkty/[slug].vue`, `kosik.vue`,
`pokladna.vue`, `AppHeader.vue`).

## Plán integrácie Shopware (headless backend)

Backend bude **Shopware 6** cez **Store API** (rovnaký prístup ako `mtstore-nuxt`). Pri napájaní
backendu:

1. **Konfigurácia** — pridať do `nuxt.config.ts` (`runtimeConfig`):
   - `SHOPWARE_API_URL` — URL Store API (napr. `https://shop.example.com/store-api`)
   - `SHOPWARE_ACCESS_KEY` — `sw-access-key` hlavička pre Store API
2. **Composables** (`app/composables/`) — tenká vrstva nad `$fetch`/`useFetch` so Store API:
   - `useShopwareProducts()` — listing/detail produktov, filtrovanie, vyhľadávanie
     (nahradí `getProductsByCategory`, `getProductBySlug`, `getRelatedProducts` z `data/products.ts`)
   - `useShopwareCart()` — `POST /checkout/cart`, `PATCH` line items — nahradí lokálne akcie
     v `stores/cart.ts`, pričom `contextToken` sa bude perzistovať namiesto/popri `slickly-cart`
   - `useShopwareCategories()` — náhrada za `categories` z `data/products.ts`
   - `useShopwareCheckout()` — `/checkout/order` flow pre `pokladna.vue`
3. **Mapovanie dát** — Shopware `Product`/`media`/`price` objekty sa namapujú na existujúce
   TS rozhrania `Product`/`Category` v `data/products.ts` (alebo tieto rozhrania presunúť do
   `app/types/` a zdieľať medzi mock a Shopware vrstvou), aby komponenty (`ProductCard`,
   produktové stránky) nevyžadovali zmeny.
4. **SSR** — produktové a kategóriové stránky (`pages/produkty/**`) prejdú na `useAsyncData`/
   `useFetch` so Store API namiesto synchrónneho čítania z `data/products.ts`.
5. **Auth/účet** — `pages/ucet.vue` (zatiaľ placeholder) sa napojí na Shopware `/account/login`,
   `/account/register`, `/account/order` endpointy.

Do napojenia backendu zostáva `app/data/products.ts` jediným zdrojom pravdy pre produkty a
kategórie — pri zmenách produktového katalógu (nové produkty, kategórie, obrázky) upravujte
tento súbor.
