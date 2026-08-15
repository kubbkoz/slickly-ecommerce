import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Status",
  __ssrInlineRender: true,
  props: {
    state: {}
  },
  setup(__props) {
    const props = __props;
    const statusClass = computed(() => {
      switch (props.state.technicalName) {
        case "completed":
          return "bg-green-100 text-green-800";
        case "open":
        case "in_progress":
          return "bg-yellow-100 text-yellow-800";
        case "cancelled":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({
        class: ["px-1.5 py-1 inline-flex text-xs leading-5 font-semibold rounded", unref(statusClass)]
      }, _attrs))}>${ssrInterpolate(__props.state.name)}</span>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/account/order/Status.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main, { __name: "AccountOrderStatus" });

export { __nuxt_component_3 as default };
