# SEO Audit Report — SLICKLY (Umenie Čistoty)

**Audit scope:** Local dev server (`http://127.0.0.1:3000`), Nuxt 4 SSR output, code/markup-level analysis only.

**Important limitation:** The production domain `slickly.sk` was unreachable from this environment
(`403 host_not_allowed` — network egress allowlist). As a result, the following live-data checks
**could not be performed** and are excluded from this report/score:

- Google Search Console indexation status
- CrUX field data (real-user Core Web Vitals)
- Live SERP rankings / competitor comparison
- Backlink profile (Moz / Bing / Common Crawl)
- Google Business Profile / local SEO signals
- Real Lighthouse run against the deployed site

Everything below is derived from the rendered HTML of the local dev build and the source code in
`app/`.

---

## Executive Summary

**SEO Health Score: 46 / 100 — Needs Improvement**

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 50/100 | 11.0 |
| Content Quality | 23% | 55/100 | 12.65 |
| On-Page SEO | 20% | 55/100 | 11.0 |
| Schema / Structured Data | 10% | 5/100 | 0.5 |
| Performance (CWV, lab) | 10% | 45/100 | 4.5 |
| AI Search Readiness (GEO) | 10% | 35/100 | 3.5 |
| Images | 5% | 60/100 | 3.0 |
| **Total** | | | **46.15** |

### Top 5 Critical Issues
1. **Zero structured data anywhere** — no Organization, WebSite, Product, Review, or BreadcrumbList JSON-LD on any of the 7 page types checked.
2. **No `sitemap.xml`** (`/sitemap.xml` → 404) and `robots.txt` has no `Sitemap:` directive.
3. **25 product/hero images hotlinked from `lh3.googleusercontent.com`** (Google AI Studio temporary asset host) — used for all product images, category tiles, hero video poster, and the "Umenie Čistoty" figure. These URLs are not guaranteed stable and bypass any CDN/format/caching control.
4. **No canonical tags on any page**, combined with `/produkty?kategoria=X` and `/produkty?akcia=1` serving the **identical `<title>`/meta description** as the base `/produkty` page — classic duplicate-content signal.
5. **Two `<h1>` elements in the homepage DOM** (`HeroBanner.vue`: mobile "TECHNICKÁ DOKONALOSŤ PRE VAŠE AUTO" + desktop "ŠPECIÁLNA ZĽAVA -20%"), both rendered server-side regardless of viewport.

### Top 5 Quick Wins
1. Add a single `app/assets/...` or Nuxt config block emitting **Organization + WebSite JSON-LD** (with `SearchAction`) sitewide via `layouts/default.vue` or `app.vue`.
2. Add **`Sitemap: https://slickly.sk/sitemap.xml`** to `public/robots.txt` and install `@nuxtjs/sitemap` for dynamic product/category URLs.
3. Add **canonical `<link>`** to every page's `useSeoMeta`/`useHead`, stripping query params for `/produkty`.
4. Add **Product + Offer + AggregateRating/Review JSON-LD** on `produkty/[slug].vue` — review data already exists in `data/products.ts`, just needs to be serialized.
5. Fix the **duplicate homepage `<h1>`** — use one semantic `<h1>` and demote the other to `<p>`/`<span>` (visually identical, but correct heading hierarchy).

---

## 1. Technical SEO

| Check | Status | Detail |
|---|---|---|
| `robots.txt` | ⚠️ Partial | `User-Agent: *` / `Disallow:` (allows everything) but **no `Sitemap:` directive** |
| `sitemap.xml` | ❌ Missing | `GET /sitemap.xml` → 404 |
| Canonical tags | ❌ Missing | 0/7 page types have `<link rel="canonical">` |
| Duplicate title/meta | ❌ Issue | `/produkty`, `/produkty?kategoria=karoseria`, `/produkty?akcia=1` all share identical `<title>Obchod | SLICKLY</title>` and meta description |
| HTTP → security headers | ❌ Missing | Homepage response has only `content-type`, `x-powered-by: Nuxt`, `date`, `connection`, `keep-alive`. No CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security` |
| Tech-stack disclosure | ⚠️ Minor | `x-powered-by: Nuxt` header exposed |
| SSR/prerender config | ✅ Good | `routeRules`: `/` → `prerender: true`; `/produkty` & `/produkty/**` → `swr: 3600` |
| `/pokladna` redirect | ℹ️ Info | Returns `302 → /kosik` (empty-cart guard) — confirm intentional, not crawl-blocking content |
| `robots` meta tag | ℹ️ Info | Not present on transactional pages (`kosik`, `pokladna`, `ucet`, `oblubene`) — consider `noindex` since these carry no unique indexable content |
| HTML lang | ✅ Good | `<html lang="sk">` set globally |

---

## 2. Content Quality

| Check | Status | Detail |
|---|---|---|
| Category descriptions | ⚠️ Thin | 50–56 characters each (e.g. "Keramická ochrana, vosky a leštenky pre dokonalý lak.") — acceptable as taglines but too short to rank for category-level long-tail queries |
| Product descriptions | ⚠️ Thin | 120–162 characters per product — covers core USP but lacks depth (usage instructions, ingredients/compatibility, application steps) that competitors and AI answer engines reward |
| E-E-A-T signals | ❌ Missing | No "About us", team, certifications/credentials page beyond the badge strip in `CleanlinessSection.vue` (ISO 9001, pH Neutral, SiO2 Infusion, REACH) — these claims aren't backed by linked evidence/certificates |
| Reviews/testimonials | ✅ Present | Real-looking review data with author, date, rating, text per product (`data/products.ts` → `TestimonialsSection.vue`) — good raw content, **not yet marked up** (see Schema section) |
| Language consistency | ✅ Good | Consistent Slovak throughout, no mixed-language artifacts |
| Duplicate content | ❌ Issue | Filtered `/produkty` variants (see Technical) duplicate body content + meta with no canonical |

---

## 3. On-Page SEO

| Page | Title | Meta Description | H1 count | Canonical | OG/Twitter |
|---|---|---|---|---|---|
| `/` | "SLICKLY \| Umenie Čistoty" | ✅ present | **2** ⚠️ | ❌ | ❌ |
| `/produkty` | "Obchod \| SLICKLY" | ✅ present | 1 | ❌ | ❌ |
| `/produkty?kategoria=karoseria` | same as above ⚠️ | same as above ⚠️ | 1 | ❌ | ❌ |
| `/produkty?akcia=1` | same as above ⚠️ | same as above ⚠️ | 1 | ❌ | ❌ |
| `/produkty/[slug]` | "{Product} \| SLICKLY" | ✅ present (product desc) | 1 | ❌ | ❌ |
| `/kosik` | "Košík \| SLICKLY" | ✅ present | 1 | ❌ | ❌ |
| `/ucet` | "Účet \| SLICKLY" | ✅ present | 1 | ❌ | ❌ |
| `/oblubene` | "Obľúbené \| SLICKLY" | ✅ present | 1 | ❌ | ❌ |
| `/pokladna` | redirects (302 → `/kosik`) | n/a | n/a | n/a | n/a |

**Findings:**
- Every page has a baseline title + meta description via `useSeoMeta()` — good foundation.
- Homepage is the only page with a heading-hierarchy problem (2×`<h1>`).
- **Zero pages** emit Open Graph or Twitter Card tags — shared links (social, messaging apps, Slack previews) will render with no image/title/description control, hurting CTR from social channels.
- Filtered listing URLs (`?kategoria=`, `?akcia=1`) are functionally distinct landing pages (different product sets) but are invisible to search engines as such due to duplicate metadata + no canonical/self-referencing strategy.

---

## 4. Schema & Structured Data

**Current implementation: none.** `application/ld+json` count = 0 across home, listing, category-filtered, deals-filtered, product detail, cart, account, and favorites pages.

### Recommended additions

| Schema type | Where | Why |
|---|---|---|
| `Organization` + `WebSite` (with `SearchAction`) | Global (`layouts/default.vue` or `app.vue`) | Establishes brand entity for Knowledge Panel eligibility and sitelinks search box |
| `Product` + `Offer` + `AggregateRating` + `Review` | `produkty/[slug].vue` | Enables price/availability/star-rating rich snippets in SERPs. Data already available: `product.price`, `product.sku`, `product.reviews[]` (rating, author, date, text) |
| `BreadcrumbList` | `produkty/[slug].vue`, `produkty/index.vue` (category-filtered) | Improves SERP breadcrumb display and reinforces site hierarchy for crawlers |
| `ItemList` | `produkty/index.vue` (category views) | Helps search engines understand category → product relationships |
| `FAQPage` (optional) | Product pages if FAQ content is added | Strong AI Overview / featured snippet candidate |

---

## 5. Performance (lab-only — no live CWV data)

| Check | Status | Detail |
|---|---|---|
| Hero video | ❌ Issue | `app/components/home/HeroBanner.vue` renders **two `<video>` elements** (mobile `md:hidden` + desktop `hidden md:block`), both pointing to `/videos/hero.mp4` (**2.46 MB**), both `autoplay muted loop`. CSS-based hiding does not prevent the browser from fetching/decoding both — likely doubles video bandwidth and hurts LCP/INP on the homepage |
| External image hosting | ❌ Issue | 25 references to `https://lh3.googleusercontent.com/...` across `data/products.ts`, `HeroBanner.vue`, `CleanlinessSection.vue` — no `srcset`/responsive sizes, no AVIF/WebP guarantee, no first-party caching, single point of failure if Google revokes the asset URLs |
| Local image assets | ℹ️ Info | Only 4 local images exist (`public/images/usecases/*.png`) — everything else is external |
| Caching/SSR strategy | ✅ Good | `prerender` on `/`, `swr: 3600` on `/produkty*` |
| Build config | ✅ Good | `manualChunks` splits `vendor-vue` / `vendor-pinia`; `nitro.compressPublicAssets: true` |

---

## 6. Images

| Check | Status | Detail |
|---|---|---|
| Alt text coverage | ✅ Excellent | 100% of `<img>` elements on homepage (20/20) and listing page (8/8) have non-empty `alt` attributes |
| Lazy loading | ⚠️ Inconsistent | `UsageCategories.vue` uses `loading="lazy"`; `CategoryGrid.vue` images do **not** set `loading="lazy"` despite being below the fold on mobile |
| Background images | ⚠️ Issue | `CleanlinessSection.vue` renders its key figure as a CSS `background-image` (inline `style` binding) rather than an `<img>` — not crawlable as an image asset, no `alt` text possible |
| Format/optimization | ❌ Issue | All product/category imagery is hotlinked from `lh3.googleusercontent.com` — format and compression are outside the project's control |

---

## 7. AI Search Readiness (GEO)

| Check | Status | Detail |
|---|---|---|
| AI crawler access (GPTBot, ClaudeBot, PerplexityBot, etc.) | ✅ Good | `robots.txt` is `Disallow:` (empty) for `User-Agent: *` — no AI crawlers are blocked |
| `llms.txt` | ❌ Missing | Not present at `/llms.txt` |
| Structured data for citability | ❌ Missing | No JSON-LD means AI answer engines have to rely purely on rendered text — far less reliable for accurate price/availability/rating citations |
| Content structure for passages | ⚠️ Weak | Product descriptions are single short paragraphs; no Q&A/spec-table format that AI engines tend to extract cleanly |
| Brand entity signals | ⚠️ Weak | No `Organization` schema or consistent NAP/brand description for entity recognition |

---

## 8. E-commerce Specific

- **Product pages** lack `Product`/`Offer` schema — price (`product.price`), SKU, and stock status are rendered as plain text only, invisible to rich-result eligibility.
- **Review data is rich but unused for schema**: `data/products.ts` already contains `rating`, `author`, `date`, `text` per review — directly mappable to `Review`/`AggregateRating`.
- **No breadcrumb navigation** observed on product or category pages — both a UX and schema gap.
- **Category landing pages exist only as query-string filters** (`/produkty?kategoria=X`) rather than dedicated routes (`/produkty/karoseria`) — limits the ability to give each category unique, indexable title/meta/content and contributes to the duplicate-content issue above.

---

## Notes on Audit Scope

This audit reflects the **current local dev build only**. Once `slickly.sk` is reachable from an
environment with the appropriate network allowlist, a follow-up audit should add:
- GSC indexation/coverage report
- CrUX-based Core Web Vitals (real users vs. lab estimate above)
- Backlink profile (Moz/Bing/Common Crawl)
- Live SERP position tracking for target keywords
- Render-diff against this local baseline to confirm production matches source
