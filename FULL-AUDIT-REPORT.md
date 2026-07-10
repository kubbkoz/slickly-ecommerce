# SLICKLY (slickly.sk) — Full SEO Audit Report

**Dátum:** 2026-07-10
**Metóda:** Code-based audit (statická analýza zdrojového kódu Nuxt aplikácie `slickly-store/`).
**Dôležité obmedzenie:** Živý prístup na `slickly.sk` nebol z tohto prostredia možný (sieťová
politika blokuje outbound pripojenie na doménu — nejde o výpadok stránky). Tento audit preto
**neobsahuje**: live crawl, Lighthouse/Core Web Vitals merania, screenshoty, PageSpeed Insights,
Google Search Console/GA4 dáta, backlink profil, ani DataForSEO/SERP dáta. Všetky nálezy nižšie
sú overené priamo v zdrojovom kóde (citované súbory a riadky), nie odhadnuté.

---

## Executive Summary

### SEO Health Score: **51 / 100** (čiastočný — Performance nehodnotená)

Skóre je vážený súčet cez kategórie, ktoré sa dajú overiť zo zdrojového kódu (90 % z celkovej
váhy). **Performance (10 % váhy) nie je zahrnutá** — bez živého merania by akékoľvek číslo bolo
hádanie, nie audit.

| Kategória | Váha | Skóre | Príspevok |
|---|---|---|---|
| Technical SEO | 22% | 65/100 | 14.3 |
| Content Quality | 23% | 40/100 | 9.2 |
| On-Page SEO | 20% | 55/100 | 11.0 |
| Schema / Structured Data | 10% | 45/100 | 4.5 |
| AI Search Readiness (GEO) | 10% | 35/100 | 3.5 |
| Images | 5% | 70/100 | 3.5 |
| **Performance** | 10% | **nehodnotené** | — |
| **Súčet (z 90 % váhy)** | | | **46.0 / 90 → 51/100** |

### Business type detected
E-commerce, headless Shopware storefront. **Dôležité:** kód a najmä SEO/AI vrstva obsahuje
**dva nekonzistentné biznis popisy súčasne** — pozri kritické zistenie #1 nižšie.

### Top 5 kritických/vysokopriorných zistení
1. **`llms.txt` aj časť JSON-LD schém opisujú starý biznis (bicykle), nie skutočný sortiment
   (starostlivosť o auto/detailing).** Najzávažnejšie zistenie celého auditu — pozri sekciu
   "Kritické zistenie" nižšie.
2. Produktové varianty (farba/veľkosť) sa **self-canonicalizujú** namiesto canonicalu na master
   produkt — riziko duplicitného obsahu.
3. `/search` stránka je indexovateľná a je v sitemape, bez `noindex` — riziko thin/duplicitného
   obsahu z nekonečných query kombinácií.
4. Sitemap **chýba blog a brand (`znacka/*`) stránky**, nemá locale varianty, nie je chunkovaná
   pre veľký katalóg.
5. Meta description na PDP aj blogu padá na **prázdny string** namiesto `undefined`, keď CMS pole
   chýba — horšie ako žiadny tag.

### Top 5 quick wins
1. Prepísať `public/llms.txt` na reálny sortiment (car care/detailing) — priamy textový súbor,
   najrýchlejšia oprava s najväčším dopadom na AI-readiness.
2. `useLocalBusinessJsonLD.ts:20` description → car-care text (jeden riadok).
3. `ReviewsWall.vue:44` `@type: 'BikeStore'` → `'Store'` alebo `'AutoPartsStore'` (jeden riadok).
4. `FrontendDetailPage.vue:408` title suffix `"MT Sport"` → `"SLICKLY"` (jeden riadok).
5. Zjednotiť `mtsport.store` fallbacky na `slickly.sk` naprieč `useOrganizationJsonLD.ts`,
   `index.vue`, `search.vue`, `FrontendDetailPage.vue`.

---

## Kritické zistenie: SEO/AI vrstva stále opisuje starý biznis (bicykle)

Rebranding MTSPORT → SLICKLY (bicykle → starostlivosť o auto) bol dokončený **vizuálne**
(navbar kategórie Exteriér/Interiér/Leštenie/Ochrana karosérie/Príslušenstvo, farby, fonty),
ale **vôbec nie v SEO-kritických a AI-facing vrstvách**, ktoré Google a AI vyhľadávače (ChatGPT,
Perplexity, Google AI Overviews) používajú ako hlavný signál na určenie, čím firma je.

**Nálezy (citované priamo zo zdrojového kódu):**

- **`slickly-store/public/llms.txt`** (celý súbor, 36 riadkov) — opisuje "**prémiový
  cyklistický e-shop**", predáva bicykle/e-biky/cyklistické oblečenie, značky **Scott, Kellys,
  Kands, Trek, Giant, Specialized, Shimano, SRAM**, kategórie `/bicykle`, `/elektrobicykle`,
  `/doplnky`, `/komponenty`, `/oblecenie`. Toto je presný opak reálneho sortimentu.
- **`app/composables/useLocalBusinessJsonLD.ts:20`** — JSON-LD `description`, ktoré Google
  priamo číta:
  ```js
  description:
    'SLICKLY je výhradne online obchod — bicykle, elektrobicykle, doplnky a komponenty s doručením...'
  ```
- **`app/components/home/ReviewsWall.vue:44`** — AggregateRating schéma má `'@type': 'BikeStore'`
  namiesto niečoho ako `'AutoPartsStore'`/`'Store'`.
- **`app/components/FrontendDetailPage.vue:408`** — title každej produktovej stránky:
  `` `${_seoName.value} | MT Sport}` `` — hardcoded stará brand suffix namiesto `SLICKLY`.
- **`app/composables/useOrganizationJsonLD.ts:29-30`** — `sameAs` (sociálne siete v JSON-LD):
  ```js
  sameAs: [
      'https://www.facebook.com/mtsport.store',
      'https://www.instagram.com/mtsport.store',
  ],
  ```
  V celom repe sa nenašiel žiadny reálny SLICKLY Facebook/Instagram odkaz ako náhrada
  (`Footer.vue` neobsahuje žiadne social linky vôbec).
- Nekonzistentné `mtsport.store` fallback URL (namiesto `slickly.sk`):
  `useOrganizationJsonLD.ts:4`, `index.vue:35` (OG URL), `search.vue:76`,
  `FrontendDetailPage.vue:399`. Iné composables (`useLocalBusinessJsonLD.ts:9`) už správne
  fallbackujú na `slickly.sk` — nekonzistentnosť medzi súbormi.

**Prečo je to kritické:** štruktúrované dáta a `llms.txt` sú priamy vstup pre topical-relevance
signály. Ak tieto vrstvy tvrdia "bicykle" a skutočný sortiment je "starostlivosť o auto", vzniká
zásadný konflikt presne pre kľúčové slová, na ktoré má SLICKLY reálne rankovať (detailing,
ochrana karosérie, leštenie...). AI vyhľadávače (ktoré `robots.txt` explicitne pozýva — pozri
nižšie) môžu customerom aktívne prezentovať SLICKLY ako cyklistický obchod.

---

## Technical SEO (skóre: 65/100)

### Funguje dobre
- **Hreflang/canonical pre 6 jazykov** (`sk` default, `cz/pl/en/de/hu` s prefixom) cez
  `useLocaleHead({ seo: true })` v `app/layouts/default.vue:13-21` — generuje hreflang alternates,
  canonical link aj `og:locale` pre každú stránku automaticky.
- `i18n.detectBrowserLanguage: false` (`nuxt.config.ts:62`) — vyhýba sa automatickým
  redirect-loop/cloaking problémom.
- **`robots.txt` je veľmi dobrý** — pozri AI Search Readiness sekciu.
- Sitemap (`server/routes/sitemap.xml.ts`) je funkčná, cachovaná (`swr: 3600`), s error
  handlingom (graceful degradácia na 2 statické URL pri zlyhaní Shopware API).

### Problémy
- **Sitemap nezahŕňa blog stránky** (`/blog/*`) ani brand stránky (`/znacka/*`) — len
  `frontend.detail.page` (produkty), `frontend.navigation.page` (kategórie),
  `frontend.landing.page`. Blog má vlastnú produkčnú architektúru (Redis cache, Shopware
  plugin) ale nie je v sitemape vôbec.
- **Žiadne locale varianty v sitemape** — jeden `baseUrl`, žiadne `hreflang` alternates per URL
  ani per-locale URL varianty pre CZ/PL/EN/DE/HU.
- **Žiadne chunkovanie sitemapy** — všetko sa vypisuje do jedného `<urlset>` (vlastný komentár
  v kóde spomína "max 2000 URL per request", ale výstup sa nechunkuje na `sitemap-1.xml` atď.).
  Pri väčšom katalógu riziko prekročenia 50 000 URL/50 MB limitu sitemaps.org.
- **`/search` je indexovateľná** — nie je v `robots.txt` disallow, je v sitemape
  (`priority 0.5`), a `search.vue` nemá žiadny `robots: noindex` meta tag. Canonical sa
  generuje per-query-term (`?search=<term>`), čo znamená, že každý unikátny vyhľadávací dotaz
  môže byť indexovaný ako samostatná URL.
- **Produktové varianty sa self-canonicalizujú.** `FrontendDetailPage.vue` — keď je vo URL
  `?variant=<id>`, canonical sa počíta z **vlastnej** `seoUrls[0].seoPathInfo` variantu, nie
  z master produktu (rodičovský produkt sa fetchuje len pre `configuratorSettings` UI, jeho
  SEO URL sa na canonicalizáciu nepoužíva). Riziko duplicitného obsahu naprieč farbami/veľkosťami
  toho istého produktu.
- Kategórie s aktívnymi filtrami správne dostávajú `noindex,follow`
  (`FrontendNavigationPage.vue:182`) — dobré riešenie, hoci bez canonical konsolidácie
  (spolieha sa čisto na noindex).

---

## Content Quality (skóre: 40/100)

Nízke skóre je priamo dôsledkom brand-mismatch problému vyššie (Content Quality kategória váži
najviac zo všetkých — 23% — a práve sem najviac zasahuje "opisuje nesprávny biznis").

- Meta description na PDP (`FrontendDetailPage.vue:397`) aj blogu
  (`features/blog/pages/blog/[slug].vue:20`) padá na **prázdny string** (`''`), keď CMS pole
  chýba, namiesto `undefined` (čo by tag úplne vynechalo). Prázdny `<meta name="description"
  content="">` je pre SEO horší než žiadny tag.
- **DE/HU lokalizácia** — ~16 bežne zobrazovaných mikro-textov (nav labely, "Skladom", "Kúpiť
  ihneď"...) je byte-identických s anglickou verziou (nepreložené), zvyšok (SEO meta, chat,
  cart, footer) je preložený poriadne, prirodzeným jazykom. Zmiešaný jazyk na stránke môže
  pôsobiť ako slabší kvalitatívny signál pre AI aj používateľov.
- Krátky popis produktu (`ProductInfo.vue:134`, `plainTextExcerpt(description, 0)`) **nie je
  orezaný** (parameter `0` = bez truncation) — plný text je v DOM, len vizuálne cappovaný
  `line-clamp-3` + "Čítať viac". Nie je to skutočný thin-content problém, ako by sa dalo čakať.
- `DescriptionTab.vue` má bohatú viacsekčnú štruktúru (feature highlight, grid callouts, video,
  "kľúčové komponenty") — ale všetky sekcie závisia od custom Shopware polí
  (`mts_feat_title`, `mts_grid1-4_*`...) a tíchо zmiznú, ak merchandiser polia nevyplní. Reálna
  hĺbka obsahu teda závisí od disciplíny pri zadávaní dát do administrácie, nie od šablóny.
- `GeometryTab.vue` (geometria rámu bicykla) má **hardcoded mock dáta** — pravdepodobne mŕtvy
  kód po rebrande na car-care sortiment (bicyklová geometria nedáva zmysel pre produkty ako
  leštenie/ochrana karosérie).
- Blog (`features/blog/`) má reálnu produkčnú architektúru (Shopware plugin, Redis cache 30 min
  TTL, Nitro proxy layer) — nie je to stub. Vlastný README má TODO zoznam (paginácia nad 50
  položiek, RSS feed, viacjazyčný cache-key) — škálovacie funkcie ešte chýbajú.

---

## On-Page SEO (skóre: 55/100)

| Stránka | Title | Description | Poznámka |
|---|---|---|---|
| Homepage | statický i18n kľúč | statický i18n kľúč | OG URL hardcoded `mtsport.store` (`index.vue:35`) |
| Produkt (PDP) | dynamický názov + **"MT Sport" suffix** | dynamický, fallback `''` | brand-leak v suffixe |
| Kategória | dynamický + `SLICKLY` suffix (správne) | dynamický, 2-level fallback → `undefined` (správne) | najlepšie implementovaná stránka |
| Blog post | dynamický + generický fallback | dynamický, fallback `''` | rovnaký prázdny-string problém ako PDP |
| Vyhľadávanie | dynamický podľa query | dynamický, vždy vyplnený | žiadny empty-fallback problém |

- **URL štruktúra je veľmi dobrá** (`app/utils/url.ts`) — prioritne slug-based
  (`/produkt-nazov/SKU`, `/kategoria-slug`), s vrstveným fallbackom na Shopware `seoUrl`, potom
  `slugify(name)`, a až nakoniec technický ID-based fallback (`/detail/{uuid}`,
  `/navigation/{uuid}`) len keď Shopware nemá vygenerovanú SEO URL.
- **H1 štruktúra** — homepage má presne jeden (vizuálne skrytý `sr-only`) h1. Kategórie majú
  presne jeden. Produktová stránka má **technicky dva `<h1>` v DOM súčasne** (jeden pre mobil
  v `ProductDetail.vue:528`, jeden pre desktop v `ProductInfo.vue:211`, oba renderujú rovnaký
  text, viditeľnosť riešená cez CSS breakpoint triedy namiesto `v-if`) — nízke riziko (rovnaký
  text), ale sémanticky nie ideálne.
- `rel="prev"` na `search.vue:86` má drobný bug (vždy odkazuje na stránku 1 bez ohľadu na
  aktuálnu stránku, chýba `rel="next"`) — mimo hlavný scope, ale spomenuté pre úplnosť.

---

## Schema & Structured Data (skóre: 45/100)

Architektonicky je pokrytie **veľmi solídne** — problém nie je chýbajúca schéma, ale nesprávny
**obsah** v nej.

**Implementované typy** (všetky nájdené a overené v kóde):

| Composable/komponent | `@type` | Použité na |
|---|---|---|
| `useOrganizationJsonLD.ts` | `Organization` + `WebSite` (+ `SearchAction`) | Homepage |
| `useLocalBusinessJsonLD.ts` | `["OnlineStore","Organization"]` | Homepage |
| `useProductJsonLD.ts` | `Product` (+`Offer`, `AggregateRating`, `ProductGroup`) + `BreadcrumbList` + `FAQPage` | Produktová stránka |
| `useCategoryBreadcrumbJsonLD.ts` | `BreadcrumbList` (+ `CollectionPage`) | Kategórie |
| `useBlogPostingJsonLD.ts` | `BlogPosting` | Blog post |
| `ReviewsWall.vue` (inline) | `BikeStore` + `AggregateRating` | Homepage |
| `BlogGrid.vue` (inline) | `FAQPage` | Homepage |

- `useLocalBusinessJsonLD.ts` má explicitný komentár vysvetľujúci prečo **nemá** `address`/
  `geo`/`openingHours` — SLICKLY je výhradne online, žiadna kamenná predajňa. Toto je správne
  a zámerné, nie chyba.
- `foundingDate: '2010'` v `useLocalBusinessJsonLD.ts:50` — **neoveriteľné zo zdroja**, možno
  zdedená MTSPORT hodnota. Treba potvrdiť s majiteľom biznisu.
- **Žiadna validácia štruktúrovaných dát** v repe (žiadne testy, žiadny debug endpoint na
  JSON-LD — `server/api/debug/` má len Shopware/Admin API diagnostiku).
- Product schema (`useProductJsonLD.ts`) samotné je správne obrandované (`seller.name: 'SLICKLY'`
  hardcoded správne) — brand-leak problém je špecificky v `LocalBusiness`/`ReviewsWall`/page-title
  vrstvách, nie v Product schéme.

---

## Performance — NEHODNOTENÉ

Žiadne live CWV/Lighthouse/PageSpeed dáta nie sú z tohto prostredia dostupné. Kvalitatívna
poznámka: táto session (pred týmto auditom) už riešila konkrétny perf debt — LCP hero fix
(orezanie preloadu na 1 slide, `@nuxt/image` namiesto plného originálu), lazy hydratácia
homepage sekcií (`hydrate-on-visible`), orezanie SSR payloadu (zbytočné asociácie v product
listing fetchoch). Toto je pozitívny signál, ale bez reálnych čísel ho nemožno skórovať —
odporúčam re-run tohto auditu (alebo aspoň Performance sekcie) z prostredia so živým prístupom,
prípadne dodať PageSpeed Insights/GSC export manuálne.

---

## Images (skóre: 70/100)

- `@nuxt/image` konfigurácia (`nuxt.config.ts:174-192`) — `format: ['webp','avif']`,
  `quality: 78`, `densities: [1,2]`, definované `screens` breakpointy — v poriadku, výsledok
  predošlého perf auditu (komentár `// Tuning (audit P1 #8)` v kóde).
- **Väčšina produktových obrázkov má dobrý, dynamický alt text** — konzistentný vzor naprieč
  `ProductCard.vue`, `ProductGallery.vue`, `ProductInfo.vue`, search komponentmi, blog kartami:
  `${product.name} - foto N`, `${product.name} logo`, atď.
- Slabšie miesta:
  - `MegaMenu.vue:161` a `search.vue:453` — `alt=""` na reálnom obsahovom obrázku (nie
    dekoratívnom) — zmeškaná príležitosť.
  - `GeometryTab.vue:122`, `SizeChartModal.vue:98` — statický `alt="Geometry Diagram"` —
    generický, nelokalizovaný.
  - `AccountTabProfil.vue:24`, `account.vue:213` — generický `alt="avatar"`.
- Známy neistý limit (zdokumentovaný priamo v kóde, `useAutoTrimImage.ts:1-9`): custom
  "shopware" `@nuxt/image` provider (z `@shopware/cms-base-layer`) posiela na media CDN len
  `width/height/quality/format/fit` ako query parametre — **nedá sa z tohto repa overiť**, či
  ich Shopware backend (`admin.slickly.sk`) reálne aplikuje na strane servera.

---

## AI Search Readiness / GEO (skóre: 35/100)

- **`robots.txt` je veľmi dobrý** — explicitný `Allow: /` pre GPTBot, ChatGPT-User,
  PerplexityBot, Claude-Web, anthropic-ai, CCBot, cohere-ai, Applebot, Amazonbot. Chýba
  explicitná zmienka o `Google-Extended` a modernom `ClaudeBot` tokene (obe by aj tak prešli
  cez wildcard `User-agent: * / Allow: /`, ale nie sú explicitne pomenované ako ostatné).
  Netradičný `Sitemap: .../llms.txt` riadok (llms.txt nie je sitemap formát, ale neškodné ako
  discovery hint).
- **`llms.txt` — kritický problém, pozri sekciu vyššie.** Toto je najsilnejší jednotlivý signál
  pre AI-crawler pochopenie biznisu a je úplne nesprávny.
- **FAQPage schéma existuje** na produktových stránkach (`useProductJsonLD.ts`, cez
  `mts_faq_q1..q5`/`mts_faq_a1..q5` custom polia) — dobré pre citability, podmienené vyplnením
  polí v administrácii.
- `SpecsTab.vue` (spec tabuľka) a `GeometryTab.vue` dávajú štruktúrované, citovateľné dáta —
  ale `GeometryTab` je pravdepodobne irelevantný pozostatok po zmene sortimentu (pozri Content
  Quality).
- `ProductQA.vue` je živý AI chat widget (otázky na produkt cez `/api/claude/product-qa`) —
  užitočný pre UX, ale **nulová hodnota pre AI-crawler citability**, keďže odpovede vznikajú
  live v prehliadači, nie sú súčasťou server-renderovaného HTML.

---

## Zdrojové súbory citované v tomto audite (pre referenciu)
`slickly-store/nuxt.config.ts`, `slickly-store/server/routes/sitemap.xml.ts`,
`slickly-store/public/robots.txt`, `slickly-store/public/llms.txt`,
`slickly-store/app/layouts/default.vue`, `slickly-store/app/components/FrontendDetailPage.vue`,
`slickly-store/app/pages/search.vue`,
`slickly-store/app/components/frontend/navigation/FrontendNavigationPage.vue`,
`slickly-store/app/utils/url.ts`, `slickly-store/app/composables/useOrganizationJsonLD.ts`,
`slickly-store/app/composables/useLocalBusinessJsonLD.ts`,
`slickly-store/app/composables/useProductJsonLD.ts`,
`slickly-store/app/composables/useCategoryBreadcrumbJsonLD.ts`,
`slickly-store/app/composables/useBlogPostingJsonLD.ts`,
`slickly-store/app/components/home/ReviewsWall.vue`,
`slickly-store/app/components/product/tabs/{SpecsTab,GeometryTab,DescriptionTab,ReviewsTab}.vue`,
`slickly-store/app/components/product/ProductQA.vue`, `slickly-store/app/locales/*.ts`,
`slickly-store/app/utils/format.ts`, `slickly-store/app/composables/useAutoTrimImage.ts`,
`slickly-store/features/blog/README.md`.

Pozri `ACTION-PLAN.md` pre prioritizovaný zoznam opráv.
