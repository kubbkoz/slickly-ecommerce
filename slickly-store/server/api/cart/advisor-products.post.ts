// POST /api/cart/advisor-products
// Prijme pole searchQueries od Claude, fetchne reálne produkty zo Shopware Store API
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const storeApiUrl = (config.public.shopware as any).endpoint as string;
  const accessToken = (config.public.shopware as any).accessToken as string;

  const body = await readBody(event);
  const { queries } = body as { queries: { searchQuery: string; label: string; priority?: number }[] };

  if (!queries?.length || queries.length > 8) {
    throw createError({ statusCode: 400, statusMessage: 'queries required (max 8)' });
  }

  const INCLUDES = {
    product: ['id', 'name', 'translated', 'cover', 'calculatedPrice', 'seoUrls', 'available',
              'availableStock', 'parentId', 'childCount', 'options'],
    product_media: ['media'],
    media: ['url', 'thumbnails'],
    media_thumbnail: ['url', 'width'],
    calculated_price: ['unitPrice', 'totalPrice', 'listPrice'],
    seo_url: ['seoPathInfo', 'isCanonical'],
    product_option: ['id', 'name', 'group'],
    property_group_option: ['id', 'name', 'groupId'],
    property_group: ['id', 'name'],
  };

  // Normalizácia labelu: "Blatníky detské 20"" → "blatníky", "Sada osvetlenia CTM" → "sada osvetlenia"
  const GENERIC_PREFIXES = new Set(['sada', 'set', 'komplet']);
  const normalizeLabel = (label: string): string => {
    const words = label.toLowerCase().trim().split(/\s+/);
    if (GENERIC_PREFIXES.has(words[0]) && words.length > 1) return `${words[0]} ${words[1]}`;
    return words[0];
  };

  // Dedup queries by normalized label — zabrání 3× blatníky z rôznych labelov
  const seenLabels = new Set<string>();
  const uniqueQueries = queries.slice(0, 5).filter(q => {
    const norm = normalizeLabel(q.label);
    if (seenLabels.has(norm)) return false;
    seenLabels.add(norm);
    return true;
  });

  // Pre každý searchQuery fetchneme top 3 produkty — náhodný výber pre variabilitu výsledkov
  const seenIds = new Set<string>(); // deduplikácia — rovnaký produkt môže matchnúť viac queries

  const results = await Promise.all(
    uniqueQueries.map(async ({ searchQuery, label }) => {
      try {
        // Vylúčenie kategórie KOMPONENTY (ID z .env cez runtimeConfig)
        const excludedCategory = config.public.shopware.ids.categories.komponenty;

        const res = await $fetch<any>(`${storeApiUrl}search`, {
          method: 'POST',
          headers: {
            'sw-access-key': accessToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: {
            search: searchQuery,
            limit: 5, // Fetchneme viac pre lepšiu variabilitu po filtrovaní
            filter: [
              { type: 'equals', field: 'active', value: true },
              { 
                type: 'not', 
                queries: [
                  { type: 'equals', field: 'categoryIds', value: excludedCategory }
                ] 
              }
            ],
            includes: INCLUDES,
            associations: {
              cover: { associations: { media: { associations: { thumbnails: {} } } } },
              seoUrls: {},
              options: { associations: { group: {} } },
              children: {
                limit: 30,
                includes: {
                  product: ['id', 'name', 'translated', 'options', 'calculatedPrice', 'available', 'availableStock'],
                },
                associations: { options: { associations: { group: {} } } },
              },
            },
          },
        });

        const elements = (res?.elements || res?.data?.elements || []) as any[];
        if (!elements.length) return null;

        // Hard blacklist filter on backend
        const blacklist = ['montážny', 'montazny', 'kovanie'];
        const filteredElements = elements.filter(p => {
          const name = (p.translated?.name || p.name || '').toLowerCase();
          const categoryIds = p.categoryIds || [];
          return !blacklist.some(term => name.includes(term)) && !categoryIds.includes(excludedCategory);
        });

        if (!filteredElements.length) return null;

        // Náhodný výber zo top 3 pre variabilitu
        const candidates = filteredElements.slice(0, 3);
        // Preferuj produkt, ktorého ID sme este nevideli
        let product = candidates.find((p: any) => !seenIds.has(p.parentId || p.id)) || candidates[0];

        // Normalizácia URL obrázka
        const rootId = product.parentId || product.id;

        // Deduplication — preskočíme produkt, ktorý sme už vrátili
        if (seenIds.has(rootId)) return null;
        seenIds.add(rootId);
        const imgUrl =
          product.cover?.media?.thumbnails?.find((t: any) => t.width >= 400)?.url
          || product.cover?.media?.url
          || null;

        const seoPath = product.seoUrls?.find((s: any) => s.isCanonical)?.seoPathInfo;

        // Detekcia variantového produktu (má deti)
        const hasVariants = (product.childCount ?? 0) > 0;

        // Zozbieraj dostupné varianty s options pre výber veľkosti v UI
        const variants: { id: string; options: { groupName: string; name: string }[] }[] = [];
        if (hasVariants && product.children?.length) {
          product.children
            .filter((c: any) => c.available !== false && (c.availableStock ?? 1) > 0)
            .slice(0, 20)
            .forEach((child: any) => {
              const opts = (child.options || []).map((o: any) => ({
                groupName: o.group?.translated?.name || o.group?.name || '',
                name: o.translated?.name || o.name || '',
              }));
              if (opts.length) {
                variants.push({ id: child.id, options: opts });
              }
            });
        }

        return {
          id: product.id,
          name: product.translated?.name || product.name,
          label,
          price: product.calculatedPrice?.unitPrice ?? 0,
          listPrice: product.calculatedPrice?.listPrice?.price ?? null,
          imageUrl: imgUrl,
          seoPath: seoPath ? `/${seoPath}` : null,
          available: product.available ?? true,
          hasVariants,
          variants,
        };
      } catch {
        return null;
      }
    })
  );

  // Name-based dedup — ak dva výsledky zdieľajú rovnaký typ produktu (prvé slovo názvu),
  // zobraz len prvý. Napr. "Blatníky Hammer" + "Blatníky ADHD" → len prvý.
  const seenProductTypes = new Set<string>();
  const normalizeProductType = (name: string): string => {
    const words = name.toLowerCase().trim().split(/\s+/);
    const GENERIC = new Set(['sada', 'set', 'komplet']);
    if (GENERIC.has(words[0]) && words.length > 1) return `${words[0]} ${words[1]}`;
    return words[0];
  };

  return results.filter(Boolean).filter((p: any) => {
    const type = normalizeProductType(p.name);
    if (seenProductTypes.has(type)) return false;
    seenProductTypes.add(type);
    return true;
  });
});
