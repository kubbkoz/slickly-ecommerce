/**
 * useSearchIntent — Tier 2 Intelligent Search Routing
 *
 * Intercepts search queries BEFORE sending to Shopware and resolves them
 * to smarter navigation targets:
 *
 *  "bicykel"           → /bicykle (category redirect)
 *  "ebike"             → /elektrobicykle (synonym → category)
 *  "horský bicykel"    → Horské bicykle subcategory (if in nav tree cache)
 *  "do 1000€"          → /search?search=...&max_price=1000
 *  "bicykel skladom"   → /search?search=bicykel&in_stock=1
 *  "superior"          → /search?search=superior (brand → passthrough)
 *
 * Cache key strategy:
 *  DesktopNav.vue uses  → `desktop-nav-${languageId}`   (on EVERY page, with children)
 *  useCategory.ts uses  → `global-navigation-tree-${locale}` (on category pages, with children)
 *  We try both so intent routing works regardless of which page the user is on.
 */

import { useNuxtApp, useI18n, useShopwareLanguage, useShopwareContext } from '#imports';
import { getCategoryUrl } from '~/utils/url';

// ── Normalizer ─────────────────────────────────────────────────────────────────
const norm = (s: string): string =>
    s.toLowerCase().normalize('NFD').replace(/\p{Mn}/gu, '').trim();

// ── Synonym map: normalized alias → normalized category name ───────────────────
// Category names are matched against live nav tree (no hardcoded slugs).
const SYNONYMS: Record<string, string> = {
    // ── Bicycles — generic ──────────────────────────────────────────────────
    'bicykel':                   'bicykle',
    'bike':                      'bicykle',
    'kolo':                      'bicykle',
    'koleso':                    'bicykle',
    'dvojkolka':                 'bicykle',
    'cyklistika':                'bicykle',

    // ── E-bikes — generic ───────────────────────────────────────────────────
    'elektrobicykel':            'elektrobicykle',
    'ebike':                     'elektrobicykle',
    'e-bike':                    'elektrobicykle',
    'elektrobike':               'elektrobicykle',
    'elektrokolo':               'elektrobicykle',
    'pedelec':                   'elektrobicykle',
    'elektricky bicykel':        'elektrobicykle',
    'elektricke bicykle':        'elektrobicykle',

    // ── Bicycles — subcategories ─────────────────────────────────────────────
    'horsky bicykel':            'horske bicykle',
    'horske bicykle':            'horske bicykle',
    'mtb':                       'horske bicykle',
    'mountain bike':             'horske bicykle',
    'xc':                        'horske bicykle',
    'horsko':                    'horske bicykle',

    'celoodpruzeny':             'celoodprusene bicykle',
    'celoodpruzene':             'celoodprusene bicykle',
    'full suspension':           'celoodprusene bicykle',
    'full sus':                  'celoodprusene bicykle',
    'fullsuspension':            'celoodprusene bicykle',

    'kros':                      'krosove bicykle',
    'crossovy bicykel':          'krosove bicykle',
    'krosovy bicykel':           'krosove bicykle',
    'krosove bicykle':           'krosove bicykle',
    'cross':                     'krosove bicykle',
    'crossover':                 'krosove bicykle',

    'treking':                   'trekingove bicykle',
    'trekingovy bicykel':        'trekingove bicykle',
    'trekingove bicykle':        'trekingove bicykle',
    'trekking':                  'trekingove bicykle',

    'gravel':                    'gravel bicykle',
    'gravelbike':                'gravel bicykle',
    'gravel bike':               'gravel bicykle',

    'cestny bicykel':            'cestne bicykle',
    'cestne bicykle':            'cestne bicykle',
    'silnicny bicykel':          'cestne bicykle',
    'road bike':                 'cestne bicykle',

    'mestsky bicykel':           'mestske bicykle',
    'mestske bicykle':           'mestske bicykle',
    'city bike':                 'mestske bicykle',
    'bicykel do mesta':          'mestske bicykle',
    'mestska':                   'mestske bicykle',

    'detsky bicykel':            'detske bicykle',
    'detske bicykle':            'detske bicykle',
    'bicykel pre dieta':         'detske bicykle',
    'kolieska':                  'detske bicykle',

    'odrazadlo':                 'odrazadla',
    'odrazadla':                 'odrazadla',
    'bezkolo':                   'odrazadla',
    'run bike':                  'odrazadla',

    'bmx':                       'dirt a bmx',
    'dirt':                      'dirt a bmx',
    'dirtjump':                  'dirt a bmx',

    // ── E-bikes — subcategories ──────────────────────────────────────────────
    'mestsky ebike':             'mestske elektrobicykle',
    'ebike do mesta':            'mestske elektrobicykle',
    'city ebike':                'mestske elektrobicykle',
    'elektricky bicykel do mesta':'mestske elektrobicykle',
    'mestske elektrobicykle':    'mestske elektrobicykle',

    'horsky ebike':              'horske elektrobicykle',
    'horske elektrobicykle':     'horske elektrobicykle',
    'ebike mtb':                 'horske elektrobicykle',
    'mtb ebike':                 'horske elektrobicykle',
    'hardtail ebike':            'horske elektrobicykle',

    'full sus ebike':            'celoodprusene elektrobicykle',
    'celoodpruzeny ebike':       'celoodprusene elektrobicykle',

    'trekingovy ebike':          'trekingove elektrobicykle',
    'trekingove elektrobicykle': 'trekingove elektrobicykle',
    'trekking ebike':            'trekingove elektrobicykle',

    // ── Other top-level categories ────────────────────────────────────────────
    'doplnky':                   'doplnky k bicyklom',
    'doplnky k bicyklom':        'doplnky k bicyklom',
    'prislusenstvo':             'doplnky k bicyklom',
    'accessory':                 'doplnky k bicyklom',

    'komponenty':                'komponenty k bicyklom',
    'komponenty k bicyklom':     'komponenty k bicyklom',
    'diely':                     'komponenty k bicyklom',
    'nahradne diely':            'komponenty k bicyklom',
    'nahradny diel':             'komponenty k bicyklom',

    'oblecenie':                 'oblecenie',
    'cyklisticke oblecenie':     'oblecenie',
    'dres':                      'oblecenie',
    'dres na bicykel':           'oblecenie',
    'cyklisticke obliecanie':    'oblecenie',
};

// ── Filter pattern extractors ──────────────────────────────────────────────────
interface ExtractedFilters {
    maxPrice?: number;
    inStock?:  boolean;
    /** Remaining query after stripping filter fragments */
    cleanQuery: string;
}

const extractFilters = (normalizedQuery: string): ExtractedFilters => {
    let q = normalizedQuery;
    let maxPrice: number | undefined;
    let inStock: boolean | undefined;

    // Price: "do 1000€", "do 500 eur", "pod 2000", "lacnejsi ako 300"
    const priceRx = /(?:do|pod|max|lacne(?:js[ií]?\s*)?ako)\s+(\d[\d\s]*)\s*(?:€|eur)?/gi;
    const pm = priceRx.exec(q);
    if (pm) {
        maxPrice = parseInt(pm[1]?.replace(/\s/g, '') || '');
        q = q.replace(pm[0], '').trim();
    }

    // In stock: "skladom", "na sklade", "ihned dostupny"
    if (/skladom|na\s+sklade|ihne[dď]\s+dostupn/.test(q)) {
        inStock = true;
        q = q.replace(/skladom|na\s+sklade|ihne[dď]\s+dostupn\w*/g, '').trim();
    }

    return { maxPrice, inStock, cleanQuery: q.trim() };
};

// ── Build search URL with optional filter params ────────────────────────────────
const buildSearchUrl = (query: string, filters: Omit<ExtractedFilters, 'cleanQuery'>): string => {
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (filters.maxPrice) params.set('max_price', String(filters.maxPrice));
    if (filters.inStock)  params.set('in_stock', '1');
    return `/search?${params.toString()}`;
};

// ── Internal helpers ───────────────────────────────────────────────────────────

/** Build category URL map from nav tree (level-2 + level-3 children) */
const buildCatMap = (navCategories: any[]): Map<string, string> => {
    const catMap = new Map<string, string>();
    for (const cat of navCategories) {
        const name = norm(cat.translated?.name || cat.name || '');
        if (name) catMap.set(name, getCategoryUrl(cat));
        for (const child of cat.children ?? []) {
            const childName = norm(child.translated?.name || child.name || '');
            if (childName) catMap.set(childName, getCategoryUrl(child));
        }
    }
    return catMap;
};

/** Try to match key → category URL via synonym, direct name, or partial word match */
const lookupCategory = (key: string, catMap: Map<string, string>): string | undefined => {
    const canonical = SYNONYMS[key];
    if (canonical && catMap.has(canonical)) return catMap.get(canonical);
    if (catMap.has(key)) return catMap.get(key);
    // Partial: all meaningful words must appear in a category name
    const words = key.split(/\s+/).filter(w => w.length > 2);
    if (!words.length) return undefined;
    for (const [catName, catUrl] of catMap) {
        if (words.every(w => catName.includes(w))) return catUrl;
    }
    return undefined;
};

/**
 * Greedy n-gram search: finds the LONGEST contiguous word sequence
 * that matches a known category, returns the match + remaining words.
 *
 * "horsky bicykel ctm" → { categoryUrl: '/horske-bicykle', remainingWords: ['ctm'] }
 * "ebike dema 2024"    → { categoryUrl: '/elektrobicykle', remainingWords: ['dema', '2024'] }
 */
const findCategoryWithRemainder = (
    words: string[],
    catMap: Map<string, string>,
): { categoryUrl: string; remainingWords: string[] } | null => {
    const maxLen = Math.min(words.length, 4);
    for (let len = maxLen; len >= 1; len--) {
        for (let start = 0; start <= words.length - len; start++) {
            const ngram      = words.slice(start, start + len).join(' ');
            const categoryUrl = lookupCategory(ngram, catMap);
            if (categoryUrl) {
                const remainingWords = [
                    ...words.slice(0, start),
                    ...words.slice(start + len),
                ];
                return { categoryUrl, remainingWords };
            }
        }
    }
    return null;
};


// ── Public types ───────────────────────────────────────────────────────────────
export interface IntentResult {
    path:       string;
    isRedirect: boolean;
}

// ── Vue composable wrapper ─────────────────────────────────────────────────────
export const useSearchIntent = () => {
    const nuxtApp               = useNuxtApp();
    const { locale }            = useI18n();
    const { currentLanguageId } = useShopwareLanguage();

    // ── Read nav categories from Nuxt payload cache ──────────────────────────
    const getNavCategories = (): any[] => {
        const desktopNavKey = `desktop-nav-${currentLanguageId.value}`;
        const globalTreeKey = `global-navigation-tree-${locale.value}`;
        return (
            nuxtApp.payload.data?.[desktopNavKey]      ??
            (nuxtApp.static as any)?.data?.[desktopNavKey] ??
            nuxtApp.payload.data?.[globalTreeKey]      ??
            (nuxtApp.static as any)?.data?.[globalTreeKey] ??
            []
        );
    };

    /**
     * Main resolver:
     *
     *  Fast path (synchronous):
     *    "bicykel"           → { path: '/bicykle', isRedirect: true }
     *    "ebike"             → { path: '/elektrobicykle', isRedirect: true }
     *    "do 1000€"          → { path: '/search?max_price=1000', isRedirect: false }
     *
     *  Brand identification via remainder (sync):
     *    "ebike dema"        → { path: '/elektrobicykle?searchBrand=dema', isRedirect: true }
     *    "mtb superior"      → { path: '/horske-bicykle?searchBrand=superior', isRedirect: true }
     */
    const resolve = (query: string): IntentResult => {
        const q = query.trim();
        if (!q) return { path: '/search?search=', isRedirect: false };

        // 1. Extract filter patterns
        const { maxPrice, inStock, cleanQuery } = extractFilters(norm(q));
        const hasFilters = !!(maxPrice || inStock);

        // 2. Build category map
        const catMap = buildCatMap(getNavCategories());

        // 3. Fast path: full query matches a category
        const exactCatUrl = lookupCategory(cleanQuery, catMap);
        if (exactCatUrl && !hasFilters) {
            return { path: exactCatUrl, isRedirect: true };
        }

        // 4. Multi-word query: try to split into category + remainder
        const words = cleanQuery.split(/\s+/).filter(Boolean);
        if (words.length >= 2 && !hasFilters) {
            const match = findCategoryWithRemainder(words, catMap);
            if (match) {
                if (match.remainingWords.length === 0) {
                     return { path: match.categoryUrl, isRedirect: true };
                }
                
                // Construct searchBrand so FrontendNavigationPage 
                // can resolve against available listing brands
                const searchBrand = encodeURIComponent(match.remainingWords.join(' '));
                return {
                    path: `${match.categoryUrl}?searchBrand=${searchBrand}`,
                    isRedirect: true
                };
            }
        }

        // 5. Category with filters → search page (category pages don't support price URL params)
        if (exactCatUrl && hasFilters) {
            return { path: buildSearchUrl(q, { maxPrice, inStock }), isRedirect: false };
        }

        // 6. Passthrough: unrecognised query or filter-only
        return { path: buildSearchUrl(q, { maxPrice, inStock }), isRedirect: false };
    };

    return { resolve };
};

