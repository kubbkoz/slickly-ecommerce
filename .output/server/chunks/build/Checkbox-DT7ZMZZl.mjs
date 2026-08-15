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
      _push(`<label${ssrRenderAttrs(mergeProps({ class: "flex items-start gap-2" }, _attrs))}><input class="accent-brand-primary w-4 h-4 focus-within:outline-2 focus-within:outline-outline-outline-focus focus-within:outline focus-within:outline-offset-[2px] focus-within" type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(model.value) ? ssrLooseContain(model.value, null) : model.value) ? " checked" : ""}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}><div><p class="${ssrRenderClass(
        __props.disabled ? "text-surface-on-surface-disabled" : "text-surface-on-surface"
      )}">${ssrInterpolate(__props.label)}</p>`);
      if (__props.description) {
        _push(`<p class="${ssrRenderClass([
          __props.disabled ? "text-surface-on-surface-disabled" : "text-surface-on-surface-variant",
          "text-sm"
        ])}">${ssrInterpolate(__props.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></label>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/form/Checkbox.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "FormCheckbox" });

export { __nuxt_component_0 as default };
