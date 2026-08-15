import { defineComponent, useModel, mergeProps, mergeModels, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseContain, ssrLooseEqual, ssrRenderList } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BaseDropdown",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    placeholder: {},
    options: {},
    id: {},
    invalid: { type: Boolean },
    loading: { type: Boolean }
  }, {
    "modelValue": {
      required: true
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "focus-within:outline-2 focus-within:outline-outline-outline-focus focus-within:outline focus-within:outline-offset-[2px] rounded-lg" }, _attrs))}><div class="${ssrRenderClass([{
        "outline-states-error": __props.invalid
      }, "flex items-center rounded-lg px-4 py-2 outline outline-1 outline-offset-[-1px] outline-outline-outline-variant text-surface-on-surface-variant"])}"><select class="w-full outline-none bg-transparent"${ssrRenderAttr("id", __props.id)}${ssrIncludeBooleanAttr(__props.loading) ? " disabled" : ""}>`);
      if (__props.loading) {
        _push(`<option value="" selected disabled>${ssrInterpolate(_ctx.$t("form.loading"))}</option>`);
      } else if (__props.placeholder) {
        _push(`<option value=""${ssrIncludeBooleanAttr(Array.isArray(model.value) ? ssrLooseContain(model.value, "") : ssrLooseEqual(model.value, "")) ? " selected" : ""}>${ssrInterpolate(__props.placeholder)}</option>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(__props.options, (option) => {
        _push(`<option${ssrRenderAttr("value", option.value)}${ssrIncludeBooleanAttr(Array.isArray(model.value) ? ssrLooseContain(model.value, option.value) : ssrLooseEqual(model.value, option.value)) ? " selected" : ""}>${ssrInterpolate(option.label)}</option>`);
      });
      _push(`<!--]--></select></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/form/BaseDropdown.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "FormBaseDropdown" });

export { __nuxt_component_0 as default };
