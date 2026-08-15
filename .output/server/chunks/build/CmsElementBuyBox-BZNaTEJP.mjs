import __nuxt_component_0 from './SwSharedPrice-DrqxF5OW.mjs';
import __nuxt_component_1 from './SwVariantConfigurator-Cjm5WRIH.mjs';
import __nuxt_component_2 from './SwProductAddToCart-DhG5_cJm.mjs';
import { defineComponent, computed, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { u as useCmsElementConfig } from './useCmsElementConfig-DY8wkVjg.mjs';
import { l as useSessionContext } from './server.mjs';
import { u as useCmsTranslations } from './useCmsTranslations-C7n8Bwji.mjs';
import { u as usePrice } from './usePrice-CDJKOx8c.mjs';
import { u as useProduct } from './useProduct-a-4w44J3.mjs';
import { u as useProductPrice } from './useProductPrice--vjxv0K3.mjs';
import { au as defu } from '../nitro/nitro.mjs';
import '@shopware/helpers';
import './useUrlResolver-CibZ14y1.mjs';
import 'vue-router';
import './SwQuantitySelect-0TylgMz1.mjs';
import './SwStockInfo-DAPML143.mjs';
import './BaseButton-D0eElC8N.mjs';
import './useCartErrorParamsResolver-QJw2wqGf.mjs';
import './useCartNotification-Bl0gSIu9.mjs';
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
  __name: "CmsElementBuyBox",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    const props = __props;
    let translations = {
      product: {
        previously: "Previously",
        amount: "Amount",
        price: {
          label: "Price",
          to: "To",
          from: "From"
        },
        to: "To",
        from: "From",
        content: "Content",
        pricesIncl: "Prices incl. VAT plus shipping costs",
        pricesExcl: "Prices excl. VAT plus shipping costs"
      }
    };
    translations = defu(useCmsTranslations(), translations);
    const { getConfigValue } = useCmsElementConfig(props.content);
    const alignment = computed(() => getConfigValue("alignment"));
    const { taxState, currency } = useSessionContext();
    const { product, changeVariant } = useProduct(
      props.content.data.product,
      props.content.data.configuratorSettings || []
    );
    const { unitPrice, price, tierPrices, isListPrice } = useProductPrice(product);
    const regulationPrice = computed(() => price.value?.regulationPrice?.price);
    const { getFormattedPrice } = usePrice();
    const referencePrice = computed(
      () => product.value?.calculatedPrice?.referencePrice
    );
    const purchaseUnit = computed(() => product.value?.purchaseUnit);
    const unitName = computed(() => product.value?.unit?.name);
    const productName = computed(() => product.value?.translated?.name || "");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwSharedPrice = __nuxt_component_0;
      const _component_SwVariantConfigurator = __nuxt_component_1;
      const _component_SwProductAddToCart = __nuxt_component_2;
      if (unref(product)) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: {
            "h-full w-full flex flex-col": true,
            "justify-start": alignment.value === "flex-start",
            "justify-end": alignment.value === "flex-end",
            "justify-center": alignment.value === "center"
          }
        }, _attrs))}><div class="self-stretch inline-flex flex-col justify-start items-start gap-8 mt-4 min-w-0"><div class="md:hidden self-stretch text-surface-on-surface text-4xl font-normal font-serif leading-[60px]">${ssrInterpolate(productName.value)}</div>`);
        if (unref(tierPrices).length <= 1) {
          _push(`<div>`);
          if (unref(isListPrice)) {
            _push(ssrRenderComponent(_component_SwSharedPrice, {
              class: "text-1xl text-secondary-900 basis-2/6 justify-start line-through",
              value: unref(price)?.listPrice?.price
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          if (unref(unitPrice)) {
            _push(ssrRenderComponent(_component_SwSharedPrice, {
              class: ["text-surface-on-surface text-base font-bold leading-normal", {
                "text-red": unref(isListPrice)
              }],
              value: unref(unitPrice)
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          if (regulationPrice.value) {
            _push(`<div class="text-xs flex text-secondary-500">${ssrInterpolate(unref(translations).product.previously)} `);
            _push(ssrRenderComponent(_component_SwSharedPrice, {
              class: "ml-1",
              value: regulationPrice.value
            }, null, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<div><table class="border-collapse table-auto w-full text-sm mb-8"><thead><tr><th class="border-b dark:border-secondary-600 font-medium p-4 pl-8 pt-0 pb-3 text-secondary-600 dark:text-secondary-200 text-left">${ssrInterpolate(unref(translations).product.amount)}</th><th class="border-b dark:border-secondary-600 font-medium p-4 pr-8 pt-0 pb-3 text-secondary-600 dark:text-secondary-200 text-left">${ssrInterpolate(unref(translations).product.price.label)}</th></tr></thead><tbody class="bg-white dark:bg-secondary-800"><!--[-->`);
          ssrRenderList(unref(tierPrices), (tierPrice, index) => {
            _push(`<tr><td class="border-b border-secondary-100 dark:border-secondary-700 p-4 pl-8 font-medium text-secondary-500 dark:text-secondary-400">`);
            if (index < unref(tierPrices).length - 1) {
              _push(`<span>${ssrInterpolate(unref(translations).product.to)}</span>`);
            } else {
              _push(`<span>${ssrInterpolate(unref(translations).product.from)}</span>`);
            }
            _push(` ${ssrInterpolate(tierPrice.quantity)}</td><td class="border-b border-secondary-100 dark:border-secondary-700 p-4 pr-8 font-medium text-current-500 dark:text-secondary-400">${ssrInterpolate(unref(getFormattedPrice)(tierPrice.unitPrice))}</td></tr>`);
          });
          _push(`<!--]--></tbody></table></div>`);
        }
        if (purchaseUnit.value && unitName.value) {
          _push(`<div class="mt-1"><span class="font-light">${ssrInterpolate(unref(translations).product.content)}: </span><span class="font-light">${ssrInterpolate(purchaseUnit.value)} ${ssrInterpolate(unitName.value)}</span>`);
          if (referencePrice.value) {
            _push(`<span class="font-light">${ssrInterpolate(unref(currency)?.symbol)} ${ssrInterpolate(referencePrice.value?.price)} / / ${ssrInterpolate(referencePrice.value?.referenceUnit)} ${ssrInterpolate(referencePrice.value?.unitName)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="text-brand-primary">`);
        if (unref(taxState) === "gross") {
          _push(`<!--[-->${ssrInterpolate(unref(translations).product.pricesIncl)}<!--]-->`);
        } else {
          _push(`<!--[-->${ssrInterpolate(unref(translations).product.pricesExcl)}<!--]-->`);
        }
        _push(`</span>`);
        _push(ssrRenderComponent(_component_SwVariantConfigurator, { onChange: unref(changeVariant) }, null, _parent));
        _push(ssrRenderComponent(_component_SwProductAddToCart, { product: unref(product) }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/element/CmsElementBuyBox.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CmsElementBuyBox = Object.assign(_sfc_main, { __name: "CmsElementBuyBox" });

export { CmsElementBuyBox as default };
