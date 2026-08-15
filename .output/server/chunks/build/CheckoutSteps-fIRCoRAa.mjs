import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrRenderComponent, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
import { Check } from 'lucide-vue-next';
import { b as useLocalePath, c as useRouter } from './server.mjs';
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
  __name: "CheckoutSteps",
  __ssrInlineRender: true,
  props: {
    currentStep: {},
    surface: { default: "dark" }
  },
  emits: ["change-step"],
  setup(__props, { emit: __emit }) {
    useLocalePath();
    useRouter();
    const steps = [
      { id: 1, label: "Nákupný košík", path: "/cart" },
      { id: 2, label: "Kontaktné údaje" },
      { id: 3, label: "Doprava a platba" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "select-none flex flex-col items-center" }, _attrs))}><div class="flex items-center"><!--[-->`);
      ssrRenderList(steps, (step, idx) => {
        _push(`<!--[--><div class="${ssrRenderClass([[
          step.id < __props.currentStep || step.id === 1 ? "cursor-pointer hover:opacity-80" : "cursor-default",
          __props.surface === "amber" ? __props.currentStep >= step.id ? "bg-transparent border-black text-black" : "bg-transparent border-black/25 text-black/40" : __props.currentStep >= step.id ? "bg-brand border-brand text-white" : "bg-transparent border-white/25 text-white/40"
        ], "flex items-center justify-center w-7 h-7 font-black font-tech text-xs leading-none transition-all duration-300 border-2 flex-shrink-0"])}">`);
        if (__props.currentStep > step.id) {
          _push(ssrRenderComponent(unref(Check), { class: "w-3.5 h-3.5" }, null, _parent));
        } else {
          _push(`<span>${ssrInterpolate(step.id)}</span>`);
        }
        _push(`</div>`);
        if (idx < steps.length - 1) {
          _push(`<div class="${ssrRenderClass([__props.surface === "amber" ? __props.currentStep > step.id ? "bg-black" : "bg-black/20" : __props.currentStep > step.id ? "bg-brand" : "bg-white/20", "w-8 sm:w-14 lg:w-20 h-[2px] mx-2 sm:mx-3 lg:mx-4 transition-colors duration-500 flex-shrink-0"])}"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></div><div class="hidden sm:flex items-start mt-1.5"><!--[-->`);
      ssrRenderList(steps, (step, idx) => {
        _push(`<!--[--><div class="${ssrRenderClass([step.id < __props.currentStep || step.id === 1 ? "cursor-pointer" : "cursor-default", "flex-shrink-0 w-7 text-center"])}"><span class="${ssrRenderClass([__props.surface === "amber" ? __props.currentStep >= step.id ? "text-black" : "text-black/40" : __props.currentStep >= step.id ? "text-white" : "text-white/40", "text-[9px] font-black uppercase tracking-widest font-tech leading-tight block"])}" style="${ssrRenderStyle({ "width": "max-content", "transform": "translateX(-50%)", "margin-left": "50%" })}">${ssrInterpolate(step.label)}</span></div>`);
        if (idx < steps.length - 1) {
          _push(`<div class="w-8 sm:w-14 lg:w-20 mx-2 sm:mx-3 lg:mx-4 flex-shrink-0"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart/checkout/CheckoutSteps.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "CheckoutSteps" });

export { __nuxt_component_1 as default };
