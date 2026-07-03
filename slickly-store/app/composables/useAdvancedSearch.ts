import { computed, ref, watch, onMounted, nextTick } from 'vue';
import { useShopwareContext, useShopwareLanguage, useRoute, useRouter, useAsyncData, useNuxtApp } from '#imports';
import { useDebounceFn } from '@vueuse/core';

/** Number of products fetched per page on the search results page. */
const SEARCH_LIMIT = 24;

/** Shopware Store-API sort order values for the /search endpoint. */
export type SearchSortOrder = 'score' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

export interface SearchManufacturer {
    id: string;
    name: string;
}

export interface SearchPropertyOption {
    id: string;
    name: string;
    colorHexCode: string | null;
}

export interface SearchPropertyGroup {
    id: string;
    name: string;
    options: SearchPropertyOption[];
}

/**
 * `useAdvancedSearch` — Composable for the dedicated `/search` page.
 * All filter state is URL-synced for shareable links.
 */
export const useAdvancedSearch = () => {
    const { apiClient } = useShopwareContext();
    const { currentLanguageId } = useShopwareLanguage();
    const route  = useRoute();
    const router = useRouter();

    // ─────────────────────────────────────────────────────────────────────────
    // § 1 — URL-SYNCED REACTIVE STATE
    // ─────────────────────────────────────────────────────────────────────────

    const searchTerm = computed((): string =>
        (typeof route.query.search === 'string' ? route.query.search : '') || ''
    );

    const selectedBrands = computed((): string[] => {
        const raw = route.query.brands;
        if (!raw || typeof raw !== 'string') return [];
        return raw.split('|').filter(Boolean);
    });

    const selectedProperties = computed((): string[] => {
        const raw = route.query.properties;
        if (!raw || typeof raw !== 'string') return [];
        return raw.split('|').filter(Boolean);
    });

    const minPrice = computed((): number | undefined => {
        const v = route.query.min_price;
        return v && typeof v === 'string' ? Number(v) : undefined;
    });

    const maxPrice = computed((): number | undefined => {
        const v = route.query.max_price;
        return v && typeof v === 'string' ? Number(v) : undefined;
    });

    const sortBy = computed((): SearchSortOrder =>
        (route.query.sort as SearchSortOrder) || 'score'
    );

    const page = ref(1);

    const inStock = computed((): boolean => route.query.in_stock === '1');
    const isPromo = computed((): boolean => route.query.promo === '1');

    /**
     * Filter by productNumber (SKU / katalógové číslo produktu).
     * Fungovanie: Shopware indexuje pole productNumber v OpenSearch.
     * Po reindexe a povolení v adminu funguje aj vyhľadávanie cez search bar.
     */
    const filterProductNumber = computed((): string =>
        (typeof route.query.product_number === 'string' ? route.query.product_number : '') || ''
    );

    /**
     * Filter by manufacturerNumber (číslo výrobcu).
     * Vyžaduje reindex po povolení poľa manufacturerNumber v Shopware > Search admin.
     */
    const filterManufacturerNumber = computed((): string =>
        (typeof route.query.manufacturer_number === 'string' ? route.query.manufacturer_number : '') || ''
    );

    // ─────────────────────────────────────────────────────────────────────────
    // § 2 — STORE API REQUEST BUILDER
    // ─────────────────────────────────────────────────────────────────────────

    const buildCriteria = (p: number) => {
        const filters: any[] = [];

        // Skladom filter
        if (inStock.value) {
            filters.push({ type: 'range', field: 'availableStock', parameters: { gt: 0 } });
        }

        // Výpredaj filter — OPRAVA: price.listPrice nie je filtrovateľné v Store API.
        // Správne polia Shopware: cheapestPrice.listPrice a cheapestPrice.discount.
        if (isPromo.value) {
            filters.push({
                type: 'multi',
                operator: 'or',
                queries: [
                    { type: 'range', field: 'cheapestPrice.listPrice', parameters: { gt: 0 } },
                    { type: 'range', field: 'cheapestPrice.discount',  parameters: { gt: 0 } }
                ]
            });
        }

        // Filter podľa čísla produktu (productNumber / SKU)
        if (filterProductNumber.value.trim()) {
            filters.push({
                type: 'contains',
                field: 'productNumber',
                value: filterProductNumber.value.trim()
            });
        }

        // Filter podľa čísla výrobcu (manufacturerNumber)
        if (filterManufacturerNumber.value.trim()) {
            filters.push({
                type: 'contains',
                field: 'manufacturerNumber',
                value: filterManufacturerNumber.value.trim()
            });
        }

        return {
            search: searchTerm.value,
            limit: SEARCH_LIMIT,
            p,
            order: sortBy.value !== 'score' ? sortBy.value : undefined,
            manufacturer: selectedBrands.value.length ? selectedBrands.value.join('|') : undefined,
            properties: selectedProperties.value.length ? selectedProperties.value.join('|') : undefined,
            'min-price': minPrice.value,
            'max-price': maxPrice.value,
            // Filters: custom field filters musia ísť cez filter array, nie cez shorthand
            filter: filters.length > 0 ? filters : undefined,
            associations: {
                cover: { associations: { media: {} } },
                manufacturer: {},
                media: {
                    associations: { media: {} },
                    sort: 'position',
                },
                seoUrls: {},
                children: {
                    associations: {
                        options: { associations: { group: {} } }
                    }
                },
                options: { associations: { group: {} } },
            },
            includes: {
                product: [
                    'id', 'name', 'description', 'translated', 'cover', 'manufacturer',
                    'seoUrls', 'calculatedPrice', 'childCount', 'available',
                    'availableStock', 'isCloseout', 'ratingAverage', 'productReviewsCount',
                    'children', 'options', 'optionIds', 'restockTime',
                    'media',
                    // Vyžadované pre filter a zobrazenie čísel
                    'productNumber', 'manufacturerNumber',
                    // Pre MtsportBadge matching
                    'createdAt', 'tagIds', 'categoryTree', 'manufacturerId',
                ],
                media:                ['url', 'thumbnails', 'fileName'],
                product_media:        ['media', 'position'],
                media_thumbnail:      ['url', 'width'],
                product_manufacturer: ['id', 'name', 'translated'],
                seo_url:              ['seoPathInfo', 'isCanonical'],
                product_option:       ['id', 'name', 'translated', 'groupId', 'group'],
                product_option_group: ['id', 'name', 'translated'],
            },
        };
    };

    // ─────────────────────────────────────────────────────────────────────────
    // § 3 — DATA FETCHING
    // ─────────────────────────────────────────────────────────────────────────

    const { data, status, refresh } = useAsyncData<any>(
        'advanced-search',
        async () => {
            if (!searchTerm.value.trim()) return null;
            try {
                return await apiClient.invoke('searchPage post /search' as any, {
                    body:    buildCriteria(1),
                    headers: { 'sw-language-id': currentLanguageId.value },
                });
            } catch (err) {
                console.error('[useAdvancedSearch] API error:', err);
                return null;
            }
        },
        {
            lazy: import.meta.client,
            getCachedData(key) {
                const nuxtApp = useNuxtApp();
                if (nuxtApp.isHydrating) {
                    return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
                }
                return undefined;
            },
        }
    );

    // ─────────────────────────────────────────────────────────────────────────
    // § 3.5 — INFINITE SCROLL STATE
    // ─────────────────────────────────────────────────────────────────────────

    const VIEWPORT_BATCH = 8;
    const visibleProducts = ref<any[]>([]);
    const prefetchedNextPage = ref<any[] | null>(null);
    const isPrefetchRunning = ref(false);
    const isLoadingMore = ref(false);

    const extractElementsAsArray = (payload: any): any[] => {
        if (!payload) return [];
        const els = payload.data?.elements || payload.elements;
        if (!els) return [];
        return Array.isArray(els) ? els : Object.values(els);
    };

    const initVisibleProducts = (fetchedItems: any[]) => {
        if (fetchedItems.length > 0) {
            page.value = 1;
            visibleProducts.value = fetchedItems.slice(0, VIEWPORT_BATCH);
            if (process.client && fetchedItems.length > VIEWPORT_BATCH) {
                requestAnimationFrame(() => {
                    visibleProducts.value = [...fetchedItems];
                });
            }
        } else {
            visibleProducts.value = [];
        }
    };

    if (import.meta.server && data.value) {
        const ssrItems = extractElementsAsArray(data.value);
        if (ssrItems.length > 0) {
            page.value = 1;
            visibleProducts.value = ssrItems.slice(0, VIEWPORT_BATCH);
        }
    }

    watch(data, (newVal) => {
        const fetchedItems = extractElementsAsArray(newVal);
        initVisibleProducts(fetchedItems);
    });

    onMounted(() => {
        const all = extractElementsAsArray(data.value);
        if (all.length > visibleProducts.value.length) {
            visibleProducts.value = all;
        }
    });

    watch(() => route.query, useDebounceFn(async () => {
        page.value = 1;
        visibleProducts.value = [];
        await refresh({ dedupe: 'cancel' });
    }, 300), { deep: true });

    // ─────────────────────────────────────────────────────────────────────────
    // § 3.6 — PAGINATION
    // ─────────────────────────────────────────────────────────────────────────

    const getRaw = () => (data.value as any)?.data ?? data.value ?? {};

    const prefetchNextPage = async () => {
        const nextPage = page.value + 1;
        if (isPrefetchRunning.value || prefetchedNextPage.value !== null || visibleProducts.value.length >= (getRaw()?.total ?? 0)) return;

        isPrefetchRunning.value = true;
        try {
            const res = await apiClient.invoke('searchPage post /search' as any, {
                body: buildCriteria(nextPage),
                headers: { 'sw-language-id': currentLanguageId.value }
            });
            const fetched = extractElementsAsArray(res);
            if (fetched.length > 0) prefetchedNextPage.value = fetched;
        } catch (_) {} finally {
            isPrefetchRunning.value = false;
        }
    };

    const loadMore = async () => {
        if (visibleProducts.value.length >= (getRaw()?.total ?? 0) || isLoadingMore.value) return;

        isLoadingMore.value = true;
        const nextPage = page.value + 1;

        try {
            let newItems: any[];
            if (prefetchedNextPage.value !== null) {
                newItems = prefetchedNextPage.value;
                prefetchedNextPage.value = null;
            } else {
                const res = await apiClient.invoke('searchPage post /search' as any, {
                    body: buildCriteria(nextPage),
                    headers: { 'sw-language-id': currentLanguageId.value }
                });
                newItems = extractElementsAsArray(res);
            }

            if (newItems.length > 0) {
                const deduped = newItems.filter((n: any) => !visibleProducts.value.some((e: any) => e.id === n.id));
                page.value = nextPage;
                visibleProducts.value.push(...deduped);
                prefetchedNextPage.value = null;
                nextTick(() => prefetchNextPage());
            }
        } catch (error) {
            console.error('[loadMore] error:', error);
        } finally {
            isLoadingMore.value = false;
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // § 4 — COMPUTED OUTPUTS
    // ─────────────────────────────────────────────────────────────────────────

    const products = computed(() => visibleProducts.value);
    const total = computed((): number => getRaw()?.total ?? 0);
    const totalPages = computed((): number => Math.ceil(total.value / SEARCH_LIMIT));
    const loading = computed((): boolean => status.value === 'pending');
    const aggregations = computed(() => (getRaw()?.aggregations) ?? {});

    // ─────────────────────────────────────────────────────────────────────────
    // § 5 — FILTER OPTIONS FROM AGGREGATIONS
    // ─────────────────────────────────────────────────────────────────────────

    const availableManufacturers = computed((): SearchManufacturer[] => {
        const entities = aggregations.value?.manufacturer?.entities ?? [];
        return (entities as any[])
            .map((m) => ({ id: m.id, name: m.translated?.name || m.name }))
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    });

    const availablePriceRange = computed(() => ({
        min: Number(aggregations.value?.price?.min ?? 0),
        max: Number(aggregations.value?.price?.max ?? 10_000),
    }));

    const availablePropertyGroups = computed((): SearchPropertyGroup[] => {
        const entities = aggregations.value?.properties?.entities ?? [];
        return (entities as any[])
            .map((group) => ({
                id:      group.id,
                name:    group.translated?.name || group.name,
                options: ((group.options ?? []) as any[])
                    .map((o) => ({
                        id:           o.id,
                        name:         o.translated?.name || o.name,
                        colorHexCode: o.colorHexCode || null,
                    }))
                    .sort((a, b) =>
                        a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
                    ),
            }))
            .filter((g) => g.options.length > 0)
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    });

    const hasActiveFilters = computed((): boolean =>
        selectedBrands.value.length > 0 ||
        selectedProperties.value.length > 0 ||
        minPrice.value !== undefined ||
        maxPrice.value !== undefined ||
        filterProductNumber.value !== '' ||
        filterManufacturerNumber.value !== ''
    );

    // ─────────────────────────────────────────────────────────────────────────
    // § 6 — URL SYNC
    // ─────────────────────────────────────────────────────────────────────────

    const buildQuery = (overrides: Record<string, string | number | undefined> = {}) => {
        const q: Record<string, string | number | undefined> = {};
        if (searchTerm.value)                q.search               = searchTerm.value;
        if (selectedBrands.value.length)     q.brands               = selectedBrands.value.join('|');
        if (selectedProperties.value.length) q.properties           = selectedProperties.value.join('|');
        if (minPrice.value !== undefined)    q.min_price            = minPrice.value;
        if (maxPrice.value !== undefined)    q.max_price            = maxPrice.value;
        if (sortBy.value && sortBy.value !== 'score') q.sort        = sortBy.value;
        if (filterProductNumber.value)       q.product_number      = filterProductNumber.value;
        if (filterManufacturerNumber.value)  q.manufacturer_number = filterManufacturerNumber.value;
        return { ...q, ...overrides };
    };

    const syncToUrl = useDebounceFn(
        (overrides: Record<string, string | number | undefined> = {}) => {
            router.replace({ path: '/search', query: buildQuery(overrides) });
        },
        50
    );

    // ─────────────────────────────────────────────────────────────────────────
    // § 7 — FILTER ACTIONS
    // ─────────────────────────────────────────────────────────────────────────

    const toggleBrand = (id: string) => {
        const next = selectedBrands.value.includes(id)
            ? selectedBrands.value.filter((b) => b !== id)
            : [...selectedBrands.value, id];
        syncToUrl({ brands: next.join('|') || undefined });
    };

    const toggleProperty = (id: string) => {
        const next = selectedProperties.value.includes(id)
            ? selectedProperties.value.filter((p) => p !== id)
            : [...selectedProperties.value, id];
        syncToUrl({ properties: next.join('|') || undefined });
    };

    const setPriceRange = (min: number, max: number) => {
        const { min: globalMin, max: globalMax } = availablePriceRange.value;
        syncToUrl({
            min_price: min > globalMin ? min : undefined,
            max_price: max < globalMax ? max : undefined,
        });
    };

    const setSort = (sort: SearchSortOrder) => {
        syncToUrl({ sort: sort !== 'score' ? sort : undefined });
    };

    const setPage = (_p: number) => {};

    /** Filter podľa čísla produktu (SKU). Syncuje do URL ?product_number=... */
    const setProductNumberFilter = (value: string) => {
        syncToUrl({ product_number: value.trim() || undefined });
    };

    /** Filter podľa čísla výrobcu. Syncuje do URL ?manufacturer_number=... */
    const setManufacturerNumberFilter = (value: string) => {
        syncToUrl({ manufacturer_number: value.trim() || undefined });
    };

    const resetFilters = () => {
        router.replace({
            path:  '/search',
            query: { search: searchTerm.value || undefined },
        });
    };

    // ─────────────────────────────────────────────────────────────────────────
    // § 8 — PUBLIC API
    // ─────────────────────────────────────────────────────────────────────────

    return {
        // Filter state
        searchTerm,
        selectedBrands,
        selectedProperties,
        minPrice,
        maxPrice,
        sortBy,
        inStock,
        isPromo,
        page,
        filterProductNumber,
        filterManufacturerNumber,

        // Data
        products,
        total,
        totalPages,
        aggregations,
        loading,
        SEARCH_LIMIT,

        // Available filter options
        availableManufacturers,
        availablePriceRange,
        availablePropertyGroups,
        hasActiveFilters,

        // Filter actions
        toggleBrand,
        toggleProperty,
        setPriceRange,
        setSort,
        setPage,
        setProductNumberFilter,
        setManufacturerNumberFilter,
        resetFilters,

        // Infinite Scroll
        loadMore,
        prefetchNextPage,
        isLoadingMore,
        isPrefetchRunning,

        // Raw refresh
        refresh,
    };
};
