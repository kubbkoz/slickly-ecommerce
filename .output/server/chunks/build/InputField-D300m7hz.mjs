import __nuxt_component_0$1 from './BaseInput-Bd1YNFpA.mjs';
import { defineComponent, useModel, computed, unref, mergeProps, mergeModels, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "InputField",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    placeholder: {},
    label: { default: "" },
    id: { default: "" },
    type: { default: "text" },
    errorMessage: {},
    autocomplete: {}
  }, {
    "modelValue": {
      required: true
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    const errorText = computed(() => unref(__props.errorMessage));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormBaseInput = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative" }, _attrs))}>`);
      if (__props.label) {
        _push(`<label class="text-surface-on-surface text-sm mb-1 block"${ssrRenderAttr("for", __props.id)}>${ssrInterpolate(__props.label)}</label>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_FormBaseInput, {
        class: "text-sm w-full",
        modelValue: model.value,
        "onUpdate:modelValue": ($event) => model.value = $event,
        placeholder: __props.placeholder,
        type: __props.type,
        id: __props.id,
        invalid: !!unref(errorText),
        autocomplete: __props.autocomplete
      }, null, _parent));
      if (unref(errorText)) {
        _push(`<span class="text-states-error text-xs block mt-1">${ssrInterpolate(unref(errorText))}</span>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/form/InputField.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "FormInputField" });

export { __nuxt_component_0 as default };
