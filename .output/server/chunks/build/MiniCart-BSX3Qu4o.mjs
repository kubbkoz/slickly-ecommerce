import __nuxt_component_0 from './IconButton-C-Xi6SDN.mjs';
import __nuxt_component_1 from './index-DKA3nfTy.mjs';
import __nuxt_component_2 from './ProductTile-BB2m7r-T.mjs';
import __nuxt_component_3 from './Price-D7PucwgC.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, useTemplateRef, watch, mergeProps, withCtx, createVNode, unref, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { o as onClickOutside } from './index-B6MI764M.mjs';
import { b as useLocalePath, M as useInternationalization, a as useCart } from './server.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
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
import '@shopware/api-client';
import '@shopware/helpers';
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
import './QuantitySelect-CmcRrO8d.mjs';
import './LinkButton-CTjOSiub.mjs';
import './usePrice-CDJKOx8c.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MiniCart",
  __ssrInlineRender: true,
  emits: ["closeMiniCart"],
  setup(__props, { emit: __emit }) {
    const localePath = useLocalePath();
    const { formatLink } = useInternationalization(localePath);
    const { cartItems, subtotal, removeItemById } = useCart();
    const emit = __emit;
    const miniCartContainer = useTemplateRef("miniCartContainer");
    function handleCloseMiniCart() {
      emit("closeMiniCart");
    }
    function handleRemoveItem(itemId) {
      removeItemById(itemId);
    }
    watch(cartItems, () => {
      if (cartItems.value.length === 0) {
        handleCloseMiniCart();
      }
    });
    onClickOutside(miniCartContainer, () => {
      handleCloseMiniCart();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormIconButton = __nuxt_component_0;
      const _component_Icon = __nuxt_component_1;
      const _component_CheckoutProductTile = __nuxt_component_2;
      const _component_SharedPrice = __nuxt_component_3;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "miniCartContainer",
        ref: miniCartContainer,
        class: "z-20 max-w-[500px] w-full"
      }, _attrs))}><div class="px-6 pt-4 pb-3 border bg-surface-surface flex items-center justify-between"><div class="text-surface-on-surface text-2xl font-normal font-[&#39;Noto_Serif&#39;] leading-9">${ssrInterpolate(_ctx.$t("cart.miniCart.title"))}</div>`);
      _push(ssrRenderComponent(_component_FormIconButton, {
        type: "ghost",
        onClick: handleCloseMiniCart
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "shopware:times-s",
              class: "w-3 h-3"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Icon, {
                name: "shopware:times-s",
                class: "w-3 h-3"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="px-6 py-3 border border-t-0 bg-surface-surface divide-y divide-surface-outline max-h-[365px] overflow-y-auto"><!--[-->`);
      ssrRenderList(unref(cartItems), (item) => {
        _push(ssrRenderComponent(_component_CheckoutProductTile, {
          key: item.id,
          item,
          class: "py-8 first:pt-3",
          onRemove: handleRemoveItem
        }, null, _parent));
      });
      _push(`<!--]--></div><div class="px-6 py-3 border border-t-0 bg-surface-surface-container-low"><div class="flex items-center justify-between mb-2"><div class="text-surface-on-surface">${ssrInterpolate(_ctx.$t("cart.miniCart.subtotal"))}</div>`);
      _push(ssrRenderComponent(_component_SharedPrice, {
        class: "text-surface-on-surface font-bold leading-6",
        value: unref(subtotal)
      }, null, _parent));
      _push(`</div><div class="text-right text-surface-on-surface-variant leading-6 mb-6">${ssrInterpolate(_ctx.$t("cart.miniCart.taxEstimation"))}</div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(formatLink)("/checkout"),
        class: "bg-brand-primary text-brand-on-primary block text-center font-bold leading-6 py-1.5 rounded-md mb-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.$t("cart.miniCart.proceedToCheckout"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.$t("cart.miniCart.proceedToCheckout")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(formatLink)("/checkout/cart"),
        class: "bg-brand-secondary text-brand-on-secondary block text-center font-bold leading-6 py-1.5 rounded-md"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.$t("cart.miniCart.goToShoppingCart"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.$t("cart.miniCart.goToShoppingCart")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/layout/MiniCart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const MiniCart = Object.assign(_sfc_main, { __name: "LayoutMiniCart" });

export { MiniCart as default };
