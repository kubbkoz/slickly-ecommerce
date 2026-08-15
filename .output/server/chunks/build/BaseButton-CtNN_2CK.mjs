import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BaseButton",
  __ssrInlineRender: true,
  props: {
    label: {},
    variant: { default: "primary" },
    size: { default: "regular" },
    type: {}
  },
  setup(__props) {
    const variantClasses = {
      primary: "bg-brand-primary text-brand-on-primary",
      secondary: "bg-brand-secondary text-brand-on-secondary",
      tertiary: "bg-brand-tertiary text-brand-on-tertiary",
      outline: "bg-transparent border-1 border-brand-primary"
    };
    const sizeClasses = {
      regular: "py-3",
      small: "py-1.5"
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        class: [[variantClasses[__props.variant], sizeClasses[__props.size]], "px-4 rounded inline-flex justify-center items-center gap-1 disabled:bg-surface-surface-disabled disabled:bg-text-bg-surface-surface-disabled"],
        type: __props.type
      }, _attrs))}><div class="justify-start text-base font-bold leading-normal">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, () => {
        _push(`${ssrInterpolate(__props.label)}`);
      }, _push, _parent);
      _push(`</div></button>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/form/BaseButton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "FormBaseButton" });

export { __nuxt_component_1 as default };
