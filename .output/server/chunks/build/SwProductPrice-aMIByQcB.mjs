import __nuxt_component_0 from './SwSharedPrice-DrqxF5OW.mjs';
import { defineComponent, toRefs, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useCmsTranslations } from './useCmsTranslations-C7n8Bwji.mjs';
import { u as usePrice } from './usePrice-CDJKOx8c.mjs';
import { u as useProductPrice } from './useProductPrice--vjxv0K3.mjs';
import { au as defu } from '../nitro/nitro.mjs';
import './server.mjs';
import 'pinia';
import 'vue-router';
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
import 'node:url';
import '@iconify/utils';
import 'consola';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SwProductPrice",
  __ssrInlineRender: true,
  props: {
    product: {}
  },
  setup(__props) {
    const props = __props;
    let translations = {
      product: {
        amount: "Amount",
        price: {
          label: "Price",
          to: "To",
          from: "From"
        },
        to: "To",
        from: "From"
      }
    };
    translations = defu(useCmsTranslations(), translations);
    const { product } = toRefs(props);
    const { unitPrice, price, tierPrices, isListPrice } = useProductPrice(product);
    const { getFormattedPrice } = usePrice();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwSharedPrice = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (!unref(tierPrices).length) {
        _push(`<div>`);
        if (unref(isListPrice)) {
          _push(ssrRenderComponent(_component_SwSharedPrice, {
            class: "text-1xl text-gray-900 basis-2/6 justify-end line-through",
            value: unref(price)?.listPrice?.price
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(unitPrice)) {
          _push(ssrRenderComponent(_component_SwSharedPrice, {
            class: ["text-3xl text-gray-900 basis-2/6 justify-end", {
              "text-red": unref(isListPrice)
            }],
            value: unref(unitPrice)
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<div><table class="border-collapse table-auto w-full text-sm mb-8"><thead><tr><th class="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-600 dark:text-slate-200 text-left">${ssrInterpolate(unref(translations).product.amount)}</th><th class="border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-600 dark:text-slate-200 text-left">${ssrInterpolate(unref(translations).product.price.label)}</th></tr></thead><tbody class="bg-white dark:bg-slate-800"><!--[-->`);
        ssrRenderList(unref(tierPrices), (tierPrice, index) => {
          _push(`<tr><td class="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 font-medium text-slate-500 dark:text-slate-400">`);
          if (index < unref(tierPrices).length - 1) {
            _push(`<span>${ssrInterpolate(unref(translations).product.price.to)}</span>`);
          } else {
            _push(`<span>${ssrInterpolate(unref(translations).product.price.from)}</span>`);
          }
          _push(` ${ssrInterpolate(tierPrice.quantity)}</td><td class="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 font-medium text-current-500 dark:text-slate-400">${ssrInterpolate(unref(getFormattedPrice)(tierPrice.unitPrice))}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwProductPrice.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SwProductPrice = Object.assign(_sfc_main, { __name: "SwProductPrice" });

export { SwProductPrice as default };
