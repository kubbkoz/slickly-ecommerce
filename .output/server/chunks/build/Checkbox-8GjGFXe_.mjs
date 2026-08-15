import { defineComponent, useModel, mergeProps, mergeModels, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Checkbox",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    label: {},
    description: {},
    disabled: { type: Boolean, default: false }
  }, {
    "modelValue": { type: Boolean, ...{
      required: true
    } },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<label${ssrRenderAttrs(mergeProps({ class: "flex items-start gap-2" }, _attrs))}><input class="accent-brand-primary w-4 h-4 focus-within:outline-2 focus-within:outline-brand-primary focus-within:outline focus-within:outline-offset-[2px] focus-within" type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(model.value) ? ssrLooseContain(model.value, null) : model.value) ? " checked" : ""}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}>`);
      if (__props.label || __props.description) {
        _push(`<div>`);
        if (__props.label) {
          _push(`<p class="${ssrRenderClass(
            __props.disabled ? "text-surface-on-surface-disabled" : "text-surface-on-surface"
          )}">${ssrInterpolate(__props.label)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.description) {
          _push(`<p class="${ssrRenderClass([
            __props.disabled ? "text-surface-on-surface-disabled" : "text-surface-on-surface-variant",
            "text-sm"
          ])}">${ssrInterpolate(__props.description)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/ui/Checkbox.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "SwCheckbox" });

export { __nuxt_component_1 as default };
