import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "IconButton",
  __ssrInlineRender: true,
  props: {
    type: { default: "primary" }
  },
  setup(__props) {
    const styles = {
      primary: "bg-brand-primary hover:focus:bg-brand-primary-hover text-brand-on-primary",
      secondary: "bg-brand-secondary hover:focus:bg-brand-secondary-hover text-brand-on-secondary",
      tertiary: "bg-brand-tertiary hover:focus:bg-brand-tertiary-hover text-brand-on-tertiary",
      outline: "text-brand-primary bg-transparent hover:focus:bg-surface-surface-container outline outline-2 outline-offset-[-2px] outline-brand-primary",
      ghost: "bg-transparent hover:focus:bg-surface-surface-container"
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        class: [
          styles[__props.type],
          {
            "bg-surface-on-surface-disabled text-surface-surface-disabled": _ctx.$attrs.disabled,
            "w-10 h-10": __props.type !== "ghost"
          }
        ]
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</button>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/ui/IconButton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const IconButton = Object.assign(_sfc_main, { __name: "SwIconButton" });

export { IconButton as default };
