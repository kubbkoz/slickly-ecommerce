import __nuxt_component_0$1 from './ChevronIcon-Aj1t6zS4.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import './NuxtImg-BPLMxRzm.mjs';
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
import '@shopware/helpers';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Pagination",
  __ssrInlineRender: true,
  props: {
    total: {},
    current: {}
  },
  emits: ["changePage"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwChevronIcon = __nuxt_component_0$1;
      _push(`<nav${ssrRenderAttrs(mergeProps({
        class: "relative z-0 inline-flex rounded-md shadow-sm space-x-px",
        "aria-label": _ctx.$t("layout.ariaLabels.pagination")
      }, _attrs))}>`);
      if (__props.current - 1 >= 2) {
        _push(`<button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-outline-outline-variant bg-white text-sm outline outline-1 outline-offset-[-1px] outline-outline-outline-variant">`);
        _push(ssrRenderComponent(_component_SwChevronIcon, {
          direction: "left",
          size: 20
        }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.current > 2) {
        _push(`<button class="bg-white border-outline-outline-variant relative inline-flex items-center px-4 py-2 border text-sm outline outline-1 outline-offset-[-1px] outline-outline-outline-variant"> 1 </button>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.current - 1 > 2) {
        _push(`<span class="relative inline-flex items-center px-4 py-2 border border-outline-outline-variant bg-white text-sm outline outline-1 outline-offset-[-1px] outline-outline-outline-variant"> ... </span>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.current > 1) {
        _push(`<button class="${ssrRenderClass([[
          __props.current == 2 ? "rounded-l-md border border-outline-outline-variant" : ""
        ], "bg-white border-outline-outline-variant relative inline-flex items-center px-4 py-2 border text-sm outline outline-1 outline-offset-[-1px] outline-outline-outline-variant"])}">${ssrInterpolate(__props.current - 1)}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button aria-current="page" class="${ssrRenderClass([[
        __props.current - 1 >= 1 ? "" : "rounded-l-md border border-outline-outline-variant",
        __props.total == __props.current ? "rounded-r-md border border-outline-outline-variant" : ""
      ], "bg-brand-primary text-brand-on-primary relative inline-flex items-center px-4 py-2 border text-sm"])}">${ssrInterpolate(__props.current)}</button>`);
      if (__props.current < __props.total) {
        _push(`<button class="${ssrRenderClass([[
          __props.total == __props.current + 1 ? "rounded-r-md border border-outline-outline-variant" : ""
        ], "bg-white border-outline-outline-variant relative inline-flex items-center px-4 py-2 border text-sm"])}">${ssrInterpolate(__props.current + 1)}</button>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.total - __props.current > 2) {
        _push(`<span class="relative inline-flex items-center px-4 py-2 border border-outline-outline-variant bg-white text-sm"> ... </span>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.total - __props.current > 1) {
        _push(`<button class="bg-white border-outline-outline-variant relative inline-flex items-center px-4 py-2 border text-sm">${ssrInterpolate(__props.total)}</button>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.total > __props.current + 1) {
        _push(`<button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-outline-outline-variant bg-white text-sm">`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/shared/Pagination.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "SharedPagination" });

export { __nuxt_component_0 as default };
