import __nuxt_component_0$1 from './ChevronIcon-Aj1t6zS4.mjs';
import { defineComponent, ref, useTemplateRef, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { o as onClickOutside } from './index-B6MI764M.mjs';
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
  __name: "SwFilterDropdown",
  __ssrInlineRender: true,
  props: {
    label: {},
    isActive: { type: Boolean }
  },
  setup(__props) {
    const isOpen = ref(false);
    const dropdownElement = useTemplateRef("dropdownElement");
    onClickOutside(dropdownElement, () => {
      isOpen.value = false;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwChevronIcon = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "dropdownElement",
        ref: dropdownElement,
        class: "relative"
      }, _attrs))}><button type="button" class="${ssrRenderClass([{ "ring-2 ring-brand-primary": __props.isActive }, "bg-brand-tertiary rounded-full px-4 py-1.5 inline-flex items-center hover:bg-brand-tertiary-hover transition-colors"])}"${ssrRenderAttr("aria-expanded", isOpen.value)} aria-haspopup="true"><div class="py-1 inline-flex items-center gap-1"><span class="text-brand-on-tertiary text-base font-normal leading-6">${ssrInterpolate(__props.label)}</span>`);
      _push(ssrRenderComponent(_component_SwChevronIcon, {
        direction: isOpen.value ? "up" : "down",
        size: 24,
        class: "text-brand-on-tertiary"
      }, null, _parent));
      _push(`</div></button>`);
      if (isOpen.value) {
        _push(`<div class="absolute top-full left-0 mt-2 min-w-64 bg-surface-surface rounded-lg shadow-lg ring-1 ring-outline-outline-variant z-50 p-4" role="menu">`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwFilterDropdown.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "SwFilterDropdown" });

export { __nuxt_component_0 as default };
