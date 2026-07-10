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
      const sizeGroupNames = ['veľkosť', 'velkost', 'size', 'velikost'];
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

      const sizeGroupNames = ['veľkosť', 'velkost', 'size', 'velikost'];
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

  // Kategória starostlivosti o auto
  if (/exterier|exterior|umyvanie|mytie|vosk/.test(t)) queries.push('exteriér');
  else if (/interier|interior|tapicie|cistenie interieru/.test(t)) queries.push('interiér');
  else if (/lestenie|lesk|polish|polirovanie/.test(t)) queries.push('leštenie');
  else if (/ochrana karoserie|folia|keramick|ceramic|karoseria/.test(t)) queries.push('ochrana karosérie');
  else if (/prislusenstvo|doplnky|handrick|hubka|vedro/.test(t)) queries.push('príslušenstvo');

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
  exterier: ['exterier', 'exterior', 'umyvanie', 'mytie', 'vosk', 'sampon na auto'],
  interier: ['interier', 'interior', 'tapicie', 'cistenie interieru', 'vnutro auta'],
  lestenie: ['lestenie', 'lesk', 'polish', 'polirovanie', 'lestidlo'],
  'ochrana-karoserie': ['ochrana karoserie', 'folia', 'keramick', 'ceramic', 'karoseria', 'ochrana laku'],
  prislusenstvo: ['prislusenstvo', 'doplnky', 'handrick', 'hubka', 'vedro'],
};

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

function detectCategory(text: string): string {
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw))) return cat;
  }
  return '';
}

function matchesCategory(product: CatalogProduct, category: string): boolean {
  if (!category) return true;
  const name = `${product.name} ${product.category}`.toLowerCase();
  const keywords = CATEGORY_KEYWORDS[category] || [];
  return keywords.some(kw => name.includes(kw));
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
  const category = detectCategory(allText);

  // Krok 1: Striktný filter — cena + kategória
  let filtered = products.filter(p => {
    if (p.price < budget.min || p.price > budget.max) return false;
    if (category && !matchesCategory(p, category)) return false;
    return true;
  });

  // Krok 2: Ak stále málo, uvoľni cenu (širší rozsah)
  if (filtered.length < 5) {
    const widerMin = budget.min * 0.7;
    const widerMax = budget.max * 1.5;
    filtered = products.filter(p => {
      if (p.price < widerMin || p.price > widerMax) return false;
      if (category && !matchesCategory(p, category)) return false;
      return true;
    });
  }

  // Krok 3: Posledný fallback — len kategória, žiadna cena
  if (filtered.length < 3 && category) {
    filtered = products.filter(p => matchesCategory(p, category));
  }

  // Zoradíme podľa ceny vzostupne pre prehľadnosť
  filtered.sort((a, b) => a.price - b.price);

  const toShow = filtered.slice(0, 60);
  console.info(
    `[catalog] Filter: cat=${category || 'any'}, price=${Math.round(budget.min)}-${Math.round(budget.max)}€ → ${toShow.length}/${products.length} products`
  );

  return JSON.stringify(toShow.map(projectProduct));
}
