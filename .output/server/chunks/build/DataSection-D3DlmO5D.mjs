import __nuxt_component_0 from './DataTextRow-BWtIhzlr.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DataSection",
  __ssrInlineRender: true,
  props: {
    customerName: {},
    customerEmail: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedDataTextRow = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-2" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_SharedDataTextRow, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.customerName)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.customerName), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_SharedDataTextRow, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.customerEmail)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.customerEmail), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/account/personal/DataSection.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main, { __name: "AccountPersonalDataSection" });

export { __nuxt_component_3 as default };
