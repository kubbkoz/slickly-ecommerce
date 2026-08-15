import { defineComponent, useModel, computed, ref, watch, mergeProps, unref, mergeModels, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderClass, ssrRenderSlot, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SwitchButton",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    name: {},
    ariaLabel: {},
    label: {},
    description: {},
    disabled: { type: Boolean }
  }, {
    "modelValue": { type: [Boolean, null] },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["change"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const props = __props;
    const modelValue = useModel(__props, "modelValue");
    const value = computed(() => !!modelValue.value);
    const localChecked = ref(value.value);
    watch(value, (v) => {
      localChecked.value = v;
    });
    const inputName = props.name ?? "switch-button";
    const inputId = `switch-${inputName}`;
    const inputRef = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full inline-flex flex-col justify-start items-start gap-2" }, _attrs))} data-v-23322b0d><div class="self-stretch inline-flex justify-start items-center gap-3" data-v-23322b0d><label${ssrRenderAttr("for", inputId)} class="${ssrRenderClass([{ "cursor-not-allowed": __props.disabled }, "flex-1 flex justify-start items-center gap-1 text-surface-on-surface text-base font-normal leading-normal cursor-pointer"])}" data-v-23322b0d>`);
      if (_ctx.$slots.default) {
        _push(`<span data-v-23322b0d>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</span>`);
      } else if (__props.label) {
        _push(`<span data-v-23322b0d>${ssrInterpolate(__props.label)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label><div class="w-10 h-6 relative" data-v-23322b0d><label class="${ssrRenderClass([{ "cursor-not-allowed": __props.disabled }, "inline-block cursor-pointer"])}" data-v-23322b0d><input${ssrRenderAttrs(mergeProps({
        ref_key: "inputRef",
        ref: inputRef,
        id: inputId,
        type: "checkbox",
        name: unref(inputName),
        class: "sr-only",
        checked: localChecked.value,
        disabled: __props.disabled,
        "aria-label": __props.ariaLabel || void 0
      }, _ctx.$attrs))} data-v-23322b0d><span role="switch"${ssrRenderAttr("aria-checked", localChecked.value)}${ssrRenderAttr("tabindex", __props.disabled ? -1 : 0)} class="${ssrRenderClass([localChecked.value ? "bg-brand-secondary switch-track--on" : "bg-surface-surface-container-highest", "w-10 h-6 relative rounded-full flex-shrink-0 inline-block switch-track cursor-pointer"])}" data-v-23322b0d><span style="${ssrRenderStyle({ left: localChecked.value ? "19px" : "4px", top: "4px" })}" class="${ssrRenderClass([localChecked.value ? "bg-brand-on-secondary" : "bg-surface-on-surface-variant", "w-4 h-4 rounded-full absolute switch-knob"])}" data-v-23322b0d></span></span></label></div></div>`);
      if (__props.description || _ctx.$slots.description) {
        _push(`<div class="self-stretch inline-flex justify-start items-center gap-2.5" data-v-23322b0d><div class="flex-1 justify-start text-surface-on-surface-variant text-sm font-normal leading-tight" data-v-23322b0d>`);
        ssrRenderSlot(_ctx.$slots, "description", {}, () => {
          _push(`${ssrInterpolate(__props.description)}`);
        }, _push, _parent);
        _push(`</div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/ui/SwitchButton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-23322b0d"]]), { __name: "SwSwitchButton" });

export { __nuxt_component_1 as default };
