# SLICKLY SEO Action Plan

Prioritizované podľa dopadu. Viď `FULL-AUDIT-REPORT.md` pre plný kontext a citácie zdroja.
Effort odhady sú orientačné (mimo tohto repa neviem overiť live dopad).

---

## Critical (fix ihneď — brand/topical-relevance mismatch)

Všetky nižšie súvisia s tým istým koreňovým problémom: SEO/AI vrstva stále opisuje starý biznis
(bicykle) namiesto reálneho sortimentu (starostlivosť o auto/detailing).

1. **Prepísať `slickly-store/public/llms.txt`** na reálny sortiment — kategórie Exteriér/
   Interiér/Leštenie/Ochrana karosérie/Príslušenstvo/Špeciálna ponuka, reálne značky ktoré
   SLICKLY predáva (nie Scott/Trek/Shimano), odstrániť "AI konfigurátor" sekciu ak
   `/konfigurator` už nedáva zmysel pre car-care sortiment (over s používateľom).
   *Effort: nízky (textový súbor). Dopad: najvyšší — hlavný AI-crawler signál.*

2. **`useLocalBusinessJsonLD.ts:20`** — `description` → nahradiť car-care textom (napr.
   "SLICKLY je výhradne online obchod — starostlivosť o auto, detailing, ochrana karosérie a
   príslušenstvo s doručením po celom Slovensku a do okolitých krajín.").
   *Effort: triviálny (1 riadok).*

3. **`ReviewsWall.vue:44`** — `'@type': 'BikeStore'` → `'Store'` (bezpečná generická voľba) alebo
   overiť `'AutoPartsStore'` ako presnejší schema.org typ.
   *Effort: triviálny (1 riadok).*

4. **`FrontendDetailPage.vue:408`** — title suffix `"MT Sport"` → `"SLICKLY"`.
   *Effort: triviálny (1 riadok).*

5. **`useOrganizationJsonLD.ts:29-30`** — `sameAs` sociálne linky. Buď nahradiť reálnymi SLICKLY
   Facebook/Instagram URL (potrebné od používateľa), alebo pole úplne odstrániť, kým reálne
   účty nebudú existovať — **nikdy nenechávať odkazovať na cudzí/starý brand v štruktúrovaných
   dátach**.
   *Effort: triviálny, ale vyžaduje vstup od používateľa (reálne social URL).*

6. **Zjednotiť `mtsport.store` → `slickly.sk` fallbacky**: `useOrganizationJsonLD.ts:4`,
   `index.vue:35` (OG URL), `search.vue:76`, `FrontendDetailPage.vue:399`.
   *Effort: nízky (4 miesta, rovnaký vzor).*

---

## High (do 1 týždňa — indexačné/duplicate-content riziko)

7. **Produktové varianty — self-canonicalizácia.** `FrontendDetailPage.vue` — keď je
   `?variant=<id>` vo URL, canonical by mal ukazovať na master produkt (alebo aspoň na jeden
   konzistentný "hlavný" variant), nie na vlastnú SEO URL toho variantu. Vyžaduje pozrieť, ako
   sa dá získať parent produktovej SEO URL (parent sa už fetchuje pre `configuratorSettings`).

8. **`/search` — pridať `robots: noindex, follow`** (rovnaký vzor už použitý pre filtrované
   kategórie v `FrontendNavigationPage.vue:182`) a zvážiť vyňatie z `sitemap.xml.ts`. Query-driven
   výsledky vyhľadávania nie sú vhodné na indexáciu.

9. **Sitemap — pridať blog a brand stránky.** `server/routes/sitemap.xml.ts` momentálne fetchuje
   len `frontend.detail.page`/`frontend.navigation.page`/`frontend.landing.page` zo Shopware
   `seo-url` API. Blog (`/blog/*`, cez `server/api/blog/listing.get.ts`) a brand stránky
   (`/znacka/[slug]`) chýbajú úplne.

10. **Sitemap — chunkovanie pre veľký katalóg.** Aktuálne jeden `<urlset>` bez limitu. Pridať
    sitemap index (`sitemap-index.xml` → `sitemap-1.xml`, `sitemap-2.xml`...) pred prekročením
    50 000 URL / 50 MB.

---

## Medium (do 1 mesiaca)

11. **Meta description — opraviť prázdny-string fallback** na `undefined` namiesto `''`:
    `FrontendDetailPage.vue:397` (PDP), `features/blog/pages/blog/[slug].vue:20` (blog).

12. **DE/HU lokalizácia** — doplniť chýbajúci preklad ~16 top-level kľúčov v `de-DE.ts`/
    `hu-HU.ts` (momentálne byte-identické s `en-GB.ts`): `home`, `kontakty`,
    `vsetko_o_nakupe`, `o_nas`, `magazin`, `otvaracie_hodiny`, `zobrazit_vsetko`,
    `prihlasit`, `pridat_do_kosika`, `kupit_ihned`, atď.

13. **`GeometryTab.vue`** — over, či je táto komponenta (geometria rámu bicykla) ešte niekde
    reálne použitá pre car-care sortiment. Ak nie, odstrániť ako mŕtvy kód po rebrande (má
    hardcoded mock dáta, ktoré by pri omylom zobrazenom použití zavádzali zákazníkov).

14. **Sitemap — pridať hreflang alternates per URL** pre 6 jazykov (momentálne len jeden
    `baseUrl`, žiadne `<xhtml:link rel="alternate">` elementy).

---

## Low (backlog)

15. Alt text — opraviť generický/prázdny alt na reálnom obsahu: `MegaMenu.vue:161`,
    `search.vue:453` (prázdny `alt=""` na obsahových obrázkoch), `GeometryTab.vue:122`/
    `SizeChartModal.vue:98` (`alt="Geometry Diagram"` — generický, nelokalizovaný, plus viď #13),
    `AccountTabProfil.vue:24`/`account.vue:213` (`alt="avatar"` — generický).

16. **Dva `<h1>` na produktovej stránke** (`ProductDetail.vue:528` mobil,
    `ProductInfo.vue:211` desktop, rovnaký text, len CSS-skryté podľa breakpointu) — zvážiť
    `v-if` namiesto CSS viditeľnosti pre čistejšiu sémantiku (nízke riziko, oba majú rovnaký
    text).

17. `search.vue:86` — `rel="prev"` vždy odkazuje na stránku 1 bez ohľadu na aktuálnu stránku;
    chýba `rel="next"`. Drobný bug, nízky SEO dopad.

18. **`robots.txt`** — zvážiť pridať explicitný `Google-Extended` a `ClaudeBot` riadok (aj keď
    už prechádzajú cez wildcard `Allow: /`, explicitné pomenovanie je jasnejší signál).

19. **`useLocalBusinessJsonLD.ts:50`** — `foundingDate: '2010'` — potvrdiť s používateľom, či je
    to reálny SLICKLY dátum, alebo zdedená MTSPORT hodnota.

---

## Mimo tohto action planu (vyžaduje live prístup, nie kód)

- **Performance/CWV** — spustiť PageSpeed Insights/Lighthouse na `slickly.sk` a doplniť do
  reportu (tento audit ich nemohol zmerať zo sandboxu bez sieťového prístupu).
- **Google Search Console** — over indexačný status stránok, najmä po oprave canonical/noindex
  problémov vyššie (#7, #8).
- **Overiť Shopware media backend** — či `admin.slickly.sk` reálne aplikuje `width/height/
  quality/format` query parametre, ktoré `@nuxt/image`-ov custom "shopware" provider posiela
  (zdokumentovaná neistota, pozri `useAutoTrimImage.ts` komentáre).
