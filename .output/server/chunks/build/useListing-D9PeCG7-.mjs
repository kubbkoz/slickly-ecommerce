import { getListingFilters } from '@shopware/helpers';
import { ref, inject, provide, computed } from 'vue';
import { u as useCategory } from './useCategory-DZrTDjvY.mjs';
import { k as createSharedComposable, e as useShopwareContext, S as createInjectionState } from './server.mjs';

function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}
function merge(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();
  if (source === void 0) {
    return target;
  }
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        merge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return merge(target, ...sources);
}
function useListing(params) {
  const listingType = params?.listingType || "categoryListing";
  let categoryId = params?.categoryId || null;
  const { apiClient } = useShopwareContext();
  let searchMethod;
  if (listingType === "productSearchListing") {
    searchMethod = async (searchCriteria) => {
      const { data } = await apiClient.invoke("searchPage post /search", {
        headers: {
          "sw-include-seo-urls": true
        },
        body: searchCriteria
      });
      return data;
    };
  } else {
    if (!categoryId) {
      const { category } = useCategory();
      categoryId = category.value?.id;
    }
    searchMethod = async (searchCriteria) => {
      const { data } = await apiClient.invoke(
        "readProductListing post /product-listing/{categoryId}",
        {
          headers: {
            "sw-include-seo-urls": true
          },
          pathParams: {
            categoryId
            // null exception in useCategory,
          },
          body: searchCriteria
        }
      );
      return data;
    };
  }
  return createListingComposable({
    listingKey: listingType,
    searchMethod,
    searchDefaults: params?.defaultSearchCriteria || {},
    //getDefaults(),
    initialListing: params?.initialListing
  });
}
const [_createCategoryListingContext] = createInjectionState(
  (initialListing) => {
    return useListing({
      listingType: "categoryListing",
      initialListing
    });
  },
  {
    injectionKey: "categoryListing"
  }
);
const createCategoryListingContext = _createCategoryListingContext;
const useProductSearchListing = createSharedComposable(
  () => useListing({ listingType: "productSearchListing" })
);
function createListingComposable({
  searchMethod,
  searchDefaults,
  listingKey,
  initialListing
}) {
  const loading = ref(false);
  const loadingMore = ref(false);
  const _storeInitialListing = inject(`useListingInitial-${listingKey}`, ref(initialListing ?? null));
  provide(`useListingInitial-${listingKey}`, _storeInitialListing);
  const _storeAppliedListing = inject(`useListingApplied-${listingKey}`, ref(null));
  provide(`useListingApplied-${listingKey}`, _storeAppliedListing);
  const getInitialListing = computed(() => _storeInitialListing.value);
  const setInitialListing = async (initialListing2) => {
    _storeInitialListing.value = initialListing2;
    _storeAppliedListing.value = null;
  };
  const initSearch = async (criteria) => {
    loading.value = true;
    try {
      const searchCriteria = merge(
        {},
        searchDefaults,
        criteria
      );
      const result = await searchMethod(searchCriteria);
      return result;
    } finally {
      loading.value = false;
    }
  };
  async function search(criteria) {
    loading.value = true;
    try {
      const searchCriteria = merge(
        {},
        searchDefaults,
        criteria
      );
      const result = await searchMethod(searchCriteria);
      _storeAppliedListing.value = result;
    } finally {
      loading.value = false;
    }
  }
  const loadMore = async (criteria) => {
    loadingMore.value = true;
    try {
      const q = criteria ? criteria : {
        // ...router.currentRoute.query,
        p: getCurrentPage.value + 1
      };
      const searchCriteria = merge(
        {},
        searchDefaults,
        q
      );
      const result = await searchMethod(searchCriteria);
      _storeAppliedListing.value = {
        ...getCurrentListing.value || {},
        page: result.page,
        elements: [
          ...getCurrentListing.value?.elements || [],
          ...result.elements ?? []
        ]
      };
    } finally {
      loadingMore.value = false;
    }
  };
  const getCurrentListing = computed(() => {
    return _storeAppliedListing.value || getInitialListing.value;
  });
  const getElements = computed(() => {
    return getCurrentListing.value?.elements || [];
  });
  const getTotal = computed(() => {
    return getCurrentListing.value?.total || 0;
  });
  const getLimit = computed(() => {
    return getCurrentListing.value?.limit || searchDefaults?.limit || 10;
  });
  const getTotalPagesCount = computed(
    () => Math.ceil(getTotal.value / getLimit.value)
  );
  const getSortingOrders = computed(() => {
    return getCurrentListing.value?.availableSortings;
  });
  const getCurrentSortingOrder = computed(
    () => getCurrentListing.value?.sorting
  );
  async function changeCurrentSortingOrder(order, query) {
    await search(
      Object.assign(
        {
          order
        },
        query
      )
    );
  }
  const getCurrentPage = computed(() => getCurrentListing.value?.page || 1);
  const changeCurrentPage = async (page, query) => {
    await search(
      Object.assign(
        {
          page
        },
        query
      )
    );
  };
  const getInitialFilters = computed(() => {
    return getListingFilters(getInitialListing.value?.aggregations);
  });
  const getAvailableFilters = computed(() => {
    return getListingFilters(
      _storeAppliedListing.value?.aggregations || getCurrentListing.value?.aggregations
    );
  });
  const getCurrentFilters = computed(() => {
    return getCurrentListing.value?.currentFilters;
  });
  const setCurrentFilters = (filters) => {
    const newFilters = {};
    for (const filter of filters) {
      Object.assign(newFilters, { [filter.code]: filter.value });
    }
    const appliedFilters = Object.assign(
      {},
      getCurrentFilters.value,
      {
        query: getCurrentFilters.value?.search,
        manufacturer: getCurrentFilters.value?.manufacturer?.join("|"),
        properties: getCurrentFilters.value?.properties?.join("|")
      },
      { ...newFilters }
    );
    if (_storeAppliedListing.value) {
      _storeAppliedListing.value.currentFilters = {
        ...appliedFilters,
        manufacturer: appliedFilters.manufacturer?.split("|"),
        properties: appliedFilters.properties?.split("|")
      };
    }
    return search(
      appliedFilters
    );
  };
  const resetFilters = () => {
    const defaultFilters = Object.assign(
      {
        manufacturer: [],
        properties: [],
        price: { min: 0, max: 0 },
        search: getCurrentFilters.value?.search
      },
      searchDefaults
    );
    if (_storeAppliedListing.value) {
      _storeAppliedListing.value.currentFilters = defaultFilters;
    }
    return search({ search: getCurrentFilters.value?.search || "" });
  };
  const filtersToQuery = (filters) => {
    const queryObject = {};
    for (const filter in filters) {
      const currentFilter = filters[filter];
      if (currentFilter) {
        if (Array.isArray(currentFilter) && currentFilter.length) {
          queryObject[filter] = currentFilter.join("|");
        } else if (!Array.isArray(currentFilter)) {
          queryObject[filter] = currentFilter;
        }
      }
    }
    return queryObject;
  };
  return {
    changeCurrentPage,
    changeCurrentSortingOrder,
    filtersToQuery,
    getAvailableFilters,
    getCurrentFilters,
    getCurrentListing,
    getCurrentPage,
    getCurrentSortingOrder,
    getElements,
    getInitialFilters,
    getInitialListing,
    getLimit,
    getSortingOrders,
    getTotal,
    getTotalPagesCount,
    initSearch,
    loadMore,
    loading: computed(() => loading.value),
    loadingMore: computed(() => loadingMore.value),
    resetFilters,
    search,
    setCurrentFilters,
    setInitialListing
  };
}

export { createCategoryListingContext as c, useProductSearchListing as u };
