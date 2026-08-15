import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrRenderStyle, ssrRenderClass, ssrRenderList, ssrIncludeBooleanAttr, ssrInterpolate } from 'vue/server-renderer';
import { ChevronDown, Check, Search } from 'lucide-vue-next';
import { _ as _export_sfc } from './server.mjs';
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
  __name: "ProductFilters",
  __ssrInlineRender: true,
  props: {
    categoryName: {},
    aggregations: {},
    brands: {},
    sizes: {},
    genders: {},
    colors: {},
    wheelSizes: {},
    selectedBrands: {},
    selectedSizes: {},
    selectedGenders: {},
    selectedColors: {},
    selectedWheelSizes: {},
    priceRange: {},
    minPrice: {},
    maxPrice: {},
    inStockOnly: { type: Boolean },
    onDemandOnly: { type: Boolean },
    isFeatured: { type: Boolean },
    wheelsNorm: {},
    forkNorm: {},
    brakesNorm: {},
    gearsNorm: {},
    motorNorm: {},
    batteryNorm: {},
    colorsNorm: {},
    selectedWheelsNorm: {},
    selectedForkNorm: {},
    selectedBrakesNorm: {},
    selectedGearsNorm: {},
    selectedMotorNorm: {},
    selectedBatteryNorm: {},
    className: {}
  },
  emits: ["brandToggle", "sizeToggle", "genderToggle", "colorToggle", "wheelSizeToggle", "update:priceRange", "update:inStockOnly", "update:onDemandOnly", "update:isFeatured", "toggleWheelsNorm", "toggleForkNorm", "toggleBrakesNorm", "toggleGearsNorm", "toggleMotorNorm", "toggleBatteryNorm", "toggleColorNorm"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const openSections = ref({
      price: true,
      brands: false,
      motor: false,
      battery: false,
      fork: false,
      brakes: false,
      gears: false,
      colors: false,
      wheelsNorm: false,
      availability: false
    });
    const brandSearch = ref("");
    const manufacturerLogos = computed(() => {
      const manufacturers = props.aggregations?.manufacturer?.entities || [];
      const map = {};
      manufacturers.forEach((m) => {
        if (m.media?.url) map[m.id] = m.media.url;
      });
      return map;
    });
    const filteredBrands = computed(() => {
      if (!props.brands) return [];
      return props.brands.filter(
        (brand) => brand.name.toLowerCase().includes(brandSearch.value.toLowerCase())
      );
    });
    const showAllBrands = ref(false);
    const displayedBrands = computed(() => {
      if (brandSearch.value || showAllBrands.value) return filteredBrands.value;
      return filteredBrands.value.slice(0, 6);
    });
    const hasMoreBrands = computed(() => {
      if (brandSearch.value) return false;
      return filteredBrands.value.length > 6 && !showAllBrands.value;
    });
    const formatPriceDisplay = (val) => {
      if (val % 1 === 0) return val.toString();
      return val.toFixed(2).replace(".", ",").replace(",00", "");
    };
    const currentMin = computed(() => props.priceRange[0] === 0 ? props.minPrice : props.priceRange[0]);
    const currentMax = computed(() => props.priceRange[1] === 1e4 ? props.maxPrice : props.priceRange[1]);
    const trackLeft = computed(() => {
      const total = props.maxPrice - props.minPrice;
      if (total <= 0) return 0;
      return (currentMin.value - props.minPrice) / total * 100;
    });
    const trackRight = computed(() => {
      const total = props.maxPrice - props.minPrice;
      if (total <= 0) return 0;
      return 100 - (currentMax.value - props.minPrice) / total * 100;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: `${__props.className || ""}`
      }, _attrs))} data-v-29232541><div class="border-b border-gray-100" data-v-29232541><button class="flex items-center justify-between w-full py-5 bg-white group transition-colors hover:text-brand"${ssrRenderAttr("aria-expanded", openSections.value.price)} aria-controls="filter-section-price" data-v-29232541><span class="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 font-montserrat" data-v-29232541>CENA</span>`);
      _push(ssrRenderComponent(unref(ChevronDown), {
        class: `w-4 h-4 text-gray-400 transition-transform duration-300 ${openSections.value.price ? "rotate-180" : ""}`,
        "aria-hidden": "true"
      }, null, _parent));
      _push(`</button>`);
      if (openSections.value.price) {
        _push(`<div id="filter-section-price" class="pb-6 px-1" data-v-29232541><div class="relative h-10 flex flex-col justify-center" data-v-29232541><div class="absolute w-full h-[1px] bg-gray-100 rounded-default overflow-hidden" data-v-29232541><div class="absolute h-full bg-brand transition-all duration-150" style="${ssrRenderStyle({ left: `${trackLeft.value}%`, right: `${trackRight.value}%` })}" data-v-29232541></div></div><input type="range"${ssrRenderAttr("min", Math.floor(__props.minPrice))}${ssrRenderAttr("max", Math.ceil(__props.maxPrice))} step="1"${ssrRenderAttr("value", currentMin.value)} class="absolute w-full h-1 appearance-none bg-transparent pointer-events-none custom-dual-input z-[10]" data-v-29232541><input type="range"${ssrRenderAttr("min", Math.floor(__props.minPrice))}${ssrRenderAttr("max", Math.ceil(__props.maxPrice))} step="1"${ssrRenderAttr("value", currentMax.value)} class="absolute w-full h-1 appearance-none bg-transparent pointer-events-none custom-dual-input z-[20]" data-v-29232541></div><div class="flex gap-2 mt-4" data-v-29232541><div class="relative flex-1" data-v-29232541><input type="text"${ssrRenderAttr("value", formatPriceDisplay(currentMin.value))} class="w-full p-3 bg-gray-50 border-none text-xs font-bold text-gray-900 rounded-default focus:ring-1 focus:ring-gray-200 text-center" data-v-29232541></div><div class="relative flex-1" data-v-29232541><input type="text"${ssrRenderAttr("value", formatPriceDisplay(currentMax.value))} class="w-full p-3 bg-gray-50 border-none text-xs font-bold text-gray-900 rounded-default focus:ring-1 focus:ring-gray-200 text-center" data-v-29232541></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="border-b border-gray-100 py-6" data-v-29232541><div class="flex flex-col gap-2" data-v-29232541><button class="${ssrRenderClass([__props.inStockOnly ? "bg-brand border-brand text-white shadow-md" : "bg-gray-50 border-transparent hover:bg-gray-100 text-gray-700", "flex items-center justify-between w-full p-4 rounded-default transition-all border"])}" data-v-29232541><div class="flex flex-col items-start gap-0.5" data-v-29232541><span class="text-[11px] font-bold uppercase tracking-widest leading-none" data-v-29232541>Skladom</span><span class="${ssrRenderClass(`text-[9px] uppercase tracking-wider font-montserrat ${__props.inStockOnly ? "text-gray-300" : "text-gray-400"}`)}" data-v-29232541>Odosielame ihneď</span></div><div class="${ssrRenderClass(`w-4 h-4 rounded-sm border flex items-center justify-center ${__props.inStockOnly ? "bg-white border-white text-brand" : "bg-white border-gray-300"}`)}" data-v-29232541>`);
      if (__props.inStockOnly) {
        _push(ssrRenderComponent(unref(Check), {
          class: "w-3 h-3",
          "stroke-width": "3"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></button><button class="${ssrRenderClass([__props.onDemandOnly ? "bg-brand border-brand text-white shadow-md" : "bg-gray-50 border-transparent hover:bg-gray-100 text-gray-700", "flex items-center justify-between w-full p-4 rounded-default transition-all border"])}" data-v-29232541><div class="flex flex-col items-start gap-0.5" data-v-29232541><span class="text-[11px] font-bold uppercase tracking-widest leading-none" data-v-29232541>Na objednávku</span><span class="${ssrRenderClass(`text-[9px] uppercase tracking-wider font-montserrat ${__props.onDemandOnly ? "text-gray-300" : "text-gray-400"}`)}" data-v-29232541>Odosielame za 3-5 dní</span></div><div class="${ssrRenderClass([__props.onDemandOnly ? "bg-white border-white text-brand" : "bg-white border-gray-300", "w-4 h-4 rounded-sm border flex items-center justify-center"])}" data-v-29232541>`);
      if (__props.onDemandOnly) {
        _push(ssrRenderComponent(unref(Check), {
          class: "w-3 h-3",
          "stroke-width": "3"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></button><button class="${ssrRenderClass([__props.isFeatured ? "bg-brand border-brand text-white shadow-md" : "bg-gray-50 border-transparent hover:bg-gray-100 text-gray-700", "flex items-center justify-between w-full p-4 rounded-default transition-all border"])}" data-v-29232541><div class="flex flex-col items-start gap-0.5" data-v-29232541><span class="text-[11px] font-bold uppercase tracking-widest leading-none" data-v-29232541>Odporúčané produkty</span><span class="${ssrRenderClass(`text-[9px] uppercase tracking-wider font-montserrat ${__props.isFeatured ? "text-gray-300" : "text-gray-400"}`)}" data-v-29232541>Vybrali sme pre vás</span></div><div class="${ssrRenderClass([__props.isFeatured ? "bg-white border-white text-brand" : "bg-white border-gray-300", "w-4 h-4 rounded-sm border flex items-center justify-center"])}" data-v-29232541>`);
      if (__props.isFeatured) {
        _push(ssrRenderComponent(unref(Check), {
          class: "w-3 h-3",
          "stroke-width": "3"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></button></div></div>`);
      if ((__props.categoryName?.toLowerCase().includes("elektro") || __props.categoryName?.toLowerCase().includes("e-bike")) && __props.motorNorm && __props.motorNorm.length > 0) {
        _push(`<div class="border-b border-gray-100" data-v-29232541><button class="flex items-center justify-between w-full py-5 bg-white group transition-colors hover:text-brand"${ssrRenderAttr("aria-expanded", openSections.value.motor)} aria-controls="filter-section-motor" data-v-29232541><span class="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 font-montserrat" data-v-29232541>Motor</span>`);
        _push(ssrRenderComponent(unref(ChevronDown), {
          class: `w-4 h-4 text-gray-400 transition-transform duration-300 ${openSections.value.motor ? "rotate-180" : ""}`,
          "aria-hidden": "true"
        }, null, _parent));
        _push(`</button>`);
        if (openSections.value.motor) {
          _push(`<div id="filter-section-motor" class="flex flex-col gap-1 pb-6 px-1" data-v-29232541><!--[-->`);
          ssrRenderList(__props.motorNorm, (item) => {
            _push(`<label class="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer transition-colors group" data-v-29232541><input type="checkbox"${ssrIncludeBooleanAttr(__props.selectedMotorNorm?.includes(item.id)) ? " checked" : ""} class="text-brand border-gray-300 rounded-sm focus:ring-brand/20 w-4 h-4 transition-all" data-v-29232541><span class="text-[11px] font-bold text-gray-700 uppercase group-hover:text-gray-900 transition-colors" data-v-29232541>${ssrInterpolate(item.name)}</span></label>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if ((__props.categoryName?.toLowerCase().includes("elektro") || __props.categoryName?.toLowerCase().includes("e-bike")) && __props.batteryNorm && __props.batteryNorm.length > 0) {
        _push(`<div class="border-b border-gray-100" data-v-29232541><button class="flex items-center justify-between w-full py-5 bg-white group transition-colors hover:text-brand"${ssrRenderAttr("aria-expanded", openSections.value.battery)} aria-controls="filter-section-battery" data-v-29232541><span class="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 font-montserrat" data-v-29232541>Batéria</span>`);
        _push(ssrRenderComponent(unref(ChevronDown), {
          class: `w-4 h-4 text-gray-400 transition-transform duration-300 ${openSections.value.battery ? "rotate-180" : ""}`,
          "aria-hidden": "true"
        }, null, _parent));
        _push(`</button>`);
        if (openSections.value.battery) {
          _push(`<div id="filter-section-battery" class="flex flex-col gap-1 pb-6 px-1" data-v-29232541><!--[-->`);
          ssrRenderList(__props.batteryNorm, (item) => {
            _push(`<label class="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer transition-colors group" data-v-29232541><input type="checkbox"${ssrIncludeBooleanAttr(__props.selectedBatteryNorm?.includes(item.id)) ? " checked" : ""} class="text-brand border-gray-300 rounded-sm focus:ring-brand/20 w-4 h-4 transition-all" data-v-29232541><span class="text-[11px] font-bold text-gray-700 uppercase group-hover:text-gray-900 transition-colors" data-v-29232541>${ssrInterpolate(item.name)}</span></label>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="border-b border-gray-100" data-v-29232541><button class="flex items-center justify-between w-full py-5 bg-white group transition-colors hover:text-brand"${ssrRenderAttr("aria-expanded", openSections.value.brands)} aria-controls="filter-section-brands" data-v-29232541><span class="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 font-montserrat" data-v-29232541>Značka</span>`);
      _push(ssrRenderComponent(unref(ChevronDown), {
        class: `w-4 h-4 text-gray-400 transition-transform duration-300 ${openSections.value.brands ? "rotate-180" : ""}`,
        "aria-hidden": "true"
      }, null, _parent));
      _push(`</button>`);
      if (openSections.value.brands) {
        _push(`<div id="filter-section-brands" class="space-y-4 pb-6 px-1" data-v-29232541><div class="relative" data-v-29232541><input type="text" placeholder="Hľadať značku..."${ssrRenderAttr("value", brandSearch.value)} class="w-full pl-10 pr-4 py-3 bg-gray-50 border-none text-xs font-montserrat rounded-default focus:ring-1 focus:ring-gray-200" data-v-29232541>`);
        _push(ssrRenderComponent(unref(Search), { class: "w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" }, null, _parent));
        _push(`</div><div class="${ssrRenderClass([showAllBrands.value ? "max-h-60" : "", "grid grid-cols-2 gap-2 overflow-y-auto pr-2 custom-aero-scrollbar"])}" data-v-29232541><!--[-->`);
        ssrRenderList(displayedBrands.value, (brand) => {
          _push(`<button class="${ssrRenderClass([__props.selectedBrands.includes(brand.id) ? "bg-brand border-brand text-white" : "bg-white border-gray-100 hover:border-gray-300 text-gray-600", "p-3 flex items-center gap-3 transition-all rounded-sm border"])}" data-v-29232541>`);
          if (manufacturerLogos.value[brand.id]) {
            _push(`<div class="w-6 h-6 flex-shrink-0 flex items-center justify-center" data-v-29232541><img${ssrRenderAttr("src", manufacturerLogos.value[brand.id])}${ssrRenderAttr("alt", brand.name)} class="${ssrRenderClass([__props.selectedBrands.includes(brand.id) ? "brightness-0 invert" : "grayscale", "max-w-full max-h-full object-contain"])}" data-v-29232541></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span class="text-[11px] font-bold truncate flex-1 text-left leading-tight" data-v-29232541>${ssrInterpolate(brand.name)}</span></button>`);
        });
        _push(`<!--]--></div>`);
        if (hasMoreBrands.value) {
          _push(`<button class="w-full mt-2 py-3 px-4 flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-widest text-brand transition-all rounded-default outline-none border border-transparent hover:border-brand/20 hover:bg-brand/5 group" data-v-29232541><div class="flex items-center gap-1.5 overflow-hidden flex-1" data-v-29232541><!--[-->`);
          ssrRenderList(filteredBrands.value.slice(6, 10), (brand, idx) => {
            _push(`<!--[-->`);
            if (manufacturerLogos.value[brand.id]) {
              _push(`<img${ssrRenderAttr("src", manufacturerLogos.value[brand.id])} class="w-4 h-4 object-contain opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all font-tech" data-v-29232541>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<!--]-->`);
          });
          _push(`<!--]--><span class="ml-1" data-v-29232541>Zobraziť viac (${ssrInterpolate(filteredBrands.value.length)})</span></div>`);
          _push(ssrRenderComponent(unref(ChevronDown), { class: "w-3 h-3 flex-shrink-0 group-hover:translate-y-0.5 transition-transform" }, null, _parent));
          _push(`</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.wheelsNorm && __props.wheelsNorm.length > 0) {
        _push(`<div class="border-b border-gray-100" data-v-29232541><button class="flex items-center justify-between w-full py-5 bg-white group transition-colors hover:text-brand"${ssrRenderAttr("aria-expanded", openSections.value.wheelsNorm)} aria-controls="filter-section-wheels" data-v-29232541><span class="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 font-montserrat" data-v-29232541>Veľkosť kolies</span>`);
        _push(ssrRenderComponent(unref(ChevronDown), {
          class: `w-4 h-4 text-gray-400 transition-transform duration-300 ${openSections.value.wheelsNorm ? "rotate-180" : ""}`,
          "aria-hidden": "true"
        }, null, _parent));
        _push(`</button>`);
        if (openSections.value.wheelsNorm) {
          _push(`<div id="filter-section-wheels" class="flex flex-col gap-1 pb-6 px-1" data-v-29232541><!--[-->`);
          ssrRenderList(__props.wheelsNorm, (item) => {
            _push(`<label class="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer transition-colors group" data-v-29232541><input type="checkbox"${ssrIncludeBooleanAttr(__props.selectedWheelsNorm?.includes(item.id)) ? " checked" : ""} class="text-brand border-gray-300 rounded-sm focus:ring-brand/20 w-4 h-4 transition-all" data-v-29232541><span class="text-[11px] font-bold text-gray-700 uppercase group-hover:text-gray-900 transition-colors" data-v-29232541>${ssrInterpolate(item.name)}</span></label>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.forkNorm && __props.forkNorm.length > 0) {
        _push(`<div class="border-b border-gray-100" data-v-29232541><button class="flex items-center justify-between w-full py-5 bg-white group transition-colors hover:text-brand"${ssrRenderAttr("aria-expanded", openSections.value.fork)} aria-controls="filter-section-fork" data-v-29232541><span class="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 font-montserrat" data-v-29232541>Vidlica</span>`);
        _push(ssrRenderComponent(unref(ChevronDown), {
          class: `w-4 h-4 text-gray-400 transition-transform duration-300 ${openSections.value.fork ? "rotate-180" : ""}`,
          "aria-hidden": "true"
        }, null, _parent));
        _push(`</button>`);
        if (openSections.value.fork) {
          _push(`<div id="filter-section-fork" class="flex flex-col gap-1 pb-6 px-1" data-v-29232541><!--[-->`);
          ssrRenderList(__props.forkNorm, (item) => {
            _push(`<label class="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer transition-colors group" data-v-29232541><input type="checkbox"${ssrIncludeBooleanAttr(__props.selectedForkNorm?.includes(item.id)) ? " checked" : ""} class="text-brand border-gray-300 rounded-sm focus:ring-brand/20 w-4 h-4 transition-all" data-v-29232541><span class="text-[11px] font-bold text-gray-700 uppercase group-hover:text-gray-900 transition-colors" data-v-29232541>${ssrInterpolate(item.name)}</span></label>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.brakesNorm && __props.brakesNorm.length > 0) {
        _push(`<div class="border-b border-gray-100" data-v-29232541><button class="flex items-center justify-between w-full py-5 bg-white group transition-colors hover:text-brand"${ssrRenderAttr("aria-expanded", openSections.value.brakes)} aria-controls="filter-section-brakes" data-v-29232541><span class="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 font-montserrat" data-v-29232541>Brzdy</span>`);
        _push(ssrRenderComponent(unref(ChevronDown), {
          class: `w-4 h-4 text-gray-400 transition-transform duration-300 ${openSections.value.brakes ? "rotate-180" : ""}`,
          "aria-hidden": "true"
        }, null, _parent));
        _push(`</button>`);
        if (openSections.value.brakes) {
          _push(`<div id="filter-section-brakes" class="flex flex-col gap-1 pb-6 px-1" data-v-29232541><!--[-->`);
          ssrRenderList(__props.brakesNorm, (item) => {
            _push(`<label class="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer transition-colors group" data-v-29232541><input type="checkbox"${ssrIncludeBooleanAttr(__props.selectedBrakesNorm?.includes(item.id)) ? " checked" : ""} class="text-brand border-gray-300 rounded-sm focus:ring-brand/20 w-4 h-4 transition-all" data-v-29232541><span class="text-[11px] font-bold text-gray-700 uppercase group-hover:text-gray-900 transition-colors" data-v-29232541>${ssrInterpolate(item.name)}</span></label>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.gearsNorm && __props.gearsNorm.length > 0) {
        _push(`<div class="border-b border-gray-100" data-v-29232541><button class="flex items-center justify-between w-full py-5 bg-white group transition-colors hover:text-brand"${ssrRenderAttr("aria-expanded", openSections.value.gears)} aria-controls="filter-section-gears" data-v-29232541><span class="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 font-montserrat" data-v-29232541>Prehadzovačka</span>`);
        _push(ssrRenderComponent(unref(ChevronDown), {
          class: `w-4 h-4 text-gray-400 transition-transform duration-300 ${openSections.value.gears ? "rotate-180" : ""}`,
          "aria-hidden": "true"
        }, null, _parent));
        _push(`</button>`);
        if (openSections.value.gears) {
          _push(`<div id="filter-section-gears" class="flex flex-col gap-1 pb-6 px-1" data-v-29232541><!--[-->`);
          ssrRenderList(__props.gearsNorm, (item) => {
            _push(`<label class="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer transition-colors group" data-v-29232541><input type="checkbox"${ssrIncludeBooleanAttr(__props.selectedGearsNorm?.includes(item.id)) ? " checked" : ""} class="text-brand border-gray-300 rounded-sm focus:ring-brand/20 w-4 h-4 transition-all" data-v-29232541><span class="text-[11px] font-bold text-gray-700 uppercase group-hover:text-gray-900 transition-colors" data-v-29232541>${ssrInterpolate(item.name)}</span></label>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.colorsNorm && __props.colorsNorm.length > 0) {
        _push(`<div class="border-b border-gray-100" data-v-29232541><button class="flex items-center justify-between w-full py-5 bg-white group transition-colors hover:text-brand"${ssrRenderAttr("aria-expanded", openSections.value.colors)} aria-controls="filter-section-colors" data-v-29232541><span class="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 font-montserrat" data-v-29232541>Farba</span>`);
        _push(ssrRenderComponent(unref(ChevronDown), {
          class: `w-4 h-4 text-gray-400 transition-transform duration-300 ${openSections.value.colors ? "rotate-180" : ""}`,
          "aria-hidden": "true"
        }, null, _parent));
        _push(`</button>`);
        if (openSections.value.colors) {
          _push(`<div id="filter-section-colors" class="pb-6 px-1" data-v-29232541><div class="flex flex-wrap gap-3" data-v-29232541><!--[-->`);
          ssrRenderList(__props.colorsNorm, (item) => {
            _push(`<button class="group relative flex flex-col items-center justify-center p-0.5 rounded-full transition-all duration-300 transform active:scale-90"${ssrRenderAttr("title", item.name)}${ssrRenderAttr("aria-label", item.name)} data-v-29232541><div class="${ssrRenderClass([__props.selectedColors?.includes(item.id) ? "border-brand scale-110 shadow-lg shadow-brand/20" : "border-transparent group-hover:border-gray-200", "w-8 h-8 rounded-full border-2 transition-all p-0.5"])}" data-v-29232541><div class="w-full h-full rounded-full border border-gray-100 shadow-inner" style="${ssrRenderStyle({ backgroundColor: item.color || "#e5e7eb" })}" data-v-29232541></div></div></button>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/category/ProductFilters.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProductFilters = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-29232541"]]), { __name: "ProductFilters" });

export { ProductFilters as default };
