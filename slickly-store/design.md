# SLICKLY Design System 1.0
> Single source of truth pre celý vizuál projektu. Každá grafická úprava, komponent alebo štýl MUSÍ byť v súlade s týmto dokumentom.

---

## 1. Identita a Concept

| Atribút | Hodnota |
|:---|:---|
| **Brand** | SLICKLY |
| **Segment** | Prémiový e-shop — bicykle, e-bikes, príslušenstvo |
| **Estetika** | Tech-Industrial, Bold, Dynamic, Premium |
| **Vibe** | Agresívne nadpisy + subtílne glassmorphism + brandová červená |
| **Jazyk dizajnu** | Šikmé prvky (`-skew-x-12`), brutálny uppercase, ostré hrany (bez border-radius), červené akcenty |

---

## 2. Farby

### Primárna paleta

| Token | Hex | CSS Variable | Použitie |
|:---|:---|:---|:---|
| `brand` | `#000000` | `--brand-color` | CTAs, hover-akcenty, badge, dismiss-bar, ceny zľavy |
| `brand-dark` | `#1A1A1A` | — | Hover stav primary buttonu |
| `black` | `#000000` | — | Nadpisy, secondary CTA, kontrasty |
| `zinc-950` | `#111111` | — | Page body color |
| `zinc-900` | `#1A1A1A` | — | Tmavé panely, scrollbar track |
| `zinc-800` | `#333333` | — | Scrollbar thumb |
| `white` | `#FFFFFF` | — | Hlavné pozadie, text na tmavom |
| `gray-50` | `#F9FAFB` | — | Sekčné pozadie (alternujúce) |

### Sémantické farby

| Účel | Farba | Hex |
|:---|:---|:---|
| **Dostupné (Skladom)** | Zelená | `#10B981` |
| **Na objednávku** | Žltá | `#F59E0B` |
| **Vypredané** | Šedá | `#6B7280` |
| **Chyba / Alert** | Červená | `#EF4444` |
| **Zľava badge** | `brand` | `#000000` |

### Pravidlá použitia

- **Brandová červená** sa používa VŽDY iba na: primárne CTA buttony, hover efekty, zvýraznenie posledného slova sekčného nadpisu, zľavové boxy.
- **Na tmavom pozadí** (sekcia `bg-black`): text je `text-white`, sekundárny text `text-gray-300/400`.
- **Na svetlom pozadí** (sekcia `bg-white/gray-50`): text je `text-black`, sekundárny `text-gray-500/600`.

---

## 3. Typografia

### Fonty

| Font | Trieda UnoCSS | Použitie |
|:---|:---|:---|
| **Space Grotesk** | `font-tech`, `font-sans` | Jediný font na celom webe — nadpisy (H1–H4), logá, ceny, tech-prvky aj body text, popisky, formuláre, UI labely |

> Font je načítaný cez `presetWebFonts` v `uno.config.ts` s `provider: 'none'` (self-hosted
> cez `@fontsource/space-grotesk`, NIE Google Fonts CDN). Oba shortcuty (`font-tech`,
> `font-sans`) mapujú na rovnaký font — ponechané samostatne kvôli existujúcim šablónam.

### Hierarchia Nadpisov

Toto je **záväzná** definícia. Každý `<h1>`–`<h4>` element musí zodpovedať nasledujúcemu vzoru:

#### H1 — Mega Hero Nadpis
- **Kde**: Jediné miesto na stránke (PDP product name, hero sekcie)
- **Klasy**: `text-2xl md:text-4xl font-black text-black leading-[0.95] font-tech uppercase tracking-wide`
- **Príklad**: `<h1 class="text-2xl md:text-4xl font-black text-black leading-[0.95] font-tech uppercase tracking-wide">`

#### H2 — Section Header
- **Kde**: Každá homepage sekcia (Flash Sales, Novinky, Kategórie...)
- **Klasy**: `text-5xl md:text-6xl font-black uppercase italic font-tech tracking-wide leading-none`
- **Zvýraznenie**: Posledné slovo wrappovať v `<span class="text-brand">`
- **Dekorátor**: Po nadpise vždy `<div class="w-24 h-1.5 bg-brand skew-x-[-20deg]">`
- **Príklad**:
```html
<h2 class="text-5xl md:text-6xl font-black uppercase italic font-tech tracking-wide leading-none">
  Novinky v <span class="text-brand">ponuke</span>
</h2>
<div class="w-24 h-1.5 bg-brand skew-x-[-20deg]"></div>
```

#### H3 — Card / Sub-Section Header
- **Kde**: Nadpisy kariet, modálnych okien, sidebar sekcií
- **Klasy (tmavé pozadie)**: `text-4xl font-black text-white uppercase italic font-tech leading-none`
- **Klasy (svetlé pozadie)**: `text-3xl md:text-4xl font-black uppercase font-tech uppercase italic leading-[0.95] tracking-tight`
- **Príklad**: `<h3 class="text-3xl font-black text-white uppercase italic font-tech leading-none">`

#### H4 — Label / Detail Header
- **Kde**: Sekčné popisky v komponentoch (napr. "Otváracie hodiny"), Form labely
- **Klasy**: `text-xs font-bold uppercase tracking-widest font-sans text-gray-500`
- **Tech varianta (s ikonou)**: `text-brand font-bold uppercase tracking-widest font-tech text-xl flex items-center`

### Body Text

| Variant | Klasy | Použitie |
|:---|:---|:---|
| Primárny | `font-sans text-sm md:text-base leading-relaxed text-gray-600` | Popisky produktov, úryvky |
| Sekundárny | `font-sans text-sm text-gray-500 font-medium` | Metadáta, dátumy, tagy |
| Malý label | `text-[10px] font-bold uppercase tracking-widest text-gray-400` | Formulárové labely, metapopisky |
| Cena | `font-tech font-black text-2xl md:text-4xl text-black leading-none` | Ceny produktov |
| Cena (prečiarknutá) | `font-tech text-sm md:text-base text-gray-400 line-through decoration-1` | Pôvodná cena |

---

## 4. Buttony

### Základ (BaseButton.vue)

Všetky kliky sú routované cez `<BaseButton>` komponent. Priame `<button>` elementy sa používajú IBA na ikony/minimálne akcie (close, quantity stepper).

**Base klasy vždy aplikované:**
```
inline-flex items-center justify-center font-bold uppercase tracking-widest
transition-all duration-300 rounded-none disabled:opacity-50 disabled:cursor-not-allowed
```

### Varianty

| Variant | Klasy | Popis |
|:---|:---|:---|
| `primary` | `bg-brand text-white hover:bg-brand-dark border border-brand` | Hlavná akcia (Add to Cart, Checkout, Submit) |
| `secondary` | `bg-[#f7f9fa] text-[#5F6D7E] hover:border-gray-300` | Alternatívna akcia, light variant (napr. View Cart) |
| `outline` | `bg-transparent text-white border border-white hover:bg-white hover:text-black` | Svetlý outline na tmavom pozadí |
| `ghost` | `bg-transparent text-black hover:bg-gray-100 border border-transparent` | Minimálna akcia v kontexte |
| `white` | `bg-white text-black hover:bg-gray-100 border border-white` | Na tmavom pozadí, sekundárna akcia |

### Veľkosti

| Veľkosť | Klasy |
|:---|:---|
| `sm` | `px-4 py-2 text-xs` |
| `md` (default) | `px-6 py-3 text-sm` |
| `lg` | `px-8 py-4 text-base` |

### Špeciálne vzory buttonov (nie cez BaseButton)

#### Nav Arrow Button (scroll carousel)
```html
<button class="w-12 h-12 border border-gray-200 bg-white hover:border-brand hover:bg-brand hover:text-white flex items-center justify-center transition-all rounded-none shadow-sm">
  <ChevronLeft class="w-6 h-6" />
</button>
```

#### Action Grid Button (PDP akcie — Wishlist, Compare, Watch, Offer)
```html
<button class="flex flex-col items-center justify-center py-2.5 px-1 bg-white border border-gray-200 hover:border-black hover:text-black transition-colors text-black text-[10px] font-bold uppercase text-center">
  <Heart class="w-4 h-4 mb-1" />
  Obľúbené
</button>
```

#### Tab/Filter Button (Aktívny / Neaktívny stav)
```html
<!-- Aktívny -->
<button class="px-5 py-2 rounded-none text-sm font-bold uppercase tracking-wider border bg-brand border-brand text-white shadow-lg transform scale-105 font-sans">

<!-- Neaktívny -->
<button class="px-5 py-2 rounded-none text-sm font-bold uppercase tracking-wider border bg-white border-gray-200 text-gray-600 hover:border-brand hover:text-brand font-sans">
```

#### Checkout Button (CartSidebar)
```html
<button class="w-full py-4 bg-brand text-white font-bold uppercase tracking-widest shadow-xl hover:bg-brand-dark transition-colors flex items-center justify-center">
  Prejsť k pokladni <ArrowRight class="w-5 h-5 ml-2" />
</button>
```

#### Text Link Button
```html
<button class="text-xs font-bold text-brand hover:text-black uppercase tracking-widest flex items-center transition-colors group bg-white border-0 p-0">
  Čítať viac <ChevronDown class="w-4 h-4 ml-1.5" />
</button>
```

---

## 5. Brand Badge / Skewed Label
Opakujúci sa vizuálny vzor — šikmý červený "štítok":
```html
<div class="inline-block bg-brand px-3 py-1 mb-3 transform -skew-x-12">
  <span class="block transform skew-x-12 text-white text-xs font-bold uppercase tracking-widest font-tech">
    Text štítku
  </span>
</div>
```

---

## 6. Formuláre a Inputy

### Text Input
```html
<input class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium font-sans" />
```

### Form Label
```html
<label class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
```

### Newsletter Input (tmavý kontext)
```html
<input class="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-brand focus:bg-white/20 transition-all font-medium font-sans" />
```

### Error State
```html
<div class="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 p-4 text-sm">
  <AlertCircle class="w-5 h-5 flex-shrink-0 mt-0.5" />
  <p>Chybová správa</p>
</div>
```

---

## 7. Layout a Spacing

### Container
```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  /* Breakpoints: sm:640px | md:768px | lg:1024px | xl:1280px | 2xl:1536px */
}
```
V šablónach: `class="container mx-auto px-4 lg:px-8"`

### Sekčné Spacing (vertikálny rytmus)
| Typ sekcie | Klasy | Hodnota |
|:---|:---|:---|
| Štandardná sekcia | `py-24` | 96px vrchná/spodná |
| Kompaktná sekcia | `py-16` | 64px |
| Hero sekcia | `py-20` | 80px |
| Section header margin | `mb-10 md:mb-16` | — |

### Alternácia pozadia sekcií (homepage)
```
bg-white → bg-gray-50 → bg-white → bg-black → bg-gray-50
```
Každá sekcia musí mať `border-b border-gray-100` alebo `border-t border-gray-100` na oddelenie.

### Grid Systém

| Kontext | Klasy |
|:---|:---|
| Produkt grid (4 stĺpce) | `grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-1 gap-y-8 md:gap-4` |
| Produkt grid (2x2) | `grid grid-cols-2 md:grid-cols-2 gap-x-1 gap-y-8 md:gap-4` |
| Kategória grid | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4` |
| Ride Styles grid | `grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8` |
| Footer grid | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8` |

---

## 8. Grafické Dekorátory

### Sekčný dekorátor (červená čiara pod nadpisom)
```html
<div class="w-24 h-1.5 bg-brand skew-x-[-20deg] mb-6"></div>
```

### Tech Corners (na tmavých kartách/mapách)
```html
<div class="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand z-10"></div>
<div class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand z-10"></div>
```

### Brand Red Bottom Border (hover efekt na kartách)
```html
<div class="absolute bottom-0 left-0 w-full h-[4px] bg-brand origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
```

### Gradient Brand Top Border (footer)
```html
<div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-70"></div>
```

### Glass Panel
```css
.glass-panel {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}
```

### Background Watermark Text
```html
<div class="absolute top-10 right-10 text-[200px] font-black text-gray-100 font-tech opacity-50 select-none pointer-events-none">
  RIDE
</div>
```

---

## 9. Animácie

| Trieda | Definícia | Použitie |
|:---|:---|:---|
| `animate-fade-in` | `opacity: 0→1`, `0.5s ease-out` | Fade-in sekcie, modálne okná |
| `animate-slide-up` | `translateY(20px)→0 + opacity`, `0.8s ease-out` | Hero prvky |
| `animate-pulse-slow` | `pulse`, `3s infinite` | Loading/AI stavy |
| `animate-heartbeat` | Scale 1→1.15→1→1.15→1, `1.5s infinite` | Wishlist ikona |
| `animate-shake` | `translateX 0→-4px→4px→-4px→0`, `0.4s` | Add to cart chyba (variant nevybratý) |
| `animate-spin` | štandardný | Loading spinners (Loader2 ikona) |

### Hover Transitions (štandardné)
- Trvanie: `transition-all duration-300` (väčšina)
- Dlhšie (`duration-500` / `duration-700`): Obrázky, škálovanie kariet

---

## 10. Ikonografia

Knižnica: **lucide-vue-next** (výhradne).

| Kontext | Ikona | Veľkosť |
|:---|:---|:---|
| Navigácia (šipky carousel) | `ChevronLeft`, `ChevronRight` | `w-6 h-6` |
| CTA (pokračovať) | `ArrowRight` | `w-5 h-5` |
| Social (footer) | `Facebook`, `Instagram`, `Youtube` | `w-5 h-5` |
| Košík | `ShoppingCart`, `ShoppingBag` | `w-5 h-5` |
| User | `User`, `Lock`, `Mail` | `w-4 h-4` |
| Wishlist | `Heart` | `w-4 h-4` (karta), `w-12 h-12` (modal) |
| Stav (ok/error) | `Check`, `AlertCircle`, `CheckCircle` | `w-5 h-5` |
| Loader | `Loader2` (+ `animate-spin`) | `w-4 h-4` (inline), `w-12 h-12` (page) |
| Rating | Vlastný `RatingStars.vue` | — |

---

## 11. Header

```
--header-height: 80px
Pozadie: bg-white
Šírka: 100%
```

---

## 12. Footer

- **Pozadie**: `bg-black text-white`
- **Grid**: `lg:grid-cols-12` — Logo/Socials (4), Menu (2), Kontakt (3), Mapa (3)
- **Section nadpisy**: `h2` variant `font-black font-tech text-lg mb-8 uppercase tracking-widest` + ľavý brand-červený prúžok
- **Bottom bar**: `text-xs text-gray-400 uppercase tracking-wider font-bold`

---

## 13. Scrollbar

```css
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #1a1a1a; }
::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #000000; }
```

---

## 14. UnoCSS Shortcuts Referencia

Tieto skratky sú definované v `uno.config.ts`:

| Skratka | Rozvinuté klasy |
|:---|:---|
| `glass-panel` | `bg-white/90 backdrop-blur-md` |
| `section-h2` | `text-5xl md:text-6xl font-black uppercase italic font-tech tracking-wide leading-none` |
| `section-decorator` | `w-24 h-1.5 bg-brand skew-x-[-20deg]` |
| `btn-nav-arrow` | `w-12 h-12 border border-gray-200 bg-white hover:border-brand hover:bg-brand hover:text-white flex items-center justify-center transition-all rounded-none shadow-sm` |
| `btn-tab-active` | `px-5 py-2 rounded-none text-sm font-bold uppercase tracking-wider border bg-brand border-brand text-white shadow-lg transform scale-105 font-sans` |
| `btn-tab-inactive` | `px-5 py-2 rounded-none text-sm font-bold uppercase tracking-wider border bg-white border-gray-200 text-gray-600 hover:border-brand hover:text-brand font-sans` |
| `brand-badge` | `inline-block bg-brand px-3 py-1 transform -skew-x-12` |
| `form-input` | `w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium font-sans` |
| `form-label` | `block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2` |

---

## 15. Pravidlá konzistentnosti (Engineering Rules)

1. **Zero inline styles** — žiadne `style=""` atribúty na elementoch.
2. **Zero hardcoded colors** — nikdy `#000000` priamo v šablóne, vždy `text-brand`/`bg-brand`.
3. **Zero border-radius na primárnych prvkoch** — `rounded-none` je štandard. Zaoblenie iba výnimočne (napr. `rounded-full` pre ikony/avatary).
4. **Všetky buttony cez BaseButton alebo dokumentované výnimky** — žiadné `<button class="bg-brand...">` pre primárne CTA.
5. **UPPERCASE typografia** — všetky nadpisy, labely, buttony sú uppercase. Popisky textu sú normálne.
6. **Font-tech pre čísla a ceny** — `font-tech` sa používa na ceny, technické hodnoty, krátke tech-etikety.
7. **Šikmý dekorátor** — každý H2 na homepage MUSÍ byť nasledovaný `<div class="section-decorator">`.
8. **Zero name-based entity filtering** — **PRÍSNY ZÁKAZ** filtrovania Shopware entít (kategórie, vlastnosti, produkty) pomocou ich názvov alebo reťazcov (napr. `categoryName.includes('bicykle')`). Názvy sa menia, preklady sa líšia — takýto kód je garantovaný zdroj bugov.
   - **Správny postup:** Vždy používaj UUID z `.env` cez `useRuntimeConfig().public.shopware.ids.*`.
   - **Ak entita prichádza ako prop zo Shopware** (napr. navigačný strom): použi `entity.id` priamo — Shopware API vždy vracia kanonické UUID.
   - **Anti-pattern (ZAKÁZANÉ):**
     ```typescript
     // ❌ NIKDY TAKTO — krehké, bug-prone, nepreložiteľné
     if (categoryName.includes('bicykle')) canonicalId = ids.bikes;
     ```
   - **Správny vzor:**
     ```typescript
     // ✅ VŽDY TAKTO — UUID je nemenný kontrakt so Shopware
     const canonicalCategoryId = props.category.id; // zo Shopware navigačného stromu
     // alebo
     const categoryId = useRuntimeConfig().public.shopware.ids.categories.bikes; // z .env
     ```

---

## 16. Množstevné ovládanie (QuantitySelector Component)

Centralizovaný komponent pre výber počtu kusov. Tento komponent je jediným zdrojom pravdy pre logiku a vzhľad countera v celom e-shope. "Vytiahnutý" z PDP pre maximálnu znovupoužiteľnosť.

### §16. Vzhľad tlačidla "Pridať do košíka" v listingu
Na hoveri v listingu sa pre **jednoduché produkty** zobrazuje čisté tlačidlo s ikonou a informácia o sklade:
- **Zarovnanie**: Tlačidlo vľavo, informácia o sklade **úplne vpravo** (`justify-between`).
- **Štýl tlačidla**: `<AddToCartButton :show-text="false">` v tvare štvorca (`w-11 h-11 aspect-square`).
- **Obsah**: Iba ikona košíka (bez textu pre čistejší a minimalistický vzhľad).

### §17. Informácia o skladovej dostupnosti (Stock Status)
Pre jednoduché produkty a zvolené varianty sa na hoveri zobrazuje stav skladu v reálnom čase:
- **Vizuálny prvok**: Farebná gulička so **subtílnym "breathe" efektom** a glow.
  - **Zelená (Success - `#52a63f`)**: Shadow success, `animate-breathe`.
  - **Oranžová (`bg-amber-400`)**: Shadow amber, `animate-breathe`.
  - **Červená (`bg-brand`)**: Shadow red, `animate-breathe`.
- **Typografia**: Space Grotesk **Semibold**, 10-11px, **text-black**.

#### §17.1 Záväzná logika dostupnosti (GLOBAL — platí všade)

```
availableStock > 0               → ZELENÁ  (skladom, isCloseout nehrá rolu)
availableStock = 0 && !isCloseout → ORANŽOVÁ (na objednávku)
availableStock = 0 && isCloseout  → ŠEDÁ + prečiarknuté (nedostupné)
```

**PRAVIDLO:** `availableStock` má VŽDY prioritu. `isCloseout` je relevantné IBA pri `availableStock = 0`.

#### §17.2 Shopware API includes — povinné polia

Pre každý product listing, ktorý renderuje `ProductCard`, MUSIA byť v `includes.product` prítomné:
```
'availableStock', 'isCloseout'
```
Tieto polia sa v Shopware API aplikujú globálne na všetky product entity v response — vrátane `children` (variantov). Bez nich budú varianty vždy oranžové alebo šedé (nezávisle od skutočného stavu skladu).

---

### §18. Off-canvas Drawers (Aero Standard)
Všetky vysúvacie panely (Filtre, Košík, Modálne okná z boku) musia dodržiavať „Aero“ vizuálny štandard.

- **Layout (Panel)**:
  - **Desktop**: Plávajúci panel, šírka `440px`. Pozícia: `top-4 right-4 bottom-4`.
  - **Mobile**: Plávajúci panel zospodu. Pozícia: `left-4 right-4 bottom-4`. Šírka: responzívna.
  - **Shadow**: `shadow-[0_40px_100px_rgba(0,0,0,0.15)]`.
  - **Border**: `border-gray-100`.
  - **Radius**: `rounded-none`.
- **Backdrop**:
  - `bg-black/30 backdrop-blur-sm`.
- **Header**:
  - **Typography**: Space Grotesk **Bold**, Tracking **0.2em**, Uppercase.
  - **Spacing**: `px-8 py-6`.
  - **Close Button**: `1:1` pomer strán (`w-10 h-10`), `bg-gray-900/5` (jemne sivý box).
- **Footer**:
  - Pozícia: `absolute bottom-0 left-0 right-0`.
  - Shadow: `shadow-[0_-10px_30px_rgba(0,0,0,0.03)]`.
  - Výška buttonov: `h-14`.
- **Transitions (Snappy Aero)**:
  - Funkcia: `cubic-bezier(0.16, 1, 0.3, 1)`.
  - Smer: Desktop (pravá), Mobile (spodná).

### Použitie (Usage)
```html
<QuantitySelector 
  v-model="quantity" 
  :min="1" 
  size="md" 
/>
```

### Design Špecifikácia
- **Layout**: Horizontálny flexbox. Vľavo interaktívny číselný vstup, vpravo vertikálna kolíska so šípkami (`ChevronUp`/`ChevronDown`).
- **Farby**: Pozadie `bg-gray-100/50`, text čierny `text-black`.
- **Písmo**: Číslo používa `font-tech font-black text-xl` (alebo `text-lg` pre `size="sm"`).
- **Interakcia**: 
  - Kliknutia na šípky menia stav o 1.
  - Priame písanie do inputu je povolené s okamžitou validáciou.
  - Pri zmene sa emituje `update:modelValue`.

### Veľkosti (Sizes)
| Veľkosť | Výška | Použitie |
|:---|:---|:---|
| `md` | `h-14` | PDP (Product Detail Page) |
| `sm` | `h-11` | Listing (Product Card a Search) |

---

## 17. Listing Quick Add (Hover overlay)

Kombinácia `QuantitySelector` (vždy `size="sm"`) a menšieho primary buttonu v rámci hover expansion overlay.

**Umiestnenie**: Spodná časť overlay-u (`absolute left-0 right-0 top-full`).
**Layout**: `flex items-center gap-2 h-11`.
**Button**: `AddToCartButton` s `variant="primary"`, upravenou výškou `h-full` a zmenšeným textom `text-[11px]`.

---

## 18. Pravidlá pre Varianty v Listingu

1. **Žiadne textové labely o počte** — Nikdy nezobrazovať "1 VARIANTOV DOSTUPNÝCH".
2. **Chipy Variantov** — Zobraziť mriežku variantov (veľkostí) s farebným okrajom indikujúcim dostupnosť:
   - **Dostupné**: `border-gray-200 hover:border-emerald-500 hover:bg-emerald-50`
   - **Nízke zásoby**: `border-gray-200 hover:border-amber-400 hover:bg-amber-50`
   - **Vypredané**: `border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed` so šikmým prečiarknutím.

---

## 19. SEO Linking Standard

Všetky interaktívne prvky, ktoré smerujú na Shopware entitu (Produkt, Kategória, CMS), musia byť technicky realizované pomocou **BaseLink** komponentu.

### §19.1 BaseLink Komponent (Smart Link)
- **Účel**: Zabezpečuje, aby URL adresy boli vždy SEO-friendly, lokalizované a konzistentné s Page Resolverom (`[...all].vue`).
- **Použitie**: Namiesto manuálneho konštruovania ciest používaj `<BaseLink :to="product">`.
- **Produktový pattern**: Resolver automaticky generuje cesty vo formáte `/[slugified-name]/[sku]`.
- **Lokalizácia**: Komponent automaticky pridáva locale prefix (napr. `/cz/...`) podľa aktuálneho jazyka.
---

## 20. Navbar Scroll Behavior & Animation

Standardizovaný mechanizmus pre skrývanie častí navigácie pri scrolle (Sticky behavior).

### §20.1 Logic (Kedy sa čo skrýva)
| Page Type | Hides TopBar | Hides DesktopNav |
|:---|:---:|:---:|
| **Homepage** | ✅ Áno | ❌ Nie |
| **Category Listing** | ✅ Áno | ✅ Áno |
| **Product Detail** | ✅ Áno | ❌ Nie |
| **Search / Other** | ✅ Áno | ✅ Áno |

### §20.2 Animation Standard (Snappy / Instant)
Každá skrývaná časť (TopBar, DesktopNav) musí byť extrémne rýchla (snappy) a bez vizuálnych posunov:

1.  **Wrapper Collapse**:
    *   Transition: `transition-[max-height,opacity] duration-150 ease-linear`
    *   States: `max-height: 0` vs `max-height: [original-height]`
2.  **Content Transition**:
    *   Transition: `transition-all duration-150 ease-linear`
    *   States Hide: `opacity-0` + `pointer-events-none` (žiadne translate/posuvy)
    *   States Show: `opacity-100` + `pointer-events-auto`

---

## 21. Performance & GPU Boost Standard

Mandatórne pravidlo pre zabezpečenie 120Hz / 60FPS používateľského zážitku na všetkých zariadeniach.

### §21.1 GPU Layer Promotion
Každý element, ktorý obsahuje `transition` alebo `animation`, MUSÍ byť explicitne povýšený na vlastnú kompozičnú vrstvu (GPU layout), aby sa predišlo prepočítavaniu (Reflow) na hlavnom vlákne CPU.

**Technické požiadavky:**
1.  **Will-Change**: Použiť `will-change: [property]` pre informovanie prehliadača o nadchádzajúcej zmene.
2.  **3D Transform**: Použiť `transform: translateZ(0)` (alebo `translate3d(0,0,0)`) na vynútenie hardvérovej akcelerácie.
3.  **Backface Visibility**: Pri komplexných animáciách použiť `backface-visibility: hidden`.

### §21.2 Použitie v kóde
V projekte používame centralizovaný UnoCSS shortcut `gpu-boost`:
```html
<div class="transition-all duration-150 gpu-boost"> ... </div>
```

**Zoznam povinných prvkov pre GPU Boost:**
- Všetky buttony a interaktívne ikony.
- Hover efekty na kartách produktov.
- Výsuvné panely (Sidebars, Drawers, Modals).
- Sticky toolbars a sticky headers.
- Skeleton loaders s pulzujúcou animáciou.
+
+---
+
+## 22. Aero Product Card Standard — Single Source of Truth
+
+> **ABSOLÚTNE PRAVIDLO:** Každý product listing, carousel alebo sekcia zobrazujúca produkty MUSÍ použiť `<ProductCard :product=”product” />` (`app/components/frontend/product/ProductCard.vue`). Žiadny inline product template v inej komponente.
+> **Dôvod:** Zmena dizajnu v ProductCard sa prejaví všade automaticky — listing, search, homepage, carousel.
+
+### §22.0 Použitie a povinné API includes
+
+```vue
+<!-- ✅ SPRÁVNE -->
+<ProductCard v-for=”product in products” :key=”product.id” :product=”product” />
+<!-- ❌ ZAKÁZANÉ — inline produkt template mimo ProductCard -->
+```
+
+**API `includes.product` — povinné minimálne polia pre ProductCard:**
+```
+'id', 'name', 'translated', 'cover', 'manufacturer', 'options',
+'seoUrls', 'calculatedPrice', 'childCount', 'available', 'availableStock',
+'isCloseout', 'children', 'media', 'ratingAverage', 'productReviewsCount'
+```
+Bez `availableStock` a `isCloseout` sa stock stav variantov zobrazí nesprávne (viď §17.1).
+
+Definuje vzhľad a interakciu primárnej produktovej karty v listingoch a na homepage. Každá karta musí spĺňať tieto kritériá pre zachovanie „Aero” estetiky.
+
+### §22.1 Image Blending & Background
+Všetky produktové fotky s bielym pozadím (default zo Shopware) musia byť vizuálne integrované do karty bez viditeľných „bielych boxov“.
+- **Technika**: Povinné použitie `mix-blend-multiply` na `<NuxtImg>` elemente.
+- **Pozadie**: Pod obrázkom MUSÍ byť šedý podklad `bg-gray-50`.
+- **Stacking Context isolation (Dôležité)**: Šedé pozadie musí byť definované na rovnakom kompozičnom elemente, ktorý nesie animáciu a `will-change-transform`. V opačnom prípade blendovanie zlyhá a zobrazí sa biele pozadie fotky.
+
+### §22.2 Image Slider & Progress Bar
+Karta podporuje prezeranie viacerých obrázkov priamo v listingu bez prechodu na detail.
+- **Technológia**: Slider musí byť postavený na `transform: translateX` (GPU akcelerované), nie na natívnom scrolle.
+- **Indikátor**: Full-width dynamický progres bar na spodnej hrane obrázka.
+  - **Šírka indikátora**: `100 / počet_obrázkov %`.
+  - **Farba dráhy**: `bg-gray-200/50`.
+  - **Farba indikátora**: `bg-brand` (SLICKLY Červená).
+
+### §22.3 Synchronizácia a Timing
+Pohyb obrázka a pohyb červeného indikátora musia byť v dokonalej harmónii.
+- **Trvanie (Duration)**: `500ms`.
+- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)`.
+- **Mobilné gestá**: Povinná podpora pre Swipe, ktorý vyvolá tú istú synchronizovanú animáciu.
+
+### §22.4 Interakcia
+- **Zobrazenie prvkov**: Ovládacie šípky a progres bar sa na desktope zobrazujú **IBA pri hoveri** (`md:opacity-0 md:group-hover:opacity-100`).
+- **Zameranie**: Pri hoveri sa karte pridáva výrazný tieň a prekrýva susedné karty (`z-20 shadow-xl`), čím sa eliminuje vizuálny hluk.

---

## 23. State Management — Pinia (ŠTANDARD)

> **Pinia je jediný povolený globálny state manager.** `useState` z Nuxt je zakázané pre zdieľaný stav — výhradne pre lokálny SSR hydration seed, ak je to nevyhnutné.

### §23.1 Dostupné stores

| Store | Súbor | Čo spravuje |
|:---|:---|:---|
| `useUiStore` | `app/stores/ui.ts` | Stav UI: cart sidebar, mobile menu, mobile search overlay |
| `usePageLoaderStore` | `app/stores/pageLoader.ts` | Globálny page loader overlay (`isLoading`, `suppressOverlay`) |
| `useAuthStore` | `app/stores/auth.ts` | Auth loading stav |
| `useWishlistStore` | `app/stores/wishlist.ts` | Wishlist items, toggle, load — priamy Store API prístup |

### §23.2 Pravidlá

1. **Každý nový globálny stav** (zdieľaný medzi viac ako jedným komponentom) **= nový Pinia store** v `app/stores/`.
2. **Composable = thin wrapper**: Composably ako `useCustomerWishlist`, `usePageLoader`, `useUiState` sú iba aliasy — delegujú na store. Existujú pre spätnú kompatibilitu volaní v komponentoch.
   ```typescript
   // ✅ Správny vzor composable-as-alias
   export const usePageLoader = () => usePageLoaderStore();
   ```
3. **Žiadne duplicitné exporty typov**: Ak store exportuje interface/type, composable ho NESMIE re-exportovať — Nuxt auto-import vidí duplicitu. Komponenty importujú typy priamo zo store súboru.
   ```typescript
   // ❌ ZAKÁZANÉ — spôsobuje "Duplicated imports" warning
   export type { WishlistProduct } from '~/stores/wishlist';

   // ✅ V komponente priamo
   import type { WishlistProduct } from '~/stores/wishlist';
   ```
4. **Auto-import funguje automaticky**: `@pinia/nuxt` registruje všetky stores z `app/stores/` — žiadny manuálny import `useXxxStore` v komponentoch nie je potrebný.
5. **`useState` je povolené IBA** pre SSR seed hodnoty (napr. initial `isLoading: true` pri SSR renderovaní), nie pre dlhodobo zdieľaný stav.

### §23.3 Šablóna nového store

```typescript
// app/stores/example.ts
import { defineStore } from 'pinia';

export const useExampleStore = defineStore('example', () => {
    const state = ref(false);

    function toggle() {
        state.value = !state.value;
    }

    return { state, toggle };
});
```

### §23.4 Použitie v komponente

```vue
<script setup lang="ts">
// Priamo — auto-importované cez @pinia/nuxt
const { isCartSidebarOpen, toggleCartSidebar } = useUiStore();

// Alebo cez composable alias (ak existuje)
const { isLoading } = usePageLoader();
</script>
```


---

## �24 Chat � AI Asistent (ChatBot.vue)

### �24.1 Pravidl� zobrazenia produktov

**ABSOL�TNE PRAVIDLO:** Ka�d� produkt spom�nan� v AI odpovedi MUS� by� zobrazen� ako ChatProductCard mini.

- AI v�dy vracia ID produktov vo form�te [[IDS: id1, id2]]
- Frontend parsuje IDs � POST /api/chat/product-cards � async fetch zo Shopware
- Karty sa zobrazia POD textom odpovede
- Ak AI nevr�tila IDs pre produkt = bug v system instruction � opravi� prompt

### �24.2 ChatProductCard mini � �trukt�ra

`
-����������������������������������
- [IMG 72x72] - BRAND (small)     -
-             - N�zov produktu    -
-             - 299 � (�krt 349�) -
L���������������������������������-
`

- Obr�zok: Shopware cover thumbnail (400px+), /mts-proxy proxy v dev
- Navig�cia: NuxtLink :to="seoPath" (nie /detail/UUID)
- Discount badge: �erven� -XX% ak listPrice > price
- Brand: ont-tech, uppercase, gray-400, 10px
- Cena: ont-tech font-black 15px
- Hover: order-brand/30, text 	ext-brand

### �24.3 Komponenty

| Komponent | S�bor | Popis |
|-----------|-------|-------|
| ChatProductCard | pp/components/chat/ChatProductCard.vue | Mini karta produktu v chate |
| Chat API | server/api/chat/product-cards.post.ts | Fetch product cards by IDs |
| AI chat | server/api/gemini/chat.post.ts | Claude + catalog context |
| Product catalog | server/utils/productCatalog.ts | Redis cache 7 dn�, 2000+ produktov |


---

## 23. Modálne okno — Štandard

> **ZÁVÄZNÉ:** Každé modálne okno v projekte MUSÍ používať komponent `app/components/ui/AppModal.vue`.
> Nikdy nevytváraj vlastný modal overlay — vždy volaj `<AppModal>`.

### Použitie

```vue
<AppModal :is-open="showModal" title="NADPIS MODALU" @close="showModal = false">
  <!-- obsah -->
</AppModal>
```

### Vlastnosti AppModal

| Prop / Emit | Typ | Popis |
|------------|-----|-------|
| `isOpen` | `boolean` | Otvoriť / zatvoriť modal |
| `title` | `string` | Nadpis — zobrazí sa ako `font-tech uppercase` |
| `@close` | emit | Zatvoriť (X button alebo klik na overlay) |

### Vizuálny štandard (z AppModal.vue)

- **Overlay:** `bg-black/50 backdrop-blur-sm` — stmavenie + blur
- **Container:** `max-w-lg bg-white p-8 shadow-2xl rounded-sm`
- **Z-index:** `z-[100]` (nad navbarom)
- **Animácia:** fade in/out 300ms
- **Nadpis:** `font-tech font-bold uppercase tracking-wider text-xl text-black`
- **X button:** `absolute top-4 right-4` — šedý, hover čierny
- **Obsah slot:** `max-h-[70vh] overflow-y-auto` — scrollovateľný ak dlhý
- **Body lock:** `document.body.style.overflow = 'hidden'` pri otvorení

### Príklad — otváracie hodiny modal

```vue
<AppModal :is-open="showHoursModal" title="OTVÁRACIE HODINY" @close="showHoursModal = false">
  <div class="space-y-4">
    <!-- hodiny content -->
  </div>
</AppModal>
```

### Pravidlo pre AI

Keď dostaneš inštrukciu **"vytvor modálne okno"** alebo **"vytvor modal"**:
1. Importuj `AppModal` z `~/components/ui/AppModal.vue`
2. Pridaj `ref(false)` pre viditeľnosť
3. Wrap obsah do `<AppModal :is-open="..." title="..." @close="...">`
4. **NIKDY** nevytváraj vlastný `fixed inset-0` overlay

