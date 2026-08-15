import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import __nuxt_component_1 from './QuantitySelector-B6vBeA3f.mjs';
import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { Trash2 } from 'lucide-vue-next';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CartItem",
  __ssrInlineRender: true,
  props: {
    item: {},
    stockInfo: {},
    getProductImage: { type: Function },
    formatPrice: { type: Function },
    isUpdating: { type: Boolean }
  },
  emits: ["remove", "update-qty", "click-product"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isSplitStock = computed(() => {
      if (!props.stockInfo || props.stockInfo.isCloseout) return false;
      return props.item.quantity > props.stockInfo.stock && props.stockInfo.stock > 0;
    });
    const stockClass = computed(() => {
      if (isSplitStock.value) return "text-amber-500";
      switch (props.stockInfo?.stockStatus) {
        case "in_stock":
          return "text-green-600";
        case "on_order":
          return "text-amber-500";
        default:
          return "text-brand";
      }
    });
    const stockDotClass = computed(() => {
      if (isSplitStock.value) return "bg-amber-500";
      switch (props.stockInfo?.stockStatus) {
        case "in_stock":
          return "bg-green-600";
        case "on_order":
          return "bg-amber-500";
        default:
          return "bg-brand";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_2;
      const _component_QuantitySelector = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex gap-4 md:gap-5 group" }, _attrs))}><div class="w-20 h-20 bg-gray-50 border border-gray-100 flex-shrink-0 p-1 cursor-pointer hover:border-gray-300 transition-colors">`);
      if (__props.getProductImage(__props.item) && !__props.getProductImage(__props.item).includes("placehold.co")) {
        _push(ssrRenderComponent(_component_NuxtImg, {
          src: __props.getProductImage(__props.item),
          alt: __props.item.label,
          width: "160",
          height: "160",
          sizes: "80px",
          class: "w-full h-full object-contain mix-blend-multiply",
          format: "webp",
          loading: "lazy"
        }, null, _parent));
      } else {
        _push(`<img${ssrRenderAttr("src", __props.getProductImage(__props.item))}${ssrRenderAttr("alt", __props.item.label)} width="80" height="80" loading="lazy" class="w-full h-full object-contain mix-blend-multiply opacity-50">`);
      }
      _push(`</div><div class="flex-1 min-w-0 flex flex-col justify-between"><div><div class="flex justify-between items-start"><div class="flex-1 pr-4 cursor-pointer group/title"><h4 class="font-sans font-bold text-sm text-black leading-snug uppercase group-hover/title:text-brand transition-colors">${ssrInterpolate(__props.item.label.replace(/\(VARIANT\)/gi, "").trim())}</h4>`);
      if (__props.item.payload?.options?.[0]) {
        _push(`<div class="text-[11px] text-gray-400 font-sans mt-0.5">${ssrInterpolate(__props.item.payload.options[0].group)}: ${ssrInterpolate(__props.item.payload.options[0].option)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button class="w-8 h-8 flex items-center justify-center bg-white border border-gray-50 text-gray-300 hover:text-red-500 hover:border-red-100 transition-all ml-4 flex-shrink-0" aria-label="Odstrániť z košíka">`);
      _push(ssrRenderComponent(unref(Trash2), { class: "w-4 h-4" }, null, _parent));
      _push(`</button></div><div class="mt-0.5 space-y-0.5">`);
      if (__props.item.payload?.productNumber) {
        _push(`<div class="text-[11px] font-sans text-gray-400 uppercase tracking-widest leading-none"> SKU: <span class="text-gray-500">${ssrInterpolate(__props.item.payload.productNumber)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.stockInfo) {
        _push(`<div>`);
        if (unref(isSplitStock)) {
          _push(`<div class="flex items-center gap-3"><div class="text-[11px] font-bold uppercase tracking-widest flex items-center gap-1 text-green-600"><div class="w-1.5 h-1.5 rounded-full bg-green-600"></div> Skladom ${ssrInterpolate(__props.stockInfo.stock)} ks </div><div class="text-[11px] font-bold uppercase tracking-widest flex items-center gap-1 text-amber-500"> Na obj. ${ssrInterpolate(__props.item.quantity - __props.stockInfo.stock)} ks </div></div>`);
        } else {
          _push(`<div class="${ssrRenderClass([unref(stockClass), "text-[11px] font-bold uppercase tracking-widest flex items-center gap-1"])}"><div class="${ssrRenderClass([unref(stockDotClass), "w-1.5 h-1.5 rounded-full"])}"></div>`);
          if (__props.stockInfo.stockStatus === "in_stock") {
            _push(`<!--[-->${ssrInterpolate(_ctx.$t("availability_inStock"))}<!--]-->`);
          } else if (__props.stockInfo.stockStatus === "on_order") {
            _push(`<!--[-->${ssrInterpolate(_ctx.$t("availability_restockTime", { days: __props.stockInfo.restockTime || 4 }))}<!--]-->`);
          } else {
            _push(`<!--[-->${ssrInterpolate(_ctx.$t("availability_soldOut"))}<!--]-->`);
          }
          _push(`</div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<div class="text-[11px] font-bold uppercase tracking-widest text-gray-300 flex items-center gap-1"><div class="w-1.5 h-1.5 rounded-full bg-gray-200 animate-pulse"></div> Načítavam... </div>`);
      }
      _push(`</div></div><div class="flex justify-between items-center mt-3"><div class="${ssrRenderClass([{ "opacity-50 pointer-events-none": __props.isUpdating }, "relative"])}">`);
      _push(ssrRenderComponent(_component_QuantitySelector, {
        size: "sm",
        "model-value": __props.item.quantity,
        min: 1,
        "onUpdate:modelValue": (newVal) => emit("update-qty", __props.item, newVal - __props.item.quantity)
      }, null, _parent));
      if (__props.isUpdating) {
        _push(`<div class="absolute inset-0 flex items-center justify-center"><div class="w-3 h-3 border-2 border-brand/20 border-t-brand rounded-full animate-spin"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="text-right">`);
      if (__props.item.price?.listPrice && __props.item.price.listPrice.price > __props.item.price.totalPrice) {
        _push(`<div class="text-[10px] text-gray-400 line-through font-tech leading-none">${ssrInterpolate(__props.formatPrice(__props.item.price.listPrice.price))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="font-black font-tech text-sm text-black leading-none">${ssrInterpolate(__props.formatPrice(__props.item.price?.totalPrice || 0))}</div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart/CartItem.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CartItem = Object.assign(_sfc_main, { __name: "CartItem" });

export { CartItem as default };
