import {
  defineConfig,
  presetUno,
  presetIcons,
  presetWebFonts,
  transformerDirectives,
} from 'unocss'

/**
 * UnoCSS Configuration — SLICKLY Design System 1.0 ("Minimalist Precision")
 * ─────────────────────────────────────────────────
 * Toto je implementácia design.md (pozri koreň projektu).
 * Každá shortcut tu definovaná zodpovedá sekcii v design.md.
 * NEPRIDÁVAJ inline styles ani hardcoded farby do šablón —
 * použi tokeny a skratky definované tu.
 *
 * Identita: čierna (#000000) primárna + Slickly Amber (#FFBF00) akcent,
 * font Space Grotesk (jediný font na celom webe — text aj nadpisy),
 * rounded-default (6px), žiadne agresívne skew/italic.
 */
export default defineConfig({
  presets: [
    presetUno(),
    presetIcons(),
    presetWebFonts({
      provider: 'none',
      fonts: {
        // design.md §3 — Typografia. Oba shortcuty mapujú na rovnaký font
        // (jednotný Space Grotesk), ponechané samostatne aby sa nemuseli
        // meniť stovky existujúcich font-sans/font-tech použití v šablónach.
        sans: 'Space Grotesk',
        tech: 'Space Grotesk',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],

  theme: {
    // design.md §5 — Shape: 6px na CTA, inputy, karty; 3px na malé prvky (badge,
    // malé buttony) — rounded-sm. NIKDY rounded-full na tlačidlá.
    borderRadius: {
      DEFAULT: '6px',
      default: '6px',
      sm: '3px',
    },
    colors: {
      // design.md §2 — Farby (Minimalist Precision)
      brand: {
        DEFAULT: '#000000', // Primárne CTA, header, logo
        dark: '#1A1A1A',    // Hover stav primary buttonu
      },
      // Slickly Amber — akcenty, badge, highlight
      amber: {
        DEFAULT: '#FFBF00',
        dark: '#E6AC00',
      },
      success: {
        DEFAULT: '#1B7D3A',
        light: '#EEF7F0', // Light background for hovers
      },
      error: {
        DEFAULT: '#BA1A1A',
      },
    },
    letterSpacing: {
      wide: '0.05em',
      wider: '0.08em',
      widest: '0.15em',
    },
    animation: {
      // design.md §9 — Animácie
      keyframes: {
        fadeIn: '{0%{opacity:0}100%{opacity:1}}',
        slideUp: '{0%{transform:translateY(20px);opacity:0}100%{transform:translateY(0);opacity:1}}',
      },
      durations: {
        'fade-in': '0.5s',
        'slide-up': '0.8s',
        'pulse-slow': '3s',
      },
      timingFns: {
        'fade-in': 'ease-out',
        'slide-up': 'ease-out',
        'pulse-slow': 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
      counts: {
        'pulse-slow': 'infinite',
      },
    },
  },

  shortcuts: {
    // ── design.md §21 — GPU Boost Standard ──────────────────────────────────
    'gpu-boost': 'will-change-transform translate-z-0 backface-hidden',

    // ── design.md §8 — Glass Panel ──────────────────────────────────────────
    'glass-panel': 'bg-white/90 backdrop-blur-md',

    // ── design.md §3 — Section H2 Typography (minimalist, bez italic/skew) ──
    // Použitie: <h2 class="section-h2">Nadpis <span class="text-amber">slovo</span></h2>
    'section-h2': 'text-3xl md:text-4xl lg:text-5xl font-bold uppercase font-tech tracking-tight leading-tight',

    // ── design.md §8 — Section Decorator (amber čiara pod H2, bez skew) ─────
    // Použitie: <div class="section-decorator mb-6"></div>
    'section-decorator': 'w-16 h-1 bg-amber rounded-default',

    // ── Homepage uplift — Section Eyebrow (malý kicker label nad section-h2) ──
    // Použitie: <span class="section-eyebrow">Kicker text</span>
    'section-eyebrow': 'inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 font-tech mb-3',

    // ── Homepage uplift — Card Surface (mäkká hĺbka namiesto plochého 1px borderu) ──
    // Nahrádza opakovaný vzor `bg-white border border-gray-100 rounded-default` na
    // kartách (recenzie, blog, skeleton) jemným difúznym tieňom + hover-lift.
    'card-surface': 'bg-white rounded-default shadow-[0_2px_20px_-6px_rgba(0,0,0,0.08)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.16)] hover:-translate-y-1',

    // ── Homepage uplift — CTA button s hover motion (nahrádza opakovaný
    // `bg-black hover:bg-black/80 px-8 py-4` vzor bez akéhokoľvek pohybu) ──
    'btn-cta-motion': 'inline-flex items-center justify-center gap-3 bg-black text-white font-tech font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-default transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-brand-dark hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.35)] active:scale-[0.98] active:translate-y-0 gpu-boost',

    // ── Homepage uplift — Scroll Reveal (GPU-safe: len transform + opacity) ──
    // Použitie s useScrollReveal(): :class="isVisible ? 'reveal-visible' : 'reveal'"
    'reveal': 'opacity-0 translate-y-8',
    'reveal-visible': 'opacity-100 translate-y-0',
    'reveal-base': 'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',

    // ── design.md §8 — Brand Badge (amber štítok, bez skew) ─────────────────
    // Obal: <div class="brand-badge"><span class="brand-badge-text">TEXT</span></div>
    'brand-badge': 'inline-block bg-amber px-3 py-1 rounded-default',
    'brand-badge-text': 'block text-black text-xs font-bold uppercase tracking-widest font-tech',

    // ── design.md §4 — Nav Arrow Buttons (carousel scroll) ──────────────────
    'btn-nav-arrow': 'w-12 h-12 border border-gray-200 bg-white hover:border-black hover:bg-black hover:text-white flex items-center justify-center transition-all duration-300 rounded-default shadow-sm gpu-boost',

    // ── design.md §4 — Tab/Filter Buttons ───────────────────────────────────
    'btn-tab-active': 'px-5 py-2 rounded-default text-sm font-bold uppercase tracking-wider border bg-black border-black text-white shadow-lg font-sans transition-all duration-300 gpu-boost',
    'btn-tab-inactive': 'px-5 py-2 rounded-default text-sm font-bold uppercase tracking-wider border bg-white border-gray-200 text-gray-600 hover:border-black hover:text-black font-sans transition-all duration-300 gpu-boost',

    // ── design.md §4 — Action Grid Button (PDP: Wishlist, Compare, Watch) ───
    // POZOR: 'group' NIE je súčasť skratky — pridaj ho priamo na element v šablóne:
    // <button class="btn-action-grid group">
    'btn-action-grid': 'flex flex-col items-center justify-center min-h-[44px] py-2 px-1 bg-white border border-gray-200 hover:border-black hover:text-black transition-colors text-black text-[10px] font-bold uppercase text-center rounded-default gpu-boost',

    // ── design.md §6 — Form Inputs ───────────────────────────────────────────
    'form-input': 'w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-black focus:bg-white transition-all duration-300 outline-none text-sm font-medium font-sans rounded-default gpu-boost',
    'form-input-with-icon': 'w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-black focus:bg-white transition-all duration-300 outline-none text-sm font-medium font-sans rounded-default gpu-boost',
    'form-label': 'block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2',

    // ── design.md §8 — Tech Corners (tmavé karty, mapa) — amber akcent ──────
    'tech-corner-tl': 'absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber z-10',
    'tech-corner-br': 'absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber z-10',

    // ── design.md §4 — Checkout / Full-width CTA ────────────────────────────
    'btn-checkout': 'w-full py-4 bg-amber text-black font-bold uppercase tracking-widest shadow-xl hover:bg-amber-dark transition-all duration-300 flex items-center justify-center rounded-default gpu-boost',

    // ── design.md §4 — Secondary Button (Light variant) ─────────────────────
    'btn-secondary': 'bg-[#f7f9fa] text-[#5F6D7E] hover:bg-gray-100 hover:text-black transition-all duration-300 font-bold uppercase tracking-widest rounded-default gpu-boost',
  },

  rules: [
    // Scrollbar hide (pre carousel/horizontal scroll)
    [/^scrollbar-hide$/, ([], { rawSelector }) => `
      ${rawSelector}::-webkit-scrollbar { display: none; }
      ${rawSelector} { -ms-overflow-style: none; scrollbar-width: none; }
    `],
    ['scrollbar-default', {
      'scrollbar-width': 'auto',
    }],
    // Safe-area insets (notch/home indicator) — presetUno tieto utility negeneruje,
    // bez definície boli pb-safe/pt-safe v šablónach tichý no-op. Vyžaduje
    // viewport-fit=cover vo viewport meta (nuxt.config), inak env() vracia 0.
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
  ],

  content: {
    pipeline: {
      include: [
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        '../vue-starter-template/app/**/*.vue',
        './node_modules/@shopware/**/app/**/*.vue',
      ],
    },
  },
})
