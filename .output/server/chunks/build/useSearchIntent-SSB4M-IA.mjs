import { j as useNuxtApp, m as useI18n, G as getCategoryUrl } from './server.mjs';
import { u as useShopwareLanguage } from './useShopwareLanguage-CGPCneCN.mjs';

const norm = (s) => s.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Mn}", "gu"), "").trim();
const SYNONYMS = {
  // ── Exteriér ──────────────────────────────────────────────────────────────
  "exterier": "exterier",
  "exterior": "exterier",
  "umyvanie auta": "exterier",
  "mytie auta": "exterier",
  "vosk na auto": "exterier",
  "sampon na auto": "exterier",
  "vonkajsia starostlivost": "exterier",
  // ── Interiér ──────────────────────────────────────────────────────────────
  "interier": "interier",
  "interior": "interier",
  "cistenie interieru": "interier",
  "vnutro auta": "interier",
  "cistic na tapicie": "interier",
  // ── Leštenie ──────────────────────────────────────────────────────────────
  "lestenie": "lestenie",
  "polish": "lestenie",
  "polirovanie": "lestenie",
  "lesk": "lestenie",
  "lestidlo": "lestenie",
  "lestiaca pasta": "lestenie",
  // ── Ochrana karosérie ─────────────────────────────────────────────────────
  "ochrana karoserie": "ochrana karoserie",
  "ochranna folia": "ochrana karoserie",
  "keramicka ochrana": "ochrana karoserie",
  "ceramic coating": "ochrana karoserie",
  "karoseria": "ochrana karoserie",
  "ochrana laku": "ochrana karoserie",
  // ── Príslušenstvo ─────────────────────────────────────────────────────────
  "prislusenstvo": "prislusenstvo",
  "doplnky": "prislusenstvo",
  "accessory": "prislusenstvo",
  "handricky": "prislusenstvo",
  "mikrovlaknova handricka": "prislusenstvo",
  "hubky": "prislusenstvo",
  "vedra": "prislusenstvo",
  // ── Špeciálna ponuka ──────────────────────────────────────────────────────
  "akcia": "specialna ponuka",
  "akcie": "specialna ponuka",
  "zlava": "specialna ponuka",
  "zlavy": "specialna ponuka",
  "vypredaj": "specialna ponuka",
  "special offer": "specialna ponuka"
};
const extractFilters = (normalizedQuery) => {
  let q = normalizedQuery;
  let maxPrice;
  let inStock;
  const priceRx = /(?:do|pod|max|lacne(?:js[ií]?\s*)?ako)\s+(\d[\d\s]*)\s*(?:€|eur)?/gi;
  const pm = priceRx.exec(q);
  if (pm) {
    maxPrice = parseInt(pm[1]?.replace(/\s/g, "") || "");
    q = q.replace(pm[0], "").trim();
  }
  if (/skladom|na\s+sklade|ihne[dď]\s+dostupn/.test(q)) {
    inStock = true;
    q = q.replace(/skladom|na\s+sklade|ihne[dď]\s+dostupn\w*/g, "").trim();
  }
  return { maxPrice, inStock, cleanQuery: q.trim() };
};
const buildSearchUrl = (query, filters) => {
  const params = new URLSearchParams();
  if (query) params.set("search", query);
  if (filters.maxPrice) params.set("max_price", String(filters.maxPrice));
  if (filters.inStock) params.set("in_stock", "1");
  return `/search?${params.toString()}`;
};
const buildCatMap = (navCategories) => {
  const catMap = /* @__PURE__ */ new Map();
  for (const cat of navCategories) {
    const name = norm(cat.translated?.name || cat.name || "");
    if (name) catMap.set(name, getCategoryUrl(cat));
    for (const child of cat.children ?? []) {
      const childName = norm(child.translated?.name || child.name || "");
      if (childName) catMap.set(childName, getCategoryUrl(child));
    }
  }
  return catMap;
};
const lookupCategory = (key, catMap) => {
  const canonical = SYNONYMS[key];
  if (canonical && catMap.has(canonical)) return catMap.get(canonical);
  if (catMap.has(key)) return catMap.get(key);
  const words = key.split(/\s+/).filter((w) => w.length > 2);
  if (!words.length) return void 0;
  for (const [catName, catUrl] of catMap) {
    if (words.every((w) => catName.includes(w))) return catUrl;
  }
  return void 0;
};
const findCategoryWithRemainder = (words, catMap) => {
  const maxLen = Math.min(words.length, 4);
  for (let len = maxLen; len >= 1; len--) {
    for (let start = 0; start <= words.length - len; start++) {
      const ngram = words.slice(start, start + len).join(" ");
      const categoryUrl = lookupCategory(ngram, catMap);
      if (categoryUrl) {
        const remainingWords = [
          ...words.slice(0, start),
          ...words.slice(start + len)
        ];
        return { categoryUrl, remainingWords };
      }
    }
  }
  return null;
};
const useSearchIntent = () => {
  const nuxtApp = useNuxtApp();
  const { locale } = useI18n();
  const { currentLanguageId } = useShopwareLanguage();
  const getNavCategories = () => {
    const desktopNavKey = `desktop-nav-${currentLanguageId.value}`;
    const globalTreeKey = `global-navigation-tree-${locale.value}`;
    return nuxtApp.payload.data?.[desktopNavKey] ?? nuxtApp.static?.data?.[desktopNavKey] ?? nuxtApp.payload.data?.[globalTreeKey] ?? nuxtApp.static?.data?.[globalTreeKey] ?? [];
  };
  const resolve = (query) => {
    const q = query.trim();
    if (!q) return { path: "/search?search=", isRedirect: false };
    const { maxPrice, inStock, cleanQuery } = extractFilters(norm(q));
    const hasFilters = !!(maxPrice || inStock);
    const catMap = buildCatMap(getNavCategories());
    const exactCatUrl = lookupCategory(cleanQuery, catMap);
    if (exactCatUrl && !hasFilters) {
      return { path: exactCatUrl, isRedirect: true };
    }
    const words = cleanQuery.split(/\s+/).filter(Boolean);
    if (words.length >= 2 && !hasFilters) {
      const match = findCategoryWithRemainder(words, catMap);
      if (match) {
        if (match.remainingWords.length === 0) {
          return { path: match.categoryUrl, isRedirect: true };
        }
        const searchBrand = encodeURIComponent(match.remainingWords.join(" "));
        return {
          path: `${match.categoryUrl}?searchBrand=${searchBrand}`,
          isRedirect: true
        };
      }
    }
    if (exactCatUrl && hasFilters) {
      return { path: buildSearchUrl(q, { maxPrice, inStock }), isRedirect: false };
    }
    return { path: buildSearchUrl(q, { maxPrice, inStock }), isRedirect: false };
  };
  return { resolve };
};

export { useSearchIntent as u };
