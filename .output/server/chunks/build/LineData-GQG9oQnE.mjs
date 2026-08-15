import { defineComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LineData",
  __ssrInlineRender: true,
  props: {
    label: {},
    value: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="p-4 border-b border-outline-outline-variant text-surface-on-surface font-bold leading-6">${ssrInterpolate(__props.label)}: </div><div class="p-4 leading-6">${ssrInterpolate(__props.value)}</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/account/order/LineData.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "AccountOrderLineData" });

export { __nuxt_component_2 as default };
