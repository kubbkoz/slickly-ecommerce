import { defineComponent, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
import SearchDropdownEmpty from './SearchDropdownEmpty-Drtrfsti.mjs';
import SearchDropdownResults from './SearchDropdownResults-Bqt5Ih8X.mjs';
import 'lucide-vue-next';
import './format-tV37I8C6.mjs';
import './useProductHelpers-Ch_jrkwO.mjs';
import './server.mjs';
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
import '@shopware/helpers';
import 'js-cookie';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "SearchDropdown" },
  __name: "SearchDropdown",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    dropdownTop: {},
    dropdownLeft: {},
    dropdownWidth: {},
    showEmpty: { type: Boolean },
    showResults: { type: Boolean },
    isLoading: { type: Boolean },
    searchQuery: {},
    recentSearches: {},
    trendingSearches: {},
    featuredProducts: {},
    products: {},
    manufacturers: {},
    categories: {},
    tags: {},
    properties: {},
    totalResults: {},
    getFormattedPrice: { type: Function },
    getProductImageUrl: { type: Function }
  },
  emits: ["pickTerm", "navigateTerm", "removeTerm", "clearAll", "productClick", "navigateSearch", "categoryClick"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.isOpen) {
          _push2(`<div data-search-dropdown class="fixed z-[65] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.14)] border border-gray-100" style="${ssrRenderStyle({
            top: `${__props.dropdownTop}px`,
            left: `${__props.dropdownLeft}px`,
            width: `${__props.dropdownWidth}px`
          })}"><div class="px-6">`);
          if (__props.showEmpty) {
            _push2(ssrRenderComponent(SearchDropdownEmpty, {
              "recent-searches": __props.recentSearches,
              "trending-searches": __props.trendingSearches,
              "featured-products": __props.featuredProducts,
              "get-formatted-price": __props.getFormattedPrice,
              "get-product-image-url": __props.getProductImageUrl,
              onPickTerm: ($event) => emit("pickTerm", $event),
              onNavigateTerm: ($event) => emit("navigateTerm", $event),
              onRemoveTerm: (term, event) => emit("removeTerm", term, event),
              onClearAll: ($event) => emit("clearAll"),
              onProductClick: ($event) => emit("productClick", $event)
            }, null, _parent));
          } else if (__props.showResults) {
            _push2(ssrRenderComponent(SearchDropdownResults, {
              products: __props.products,
              manufacturers: __props.manufacturers,
              categories: __props.categories,
              tags: __props.tags,
              properties: __props.properties,
              "total-results": __props.totalResults,
              "search-query": __props.searchQuery,
              "is-loading": __props.isLoading,
              "get-formatted-price": __props.getFormattedPrice,
              "get-product-image-url": __props.getProductImageUrl,
              onProductClick: ($event) => emit("productClick", $event),
              onNavigateSearch: ($event) => emit("navigateSearch", $event),
              onCategoryClick: ($event) => emit("categoryClick", $event)
            }, null, _parent));
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/navbar/search/SearchDropdown.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SearchDropdown = Object.assign(_sfc_main, { __name: "SearchDropdown" });

export { SearchDropdown as default };
