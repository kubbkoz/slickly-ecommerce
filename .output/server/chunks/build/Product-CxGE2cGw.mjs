import { _ as __nuxt_component_2 } from './NuxtImg-BPLMxRzm.mjs';
import __nuxt_component_3$1 from './Price-D7PucwgC.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { getSmallestThumbnailUrl } from '@shopware/helpers';
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

const ELEMENT_WIDTH = 100;
const ELEMENT_HEIGHT = 100;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Product",
  __ssrInlineRender: true,
  props: {
    lineItem: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_2;
      const _component_SharedPrice = __nuxt_component_3$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex gap-4 p-4" }, _attrs))}><div class="overflow-hidden">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: unref(getSmallestThumbnailUrl)(__props.lineItem.cover),
        alt: `${__props.lineItem.label} item`,
        fit: "inside",
        class: "object-cover",
        style: `height: ${ELEMENT_HEIGHT}px; width: ${ELEMENT_WIDTH}px;`
      }, null, _parent));
      _push(`</div><div class="flex-1 flex flex-col justify-between"><div><h3 class="text-surface-on-surface mb-2">${ssrInterpolate(__props.lineItem.label)}</h3></div><div class="mt-auto">`);
      if (__props.lineItem.unitPrice) {
        _push(ssrRenderComponent(_component_SharedPrice, {
          value: __props.lineItem.unitPrice,
          class: "text-surface-on-surface"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/account/order/Product.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main, { __name: "AccountOrderProduct" });

export { __nuxt_component_3 as default };
