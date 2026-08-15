import { defineComponent, useModel, useSlots, mergeProps, mergeModels, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderSlot, ssrRenderDynamicModel, ssrRenderAttr } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BaseInput",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    placeholder: {},
    type: { default: "text" },
    invalid: { type: Boolean },
    autocomplete: {}
  }, {
    "modelValue": {
      required: true
    },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["focus"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const model = useModel(__props, "modelValue");
    useSlots();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "focus-within:outline-2 focus-within:outline-outline-outline-focus focus-within:outline focus-within:outline-offset-[2px] rounded-lg" }, _attrs))}><div class="${ssrRenderClass([{
        "outline-states-error": __props.invalid
      }, "flex items-center rounded-lg px-4 pt-2 pb-2.5 outline-outline-outline-variant outline outline-1 text-surface-on-surface-variant outline-offset-[-1px] input-field bg-surface-surface"])}">`);
      ssrRenderSlot(_ctx.$slots, "leftIcon", {}, null, _push, _parent);
      _push(`<input${ssrRenderDynamicModel(__props.type, model.value, null)} class="text-sm w-full outline-none bg-transparent text-surface-on-surface placeholder:text-surface-on-surface-variant"${ssrRenderAttr("placeholder", __props.placeholder)}${ssrRenderAttr("type", __props.type)}${ssrRenderAttr("autocomplete", __props.autocomplete)}>`);
      ssrRenderSlot(_ctx.$slots, "rightIcon", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/form/BaseInput.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "FormBaseInput" });

export { __nuxt_component_0 as default };
