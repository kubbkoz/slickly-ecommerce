import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AccountOrderSummary"
  },
  __name: "Summary",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "px-2 py-4 flex sm:block gap-10" }, _attrs))}><div class="flex flex-col sm:grid grid-cols-5 lg:grid-cols-6 gap-y-5 gap-x-7"><div class="lg:col-span-2">${ssrInterpolate(_ctx.$t("account.order.orderNumber"))}</div><div>${ssrInterpolate(_ctx.$t("account.order.totalAmount"))}</div><div>${ssrInterpolate(_ctx.$t("account.order.orderDate"))}</div><div>${ssrInterpolate(_ctx.$t("account.order.orderStatus"))}</div><div class="justify-self-end"></div></div><div class="flex flex-col sm:grid grid-cols-5 lg:grid-cols-6 gap-y-5 gap-x-7 text-surface-on-surface">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/account/order/Summary.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Summary = Object.assign(_sfc_main, { __name: "AccountOrderSummary" });

export { Summary as default };
