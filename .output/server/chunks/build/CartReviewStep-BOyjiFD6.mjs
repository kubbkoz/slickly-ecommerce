import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import __nuxt_component_1 from './QuantitySelector-B6vBeA3f.mjs';
import { defineComponent, computed, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { Loader2, Trash2, Zap } from 'lucide-vue-next';
import { a as useCart } from './server.mjs';
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
  __name: "CartReviewStep",
  __ssrInlineRender: true,
  props: {
    isExpressShipping: { type: Boolean },
    expressProduct: {}
  },
  emits: ["update:isExpressShipping"],
  setup(__props, { emit: __emit }) {
    const { cartItems, removeItem, changeProductQuantity } = useCart();
    const productCartItems = computed(() => (cartItems.value || []).filter((i) => i.type === "product"));
    const promoCartItems = computed(() => (cartItems.value || []).filter((i) => i.type !== "product"));
    const removingId = ref(null);
    const updateQuantity = async (item, delta) => {
      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        removingId.value = item.id;
        await removeItem(item);
        removingId.value = null;
      } else {
        await changeProductQuantity({ id: item.id, quantity: newQty });
      }
    };
    const formatPrice = (price) => new Intl.NumberFormat("sk-SK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
    const getImage = (item) => {
      const url = item.cover?.url || item.payload?.cover?.url || "";
      if (!url) return "https://placehold.co/160x160";
      return url;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_2;
      const _component_QuantitySelector = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4 animate-fade-in font-sans" }, _attrs))}><div class="bg-white border border-gray-200"><div class="flex items-center justify-between px-5 md:px-8 py-5 border-b border-gray-100"><div class="flex items-center gap-3"><span class="w-1 h-5 bg-brand inline-block flex-shrink-0"></span><h2 class="text-sm font-bold tracking-[0.2em] text-gray-900 uppercase font-sans"> OBSAH KOŠÍKA (${ssrInterpolate(unref(cartItems).filter((i) => i.type === "product").length)}) </h2></div></div><div class="divide-y divide-gray-50"><!--[-->`);
      ssrRenderList(unref(productCartItems), (item) => {
        _push(`<div class="${ssrRenderClass([unref(removingId) === item.id ? "opacity-40" : "opacity-100", "flex gap-4 md:gap-5 px-5 md:px-8 py-5 transition-opacity duration-300"])}"><div class="w-20 h-20 bg-gray-50 border border-gray-100 flex-shrink-0 p-1">`);
        if (!getImage(item).includes("placehold.co")) {
          _push(ssrRenderComponent(_component_NuxtImg, {
            src: getImage(item),
            alt: item.label,
            class: "w-full h-full object-contain mix-blend-multiply",
            format: "webp",
            loading: "lazy"
          }, null, _parent));
        } else {
          _push(`<img${ssrRenderAttr("src", getImage(item))}${ssrRenderAttr("alt", item.label)} class="w-full h-full object-contain opacity-40">`);
        }
        _push(`</div><div class="flex-1 min-w-0 flex flex-col justify-between"><div class="flex justify-between items-start gap-2"><div class="min-w-0 flex-1"><h4 class="font-sans font-bold text-sm text-black leading-snug uppercase">${ssrInterpolate(item.label.replace(/\(VARIANT\)/gi, "").trim())}</h4>`);
        if (item.payload?.options?.[0]) {
          _push(`<div class="text-[11px] text-gray-400 font-sans mt-0.5">${ssrInterpolate(item.payload.options[0].group)}: ${ssrInterpolate(item.payload.options[0].option)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><button class="w-8 h-8 flex items-center justify-center bg-white border border-gray-50 text-gray-300 hover:text-red-500 hover:border-red-100 transition-all flex-shrink-0"${ssrIncludeBooleanAttr(unref(removingId) === item.id) ? " disabled" : ""} aria-label="Odstrániť z košíka">`);
        if (unref(removingId) === item.id) {
          _push(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 animate-spin" }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(Trash2), { class: "w-4 h-4" }, null, _parent));
        }
        _push(`</button></div><div class="flex justify-between items-center mt-3">`);
        _push(ssrRenderComponent(_component_QuantitySelector, {
          size: "sm",
          "model-value": item.quantity,
          min: 1,
          "onUpdate:modelValue": (newVal) => updateQuantity(item, newVal - item.quantity)
        }, null, _parent));
        _push(`<div class="text-right">`);
        if (item.price?.listPrice && item.price.listPrice.price > item.price.totalPrice) {
          _push(`<div class="text-xs text-gray-400 line-through font-tech">${ssrInterpolate(formatPrice(item.price.listPrice.price))} € </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="font-black font-tech text-sm text-black">${ssrInterpolate(formatPrice(item.price?.totalPrice ?? 0))} € </div></div></div></div></div>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(unref(promoCartItems), (promo) => {
        _push(`<div class="flex items-center justify-between gap-3 px-5 md:px-8 py-4"><div class="flex items-center gap-3 min-w-0"><div class="flex-shrink-0 px-1.5 py-0.5 bg-brand text-white text-[9px] font-black uppercase tracking-widest"> KÓD </div><div class="min-w-0"><span class="text-xs font-bold uppercase text-gray-800 truncate block">${ssrInterpolate(promo.label)}</span>`);
        if (promo.payload?.code) {
          _push(`<span class="text-[10px] font-mono text-gray-400 uppercase">${ssrInterpolate(promo.payload.code)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><span class="font-black font-tech text-sm text-brand flex-shrink-0">${ssrInterpolate(formatPrice(promo.price?.totalPrice || 0))} € </span></div>`);
      });
      _push(`<!--]--></div></div><div class="bg-white border border-gray-200"><label class="flex items-start gap-4 cursor-pointer p-5 md:px-8 group"><div class="relative flex items-center justify-center w-4 h-4 border border-gray-300 group-hover:border-black transition-colors bg-white flex-shrink-0 mt-0.5"><input type="checkbox" class="sr-only"${ssrIncludeBooleanAttr(__props.isExpressShipping) ? " checked" : ""}>`);
      if (__props.isExpressShipping) {
        _push(`<div class="w-2.5 h-2.5 bg-black"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex-1 min-w-0"><div class="flex items-center justify-between mb-1"><span class="text-[11px] font-bold uppercase tracking-widest font-sans text-black flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Zap), { class: "w-3.5 h-3.5 text-yellow-500 fill-current flex-shrink-0" }, null, _parent));
      _push(` Expresné odoslanie (do 24 hodín) </span><span class="font-tech font-black text-sm text-black flex-shrink-0 ml-3">+ ${ssrInterpolate(formatPrice(__props.expressProduct?.calculatedPrice?.unitPrice || 12.9))} €</span></div><p class="text-[11px] text-gray-400 font-sans leading-relaxed"> Vašu objednávku vybavíme prednostne. Garantované odoslanie počas pracovných dní. </p></div></label></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart/checkout/CartReviewStep.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CartReviewStep = Object.assign(_sfc_main, { __name: "CartReviewStep" });

export { CartReviewStep as default };
