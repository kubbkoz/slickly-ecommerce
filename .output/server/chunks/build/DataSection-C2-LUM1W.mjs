import __nuxt_component_0 from './DataTextRow-BWtIhzlr.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DataSection",
  __ssrInlineRender: true,
  props: {
    address: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SharedDataTextRow = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-2" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_SharedDataTextRow, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.address.firstName)} ${ssrInterpolate(__props.address.lastName)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.address.firstName) + " " + toDisplayString(__props.address.lastName), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_SharedDataTextRow, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.address.street)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.address.street), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_SharedDataTextRow, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.address.zipcode)} ${ssrInterpolate(__props.address.city)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.address.zipcode) + " " + toDisplayString(__props.address.city), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_SharedDataTextRow, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.address.country?.translated.name)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.address.country?.translated.name), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/account/address/DataSection.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main, { __name: "AccountAddressDataSection" });

export { __nuxt_component_4 as default };
