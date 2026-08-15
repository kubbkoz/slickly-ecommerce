import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, computed, mergeProps, withCtx, renderSlot, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot, ssrRenderAttrs } from 'vue/server-renderer';
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
  __name: "BaseButton",
  __ssrInlineRender: true,
  props: {
    variant: {},
    size: {},
    block: { type: Boolean },
    disabled: { type: Boolean },
    to: {},
    type: {}
  },
  setup(__props) {
    const props = __props;
    const variantClasses = computed(() => {
      switch (props.variant) {
        case "primary":
          return "bg-amber text-black hover:bg-amber-dark border border-amber";
        case "secondary":
          return "btn-secondary border border-transparent shadow-sm px-6 py-3";
        case "outline":
          return "bg-transparent text-white border border-white hover:bg-white hover:text-black";
        case "brand-outline":
          return "bg-transparent text-brand border border-brand hover:bg-brand hover:text-white";
        case "ghost":
          return "bg-transparent text-black hover:bg-gray-100 border border-transparent";
        case "white":
          return "bg-white text-black hover:bg-gray-100 border border-white";
        default:
          return "bg-amber text-black hover:bg-amber-dark border border-amber";
      }
    });
    const sizeClasses = computed(() => {
      switch (props.size) {
        case "sm":
          return "px-4 py-2 text-xs";
        case "lg":
          return "px-8 py-4 text-base";
        default:
          return "px-6 py-3 text-sm";
      }
    });
    const baseClasses = computed(() => [
      "inline-flex items-center justify-center font-bold uppercase tracking-widest transition-colors duration-300 rounded-default disabled:opacity-50 disabled:cursor-not-allowed",
      variantClasses.value,
      sizeClasses.value,
      props.block ? "w-full" : ""
    ].join(" "));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      if (__props.to && !__props.disabled) {
        _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
          to: __props.to,
          class: baseClasses.value
        }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "default")
              ];
            }
          }),
          _: 3
        }, _parent));
      } else {
        _push(`<button${ssrRenderAttrs(mergeProps({
          type: __props.type || "button",
          class: baseClasses.value,
          disabled: __props.disabled
        }, _attrs))}>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</button>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/BaseButton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BaseButton = Object.assign(_sfc_main, { __name: "BaseButton" });

export { BaseButton as default };
