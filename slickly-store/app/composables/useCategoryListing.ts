import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useShopwareContext, useAsyncData, useNuxtApp, useShopwareLanguage } from '#imports';
import { useDebounceFn } from '@vueuse/core';
import type { Ref } from 'vue';

interface ListingFilters {
    sortBy: Ref<string>;
    selectedBrands: Ref<string[]>;
    selectedProperties: Ref<string[]>;
    selectedColors: Ref<string[]>;
    priceRange: Ref<[number, number]>;
    inStockOnly: Ref<boolean>;
    onDemandOnly: Ref<boolean>;
    isPromotion: Ref<boolean>;
    isFeatured?: Ref<boolean>;
    searchQuery: Ref<string>;
    riderHeight?: Ref<number | null>;
    selectedWheelsNorm?: Ref<string[]>;
    selectedForkNorm?: Ref<string[]>;
    selectedBrakesNorm?: Ref<string[]>;
    selectedGearsNorm?: Ref<string[]>;
    selectedMotorNorm?: Ref<string[]>;
    selectedBatteryNorm?: Ref<string[]>;
}

/**
 * Fetches product listings for a category with SWR caching.
 * Leverages Nuxt payload cache and native reactivity.
 *
 * Synchronous composable - registers everything during component setup.
 */
export const useCategoryListing = (navigationId: string, filters: ListingFilters) => {
    const { apiClient } = useShopwareContext();
    const config = useRuntimeConfig();
    // FIX-1.3: Captured synchronously at setup time — NEVER call composables inside async callbacks.
    const { currentLanguageId } = useShopwareLanguage();
    const {
        sortBy, selectedBrands, selectedProperties, selectedColors, priceRange, searchQuery, isPromotion, isFeatured,
        inStockOnly, onDemandOnly,
        riderHeight, selectedWheelsNorm, selectedForkNorm, selectedBrakesNorm, selectedGearsNorm, selectedMotorNorm, selectedBatteryNorm
    } = filters;

    const limit = ref(24);
    const page = ref(1);
    const nextPageData = ref<any>(null);
    const isPrefetching = ref(false);
    // PRE-FETCH STATE
    // prefetchedNextPage: výsledok background fetchu uložený pred kliknutím na button
    const prefetchedNextPage = ref<any[] | null>(null);
    const isPrefetchRunning = ref(false);
    // isLoadingMore: true hneď po kliknutí na button (zobrazí skeleton okamžite)
    const isLoadingMore = ref(false);

    const getCriteria = (p: number) => {
        const activeApiFilters: any[] = [];
        if (searchQuery?.value) {
            activeApiFilters.push({
                type: 'multi',
                operator: 'or',
                queries: [
                    { type: 'contains', field: 'name', value: searchQuery.value },
                    { type: 'contains', field: 'manufacturer.name', value: searchQuery.value }
                ]
            });
        }
        if (isPromotion?.value) {
            // Filter: produkty so zľavou = cheapestPrice.hasListPrice je true
            // cheapestPrice.hasListPrice je bool pole v Shopware CheapestPrice struct
            // Predchádzajúci filter cheapestPrice.listPrice/discount nefungoval — objekt, nie číslo
            activeApiFilters.push({
                type: 'equals',
                field: 'cheapestPrice.hasListPrice',
                value: true
            });
        }
        // Filter: Odporúčané produkty (markAsTopseller flag from Shopware backend)
        if (isFeatured?.value) {
            activeApiFilters.push({
                type: 'equals',
                field: 'markAsTopseller',
                value: true
            });
        }

        // --- Availability Custom Filters ---
        if (inStockOnly?.value && onDemandOnly?.value) {
            // User selected both "Skladom" and "Na objednávku", we want products matching EITHER condition
            activeApiFilters.push({
                type: 'multi',
                operator: 'or',
                queries: [
                    { type: 'range', field: 'availableStock', parameters: { gt: 0 } },
                    { 
                        type: 'multi', 
                        operator: 'and', 
                        queries: [
                            { type: 'equals', field: 'availableStock', value: 0 },
                            { type: 'equals', field: 'isCloseout', value: false }
                        ]
                    }
                ]
            });
        } else if (inStockOnly?.value) {
            activeApiFilters.push({
                type: 'range',
                field: 'availableStock',
                parameters: { gt: 0 }
            });
        } else if (onDemandOnly?.value) {
            activeApiFilters.push({
                type: 'multi',
                operator: 'and',
                queries: [
                    { type: 'equals', field: 'availableStock', value: 0 },
                    { type: 'equals', field: 'isCloseout', value: false }
                ]
            });
        }

        if (riderHeight?.value) {
            const h = riderHeight.value;
            // Rider height logic: bike must accommodate the rider's height
            // Height >= min AND Height <= max
            activeApiFilters.push({
                type: 'multi',
                operator: 'and',
                queries: [
                    { type: 'range', field: 'customFields.mtsport_height_min', parameters: { lte: h } },
                    { type: 'range', field: 'customFields.mtsport_height_max', parameters: { gte: h } }
                ]
            });
        }

        // Helper mapping strings to UUIDs for legacy string-based selections
        const getPropertyUuids = (names: string[], groupNamesList: string[]) => {
            if (!names || names.length === 0) return [];
            return extractOptionsAsObjects(groupNamesList)
                .filter(o => names.includes(o.name))
                .map(o => o.id);
        };

        const resolvedSizes = getPropertyUuids(selectedProperties.value, ['size', 'veľkosť', 'rámu']);
        const resolvedGenders = getPropertyUuids(selectedProperties.value, ['gender', 'pohlavie', 'určenie']);
        const resolvedWheelSizes = getPropertyUuids(selectedProperties.value, ['wheel', 'kolesa']);
        const resolvedGenProps = getPropertyUuids(selectedProperties.value, ['vlastnosti']);

        // Combine legacy resolved UUIDs with directly stored UUIDs from the new Norm variables
        const allPropertyUuids = [
            ...new Set([
                ...resolvedSizes,
                ...resolvedGenders,
                ...resolvedWheelSizes,
                ...resolvedGenProps,
                ...selectedColors.value, // Direct UUIDs from the swatch filter
                ...(selectedWheelsNorm?.value || []),
                ...(selectedForkNorm?.value || []),
                ...(selectedBrakesNorm?.value || []),
                ...(selectedGearsNorm?.value || []),
                ...(selectedMotorNorm?.value || []),
                ...(selectedBatteryNorm?.value || [])
            ])
        ];

        return {
            limit: limit.value,
            p,
            order: sortBy.value,
            filter: activeApiFilters.length ? activeApiFilters : undefined,
            aggregations: undefined,
            manufacturer: selectedBrands.value.length ? selectedBrands.value.join('|') : undefined,
            properties: allPropertyUuids.length ? allPropertyUuids.join('|') : undefined,
            'min-price': priceRange.value[0] > 0 ? priceRange.value[0] : undefined,
            'max-price': priceRange.value[1] < 10000 ? priceRange.value[1] : undefined,
            // FIX-1.7 (updated): Restored lightweight associations needed by ProductCard
            // (variants, logo, secondary image) but strictly restricted via `includes`.
            associations: {
                cover: { associations: { media: {} } },
                manufacturer: { associations: { media: {} } },
                options: { associations: { group: {} } },
                media: {
                    associations: { media: {} },
                    sort: 'position'
                },
                seoUrls: {},
                children: {
                    associations: {
                        options: { associations: { group: {} } },
                        properties: { associations: { group: {} } }
                    }
                },
                configuratorSettings: {
                    associations: {
                        option: { associations: { group: {} } }
                    }
                },
                productReviews: {}
            },
            // FIX-1.7: Payload trim — only request fields needed to render a product card.
            // Without this, Shopware returns 50+ fields/product × 24 items = megabytes of wasted JSON.
            includes: {
                product: [
                    'id', 'name', 'translated', 'cover', 'manufacturer', 'options',
                    'seoUrls', 'calculatedPrice', 'childCount', 'available', 'availableStock',
                    'isCloseout', 'children', 'media', 'ratingAverage', 'productReviewsCount', 'customFields',
                    'createdAt', 'tagIds', 'categoryTree', 'manufacturerId'
                ],
                product_media: ['media', 'position'],
                media: ['url', 'thumbnails', 'fileName', 'mimeType'],
                media_thumbnail: ['url', 'width'],
                product_manufacturer: ['id', 'name', 'translated', 'media'],
                property_group_option: ['id', 'name', 'translated', 'group', 'colorHexCode', 'customFields'],
                property_group: ['id', 'name', 'translated', 'options', 'filterable'],
                seo_url: ['seoPathInfo', 'isCanonical'],
            }
        };
    };

    // Native Nuxt cache key generator
    const getCacheKey = (catId: string, p: number = 1) => {
        const cfs = [
            riderHeight?.value || '',
            (selectedWheelsNorm?.value || []).join('-'),
            (selectedForkNorm?.value || []).join('-'),
            (selectedBrakesNorm?.value || []).join('-'),
            (selectedGearsNorm?.value || []).join('-'),
            (selectedMotorNorm?.value || []).join('-'),
            (selectedBatteryNorm?.value || []).join('-'),
            selectedColors.value.join('-')
        ].join('_');
        return `listing-${catId}-${sortBy.value}-${selectedBrands.value.join('-')}-${selectedProperties.value.join('-')}-${selectedColors.value.join('-')}-${priceRange.value.join('-')}-${isPromotion?.value ? 'promo' : 'nopromo'}-${isFeatured?.value ? 'featured' : ''}-${searchQuery?.value || ''}-${cfs}-${p}`;
    };

    const { data: listingData, status: listingStatus, refresh } = useAsyncData<any>(
        getCacheKey(navigationId, 1),
        async () => {
            // Guard: reject any non-UUID value (including "home", "[object Object]", empty string)
            // Shopware IDs sú 32 hex znakov BEZ pomlčiek alebo štandardný UUID s pomlčkami
            const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$|^[0-9a-f]{32}$/i;
            if (!navigationId || !UUID_RE.test(navigationId)) {
                console.warn('[useCategoryListing] Skipping fetch — invalid navigationId:', navigationId);
                return null;
            }

            const criteria = getCriteria(1);
            try {
                const res = await apiClient.invoke(`readProductListing post /product-listing/${navigationId}` as any, {
                    body: criteria,
                    headers: {
                        // FIX-1.3: Read .value inside async is safe; calling the composable itself is not.
                        'sw-language-id': currentLanguageId.value
                    }
                });
                return res;
            } catch (e) {
                console.error('Listing fetch error:', e);
                return null;
            }
        },
        {
            watch: [
                sortBy, selectedBrands, selectedProperties, selectedColors, priceRange, inStockOnly, onDemandOnly, isPromotion, isFeatured || ref(false), searchQuery,
                riderHeight || ref(null),
                selectedWheelsNorm || ref([]),
                selectedForkNorm || ref([]),
                selectedBrakesNorm || ref([]),
                selectedGearsNorm || ref([]),
                selectedMotorNorm || ref([]),
                selectedBatteryNorm || ref([])
            ],
            // lazy: import.meta.client → page renders skeleton INSTANTLY on client-side navigation,
            // while SSR first load strictly waits for data to improve SEO and fix hydration node mismatches
            lazy: import.meta.client,
            getCachedData(key) {
                const nuxtApp = useNuxtApp();
                // FIX-1.4: Strict Hydration Check for Cache.
                // useAsyncData shares the same static 'key' for the entire component lifecycle.
                // If filters change, the Vue payload cache is overwritten by the new filtered response.
                // Resetting filters then incorrectly reads the newly filtered cache instead of the original list.
                // By limiting cache reads strictly to SSR hydration, we guarantee correct API fetches on all client interactions.
                if (nuxtApp.isHydrating) {
                    return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
                }
                // ALWAYS enforce network call upon ANY manual refresh() or watch trigger after app mounts.
                return undefined;
            }
        }
    );

    const VIEWPORT_BATCH = 8; // products visible above fold
    const visibleProducts = ref<any[]>([]);
    // SSR: watcher na listingData nestihne bežať pred renderom → products by boli [],
    // čo by spôsobilo hydration mismatch (server: skeleton, client: grid).
    // Fallback číta priamo z listingData ak visibleProducts ešte nebolo inicializované.
    const products = computed(() =>
        visibleProducts.value.length > 0 || !import.meta.server
            ? visibleProducts.value
            : extractElementsAsArray(listingData.value).slice(0, VIEWPORT_BATCH)
    );
    const total = computed(() => (listingData.value as any)?.data?.total || (listingData.value as any)?.total || 0);

    const categoryMinPrice = computed(() => {
        const aggs = (listingData.value as any)?.data?.aggregations || (listingData.value as any)?.aggregations;
        return Number(aggs?.price?.min ?? 0);
    });

    const categoryMaxPrice = computed(() => {
        const aggs = (listingData.value as any)?.data?.aggregations || (listingData.value as any)?.aggregations;
        return Number(aggs?.price?.max ?? 10000);
    });

    // Prefetch a subcategory listing on hover for instant navigation
    const prefetchSubcategory = async (subId: string) => {
        const nuxtApp = useNuxtApp();
        const cacheKey = getCacheKey(subId, 1);

        if (nuxtApp.payload.data[cacheKey]) return; // already in SWR cache

        try {
            const res = await apiClient.invoke(
                `readProductListing post /product-listing/${subId}` as any,
                {
                    body: getCriteria(1),
                    headers: { 'sw-language-id': currentLanguageId.value }
                }
            );
            if (res) nuxtApp.payload.data[cacheKey] = res;
        } catch (_) { /* silent */ }
    };

    /**
     * SILENT BACKGROUND PRE-FETCH
     * Volaný IntersectionObserver-om keď užívateľ sa priblíži k buttonu.
     * Uloží načítané dováta do prefetchedNextPage ref — BEZ zmeny UI.
     * Po kliknutí na button sa dováta okamžite prelejejú do gridu.
     */
    const prefetchNextPage = async () => {
        const nextPage = page.value + 1;
        // Ne-prefetchuj ak: už prebieha prefetch, už máme data, alebo nie sú ďalej produkty
        if (isPrefetchRunning.value || prefetchedNextPage.value !== null || products.value.length >= total.value) return;

        isPrefetchRunning.value = true;
        try {
            const res = await apiClient.invoke(
                `readProductListing post /product-listing/${navigationId}` as any,
                { body: getCriteria(nextPage) }
            );
            const fetched = extractElementsAsArray(res);
            if (fetched.length > 0) {
                prefetchedNextPage.value = fetched;
            }
        } catch (_) {
            // Tichá chyba — button fetch to zachytí
        } finally {
            isPrefetchRunning.value = false;
        }
    };

    const extractElementsAsArray = (payload: any): any[] => {
        if (!payload) return [];
        const els = payload.data?.elements || payload.elements;
        if (!els) return [];
        return Array.isArray(els) ? els : Object.values(els);
    };

    /**
     * LOAD MORE — volaný na button click
     * Faza 1 (okamžitá): nastavmé isLoadingMore=true → v UI sa okamžite zobrazia skeleton karty
     * Faza 2 (data): ak prefetchedNextPage má dováta, appendneme ich (0ms lag)
     *                ak nie, fetchúneme API a čakame (skeleton zostane viditeľný)
     */
    const loadMore = async () => {
        if (products.value.length >= total.value || isLoadingMore.value) return;

        // Fáza 1: Okamžitý skeleton — užívateľ vidí animované karty ihneď
        isLoadingMore.value = true;
        const nextPage = page.value + 1;

        try {
            let newItems: any[];

            if (prefetchedNextPage.value !== null) {
                // Cesta A: Nulový lag — použijeme už prefetchnuté dováta
                newItems = prefetchedNextPage.value;
                prefetchedNextPage.value = null; // reset pre ďalejší prefetch
            } else {
                // Cesta B: Skeleton je viditeľný, čakame na API
                const res = await apiClient.invoke(
                    `readProductListing post /product-listing/${navigationId}` as any,
                    { body: getCriteria(nextPage) }
                );
                newItems = extractElementsAsArray(res);
            }

            if (newItems.length > 0) {
                const deduped = newItems.filter((n: any) => !visibleProducts.value.some((e: any) => e.id === n.id));
                page.value = nextPage;
                visibleProducts.value.push(...deduped);
                // Reset prefetch cache a okamžite spusti prefetch pre stranu +2
                // nextTick zaručí že page.value je aktualizovaný pred getCriteria()
                prefetchedNextPage.value = null;
                nextTick(() => prefetchNextPage());
            }
        } catch (error) {
            console.error('[loadMore] error:', error);
        } finally {
            isLoadingMore.value = false;
        }
    };

    // Progressive rendering: show first 8 (viewport) instantly, rest after frame paint, 
    // safe for hydration -> server ONLY returns 8, client loads rest after hydration!
    const initVisibleProducts = (fetchedItems: any[]) => {
        if (fetchedItems.length > 0) {
            page.value = 1;
            // First batch: above-the-fold products — renders immediately for clean SSR
            visibleProducts.value = fetchedItems.slice(0, VIEWPORT_BATCH);
            // Client side logic triggers AFTER successful Vue hydation to avoid mismatch
            if (process.client && fetchedItems.length > VIEWPORT_BATCH) {
                requestAnimationFrame(() => {
                    visibleProducts.value = [...fetchedItems];
                });
            }
        } else {
            visibleProducts.value = [];
        }
    }

    // SYNC INIT: Runs on SSR (non-lazy fetch) AND on client during hydration
    // (listingData.value is immediately available from SSR payload via getCachedData).
    // Without this, client hydrates with visibleProducts=[] while SSR HTML has product grid → mismatch.
    if (listingData.value) {
        const ssrItems = extractElementsAsArray(listingData.value);
        if (ssrItems.length > 0) {
            page.value = 1;
            visibleProducts.value = ssrItems.slice(0, VIEWPORT_BATCH);
        }
    }

    // FIX-1.2: Removed `immediate: true` — was causing SSR reactivity loop.
    // Watch fires only when listingData actually changes (client re-fetch / filter change).
    watch(listingData, (newVal) => {
        const fetchedItems = extractElementsAsArray(newVal);
        initVisibleProducts(fetchedItems);
    });

    onMounted(() => {
        // FIX-1.2: Only fills remaining products AFTER Vue hydration is confirmed complete.
        // Does NOT re-initialize — only extends the viewport batch to full list.
        const all = extractElementsAsArray(listingData.value);
        if (all.length > visibleProducts.value.length) {
            visibleProducts.value = all;
        }
    });

    // FIX-1.2: Debounced to collapse rapid filter slider changes into a single page reset.
    watch([
        inStockOnly, onDemandOnly, isPromotion, selectedBrands, selectedProperties, selectedColors, priceRange, sortBy, searchQuery,
        riderHeight || ref(null),
        selectedWheelsNorm || ref([]),
        selectedForkNorm || ref([]),
        selectedBrakesNorm || ref([]),
        selectedGearsNorm || ref([]),
        selectedMotorNorm || ref([]),
        selectedBatteryNorm || ref([])
    ], useDebounceFn(async () => {
        // Optimistic UI clear and reset
        page.value = 1;
        visibleProducts.value = [];
        await refresh({ dedupe: 'cancel' });
    }, 300), { deep: true });

    const availableBrands = computed(() => {
        const aggs = (listingData.value as any)?.data?.aggregations || (listingData.value as any)?.aggregations;
        const manufacturers = aggs?.manufacturer?.entities || [];
        return manufacturers.map((m: any) => ({
            id: m.id,
            name: m.translated?.name || m.name
        })).sort((a: any, b: any) => a.name.localeCompare(b.name));
    });

    const extractOptionsAsObjects = (groupNames: string[], groupIds: string[] = []) => {
        const aggs = (listingData.value as any)?.data?.aggregations || (listingData.value as any)?.aggregations;
        const properties = aggs?.properties?.entities || [];
        const opts = new Map<string, any>(); // Map to prevent duplicates by ID

        properties.forEach((group: any) => {
            const gName = (group.translated?.name || group.name || '').toLowerCase();
            const gId = group.id;
            
            if (groupNames.some(name => gName.includes(name.toLowerCase())) || groupIds.includes(gId)) {
                const options = group.options || [];
                options.forEach((o: any) => {
                    const optionName = o.translated?.name || o.name;
                    if (optionName) {
                        const color = o.colorHexCode || 
                                     o.customFields?.color || 
                                     o.customFields?.color_hex ||
                                     o.translated?.customFields?.color ||
                                     null;

                        opts.set(o.id, { 
                            id: o.id, 
                            name: optionName,
                            color: color
                        });
                    }
                });
            }
        });
        return Array.from(opts.values()).sort((a: any, b: any) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    };

    const extractOptionsFromAggregations = (groupNames: string[]) => {
        return extractOptionsAsObjects(groupNames).map(o => o.name);
    };

    const availableSizes = computed(() => extractOptionsFromAggregations(['size', 'veľkosť', 'rámu']));
    const availableColors = computed(() => extractOptionsFromAggregations(['color', 'farba']));
    const availableGenders = computed(() => extractOptionsFromAggregations(['gender', 'pohlavie', 'určenie']));
    const availableWheelSizes = computed(() => extractOptionsFromAggregations(['wheel', 'kolesa']));

    // Dynamic Shopware Native Properties for filtering components
    // Emitting object arrays {id, name} directly to UI mapping
    const availableWheelsNorm = computed(() => extractOptionsAsObjects(['veľkosť kolies', 'velkost kolies', 'wheel size']));
    const availableForkNorm = computed(() => extractOptionsAsObjects(['typ vidlice', 'fork type']));
    const availableBrakesNorm = computed(() => extractOptionsAsObjects(['typ bŕzd', 'typ brzd']));
    const availableGearsNorm = computed(() => extractOptionsAsObjects(['séria prehadzovačky', 'seria prehadzovacky']));
    const availableMotorNorm = computed(() => extractOptionsAsObjects(['značka motora', 'znacka motora']));
    const availableBatteryNorm = computed(() => extractOptionsAsObjects(['kapacita batérie', 'kapacita baterie']));
    const availableColorsNorm = computed(() => extractOptionsAsObjects(['farba', 'barva', 'color'], [config.public.shopware.ids.properties.color]));

    return {
        listingData,
        listingStatus,
        products,
        visibleProducts,
        total,
        page,
        limit,
        loadMore,
        prefetchNextPage,
        prefetchSubcategory,
        isLoadingMore,
        isPrefetchRunning,
        availableBrands,
        availableSizes,
        availableColors,
        availableGenders,
        availableWheelSizes,
        categoryMinPrice,
        categoryMaxPrice,
        availableWheelsNorm,
        availableForkNorm,
        availableBrakesNorm,
        availableGearsNorm,
        availableMotorNorm,
        availableBatteryNorm,
        availableColorsNorm,
    };
};
