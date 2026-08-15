import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import __nuxt_component_2 from './ProductTile-BB2m7r-T.mjs';
import __nuxt_component_3 from './Price-D7PucwgC.mjs';
import { defineComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { a as useCart, b as useLocalePath, M as useInternationalization } from './server.mjs';
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
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
import '@shopware/helpers';
import './QuantitySelect-CmcRrO8d.mjs';
import './LinkButton-CTjOSiub.mjs';
import './usePrice-CDJKOx8c.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cart",
  __ssrInlineRender: true,
  setup(__props) {
    const { cartItems, subtotal, removeItemById, changeProductQuantity, isEmpty } = useCart();
    const localePath = useLocalePath();
    const { formatLink } = useInternationalization(localePath);
    function handleRemoveItem(id) {
      removeItemById(id);
    }
    function handleUpdateQuantity(id, quantity) {
      changeProductQuantity({ id, quantity });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_CheckoutProductTile = __nuxt_component_2;
      const _component_SharedPrice = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto px-6 sm:px-4" }, _attrs))}><h1 class="text-10 my-10 font-[&#39;Noto_Serif&#39;]">${ssrInterpolate(_ctx.$t("cart.title"))}</h1>`);
      if (unref(isEmpty)) {
        _push(`<div class="flex flex-col items-center justify-center py-20"><p class="text-surface-on-surface text-lg mb-6">${ssrInterpolate(_ctx.$t("cart.emptyCartLabel"))}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(formatLink)("/"),
          class: "bg-brand-primary text-brand-on-primary text-center font-bold leading-6 py-3 px-4 rounded-md"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(_ctx.$t("cart.continueShopping"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(_ctx.$t("cart.continueShopping")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!--[--><ul role="list" class="md:col-span-2 mb-10"><!--[-->`);
        ssrRenderList(unref(cartItems), (cartItem) => {
          _push(`<li class="flex py-6 border-b border-secondary-200">`);
          _push(ssrRenderComponent(_component_CheckoutProductTile, {
            onRemove: handleRemoveItem,
            onUpdateQuantity: handleUpdateQuantity,
            class: "w-full",
            item: cartItem
          }, null, _parent));
          _push(`</li>`);
        });
        _push(`<!--]--></ul><div class="block w-fit ml-auto mb-20"><div class="flex items-center justify-between mb-2"><div class="text-surface-on-surface">${ssrInterpolate(_ctx.$t("cart.miniCart.subtotal"))}</div>`);
        _push(ssrRenderComponent(_component_SharedPrice, {
          class: "text-surface-on-surface font-bold leading-6",
          value: unref(subtotal)
        }, null, _parent));
        _push(`</div><div class="text-right text-surface-on-surface-variant leading-6 mb-6 text-sm">${ssrInterpolate(_ctx.$t("cart.miniCart.taxEstimation"))}</div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(formatLink)("/checkout"),
          class: "bg-brand-primary text-brand-on-primary text-center font-bold leading-6 py-3 px-4 rounded-md mb-2 ml-auto block w-fit"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(_ctx.$t("cart.proceedToCheckout"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(_ctx.$t("cart.proceedToCheckout")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/pages/checkout/cart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
