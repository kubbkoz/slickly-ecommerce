import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
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

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "inline-flex flex-col items-start justify-start self-stretch overflow-hidden p-px w-full",
    "aria-hidden": "true"
  }, _attrs))}><div class="relative flex h-80 flex-col items-start justify-start self-stretch overflow-hidden"><div class="relative h-80 w-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div><div class="absolute top-[281px] left-2 inline-flex items-center justify-center rounded bg-gray-300 dark:bg-gray-600 px-3 py-1 animate-pulse"><span class="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded block"></span></div><div class="absolute top-4 right-4 h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div></div><div class="flex flex-col items-start justify-start gap-4 self-stretch p-2"><div class="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div><div class="w-full"><div class="h-7 w-3/4 rounded bg-gray-200 dark:bg-gray-700 mb-2 animate-pulse"></div><div class="h-7 w-1/2 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div></div><div class="h-6 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div><div class="flex w-full gap-3"><div class="flex-1 h-10 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div><div class="w-24 h-10 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwProductCardSkeleton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "SwProductCardSkeleton" });

export { __nuxt_component_1 as default };
