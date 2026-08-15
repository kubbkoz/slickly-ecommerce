import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import __nuxt_component_3$1 from './Price-D7PucwgC.mjs';
import { defineComponent, toRefs, useTemplateRef, computed, resolveComponent, mergeProps, unref, withCtx, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { getSmallestThumbnailUrl, getTranslatedProperty } from '@shopware/helpers';
import { u as useProductPrice } from './useProductPrice--vjxv0K3.mjs';
import { a as useElementSize } from './index-B6MI764M.mjs';
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
import './server.mjs';
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

const DEFAULT_THUMBNAIL_SIZE = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Suggest",
  __ssrInlineRender: true,
  props: {
    product: {}
  },
  setup(__props) {
    const props = __props;
    const { product } = toRefs(props);
    const { unitPrice, displayFrom } = useProductPrice(product);
    const imageElement = useTemplateRef("imageElement");
    const { width, height } = useElementSize(imageElement);
    function roundUp(num) {
      return num ? Math.ceil(num / 100) * 100 : DEFAULT_THUMBNAIL_SIZE;
    }
    const srcPath = computed(() => {
      const biggestParam = width.value > height.value ? `width=${roundUp(width.value)}` : `height=${roundUp(height.value)}`;
      return `${getSmallestThumbnailUrl(
        product.value.cover?.media
      )}?${biggestParam}&fit=crop,smart`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_2;
      const _component_SharedPrice = __nuxt_component_3$1;
      const _component_ProductUnits = resolveComponent("ProductUnits");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-3 h-14 text-sm flex items-center gap-3 hover:bg-surface-surface-container cursor-pointer transition duration-300 bg-surface-surface" }, _attrs))}><div class="rounded-md border-1 border-outline-outline-variant overflow-hidden flex-none">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        ref_key: "imageElement",
        ref: imageElement,
        loading: "lazy",
        "data-testid": "layout-search-suggest-image",
        src: unref(srcPath),
        class: "h-8 w-8 object-cover",
        alt: "Product image"
      }, null, _parent));
      _push(`</div><div class="flex items-center justify-between overflow-hidden gap-5 grow"><div data-testid="layout-search-suggest-name" class="text-surface-on-surface-variant whitespace-nowrap overflow-hidden text-ellipsis">${ssrInterpolate(unref(getTranslatedProperty)(unref(product), "name"))}</div><div class="flex-none text-right">`);
      if (unref(unitPrice)) {
        _push(ssrRenderComponent(_component_SharedPrice, {
          "data-testid": "layout-search-suggest-price",
          class: "justify-end",
          value: unref(unitPrice)
        }, {
          beforePrice: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(displayFrom)) {
                _push2(`<span${_scopeId}>${ssrInterpolate(_ctx.$t("product.price.from"))}</span>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                unref(displayFrom) ? (openBlock(), createBlock("span", { key: 0 }, toDisplayString(_ctx.$t("product.price.from")), 1)) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_ProductUnits, {
        "data-testid": "layout-search-suggest-units",
        product: unref(product),
        "show-content": false,
        class: "text-3"
      }, null, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/search/Suggest.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main, { __name: "SearchSuggest" });

export { __nuxt_component_3 as default };
