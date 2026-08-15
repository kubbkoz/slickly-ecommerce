import __nuxt_component_3 from './Price-D7PucwgC.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import './usePrice-CDJKOx8c.mjs';
import './server.mjs';
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
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LineItemCustom",
  __ssrInlineRender: true,
  props: {
    lineItem: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedPrice = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col sm:flex-row sm:grid grid-cols-5 gap-y-3 sm:gap-y-10 gap-x-1 py-4 border-t border-outline-outline text-surface-on-surface sm:items-center" }, _attrs))}><div class="sm:flex items-center col-span-2 text-surface-on-surface"><div class="w-26 i-carbon-image text-3xl text-center align-end"></div><div class="my-5 text-center">${ssrInterpolate(__props.lineItem.label)}</div></div><div class="flex justify-between"><div class="sm:hidden">${ssrInterpolate(_ctx.$t("account.order.quantity"))}</div><div>${ssrInterpolate(__props.lineItem.quantity)}</div></div>`);
      if (__props.lineItem.unitPrice) {
        _push(`<div class="flex justify-between"><div class="sm:hidden">${ssrInterpolate(_ctx.$t("account.order.price"))}</div>`);
        _push(ssrRenderComponent(_component_SharedPrice, {
          value: __props.lineItem.unitPrice,
          class: "text-surface-on-surface font-normal",
          "data-testid": "order-item-custom-unitprice"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.lineItem.totalPrice) {
        _push(`<div class="flex justify-between sm:justify-self-end"><div class="sm:hidden">${ssrInterpolate(_ctx.$t("account.order.subtotal"))}</div>`);
        _push(ssrRenderComponent(_component_SharedPrice, {
          value: __props.lineItem.totalPrice,
          class: "text-surface-on-surface font-normal",
          "data-testid": "order-item-custom-totalprice"
        }, null, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/account/order/LineItemCustom.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const LineItemCustom = Object.assign(_sfc_main, { __name: "AccountOrderLineItemCustom" });

export { LineItemCustom as default };
