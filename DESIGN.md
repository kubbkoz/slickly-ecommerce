---
version: alpha
name: SLICKLY-design-analysis
description: |
  A precision-first commerce system built on stark typographic hierarchy — towering uppercase Hanken Grotesk display lockups above a dense, neutral, near-monochrome retail chrome of sharp-cornered black CTAs, tight grid-line product cards, and a single amber accent ("Slickly Amber" #FFBF00) reserved for badges and promotional signals. The brand's voice is technical, automotive, and absolute: pure black, pure white, a layered gray surface system, and a deliberately small set of semantic accents (error red, amber highlight) — every chromatic moment is reserved for product photography or pricing signal, never decorative chrome. Slovak language (lang="sk") throughout.

colors:
  primary: "#000000"
  on-primary: "#ffffff"
  background: "#f7f9fb"
  on-background: "#191c1e"
  surface: "#f7f9fb"
  surface-dim: "#d8dadc"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f2f4f6"
  surface-container: "#eceef0"
  surface-container-high: "#e6e8ea"
  surface-container-highest: "#e0e3e5"
  on-surface: "#191c1e"
  on-surface-variant: "#4c4546"
  outline: "#7e7576"
  outline-variant: "#9e9394"
  grid-line: "#e5e5e5"
  secondary-container: "#ffbf00"
  on-secondary-container: "#6d5000"
  error: "#ba1a1a"
  on-error: "#ffffff"

typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 72px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.04em
    textTransform: uppercase
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
    textTransform: uppercase
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: 700
    lineHeight: 40px
    letterSpacing: -0.02em
    textTransform: uppercase
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: 600
    lineHeight: 32px
    letterSpacing: -0.01em
    textTransform: uppercase
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: 600
    lineHeight: 28px
    letterSpacing: -0.01em
    textTransform: uppercase
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0
  price-display:
    fontFamily: Hanken Grotesk
    fontSize: 22px
    fontWeight: 700
    lineHeight: 28px
    letterSpacing: 0
  technical-data:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0.02em
    textTransform: uppercase
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.1em
    textTransform: uppercase
  badge-label:
    fontFamily: Hanken Grotesk
    fontSize: 11px
    fontWeight: 700
    lineHeight: 12px

rounded:
  xs: 0.125rem
  sm: 0.25rem
  md: 0.375rem
  default: 0.375rem
  lg: 0.5rem
  xl: 0.75rem

spacing:
  stack-xs: 4px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
  gutter: 20px
  grid-margin: 24px
  section-padding: 64px
  section-padding-lg: 120px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.default}"
    padding: 0px 24px
    height: 48px
    textTransform: uppercase
    letterSpacing: widest
  button-primary-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    transform: scale(0.99)
    opacity: 0.85
  button-outline:
    backgroundColor: transparent
    textColor: "{colors.on-background}"
    border: 1px solid {colors.outline-variant}
    typography: "{typography.label-sm}"
    rounded: "{rounded.default}"
    padding: 0px 24px
    height: 48px
    textTransform: uppercase
  button-outline-hover:
    border: 1px solid {colors.primary}
    textColor: "{colors.on-background}"
  button-icon:
    backgroundColor: transparent
    textColor: "{colors.on-surface-variant}"
    rounded: "{rounded.default}"
    size: 44px
    minTouchTarget: 44px
  search-bar:
    backgroundColor: "{colors.surface-container-low}"
    textColor: "{colors.on-background}"
    typography: "{typography.body-md}"
    rounded: "{rounded.default}"
    padding: 8px 16px
    height: 44px
  filter-chip:
    backgroundColor: transparent
    textColor: "{colors.on-surface-variant}"
    border: 1px solid {colors.outline-variant}
    typography: "{typography.label-sm}"
    rounded: "{rounded.default}"
    height: 36px
    padding: 0px 16px
    textTransform: uppercase
  filter-chip-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    border: 1px solid {colors.primary}
  badge-sale:
    backgroundColor: "{colors.secondary-container}"
    textColor: "{colors.on-secondary-container}"
    typography: "{typography.badge-label}"
    rounded: "{rounded.default}"
    padding: 4px 8px
    textTransform: uppercase
  badge-new:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.badge-label}"
    rounded: "{rounded.default}"
    padding: 4px 8px
    textTransform: uppercase
  badge-out-of-stock:
    backgroundColor: "{colors.error}"
    textColor: "{colors.on-error}"
    typography: "{typography.badge-label}"
    rounded: "{rounded.default}"
    padding: 4px 8px
    textTransform: uppercase
  product-card:
    backgroundColor: "{colors.surface-container-lowest}"
    textColor: "{colors.on-background}"
    rounded: "{rounded.none}"
    padding: 0px
    border: 1px solid {colors.grid-line}
  product-card-image:
    backgroundColor: "{colors.surface-container-lowest}"
    aspectRatio: 1 / 1
    objectFit: cover
  price-row:
    currentPrice: "{typography.price-display}"
    currentPriceColor: "{colors.on-background}"
    oldPrice: "{typography.technical-data}"
    oldPriceColor: "{colors.on-surface-variant}"
    oldPriceDecoration: line-through
  header-desktop:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    height: 64px
    position: sticky
  header-mobile:
    backgroundColor: "{colors.surface-container-lowest}"
    textColor: "{colors.on-background}"
    height: 64px
    position: sticky
    border-bottom: 1px solid {colors.grid-line}
  bottom-nav:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-variant}"
    activeColor: "{colors.primary}"
    border-top: 1px solid {colors.outline-variant}/50
    height: auto
    safeAreaBottom: true
  footer:
    backgroundColor: "{colors.surface-container-highest}"
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.technical-data}"
    border-top: 1px solid {colors.grid-line}
  cart-drawer:
    backgroundColor: "{colors.background}"
    width: 100%
    maxWidth: 448px
    position: fixed right
    zIndex: 70
    overlay: "{colors.on-background}/40"
  form-input:
    backgroundColor: white
    textColor: "{colors.on-background}"
    typography: "{typography.body-md}"
    rounded: "{rounded.default}"
    border: 1px solid {colors.outline-variant}
    height: 48px
    padding: 0px 16px
    focusRing: 2px {colors.primary}
  form-label:
    typography: "{typography.technical-data}"
    textColor: "{colors.on-surface-variant}"
    textTransform: uppercase
---

## Overview

SLICKLY's commerce system is built on a single organizing principle: **Minimalist Precision**. Every page reads as a technical catalog — stark uppercase Hanken Grotesk headings with tight negative letter-spacing above dense grid-based product layouts, with everything else (nav, filters, buttons, cards, footer) reduced to neutral typography and sharp-edged geometry on `{colors.background}` and `{colors.surface-container-lowest}`. There is no decorative gradient, no pill-shaped softness, no accent color used for "tone" — the system saves all chromatic energy for product photography and the single amber accent moment (`{colors.secondary-container}` — "Slickly Amber" #FFBF00) reserved for sale badges and promotional signals.

The result is a layout that feels engineered — hero section, product grid, trust badges, footer — stacked like a technical manual rather than a lifestyle magazine. Density is high but never crowded, because the system relies on three relentless devices: square 1:1 product imagery on `{colors.surface-container-lowest}` white cards, sharp-cornered black CTAs (`{rounded.default}` at 6px — never pills) anchoring every actionable surface, and a tight 4/8/16/24px spacing scale that keeps cards and filters mathematically aligned across PLP, PDP, cart, and checkout pages.

Across the product listing, product detail, cart, checkout, account, and wishlist pages, the same chrome appears in identical proportions — only the content changes. That is the system's signature: maximum product focus in the imagery, maximum mechanical restraint everywhere else.

**Key Characteristics:**
- Hero sections with `{typography.display-lg}` (Hanken Grotesk, 72px, line-height 1, uppercase, -0.04em tracking) for maximum impact on landing
- Pure black/white/layered-gray UI palette: `{colors.primary}`, `{colors.surface-container-lowest}`, and `{colors.surface}` carry ~95% of the chrome surface area
- Sharp-cornered geometry: every CTA, card, and input uses `{rounded.default}` (6px) — there are no pill-shaped buttons in the system
- Product cards have minimal radius, sit on `{colors.grid-line}` 1px borders — the photograph is the card
- Two-tone CTA hierarchy: `{component.button-primary}` (black, uppercase, widest tracking) versus `{component.button-outline}` (transparent with outline-variant border) — never both at the same visual weight
- 4/8/16/24px spacing system with section rhythm at `{spacing.section-padding}` (64px) and `{spacing.section-padding-lg}` (120px) creating consistent vertical breathing
- Sale signaling uses the single amber accent: `{colors.secondary-container}` (#FFBF00) badge background — the only non-neutral, non-photographic color in the retail chrome
- Mobile-first responsive: base classes are mobile, `md:` breakpoint (768px) is desktop
- All transitions killed on mobile (`transition-duration: 0.01ms !important`) for instant touch response; CSS keyframe animations preserved for deliberate micro-interactions (cart-success, heart-pulse, badge-pop)

## Colors

> **Source:** Tailwind v4 `@theme` block in `app/assets/css/main.css`. The chrome palette is identical across all pages — only photography varies.

### Brand & Accent
- **SLICKLY Black** (`{colors.primary}` — `#000000`): The brand's primary color. It is the primary CTA, the desktop header background, the active filter chip, and the headline color. When SLICKLY asserts anything, it goes black.
- **Pure White** (`{colors.on-primary}` — `#ffffff`): Equal partner to black. Carries product card backgrounds, the inverse text on `{colors.primary}` surfaces, and the mobile header.
- **Slickly Amber** (`{colors.secondary-container}` — `#FFBF00`): The signature accent. Used exclusively for sale/promo badges, the logo dot, and the `logo-i::after` tittle dot. Never for primary CTA or body text.

### Surface System (Material You convention)
- **Background** (`{colors.background}` — `#f7f9fb`): Page-level background for body and all major sections.
- **Surface Container Lowest** (`{colors.surface-container-lowest}` — `#ffffff`): Product card bodies, cart drawer, form inputs, select dropdowns.
- **Surface Container Low** (`{colors.surface-container-low}` — `#f2f4f6`): Search bar background, subtle section differentiation.
- **Surface Container** (`{colors.surface-container}` — `#eceef0`): Avatar/icon placeholder backgrounds, blueprint grid overlays.
- **Surface Container High** (`{colors.surface-container-high}` — `#e6e8ea`): Elevated surface states.
- **Surface Container Highest** (`{colors.surface-container-highest}` — `#e0e3e5`): Footer background — the highest-elevation surface in the system.
- **Grid Line** (`{colors.grid-line}` — `#e5e5e5`): The universal 1px structural divider — card borders, section separators, table lines, product grid gaps.

### Text
- **On Background** (`{colors.on-background}` — `#191c1e`): Primary text on light surfaces — headlines, product names, prices, nav labels.
- **On Surface Variant** (`{colors.on-surface-variant}` — `#4c4546`): Secondary text — breadcrumbs, category subtitles, filter labels, meta descriptions, SKU codes.
- **Outline** (`{colors.outline}` — `#7e7576`): Border and decorative outlines.
- **Outline Variant** (`{colors.outline-variant}` — `#9e9394`): Button outlines, input borders, chip borders — lighter than primary outline.

### Semantic
- **Error** (`{colors.error}` — `#BA1A1A`): "Vypredané" (Out of Stock) badges, form validation errors, delete confirmation buttons.
- **On Error** (`{colors.on-error}` — `#ffffff`): Text on error-colored surfaces.
- **Error Container** (`#ffdad6`): Soft error backgrounds for form feedback.

## Typography

### Font Families
- **Hanken Grotesk** (Google Fonts) — the system's single text face. Carries everything from 72px display headlines to 11px button labels. Geometric sans-serif with excellent readability at both display and caption sizes. Weight range: 400 (body), 600 (headings/subheadings), 700 (display/prices).
- **Geist** (monospace/technical) — used exclusively for the `{typography.technical-data}` tier: SKU codes, product specifications, technical labels, timestamps, and status badges. Its monospaced DNA gives the automotive/engineering feel.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-lg}` | 72px | 700 | 1 | -0.04em | Hero section headlines (desktop), major landing statements (uppercase) |
| `{typography.headline-xl}` | 48px | 700 | 1.1 | -0.02em | Page-level hero headlines desktop, major section anchors (uppercase) |
| `{typography.headline-lg}` | 32px | 700 | 40px | -0.02em | Page titles — "Nákupný košík", "Všetky produkty", "Obľúbené produkty" (uppercase) |
| `{typography.headline-md}` | 24px | 600 | 32px | -0.01em | Section headers — "Mohlo by sa vám páčiť", "Súhrn objednávky" (uppercase) |
| `{typography.headline-sm}` | 20px | 600 | 28px | -0.01em | Product names in cart, subsection titles (uppercase) |
| `{typography.body-lg}` | 18px | 400 | 1.6 | 0 | Lead paragraph text, product descriptions |
| `{typography.body-md}` | 16px | 400 | 24px | 0 | Standard body copy, form inputs, navigation links |
| `{typography.price-display}` | 22px | 700 | 28px | 0 | Current price on product cards and PDP |
| `{typography.technical-data}` | 12px | 500 | 16px | 0.02em | SKU labels, product specs, breadcrumb items, status badges (Geist, uppercase) |
| `{typography.label-sm}` | 11px | 600 | 1 | 0.1em | Button labels, filter chip text, navigation bar labels (uppercase, tracking-widest) |
| `{typography.badge-label}` | 11px | 700 | 12px | 0 | Sale/new/out-of-stock badge text |

### Principles
The system runs on extreme typographic contrast: a towering 72px display tier for hero moments, a functional 20–32px heading tier for section structure, and a precise 11–16px utility tier carrying everything else. There is almost no middle ground — the jump from `{typography.headline-lg}` (32px) directly to `{typography.body-md}` (16px) is intentional and creates the "billboard above, catalog below" effect. Every heading is uppercase. Letter-spacing is negative on display/headings (tighter), positive on labels (wider tracking).

## Layout

### Spacing System
- **Base scale:** `{spacing.stack-xs}` (4px) · `{spacing.stack-sm}` (8px) · `{spacing.stack-md}` (16px) · `{spacing.stack-lg}` (24px)
- **Page-level:** `{spacing.gutter}` (20px) — mobile horizontal padding · `{spacing.grid-margin}` (24px) — desktop horizontal padding
- **Section rhythm:** `{spacing.section-padding}` (64px) · `{spacing.section-padding-lg}` (120px) — vertical breathing between major content blocks on desktop
- **Card internal padding:** Product cards use 0px internal image padding — image is full-bleed; metadata sits below with `{spacing.stack-sm}` (8px) gap between name, category, and price.

### Grid & Container
- **Max width:** 1536px content area with `{spacing.grid-margin}` (24px) desktop gutters (`md:max-w-[1536px] md:mx-auto md:px-grid-margin`)
- **Product grid:** 2-up at mobile (`grid-cols-2`), 3-up at large desktop (`lg:grid-cols-3`), with `gap-px` gutters and `bg-grid-line` background creating 1px visible grid lines between cards
- **Mobile gutter:** `{spacing.gutter}` (20px) horizontal padding (`px-gutter`)
- **Sidebar filters:** 256px fixed-width left rail on desktop (`md:w-64`), collapsing to horizontal scrollable chips on mobile

### Whitespace Philosophy
Whitespace is structural, not decorative. Product cards tile edge-to-edge with 1px `{colors.grid-line}` gaps between them — there is no padding around the card image itself. The "air" comes from the white card background, not from layout margin. Section separators are 1px `{colors.grid-line}` borders, not empty space. Headlines sit directly under section divider lines with minimal spacing.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No shadow, no border | Default for most surfaces — the dominant treatment |
| 1 — Grid line | 1px solid `{colors.grid-line}` | Product card borders, section separators, header/footer dividers, form input borders |
| 2 — Outline variant | 1px solid `{colors.outline-variant}` | Button outlines, filter chips, select dropdowns, inactive inputs |
| 3 — Cart drawer shadow | `shadow-xl` | Cart drawer slide-in panel — the only drop-shadow in the retail chrome |

The system has virtually no drop-shadow elevation. Cards do not lift. The only depth cue is the 1px grid-line structural border and the contrast between white product cards and the off-white page background.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 2px | Minimal rounding for smallest elements |
| `{rounded.sm}` | 4px | Badge containers |
| `{rounded.md}` / `{rounded.default}` | 6px | Every CTA button, every form input, every card — the system's universal radius |
| `{rounded.lg}` | 8px | Cart drawer content areas, larger containers |
| `{rounded.xl}` | 12px | Bottom nav touch targets, tab chips on mobile |

### Photography Geometry
- **Product cards:** consistent 1:1 square aspect ratio, full-bleed within the card grid with no padding, sitting on `{colors.surface-container-lowest}` white backdrop.
- **PDP main image:** large square primary image with horizontal thumbnail gallery below on mobile, or side-by-side dual-image on desktop.
- **Category images:** circular crop (`rounded-full`) for category navigation in empty cart state and homepage.
- **Hero:** full-width editorial imagery with text overlay, using `{typography.display-lg}` at 72px desktop / `{typography.headline-xl}` at 48px mobile.

## Components

### Buttons

**`button-primary`** — the universal SLICKLY CTA
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.label-sm}` uppercase tracking-widest, padding `0px 24px`, height 48px (h-12), rounded `{rounded.default}` (6px).
- Used on every primary action: "Pridať do košíka", "Pokračovať k pokladni", "Uložiť zmeny", "Prejsť do obchodu".
- Active state: `scale(0.99)` with `bg-primary/85` (15% opacity reduction). No dramatic collapse — subtle, confident feedback.

**`button-outline`** — secondary alternative
- Background transparent, text `{colors.on-background}`, border 1px `{colors.outline-variant}`, type `{typography.label-sm}` uppercase, height 48px, rounded `{rounded.default}`.
- Hover: border transitions to `{colors.primary}`.
- Used as the lower-emphasis alternate: "Pokračovať v nákupe", "Zobraziť všetky produkty", "Zrušiť".

**`button-icon`** — chrome icon controls
- Transparent background, `{colors.on-surface-variant}` icon, min-size 44×44px (WCAG AAA touch targets), rounded `{rounded.default}`.
- Hover: `{colors.on-background}`. Error variant hover: `{colors.error}`.
- Used for: cart icon, wishlist heart, search, delete, quantity +/−, close buttons.

**`filter-chip`** + **`filter-chip-active`**
- Default: transparent background, `{colors.on-surface-variant}` text, 1px `{colors.outline-variant}` border, type `{typography.label-sm}` uppercase, height 36px (h-9), rounded `{rounded.default}`.
- Active: `{colors.primary}` background, `{colors.on-primary}` text, `{colors.primary}` border — full inversion. No intermediate state.

### Inputs & Forms

**`form-input`**
- Background white, text `{colors.on-background}`, type `{typography.body-md}`, rounded `{rounded.default}`, border 1px `{colors.outline-variant}`, height 48px (h-12), padding `0px 16px`.
- Focus: `ring-2 ring-primary` — a clean 2px primary-color focus ring.

**`form-label`**
- Type `{typography.technical-data}` (Geist 12px 500), color `{colors.on-surface-variant}`, uppercase.

### Cards & Containers

**`product-card`**
- Container: `{colors.surface-container-lowest}` white background, rounded `{rounded.none}` (0px), padding 0, border 1px `{colors.grid-line}`.
- Image area: 1:1 square, `object-cover`, full-bleed within card. Mobile: horizontal swipeable gallery with dot indicators.
- Below image: badge stack (top-left overlay on image), category label `{typography.technical-data}` `{colors.on-surface-variant}`, product name `{typography.body-md}` `{colors.on-background}` uppercase, price row.
- Price row: current price `{typography.price-display}` `{colors.on-background}`. If on sale: old price `{typography.technical-data}` `{colors.on-surface-variant}` with line-through, percentage badge in `{colors.secondary-container}`.
- Wishlist heart icon top-right on hover/touch, add-to-cart button bottom of card.

**`badge-sale`** — amber promotional badge
- Background `{colors.secondary-container}` (#FFBF00), text `{colors.on-secondary-container}`, type `{typography.badge-label}`, rounded `{rounded.default}`, padding `4px 8px`.
- Content format: "−XX%" or "AKCIA".

**`badge-new`** — new product badge
- Background `{colors.primary}`, text `{colors.on-primary}`, same dimensions as sale badge.

**`badge-out-of-stock`**
- Background `{colors.error}`, text `{colors.on-error}`.

### Navigation

**`header-desktop`** — main desktop navigation
- Background `{colors.primary}` (full black), text `{colors.on-primary}`, height 64px, `sticky top-0 z-50`.
- Layout: SLICKLY logo at left (with amber dot accent), centered nav row ("Obchod · Značky · Sprievodca · Blog"), right cluster (locale selector, search toggle, wishlist heart, cart bag with item count badge).
- Category mega-menu dropdown on "Obchod" hover with category links.

**`header-mobile`** — mobile header
- Background `{colors.surface-container-lowest}` (white), text `{colors.on-background}`, height 64px, `sticky top-0 z-50`, bottom border 1px `{colors.grid-line}`.
- Layout: hamburger menu left, SLICKLY logo center, search + cart icons right.
- Full-screen menu drawer slides from left on hamburger tap.

**`bottom-nav`** — mobile bottom navigation
- Background `{colors.surface}`, height auto with `safe-area-inset-bottom` padding.
- 4 links: Domov, Obľúbené, Akcie, Účet — each with Material Symbol icon above label.
- Active state: `{colors.primary}` color, filled icon (`fontVariationSettings: 'FILL' 1'`), bold label.
- Badge on Obľúbené: `{colors.error}` circle with count when wishlist > 0.
- Haptic feedback: `navigator.vibrate(8)` on tap.

**`cart-drawer`** — slide-in cart sidebar
- Fixed right panel, `{colors.background}`, max-width 448px, z-index 70.
- Overlay: `{colors.on-background}/40` (40% opacity dark overlay on page content).
- Enter: `translate-x-full → translate-x-0` over 300ms ease-out.
- Leave: reverse over 200ms ease-in.
- Header: "KOŠÍK (n)" title + close button, 64px height.
- Items: scrollable list with product images, quantity controls, remove button.
- Empty state: large icon, prominent heading, category grid, CTA buttons.
- Footer: subtotal + "Zobraziť košík" outline button + "Pokladňa" primary button.

**`footer`**
- Background `{colors.surface-container-highest}`, border-top 1px `{colors.grid-line}`.
- Blueprint grid overlay map visualization (decorative).
- Contact info with Material Symbol icons.
- Link columns: legal pages + category links.
- Bottom: copyright, "Umenie Čistoty" tagline, `{typography.technical-data}` `{colors.on-surface-variant}`.

### Micro-Interactions

All CSS transitions are killed on mobile for instant touch response. Deliberate feedback uses CSS keyframe animations that survive the transition kill:

**`cart-success`** — add-to-cart confirmation
- 300ms scale pulse (1 → 1.12 → 1) with `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- Button background flashes from `{colors.primary}` to `#2e7d32` (success green) for 1.2s.
- Toast notification slides up from bottom.

**`heart-pulse`** — wishlist toggle
- 350ms scale bounce (1 → 1.25 → 1) with same cubic-bezier.
- Heart icon fills/unfills.
- Toast notification confirms add/remove.

**`badge-pop`** — cart/wishlist count change
- 320ms pop (scale 0.4 → 1.25 → 1) with opacity fade-in.

**`toast-in`** — notification snackbar
- 250ms slide-up (translateY 16px → 0) with opacity.
- Auto-dismiss after 2.8s.

## Do's and Don'ts

### Do
- Reserve `{typography.display-lg}` exclusively for hero section headlines on the homepage — never use 72px for product listings or account pages.
- Use `{component.button-primary}` (black, uppercase, tracking-widest) as the single primary action per viewport. Pair it at most with `{component.button-outline}` for a soft alternative.
- Stage every product photograph on `{colors.surface-container-lowest}` white — the white is the system's "studio."
- Keep all CTAs sharp-cornered at `{rounded.default}` (6px). Never introduce pill-shaped (`rounded-full`) buttons.
- Use `{colors.secondary-container}` (#FFBF00 amber) only on sale/promo badges — never on backgrounds, body text, or primary chrome.
- Stack content sections with `{colors.grid-line}` 1px borders between them; the structural grid line is the divider, not empty space.
- Wrap all `localStorage`-dependent content (cart, wishlist, recently viewed) in `<ClientOnly>` with a fallback placeholder to prevent SSR hydration mismatches.
- Gate store-dependent badge counts (cart, wishlist) behind a `hydrated` ref that's set in `onMounted`/`nextTick`.
- Use `useCookie` (not `localStorage`) for any state that affects SSR-rendered prices or locale-dependent text.
- Use `{typography.technical-data}` (Geist) for all SKU codes, status badges, specifications, and meta information — never for headings or body text.

### Don't
- Don't introduce drop shadows or card elevation. Cards sit flat with 1px `{colors.grid-line}` borders; the only shadow in the system is the cart drawer.
- Don't use `{colors.secondary-container}` for CTA buttons, navigation, or chrome — it belongs exclusively to sale badges and the logo accent.
- Don't replace `{colors.primary}` (#000000) with a near-black gray for CTAs — SLICKLY's primary is true black.
- Don't pad inside product card image areas. The image is full-bleed; metadata sits directly below with `{spacing.stack-sm}` (8px) between rows.
- Don't use pill-shaped (`rounded-full`) buttons or inputs. The system's geometry is sharp corners at 6px radius — pills belong to a different design language.
- Don't use CSS transitions on mobile — they are globally killed. Use CSS `@keyframes` animations for intentional micro-interactions only.
- Don't introduce emojis as UI icons. Use Material Symbols Outlined font ligatures (`<span class="material-symbols-outlined">icon_name</span>`).
- Don't create separate mobile and desktop components. Use a single component with Tailwind `md:` responsive variants.
- Don't use `localStorage` directly in components that render prices or locale-dependent content — use `useCookie` for SSR-safe persistence.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| mobile | 0–767px | Single/double-column layouts, mobile header (white), bottom nav, horizontal chip filters, gutter padding 20px |
| desktop | 768px+ (`md:`) | Multi-column layouts, desktop header (black), sidebar filters, grid-margin padding 24px, max-width 1536px |
| large desktop | 1024px+ (`lg:`) | Product grid expands from 2-up to 3-up |

### Touch Targets
All interactive elements meet WCAG AAA (44×44px minimum). Primary buttons sit at 48px height (h-12) with 24px horizontal padding. Icon buttons are 44×44px minimum (`min-w-11 min-h-11`). Filter chips are 36px height (h-9). All interactive elements have `cursor-pointer` and `[touch-action:manipulation]` on mobile to eliminate the 300ms tap delay.

### Collapsing Strategy
- **Header:** desktop black bar with full nav → mobile white bar with hamburger + logo + icons
- **Product grid:** 3-up (`lg:grid-cols-3`) → 2-up (`grid-cols-2`) — never 1-up
- **Filter sidebar:** 256px left rail → horizontal scrollable chip strip
- **Section spacing:** `{spacing.section-padding-lg}` (120px) desktop → `{spacing.section-padding}` (64px) tablet → `{spacing.stack-lg}` (24px) mobile
- **Typography:** `{typography.display-lg}` (72px) desktop → `{typography.headline-xl}` (48px) mobile for hero; page headings use `md:text-headline-xl` desktop / `text-headline-lg` mobile
- **Bottom nav:** visible only on mobile (`md:hidden`), 64px + safe-area-inset-bottom
- **Cart drawer:** full-width on mobile, max-width 448px on desktop

### Image Behavior
- Product imagery is responsive at the same 1:1 ratio across all breakpoints — the image scales, the ratio doesn't.
- Mobile product cards support horizontal swipeable gallery with dot indicators; desktop shows single cover image.
- All non-critical imagery uses `loading="lazy"`.
- Product images use Google-hosted URLs (`lh3.googleusercontent.com`) — no local image assets.

## Known Gaps

- **Dark mode** not implemented — the system is light-mode only. The Material You color token structure (surface-container-*, on-*) supports future dark mode by swapping the `@theme` block.
- **Auth/login flow** not implemented — account page shows mock data with simulated save operations.
- **Backend integration** pending — all product data comes from `app/data/products.ts` mock file, designed to be replaced by Shopware 6 Store API calls without component changes.
- **Checkout payment** not connected — `pokladna.vue` is a UI-only form with no payment processor integration.
- **Search** is client-side filtering only — no server-side search or Algolia/Typesense integration.
- **i18n** not implemented — the app is Slovak-only (`lang="sk"`). The locale store handles currency/country for shipping estimation, not language switching.
