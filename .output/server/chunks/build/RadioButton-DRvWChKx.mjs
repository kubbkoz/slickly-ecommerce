import { defineComponent, useModel, mergeProps, mergeModels, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrLooseEqual, ssrGetDynamicModelProps, ssrRenderClass } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "RadioButton",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    selected: { type: Boolean }
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const modelValue = useModel(__props, "modelValue");
    return (_ctx, _push, _parent, _attrs) => {
      let _temp0;
      _push(`<!--[--><input${ssrRenderAttrs((_temp0 = mergeProps({
        type: "radio",
        class: "sr-only"
      }, _ctx.$attrs, {
        checked: ssrLooseEqual(modelValue.value, null),
        name: "shipping-method"
      }), mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, modelValue.value))))}><div class="w-4 h-4 rounded-full border border-outline-outline border-spacing-1 flex items-center justify-center"><div class="${ssrRenderClass([{
        "bg-brand-primary": __props.selected
      }, "w-2.5 h-2.5 rounded-full"])}"></div></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/ui/RadioButton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RadioButton = Object.assign(_sfc_main, { __name: "SwRadioButton" });

export { RadioButton as default };
