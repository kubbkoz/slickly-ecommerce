import { defineComponent, ref, watch, mergeProps, unref, isRef, nextTick, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useRecentSearches, a as useSearchSuggest } from './useSearchSuggest-CFIuPdjY.mjs';
import { u as useFeaturedProducts } from './useFeaturedProducts-BD8h0sYO.mjs';
import { u as useSearchIntent } from './useSearchIntent-SSB4M-IA.mjs';
import SearchInput from './SearchInput-DJSnmuNk.mjs';
import SearchDropdown from './SearchDropdown-DiilS_pq.mjs';
import { c as useRouter, b as useLocalePath } from './server.mjs';
import { u as useStaticTranslations } from './useStaticTranslations-DjO9xa-s.mjs';
import { u as useProductHelpers } from './useProductHelpers-Ch_jrkwO.mjs';
import { u as usePrice } from './usePrice-CDJKOx8c.mjs';
import './useListing-D9PeCG7-.mjs';
import '@shopware/helpers';
import './useCategory-DZrTDjvY.mjs';
import './useShopwareLanguage-CGPCneCN.mjs';
import 'lucide-vue-next';
import './SearchDropdownEmpty-Drtrfsti.mjs';
import './format-tV37I8C6.mjs';
import './SearchDropdownResults-Bqt5Ih8X.mjs';
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
import 'pinia';
import '@iconify/vue';
import '@shopware/api-client';
import 'js-cookie';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const useSearchState = () => {
  const searchQuery = ref("");
  const isOpen = ref(false);
  const searchInputRef = ref(null);
  const searchWrapperRef = ref(null);
  const dropdownTop = ref(0);
  const dropdownLeft = ref(0);
  const dropdownWidth = ref(0);
  const updateDropdownPosition = () => {
    if (!searchWrapperRef.value) return;
    const mainRow = (void 0).getElementById("navbar-main-row");
    dropdownTop.value = mainRow ? mainRow.getBoundingClientRect().bottom : searchWrapperRef.value.getBoundingClientRect().bottom + 10;
    const navContainer = (void 0).querySelector("nav .container");
    if (navContainer) {
      const rect = navContainer.getBoundingClientRect();
      dropdownLeft.value = rect.left;
      dropdownWidth.value = rect.width;
    }
  };
  const handleOutsideClick = (e) => {
    const target = e.target;
    if (searchWrapperRef.value?.contains(target) || target.closest("[data-search-dropdown]")) return;
    isOpen.value = false;
  };
  const mount = () => {
    updateDropdownPosition();
    (void 0).addEventListener("scroll", updateDropdownPosition, { passive: true });
    (void 0).addEventListener("resize", updateDropdownPosition, { passive: true });
    (void 0).addEventListener("pointerdown", handleOutsideClick);
  };
  const unmount = () => {
    (void 0).removeEventListener("scroll", updateDropdownPosition);
    (void 0).removeEventListener("resize", updateDropdownPosition);
    (void 0).removeEventListener("pointerdown", handleOutsideClick);
  };
  const open = () => {
    isOpen.value = true;
    nextTick(updateDropdownPosition);
  };
  const close = () => {
    isOpen.value = false;
  };
  const clearQuery = () => {
    searchQuery.value = "";
    searchInputRef.value?.focus();
  };
  const onKeydown = (e, onEnter) => {
    if (e.key === "Escape") {
      isOpen.value = false;
      searchInputRef.value?.blur();
    }
    if (e.key === "Enter") {
      onEnter();
    }
  };
  return {
    searchQuery,
    isOpen,
    searchInputRef,
    searchWrapperRef,
    dropdownTop,
    dropdownLeft,
    dropdownWidth,
    updateDropdownPosition,
    mount,
    unmount,
    open,
    close,
    clearQuery,
    onKeydown
  };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "SearchBar" },
  __name: "SearchBar",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const localePath = useLocalePath();
    const { t } = useStaticTranslations();
    const { getFormattedPrice } = usePrice();
    const { getProductUrl, getProductImageUrl } = useProductHelpers();
    const { resolve: resolveIntent } = useSearchIntent();
    const state = useSearchState();
    const {
      searchQuery,
      isOpen,
      dropdownTop,
      dropdownLeft,
      dropdownWidth,
      searchWrapperRef,
      open,
      close,
      clearQuery,
      onKeydown
    } = state;
    const recent = useRecentSearches();
    const {
      recentSearches,
      remove: removeRecent,
      clear: clearAllRecent
    } = recent;
    const suggest = useSearchSuggest(searchQuery);
    const {
      getProducts,
      searchTerm,
      suggestManufacturers,
      suggestCategories,
      suggestTags,
      suggestProperties,
      totalResults,
      isLoading,
      showEmpty,
      showResults,
      fetchSuggest
    } = suggest;
    const featured = useFeaturedProducts();
    const { featuredProducts, fetch: fetchFeatured } = featured;
    const searchInputComp = ref(null);
    watch(searchInputComp, (comp) => {
      state.searchInputRef.value = comp?.inputEl ?? null;
    });
    const trendingSearches = [
      "Exteriér",
      "Leštenie",
      "Ochrana karosérie",
      "Interiér",
      "Príslušenstvo",
      "Špeciálna ponuka"
    ];
    watch(isOpen, (opened) => {
      if (opened && featuredProducts.value.length === 0) {
        fetchFeatured();
      }
    });
    const navigateToSearch = (term) => {
      const q = (term ?? searchQuery.value).trim();
      if (!q) return;
      close();
      searchQuery.value = "";
      searchTerm.value = "";
      const { path } = resolveIntent(q);
      router.push(localePath(path));
    };
    const handleProductClick = (product) => {
      close();
      searchQuery.value = "";
      router.push(localePath(getProductUrl(product)));
    };
    const handleCategoryClick = (cat) => {
      close();
      searchQuery.value = "";
      searchTerm.value = "";
      router.push(localePath(cat.url));
    };
    const handlePickTerm = (term) => {
      searchQuery.value = term;
      fetchSuggest(term);
    };
    const handleTrendingClick = (term) => {
      navigateToSearch(term);
    };
    const handleKeydown = (e) => onKeydown(e, navigateToSearch);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "hidden lg:flex flex-1 max-w-2xl relative",
        ref_key: "searchWrapperRef",
        ref: searchWrapperRef
      }, _attrs))}>`);
      _push(ssrRenderComponent(SearchInput, {
        ref_key: "searchInputComp",
        ref: searchInputComp,
        modelValue: unref(searchQuery),
        "onUpdate:modelValue": ($event) => isRef(searchQuery) ? searchQuery.value = $event : null,
        "is-open": unref(isOpen),
        "is-loading": unref(isLoading),
        placeholder: unref(t)("hladat_placeholder"),
        onFocus: ($event) => unref(open)(),
        onKeydown: handleKeydown,
        onSearch: ($event) => navigateToSearch(),
        onClear: ($event) => unref(clearQuery)()
      }, null, _parent));
      _push(ssrRenderComponent(SearchDropdown, {
        "is-open": unref(isOpen),
        "dropdown-top": unref(dropdownTop),
        "dropdown-left": unref(dropdownLeft),
        "dropdown-width": unref(dropdownWidth),
        "show-empty": unref(showEmpty),
        "show-results": unref(showResults),
        "is-loading": unref(isLoading),
        "search-query": unref(searchQuery),
        "recent-searches": unref(recentSearches),
        "trending-searches": trendingSearches,
        "featured-products": unref(featuredProducts),
        products: unref(getProducts),
        manufacturers: unref(suggestManufacturers),
        categories: unref(suggestCategories),
        tags: unref(suggestTags),
        properties: unref(suggestProperties),
        "total-results": unref(totalResults),
        "get-formatted-price": unref(getFormattedPrice),
        "get-product-image-url": unref(getProductImageUrl),
        onPickTerm: handlePickTerm,
        onNavigateTerm: handleTrendingClick,
        onRemoveTerm: unref(removeRecent),
        onClearAll: ($event) => unref(clearAllRecent)(),
        onProductClick: handleProductClick,
        onNavigateSearch: navigateToSearch,
        onCategoryClick: handleCategoryClick
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/navbar/SearchBar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SearchBar = Object.assign(_sfc_main, { __name: "SearchBar" });

export { SearchBar as default };
