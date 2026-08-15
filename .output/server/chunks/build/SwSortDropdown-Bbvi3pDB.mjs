import __nuxt_component_2$1 from './BaseButton-D0eElC8N.mjs';
import __nuxt_component_0 from './ChevronIcon-Aj1t6zS4.mjs';
import { defineComponent, ref, useTemplateRef, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
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
  __name: "SwSortDropdown",
  __ssrInlineRender: true,
  props: {
    sortOptions: {},
    currentSort: {},
    label: {}
  },
  emits: ["sort-change"],
  setup(__props, { emit: __emit }) {
    const isSortMenuOpen = ref(false);
    const dropdownElement = useTemplateRef("dropdownElement");
    onClickOutside(dropdownElement, () => {
      isSortMenuOpen.value = false;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SwBaseButton = __nuxt_component_2$1;
      const _component_SwChevronIcon = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "dropdownElement",
        ref: dropdownElement,
        class: "flex items-center"
      }, _attrs))}><div class="relative inline-block text-left">`);
      _push(ssrRenderComponent(_component_SwBaseButton, {
        variant: "ghost",
        size: "medium",
        type: "button",
        onClick: ($event) => isSortMenuOpen.value = !isSortMenuOpen.value,
        id: "menu-button",
        "aria-expanded": isSortMenuOpen.value,
        "aria-haspopup": "true",
        class: "group pr-0"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="inline-flex items-center gap-1"${_scopeId}>${ssrInterpolate(__props.label)} `);
            _push2(ssrRenderComponent(_component_SwChevronIcon, {
              direction: isSortMenuOpen.value ? "up" : "down",
              size: 24,
              "aria-hidden": "true",
              focusable: "false"
            }, null, _parent2, _scopeId));
            _push2(`</span>`);
          } else {
            return [
              createVNode("span", { class: "inline-flex items-center gap-1" }, [
                createTextVNode(toDisplayString(__props.label) + " ", 1),
                createVNode(_component_SwChevronIcon, {
                  direction: isSortMenuOpen.value ? "up" : "down",
                  size: 24,
                  "aria-hidden": "true",
                  focusable: "false"
                }, null, 8, ["direction"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="${ssrRenderClass([[isSortMenuOpen.value ? "absolute" : "hidden"], "origin-top-right right-0 mt-2 w-40 rounded-md shadow-2xl bg-surface-surface ring-1 ring-outline-outline-variant focus:outline-none z-50"])}" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1"><div class="py-1" role="none"><!--[-->`);
      ssrRenderList(__props.sortOptions, (sorting) => {
        _push(`<button class="${ssrRenderClass([[
          sorting.key === __props.currentSort ? "font-medium text-surface-on-surface" : "text-surface-on-surface-variant"
        ], "block w-full text-left px-4 py-2 text-sm bg-transparent hover:bg-surface-surface-container"])}" role="menuitem" tabindex="-1">${ssrInterpolate(sorting.translated?.label)}</button>`);
      });
      _push(`<!--]--></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwSortDropdown.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "SwSortDropdown" });

export { __nuxt_component_2 as default };
