import { defineComponent, useModel, useId, computed, mergeProps, unref, mergeModels, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { au as defu } from '../nitro/nitro.mjs';
import { u as useCmsTranslations } from './useCmsTranslations-C7n8Bwji.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SwQuantitySelect",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    size: { default: "large" },
    steps: {},
    min: {},
    max: {},
    id: {}
  }, {
    "modelValue": {
      required: true
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    let translations = {
      form: {
        quantitySelect: {
          label: "Quantity",
          increaseButton: "Increase quantity",
          decreaseButton: "Decrease quantity"
        }
      }
    };
    translations = defu(useCmsTranslations(), translations);
    const quantity = useModel(__props, "modelValue");
    const generatedId = useId();
    const inputId = computed(() => __props.id || generatedId);
    const sizeClasses = {
      small: "w-8 h-8",
      large: "w-10 h-10"
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded outline outline-1 outline-offset-[-1px] outline-outline-outline inline-flex" }, _attrs))}><button type="button" class="${ssrRenderClass([sizeClasses[__props.size], "bg-surface-surface border-0 border-r-1 cursor-pointer hover:bg-brand-tertiary-hover font-semibold"])}"${ssrRenderAttr("aria-label", unref(translations).form.quantitySelect.decreaseButton)}> - </button><div class="bg-white border-l border-r border-outline-outline inline-flex flex-col justify-center items-center"><label${ssrRenderAttr("for", inputId.value)} class="sr-only">${ssrInterpolate(unref(translations).form.quantitySelect.label)}</label><input${ssrRenderAttr("id", inputId.value)}${ssrRenderAttr("value", quantity.value)} type="number"${ssrRenderAttr("min", __props.min)}${ssrRenderAttr("max", __props.max)}${ssrRenderAttr("step", __props.steps)} data-testid="product-quantity" class="${ssrRenderClass([sizeClasses[__props.size], "self-stretch text-center justify-start text-surface-on-surface text-xs font-bold leading-[18px] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"])}"${ssrRenderAttr("aria-label", unref(translations).form.quantitySelect.label)}></div><button type="button" class="${ssrRenderClass([sizeClasses[__props.size], "w-10 bg-surface-surface border-0 border-l-1 cursor-pointer hover:bg-brand-tertiary-hover font-semibold"])}"${ssrRenderAttr("aria-label", unref(translations).form.quantitySelect.increaseButton)}> + </button></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/SwQuantitySelect.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "SwQuantitySelect" });

export { __nuxt_component_0 as default };
