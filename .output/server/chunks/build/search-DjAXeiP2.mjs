import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import StickyToolbar from './StickyToolbar-B4NF0glf.mjs';
import OffcanvasFilter from './OffcanvasFilter-w0NP4PVv.mjs';
import { b as useLocalePath, c as useRouter, g as useState, i as useRuntimeConfig, u as useHead, C as useSeoMeta, m as useI18n, e as useShopwareContext, F as slugify, h as useAsyncData, j as useNuxtApp, o as useDebounceFn, G as getCategoryUrl, d as useRoute, H as watchDebounced, I as __nuxt_component_0$1 } from './server.mjs';
import ProductCard from './ProductCard-F91lCt7x.mjs';
import { defineComponent, ref, computed, watch, withAsyncContext, mergeProps, unref, withCtx, openBlock, createBlock, createVNode, createTextVNode, toDisplayString, nextTick, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as _imports_0 } from './MTShape-DBVD8rjd.mjs';
import { ArrowRight, RotateCcw } from 'lucide-vue-next';
import { u as useShopwareLanguage } from './useShopwareLanguage-CGPCneCN.mjs';
import { u as useProductHelpers } from './useProductHelpers-Ch_jrkwO.mjs';
import { u as useSearchIntent } from './useSearchIntent-SSB4M-IA.mjs';
import { o as onClickOutside } from './index-B6MI764M.mjs';
import { u as usePrice } from './usePrice-CDJKOx8c.mjs';
import '../nitro/nitro.mjs';
import 'nodemailer';
import 'node:crypto';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'anymatch';
import 'lru-cache';
import 'vue-router';
import 'node:url';
import '@iconify/utils';
import 'consola';
import './useCategoryFilters-DPqBwycR.mjs';
import './ProductFilters-CjCB-Ex6.mjs';
import './useCategoryListing-BIkms3Qx.mjs';
import 'pinia';
import '@iconify/vue';
import '@shopware/api-client';
import '@shopware/helpers';
import 'js-cookie';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
import './format-tV37I8C6.mjs';
import './AddToCartButton-B8hFUbWd.mjs';
import './BaseButton-BJMOoNbK.mjs';
import './useUiState-BTlUPkrr.mjs';
import './useCustomerWishlist-CccY2iyd.mjs';
import './useProductBadges-BvF7DSTC.mjs';
import './useProductComparison-BXlqQWLK.mjs';
import './useCountrySelector-Cujau6dz.mjs';

const SEARCH_LIMIT = 24;
const useAdvancedSearch = () => {
  const { apiClient } = useShopwareContext();
  const { currentLanguageId } = useShopwareLanguage();
  const route = useRoute();
  const router = useRouter();
  const searchTerm = computed(
    () => (typeof route.query.search === "string" ? route.query.search : "") || ""
  );
  const selectedBrands = computed(() => {
    const raw = route.query.brands;
    if (!raw || typeof raw !== "string") return [];
    return raw.split("|").filter(Boolean);
  });
  const selectedProperties = computed(() => {
    const raw = route.query.properties;
    if (!raw || typeof raw !== "string") return [];
    return raw.split("|").filter(Boolean);
  });
  const minPrice = computed(() => {
    const v = route.query.min_price;
    return v && typeof v === "string" ? Number(v) : void 0;
  });
  const maxPrice = computed(() => {
    const v = route.query.max_price;
    return v && typeof v === "string" ? Number(v) : void 0;
  });
  const sortBy = computed(
    () => route.query.sort || "score"
  );
  const page = ref(1);
  const inStock = computed(() => route.query.in_stock === "1");
  const isPromo = computed(() => route.query.promo === "1");
  const filterProductNumber = computed(
    () => (typeof route.query.product_number === "string" ? route.query.product_number : "") || ""
  );
  const filterManufacturerNumber = computed(
    () => (typeof route.query.manufacturer_number === "string" ? route.query.manufacturer_number : "") || ""
  );
  const buildCriteria = (p) => {
    const filters = [];
    if (inStock.value) {
      filters.push({ type: "range", field: "availableStock", parameters: { gt: 0 } });
    }
    if (isPromo.value) {
      filters.push({
        type: "multi",
        operator: "or",
        queries: [
          { type: "range", field: "cheapestPrice.listPrice", parameters: { gt: 0 } },
          { type: "range", field: "cheapestPrice.discount", parameters: { gt: 0 } }
        ]
      });
    }
    if (filterProductNumber.value.trim()) {
      filters.push({
        type: "contains",
        field: "productNumber",
        value: filterProductNumber.value.trim()
      });
    }
    if (filterManufacturerNumber.value.trim()) {
      filters.push({
        type: "contains",
        field: "manufacturerNumber",
        value: filterManufacturerNumber.value.trim()
      });
    }
    return {
      search: searchTerm.value,
      limit: SEARCH_LIMIT,
      p,
      order: sortBy.value !== "score" ? sortBy.value : void 0,
      manufacturer: selectedBrands.value.length ? selectedBrands.value.join("|") : void 0,
      properties: selectedProperties.value.length ? selectedProperties.value.join("|") : void 0,
      "min-price": minPrice.value,
      "max-price": maxPrice.value,
      // Filters: custom field filters musia ísť cez filter array, nie cez shorthand
      filter: filters.length > 0 ? filters : void 0,
      associations: {
        cover: { associations: { media: {} } },
        manufacturer: {},
        media: {
          associations: { media: {} },
          sort: "position"
        },
        seoUrls: {},
        children: {
          associations: {
            options: { associations: { group: {} } }
          }
        },
        options: { associations: { group: {} } }
      },
      includes: {
        product: [
          "id",
          "name",
          "description",
          "translated",
          "cover",
          "manufacturer",
          "seoUrls",
          "calculatedPrice",
          "childCount",
          "available",
          "availableStock",
          "isCloseout",
          "ratingAverage",
          "productReviewsCount",
          "children",
          "options",
          "optionIds",
          "restockTime",
          "media",
          // Vyžadované pre filter a zobrazenie čísel
          "productNumber",
          "manufacturerNumber",
          // Pre MtsportBadge matching
          "createdAt",
          "tagIds",
          "categoryTree",
          "manufacturerId"
        ],
        media: ["url", "thumbnails", "fileName"],
        product_media: ["media", "position"],
        media_thumbnail: ["url", "width"],
        product_manufacturer: ["id", "name", "translated"],
        seo_url: ["seoPathInfo", "isCanonical"],
        product_option: ["id", "name", "translated", "groupId", "group"],
        product_option_group: ["id", "name", "translated"]
      }
    };
  };
  const { data, status, refresh } = useAsyncData(
    "advanced-search",
    async () => {
      if (!searchTerm.value.trim()) return null;
      try {
        return await apiClient.invoke("searchPage post /search", {
          body: buildCriteria(1),
          headers: { "sw-language-id": currentLanguageId.value }
        });
      } catch (err) {
        return null;
      }
    },
    {
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
  const prefetchedNextPage = ref(null);
  const isPrefetchRunning = ref(false);
  const isLoadingMore = ref(false);
  const extractElementsAsArray = (payload) => {
    if (!payload) return [];
    const els = payload.data?.elements || payload.elements;
    if (!els) return [];
    return Array.isArray(els) ? els : Object.values(els);
  };
  const initVisibleProducts = (fetchedItems) => {
    if (fetchedItems.length > 0) {
      page.value = 1;
      visibleProducts.value = fetchedItems.slice(0, VIEWPORT_BATCH);
    } else {
      visibleProducts.value = [];
    }
  };
  if (data.value) {
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
  watch(() => route.query, useDebounceFn(async () => {
    page.value = 1;
    visibleProducts.value = [];
    await refresh({ dedupe: "cancel" });
  }, 300), { deep: true });
  const getRaw = () => data.value?.data ?? data.value ?? {};
  const prefetchNextPage = async () => {
    const nextPage = page.value + 1;
    if (isPrefetchRunning.value || prefetchedNextPage.value !== null || visibleProducts.value.length >= (getRaw()?.total ?? 0)) return;
    isPrefetchRunning.value = true;
    try {
      const res = await apiClient.invoke("searchPage post /search", {
        body: buildCriteria(nextPage),
        headers: { "sw-language-id": currentLanguageId.value }
      });
      const fetched = extractElementsAsArray(res);
      if (fetched.length > 0) prefetchedNextPage.value = fetched;
    } catch (_) {
    } finally {
      isPrefetchRunning.value = false;
    }
  };
  const loadMore = async () => {
    if (visibleProducts.value.length >= (getRaw()?.total ?? 0) || isLoadingMore.value) return;
    isLoadingMore.value = true;
    const nextPage = page.value + 1;
    try {
      let newItems;
      if (prefetchedNextPage.value !== null) {
        newItems = prefetchedNextPage.value;
        prefetchedNextPage.value = null;
      } else {
        const res = await apiClient.invoke("searchPage post /search", {
          body: buildCriteria(nextPage),
          headers: { "sw-language-id": currentLanguageId.value }
        });
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
  const products = computed(() => visibleProducts.value);
  const total = computed(() => getRaw()?.total ?? 0);
  const totalPages = computed(() => Math.ceil(total.value / SEARCH_LIMIT));
  const loading = computed(() => status.value === "pending");
  const aggregations = computed(() => getRaw()?.aggregations ?? {});
  const availableManufacturers = computed(() => {
    const entities = aggregations.value?.manufacturer?.entities ?? [];
    return entities.map((m) => ({ id: m.id, name: m.translated?.name || m.name })).sort((a, b) => a.name.localeCompare(b.name, void 0, { sensitivity: "base" }));
  });
  const availablePriceRange = computed(() => ({
    min: Number(aggregations.value?.price?.min ?? 0),
    max: Number(aggregations.value?.price?.max ?? 1e4)
  }));
  const availablePropertyGroups = computed(() => {
    const entities = aggregations.value?.properties?.entities ?? [];
    return entities.map((group) => ({
      id: group.id,
      name: group.translated?.name || group.name,
      options: (group.options ?? []).map((o) => ({
        id: o.id,
        name: o.translated?.name || o.name,
        colorHexCode: o.colorHexCode || null
      })).sort(
        (a, b) => a.name.localeCompare(b.name, void 0, { numeric: true, sensitivity: "base" })
      )
    })).filter((g) => g.options.length > 0).sort((a, b) => a.name.localeCompare(b.name, void 0, { sensitivity: "base" }));
  });
  const hasActiveFilters = computed(
    () => selectedBrands.value.length > 0 || selectedProperties.value.length > 0 || minPrice.value !== void 0 || maxPrice.value !== void 0 || filterProductNumber.value !== "" || filterManufacturerNumber.value !== ""
  );
  const buildQuery = (overrides = {}) => {
    const q = {};
    if (searchTerm.value) q.search = searchTerm.value;
    if (selectedBrands.value.length) q.brands = selectedBrands.value.join("|");
    if (selectedProperties.value.length) q.properties = selectedProperties.value.join("|");
    if (minPrice.value !== void 0) q.min_price = minPrice.value;
    if (maxPrice.value !== void 0) q.max_price = maxPrice.value;
    if (sortBy.value && sortBy.value !== "score") q.sort = sortBy.value;
    if (filterProductNumber.value) q.product_number = filterProductNumber.value;
    if (filterManufacturerNumber.value) q.manufacturer_number = filterManufacturerNumber.value;
    return { ...q, ...overrides };
  };
  const syncToUrl = useDebounceFn(
    (overrides = {}) => {
      router.replace({ path: "/search", query: buildQuery(overrides) });
    },
    50
  );
  const toggleBrand = (id) => {
    const next = selectedBrands.value.includes(id) ? selectedBrands.value.filter((b) => b !== id) : [...selectedBrands.value, id];
    syncToUrl({ brands: next.join("|") || void 0 });
  };
  const toggleProperty = (id) => {
    const next = selectedProperties.value.includes(id) ? selectedProperties.value.filter((p) => p !== id) : [...selectedProperties.value, id];
    syncToUrl({ properties: next.join("|") || void 0 });
  };
  const setPriceRange = (min, max) => {
    const { min: globalMin, max: globalMax } = availablePriceRange.value;
    syncToUrl({
      min_price: min > globalMin ? min : void 0,
      max_price: max < globalMax ? max : void 0
    });
  };
  const setSort = (sort) => {
    syncToUrl({ sort: sort !== "score" ? sort : void 0 });
  };
  const setPage = (_p) => {
  };
  const setProductNumberFilter = (value) => {
    syncToUrl({ product_number: value.trim() || void 0 });
  };
  const setManufacturerNumberFilter = (value) => {
    syncToUrl({ manufacturer_number: value.trim() || void 0 });
  };
  const resetFilters = () => {
    router.replace({
      path: "/search",
      query: { search: searchTerm.value || void 0 }
    });
  };
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
    refresh
  };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "SearchPage" },
  __name: "search",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const localePath = useLocalePath();
    useRouter();
    const { getFormattedPrice } = usePrice();
    useProductHelpers();
    const {
      searchTerm,
      selectedBrands,
      selectedProperties,
      minPrice,
      maxPrice,
      sortBy,
      page,
      products,
      total,
      loading,
      availableManufacturers,
      availablePriceRange,
      hasActiveFilters,
      setPriceRange,
      isLoadingMore,
      isPrefetchRunning
    } = useAdvancedSearch();
    ref(null);
    useState("isPageCategory", () => false);
    const pageTitle = computed(
      () => searchTerm.value ? `Výsledky hľadania: "${searchTerm.value}" | SLICKLY` : "Vyhľadávanie | SLICKLY"
    );
    const metaDescription = computed(
      () => searchTerm.value && total.value > 0 ? `Nájdených ${total.value} produktov pre "${searchTerm.value}". Autokozmetika, detailing a príslušenstvo na SLICKLY.` : "Vyhľadajte autokozmetiku, detailing produkty a príslušenstvo na SLICKLY."
    );
    const _siteUrl = useRuntimeConfig().public.siteUrl || "https://slickly.sk";
    useHead({
      title: pageTitle,
      link: computed(() => [
        {
          rel: "canonical",
          href: searchTerm.value ? `${_siteUrl}/search?search=${encodeURIComponent(searchTerm.value)}` : `${_siteUrl}/search`
        },
        ...page.value > 1 ? [{ rel: "prev", href: `${_siteUrl}/search?search=${encodeURIComponent(searchTerm.value)}` }] : []
      ])
    });
    useSeoMeta({ title: pageTitle, description: metaDescription, ogTitle: pageTitle, ogDescription: metaDescription });
    const { locale } = useI18n();
    const { apiClient } = useShopwareContext();
    const { currentLanguageId } = useShopwareLanguage();
    const runtimeConfig = useRuntimeConfig();
    const mfrCategoryIds = ref(null);
    const _norm = (s) => s.toLowerCase().trim().normalize("NFD").replace(new RegExp("\\p{Mn}", "gu"), "");
    const matchedManufacturer = computed(() => {
      if (!searchTerm.value || !availableManufacturers.value?.length) return null;
      const term = _norm(searchTerm.value);
      return availableManufacturers.value.find((m) => _norm(m.name) === term) ?? null;
    });
    const matchedBrandSlug = computed(
      () => matchedManufacturer.value ? slugify(matchedManufacturer.value.name) : ""
    );
    watch(
      matchedManufacturer,
      async (mfr) => {
        return;
      },
      { immediate: true }
    );
    const { data: navCategories } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      `search-nav-categories-${locale.value}`,
      async () => {
        const rootId = runtimeConfig.public.shopware.ids.rootCategory;
        const response = await apiClient.invoke("readCategoryList post /category", {
          headers: { "sw-language-id": currentLanguageId.value },
          body: {
            limit: 30,
            filter: [
              { type: "equals", field: "parentId", value: rootId },
              { type: "equals", field: "active", value: true },
              { type: "equals", field: "visible", value: true }
            ],
            associations: { seoUrls: {}, media: {} }
          }
        });
        return response.data?.elements ?? [];
      },
      {
        lazy: true,
        getCachedData(key) {
          const nuxtApp = useNuxtApp();
          return nuxtApp.payload.data?.[key] ?? nuxtApp.static?.data?.[key];
        }
      }
    )), __temp = await __temp, __restore(), __temp);
    const { data: searchedCategoriesData, refresh: refreshSearchedCategories } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      "search-matched-categories",
      async () => {
        const term = searchTerm.value.trim();
        if (!term || term.length < 2) return [];
        try {
          const response = await apiClient.invoke("readCategoryList post /category", {
            headers: { "sw-language-id": currentLanguageId.value },
            body: {
              limit: 12,
              filter: [
                { type: "contains", field: "name", value: term },
                { type: "equals", field: "active", value: true },
                { type: "equals", field: "visible", value: true }
              ],
              sort: [{ field: "level", order: "ASC" }],
              associations: { seoUrls: {}, media: {} }
            }
          });
          const items = response.data?.elements ?? [];
          return items.filter((c) => c.type !== "folder" && c.type !== "link");
        } catch {
          return [];
        }
      },
      { lazy: true }
    )), __temp = await __temp, __restore(), __temp);
    const matchedCategories = computed(() => searchedCategoriesData.value ?? []);
    watch(searchTerm, useDebounceFn(() => {
      refreshSearchedCategories();
    }, 350));
    useSearchIntent();
    const brandContextLinks = computed(() => {
      if (!matchedManufacturer.value || !navCategories.value?.length) return [];
      if (mfrCategoryIds.value === null) return [];
      if (mfrCategoryIds.value.length === 0) return [];
      const idsSet = new Set(mfrCategoryIds.value);
      const mfr = matchedManufacturer.value;
      return navCategories.value.filter((cat) => cat.active !== false && cat.visible !== false).filter((cat) => idsSet.has(cat.id)).map((cat) => ({
        id: cat.id,
        name: cat.translated?.name || cat.name || "",
        image: cat.media?.url || "",
        url: { path: getCategoryUrl(cat), query: { brand: mfr.id } },
        mfrId: mfr.id,
        mfrName: mfr.name
      }));
    });
    const isFilterOpen = ref(false);
    const sortOptions = [
      { value: "score", label: "Relevancia" },
      { value: "price-asc", label: "Od najlacnejších" },
      { value: "price-desc", label: "Od najdrahších" },
      { value: "name-asc", label: "Názov od A-Z" },
      { value: "name-desc", label: "Názov od Z-A" }
    ];
    const isSortOpen = ref(false);
    const sortDropdownRef = ref(null);
    onClickOutside(sortDropdownRef, () => {
      isSortOpen.value = false;
    });
    computed(
      () => sortOptions.find((o) => o.value === sortBy.value)?.label || "Relevancia"
    );
    useRoute();
    const localMin = ref(minPrice.value ?? 0);
    const localMax = ref(maxPrice.value ?? 1e4);
    watch(availablePriceRange, (range) => {
      if (minPrice.value === void 0) localMin.value = range.min;
      if (maxPrice.value === void 0) localMax.value = range.max;
    }, { immediate: true });
    watch(minPrice, (v) => {
      if (v !== void 0) localMin.value = v;
    });
    watch(maxPrice, (v) => {
      if (v !== void 0) localMax.value = v;
    });
    watchDebounced([localMin, localMax], ([min, max]) => setPriceRange(min, max), { debounce: 400 });
    computed(() => {
      const total2 = availablePriceRange.value.max - availablePriceRange.value.min;
      if (total2 <= 0) return 0;
      return (localMin.value - availablePriceRange.value.min) / total2 * 100;
    });
    computed(() => {
      const total2 = availablePriceRange.value.max - availablePriceRange.value.min;
      if (total2 <= 0) return 0;
      return 100 - (localMax.value - availablePriceRange.value.min) / total2 * 100;
    });
    ref({
      price: true,
      brands: false,
      properties: false
    });
    const brandSearch = ref("");
    const showAllBrands = ref(false);
    const filteredBrands = computed(
      () => availableManufacturers.value.filter(
        (b) => b.name.toLowerCase().includes(brandSearch.value.toLowerCase())
      )
    );
    computed(
      () => brandSearch.value || showAllBrands.value ? filteredBrands.value : filteredBrands.value.slice(0, 6)
    );
    computed(() => !brandSearch.value && filteredBrands.value.length > 6 && !showAllBrands.value);
    ref(null);
    ref({});
    computed(() => {
      let n = selectedBrands.value.length + selectedProperties.value.length;
      if (minPrice.value !== void 0 || maxPrice.value !== void 0) n++;
      return n;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_StickyToolbar = StickyToolbar;
      const _component_OffcanvasFilter = OffcanvasFilter;
      const _component_ClientOnly = __nuxt_component_0$1;
      const _component_ProductCard = ProductCard;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white min-h-screen animate-fade-in font-sans" }, _attrs))}><div class="relative bg-[#f4f5f6] overflow-hidden"><div class="absolute -right-20 -bottom-20 md:-right-32 md:-bottom-32 w-[300px] md:w-[600px] lg:w-[800px] aspect-square pointer-events-none z-0"><img${ssrRenderAttr("src", _imports_0)} alt="" loading="lazy" class="w-full h-full object-contain opacity-50"></div><div class="container mx-auto px-4 pt-6 md:pt-10 pb-8 md:pb-12 relative z-10 w-full"><nav class="flex items-center text-xs md:text-sm text-gray-600 mb-6 gap-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(localePath)("/"),
        class: "hover:text-brand transition-colors flex items-center",
        "aria-label": "Domov"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"${_scopeId}></path></svg>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                class: "w-4 h-4",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                })
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="text-gray-400">›</span><span class="text-gray-800 font-medium">Vyhľadávanie</span>`);
      if (unref(searchTerm)) {
        _push(`<!--[--><span class="text-gray-400">›</span><span class="text-gray-600 truncate max-w-[200px] md:max-w-sm">${ssrInterpolate(unref(searchTerm))}</span><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</nav>`);
      if (unref(loading) && !unref(searchTerm)) {
        _push(`<!--[--><div class="h-10 md:h-12 bg-gray-200 w-1/3 mb-4 animate-pulse"></div><div class="h-4 bg-gray-200 w-2/3 mb-10 animate-pulse"></div><!--]-->`);
      } else {
        _push(`<!--[--><h1 class="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-2 font-tech uppercase italic">`);
        if (unref(searchTerm)) {
          _push(`<!--[-->${ssrInterpolate(unref(searchTerm))}<!--]-->`);
        } else {
          _push(`<!--[-->Vyhľadávanie<!--]-->`);
        }
        _push(`</h1>`);
        if (unref(searchTerm) && !unref(loading)) {
          _push(`<p class="text-sm text-gray-500 font-sans mb-4">`);
          if (unref(total) > 0) {
            _push(`<!--[-->Nájdených ${ssrInterpolate(unref(total))} produktov<!--]-->`);
          } else {
            _push(`<!--[-->Žiadne výsledky pre „${ssrInterpolate(unref(searchTerm))}&quot;<!--]-->`);
          }
          _push(`</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      if (unref(matchedManufacturer) && unref(matchedBrandSlug)) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(localePath)("/znacka/" + unref(matchedBrandSlug)),
          class: "inline-flex items-center gap-2 mb-6 px-4 py-2.5 bg-black text-white hover:bg-brand transition-colors font-tech text-xs md:text-sm font-bold uppercase tracking-widest"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Zobraziť značku ${ssrInterpolate(unref(matchedManufacturer).name)} `);
              _push2(ssrRenderComponent(unref(ArrowRight), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(" Zobraziť značku " + toDisplayString(unref(matchedManufacturer).name) + " ", 1),
                createVNode(unref(ArrowRight), { class: "w-4 h-4" })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(brandContextLinks).length > 0) {
        _push(`<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-1.5 md:gap-2 pb-6 px-4 md:px-0"><!--[-->`);
        ssrRenderList(unref(brandContextLinks), (link) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: link.id,
            to: link.url,
            class: "group border border-gray-100 hover:border-brand bg-white transition-colors duration-150 active:bg-gray-50 flex items-center gap-2.5 px-2.5 py-2 md:flex-col md:items-center md:gap-1.5 md:px-2 md:py-2.5"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="w-10 h-10 flex-shrink-0 overflow-hidden flex items-center justify-center md:w-full md:h-auto md:aspect-[4/3] md:flex-shrink md:mb-0.5"${_scopeId}>`);
                if (link.image) {
                  _push2(`<img${ssrRenderAttr("src", link.image)} alt="" loading="lazy" width="160" height="120" class="w-full h-full object-contain mix-blend-multiply"${_scopeId}>`);
                } else {
                  _push2(`<div class="w-full h-full flex items-center justify-center bg-gray-50"${_scopeId}><span class="text-[8px] font-bold uppercase text-gray-300"${_scopeId}>N/A</span></div>`);
                }
                _push2(`</div><span class="font-bold text-xs md:text-[12px] text-gray-900 leading-tight group-hover:text-brand transition-colors line-clamp-2 text-left md:text-center font-tech uppercase tracking-wide"${_scopeId}>${ssrInterpolate(link.name)}</span>`);
              } else {
                return [
                  createVNode("div", { class: "w-10 h-10 flex-shrink-0 overflow-hidden flex items-center justify-center md:w-full md:h-auto md:aspect-[4/3] md:flex-shrink md:mb-0.5" }, [
                    link.image ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: link.image,
                      alt: "",
                      loading: "lazy",
                      width: "160",
                      height: "120",
                      class: "w-full h-full object-contain mix-blend-multiply"
                    }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "w-full h-full flex items-center justify-center bg-gray-50"
                    }, [
                      createVNode("span", { class: "text-[8px] font-bold uppercase text-gray-300" }, "N/A")
                    ]))
                  ]),
                  createVNode("span", { class: "font-bold text-xs md:text-[12px] text-gray-900 leading-tight group-hover:text-brand transition-colors line-clamp-2 text-left md:text-center font-tech uppercase tracking-wide" }, toDisplayString(link.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_StickyToolbar, {
        aggregations: null,
        onToggleFilter: ($event) => isFilterOpen.value = true
      }, null, _parent));
      _push(ssrRenderComponent(_component_OffcanvasFilter, {
        "is-open": unref(isFilterOpen),
        "category-name": unref(searchTerm) || "Výsledky hľadania",
        aggregations: null,
        brands: unref(availableManufacturers),
        sizes: [],
        genders: [],
        colors: [],
        "wheel-sizes": [],
        "min-price": unref(availablePriceRange).min,
        "max-price": unref(availablePriceRange).max,
        onClose: ($event) => isFilterOpen.value = false
      }, null, _parent));
      _push(`<div class="container mx-auto px-0 md:px-4 py-4 md:py-8"><main>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      if (unref(loading) && unref(products).length === 0) {
        _push(`<div class="${ssrRenderClass([unref(matchedCategories).length ? "lg:grid-cols-3" : "lg:grid-cols-4", "grid grid-cols-2 md:grid-cols-3 gap-x-1 gap-y-8 md:gap-4 bg-white md:bg-transparent"])}"><!--[-->`);
        ssrRenderList(8, (i) => {
          _push(`<div class="group bg-white overflow-hidden flex flex-col relative md:border md:border-gray-100 p-2 md:p-4"><div class="relative w-full aspect-square bg-gray-100 animate-pulse mb-4"></div><div class="h-4 bg-gray-200 animate-pulse w-1/4 mb-2"></div><div class="h-3 bg-gray-200 animate-pulse w-3/4 mb-1"></div><div class="h-3 bg-gray-200 animate-pulse w-1/2"></div><div class="mt-auto pt-4 flex items-end"><div class="h-4 bg-gray-200 animate-pulse w-16"></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (!unref(searchTerm)) {
        _push(`<div class="text-center py-32 bg-gray-50"><p class="text-2xl font-bold text-gray-400 font-tech uppercase mb-2">Začnite písať</p><p class="text-gray-500 mb-8 font-sans">Zadajte hľadaný výraz do vyhľadávacieho poľa.</p></div>`);
      } else if (!unref(loading) && unref(total) === 0 && unref(searchTerm)) {
        _push(`<div class="text-center py-32 bg-gray-50"><p class="text-2xl font-bold text-gray-400 font-tech uppercase mb-2">Nenašli sa žiadne produkty</p><p class="text-gray-500 mb-8 font-sans">Skúste zmeniť hľadaný výraz alebo zrušiť filtre.</p>`);
        if (unref(hasActiveFilters)) {
          _push(`<button class="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors font-sans">`);
          _push(ssrRenderComponent(unref(RotateCcw), { class: "w-4 h-4" }, null, _parent));
          _push(` Zrušiť všetky filtre </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(products).length > 0) {
        _push(`<div class="${ssrRenderClass([[{ "opacity-50 pointer-events-none": unref(loading) }, unref(matchedCategories).length ? "lg:grid-cols-3" : "lg:grid-cols-4"], "grid grid-cols-2 md:grid-cols-3 gap-x-1 gap-y-8 md:gap-4 bg-white md:bg-transparent transition-opacity duration-300"])}"><!--[-->`);
        ssrRenderList(unref(products), (product) => {
          _push(ssrRenderComponent(_component_ProductCard, {
            key: product.id,
            product
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isLoadingMore)) {
        _push(`<div class="${ssrRenderClass([unref(matchedCategories).length ? "lg:grid-cols-3" : "lg:grid-cols-4", "grid grid-cols-2 md:grid-cols-3 gap-x-1 gap-y-8 md:gap-4 bg-white md:bg-transparent mt-1"])}" aria-label="Načítavam ďalšie produkty"><!--[-->`);
        ssrRenderList(8, (i) => {
          _push(`<div class="bg-white border border-gray-100 flex flex-col"><div class="relative w-full aspect-square bg-gray-100 animate-pulse"></div><div class="p-2 md:p-4 flex flex-col gap-2"><div class="h-3 bg-gray-100 animate-pulse w-1/3"></div><div class="h-3 bg-gray-200 animate-pulse w-full"></div><div class="h-3 bg-gray-200 animate-pulse w-3/4"></div><div class="mt-2 h-5 bg-gray-200 animate-pulse w-1/2"></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(products).length < unref(total) && !unref(isLoadingMore)) {
        _push(`<div class="h-1 w-full mt-4" aria-hidden="true"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(products).length < unref(total) && !unref(isLoadingMore)) {
        _push(`<div class="mt-8 md:mt-12 text-center pb-8"><p class="text-gray-400 text-[10px] md:text-xs mb-4 font-bold uppercase tracking-widest font-sans"> Zobrazených ${ssrInterpolate(unref(products).length)} z ${ssrInterpolate(unref(total))} produktov </p><div class="w-48 md:w-64 h-1 bg-gray-100 mx-auto mb-6 md:mb-8 overflow-hidden"><div class="h-full bg-brand transition-all duration-700" style="${ssrRenderStyle({ width: `${unref(products).length / unref(total) * 100}%` })}"></div></div><button${ssrIncludeBooleanAttr(unref(isLoadingMore)) ? " disabled" : ""} class="relative bg-black text-white hover:bg-gray-800 px-6 py-3 md:px-10 md:py-4 uppercase tracking-widest text-xs md:text-sm font-bold min-w-[200px] md:min-w-[240px] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed rounded-default" aria-label="Načítať viac produktov"><span class="flex items-center justify-center gap-2">`);
        if (unref(isPrefetchRunning)) {
          _push(`<span class="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" title="Produkty sa načítavajú na pozadí"></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(` Načítať ďalšie produkty </span></button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</main></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/search.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
