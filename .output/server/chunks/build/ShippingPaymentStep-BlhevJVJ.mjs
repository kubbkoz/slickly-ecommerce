import __nuxt_component_0 from './BaseLink-CtWKrAdk.mjs';
import { defineComponent, mergeProps, createVNode, resolveDynamicComponent, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderVNode, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { CheckCircle, CreditCard, MapPin, Truck } from 'lucide-vue-next';
import { b as useLocalePath, M as useInternationalization } from './server.mjs';
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
  __name: "ShippingPaymentStep",
  __ssrInlineRender: true,
  props: {
    shippingMethod: {},
    paymentMethod: {},
    agreedToTerms: { type: Boolean },
    shippingMethods: {},
    paymentMethods: {}
  },
  emits: ["update:shippingMethod", "update:paymentMethod", "update:agreedToTerms"],
  setup(__props, { emit: __emit }) {
    const localePath = useLocalePath();
    useInternationalization(localePath);
    const getMethodPriceLabel = (method) => {
      if (!method.prices?.length) return { text: "ZDARMA", free: true };
      const paid = method.prices.find((p) => (p.currencyPrice?.[0]?.gross ?? 0) > 0);
      if (!paid) return { text: "ZDARMA", free: true };
      const gross = paid.currencyPrice[0].gross;
      return {
        text: new Intl.NumberFormat("sk-SK", { minimumFractionDigits: 2 }).format(gross) + " €",
        free: false
      };
    };
    const getShippingIcon = (method) => {
      const name = (method.translated?.name || method.name || "").toLowerCase();
      if (name.includes("odber") || name.includes("pickup") || name.includes("personal")) return MapPin;
      return Truck;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 animate-fade-in font-sans" }, _attrs))}><div class="bg-white border border-gray-200"><div class="flex items-center gap-3 px-5 md:px-6 py-5 border-b border-gray-100"><span class="w-1 h-5 bg-brand inline-block flex-shrink-0"></span><h2 class="text-sm font-bold tracking-[0.2em] text-gray-900 uppercase font-sans">Spôsob dopravy</h2></div><div class="p-5">`);
      if (!__props.shippingMethods?.length) {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(3, (i) => {
          _push(`<div class="h-[72px] bg-gray-50 border border-gray-100 animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(__props.shippingMethods, (method) => {
          _push(`<label class="${ssrRenderClass([__props.shippingMethod === method.id ? "border-brand bg-brand/[0.03]" : "border-gray-100 hover:border-gray-300", "flex items-center p-4 border-2 cursor-pointer transition-colors duration-200 select-none"])}"><input type="radio" name="shipping-method"${ssrRenderAttr("value", method.id)} class="sr-only"${ssrIncludeBooleanAttr(__props.shippingMethod === method.id) ? " checked" : ""}><div class="${ssrRenderClass([__props.shippingMethod === method.id ? "border-brand/30 bg-brand/5" : "border-gray-100 bg-gray-50", "w-10 h-10 border flex items-center justify-center mr-4 flex-shrink-0 transition-colors duration-200"])}">`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(getShippingIcon(method)), {
            class: ["w-5 h-5", __props.shippingMethod === method.id ? "text-brand" : "text-gray-400"]
          }, null), _parent);
          _push(`</div><div class="flex-1 min-w-0"><span class="block font-bold uppercase text-sm tracking-wide text-black">${ssrInterpolate(method.translated?.name || method.name)}</span><span class="text-xs text-gray-400">${ssrInterpolate(method.deliveryTime?.translated?.name || method.deliveryTime?.name)}</span></div><div class="flex items-center gap-3 flex-shrink-0 ml-3"><span class="${ssrRenderClass([getMethodPriceLabel(method).free ? "text-green-600" : "text-black", "font-black font-tech text-sm"])}">${ssrInterpolate(getMethodPriceLabel(method).text)}</span>`);
          _push(ssrRenderComponent(unref(CheckCircle), {
            class: ["w-5 h-5 text-brand transition-opacity duration-200", __props.shippingMethod === method.id ? "opacity-100" : "opacity-0"]
          }, null, _parent));
          _push(`</div></label>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div><div class="bg-white border border-gray-200"><div class="flex items-center gap-3 px-5 md:px-6 py-5 border-b border-gray-100"><span class="w-1 h-5 bg-brand inline-block flex-shrink-0"></span><h2 class="text-sm font-bold tracking-[0.2em] text-gray-900 uppercase font-sans">Spôsob platby</h2></div><div class="p-5">`);
      if (!__props.paymentMethods?.length) {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(3, (i) => {
          _push(`<div class="h-[72px] bg-gray-50 border border-gray-100 animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(__props.paymentMethods, (method) => {
          _push(`<label class="${ssrRenderClass([__props.paymentMethod === method.id ? "border-brand bg-brand/[0.03]" : "border-gray-100 hover:border-gray-300", "flex items-center p-4 border-2 cursor-pointer transition-colors duration-200 select-none"])}"><input type="radio" name="payment-method"${ssrRenderAttr("value", method.id)} class="sr-only"${ssrIncludeBooleanAttr(__props.paymentMethod === method.id) ? " checked" : ""}><div class="${ssrRenderClass([__props.paymentMethod === method.id ? "border-brand/30 bg-brand/5" : "border-gray-100 bg-gray-50", "w-10 h-10 border flex items-center justify-center mr-4 flex-shrink-0 transition-colors duration-200"])}">`);
          _push(ssrRenderComponent(unref(CreditCard), {
            class: ["w-5 h-5", __props.paymentMethod === method.id ? "text-brand" : "text-gray-400"]
          }, null, _parent));
          _push(`</div><div class="flex-1 min-w-0"><span class="block font-bold uppercase text-sm tracking-wide text-black">${ssrInterpolate(method.translated?.name || method.name)}</span><span class="text-xs text-gray-400 line-clamp-1">${ssrInterpolate(method.translated?.description || method.description)}</span></div>`);
          _push(ssrRenderComponent(unref(CheckCircle), {
            class: ["w-5 h-5 text-brand flex-shrink-0 ml-3 transition-opacity duration-200", __props.paymentMethod === method.id ? "opacity-100" : "opacity-0"]
          }, null, _parent));
          _push(`</label>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div><div class="bg-white border border-gray-200 px-5 md:px-8 py-6"><label class="flex items-start gap-3 cursor-pointer group"><div class="relative flex items-center justify-center w-4 h-4 border border-gray-300 group-hover:border-black transition-colors bg-white flex-shrink-0 mt-0.5"><input type="checkbox" class="sr-only"${ssrIncludeBooleanAttr(__props.agreedToTerms) ? " checked" : ""}>`);
      if (__props.agreedToTerms) {
        _push(`<div class="w-2.5 h-2.5 bg-black"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><span class="text-[11px] text-gray-600 font-sans leading-relaxed"> Súhlasím s `);
      _push(ssrRenderComponent(_component_BaseLink, {
        to: "/obchodne-podmienky",
        class: "underline font-bold hover:text-black transition-colors",
        target: "_blank"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`obchodnými podmienkami`);
          } else {
            return [
              createTextVNode("obchodnými podmienkami")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` a so spracovaním `);
      _push(ssrRenderComponent(_component_BaseLink, {
        to: "/ochrana-osobnych-udajov",
        class: "underline font-bold hover:text-black transition-colors",
        target: "_blank"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`osobných údajov`);
          } else {
            return [
              createTextVNode("osobných údajov")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`. </span></label></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart/checkout/ShippingPaymentStep.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ShippingPaymentStep = Object.assign(_sfc_main, { __name: "ShippingPaymentStep" });

export { ShippingPaymentStep as default };
