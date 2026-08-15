import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CustomerAddressChosen",
  __ssrInlineRender: true,
  props: {
    address: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-4 bg-brand-secondary inline-flex flex-col justify-start items-start" }, _attrs))}><div><div class="text-surface-on-surface text-base">${ssrInterpolate(__props.address.firstName)} ${ssrInterpolate(__props.address.lastName)}</div><div class="text-surface-on-surface text-base">${ssrInterpolate(__props.address.street)}</div><div class="text-surface-on-surface text-base">${ssrInterpolate(__props.address.zipcode)} ${ssrInterpolate(__props.address.city)}</div><div class="text-surface-on-surface text-base">${ssrInterpolate(__props.address.country?.translated.name)}</div></div><div>[ADD BUTTON]</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/checkout/CustomerAddressChosen.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CustomerAddressChosen = Object.assign(_sfc_main, { __name: "CheckoutCustomerAddressChosen" });

export { CustomerAddressChosen as default };
