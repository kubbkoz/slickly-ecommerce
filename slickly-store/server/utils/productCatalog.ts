const CACHE_KEY = 'catalog:products';
const TTL_SEC = 7 * 24 * 60 * 60; // 7 dní — obsah sa nemení, manuálna invalidácia cez reštart

export interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  description?: string;
  specs?: string;
  sizes?: string; // napr. "S,M,L,XL" alebo "15\",17\",19\",21\""
}

export async function getProductCatalog(): Promise<CatalogProduct[]> {
  const storage = useStorage('redis');
  const cached = await storage.getItem<CatalogProduct[]>(CACHE_KEY).catch(() => null);
  if (cached?.length) return cached;
  return fetchAndCacheCatalog();
}

export async function fetchAndCacheCatalog(): Promise<CatalogProduct[]> {
  const config = useRuntimeConfig();
  const endpoint = (config.public?.shopware?.endpoint as string) || 'https://mtsport.store/store-api/';
  const accessToken = (config.public?.shopware?.accessToken as string) || '';

  const PER_PAGE = 100;
  const MAX_PAGES = 100; // max 10 000 produktov
  const all: CatalogProduct[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    let res: any = null;
    try {
      res = await $fetch<any>(`${endpoint}product`, {
        method: 'POST',
        headers: {
          'sw-access-key': accessToken,
          Accept: 'application/json',
          'sw-include-seo-urls': 'false',
        },
        body: {
          limit: PER_PAGE,
          page,
          includes: {
            product: ['id', 'name', 'translated', 'description', 'calculatedPrice',
                      'manufacturer', 'categories', 'properties'],
            product_manufacturer: ['name', 'translated'],
            category: ['name', 'translated'],
            property_group_option: ['name', 'translated', 'group'],
            property_group: ['name', 'translated'],
            calculated_price: ['unitPrice']
          },
          associations: {
            manufacturer: {},
            categories: { limit: 1 },
            properties: { associations: { group: {} } }
          }
        },
      });
    } catch (err: any) {
      console.error(`[catalog] Shopware fetch page=${page} failed:`, err?.message || err);
      break;
    }

    const elements: any[] = res?.elements ?? res?.data?.elements ?? [];
    if (!elements.length) break;

    const mapped = elements.map((p: any) => {
      // Strip HTML from description, max 250 chars
      const rawDesc = p.translated?.description || p.description || '';
      const description = rawDesc
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 250) || undefined;

      // Properties — rozdelené na specs a sizes
      const sizeGroupNames = ['veľkosť', 'velkost', 'size', 'rám', 'ram', 'frame', 'velikost'];
      const specParts: string[] = [];
      const sizeParts: string[] = [];

      for (const prop of (p.properties || [])) {
        const groupName = (prop.group?.translated?.name || prop.group?.name || '').toLowerCase();
        const value = prop.translated?.name || prop.name || '';
        if (!groupName || !value) continue;

        if (sizeGroupNames.some(s => groupName.includes(s))) {
          sizeParts.push(value);
        } else {
          specParts.push(`${prop.group?.translated?.name || prop.group?.name}: ${value}`);
        }
      }

      // Fallback: skúsime vytiahnuť veľkosť aj z názvu produktu (napr. "... 17\"" alebo "... M ")
      if (!sizeParts.length) {
        const nameMatch = (p.translated?.name || p.name || '').match(/\b(XS|S|M|L|XL|XXL|\d{2}")\b/gi);
        if (nameMatch) sizeParts.push(...nameMatch);
      }

      const specs = specParts.join(', ') || undefined;
      const sizes = sizeParts.length ? [...new Set(sizeParts)].join(',') : undefined;

      return {
        id: p.id,
        name: p.translated?.name || p.name || '',
        category: p.categories?.[0]?.translated?.name || p.categories?.[0]?.name || '',
        brand: p.manufacturer?.translated?.name || p.manufacturer?.name || '',
        price: p.calculatedPrice?.unitPrice ?? 0,
        ...(description && { description }),
        ...(specs && { specs }),
        ...(sizes && { sizes }),
      };
    }).filter((p) => p.name);

    all.push(...mapped);

    // Ak stránka nie je plná → žiadna ďalšia
    if (elements.length < PER_PAGE) break;
  }

  if (!all.length) {
    console.warn('[catalog] No products loaded from Shopware');
    return [];
  }

  console.info(`[catalog] Fetched ${all.length} products from Shopware`);

  // Uložiť do Redis (30 min TTL)
  const storage = useStorage('redis');
  await storage.setItem(CACHE_KEY, all, { ttl: TTL_SEC }).catch(() => null);
  console.info(`[catalog] Saved ${all.length} products to Redis (TTL: ${TTL_SEC}s)`);

  return all;
}

// ─── Live search cez Shopware Store API (rovnaký engine ako category filter) ──

interface SearchParams {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  limit?: number;
}

export async function searchProducts(params: SearchParams): Promise<CatalogProduct[]> {
  const config = useRuntimeConfig();
  const endpoint = (config.public?.shopware?.endpoint as string) || 'https://mtsport.store/store-api/';
  const accessToken = (config.public?.shopware?.accessToken as string) || '';

  // Redis cache 5 min — rovnaké queries v krátkom čase
  const storage = useStorage('redis');
  const cacheKey = `chat-search:${JSON.stringify(params)}`;
  const cached = await storage.getItem<CatalogProduct[]>(cacheKey).catch(() => null);
  if (cached) return cached;

  const body: any = {
    limit: params.limit || 30,
    order: 'price-asc',
    includes: {
      product: ['id', 'name', 'translated', 'description', 'calculatedPrice',
                'manufacturer', 'categories', 'properties'],
      product_manufacturer: ['name', 'translated'],
      category: ['name', 'translated'],
      property_group_option: ['name', 'translated', 'group'],
      property_group: ['name', 'translated'],
      calculated_price: ['unitPrice'],
    },
    associations: {
      manufacturer: {},
      categories: { limit: 1 },
      properties: { associations: { group: {} } }
    }
  };

  if (params.query) body.search = params.query;
  if (params.minPrice !== undefined && params.minPrice > 0) body['min-price'] = Math.floor(params.minPrice);
  if (params.maxPrice !== undefined && params.maxPrice < 999999) body['max-price'] = Math.ceil(params.maxPrice);
  if (params.inStock) {
    body.filter = [{ type: 'range', field: 'availableStock', parameters: { gt: 0 } }];
  }

  try {
    const res: any = await $fetch(`${endpoint}search`, {
      method: 'POST',
      headers: { 'sw-access-key': accessToken, Accept: 'application/json' },
      body,
      timeout: 8000,
    });

    const elements: any[] = res?.elements || [];
    const products: CatalogProduct[] = elements.map((p: any) => {
      const rawDesc = p.translated?.description || p.description || '';
      const description = rawDesc.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200) || undefined;

      const sizeGroupNames = ['veľkosť', 'velkost', 'size', 'rám', 'ram', 'frame', 'velikost'];
      const specParts: string[] = [];
      const sizeParts: string[] = [];
      for (const prop of (p.properties || [])) {
        const groupName = (prop.group?.translated?.name || prop.group?.name || '').toLowerCase();
        const value = prop.translated?.name || prop.name || '';
        if (!groupName || !value) continue;
        if (sizeGroupNames.some(s => groupName.includes(s))) sizeParts.push(value);
        else specParts.push(`${prop.group?.translated?.name || prop.group?.name}: ${value}`);
      }

      return {
        id: p.id,
        name: p.translated?.name || p.name || '',
        category: p.categories?.[0]?.translated?.name || p.categories?.[0]?.name || '',
        brand: p.manufacturer?.translated?.name || p.manufacturer?.name || '',
        price: p.calculatedPrice?.unitPrice ?? 0,
        ...(description && { description }),
        ...(specParts.length && { specs: specParts.join(', ') }),
        ...(sizeParts.length && { sizes: [...new Set(sizeParts)].join(',') }),
      };
    }).filter((p: CatalogProduct) => p.name);

    await storage.setItem(cacheKey, products, { ttl: 300 }).catch(() => null);
    console.info(`[chat-search] query="${params.query || ''}" price=${params.minPrice || 0}-${params.maxPrice || '∞'}€ → ${products.length} products`);
    return products;
  } catch (err: any) {
    console.error('[chat-search] Shopware search failed:', err?.message || err);
    return [];
  }
}

// Buduje search query z kontextu — kombinácia kategórie + ďalších kľúčových slov
export function buildSearchQuery(text: string): string {
  const t = text.toLowerCase();
  const queries: string[] = [];

  // Kategória bicykla
  if (/horský|horske|mtb|mountain/.test(t)) queries.push('horský bicykel');
  else if (/elektr|ebike|e-bike|elektrobicyk/.test(t)) queries.push('elektrobicykel');
  else if (/gravel|cyklokros/.test(t)) queries.push('gravel');
  else if (/cestný|cestne|road/.test(t)) queries.push('cestný bicykel');
  else if (/mestský|mestske|mesto|do mesta|trekking/.test(t)) queries.push('mestský bicykel');
  else if (/detský|detske/.test(t)) queries.push('detský bicykel');

  // Komponenty (overridujú bicykel ak sú spomenuté)
  if (/kazeta|cassette/.test(t)) queries.length = 0, queries.push('kazeta');
  else if (/vidlica|fork/.test(t)) queries.length = 0, queries.push('vidlica');
  else if (/prehadzovačka|derailleur/.test(t)) queries.length = 0, queries.push('prehadzovačka');
  else if (/reťaz|chain/.test(t)) queries.length = 0, queries.push('reťaz');
  else if (/prílba|helma|helmet/.test(t)) queries.length = 0, queries.push('prílba');

  // Značky (pridajú sa ku query ak sú spomenuté)
  const brands = ['deore', 'xt', 'slx', 'xtr', 'bosch', 'shimano', 'sram', 'bafang', 'yamaha'];
  for (const brand of brands) {
    if (t.includes(brand)) {
      queries.push(brand);
      break;
    }
  }

  return queries.join(' ').trim();
}

export function formatCatalogForPrompt(products: CatalogProduct[]): string {
  return JSON.stringify(
    products.slice(0, 400).map((p) => ({
      id: p.id, n: p.name,
      ...(p.category && { cat: p.category }),
      ...(p.brand && { b: p.brand }),
      pr: p.price,
      ...(p.description && { desc: p.description }),
      ...(p.specs && { specs: p.specs }),
      ...(p.sizes && { sizes: p.sizes }),
    }))
  );
}

// ─── Helper konstanty pre kontextový filter ────────────────────────────────

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  ebike: ['elektrobicyk', 'elektr', 'e-bike', 'ebike', 'e-mtb', 'e-trekking'],
  mtb: ['horský', 'horske', 'horský bicykel', 'mtb', 'mountain', 'trail', 'enduro', 'hardtail', 'fullsuspension', 'terén'],
  gravel: ['gravel', 'cyklokros', 'cx'],
  road: ['cestný', 'cestne', 'cestný bicykel', 'asfalt'],
  city: ['mestský', 'mestske', 'mestský bicykel', 'mesto', 'do mesta', 'mesta', 'commuting', 'každodenný'],
  trekking: ['trekking', 'trek', 'výlet', 'tour'],
  kids: ['detský', 'detske', 'dieťa', 'detsky', 'pre dieťa', 'pre deti'],
  cassette: ['kazeta', 'cassette'],
  fork: ['vidlica', 'vidlice', 'fork'],
  brakes: ['brzda', 'brzdy', 'brake'],
  saddle: ['sedlo', 'sedla', 'saddle'],
  pedals: ['pedál', 'pedály', 'pedal'],
  derailleur: ['prehadzovačka', 'derailleur', 'menič'],
  chain: ['reťaz', 'reťaze', 'chain'],
  helmet: ['prílba', 'helma', 'helmet'],
  light: ['svetlo', 'svetlá', 'light'],
};

const HEIGHT_TO_SIZE: Array<[number, number, string]> = [
  [0, 155, 'XS'],
  [155, 165, 'S'],
  [165, 175, 'M'],
  [175, 185, 'L'],
  [185, 195, 'XL'],
  [195, 999, 'XXL'],
];

function extractBudget(text: string): { min: number; max: number } {
  // Rozsah "500-1000€" alebo "500 - 1000 €"
  const range = text.match(/(\d{2,5})\s*[-–]\s*(\d{2,5})\s*€/);
  if (range) {
    const a = parseInt(range[1], 10);
    const b = parseInt(range[2], 10);
    return { min: Math.min(a, b) * 0.8, max: Math.max(a, b) * 1.2 };
  }
  // "do 600€" / "pod 600€" / "max 600€" — odporúčame ±20% (zákazník vidí relevantné v okolí budgetu)
  const upper = text.match(/(?:do|pod|max(?:imálne)?|nanajvýš)\s+(\d{2,5})\s*€/);
  if (upper) {
    const v = parseInt(upper[1], 10);
    return { min: v * 0.8, max: v * 1.2 };
  }
  // "5000€+" / "nad 5000€"
  const lower = text.match(/(?:od|nad|aspoň)\s+(\d{2,5})\s*€/) ||
                text.match(/(\d{2,5})\s*€\s*\+/);
  if (lower) {
    const v = parseInt(lower[1], 10);
    return { min: v * 0.9, max: v * 2.5 };
  }
  return { min: 0, max: 999_999 };
}

function extractHeight(text: string): number | null {
  const m = text.match(/(\d{3})\s*cm/);
  if (!m) return null;
  const h = parseInt(m[1], 10);
  return h >= 100 && h <= 250 ? h : null;
}

function heightToSize(height: number): string | null {
  const range = HEIGHT_TO_SIZE.find(([min, max]) => height >= min && height < max);
  return range ? range[2] : null;
}

function detectCategory(text: string): string {
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw))) return cat;
  }
  return '';
}

function matchesCategory(product: CatalogProduct, category: string): boolean {
  const name = `${product.name} ${product.category}`.toLowerCase();
  const isEbike = /elektr|ebike|e-bike|e-mtb/.test(name);

  if (category === 'ebike') return isEbike;
  if (!category) return true;

  const keywords = CATEGORY_KEYWORDS[category] || [];
  const hasKeyword = keywords.some(kw => name.includes(kw));

  // Bicyklové kategórie (MTB/gravel/road/city/trekking/kids) — vylúč e-biky
  const bikeCategories = ['mtb', 'gravel', 'road', 'city', 'trekking', 'kids'];
  if (bikeCategories.includes(category)) {
    return hasKeyword && !isEbike;
  }
  return hasKeyword;
}

function projectProduct(p: CatalogProduct) {
  return {
    id: p.id,
    n: p.name,
    ...(p.category && { cat: p.category }),
    ...(p.brand && { b: p.brand }),
    pr: p.price,
    ...(p.description && { desc: p.description }),
    ...(p.specs && { specs: p.specs }),
    ...(p.sizes && { sizes: p.sizes }),
  };
}

// ─── Hlavná funkcia ──────────────────────────────────────────────────────────

export function buildContextualCatalog(
  products: CatalogProduct[],
  currentMessage: string,
  history: { role: string; parts: { text: string }[] }[]
): string {
  if (!products.length) return '[]';

  const allText = [
    ...history.map(m => m.parts?.[0]?.text || ''),
    currentMessage
  ].join(' ').toLowerCase();

  const budget = extractBudget(allText);
  const height = extractHeight(allText);
  const wantedSize = height ? heightToSize(height) : null;
  const category = detectCategory(allText);

  // Krok 1: Striktný filter — cena + kategória + veľkosť (ak je)
  let filtered = products.filter(p => {
    if (p.price < budget.min || p.price > budget.max) return false;
    if (category && !matchesCategory(p, category)) return false;
    if (wantedSize && p.sizes && !p.sizes.toUpperCase().includes(wantedSize)) return false;
    return true;
  });

  // Krok 2: Ak málo, povol produkty bez "sizes" pole (neznáma veľkosť = OK)
  if (filtered.length < 5 && wantedSize) {
    filtered = products.filter(p => {
      if (p.price < budget.min || p.price > budget.max) return false;
      if (category && !matchesCategory(p, category)) return false;
      // Akceptuje aj produkty bez sizes (neznáma veľkosť)
      return !p.sizes || p.sizes.toUpperCase().includes(wantedSize);
    });
  }

  // Krok 3: Ak stále málo, uvoľni cenu (širší rozsah)
  if (filtered.length < 5) {
    const widerMin = budget.min * 0.7;
    const widerMax = budget.max * 1.5;
    filtered = products.filter(p => {
      if (p.price < widerMin || p.price > widerMax) return false;
      if (category && !matchesCategory(p, category)) return false;
      return true;
    });
  }

  // Krok 4: Posledný fallback — len kategória, žiadna cena
  if (filtered.length < 3 && category) {
    filtered = products.filter(p => matchesCategory(p, category));
  }

  // Zoradíme podľa ceny vzostupne pre prehľadnosť
  filtered.sort((a, b) => a.price - b.price);

  const toShow = filtered.slice(0, 60);
  console.info(
    `[catalog] Filter: cat=${category || 'any'}, price=${Math.round(budget.min)}-${Math.round(budget.max)}€, ` +
    `size=${wantedSize || 'any'}, height=${height || 'unknown'} → ${toShow.length}/${products.length} products`
  );

  return JSON.stringify(toShow.map(projectProduct));
}
