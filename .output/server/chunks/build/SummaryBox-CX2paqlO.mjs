import __nuxt_component_2 from './ProductTile-BB2m7r-T.mjs';
import __nuxt_component_3 from './Price-D7PucwgC.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { a as useCart } from './server.mjs';
import './NuxtImg-BPLMxRzm.mjs';
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
import './QuantitySelect-CmcRrO8d.mjs';
import './LinkButton-CTjOSiub.mjs';
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
import './usePrice-CDJKOx8c.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SummaryBox",
  __ssrInlineRender: true,
  props: {
    cart: {}
  },
  emits: ["remove", "updateQuantity"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const { subtotal, totalPrice, shippingCosts } = useCart();
    function handleRemoveItem(id) {
      emit("remove", id);
    }
    function handleUpdateQuantity(id, quantity) {
      emit("updateQuantity", id, quantity);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CheckoutProductTile = __nuxt_component_2;
      const _component_SharedPrice = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "border border-outline-outline sticky top-2" }, _attrs))}><div class="border-b border-outline-outline-variant"><h2 class="text-10 px-6 font-[&#39;Noto_Serif&#39;]">${ssrInterpolate(_ctx.$t("checkout.summary"))}</h2></div><div class="p-6 pt-10"><div class="divide-y"><!--[-->`);
      ssrRenderList(__props.cart.lineItems, (item) => {
        _push(ssrRenderComponent(_component_CheckoutProductTile, {
          item,
          key: item.id,
          class: "py-4",
          onRemove: (id) => handleRemoveItem(id),
          onUpdateQuantity: (id, quantity) => handleUpdateQuantity(id, quantity)
        }, null, _parent));
      });
      _push(`<!--]--></div><div class="py-4 border-t border-outline-outline-variant flex flex-col gap-1"><div class="flex justify-between"><div class="self-stretch justify-start text-surface-on-surface-variant text-sm font-normal">${ssrInterpolate(_ctx.$t("checkout.subtotal"))}</div>`);
      _push(ssrRenderComponent(_component_SharedPrice, {
        value: unref(subtotal),
        class: "text-surface-on-surface text-sm font-normal",
        "data-testid": "cart-subtotal"
      }, null, _parent));
      _push(`</div><!--[-->`);
      ssrRenderList(unref(shippingCosts), (shippingCost) => {
        _push(`<div class="flex justify-between"><div class="self-stretch justify-start text-surface-on-surface-variant text-sm font-normal">${ssrInterpolate(_ctx.$t("checkout.shippingCosts"))}</div>`);
        if (shippingCost.shippingCosts?.totalPrice) {
          _push(`<div>`);
          _push(ssrRenderComponent(_component_SharedPrice, {
            class: "text-surface-on-surface text-sm font-normal",
            value: shippingCost.shippingCosts.totalPrice
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div><div class="pt-4 border-t border-outline-outline-variant flex justify-between"><div class="self-stretch justify-start text-surface-on-surface text-base font-normal leading-normal">${ssrInterpolate(_ctx.$t("checkout.total"))}</div>`);
      _push(ssrRenderComponent(_component_SharedPrice, {
        value: unref(totalPrice),
        class: "text-right justify-start text-surface-on-surface text-base font-normal leading-normal",
        "data-testid": "cart-subtotal"
      }, null, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/checkout/SummaryBox.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SummaryBox = Object.assign(_sfc_main, { __name: "CheckoutSummaryBox" });

export { SummaryBox as default };
