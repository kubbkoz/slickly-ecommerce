import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderStyle } from 'vue/server-renderer';
import { Package, Gift, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { u as useProductHelpers } from './useProductHelpers-Ch_jrkwO.mjs';
import './composables-x8_ENpEe.mjs';
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
import '@shopware/helpers';
import './server.mjs';
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

const COLS = 4;
const GAP = 16;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AccountTabPrehled",
  __ssrInlineRender: true,
  props: {
    user: {},
    orders: {},
    recentlyViewed: {},
    loyaltyPoints: {},
    totalSpent: {}
  },
  emits: ["changeTab"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useProductHelpers();
    const formatNumber = (n) => new Intl.NumberFormat("sk-SK").format(n);
    function orderStatusLabel(state) {
      const map = {
        open: "Otvorená",
        in_progress: "Spracováva sa",
        completed: "Doručená",
        cancelled: "Zrušená"
      };
      return map[state] || state;
    }
    ref(null);
    const containerWidth = ref(0);
    const carouselIndex = ref(0);
    const items = computed(() => props.recentlyViewed.slice(0, 8));
    const maxIndex = computed(() => Math.max(0, items.value.length - COLS));
    const formatName = (name) => {
      if (!name) return "";
      return name.replace(/\s*\(.*?\)\s*/g, "").replace(/\s*-\s*veľkosť.*$/i, "").trim();
    };
    const carouselOffset = computed(() => {
      if (carouselIndex.value === 0 || containerWidth.value <= 0) return "translateX(0px)";
      const iw = (containerWidth.value - (COLS - 1) * GAP) / COLS;
      return `translateX(-${carouselIndex.value * (iw + GAP)}px)`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-8 animate-fade-in" }, _attrs))}><div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="bg-white border border-gray-100 p-7 relative overflow-hidden group hover:border-black transition-colors"><div class="absolute right-0 top-0 opacity-[0.03] transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500 pointer-events-none">`);
      _push(ssrRenderComponent(unref(Package), { class: "w-32 h-32" }, null, _parent));
      _push(`</div><p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 relative z-10">Aktívne objednávky</p><div class="w-12 h-1 bg-brand skew-x-[-20deg] mb-4 relative z-10"></div><div class="text-4xl md:text-5xl font-black font-tech text-black relative z-10">${ssrInterpolate(__props.orders?.filter((o) => o.stateMachineState?.technicalName !== "cancelled" && o.stateMachineState?.technicalName !== "completed").length || 0)}</div></div><div class="bg-white border border-gray-100 p-7 relative overflow-hidden group hover:border-black transition-colors"><div class="absolute right-0 top-0 opacity-[0.03] transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500 pointer-events-none">`);
      _push(ssrRenderComponent(unref(Gift), { class: "w-32 h-32" }, null, _parent));
      _push(`</div><p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 relative z-10">Vernostné body</p><div class="w-12 h-1 bg-brand skew-x-[-20deg] mb-4 relative z-10"></div><div class="text-4xl md:text-5xl font-black font-tech text-black relative z-10">${ssrInterpolate(formatNumber(__props.loyaltyPoints))} <span class="text-xl">b</span></div></div><div class="bg-white border border-gray-100 p-7 relative overflow-hidden group hover:border-black transition-colors"><div class="absolute right-0 top-0 opacity-[0.03] transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500 pointer-events-none"><span class="font-tech text-[120px] leading-none">€</span></div><p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 relative z-10">Celkovo minuté</p><div class="w-12 h-1 bg-brand skew-x-[-20deg] mb-4 relative z-10"></div><div class="text-4xl md:text-5xl font-black font-tech text-black relative z-10">${ssrInterpolate(formatNumber(Math.round(__props.totalSpent)))} <span class="text-xl">€</span></div></div></div><div class="bg-white shadow-sm p-8"><div class="flex justify-between items-center mb-6"><h2 class="text-xl font-black uppercase tracking-wide font-tech">Posledné objednávky</h2><button class="text-[10px] font-bold uppercase tracking-widest text-brand hover:underline"> Zobraziť všetky </button></div>`);
      if (__props.orders && __props.orders.length > 0) {
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(__props.orders.slice(0, 3), (order) => {
          _push(`<div class="flex items-center justify-between p-5 border border-gray-100 hover:border-gray-200 transition-colors bg-gray-50/50"><div class="flex items-center gap-5"><div class="w-10 h-10 bg-white flex items-center justify-center border border-gray-100 text-gray-400 shrink-0">`);
          _push(ssrRenderComponent(unref(Package), { class: "w-5 h-5" }, null, _parent));
          _push(`</div><div><span class="block text-sm font-bold text-black font-tech mb-1">#${ssrInterpolate(order.orderNumber)}</span><span class="text-xs text-gray-400 font-medium">${ssrInterpolate(new Date(order.orderDateTime).toLocaleDateString("sk-SK"))}</span></div></div><div class="text-right flex flex-col items-end gap-2"><span class="font-black font-tech text-base text-black">${ssrInterpolate(order.amountTotal?.toFixed(0) || 0)} €</span><span class="${ssrRenderClass([order.stateMachineState?.technicalName === "completed" ? "text-green-500" : "text-blue-500", "text-[9px] font-bold uppercase tracking-widest"])}">${ssrInterpolate(orderStatusLabel(order.stateMachineState?.technicalName || ""))}</span></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="py-10 text-center text-sm text-gray-400 bg-gray-50 border border-gray-100"> Zatiaľ nemáte žiadne objednávky. </div>`);
      }
      _push(`</div><div class="bg-white shadow-sm p-8"><div class="flex items-center justify-between mb-8"><h2 class="text-xl font-black uppercase tracking-wide font-tech">Naposledy prezerané</h2>`);
      if (items.value.length > COLS) {
        _push(`<div class="flex items-center gap-1"><button${ssrIncludeBooleanAttr(carouselIndex.value === 0) ? " disabled" : ""} class="w-8 h-8 flex items-center justify-center border border-gray-200 hover:border-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Predošlé">`);
        _push(ssrRenderComponent(unref(ChevronLeft), { class: "w-4 h-4" }, null, _parent));
        _push(`</button><button${ssrIncludeBooleanAttr(carouselIndex.value >= maxIndex.value) ? " disabled" : ""} class="w-8 h-8 flex items-center justify-center border border-gray-200 hover:border-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Ďalšie">`);
        _push(ssrRenderComponent(unref(ChevronRight), { class: "w-4 h-4" }, null, _parent));
        _push(`</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (items.value.length > 0) {
        _push(`<div class="overflow-hidden"><div class="flex transition-transform duration-300 ease-out" style="${ssrRenderStyle({ gap: `${GAP}px`, transform: carouselOffset.value })}"><!--[-->`);
        ssrRenderList(items.value, (item) => {
          _push(`<div style="${ssrRenderStyle({ width: "calc(25% - 12px)", flexShrink: "0" })}"><div class="group bg-white cursor-pointer relative transition-[box-shadow] duration-200 z-10 hover:z-20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] h-full"><div class="bg-white border transition-colors duration-200 ease-in-out border-gray-100 group-hover:border-black h-full flex flex-col"><div class="aspect-square bg-gray-50 overflow-hidden relative flex items-center justify-center">`);
          if (item.image && !item.image.startsWith("data:")) {
            _push(ssrRenderComponent(_component_NuxtImg, {
              src: item.image,
              alt: item.name,
              class: "w-full h-full object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-105 absolute inset-0",
              loading: "lazy"
            }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(Package), { class: "w-12 h-12 text-gray-300 transition-transform duration-500 group-hover:scale-105" }, null, _parent));
          }
          _push(`</div><div class="p-3 md:p-4 pb-4 flex-1"><h3 class="font-sans text-[13px] md:text-sm font-medium mb-2 line-clamp-2 leading-tight transition-colors duration-200 h-[2.5em] group-hover:text-brand text-gray-900">${ssrInterpolate(formatName(item.name))}</h3></div></div></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<div class="py-10 text-center text-sm text-gray-400 bg-gray-50 border border-gray-100"> Zatiaľ ste si neprezerali žiadne produkty. </div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/account/AccountTabPrehled.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "AccountTabPrehled" });

export { __nuxt_component_0 as default };
