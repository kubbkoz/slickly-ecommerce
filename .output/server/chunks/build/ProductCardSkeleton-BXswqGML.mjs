import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';
import { u as useImagePlaceholder } from './useImagePlaceholder-30hLRW4O.mjs';
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
  __name: "ProductCardSkeleton",
  __ssrInlineRender: true,
  setup(__props) {
    const placeholderSvg = useImagePlaceholder();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        role: "status",
        class: "p-px flex flex-col justify-start items-start overflow-hidden"
      }, _attrs))}><div class="self-stretch min-h-[350px] relative flex items-center justify-center overflow-hidden aspect-square animate-pulse"><img${ssrRenderAttr("src", unref(placeholderSvg))} alt="" aria-hidden="true" class="w-full h-full object-cover"></div><div class="w-full pt-4 animate-pulse"><div class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-3/4 mb-3"></div><div class="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-1/2 mb-4"></div><div class="h-5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-3"></div><div class="h-10 bg-gray-200 rounded dark:bg-gray-700 w-full"></div></div><span class="sr-only">Loading...</span></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/public/cms/skeleton/ProductCardSkeleton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "ProductCardSkeleton" });

export { __nuxt_component_1 as default };
