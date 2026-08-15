import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "StepHeader",
  __ssrInlineRender: true,
  props: {
    step: {},
    label: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mb-10" }, _attrs))}><div class="flex items-center gap-4 pb-2 border-b border-outline-outline mb-8"><div class="flex items-center justify-center w-12.5 h-12.5 rounded-full bg-brand-secondary text-on-secondary text-2xl font-normal leading-normal">${ssrInterpolate(__props.step)}</div><div class="justify-start text-[#1d1b20] text-2xl leading-9">${ssrInterpolate(__props.label)}</div></div><div>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/checkout/StepHeader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const StepHeader = Object.assign(_sfc_main, { __name: "CheckoutStepHeader" });

export { StepHeader as default };
