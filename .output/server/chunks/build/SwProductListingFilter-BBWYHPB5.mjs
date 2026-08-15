import { defineComponent, computed, createVNode, resolveDynamicComponent, ref, mergeProps, unref, reactive, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderVNode, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import __nuxt_component_0 from './ChevronIcon-Aj1t6zS4.mjs';
import { getTranslatedProperty } from '@shopware/helpers';
import { o as onClickOutside, c as useEventListener } from './index-B6MI764M.mjs';
import { u as useCmsTranslations } from './useCmsTranslations-C7n8Bwji.mjs';
import { o as useDebounceFn } from './server.mjs';
import { au as defu } from '../nitro/nitro.mjs';
import __nuxt_component_1$2 from './Checkbox-8GjGFXe_.mjs';
import __nuxt_component_1$1 from './SwitchButton-BwRPFSLu.mjs';
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
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
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "SwFilterPrice",
  __ssrInlineRender: true,
  props: {
    filter: {},
    selectedFilters: {},
    displayMode: { default: "accordion" }
  },
  emits: ["select-value"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    let translations = {
      listing: {
        min: "Min",
        max: "Max"
      }
    };
    translations = defu(useCmsTranslations(), translations);
    const prices = reactive({
      min: 0,
      max: 0
    });
    const isFilterVisible = ref(false);
    const dropdownElement = ref(null);
    onClickOutside(dropdownElement, () => {
      isFilterVisible.value = false;
    });
    function onMinPriceChange(newPrice, oldPrice) {
      if (newPrice === oldPrice || oldPrice === 0) return;
      emits("select-value", {
        code: "min-price",
        value: newPrice
      });
    }
    const debounceMinPriceUpdate = useDebounceFn(onMinPriceChange, 500);
    watch(() => prices.min, debounceMinPriceUpdate);
    function onMaxPriceChange(newPrice, oldPrice) {
      if (newPrice === oldPrice || oldPrice === 0) return;
      emits("select-value", {
        code: "max-price",
        value: newPrice
      });
    }
    const debounceMaxPriceUpdate = useDebounceFn(onMaxPriceChange, 500);
    watch(() => prices.max, debounceMaxPriceUpdate);
    const dragging = ref(null);
    const sliderRect = ref(null);
    const getClientX = (event) => event instanceof MouseEvent ? event.clientX : event.touches[0]?.clientX || 0;
    const updateSliderValue = (clientX) => {
      if (!dragging.value || !sliderRect.value) return;
      const min = __props.filter.min ?? 0;
      const max = __props.filter.max ?? 100;
      const percent = Math.min(
        Math.max((clientX - sliderRect.value.left) / sliderRect.value.width, 0),
        1
      );
      const value = Math.round(min + percent * (max - min));
      if (dragging.value === "min") {
        if (value >= min && value <= prices.max) prices.min = value;
      } else {
        if (value <= max && value >= prices.min) prices.max = value;
      }
    };
    const onDrag = (event) => {
      if (!dragging.value) return;
      event.preventDefault();
      updateSliderValue(getClientX(event));
    };
    const stopDrag = () => {
      dragging.value = null;
      sliderRect.value = null;
    };
    useEventListener(void 0, "mousemove", onDrag);
    useEventListener(void 0, "mouseup", stopDrag);
    useEventListener(void 0, "touchmove", onDrag, { passive: false });
    useEventListener(void 0, "touchend", stopDrag);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwChevronIcon = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "self-stretch flex flex-col justify-start items-start gap-4" }, _attrs))}>`);
      if (__props.displayMode === "accordion") {
        _push(`<div class="self-stretch flex flex-col justify-center items-center"><div class="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-between items-center gap-1 cursor-pointer" role="button" tabindex="0"${ssrRenderAttr("aria-expanded", isFilterVisible.value)}${ssrRenderAttr("aria-controls", `filter-${__props.filter.code}`)}><div class="flex-1 flex items-center gap-2.5"><div class="flex-1 text-surface-on-surface text-base font-bold leading-normal text-left">${ssrInterpolate(__props.filter.label)}</div></div><span class="flex items-center justify-center" aria-hidden="true">`);
        _push(ssrRenderComponent(_component_SwChevronIcon, {
          direction: isFilterVisible.value ? "up" : "down",
          size: 24
        }, null, _parent));
        _push(`</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isFilterVisible.value || __props.displayMode === "dropdown") {
        _push(`<div${ssrRenderAttr("id", __props.filter.code)} class="self-stretch flex flex-col justify-start items-start gap-2.5"><div class="self-stretch flex flex-col justify-start items-start gap-1"><div class="self-stretch inline-flex justify-between items-center gap-2"><div class="w-16 h-10 px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-outline-outline-variant inline-flex flex-col justify-center items-start gap-2.5"><input type="number"${ssrRenderAttr("placeholder", unref(translations).listing.min)}${ssrRenderAttr("value", prices.min)} class="w-full bg-transparent border-none outline-none text-surface-on-surface text-sm font-normal leading-tight"${ssrRenderAttr("min", __props.filter.min)}${ssrRenderAttr("max", prices.max)}></div><div class="w-16 h-10 px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-outline-outline-variant inline-flex flex-col justify-center items-start gap-2.5"><input type="number"${ssrRenderAttr("placeholder", unref(translations).listing.max)}${ssrRenderAttr("value", prices.max)} class="w-full bg-transparent border-none outline-none text-surface-on-surface text-sm font-normal leading-tight"${ssrRenderAttr("min", prices.min)}${ssrRenderAttr("max", __props.filter.max)}></div></div><div class="relative w-64 h-10 mt-2 mx-auto flex items-center select-none"><div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-2 bg-surface-surface-container-highest rounded-full"></div><div class="absolute top-1/2 -translate-y-1/2 h-2 bg-surface-surface-primary rounded-full" style="${ssrRenderStyle({
          left: (prices.min - (__props.filter.min ?? 0)) / ((__props.filter.max ?? 100) - (__props.filter.min ?? 0)) * 100 + "%",
          width: (prices.max - prices.min) / ((__props.filter.max ?? 100) - (__props.filter.min ?? 0)) * 100 + "%"
        })}"></div><div class="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-brand-primary rounded-full shadow-[2px_2px_10px_0px_rgba(0,0,0,0.15)] cursor-pointer touch-none" style="${ssrRenderStyle({
          left: `calc(${(prices.min - (__props.filter.min ?? 0)) / ((__props.filter.max ?? 100) - (__props.filter.min ?? 0)) * 100}% - 10px)`
        })}"></div><div class="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-brand-primary rounded-full shadow-[2px_2px_10px_0px_rgba(0,0,0,0.15)] cursor-pointer touch-none" style="${ssrRenderStyle({
          left: `calc(${(prices.max - (__props.filter.min ?? 0)) / ((__props.filter.max ?? 100) - (__props.filter.min ?? 0)) * 100}% - 10px)`
        })}"></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/listing-filters/SwFilterPrice.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "SwFilterProperties",
  __ssrInlineRender: true,
  props: {
    filter: {},
    selectedFilters: {},
    displayMode: { default: "accordion" }
  },
  emits: ["select-value"],
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    const isFilterVisible = ref(false);
    const selectedIds = computed(() => {
      if (__props.filter.code === "manufacturer") {
        return __props.selectedFilters?.manufacturer || [];
      }
      return __props.selectedFilters?.properties || [];
    });
    const isChecked = (id) => selectedIds.value.includes(id);
    const selectValue = (id) => {
      const emitCode = __props.filter.code === "manufacturer" ? "manufacturer" : "properties";
      emits("select-value", {
        code: emitCode,
        value: id
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwChevronIcon = __nuxt_component_0;
      const _component_SwCheckbox = __nuxt_component_1$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "self-stretch flex flex-col justify-start items-start gap-4" }, _attrs))}>`);
      if (__props.displayMode === "accordion") {
        _push(`<div class="self-stretch flex flex-col justify-center items-center"><div class="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-between items-center gap-1 cursor-pointer" role="button" tabindex="0"${ssrRenderAttr("aria-expanded", isFilterVisible.value)}${ssrRenderAttr("aria-controls", __props.filter.code)}${ssrRenderAttr("aria-label", __props.filter.label)}><div class="flex-1 flex items-center gap-2.5"><div class="flex-1 text-surface-on-surface text-base font-bold leading-normal text-left">${ssrInterpolate(__props.filter.label)}</div></div><span class="flex items-center justify-center" aria-hidden="true">`);
        _push(ssrRenderComponent(_component_SwChevronIcon, {
          direction: isFilterVisible.value ? "up" : "down",
          size: 24
        }, null, _parent));
        _push(`</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isFilterVisible.value || __props.displayMode === "dropdown") {
        _push(`<div${ssrRenderAttr("id", __props.filter.code)} class="self-stretch flex flex-col justify-start items-start gap-4"><fieldset class="self-stretch flex flex-col justify-start items-start gap-4"><legend class="sr-only">${ssrInterpolate(__props.filter.name)}</legend><!--[-->`);
        ssrRenderList(__props.filter.options || __props.filter.entities, (option) => {
          _push(`<label class="self-stretch inline-flex justify-start items-start gap-2 cursor-pointer"><div class="w-4 self-stretch pt-[3px] flex justify-start items-start gap-2.5">`);
          _push(ssrRenderComponent(_component_SwCheckbox, {
            "model-value": isChecked(option.id),
            "onUpdate:modelValue": () => selectValue(option.id)
          }, null, _parent));
          _push(`</div><div class="flex-1 inline-flex flex-col justify-start items-start gap-0.5"><div class="inline-flex justify-start items-center gap-1"><div class="flex-1 text-surface-on-surface text-base font-normal leading-normal">${ssrInterpolate(unref(getTranslatedProperty)(option, "name"))}</div></div></div></label>`);
        });
        _push(`<!--]--></fieldset></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/listing-filters/SwFilterProperties.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "SwFilterRating",
  __ssrInlineRender: true,
  props: {
    filter: {},
    selectedFilters: {},
    displayMode: { default: "accordion" }
  },
  emits: ["select-value"],
  setup(__props, { emit: __emit }) {
    const isHoverActive = ref(false);
    const hoveredIndex = ref(0);
    const displayedScore = computed(
      () => isHoverActive.value ? hoveredIndex.value : __props.selectedFilters?.rating || 0
    );
    const isFilterVisible = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwChevronIcon = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "self-stretch flex flex-col justify-start items-start gap-4" }, _attrs))}>`);
      if (__props.displayMode === "accordion") {
        _push(`<div class="self-stretch flex flex-col justify-center items-center"><div class="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-between items-center gap-1 cursor-pointer" role="button" tabindex="0"${ssrRenderAttr("aria-expanded", isFilterVisible.value)}${ssrRenderAttr("aria-controls", `filter-rating`)}><div class="flex-1 flex items-center gap-2.5"><div class="flex-1 text-surface-on-surface text-base font-bold leading-normal text-left">${ssrInterpolate(__props.filter.label)}</div></div><span class="flex items-center justify-center" aria-hidden="true">`);
        _push(ssrRenderComponent(_component_SwChevronIcon, {
          direction: isFilterVisible.value ? "up" : "down",
          size: 24
        }, null, _parent));
        _push(`</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isFilterVisible.value || __props.displayMode === "dropdown") {
        _push(`<div class="self-stretch flex flex-col justify-start items-start gap-4"><div class="flex flex-row items-center gap-2 mt-2"><!--[-->`);
        ssrRenderList(5, (i) => {
          _push(`<div class="${ssrRenderClass(["h-6 w-6 cursor-pointer", displayedScore.value >= i ? "i-carbon-star-filled" : "i-carbon-star"])}"${ssrRenderAttr("aria-label", `${i} star${i !== 1 ? "s" : ""}`)}></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/listing-filters/SwFilterRating.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SwFilterShippingFree",
  __ssrInlineRender: true,
  props: {
    filter: {},
    selectedFilters: {},
    description: {},
    displayMode: { default: "accordion" }
  },
  emits: ["select-value"],
  setup(__props, { emit: __emit }) {
    let translations = {
      listing: {
        freeShipping: "Free shipping"
      }
    };
    translations = defu(useCmsTranslations(), translations);
    const emits = __emit;
    const currentFilterData = computed(() => !!__props.selectedFilters[__props.filter?.code]);
    const isFilterVisible = ref(false);
    const dropdownElement = ref(null);
    onClickOutside(dropdownElement, () => {
      isFilterVisible.value = false;
    });
    const handleRadioUpdate = (val) => {
      emits("select-value", { code: __props.filter.code, value: !!val });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwChevronIcon = __nuxt_component_0;
      const _component_SwSwitchButton = __nuxt_component_1$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "self-stretch flex flex-col justify-start items-start gap-4" }, _attrs))}>`);
      if (__props.displayMode === "accordion") {
        _push(`<div class="self-stretch flex flex-col justify-center items-center"><div class="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-between items-center gap-1 cursor-pointer" role="button" tabindex="0"${ssrRenderAttr("aria-expanded", isFilterVisible.value)}${ssrRenderAttr("aria-controls", `filter-${__props.filter.code}`)}><div class="flex-1 flex items-center gap-2.5"><div class="flex-1 text-surface-on-surface text-base font-bold leading-normal text-left">${ssrInterpolate(__props.filter.label)}</div></div><span class="flex items-center justify-center" aria-hidden="true">`);
        _push(ssrRenderComponent(_component_SwChevronIcon, {
          direction: isFilterVisible.value ? "up" : "down",
          size: 24
        }, null, _parent));
        _push(`</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isFilterVisible.value || __props.displayMode === "dropdown") {
        _push(`<div class="self-stretch"><div class="pt-6 space-y-4"><div class="self-stretch inline-flex justify-start items-start gap-2 w-full"><div class="flex-1 pt-[3px]">`);
        _push(ssrRenderComponent(_component_SwSwitchButton, {
          "model-value": currentFilterData.value,
          "onUpdate:modelValue": handleRadioUpdate,
          name: __props.filter.code,
          "aria-label": __props.filter.label,
          label: __props.filter.label,
          description: __props.description || unref(translations).listing.freeShipping
        }, null, _parent));
        _push(`</div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/listing-filters/SwFilterShippingFree.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SwProductListingFilter",
  __ssrInlineRender: true,
  props: {
    filter: {},
    selectedManufacturer: {},
    selectedProperties: {},
    selectedMinPrice: {},
    selectedMaxPrice: {},
    selectedRating: {},
    selectedShippingFree: { type: Boolean },
    displayMode: { default: "accordion" }
  },
  emits: ["filter-change"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const transformedFilters = computed(() => ({
      price: {
        min: __props.selectedMinPrice,
        max: __props.selectedMaxPrice
      },
      rating: __props.selectedRating,
      "shipping-free": __props.selectedShippingFree,
      manufacturer: [...__props.selectedManufacturer],
      properties: [...__props.selectedProperties]
    }));
    const filterComponent = computed(() => {
      const componentMap = {
        manufacturer: _sfc_main$3,
        price: _sfc_main$4,
        rating: _sfc_main$2,
        "shipping-free": _sfc_main$1
      };
      return componentMap[__props.filter.code] || ("options" in __props.filter ? _sfc_main$3 : void 0);
    });
    const handleSelectValue = ({
      code,
      value
    }) => {
      emit("filter-change", { code, value });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(filterComponent.value), {
        filter: __props.filter,
        "selected-filters": transformedFilters.value,
        "display-mode": __props.displayMode,
        onSelectValue: handleSelectValue
      }, null), _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwProductListingFilter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "SwProductListingFilter" });

export { __nuxt_component_1 as default };
