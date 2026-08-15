import { ref, computed, watch, nextTick } from 'vue';
import { e as useShopwareContext, h as useAsyncData, j as useNuxtApp, o as useDebounceFn, i as useRuntimeConfig } from './server.mjs';
import { u as useShopwareLanguage } from './useShopwareLanguage-CGPCneCN.mjs';

const useCategoryListing = (navigationId, filters) => {
  const { apiClient } = useShopwareContext();
  const config = useRuntimeConfig();
  const { currentLanguageId } = useShopwareLanguage();
  const {
    sortBy,
    selectedBrands,
    selectedProperties,
    selectedColors,
    priceRange,
    searchQuery,
    isPromotion,
    isFeatured,
    inStockOnly,
    onDemandOnly,
    riderHeight,
    selectedWheelsNorm,
    selectedForkNorm,
    selectedBrakesNorm,
    selectedGearsNorm,
    selectedMotorNorm,
    selectedBatteryNorm
  } = filters;
  const limit = ref(24);
  const page = ref(1);
  ref(null);
  ref(false);
  const prefetchedNextPage = ref(null);
  const isPrefetchRunning = ref(false);
  const isLoadingMore = ref(false);
  const getCriteria = (p) => {
    const activeApiFilters = [];
    if (searchQuery?.value) {
      activeApiFilters.push({
        type: "multi",
        operator: "or",
        queries: [
          { type: "contains", field: "name", value: searchQuery.value },
          { type: "contains", field: "manufacturer.name", value: searchQuery.value }
        ]
      });
    }
    if (isPromotion?.value) {
      activeApiFilters.push({
        type: "equals",
        field: "cheapestPrice.hasListPrice",
        value: true
      });
    }
    if (isFeatured?.value) {
      activeApiFilters.push({
        type: "equals",
        field: "markAsTopseller",
        value: true
      });
    }
    if (inStockOnly?.value && onDemandOnly?.value) {
      activeApiFilters.push({
        type: "multi",
        operator: "or",
        queries: [
          { type: "range", field: "availableStock", parameters: { gt: 0 } },
          {
            type: "multi",
            operator: "and",
            queries: [
              { type: "equals", field: "availableStock", value: 0 },
              { type: "equals", field: "isCloseout", value: false }
            ]
          }
        ]
      });
    } else if (inStockOnly?.value) {
      activeApiFilters.push({
        type: "range",
        field: "availableStock",
        parameters: { gt: 0 }
      });
    } else if (onDemandOnly?.value) {
      activeApiFilters.push({
        type: "multi",
        operator: "and",
        queries: [
          { type: "equals", field: "availableStock", value: 0 },
          { type: "equals", field: "isCloseout", value: false }
        ]
      });
    }
    if (riderHeight?.value) {
      const h = riderHeight.value;
      activeApiFilters.push({
        type: "multi",
        operator: "and",
        queries: [
          { type: "range", field: "customFields.mtsport_height_min", parameters: { lte: h } },
          { type: "range", field: "customFields.mtsport_height_max", parameters: { gte: h } }
        ]
      });
    }
    const getPropertyUuids = (names, groupNamesList) => {
      if (!names || names.length === 0) return [];
      return extractOptionsAsObjects(groupNamesList).filter((o) => names.includes(o.name)).map((o) => o.id);
    };
    const resolvedSizes = getPropertyUuids(selectedProperties.value, ["size", "veľkosť", "rámu"]);
    const resolvedGenders = getPropertyUuids(selectedProperties.value, ["gender", "pohlavie", "určenie"]);
    const resolvedWheelSizes = getPropertyUuids(selectedProperties.value, ["wheel", "kolesa"]);
    const resolvedGenProps = getPropertyUuids(selectedProperties.value, ["vlastnosti"]);
    const allPropertyUuids = [
      .../* @__PURE__ */ new Set([
        ...resolvedSizes,
        ...resolvedGenders,
        ...resolvedWheelSizes,
        ...resolvedGenProps,
        ...selectedColors.value,
        // Direct UUIDs from the swatch filter
        ...selectedWheelsNorm?.value || [],
        ...selectedForkNorm?.value || [],
        ...selectedBrakesNorm?.value || [],
        ...selectedGearsNorm?.value || [],
        ...selectedMotorNorm?.value || [],
        ...selectedBatteryNorm?.value || []
      ])
    ];
    return {
      limit: limit.value,
      p,
      order: sortBy.value,
      filter: activeApiFilters.length ? activeApiFilters : void 0,
      aggregations: void 0,
      manufacturer: selectedBrands.value.length ? selectedBrands.value.join("|") : void 0,
      properties: allPropertyUuids.length ? allPropertyUuids.join("|") : void 0,
      "min-price": priceRange.value[0] > 0 ? priceRange.value[0] : void 0,
      "max-price": priceRange.value[1] < 1e4 ? priceRange.value[1] : void 0,
      // FIX-1.7 (updated): Restored lightweight associations needed by ProductCard
      // (variants, logo, secondary image) but strictly restricted via `includes`.
      associations: {
        cover: { associations: { media: {} } },
        manufacturer: { associations: { media: {} } },
        options: { associations: { group: {} } },
        media: {
          associations: { media: {} },
          sort: "position"
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
          "id",
          "name",
          "description",
          "translated",
          "cover",
          "manufacturer",
          "options",
          "seoUrls",
          "calculatedPrice",
          "childCount",
          "available",
          "availableStock",
          "isCloseout",
          "children",
          "media",
          "ratingAverage",
          "productReviewsCount",
          "customFields",
          "createdAt",
          "tagIds",
          "categoryTree",
          "manufacturerId"
        ],
        product_media: ["media", "position"],
        media: ["url", "thumbnails", "fileName", "mimeType"],
        media_thumbnail: ["url", "width"],
        product_manufacturer: ["id", "name", "translated", "media"],
        property_group_option: ["id", "name", "translated", "group", "colorHexCode", "customFields"],
        property_group: ["id", "name", "translated", "options", "filterable"],
        seo_url: ["seoPathInfo", "isCanonical"]
      }
    };
  };
  const getCacheKey = (catId, p = 1) => {
    const cfs = [
      riderHeight?.value || "",
      (selectedWheelsNorm?.value || []).join("-"),
      (selectedForkNorm?.value || []).join("-"),
      (selectedBrakesNorm?.value || []).join("-"),
      (selectedGearsNorm?.value || []).join("-"),
      (selectedMotorNorm?.value || []).join("-"),
      (selectedBatteryNorm?.value || []).join("-"),
      selectedColors.value.join("-")
    ].join("_");
    return `listing-${catId}-${sortBy.value}-${selectedBrands.value.join("-")}-${selectedProperties.value.join("-")}-${selectedColors.value.join("-")}-${priceRange.value.join("-")}-${isPromotion?.value ? "promo" : "nopromo"}-${isFeatured?.value ? "featured" : ""}-${searchQuery?.value || ""}-${cfs}-${p}`;
  };
  const { data: listingData, status: listingStatus, refresh } = useAsyncData(
    getCacheKey(navigationId, 1),
    async () => {
      const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$|^[0-9a-f]{32}$/i;
      if (!navigationId || !UUID_RE.test(navigationId)) {
        return null;
      }
      const criteria = getCriteria(1);
      try {
        const res = await apiClient.invoke(`readProductListing post /product-listing/${navigationId}`, {
          body: criteria,
          headers: {
            // FIX-1.3: Read .value inside async is safe; calling the composable itself is not.
            "sw-language-id": currentLanguageId.value
          }
        });
        return res;
      } catch (e) {
        return null;
      }
    },
    {
      watch: [
        sortBy,
        selectedBrands,
        selectedProperties,
        selectedColors,
        priceRange,
        inStockOnly,
        onDemandOnly,
        isPromotion,
        isFeatured || ref(false),
        searchQuery,
        riderHeight || ref(null),
        selectedWheelsNorm || ref([]),
        selectedForkNorm || ref([]),
        selectedBrakesNorm || ref([]),
        selectedGearsNorm || ref([]),
        selectedMotorNorm || ref([]),
        selectedBatteryNorm || ref([])
      ],
      // lazy: false → page renders skeleton INSTANTLY on client-side navigation,
      // while SSR first load strictly waits for data to improve SEO and fix hydration node mismatches
      lazy: false,
      getCachedData(key) {
        const nuxtApp = useNuxtApp();
        if (nuxtApp.isHydrating) {
          return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
        }
        return void 0;
      }
    }
  );
  const VIEWPORT_BATCH = 8;
  const visibleProducts = ref([]);
  const products = computed(
    () => visibleProducts.value.length > 0 || false ? visibleProducts.value : extractElementsAsArray(listingData.value).slice(0, VIEWPORT_BATCH)
  );
  const total = computed(() => listingData.value?.data?.total || listingData.value?.total || 0);
  const categoryMinPrice = computed(() => {
    const aggs = listingData.value?.data?.aggregations || listingData.value?.aggregations;
    return Number(aggs?.price?.min ?? 0);
  });
  const categoryMaxPrice = computed(() => {
    const aggs = listingData.value?.data?.aggregations || listingData.value?.aggregations;
    return Number(aggs?.price?.max ?? 1e4);
  });
  const prefetchSubcategory = async (subId) => {
    const nuxtApp = useNuxtApp();
    const cacheKey = getCacheKey(subId, 1);
    if (nuxtApp.payload.data[cacheKey]) return;
    try {
      const res = await apiClient.invoke(
        `readProductListing post /product-listing/${subId}`,
        {
          body: getCriteria(1),
          headers: { "sw-language-id": currentLanguageId.value }
        }
      );
      if (res) nuxtApp.payload.data[cacheKey] = res;
    } catch (_) {
    }
  };
  const prefetchNextPage = async () => {
    const nextPage = page.value + 1;
    if (isPrefetchRunning.value || prefetchedNextPage.value !== null || products.value.length >= total.value) return;
    isPrefetchRunning.value = true;
    try {
      const res = await apiClient.invoke(
        `readProductListing post /product-listing/${navigationId}`,
        { body: getCriteria(nextPage) }
      );
      const fetched = extractElementsAsArray(res);
      if (fetched.length > 0) {
        prefetchedNextPage.value = fetched;
      }
    } catch (_) {
    } finally {
      isPrefetchRunning.value = false;
    }
  };
  const extractElementsAsArray = (payload) => {
    if (!payload) return [];
    const els = payload.data?.elements || payload.elements;
    if (!els) return [];
    return Array.isArray(els) ? els : Object.values(els);
  };
  const loadMore = async () => {
    if (products.value.length >= total.value || isLoadingMore.value) return;
    isLoadingMore.value = true;
    const nextPage = page.value + 1;
    try {
      let newItems;
      if (prefetchedNextPage.value !== null) {
        newItems = prefetchedNextPage.value;
        prefetchedNextPage.value = null;
      } else {
        const res = await apiClient.invoke(
          `readProductListing post /product-listing/${navigationId}`,
          { body: getCriteria(nextPage) }
        );
        newItems = extractElementsAsArray(res);
      }
      if (newItems.length > 0) {
        const deduped = newItems.filter((n) => !visibleProducts.value.some((e) => e.id === n.id));
        page.value = nextPage;
        visibleProducts.value.push(...deduped);
        prefetchedNextPage.value = null;
        nextTick(() => prefetchNextPage());
      }
    } catch (error) {
    } finally {
      isLoadingMore.value = false;
    }
  };
  const initVisibleProducts = (fetchedItems) => {
    if (fetchedItems.length > 0) {
      page.value = 1;
      visibleProducts.value = fetchedItems.slice(0, VIEWPORT_BATCH);
    } else {
      visibleProducts.value = [];
    }
  };
  if (listingData.value) {
    const ssrItems = extractElementsAsArray(listingData.value);
    if (ssrItems.length > 0) {
      page.value = 1;
      visibleProducts.value = ssrItems.slice(0, VIEWPORT_BATCH);
    }
  }
  watch(listingData, (newVal) => {
    const fetchedItems = extractElementsAsArray(newVal);
    initVisibleProducts(fetchedItems);
  });
  watch([
    inStockOnly,
    onDemandOnly,
    isPromotion,
    selectedBrands,
    selectedProperties,
    selectedColors,
    priceRange,
    sortBy,
    searchQuery,
    riderHeight || ref(null),
    selectedWheelsNorm || ref([]),
    selectedForkNorm || ref([]),
    selectedBrakesNorm || ref([]),
    selectedGearsNorm || ref([]),
    selectedMotorNorm || ref([]),
    selectedBatteryNorm || ref([])
  ], useDebounceFn(async () => {
    page.value = 1;
    visibleProducts.value = [];
    await refresh({ dedupe: "cancel" });
  }, 300), { deep: true });
  const availableBrands = computed(() => {
    const aggs = listingData.value?.data?.aggregations || listingData.value?.aggregations;
    const manufacturers = aggs?.manufacturer?.entities || [];
    return manufacturers.map((m) => ({
      id: m.id,
      name: m.translated?.name || m.name
    })).sort((a, b) => a.name.localeCompare(b.name));
  });
  const extractOptionsAsObjects = (groupNames, groupIds = []) => {
    const aggs = listingData.value?.data?.aggregations || listingData.value?.aggregations;
    const properties = aggs?.properties?.entities || [];
    const opts = /* @__PURE__ */ new Map();
    properties.forEach((group) => {
      const gName = (group.translated?.name || group.name || "").toLowerCase();
      const gId = group.id;
      if (groupNames.some((name) => gName.includes(name.toLowerCase())) || groupIds.includes(gId)) {
        const options = group.options || [];
        options.forEach((o) => {
          const optionName = o.translated?.name || o.name;
          if (optionName) {
            const color = o.colorHexCode || o.customFields?.color || o.customFields?.color_hex || o.translated?.customFields?.color || null;
            opts.set(o.id, {
              id: o.id,
              name: optionName,
              color
            });
          }
        });
      }
    });
    return Array.from(opts.values()).sort((a, b) => a.name.localeCompare(b.name, void 0, { numeric: true }));
  };
  const extractOptionsFromAggregations = (groupNames) => {
    return extractOptionsAsObjects(groupNames).map((o) => o.name);
  };
  const availableSizes = computed(() => extractOptionsFromAggregations(["size", "veľkosť", "rámu"]));
  const availableColors = computed(() => extractOptionsFromAggregations(["color", "farba"]));
  const availableGenders = computed(() => extractOptionsFromAggregations(["gender", "pohlavie", "určenie"]));
  const availableWheelSizes = computed(() => extractOptionsFromAggregations(["wheel", "kolesa"]));
  const availableWheelsNorm = computed(() => extractOptionsAsObjects(["veľkosť kolies", "velkost kolies", "wheel size"]));
  const availableForkNorm = computed(() => extractOptionsAsObjects(["typ vidlice", "fork type"]));
  const availableBrakesNorm = computed(() => extractOptionsAsObjects(["typ bŕzd", "typ brzd"]));
  const availableGearsNorm = computed(() => extractOptionsAsObjects(["séria prehadzovačky", "seria prehadzovacky"]));
  const availableMotorNorm = computed(() => extractOptionsAsObjects(["značka motora", "znacka motora"]));
  const availableBatteryNorm = computed(() => extractOptionsAsObjects(["kapacita batérie", "kapacita baterie"]));
  const availableColorsNorm = computed(() => extractOptionsAsObjects(["farba", "barva", "color"], [config.public.shopware.ids.properties.color]));
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
    availableColorsNorm
  };
};

export { useCategoryListing as u };
