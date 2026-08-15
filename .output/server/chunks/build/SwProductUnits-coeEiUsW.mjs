import __nuxt_component_0 from './SwSharedPrice-DrqxF5OW.mjs';
import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { u as useCmsTranslations } from './useCmsTranslations-C7n8Bwji.mjs';
import { au as defu } from '../nitro/nitro.mjs';
import './usePrice-CDJKOx8c.mjs';
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
  __name: "SwProductUnits",
  __ssrInlineRender: true,
  props: {
    product: {},
    showContent: { type: Boolean, default: true }
  },
  setup(__props) {
    let translations = {
      product: {
        content: "Content"
      }
    };
    translations = defu(useCmsTranslations(), translations);
    const purchaseUnit = computed(() => __props.product?.purchaseUnit);
    const unitName = computed(() => __props.product?.unit?.translated.name);
    const referencePrice = computed(
      () => __props.product?.calculatedPrice?.referencePrice?.price
    );
    const referenceUnit = computed(
      () => __props.product?.calculatedPrice?.referencePrice?.referenceUnit
    );
    const referenceUnitName = computed(
      () => __props.product?.calculatedPrice?.referencePrice?.unitName
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwSharedPrice = __nuxt_component_0;
      if (purchaseUnit.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex text-gray-500 justify-end gap-1" }, _attrs))}>`);
        if (__props.showContent) {
          _push(`<!--[-->${ssrInterpolate(unref(translations).product.content)}: ${ssrInterpolate(purchaseUnit.value)} ${ssrInterpolate(unitName.value)}<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        if (referencePrice.value) {
          _push(`<!--[--> (`);
          _push(ssrRenderComponent(_component_SwSharedPrice, { value: referencePrice.value }, null, _parent));
          _push(` / ${ssrInterpolate(referenceUnit.value)} ${ssrInterpolate(referenceUnitName.value)} ) <!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwProductUnits.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SwProductUnits = Object.assign(_sfc_main, { __name: "SwProductUnits" });

export { SwProductUnits as default };
