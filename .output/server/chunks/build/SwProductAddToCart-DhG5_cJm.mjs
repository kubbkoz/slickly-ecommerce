import __nuxt_component_0 from './SwQuantitySelect-0TylgMz1.mjs';
import __nuxt_component_1 from './SwStockInfo-DAPML143.mjs';
import __nuxt_component_2$1 from './BaseButton-D0eElC8N.mjs';
import { defineComponent, toRefs, computed, mergeProps, unref, isRef, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { getCmsTranslate } from '@shopware/helpers';
import { u as useAddToCart, a as useCartErrorParamsResolver } from './useCartErrorParamsResolver-QJw2wqGf.mjs';
import { u as useCmsTranslations } from './useCmsTranslations-C7n8Bwji.mjs';
import { K as useNotifications } from './server.mjs';
import { u as useCartNotification } from './useCartNotification-Bl0gSIu9.mjs';
import { au as defu } from '../nitro/nitro.mjs';
import 'pinia';
import 'vue-router';
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
  __name: "SwProductAddToCart",
  __ssrInlineRender: true,
  props: {
    product: {}
  },
  setup(__props) {
    const { pushSuccess, pushError } = useNotifications();
    const { getErrorsCodes } = useCartNotification();
    const { resolveCartError } = useCartErrorParamsResolver();
    const props = __props;
    let translations = {
      product: {
        addedToCart: "has been added to cart.",
        qty: "Qty",
        addToCart: "Add to cart",
        productNumber: "Product number"
      },
      errors: {
        "product-stock-reached": "The product {name} is only available {quantity} times"
      }
    };
    translations = defu(useCmsTranslations(), translations);
    const { product } = toRefs(props);
    const { addToCart, quantity } = useAddToCart(product);
    const availableStock = computed(() => product.value?.availableStock ?? 0);
    const minPurchase = computed(() => product.value?.minPurchase ?? 0);
    const deliveryTime = computed(() => product.value?.deliveryTime);
    const restockTime = computed(() => product.value?.restockTime);
    const productNumber = computed(() => product.value?.productNumber ?? "");
    const addToCartProxy = async () => {
      await addToCart();
      const errors = getErrorsCodes();
      for (const element of errors) {
        const { messageKey, params } = resolveCartError(element);
        if (translations.errors[messageKey])
          pushError(getCmsTranslate(translations.errors[messageKey], params));
      }
      if (!errors.length)
        pushSuccess(
          `${props.product?.translated.name} ${translations.product.addedToCart}`
        );
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwQuantitySelect = __nuxt_component_0;
      const _component_SwStockInfo = __nuxt_component_1;
      const _component_SwBaseButton = __nuxt_component_2$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full inline-flex flex-col justify-start items-start gap-8" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_SwQuantitySelect, {
        modelValue: unref(quantity),
        "onUpdate:modelValue": ($event) => isRef(quantity) ? quantity.value = $event : null,
        min: unref(product).minPurchase,
        max: unref(product).maxPurchase,
        steps: unref(product).purchaseSteps
      }, null, _parent));
      _push(ssrRenderComponent(_component_SwStockInfo, {
        availableStock: availableStock.value,
        minPurchase: minPurchase.value,
        deliveryTime: deliveryTime.value,
        restockTime: restockTime.value
      }, null, _parent));
      _push(`<div class="self-stretch flex flex-col justify-start items-start gap-1">`);
      _push(ssrRenderComponent(_component_SwBaseButton, {
        variant: "primary",
        size: "medium",
        disabled: !unref(product)?.available,
        block: "",
        "data-testid": "add-to-cart-button",
        onClick: addToCartProxy
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(translations).product.addToCart)}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(translations).product.addToCart), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="self-stretch text-surface-on-surface text-xs font-normal leading-none">${ssrInterpolate(unref(translations).product.productNumber)}: ${ssrInterpolate(productNumber.value)}</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwProductAddToCart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "SwProductAddToCart" });

export { __nuxt_component_2 as default };
