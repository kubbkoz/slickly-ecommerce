import { defineComponent, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "BaseButton",
  __ssrInlineRender: true,
  props: {
    variant: { default: "primary" },
    size: { default: "medium" },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    type: { default: "button" },
    block: { type: Boolean, default: false }
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const buttonClasses = computed(() => {
      const classes = [
        "inline-flex justify-center items-center gap-2 rounded font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
      ];
      const sizeClasses = {
        small: "px-3 py-2 text-sm",
        medium: "px-4 py-3 text-base",
        large: "px-6 py-4 text-lg"
      };
      classes.push(sizeClasses[__props.size]);
      const variantClasses = {
        primary: "bg-brand-primary hover:bg-brand-primary-hover text-brand-on-primary focus:ring-brand-primary",
        secondary: "bg-brand-secondary hover:bg-brand-secondary-hover text-brand-on-secondary focus:ring-brand-secondary",
        success: "bg-states-success hover:opacity-90 text-white focus:ring-states-success transition-opacity",
        warning: "bg-states-warning hover:opacity-90 text-white focus:ring-states-warning transition-opacity",
        outline: "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-on-primary focus:ring-brand-primary",
        ghost: "bg-transparent text-surface-on-surface-variant hover:text-surface-on-surface focus:ring-surface-on-surface"
      };
      if (__props.disabled || __props.loading) {
        classes.push(
          "bg-surface-surface-disabled text-surface-on-surface cursor-not-allowed opacity-50"
        );
      } else {
        classes.push(variantClasses[__props.variant]);
      }
      if (__props.block) {
        classes.push("w-full");
      }
      return classes.join(" ");
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        type: __props.type,
        class: buttonClasses.value,
        disabled: __props.disabled || __props.loading
      }, _ctx.$attrs, _attrs))}>`);
      if (__props.loading) {
        _push(`<div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span class="${ssrRenderClass({ "opacity-0": __props.loading })}">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</span></button>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/ui/BaseButton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "SwBaseButton" });

export { __nuxt_component_2 as default };
