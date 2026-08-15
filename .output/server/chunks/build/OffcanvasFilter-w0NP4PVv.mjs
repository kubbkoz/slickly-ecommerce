import { defineComponent, computed, ref, watch, unref, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { SlidersHorizontal, X, RotateCcw, Loader2 } from 'lucide-vue-next';
import ProductFilters from './ProductFilters-CjCB-Ex6.mjs';
import { u as useWindowSize } from './index-B6MI764M.mjs';
import { u as useCategoryFilters } from './useCategoryFilters-DPqBwycR.mjs';
import { u as useCategoryListing } from './useCategoryListing-BIkms3Qx.mjs';
import { _ as _export_sfc } from './server.mjs';
import './useShopwareLanguage-CGPCneCN.mjs';
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
  __name: "OffcanvasFilter",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    navigationId: {},
    categoryName: {},
    aggregations: {},
    brands: {},
    sizes: {},
    genders: {},
    colors: {},
    wheelSizes: {},
    wheelsNorm: {},
    forkNorm: {},
    brakesNorm: {},
    gearsNorm: {},
    motorNorm: {},
    batteryNorm: {},
    colorsNorm: {},
    minPrice: {},
    maxPrice: {}
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const {
      selectedBrands,
      selectedSizes,
      selectedGenders,
      selectedColors,
      selectedWheelSizes,
      priceRange,
      inStockOnly,
      onDemandOnly,
      isFeatured,
      isPromotion,
      searchQuery,
      handleBrandToggle,
      handleSizeToggle,
      handleGenderToggle,
      handleColorToggle,
      handleWheelSizeToggle,
      riderHeight,
      selectedWheelsNorm,
      selectedForkNorm,
      selectedBrakesNorm,
      selectedGearsNorm,
      selectedMotorNorm,
      selectedBatteryNorm,
      toggleWheelsNorm,
      toggleForkNorm,
      toggleBrakesNorm,
      toggleGearsNorm,
      toggleMotorNorm,
      toggleBatteryNorm,
      toggleColorNorm,
      activeFilterCount
    } = useCategoryFilters();
    const { total, listingStatus } = useCategoryListing(props.navigationId || "", {
      sortBy: ref("name-asc"),
      selectedBrands,
      selectedProperties: computed(() => [
        ...selectedSizes.value,
        ...selectedGenders.value,
        ...selectedWheelSizes.value
      ]),
      selectedColors,
      priceRange,
      inStockOnly,
      onDemandOnly,
      isFeatured,
      isPromotion,
      searchQuery,
      riderHeight,
      selectedWheelsNorm,
      selectedForkNorm,
      selectedBrakesNorm,
      selectedGearsNorm,
      selectedMotorNorm,
      selectedBatteryNorm
    });
    const ctaLabel = computed(() => {
      if (listingStatus.value === "pending") return "NAČÍTAVAM...";
      if (total.value === 0) return "ŽIADNE VÝSLEDKY";
      const count = total.value;
      let label = "PRODUKTOV";
      if (count === 1) {
        label = "PRODUKT";
      } else if (count >= 2 && count <= 4) {
        label = "PRODUKTY";
      }
      return `ZOBRAZIŤ ${count} ${label}`;
    });
    const isCTAActive = computed(() => total.value > 0);
    const localSearchValue = ref(searchQuery.value);
    watch(() => searchQuery.value, (newVal) => {
      if (localSearchValue.value !== newVal) localSearchValue.value = newVal;
    });
    const { width: windowWidth } = useWindowSize();
    computed(() => windowWidth.value < 768);
    watch(() => props.isOpen, (isOpen) => {
      if (isOpen) {
        (void 0).body.style.overflow = "hidden";
      } else {
        (void 0).body.style.overflow = "";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.isOpen) {
          _push2(`<div class="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]" data-v-1b60e5e5></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (__props.isOpen) {
          _push2(`<aside class="fixed z-[101] flex flex-col gpu-boost md:top-4 md:bottom-4 md:left-4 md:right-auto md:w-[440px] bottom-0 left-0 right-0 max-h-[88vh] md:max-h-none bg-white border border-gray-100 shadow-[0_40px_100px_rgba(0,0,0,0.15)] rounded-default overflow-hidden" data-v-1b60e5e5><div class="flex items-center justify-between px-8 py-6 flex-shrink-0" data-v-1b60e5e5><div class="flex items-center gap-3" data-v-1b60e5e5>`);
          _push2(ssrRenderComponent(unref(SlidersHorizontal), {
            class: "w-4 h-4 text-gray-900",
            "stroke-width": 1.8
          }, null, _parent));
          _push2(`<h2 class="text-sm font-bold tracking-[0.2em] text-gray-900 font-montserrat uppercase" data-v-1b60e5e5>Filtre</h2></div><button class="w-10 h-10 flex items-center justify-center bg-gray-900/5 hover:bg-gray-900/10 text-gray-900 transition-all rounded-sm" aria-label="Zavrieť filter" data-v-1b60e5e5>`);
          _push2(ssrRenderComponent(unref(X), { class: "w-5 h-5" }, null, _parent));
          _push2(`</button></div><div class="px-8 pb-4 flex-shrink-0" data-v-1b60e5e5><div class="relative group" data-v-1b60e5e5><input${ssrRenderAttr("value", localSearchValue.value)} type="text" placeholder="Hľadať v kategórii..." class="w-full pl-12 pr-4 py-4 bg-gray-50 border-none focus:ring-0 font-montserrat text-sm rounded-default transition-all" data-v-1b60e5e5><svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-1b60e5e5><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-v-1b60e5e5></path></svg></div></div><div class="flex-1 overflow-y-auto px-8 pb-32 no-scrollbar custom-content-fade" data-v-1b60e5e5>`);
          _push2(ssrRenderComponent(ProductFilters, {
            "category-name": __props.categoryName,
            aggregations: __props.aggregations,
            brands: __props.brands,
            sizes: __props.sizes,
            genders: __props.genders,
            colors: __props.colors,
            "wheel-sizes": __props.wheelSizes,
            "selected-brands": unref(selectedBrands),
            onBrandToggle: unref(handleBrandToggle),
            "selected-sizes": unref(selectedSizes),
            onSizeToggle: unref(handleSizeToggle),
            "selected-genders": unref(selectedGenders),
            onGenderToggle: unref(handleGenderToggle),
            "selected-colors": unref(selectedColors),
            onColorToggle: unref(handleColorToggle),
            "selected-wheel-sizes": unref(selectedWheelSizes),
            onWheelSizeToggle: unref(handleWheelSizeToggle),
            "price-range": unref(priceRange),
            "onUpdate:priceRange": ($event) => priceRange.value = $event,
            "min-price": __props.minPrice,
            "max-price": __props.maxPrice,
            "in-stock-only": unref(inStockOnly),
            "onUpdate:inStockOnly": ($event) => inStockOnly.value = $event,
            "on-demand-only": unref(onDemandOnly),
            "onUpdate:onDemandOnly": ($event) => onDemandOnly.value = $event,
            "is-featured": unref(isFeatured),
            "onUpdate:isFeatured": ($event) => isFeatured.value = $event,
            "wheels-norm": __props.wheelsNorm,
            "fork-norm": __props.forkNorm,
            "brakes-norm": __props.brakesNorm,
            "gears-norm": __props.gearsNorm,
            "motor-norm": __props.motorNorm,
            "battery-norm": __props.batteryNorm,
            "colors-norm": __props.colorsNorm,
            "rider-height": unref(riderHeight),
            "onUpdate:riderHeight": ($event) => riderHeight.value = $event,
            "selected-wheels-norm": unref(selectedWheelsNorm),
            "selected-fork-norm": unref(selectedForkNorm),
            "selected-brakes-norm": unref(selectedBrakesNorm),
            "selected-gears-norm": unref(selectedGearsNorm),
            "selected-motor-norm": unref(selectedMotorNorm),
            "selected-battery-norm": unref(selectedBatteryNorm),
            onToggleWheelsNorm: unref(toggleWheelsNorm),
            onToggleForkNorm: unref(toggleForkNorm),
            onToggleBrakesNorm: unref(toggleBrakesNorm),
            onToggleGearsNorm: unref(toggleGearsNorm),
            onToggleMotorNorm: unref(toggleMotorNorm),
            onToggleBatteryNorm: unref(toggleBatteryNorm),
            onToggleColorNorm: unref(toggleColorNorm)
          }, null, _parent));
          _push2(`</div><div class="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex flex-col gap-3 rounded-default shadow-[0_-10px_30px_rgba(0,0,0,0.03)] focus-within:z-50" data-v-1b60e5e5><div class="flex gap-4" data-v-1b60e5e5>`);
          if (unref(activeFilterCount) > 0) {
            _push2(`<button class="w-14 h-14 bg-white border border-gray-200 text-gray-900 transition-all duration-300 rounded-default group flex items-center justify-center active:scale-95 shadow-sm hover:border-gray-900 gpu-boost" title="Resetovať filtre" aria-label="Resetovať všetky filtre" data-v-1b60e5e5>`);
            _push2(ssrRenderComponent(unref(RotateCcw), {
              class: "w-5 h-5 group-hover:rotate-[-180deg] transition-transform duration-500",
              "aria-hidden": "true"
            }, null, _parent));
            _push2(`</button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button class="${ssrRenderClass([isCTAActive.value ? "bg-brand hover:bg-brand-dark text-white shadow-xl" : "bg-gray-100 text-gray-400", "flex-1 h-14 transition-all duration-300 font-sans uppercase text-[10px] md:text-sm font-bold tracking-[0.2em] rounded-default flex items-center justify-center gap-3 relative overflow-hidden active:scale-[0.98] gpu-boost"])}" data-v-1b60e5e5>`);
          if (unref(listingStatus) === "pending") {
            _push2(ssrRenderComponent(unref(Loader2), {
              class: "w-4 h-4 animate-spin text-white",
              "aria-hidden": "true"
            }, null, _parent));
          } else {
            _push2(`<span data-v-1b60e5e5>${ssrInterpolate(ctaLabel.value)}</span>`);
          }
          _push2(`</button></div></div></aside>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/category/OffcanvasFilter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const OffcanvasFilter = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-1b60e5e5"]]), { __name: "OffcanvasFilter" });

export { OffcanvasFilter as default };
