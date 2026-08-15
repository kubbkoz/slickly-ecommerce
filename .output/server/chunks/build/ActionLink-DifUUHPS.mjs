import __nuxt_component_10 from './LinkButton-CTjOSiub.mjs';
import { defineComponent, mergeProps, withCtx, renderSlot, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ActionLink",
  __ssrInlineRender: true,
  props: {
    disabled: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormLinkButton = __nuxt_component_10;
      _push(ssrRenderComponent(_component_FormLinkButton, mergeProps({
        class: ["leading-0 border-b-1 border-b-solid border-b-brand-primary hover:border-transparent transition-all duration-200 h-6 w-fit", {
          "opacity-50 pointer-events-none": __props.disabled
        }],
        variant: "tertiary",
        disabled: __props.disabled
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/account/ActionLink.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main, { __name: "AccountActionLink" });

export { __nuxt_component_3 as default };
