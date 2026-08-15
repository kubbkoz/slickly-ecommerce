import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { au as defu } from '../nitro/nitro.mjs';
import { u as useCmsTranslations } from './useCmsTranslations-C7n8Bwji.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SwStockInfo",
  __ssrInlineRender: true,
  props: {
    availableStock: {},
    minPurchase: {},
    deliveryTime: {},
    restockTime: {}
  },
  setup(__props) {
    let translations = {
      product: {
        deliveryTime: "Available, delivery time",
        days: "days",
        noAvailable: "No longer available"
      }
    };
    translations = defu(useCmsTranslations(), translations);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "inline-flex justify-start items-center gap-2" }, _attrs))}>`);
      if (__props.availableStock > 0) {
        _push(`<div class="w-2 h-2 bg-states-success rounded-full"></div>`);
      } else {
        _push(`<div class="w-2 h-2 bg-states-error rounded-full"></div>`);
      }
      if (__props.availableStock >= __props.minPurchase && __props.deliveryTime) {
        _push(`<span>${ssrInterpolate(unref(translations).product.deliveryTime)} ${ssrInterpolate(__props.deliveryTime?.name)}</span>`);
      } else if (__props.availableStock < __props.minPurchase && __props.deliveryTime && __props.restockTime) {
        _push(`<span>${ssrInterpolate(unref(translations).product.deliveryTime)} ${ssrInterpolate(__props.restockTime)} ${ssrInterpolate(unref(translations).product.days)} ${ssrInterpolate(__props.deliveryTime?.name)}</span>`);
      } else {
        _push(`<span>${ssrInterpolate(unref(translations).product.noAvailable)}</span>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwStockInfo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "SwStockInfo" });

export { __nuxt_component_1 as default };
