import __nuxt_component_0 from './SwSharedPrice-DrqxF5OW.mjs';
import { defineComponent, toRefs, mergeProps, unref, withCtx, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useCmsTranslations } from './useCmsTranslations-C7n8Bwji.mjs';
import { u as useProductPrice } from './useProductPrice--vjxv0K3.mjs';
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
  __name: "SwListingProductPrice",
  __ssrInlineRender: true,
  props: {
    product: {}
  },
  setup(__props) {
    const props = __props;
    let translations = {
      listing: {
        variantsFrom: "variants from",
        previously: "previously",
        from: "from",
        to: "to"
      }
    };
    translations = defu(useCmsTranslations(), translations);
    const { product } = toRefs(props);
    const {
      price,
      unitPrice,
      displayFromVariants,
      displayFrom,
      isListPrice,
      regulationPrice
    } = useProductPrice(product);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwSharedPrice = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        id: unref(product).id,
        class: "inline-flex justify-start items-center gap-2"
      }, _attrs))}>`);
      if (unref(isListPrice)) {
        _push(`<div class="flex items-center gap-2"><div class="text-base font-bold leading-normal">`);
        _push(ssrRenderComponent(_component_SwSharedPrice, { value: unref(unitPrice) }, {
          beforePrice: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(displayFrom) || unref(displayFromVariants)) {
                _push2(`<span class="text-sm"${_scopeId}>${ssrInterpolate(unref(translations).listing.from)}</span>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                unref(displayFrom) || unref(displayFromVariants) ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "text-sm"
                }, toDisplayString(unref(translations).listing.from), 1)) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="text-surface-on-surface-variant text-sm font-normal leading-tight line-through">`);
        _push(ssrRenderComponent(_component_SwSharedPrice, {
          value: unref(price)?.listPrice?.price
        }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<div class="text-surface-on-surface text-base font-bold leading-normal">`);
        _push(ssrRenderComponent(_component_SwSharedPrice, { value: unref(unitPrice) }, {
          beforePrice: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(displayFrom) || unref(displayFromVariants)) {
                _push2(`<span class="text-sm"${_scopeId}>${ssrInterpolate(unref(translations).listing.from)}</span>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                unref(displayFrom) || unref(displayFromVariants) ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "text-sm"
                }, toDisplayString(unref(translations).listing.from), 1)) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      if (unref(displayFromVariants)) {
        _push(`<div class="text-surface-on-surface text-base font-bold leading-normal">`);
        _push(ssrRenderComponent(_component_SwSharedPrice, { value: unref(displayFromVariants) }, {
          beforePrice: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(displayFromVariants)) {
                _push2(`<span class="text-sm"${_scopeId}>${ssrInterpolate(unref(translations).listing.variantsFrom)}</span>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                unref(displayFromVariants) ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "text-sm"
                }, toDisplayString(unref(translations).listing.variantsFrom), 1)) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(regulationPrice)) {
        _push(`<div class="flex gap-2 text-surface-on-surface-variant text-sm">${ssrInterpolate(unref(translations).listing.previously)} `);
        _push(ssrRenderComponent(_component_SwSharedPrice, { value: unref(regulationPrice) }, null, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwListingProductPrice.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "SwListingProductPrice" });

export { __nuxt_component_1 as default };
