import { defineComponent, computed, defineAsyncComponent, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "AccountOrderLineItem"
  },
  __name: "LineItem",
  __ssrInlineRender: true,
  props: {
    lineItem: {}
  },
  setup(__props) {
    const props = __props;
    const LineItemType = computed(() => {
      switch (props.lineItem.type) {
        case "promotion":
          return defineAsyncComponent(() => import('./LineItemPromotion-DyVsVy8Z.mjs'));
        case "credit":
          return defineAsyncComponent(() => import('./LineItemCredit-CiumI4bA.mjs'));
        case "custom":
          return defineAsyncComponent(() => import('./LineItemCustom-gP1dVbbi.mjs'));
        default:
          return defineAsyncComponent(() => import('./LineItemProduct-BlN5GsYX.mjs'));
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(LineItemType), mergeProps({ "line-item": __props.lineItem }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/account/order/LineItem.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "AccountOrderLineItem" });

export { __nuxt_component_0 as default };
