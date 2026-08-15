import __nuxt_component_3 from './Price-D7PucwgC.mjs';
import { defineComponent, computed, unref, useSSRContext } from 'vue';
import { ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { getSmallestThumbnailUrl, getMedia } from '@shopware/helpers';
import { u as useOrderDetails } from './useOrderDetails-CE2XJ7gX.mjs';
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
import 'js-cookie';
import 'lucide-vue-next';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './useDefaultOrderAssociations-WycTFxJ-.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LineItemProduct",
  __ssrInlineRender: true,
  props: {
    lineItem: {}
  },
  setup(__props) {
    const props = __props;
    const { getMediaFile } = useOrderDetails(props.lineItem.orderId);
    const isDigital = computed(
      () => !!props.lineItem.states?.includes("is-download")
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedPrice = __nuxt_component_3;
      _push(`<!--[--><div class="flex flex-col sm:flex-row sm:grid grid-cols-5 gap-y-1 sm:gap-y-10 gap-x-1 py-4 border-t border-outline-outline text-surface-on-surface sm:items-center"><div class="sm:flex items-center sm:items-center col-span-2 text-surface-on-surface"><div class="w-full sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-md mr-2"><img${ssrRenderAttr("src", unref(getSmallestThumbnailUrl)(__props.lineItem.cover))}${ssrRenderAttr("alt", __props.lineItem.label)} class="h-full w-full object-cover object-center"></div><div class="my-5 text-start">${ssrInterpolate(__props.lineItem.label)} `);
      if (unref(isDigital)) {
        _push(`<span data-testid="cart-product-digital-label" class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">${ssrInterpolate(_ctx.$t("cart.digital"))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="flex justify-between"><div class="sm:hidden">${ssrInterpolate(_ctx.$t("account.order.quantity"))}</div><div>${ssrInterpolate(__props.lineItem.quantity)}</div></div>`);
      if (__props.lineItem.unitPrice) {
        _push(`<div class="flex justify-between"><div class="sm:hidden">${ssrInterpolate(_ctx.$t("account.order.price"))}</div>`);
        _push(ssrRenderComponent(_component_SharedPrice, {
          value: __props.lineItem.unitPrice,
          class: "text-surface-on-surface font-normal",
          "data-testid": "order-item-unitprice"
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
          "data-testid": "order-item-totalprice"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><!--[-->`);
      ssrRenderList(unref(getMedia)(__props.lineItem), (media) => {
        _push(`<!--[-->`);
        if (media.accessGranted) {
          _push(`<div class="flex gap-2 cursor-pointer pl-5 pb-3 hover:text-primary-500"><div class="w-5 h-5 i-carbon-download"></div> ${ssrInterpolate(media.fileName)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/account/order/LineItemProduct.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const LineItemProduct = Object.assign(_sfc_main, { __name: "AccountOrderLineItemProduct" });

export { LineItemProduct as default };
