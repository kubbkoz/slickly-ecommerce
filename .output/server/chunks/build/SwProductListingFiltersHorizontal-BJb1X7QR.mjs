import __nuxt_component_0 from './SwFilterDropdown-C60wMOfB.mjs';
import __nuxt_component_1$1 from './SwProductListingFilter-BBWYHPB5.mjs';
import __nuxt_component_2 from './SwSortDropdown-Bbvi3pDB.mjs';
import __nuxt_component_2$1 from './BaseButton-D0eElC8N.mjs';
import { defineComponent, reactive, computed, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useCmsTranslations } from './useCmsTranslations-C7n8Bwji.mjs';
import { au as defu } from '../nitro/nitro.mjs';
import { useRoute, useRouter } from 'vue-router';
import { u as useCategoryListing } from './useCategoryListing-BIkms3Qx.mjs';
import './ChevronIcon-Aj1t6zS4.mjs';
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
import '@shopware/helpers';
import './server.mjs';
import 'pinia';
import '@iconify/vue';
import '@shopware/api-client';
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
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
import 'node:url';
import '@iconify/utils';
import 'consola';
import './index-B6MI764M.mjs';
import './Checkbox-8GjGFXe_.mjs';
import './SwitchButton-BwRPFSLu.mjs';
import './useShopwareLanguage-CGPCneCN.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SwProductListingFiltersHorizontal",
  __ssrInlineRender: true,
  props: {
    content: {},
    listingType: {}
  },
  setup(__props) {
    let translations = {
      listing: {
        filters: "Filters",
        sort: "Sort",
        resetFilters: "Reset filters"
      }
    };
    translations = defu(useCmsTranslations(), translations);
    const route = useRoute();
    const router = useRouter();
    const {
      changeCurrentSortingOrder,
      getCurrentSortingOrder,
      getInitialFilters,
      getSortingOrders,
      search
    } = useCategoryListing();
    const sidebarSelectedFilters = reactive({
      manufacturer: /* @__PURE__ */ new Set(),
      properties: /* @__PURE__ */ new Set(),
      "min-price": void 0,
      "max-price": void 0,
      rating: void 0,
      "shipping-free": void 0
    });
    const showResetFiltersButton = computed(() => {
      if (sidebarSelectedFilters.manufacturer.size !== 0 || sidebarSelectedFilters.properties.size !== 0 || sidebarSelectedFilters["max-price"] || sidebarSelectedFilters["min-price"] || sidebarSelectedFilters.rating || sidebarSelectedFilters["shipping-free"]) {
        return true;
      }
      return false;
    });
    const searchCriteriaForRequest = computed(() => ({
      manufacturer: [
        ...sidebarSelectedFilters.manufacturer
      ]?.join("|"),
      properties: [...sidebarSelectedFilters.properties]?.join(
        "|"
      ),
      "min-price": sidebarSelectedFilters["min-price"],
      "max-price": sidebarSelectedFilters["max-price"],
      order: getCurrentSortingOrder.value,
      "shipping-free": sidebarSelectedFilters["shipping-free"],
      rating: sidebarSelectedFilters.rating,
      search: "",
      limit: route.query.limit ? Number(route.query.limit) : 15
    }));
    for (const param in route.query) {
      if (param in sidebarSelectedFilters) {
        const queryValue = route.query[param];
        if (Array.isArray(queryValue)) continue;
        if (["manufacturer", "properties"].includes(param)) {
          if (typeof queryValue === "string") {
            const elements = queryValue.split("|");
            const targetSet = sidebarSelectedFilters[param];
            for (const element of elements) {
              targetSet.add(element);
            }
          }
        } else if (queryValue && typeof queryValue === "string") {
          if (param === "min-price") {
            const numValue = Number(queryValue);
            if (!Number.isNaN(numValue)) {
              sidebarSelectedFilters["min-price"] = numValue;
            }
          } else if (param === "max-price") {
            const numValue = Number(queryValue);
            if (!Number.isNaN(numValue)) {
              sidebarSelectedFilters["max-price"] = numValue;
            }
          } else if (param === "rating") {
            const numValue = Number(queryValue);
            if (!Number.isNaN(numValue)) {
              sidebarSelectedFilters.rating = numValue;
            }
          } else if (param === "shipping-free") {
            sidebarSelectedFilters["shipping-free"] = queryValue === "true";
          }
        }
      }
    }
    const handleFilterChange = async (event) => {
      try {
        const { code, value } = event;
        if (code === "manufacturer" || code === "properties") {
          const filterSet = sidebarSelectedFilters[code];
          const stringValue = String(value);
          if (filterSet.has(stringValue)) {
            filterSet.delete(stringValue);
          } else {
            filterSet.add(stringValue);
          }
        } else if (code === "min-price" || code === "max-price") {
          sidebarSelectedFilters[code] = typeof value === "number" ? value : Number(value);
        } else if (code === "rating") {
          sidebarSelectedFilters.rating = Number(value);
        } else if (code === "shipping-free") {
          sidebarSelectedFilters["shipping-free"] = Boolean(value);
        }
        await executeSearch();
      } catch (error) {
      }
    };
    const executeSearch = async () => {
      try {
        await search(searchCriteriaForRequest.value);
        const criteria = searchCriteriaForRequest.value;
        const query = {};
        if (criteria.manufacturer) query.manufacturer = criteria.manufacturer;
        if (criteria.properties) query.properties = criteria.properties;
        if (criteria["min-price"]) query["min-price"] = criteria["min-price"];
        if (criteria["max-price"]) query["max-price"] = criteria["max-price"];
        if (criteria.rating) query.rating = criteria.rating;
        if (criteria["shipping-free"])
          query["shipping-free"] = criteria["shipping-free"];
        if (criteria.order) query.order = criteria.order;
        await router.push({
          query
        });
      } catch (error) {
      }
    };
    const clearFilters = () => {
      sidebarSelectedFilters.manufacturer.clear();
      sidebarSelectedFilters.properties.clear();
      sidebarSelectedFilters["min-price"] = void 0;
      sidebarSelectedFilters["max-price"] = void 0;
      sidebarSelectedFilters.rating = void 0;
      sidebarSelectedFilters["shipping-free"] = void 0;
    };
    const currentSortingOrder = computed({
      get: () => getCurrentSortingOrder.value || "",
      set: async (order) => {
        try {
          await router.push({
            query: {
              ...route.query,
              order
            }
          });
          await changeCurrentSortingOrder(order, {
            ...route.query,
            limit: route.query.limit ? Number(route.query.limit) : 15
          });
        } catch (error) {
        }
      }
    });
    async function invokeCleanFilters() {
      try {
        clearFilters();
        await executeSearch();
      } catch (error) {
      }
    }
    const handleSortChange = (sortKey) => {
      currentSortingOrder.value = sortKey;
    };
    const hasActiveFilter = (filter) => {
      if (filter.code === "manufacturer") {
        return sidebarSelectedFilters.manufacturer.size > 0;
      }
      if (filter.code === "price") {
        return sidebarSelectedFilters["min-price"] !== void 0 || sidebarSelectedFilters["max-price"] !== void 0;
      }
      if (filter.code === "rating") {
        return sidebarSelectedFilters.rating !== void 0;
      }
      if (filter.code === "shipping-free") {
        return sidebarSelectedFilters["shipping-free"] === true;
      }
      return sidebarSelectedFilters.properties.size > 0;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwFilterDropdown = __nuxt_component_0;
      const _component_SwProductListingFilter = __nuxt_component_1$1;
      const _component_SwSortDropdown = __nuxt_component_2;
      const _component_SwBaseButton = __nuxt_component_2$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex flex-wrap items-center justify-start gap-4 z-10"><!--[-->`);
      ssrRenderList(unref(getInitialFilters), (filter) => {
        _push(ssrRenderComponent(_component_SwFilterDropdown, {
          key: filter.id,
          label: filter.label,
          "is-active": hasActiveFilter(filter)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_SwProductListingFilter, {
                filter,
                "display-mode": "dropdown",
                "selected-manufacturer": sidebarSelectedFilters.manufacturer,
                "selected-properties": sidebarSelectedFilters.properties,
                "selected-min-price": sidebarSelectedFilters["min-price"],
                "selected-max-price": sidebarSelectedFilters["max-price"],
                "selected-rating": sidebarSelectedFilters.rating,
                "selected-shipping-free": sidebarSelectedFilters["shipping-free"],
                onFilterChange: handleFilterChange
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_SwProductListingFilter, {
                  filter,
                  "display-mode": "dropdown",
                  "selected-manufacturer": sidebarSelectedFilters.manufacturer,
                  "selected-properties": sidebarSelectedFilters.properties,
                  "selected-min-price": sidebarSelectedFilters["min-price"],
                  "selected-max-price": sidebarSelectedFilters["max-price"],
                  "selected-rating": sidebarSelectedFilters.rating,
                  "selected-shipping-free": sidebarSelectedFilters["shipping-free"],
                  onFilterChange: handleFilterChange
                }, null, 8, ["filter", "selected-manufacturer", "selected-properties", "selected-min-price", "selected-max-price", "selected-rating", "selected-shipping-free"])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]-->`);
      _push(ssrRenderComponent(_component_SwSortDropdown, {
        "sort-options": unref(getSortingOrders) ?? [],
        "current-sort": unref(getCurrentSortingOrder) ?? "",
        label: unref(translations).listing.sort,
        onSortChange: handleSortChange
      }, null, _parent));
      if (showResetFiltersButton.value) {
        _push(ssrRenderComponent(_component_SwBaseButton, {
          variant: "ghost",
          size: "medium",
          onClick: invokeCleanFilters,
          type: "button"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(translations).listing.resetFilters)} <span class="w-5 h-5 i-carbon-close inline-block align-middle ml-1"${_scopeId}></span>`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(translations).listing.resetFilters) + " ", 1),
                createVNode("span", { class: "w-5 h-5 i-carbon-close inline-block align-middle ml-1" })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwProductListingFiltersHorizontal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "SwProductListingFiltersHorizontal" });

export { __nuxt_component_1 as default };
