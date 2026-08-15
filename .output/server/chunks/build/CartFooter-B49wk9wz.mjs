import __nuxt_component_0 from './BaseLink-CtWKrAdk.mjs';
import BaseButton from './BaseButton-BJMOoNbK.mjs';
import { defineComponent, ref, computed, watch, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { Zap, Lock } from 'lucide-vue-next';
import './nuxt-link-B7B0pxEe.mjs';
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
import './server.mjs';
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
  __name: "CartFooter",
  __ssrInlineRender: true,
  props: {
    checkoutTotal: {},
    formatPrice: { type: Function },
    expressProduct: {},
    isExpressInCart: { type: Boolean },
    isExpressLoading: { type: Boolean }
  },
  emits: ["checkout", "view-cart", "coupon", "order-note", "express"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    ref(false);
    ref(false);
    ref("");
    ref(false);
    ref(false);
    const orderNote = ref("");
    const isExpressDelivery = computed({
      get: () => props.isExpressInCart || false,
      set: (val) => emit("express", val)
    });
    const effectiveTotal = computed(() => props.checkoutTotal);
    watch(orderNote, (val) => emit("order-note", val));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseLink = __nuxt_component_0;
      const _component_BaseButton = BaseButton;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "absolute bottom-0 left-0 right-0 px-5 md:px-8 pt-1.5 pb-4 bg-white border-t border-gray-100 flex flex-col z-10 w-full shadow-[0_-15px_30px_rgba(0,0,0,0.04)]" }, _attrs))}><label class="flex items-center justify-between gap-3 px-0 py-2.5 mb-1 cursor-pointer group hover:bg-gray-50 -mx-1 px-1 transition-colors"><div class="flex items-center gap-3"><div class="${ssrRenderClass([{ "opacity-50 cursor-not-allowed": __props.isExpressLoading }, "relative flex items-center justify-center w-4 h-4 border border-gray-300 group-hover:border-black transition-colors bg-white flex-shrink-0"])}"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(isExpressDelivery.value) ? ssrLooseContain(isExpressDelivery.value, null) : isExpressDelivery.value) ? " checked" : ""} class="sr-only"${ssrIncludeBooleanAttr(__props.isExpressLoading) ? " disabled" : ""}>`);
      if (isExpressDelivery.value) {
        _push(`<div class="w-2.5 h-2.5 bg-brand"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div>`);
      if (__props.expressProduct) {
        _push(ssrRenderComponent(_component_BaseLink, {
          to: __props.expressProduct,
          class: "text-[11px] font-black uppercase tracking-widest font-tech flex items-center gap-1.5 hover:text-brand transition-colors",
          onClick: () => {
          }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Zap), { class: "w-3 h-3 text-amber-500 flex-shrink-0" }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(__props.expressProduct.translated?.name || "Expresné odoslanie")}`);
            } else {
              return [
                createVNode(unref(Zap), { class: "w-3 h-3 text-amber-500 flex-shrink-0" }),
                createTextVNode(" " + toDisplayString(__props.expressProduct.translated?.name || "Expresné odoslanie"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<div class="text-[11px] font-black uppercase tracking-widest font-tech flex items-center gap-1.5">`);
        _push(ssrRenderComponent(unref(Zap), { class: "w-3 h-3 text-amber-500 flex-shrink-0" }, null, _parent));
        _push(` Expresné odoslanie </div>`);
      }
      _push(`<div class="text-[10px] text-gray-400 font-sans">Expedícia ešte dnes do 13:00</div></div></div><span class="font-tech font-black text-sm text-black flex-shrink-0"> + ${ssrInterpolate(__props.formatPrice(__props.expressProduct?.calculatedPrice?.unitPrice || 12.9))}</span></label>`);
      _push(ssrRenderComponent(_component_BaseButton, {
        variant: "primary",
        block: "",
        onClick: ($event) => emit("checkout"),
        class: "h-14 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Lock), { class: "w-3.5 h-3.5 mr-2 flex-shrink-0" }, null, _parent2, _scopeId));
            _push2(`<span class="font-tech font-bold text-sm tracking-[0.15em] uppercase"${_scopeId}>Pokladňa</span><span class="w-1 h-1 rounded-full bg-white mx-3 opacity-50 flex-shrink-0"${_scopeId}></span><span class="font-tech font-black text-sm leading-none"${_scopeId}>${ssrInterpolate(__props.formatPrice(effectiveTotal.value))}</span>`);
          } else {
            return [
              createVNode(unref(Lock), { class: "w-3.5 h-3.5 mr-2 flex-shrink-0" }),
              createVNode("span", { class: "font-tech font-bold text-sm tracking-[0.15em] uppercase" }, "Pokladňa"),
              createVNode("span", { class: "w-1 h-1 rounded-full bg-white mx-3 opacity-50 flex-shrink-0" }),
              createVNode("span", { class: "font-tech font-black text-sm leading-none" }, toDisplayString(__props.formatPrice(effectiveTotal.value)), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_BaseButton, {
        variant: "secondary",
        block: "",
        onClick: ($event) => emit("view-cart"),
        class: "h-12 mt-2 font-tech text-[11px] text-gray-600 flex items-center justify-center"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.$t("cart.view_cart"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.$t("cart.view_cart")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="text-[9px] text-gray-400 text-center tracking-wide mt-2 font-sans"> Doprava bude vypočítaná v pokladni. </p></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart/CartFooter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CartFooter = Object.assign(_sfc_main, { __name: "CartFooter" });

export { CartFooter as default };
