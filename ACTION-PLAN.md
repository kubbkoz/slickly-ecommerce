# SEO Action Plan — SLICKLY (Umenie Čistoty)

Derived from `FULL-AUDIT-REPORT.md`. Scope: local dev build (`http://127.0.0.1:3000`) — production
domain `slickly.sk` was unreachable during this audit (network allowlist), so indexation/CrUX/
backlink-driven priorities are not represented here.

---

## 🔴 Critical — fix immediately

1. **Fix duplicate `<h1>` on homepage**
   - File: `app/components/home/HeroBanner.vue`
   - Issue: mobile (`md:hidden`) and desktop (`hidden md:block`) hero blocks each contain an `<h1>`, both rendered in SSR HTML simultaneously.
   - Fix: keep one true `<h1>` (recommend the desktop "ŠPECIÁLNA ZĽAVA -20%" or the mobile headline — pick the primary keyword target), demote the other to `<p>` with equivalent styling.

2. **Add sitewide `Organization` + `WebSite` JSON-LD**
   - File: `app/layouts/default.vue` or `app/app.vue`
   - Add `useSchemaOrg()`/raw `<script type="application/ld+json">` via `useHead` with brand name, logo, URL, `sameAs` (social profiles), and `WebSite.potentialAction: SearchAction` pointing at `/produkty?q={search_term_string}`.

3. **Add `Product` + `Offer` + `AggregateRating`/`Review` JSON-LD**
   - File: `app/pages/produkty/[slug].vue`
   - Serialize `product.price`, `product.sku`, availability, and `product.reviews[]` (already shaped as `{rating, author, date, text}`) into schema.

4. **Replace `lh3.googleusercontent.com` hotlinked images (25 references)**
   - Files: `app/data/products.ts` (23), `app/components/home/HeroBanner.vue` (1), `app/components/home/CleanlinessSection.vue` (1)
   - Download and host these assets under `public/images/` (or a proper asset pipeline/CDN), update references. Removes a single point of failure and unlocks `loading="lazy"`/`srcset`/format optimization.

5. **Create `sitemap.xml` and reference it from `robots.txt`**
   - Install `@nuxtjs/sitemap`, configure dynamic product (`/produkty/[slug]`) and category routes.
   - Add `Sitemap: https://slickly.sk/sitemap.xml` to `public/robots.txt`.

---

## 🟠 High — fix within 1 week

6. **Add canonical tags to every page**
   - Add `<link rel="canonical">` via `useHead`/`useSeoMeta` on all 7 page types.
   - For `/produkty`, canonicalize filtered variants (`?kategoria=`, `?akcia=1`) — either to the base `/produkty` URL or to dedicated category routes (see #9).

7. **Differentiate `/produkty` filtered listing metadata**
   - Files: `app/pages/produkty/index.vue`
   - Generate dynamic `<title>`/meta description per `kategoria`/`akcia` query param (e.g. "Karoséria | Detailing produkty | SLICKLY") to remove duplicate-content signal flagged in the audit.

8. **Add Open Graph + Twitter Card tags sitewide**
   - Extend `useSeoMeta()` calls on all pages with `ogTitle`, `ogDescription`, `ogImage`, `ogType`, `twitterCard`. Use product image for product pages, a default brand image elsewhere.

9. **Add `BreadcrumbList` schema + visible breadcrumb UI**
   - Files: `app/pages/produkty/[slug].vue`, `app/pages/produkty/index.vue`
   - Pair visible breadcrumb nav (Domov > Produkty > {Category} > {Product}) with matching `BreadcrumbList` JSON-LD.

10. **Add security response headers**
    - File: `nuxt.config.ts` (`nitro.routeRules` or a server middleware)
    - Add `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and (on production HTTPS) `Strict-Transport-Security`. Remove/obscure `x-powered-by: Nuxt`.

---

## 🟡 Medium — fix within 1 month

11. **Fix homepage hero video double-load**
    - File: `app/components/home/HeroBanner.vue`
    - Both mobile and desktop `<video>` (2.46 MB `/videos/hero.mp4`) render regardless of viewport because hiding is CSS-only. Use `v-if`/`useMediaQuery` to mount only the active variant, or serve a compressed/poster-first variant for mobile.

12. **Replace `CleanlinessSection.vue` background-image with `<img>` + alt**
    - File: `app/components/home/CleanlinessSection.vue`
    - Convert the CSS `background-image` figure to a proper `<img>` with descriptive `alt` (e.g. "Analýza odpudzovania vody na karosérii — 99.8% efektivita") for crawlability and accessibility.

13. **Add `loading="lazy"` to `CategoryGrid.vue` images**
    - File: `app/components/home/CategoryGrid.vue`
    - Match the pattern already used in `UsageCategories.vue`.

14. **Expand thin content**
    - Product descriptions (`app/data/products.ts`, currently 120–162 chars) — add usage instructions, ingredients/compatibility notes, application steps.
    - Category descriptions (currently 50–56 chars) — expand into short intro paragraphs for category landing pages.

15. **Add `noindex` to transactional pages**
    - Files: `app/pages/kosik.vue`, `app/pages/pokladna.vue`, `app/pages/ucet.vue`, `app/pages/oblubene.vue`
    - Add `useSeoMeta({ robots: 'noindex, follow' })` — these pages carry no unique content for search.

---

## 🟢 Low — backlog

16. **Add `llms.txt`** at `public/llms.txt` describing the site/brand for AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.), since `robots.txt` already permits them.

17. **Add `ItemList` schema** on category-filtered `/produkty` views to reinforce category → product relationships for crawlers/AI engines.

18. **Build out E-E-A-T content**: dedicated "O nás"/certifications page linking to evidence behind the badge claims in `CleanlinessSection.vue` (ISO 9001:2015, REACH Compliant, etc.).

19. **Consider dedicated category routes** (`/produkty/karoseria` etc.) instead of query-string filters, enabling unique indexable titles/meta/content per category long-term (larger refactor — evaluate against current SPA filter UX).

---

## Re-audit Checklist (once `slickly.sk` network access is available)

- [ ] Re-run full audit against production domain
- [ ] Pull GSC indexation/coverage data
- [ ] Pull CrUX Core Web Vitals (real users)
- [ ] Backlink profile (Moz/Bing/Common Crawl)
- [ ] Validate schema with Google Rich Results Test / Schema.org validator on live URLs
- [ ] Confirm production `sitemap.xml` is submitted in GSC
