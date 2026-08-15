import { defineComponent, useModel, mergeProps, mergeModels, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "QuantitySelect",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    size: { default: "large" }
  }, {
    "modelValue": {
      required: true
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const qty = useModel(__props, "modelValue");
    const sizeClasses = {
      small: "w-8 h-8",
      large: "w-10 h-10"
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded outline outline-1 outline-offset-[-1px] outline-outline-outline inline-flex" }, _attrs))}><button class="${ssrRenderClass([sizeClasses[__props.size], "bg-surface-surface border-0 border-r-1 cursor-pointer hover:bg-brand-tertiary-hover font-semibold"])}"> - </button><div class="bg-white border-l border-r border-outline-outline inline-flex flex-col justify-center items-center"><input class="${ssrRenderClass([sizeClasses[__props.size], "self-stretch text-center justify-start text-surface-on-surface text-xs font-bold leading-[18px] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"])}" type="number"${ssrRenderAttr("value", qty.value)}></div><button class="${ssrRenderClass([sizeClasses[__props.size], "w-10 bg-surface-surface border-0 border-l-1 cursor-pointer hover:bg-brand-tertiary-hover font-semibold"])}"> + </button></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/form/QuantitySelect.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "FormQuantitySelect" });

export { __nuxt_component_2 as default };
