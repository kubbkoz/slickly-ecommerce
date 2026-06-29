<script setup lang="ts">
import { usePrice } from '#imports';
import { useSearchState }      from './search/useSearchState';
import { useRecentSearches }   from './search/useRecentSearches';
import { useSearchSuggest }    from './search/useSearchSuggest';
import { useFeaturedProducts } from './search/useFeaturedProducts';
import { useSearchIntent }     from '~/composables/useSearchIntent';
import type { SuggestCategory } from './search/useSearchSuggest';
import SearchInput    from './search/SearchInput.vue';
import SearchDropdown from './search/SearchDropdown.vue';

defineOptions({ name: 'SearchBar' });

const router     = useRouter();
const localePath = useLocalePath();
const { t }      = useStaticTranslations();
const { getFormattedPrice }                = usePrice();
const { getProductUrl, getProductImageUrl } = useProductHelpers();
const { resolve: resolveIntent }           = useSearchIntent();

// ── Composables ───────────────────────────────────────────────────────────────
const state = useSearchState();
const {
    searchQuery, isOpen, dropdownTop, dropdownLeft, dropdownWidth,
    searchWrapperRef, mount, unmount, open, close, clearQuery, onKeydown,
} = state;

const recent = useRecentSearches();
const {
    recentSearches, load: loadRecent, save: saveRecent,
    remove: removeRecent, clear: clearAllRecent,
} = recent;

const suggest = useSearchSuggest(searchQuery);
const {
    getProducts, searchTerm, suggestManufacturers, suggestCategories,
    suggestTags, suggestProperties, totalResults,
    isLoading, showEmpty, showResults, fetchSuggest,
} = suggest;

const featured = useFeaturedProducts();
const { featuredProducts, fetch: fetchFeatured } = featured;

// ── Sub-component refs ────────────────────────────────────────────────────────
const searchInputComp = ref<InstanceType<typeof SearchInput> | null>(null);

watch(searchInputComp, (comp) => {
    state.searchInputRef.value = comp?.inputEl ?? null;
});

// ── Static data ───────────────────────────────────────────────────────────────
const trendingSearches = [
    'Elektrobicykle', 'Flaše na bicykel', 'Panské bicykle',
    'Oblečenie', 'DEMA', 'Horské elektrobicykle',
];

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(() => { mount(); loadRecent(); });
onUnmounted(unmount);

// ── Lazy load featured products when dropdown is first opened ─────────────────
watch(isOpen, (opened) => {
    if (opened && featuredProducts.value.length === 0) {
        fetchFeatured();
    }
});

// ── Navigation ────────────────────────────────────────────────────────────────
const navigateToSearch = (term?: string) => {
    const q = (term ?? searchQuery.value).trim();
    if (!q) return;
    saveRecent(q);
    close();
    searchQuery.value = '';
    searchTerm.value  = '';

    const { path } = resolveIntent(q);
    router.push(localePath(path));
};

const handleProductClick = (product: any) => {
    close();
    searchQuery.value = '';
    router.push(localePath(getProductUrl(product)));
};

const handleCategoryClick = (cat: SuggestCategory) => {
    close();
    searchQuery.value = '';
    searchTerm.value  = '';
    router.push(localePath(cat.url));
};

// Recent searches → populate input + show suggest
const handlePickTerm = (term: string) => {
    searchQuery.value = term;
    fetchSuggest(term);
};

// Trending searches → go DIRECTLY to search results page (better category relevance)
const handleTrendingClick = (term: string) => {
    navigateToSearch(term);
};

// ── Keyboard ──────────────────────────────────────────────────────────────────
const handleKeydown = (e: KeyboardEvent) => onKeydown(e, navigateToSearch);
</script>

<template>
  <div class="hidden lg:flex flex-1 max-w-2xl relative" ref="searchWrapperRef">

    <SearchInput
      ref="searchInputComp"
      v-model="searchQuery"
      :is-open="isOpen"
      :is-loading="isLoading"
      :placeholder="t('hladat_placeholder')"
      @focus="open()"
      @keydown="handleKeydown"
      @search="navigateToSearch()"
      @clear="clearQuery()"
    />

    <SearchDropdown
      :is-open="isOpen"
      :dropdown-top="dropdownTop"
      :dropdown-left="dropdownLeft"
      :dropdown-width="dropdownWidth"
      :show-empty="showEmpty"
      :show-results="showResults"
      :is-loading="isLoading"
      :search-query="searchQuery"
      :recent-searches="recentSearches"
      :trending-searches="trendingSearches"
      :featured-products="featuredProducts"
      :products="getProducts"
      :manufacturers="suggestManufacturers"
      :categories="suggestCategories"
      :tags="suggestTags"
      :properties="suggestProperties"
      :total-results="totalResults"
      :get-formatted-price="getFormattedPrice"
      :get-product-image-url="getProductImageUrl"
      @pick-term="handlePickTerm"
      @navigate-term="handleTrendingClick"
      @remove-term="removeRecent"
      @clear-all="clearAllRecent()"
      @product-click="handleProductClick"
      @navigate-search="navigateToSearch"
      @category-click="handleCategoryClick"
    />

  </div>
</template>
