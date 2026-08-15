import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MainBadge",
  __ssrInlineRender: true,
  props: {
    label: {},
    type: { default: "info" }
  },
  setup(__props) {
    const classes = {
      info: "bg-states-info",
      success: "bg-states-success",
      warning: "bg-states-warning",
      error: "bg-states-error"
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: [classes[__props.type], "px-1.5 py-1 rounded inline-flex justify-center items-center"]
      }, _attrs))}><div class="justify-start text-white text-xs font-bold leading-[18px]">${ssrInterpolate(__props.label)}</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/layout/MainBadge.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const MainBadge = Object.assign(_sfc_main, { __name: "LayoutMainBadge" });

export { MainBadge as default };
