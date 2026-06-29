import { ref, computed, watch, type Ref } from 'vue';
import { useProductSearchSuggest, useShopwareContext, useShopwareLanguage } from '#imports';
import { useDebounceFn } from '@vueuse/core';
import { getCategoryUrl } from '~/utils/url';

export interface SuggestManufacturer {
    id: string;
    name: string;
    logo: string | null;
}

export interface SuggestCategory {
    id: string;
    name: string;
    imageUrl: string | null;
    url: string;
}

export interface SuggestTag {
    id: string;
    name: string;
}

export interface SuggestProperty {
    id: string;
    name: string;
    groupName: string;
}

const MIN_CHARS = 2;

/**
 * Orchestrates three parallel search API calls:
 *   1. POST /search-suggest  → product list (+ tags extracted)
 *   2. POST /search (limit:1) → total count + manufacturer/property aggregations
 *   3. POST /category         → category name search
 *
 * Debounced at 220 ms. Activates at MIN_CHARS (2) characters.
 */
export const useSearchSuggest = (searchQuery: Ref<string>) => {
    const { apiClient }       = useShopwareContext();
    const { currentLanguageId } = useShopwareLanguage();

    const { searchTerm, search: searchSuggest, getProducts, loading: loadingProducts } = useProductSearchSuggest();

    const suggestManufacturers = ref<SuggestManufacturer[]>([]);
    const suggestCategories    = ref<SuggestCategory[]>([]);
    const suggestTags          = ref<SuggestTag[]>([]);
    const suggestProperties    = ref<SuggestProperty[]>([]);
    const totalResults         = ref(0);
    const loadingExtra         = ref(false);

    const hasQuery    = computed(() => searchQuery.value.trim().length >= MIN_CHARS);
    const showEmpty   = computed(() => !hasQuery.value);
    const showResults = computed(() => hasQuery.value);

    const isLoading = computed(() => loadingProducts.value || loadingExtra.value);

    const reset = () => {
        suggestManufacturers.value = [];
        suggestCategories.value    = [];
        suggestTags.value          = [];
        suggestProperties.value    = [];
        totalResults.value         = 0;
    };

    const fetchSuggest = useDebounceFn(async (term: string) => {
        if (term.trim().length < MIN_CHARS) { reset(); return; }

        loadingExtra.value = true;
        searchTerm.value   = term;
        const termLower    = term.toLowerCase();

        try {
            const langHeader = { 'sw-language-id': currentLanguageId.value };

            const [, searchRes, categoryRes] = await Promise.all([
                // ① Products — suggest endpoint with manufacturer + tags
                searchSuggest({
                    associations: {
                        seoUrls:      {},
                        cover:        { associations: { media: {} } },
                        options:      { associations: { group: {} } },
                        manufacturer: { associations: { media: {} } },
                        tags:         {},
                    },
                    includes: {
                        product: ['id', 'name', 'translated', 'cover', 'calculatedPrice', 'seoUrls', 'manufacturerId', 'options', 'optionIds', 'variation', 'manufacturer', 'tags', 'tagIds'],
                        seo_url: ['seoPathInfo', 'isCanonical'],
                        property_group_option: ['id', 'name', 'translated', 'groupId', 'group'],
                        property_group: ['id', 'name', 'translated'],
                        product_manufacturer: ['id', 'name', 'translated', 'media'],
                        media: ['url'],
                        tag: ['id', 'name', 'translated'],
                    },
                }),

                // ② Total count + aggregations (manufacturer + properties)
                apiClient.invoke('searchPage post /search' as any, {
                    body: {
                        search: term,
                        limit: 1,
                        includes: {
                            product: ['id'],
                            product_manufacturer: ['id', 'name', 'translated', 'media'],
                            property_group: ['id', 'name', 'translated', 'options'],
                            property_group_option: ['id', 'name', 'translated'],
                            media: ['url'],
                        },
                    },
                    headers: langHeader,
                }),

                // ③ Categories — name search
                apiClient.invoke('readCategoryList post /category' as any, {
                    headers: langHeader,
                    body: {
                        limit: 6,
                        filter: [
                            { type: 'contains', field: 'name', value: term },
                            { type: 'equals',   field: 'active', value: true },
                        ],
                        sort: [{ field: 'level', order: 'ASC' }],
                        associations: { seoUrls: {}, media: {} },
                    },
                }),
            ]);

            const rawSearch = (searchRes as any)?.data ?? searchRes;
            totalResults.value = rawSearch?.total ?? 0;

            // ── Manufacturers from aggregations (covers ALL matching, not just 6 products) ──
            const mfrAgg = rawSearch?.aggregations?.manufacturer;
            const mfrEntities: any[] = mfrAgg?.entities || mfrAgg?.elements || [];

            // Logo map from products (they have media association loaded)
            const logoMap = new Map<string, string>();
            for (const p of (getProducts.value ?? [])) {
                const m = (p as any).manufacturer;
                if (m?.id && m?.media?.url) logoMap.set(m.id, m.media.url);
            }

            suggestManufacturers.value = mfrEntities
                .map((m: any) => ({
                    id:   m.id,
                    name: m.translated?.name || m.name || '',
                    logo: m.media?.url ?? logoMap.get(m.id) ?? null,
                }))
                .filter((m: SuggestManufacturer) => m.name)
                .slice(0, 6);

            // ── Tags from products — filtered by search term ────────────────
            const tagMap = new Map<string, SuggestTag>();
            for (const p of (getProducts.value ?? [])) {
                const tags = (p as any).tags;
                if (Array.isArray(tags)) {
                    for (const tag of tags) {
                        if (tag?.id && !tagMap.has(tag.id)) {
                            const tagName = tag.translated?.name || tag.name || '';
                            if (tagName && tagName.toLowerCase().includes(termLower)) {
                                tagMap.set(tag.id, { id: tag.id, name: tagName });
                            }
                        }
                    }
                }
            }
            suggestTags.value = [...tagMap.values()].slice(0, 4);

            // ── Properties — flatten, filter by search term, max 3 ──────────
            const propsAgg = rawSearch?.aggregations?.properties;
            if (propsAgg?.entities && Array.isArray(propsAgg.entities)) {
                const matched: SuggestProperty[] = [];
                for (const group of propsAgg.entities) {
                    const groupName = group.translated?.name || group.name || '';
                    for (const opt of (group.options || [])) {
                        const optName = opt.translated?.name || opt.name || '';
                        if (optName.toLowerCase().includes(termLower)) {
                            matched.push({ id: opt.id, name: optName, groupName });
                            if (matched.length >= 3) break;
                        }
                    }
                    if (matched.length >= 3) break;
                }
                suggestProperties.value = matched;
            } else {
                suggestProperties.value = [];
            }

            // ── Categories ──────────────────────────────────────────────────
            const rawCats = (categoryRes as any)?.data?.elements || [];
            suggestCategories.value = rawCats
                .filter((c: any) => c.type !== 'folder' && c.type !== 'link')
                .slice(0, 6)
                .map((c: any) => ({
                    id:       c.id,
                    name:     c.translated?.name || c.name || '',
                    imageUrl: c.media?.url ?? null,
                    url:      getCategoryUrl(c),
                }));

        } catch (err) {
            console.error('[useSearchSuggest] error:', err);
        } finally {
            loadingExtra.value = false;
        }
    }, 220);

    watch(searchQuery, (val) => {
        if (val.trim().length < MIN_CHARS) reset();
        else fetchSuggest(val.trim());
    });

    return {
        getProducts,
        searchTerm,
        suggestManufacturers,
        suggestCategories,
        suggestTags,
        suggestProperties,
        totalResults,
        isLoading,
        hasQuery,
        showEmpty,
        showResults,
        MIN_CHARS,
        fetchSuggest,
    };
};
