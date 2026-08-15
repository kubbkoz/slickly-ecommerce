import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { ChevronUp, ChevronDown } from 'lucide-vue-next';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "QuantitySelector",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    min: { default: 1 },
    max: {},
    size: { default: "md" }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["flex items-center bg-gray-100/50 relative group border border-transparent hover:border-gray-200 transition-colors rounded-default", [
          __props.size === "sm" ? "h-11 min-w-[4.5rem] px-3" : "h-14 min-w-[5rem] px-4"
        ]],
        role: "group",
        "aria-label": "Nastavenie množstva"
      }, _attrs))} data-v-0dde71d8><input type="number" inputmode="numeric"${ssrRenderAttr("min", __props.min)}${ssrRenderAttr("max", __props.max)}${ssrRenderAttr("value", __props.modelValue)} class="${ssrRenderClass([[
        __props.size === "sm" ? "text-lg max-w-[2.5rem]" : "text-xl max-w-[3rem]"
      ], "flex-1 min-w-0 text-left font-tech font-black text-black bg-transparent border-none p-0 focus:ring-0 focus:outline-none hide-arrows"])}" role="spinbutton" aria-live="polite" aria-label="Zadať množstvo" data-v-0dde71d8><div class="flex flex-col h-full justify-center -mr-1" data-v-0dde71d8><button class="p-0.5 text-gray-400 hover:text-brand transition-colors" aria-label="Zvýšiť množstvo" data-v-0dde71d8>`);
      _push(ssrRenderComponent(unref(ChevronUp), {
        class: __props.size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"
      }, null, _parent));
      _push(`</button><button class="p-0.5 text-gray-400 hover:text-brand transition-colors" aria-label="Znížiť množstvo" data-v-0dde71d8>`);
      _push(ssrRenderComponent(unref(ChevronDown), {
        class: __props.size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"
      }, null, _parent));
      _push(`</button></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/QuantitySelector.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-0dde71d8"]]), { __name: "QuantitySelector" });

export { __nuxt_component_1 as default };
