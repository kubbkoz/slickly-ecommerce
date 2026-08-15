import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrRenderList, ssrRenderTeleport } from 'vue/server-renderer';
import { SlidersHorizontal, Check, PackageSearch, Tag, Euro, ArrowUpDown, LayoutGrid, LayoutList, ChevronDown } from 'lucide-vue-next';
import { u as useCategoryFilters } from './useCategoryFilters-DPqBwycR.mjs';
import { o as onClickOutside } from './index-B6MI764M.mjs';
import { _ as _export_sfc, g as useState } from './server.mjs';
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
  __name: "StickyToolbar",
  __ssrInlineRender: true,
  props: {
    aggregations: {},
    total: {}
  },
  emits: ["toggleFilter"],
  setup(__props, { emit: __emit }) {
    const {
      inStockOnly,
      isPromotion,
      priceRange,
      riderHeight,
      activeFilterCount,
      sortBy
    } = useCategoryFilters();
    const isHeightOpen = ref(false);
    const heightModalRef = ref(null);
    const heightButtonRef = ref(null);
    onClickOutside(heightModalRef, () => {
      isHeightOpen.value = false;
    }, { ignore: [heightButtonRef] });
    const sortOptions = [
      { value: "topseller", label: "Od najobľúbenejších" },
      { value: "price-desc", label: "Od najdrahších" },
      { value: "price-asc", label: "Od najlacnejších" },
      { value: "created-at-desc", label: "Od najnovších" },
      { value: "rating-desc", label: "Najlepšie hodnotené" },
      { value: "discount-desc", label: "Zľava voči MOC" },
      { value: "name-asc", label: "Názov od A-Z" }
    ];
    const isSortOpen = ref(false);
    const sortDropdownRef = ref(null);
    onClickOutside(sortDropdownRef, () => isSortOpen.value = false);
    const activeSortLabel = computed(() => sortOptions.find((o) => o.value === sortBy.value)?.label || "Zoradiť");
    const mobileColumns = useState("categoryMobileColumns", () => 2);
    const isUnderTo = (max) => priceRange.value[1] === max && priceRange.value[0] === 0;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "sticky top-[var(--navbar-height-scrolled,72px)] z-40 w-full bg-white/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-gray-100/30 mt-0 select-none" }, _attrs))} data-v-eb8f6d20><div class="container mx-auto px-4 relative" data-v-eb8f6d20><div class="flex items-center justify-between h-14" data-v-eb8f6d20><button class="flex items-center gap-2.5 md:gap-3 hover:text-brand transition-colors flex-shrink-0 group bg-transparent border-none p-0 outline-none shadow-none" aria-label="Otvoriť filtre" data-v-eb8f6d20><div class="relative w-8 h-8 flex items-center justify-center text-gray-900 group-hover:text-brand transition-colors duration-300" data-v-eb8f6d20>`);
      _push(ssrRenderComponent(unref(SlidersHorizontal), {
        class: "w-5 h-5 flex-shrink-0",
        "stroke-width": 1.5,
        "aria-hidden": "true"
      }, null, _parent));
      if (unref(activeFilterCount) > 0) {
        _push(`<span class="absolute -top-1 -right-1 min-w-[16px] h-4 bg-brand border border-white rounded-full flex items-center justify-center text-white text-[9px] font-bold leading-none px-0.5 transition-transform" data-v-eb8f6d20>${ssrInterpolate(unref(activeFilterCount))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><span class="hidden md:inline font-bold text-[11px] md:text-xs uppercase tracking-[0.05em] font-montserrat text-gray-900 group-hover:text-brand transition-colors" data-v-eb8f6d20>Filtre</span></button><div class="h-5 w-[1px] bg-gray-200/60 mx-2 md:mx-4 flex-shrink-0" data-v-eb8f6d20></div><div class="flex-1 overflow-x-auto no-scrollbar chip-mask flex items-center gap-2 md:gap-2.5 py-1 min-w-0 pr-12" data-v-eb8f6d20><button class="${ssrRenderClass([unref(inStockOnly) ? "chip-active" : "chip-inactive", "chip-btn"])}"${ssrRenderAttr("aria-pressed", unref(inStockOnly))} data-v-eb8f6d20>`);
      if (unref(inStockOnly)) {
        _push(ssrRenderComponent(unref(Check), {
          class: "w-3.5 h-3.5",
          "stroke-width": 1.8,
          "aria-hidden": "true"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(PackageSearch), {
          class: "w-3.5 h-3.5 text-gray-400",
          "stroke-width": 1.5,
          "aria-hidden": "true"
        }, null, _parent));
      }
      _push(`<span data-v-eb8f6d20>Skladom</span></button><button class="${ssrRenderClass([unref(isPromotion) ? "chip-active" : "chip-inactive", "chip-btn"])}"${ssrRenderAttr("aria-pressed", unref(isPromotion))} data-v-eb8f6d20>`);
      if (unref(isPromotion)) {
        _push(ssrRenderComponent(unref(Check), {
          class: "w-3.5 h-3.5",
          "stroke-width": 1.8,
          "aria-hidden": "true"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Tag), {
          class: "w-3.5 h-3.5 text-gray-400",
          "stroke-width": 1.8,
          "aria-hidden": "true"
        }, null, _parent));
      }
      _push(`<span data-v-eb8f6d20>Výpredaj</span></button><button class="${ssrRenderClass([isUnderTo(300) ? "chip-active" : "chip-inactive", "chip-btn"])}"${ssrRenderAttr("aria-pressed", isUnderTo(300))} data-v-eb8f6d20>`);
      if (isUnderTo(300)) {
        _push(ssrRenderComponent(unref(Check), {
          class: "w-3.5 h-3.5",
          "stroke-width": 1.8,
          "aria-hidden": "true"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Euro), {
          class: "w-3.5 h-3.5 text-gray-400",
          "stroke-width": 1.8,
          "aria-hidden": "true"
        }, null, _parent));
      }
      _push(`<span class="whitespace-nowrap" data-v-eb8f6d20>Do 300€</span></button><button class="${ssrRenderClass([isUnderTo(500) ? "chip-active" : "chip-inactive", "chip-btn"])}"${ssrRenderAttr("aria-pressed", isUnderTo(500))} data-v-eb8f6d20>`);
      if (isUnderTo(500)) {
        _push(ssrRenderComponent(unref(Check), {
          class: "w-3.5 h-3.5",
          "stroke-width": 1.8,
          "aria-hidden": "true"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Euro), {
          class: "w-3.5 h-3.5 text-gray-400",
          "stroke-width": 1.8,
          "aria-hidden": "true"
        }, null, _parent));
      }
      _push(`<span class="whitespace-nowrap" data-v-eb8f6d20>Do 500€</span></button><button class="${ssrRenderClass([isUnderTo(1e3) ? "chip-active" : "chip-inactive", "chip-btn"])}"${ssrRenderAttr("aria-pressed", isUnderTo(1e3))} data-v-eb8f6d20>`);
      if (isUnderTo(1e3)) {
        _push(ssrRenderComponent(unref(Check), {
          class: "w-3.5 h-3.5",
          "stroke-width": 1.8,
          "aria-hidden": "true"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Euro), {
          class: "w-3.5 h-3.5 text-gray-400",
          "stroke-width": 1.8,
          "aria-hidden": "true"
        }, null, _parent));
      }
      _push(`<span class="whitespace-nowrap" data-v-eb8f6d20>Do 1000€</span></button><button class="${ssrRenderClass([unref(riderHeight) ? "chip-active-red" : "chip-inactive", "chip-btn"])}"${ssrRenderAttr("aria-expanded", isHeightOpen.value)} data-v-eb8f6d20>`);
      if (unref(riderHeight)) {
        _push(ssrRenderComponent(unref(Check), {
          class: "w-3.5 h-3.5",
          "stroke-width": 1.8,
          "aria-hidden": "true"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(ArrowUpDown), {
          class: "w-3.5 h-3.5 text-brand",
          "stroke-width": 2,
          "aria-hidden": "true"
        }, null, _parent));
      }
      _push(`<span class="whitespace-nowrap" data-v-eb8f6d20>${ssrInterpolate(unref(riderHeight) ? `Výška: ${unref(riderHeight)}cm` : "Výška jazdca")}</span></button></div><button class="md:hidden flex-shrink-0 ml-1 w-9 h-9 flex items-center justify-center text-gray-600 hover:text-brand transition-colors"${ssrRenderAttr("aria-label", unref(mobileColumns) === 1 ? "Zobraziť 2 stĺpce" : "Zobraziť 1 stĺpec")} data-v-eb8f6d20>`);
      if (unref(mobileColumns) === 1) {
        _push(ssrRenderComponent(unref(LayoutGrid), {
          class: "w-[18px] h-[18px]",
          "stroke-width": 1.8
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(LayoutList), {
          class: "w-[18px] h-[18px]",
          "stroke-width": 1.8
        }, null, _parent));
      }
      _push(`</button><div class="relative flex-shrink-0 ml-1 md:ml-2" data-v-eb8f6d20><button class="flex items-center gap-2 md:gap-3 px-1 py-2 text-[10px] md:text-[11px] text-gray-900 bg-transparent hover:text-brand transition-colors flex-shrink-0 group" aria-label="Zoradiť produkty" data-v-eb8f6d20><div class="flex flex-col gap-[3px] items-start group-hover:text-brand transition-colors" aria-hidden="true" data-v-eb8f6d20><div class="h-[2px] w-5 bg-current rounded-md transition-all duration-300" data-v-eb8f6d20></div><div class="h-[2px] w-3.5 bg-current rounded-md transition-all duration-300" data-v-eb8f6d20></div><div class="h-[2px] w-2 bg-current rounded-md transition-all duration-300" data-v-eb8f6d20></div></div><span class="hidden lg:inline font-bold font-montserrat tracking-tight uppercase" data-v-eb8f6d20>${ssrInterpolate(activeSortLabel.value)}</span>`);
      _push(ssrRenderComponent(unref(ChevronDown), {
        class: ["w-3.5 h-3.5 text-gray-400 transition-transform duration-500 group-hover:text-brand", { "rotate-180": isSortOpen.value }],
        "stroke-width": 2.5,
        "aria-hidden": "true"
      }, null, _parent));
      _push(`</button>`);
      if (isSortOpen.value) {
        _push(`<div class="absolute right-0 mt-3 w-60 bg-white shadow-[0_40px_80px_rgba(0,0,0,0.15)] z-50 overflow-hidden rounded-default border border-gray-100" data-v-eb8f6d20><!--[-->`);
        ssrRenderList(sortOptions, (option) => {
          _push(`<button class="${ssrRenderClass([unref(sortBy) === option.value ? "bg-black text-white font-bold" : "bg-white text-gray-600 font-medium hover:bg-[#f7f9fa] hover:text-gray-900", "w-full text-left px-5 py-3.5 text-[11px] md:text-xs transition-all duration-200 tracking-tight border-b border-gray-100 last:border-0 font-montserrat"])}" data-v-eb8f6d20>${ssrInterpolate(option.label)}</button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (isHeightOpen.value) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4" data-v-eb8f6d20><div class="absolute inset-0 bg-black/40 backdrop-blur-sm" data-v-eb8f6d20></div><div class="relative w-full max-w-sm bg-white shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-gray-100 p-8 rounded-default overflow-hidden" data-v-eb8f6d20><h4 class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 font-montserrat mb-6 text-center" data-v-eb8f6d20>Vaša výška (cm)</h4><div class="relative mb-6" data-v-eb8f6d20><input type="number" min="100" max="220" placeholder="Napr. 180"${ssrRenderAttr("value", unref(riderHeight))} class="w-full p-5 bg-gray-50 border-none text-base font-bold text-gray-900 rounded-default focus:ring-1 focus:ring-brand/20 text-center transition-all font-montserrat" data-v-eb8f6d20></div><div class="flex gap-2" data-v-eb8f6d20><button class="flex-1 py-4 bg-gray-100 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:bg-gray-200 transition-colors font-montserrat border-none" data-v-eb8f6d20>Zmazať</button><button class="flex-1 py-4 bg-brand text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-brand-dark transition-colors font-montserrat border-none" data-v-eb8f6d20>Potvrdiť</button></div><p class="text-[9px] text-gray-400 mt-6 text-center font-montserrat uppercase tracking-wider" data-v-eb8f6d20>Autom. zúženie bicyklov na vašu postavu.</p></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/category/StickyToolbar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const StickyToolbar = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-eb8f6d20"]]), { __name: "StickyToolbar" });

export { StickyToolbar as default };
