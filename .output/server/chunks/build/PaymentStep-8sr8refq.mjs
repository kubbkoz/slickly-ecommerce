import __nuxt_component_0 from './SpsPickupPointPicker-BbRa_Lhl.mjs';
import __nuxt_component_0$1 from './BaseLink-CtWKrAdk.mjs';
import { defineComponent, computed, watch, mergeProps, unref, createVNode, resolveDynamicComponent, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderVNode, ssrInterpolate } from 'vue/server-renderer';
import { Truck, CheckCircle, CreditCard, MapPin, HandCoins, Banknote, Smartphone, Coins } from 'lucide-vue-next';
import { b as useLocalePath, a as useCart, i as useRuntimeConfig } from './server.mjs';
import { u as useShippingMetadata } from './useShippingMetadata-C7Eoqyz6.mjs';
import { u as useCountrySelector } from './useCountrySelector-Cujau6dz.mjs';
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
import './useShopwareLanguage-CGPCneCN.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PaymentStep",
  __ssrInlineRender: true,
  props: {
    paymentMethod: {},
    agreedToTerms: { type: Boolean },
    isExpressShipping: { type: Boolean },
    paymentMethods: {},
    shippingMethods: {},
    shippingMethod: {},
    expressProduct: {},
    dobierkaProduct: {},
    shippingAddress: {},
    countries: {},
    pickupPoint: {}
  },
  emits: ["update:paymentMethod", "update:shippingMethod", "update:agreedToTerms", "update:isExpressShipping", "update:pickupPoint"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    useLocalePath();
    const { cartItems } = useCart();
    const config = useRuntimeConfig();
    const { parseMethod } = useShippingMetadata();
    const { adjustPrice } = useCountrySelector();
    const getMethodLogo = (method) => {
      const url = method.media?.url || null;
      if (!url) return null;
      return url;
    };
    const BIKE_CATEGORY_IDS = computed(() => [
      config.public.shopware.ids.categories.bikes,
      config.public.shopware.ids.categories.ebikes
    ].filter(Boolean));
    const hasBikeInCart = computed(
      () => cartItems.value.some(
        (i) => i.payload?.categoryTree?.some((id) => BIKE_CATEGORY_IDS.value.includes(id)) || i.payload?.categoryIds?.some((id) => BIKE_CATEGORY_IDS.value.includes(id))
      )
    );
    const productSubtotal = computed(
      () => cartItems.value.filter((i) => i.type === "product").reduce((sum, i) => sum + (i.price?.totalPrice ?? 0), 0)
    );
    const shippingIds = config.public.shopware.ids.shipping;
    const paymentIds = config.public.shopware.ids.payment;
    const selectedCountryIso = computed(() => {
      const c = props.countries.find((c2) => c2.value === props.shippingAddress.countryId);
      return (c?.iso || "").toUpperCase();
    });
    const SK_ONLY_SHIPPING_IDS = computed(() => [
      shippingIds.balikovo,
      shippingIds.sps,
      shippingIds.osobnyOdber,
      shippingIds.toptrans
    ].filter(Boolean));
    const filteredShippingMethods = computed(() => {
      if (!props.shippingMethods?.length) return [];
      const iso = selectedCountryIso.value;
      return props.shippingMethods.filter((method) => {
        const name = (method.translated?.name || method.name || "").toLowerCase();
        if (hasBikeInCart.value && name.includes("balíkovo")) return false;
        if (method.id === shippingIds.toptransCz) return iso === "CZ";
        if (method.id === shippingIds.toptransPl) return iso === "PL";
        if (SK_ONLY_SHIPPING_IDS.value.includes(method.id)) return iso === "SK" || !iso;
        return true;
      });
    });
    const getMethodPriceLabel = (method) => {
      const meta = parseMethod(method);
      if (meta.freeThreshold !== null && productSubtotal.value >= meta.freeThreshold) {
        return { text: "ZADARMO", free: true };
      }
      if (meta.basePrice !== null && meta.basePrice > 0) {
        return {
          text: new Intl.NumberFormat("sk-SK", { minimumFractionDigits: 2 }).format(meta.basePrice) + " €",
          free: false
        };
      }
      return { text: "ZADARMO", free: true };
    };
    const getDisplayName = (method) => {
      let name = method.translated?.name || method.name || "";
      if (name.toLowerCase().includes("osobný odber")) {
        return name.split(/ v predajni/i)[0] + " v predajni";
      }
      return name;
    };
    const getShippingIcon = (method) => {
      const name = (method.translated?.name || method.name || "").toLowerCase();
      if (name.includes("odber") || name.includes("pickup") || name.includes("personal")) return MapPin;
      return Truck;
    };
    const formatPrice = (price) => new Intl.NumberFormat("sk-SK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
    const getPaymentIcon = (method) => {
      const name = (method.translated?.name || method.name || "").toLowerCase();
      if (name.includes("dobierka") || name.includes("cash") || name.includes("hotovos") || name.includes("platba v") || name.includes("v hotovosti")) return HandCoins;
      if (name.includes("prevod") || name.includes("transfer") || name.includes("bank")) return Banknote;
      if (name.includes("apple") || name.includes("google") || name.includes("pay")) return Smartphone;
      if (name.includes("splátk") || name.includes("quatro") || name.includes("home credit") || name.includes("splat")) return Coins;
      return CreditCard;
    };
    const isPersonalPickup = computed(
      () => props.shippingMethod === shippingIds.osobnyOdber
    );
    const isCourierShipping = computed(
      () => props.shippingMethod === shippingIds.sps || props.shippingMethod === shippingIds.toptrans || props.shippingMethod === shippingIds.toptransCz || props.shippingMethod === shippingIds.toptransPl || props.shippingMethod === shippingIds.balikovo
    );
    const isPaymentDisabled = (method) => {
      if (isPersonalPickup.value && method.id === paymentIds.dobierka) return true;
      if (isCourierShipping.value && method.id === paymentIds.hotovost) return true;
      return false;
    };
    watch(() => props.shippingMethod, () => {
      if (!props.paymentMethod) return;
      const current = props.paymentMethods?.find((m) => m.id === props.paymentMethod);
      if (current && isPaymentDisabled(current)) {
        emit("update:paymentMethod", "");
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SpsPickupPointPicker = __nuxt_component_0;
      const _component_BaseLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4 animate-fade-in font-sans" }, _attrs))}><div class="bg-white border border-gray-200"><div class="flex items-center gap-3 px-5 md:px-6 py-5 border-b border-gray-100 bg-white">`);
      _push(ssrRenderComponent(unref(Truck), {
        class: "w-4 h-4 text-gray-900",
        "stroke-width": 1.8
      }, null, _parent));
      _push(`<h2 class="text-xs font-bold tracking-[0.2em] text-gray-900 font-sans uppercase leading-none">Spôsob dopravy</h2></div><div class="p-5">`);
      if (!__props.shippingMethods?.length) {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(3, (i) => {
          _push(`<div class="h-[72px] bg-gray-50 border border-gray-100 animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(unref(filteredShippingMethods), (method) => {
          _push(`<!--[--><label class="${ssrRenderClass([__props.shippingMethod === method.id ? "border-brand bg-brand/[0.03]" : "border-gray-100 hover:border-gray-300", "flex items-center p-4 border-2 cursor-pointer transition-colors duration-200 select-none"])}"><input type="radio" name="shipping-method"${ssrRenderAttr("value", method.id)} class="sr-only"${ssrIncludeBooleanAttr(__props.shippingMethod === method.id) ? " checked" : ""}><div class="${ssrRenderClass([__props.shippingMethod === method.id ? "border-brand/30 bg-brand/5" : "border-gray-100 bg-gray-50", "w-12 h-10 border flex items-center justify-center mr-4 flex-shrink-0 transition-colors duration-200 overflow-hidden"])}">`);
          if (getMethodLogo(method)) {
            _push(`<img${ssrRenderAttr("src", getMethodLogo(method))}${ssrRenderAttr("alt", getDisplayName(method))} class="w-full h-full object-contain p-1">`);
          } else {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(getShippingIcon(method)), {
              class: ["w-5 h-5", __props.shippingMethod === method.id ? "text-brand" : "text-gray-400"]
            }, null), _parent);
          }
          _push(`</div><div class="flex-1 min-w-0"><span class="block font-bold uppercase text-sm tracking-wide text-black">${ssrInterpolate(getDisplayName(method))}</span><div class="flex flex-col gap-0.5 mt-0.5">`);
          if (method.deliveryTime) {
            _push(`<span class="text-[10px] text-gray-500 font-medium"><span class="text-gray-400">Doručenie:</span> ${ssrInterpolate(method.deliveryTime?.translated?.name || method.deliveryTime?.name)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (method.translated?.description || method.description) {
            _push(`<span class="text-[11px] text-gray-400 leading-tight">${ssrInterpolate(method.translated?.description || method.description)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div class="flex items-center gap-3 flex-shrink-0 ml-3"><span class="${ssrRenderClass([getMethodPriceLabel(method).free ? "text-green-600" : "text-black", "font-black font-tech text-sm"])}">${ssrInterpolate(getMethodPriceLabel(method).text)}</span>`);
          _push(ssrRenderComponent(unref(CheckCircle), {
            class: ["w-5 h-5 text-brand transition-opacity duration-200", __props.shippingMethod === method.id ? "opacity-100" : "opacity-0"]
          }, null, _parent));
          _push(`</div></label>`);
          if (method.id === unref(shippingIds).balikovo && __props.shippingMethod === method.id) {
            _push(`<div class="pl-0 sm:pl-16">`);
            _push(ssrRenderComponent(_component_SpsPickupPointPicker, {
              "model-value": __props.pickupPoint,
              "shipping-address": __props.shippingAddress,
              countries: __props.countries,
              "onUpdate:modelValue": ($event) => emit("update:pickupPoint", $event)
            }, null, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div><div class="bg-white border border-gray-200"><div class="flex items-center gap-3 px-5 md:px-6 py-5 border-b border-gray-100 bg-white">`);
      _push(ssrRenderComponent(unref(CreditCard), {
        class: "w-4 h-4 text-gray-900",
        "stroke-width": 1.8
      }, null, _parent));
      _push(`<h2 class="text-xs font-bold tracking-[0.2em] text-gray-900 font-sans uppercase leading-none">Spôsob platby</h2></div><div class="p-5">`);
      if (!__props.paymentMethods?.length) {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(3, (i) => {
          _push(`<div class="h-[72px] bg-gray-50 border border-gray-100 animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(__props.paymentMethods, (method) => {
          _push(`<label class="${ssrRenderClass([isPaymentDisabled(method) ? "border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed" : __props.paymentMethod === method.id ? "border-brand bg-brand/[0.03] cursor-pointer" : "border-gray-100 hover:border-gray-300 cursor-pointer", "flex items-center p-4 border-2 transition-colors duration-200 select-none"])}"><input type="radio" name="payment-method"${ssrRenderAttr("value", method.id)} class="sr-only"${ssrIncludeBooleanAttr(__props.paymentMethod === method.id) ? " checked" : ""}${ssrIncludeBooleanAttr(isPaymentDisabled(method)) ? " disabled" : ""}><div class="${ssrRenderClass([__props.paymentMethod === method.id ? "border-brand/30 bg-brand/5" : "border-gray-100 bg-gray-50", "w-10 h-10 border flex items-center justify-center mr-4 flex-shrink-0 transition-colors duration-200"])}">`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(getPaymentIcon(method)), {
            class: ["w-5 h-5", __props.paymentMethod === method.id ? "text-brand" : "text-gray-400"]
          }, null), _parent);
          _push(`</div><div class="flex-1 min-w-0"><span class="block font-bold uppercase text-sm tracking-wide text-black">${ssrInterpolate(method.translated?.name || method.name)}</span><span class="text-xs text-gray-400 line-clamp-1">${ssrInterpolate(method.translated?.description || method.description)}</span></div><div class="flex items-center gap-3 flex-shrink-0 ml-3">`);
          if (method.id === unref(paymentIds).dobierka && __props.dobierkaProduct) {
            _push(`<span class="font-black font-tech text-sm text-black">${ssrInterpolate(formatPrice(unref(adjustPrice)(__props.dobierkaProduct?.calculatedPrice?.unitPrice ?? 0)))} € </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(ssrRenderComponent(unref(CheckCircle), {
            class: ["w-5 h-5 text-brand transition-opacity duration-200", __props.paymentMethod === method.id ? "opacity-100" : "opacity-0"]
          }, null, _parent));
          _push(`</div></label>`);
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
      _push(`. * </span></label></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart/checkout/PaymentStep.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "PaymentStep" });

export { __nuxt_component_2 as default };
