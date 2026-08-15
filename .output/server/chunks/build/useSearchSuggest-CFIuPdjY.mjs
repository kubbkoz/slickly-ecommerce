import { ref, computed, watch } from 'vue';
import { e as useShopwareContext, o as useDebounceFn, G as getCategoryUrl } from './server.mjs';
import { u as useProductSearchListing } from './useListing-D9PeCG7-.mjs';
import { u as useShopwareLanguage } from './useShopwareLanguage-CGPCneCN.mjs';

function useProductSearchSuggest() {
  const searchTerm = ref("");
  const listingComposable = useProductSearchListing();
  const search = async (additionalCriteria = {}) => {
    const searchCriteria = {
      ...additionalCriteria,
      search: searchTerm.value
    };
    return listingComposable.search(searchCriteria);
  };
  return {
    searchTerm,
    loading: listingComposable.loading,
    search,
    loadMore: listingComposable.loadMore,
    getProducts: listingComposable.getElements,
    getTotal: listingComposable.getTotal
  };
}
const RECENT_KEY = "mts_recent_searches";
const useRecentSearches = () => {
  const recentSearches = ref([]);
  const load = () => {
    return;
  };
  const save = (term) => {
    return;
  };
  const remove = (term, e) => {
    e?.stopPropagation();
    recentSearches.value = recentSearches.value.filter((s) => s !== term);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recentSearches.value));
  };
  const clear = () => {
    recentSearches.value = [];
    localStorage.removeItem(RECENT_KEY);
  };
  return { recentSearches, load, save, remove, clear };
};
const MIN_CHARS = 2;
const useSearchSuggest = (searchQuery) => {
  const { apiClient } = useShopwareContext();
  const { currentLanguageId } = useShopwareLanguage();
  const { searchTerm, search: searchSuggest, getProducts, loading: loadingProducts } = useProductSearchSuggest();
  const suggestManufacturers = ref([]);
  const suggestCategories = ref([]);
  const suggestTags = ref([]);
  const suggestProperties = ref([]);
  const totalResults = ref(0);
  const loadingExtra = ref(false);
  const hasQuery = computed(() => searchQuery.value.trim().length >= MIN_CHARS);
  const showEmpty = computed(() => !hasQuery.value);
  const showResults = computed(() => hasQuery.value);
  const isLoading = computed(() => loadingProducts.value || loadingExtra.value);
  const reset = () => {
    suggestManufacturers.value = [];
    suggestCategories.value = [];
    suggestTags.value = [];
    suggestProperties.value = [];
    totalResults.value = 0;
  };
  const fetchSuggest = useDebounceFn(async (term) => {
    if (term.trim().length < MIN_CHARS) {
      reset();
      return;
    }
    loadingExtra.value = true;
    searchTerm.value = term;
    const termLower = term.toLowerCase();
    try {
      const langHeader = { "sw-language-id": currentLanguageId.value };
      const [, searchRes, categoryRes] = await Promise.all([
        // ① Products — suggest endpoint with manufacturer + tags
        searchSuggest({
          associations: {
            seoUrls: {},
            cover: { associations: { media: {} } },
            options: { associations: { group: {} } },
            manufacturer: { associations: { media: {} } },
            tags: {}
          },
          includes: {
            product: ["id", "name", "translated", "cover", "calculatedPrice", "seoUrls", "manufacturerId", "options", "optionIds", "variation", "manufacturer", "tags", "tagIds"],
            seo_url: ["seoPathInfo", "isCanonical"],
            property_group_option: ["id", "name", "translated", "groupId", "group"],
            property_group: ["id", "name", "translated"],
            product_manufacturer: ["id", "name", "translated", "media"],
            media: ["url"],
            tag: ["id", "name", "translated"]
          }
        }),
        // ② Total count + aggregations (manufacturer + properties)
        apiClient.invoke("searchPage post /search", {
          body: {
            search: term,
            limit: 1,
            includes: {
              product: ["id"],
              product_manufacturer: ["id", "name", "translated", "media"],
              property_group: ["id", "name", "translated", "options"],
              property_group_option: ["id", "name", "translated"],
              media: ["url"]
            }
          },
          headers: langHeader
        }),
        // ③ Categories — name search
        apiClient.invoke("readCategoryList post /category", {
          headers: langHeader,
          body: {
            limit: 6,
            filter: [
              { type: "contains", field: "name", value: term },
              { type: "equals", field: "active", value: true }
            ],
            sort: [{ field: "level", order: "ASC" }],
            associations: { seoUrls: {}, media: {} }
          }
        })
      ]);
      const rawSearch = searchRes?.data ?? searchRes;
      totalResults.value = rawSearch?.total ?? 0;
      const mfrAgg = rawSearch?.aggregations?.manufacturer;
      const mfrEntities = mfrAgg?.entities || mfrAgg?.elements || [];
      const logoMap = /* @__PURE__ */ new Map();
      for (const p of getProducts.value ?? []) {
        const m = p.manufacturer;
        if (m?.id && m?.media?.url) logoMap.set(m.id, m.media.url);
      }
      suggestManufacturers.value = mfrEntities.map((m) => ({
        id: m.id,
        name: m.translated?.name || m.name || "",
        logo: m.media?.url ?? logoMap.get(m.id) ?? null
      })).filter((m) => m.name).slice(0, 6);
      const tagMap = /* @__PURE__ */ new Map();
      for (const p of getProducts.value ?? []) {
        const tags = p.tags;
        if (Array.isArray(tags)) {
          for (const tag of tags) {
            if (tag?.id && !tagMap.has(tag.id)) {
              const tagName = tag.translated?.name || tag.name || "";
              if (tagName && tagName.toLowerCase().includes(termLower)) {
                tagMap.set(tag.id, { id: tag.id, name: tagName });
              }
            }
          }
        }
      }
      suggestTags.value = [...tagMap.values()].slice(0, 4);
      const propsAgg = rawSearch?.aggregations?.properties;
      if (propsAgg?.entities && Array.isArray(propsAgg.entities)) {
        const matched = [];
        for (const group of propsAgg.entities) {
          const groupName = group.translated?.name || group.name || "";
          for (const opt of group.options || []) {
            const optName = opt.translated?.name || opt.name || "";
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
      const rawCats = categoryRes?.data?.elements || [];
      suggestCategories.value = rawCats.filter((c) => c.type !== "folder" && c.type !== "link").slice(0, 6).map((c) => ({
        id: c.id,
        name: c.translated?.name || c.name || "",
        imageUrl: c.media?.url ?? null,
        url: getCategoryUrl(c)
      }));
    } catch (err) {
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
    fetchSuggest
  };
};

export { useSearchSuggest as a, useRecentSearches as u };
