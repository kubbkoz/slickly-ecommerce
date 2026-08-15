import __nuxt_component_0$1 from './ChevronIcon-Aj1t6zS4.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderClass } from 'vue/server-renderer';
import { u as useCmsTranslations } from './useCmsTranslations-C7n8Bwji.mjs';
import { au as defu } from '../nitro/nitro.mjs';
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
import '@shopware/helpers';
import './server.mjs';
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
  __name: "SwPagination",
  __ssrInlineRender: true,
  props: {
    total: {},
    current: {}
  },
  emits: ["changePage"],
  setup(__props) {
    let translations = {
      listing: {
        previous: "Previous",
        next: "Next"
      }
    };
    translations = defu(useCmsTranslations(), translations);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwChevronIcon = __nuxt_component_0$1;
      _push(`<nav${ssrRenderAttrs(mergeProps({
        class: "relative z-0 inline-flex rounded-md shadow-sm space-x-px",
        "aria-label": "Pagination"
      }, _attrs))}>`);
      if (__props.current - 1 >= 2) {
        _push(`<button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50"><span class="sr-only">${ssrInterpolate(unref(translations).listing.previous)}</span>`);
        _push(ssrRenderComponent(_component_SwChevronIcon, {
          direction: "left",
          size: 20
        }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.current > 2) {
        _push(`<button class="bg-white border-secondary-300 text-secondary-500 hover:bg-secondary-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"><span class="sr-only">Page </span>1 </button>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.current - 1 > 2) {
        _push(`<span class="relative inline-flex items-center px-4 py-2 border border-secondary-300 bg-white text-sm font-medium text-secondary-700"> ... </span>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.current > 1) {
        _push(`<button class="${ssrRenderClass([[__props.current == 2 ? "rounded-l-md border border-secondary-300" : ""], "bg-white border-secondary-300 text-secondary-500 hover:bg-secondary-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"])}"><span class="sr-only">Page </span>${ssrInterpolate(__props.current - 1)}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button aria-current="page" class="${ssrRenderClass([[
        __props.current - 1 >= 1 ? "" : "rounded-l-md border border-secondary-300",
        __props.total == __props.current ? "rounded-r-md border border-secondary-300" : ""
      ], "bg-surface-surface-primary border-brand-primary text-brand-primary relative inline-flex items-center px-4 py-2 border text-sm font-medium"])}"><span class="sr-only">Page </span>${ssrInterpolate(__props.current)}</button>`);
      if (__props.current < __props.total) {
        _push(`<button class="${ssrRenderClass([[
          __props.total == __props.current + 1 ? "rounded-r-md border border-secondary-300" : ""
        ], "bg-white border-secondary-300 text-secondary-500 hover:bg-secondary-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"])}"><span class="sr-only">Page </span>${ssrInterpolate(__props.current + 1)}</button>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.total - __props.current > 2) {
        _push(`<span class="relative inline-flex items-center px-4 py-2 border border-secondary-300 bg-white text-sm font-medium text-secondary-700"> ... </span>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.total - __props.current > 1) {
        _push(`<button class="bg-white border-secondary-300 text-secondary-500 hover:bg-secondary-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">${ssrInterpolate(__props.total)}</button>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.total > __props.current + 1) {
        _push(`<button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50"><span class="sr-only">${ssrInterpolate(unref(translations).listing.next)}</span>`);
        _push(ssrRenderComponent(_component_SwChevronIcon, {
          direction: "right",
          size: 20
        }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</nav>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwPagination.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "SwPagination" });

export { __nuxt_component_0 as default };
