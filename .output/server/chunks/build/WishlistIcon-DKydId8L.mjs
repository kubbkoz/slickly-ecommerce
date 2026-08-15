import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "WishlistIcon",
  __ssrInlineRender: true,
  props: {
    filled: { type: Boolean, default: false }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative" }, _attrs))}>`);
      if (!__props.filled) {
        _push(`<div class="i-carbon-favorite w-6 h-5 hover:cursor-pointer"></div>`);
      } else {
        _push(`<div class="i-carbon-favorite-filled w-6 h-5 hover:cursor-pointer"></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/@shopware/cms-base-layer/app/components/ui/WishlistIcon.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const WishlistIcon = Object.assign(_sfc_main, { __name: "SwWishlistIcon" });

export { WishlistIcon as default };
