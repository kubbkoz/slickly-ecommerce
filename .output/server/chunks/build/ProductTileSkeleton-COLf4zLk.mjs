import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle } from 'vue/server-renderer';

const ELEMENT_WIDTH = 310;
const ELEMENT_HEIGHT = 315;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ProductTileSkeleton",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "flex flex-col gap-4 relative animate-pulse",
        style: `width: ${ELEMENT_WIDTH}px;`
      }, _attrs))}><div class="absolute top-4 right-4 h-6 w-6 rounded-full bg-surface-on-surface/10"></div><div class="bg-surface-on-surface/10 rounded-lg" style="${ssrRenderStyle(`height: ${ELEMENT_HEIGHT}px; width: ${ELEMENT_WIDTH}px;`)}"></div><div class="flex flex-col gap-2"><div class="h-7 bg-surface-on-surface/10 rounded w-3/4"></div><div class="h-7 bg-surface-on-surface/10 rounded w-1/2"></div></div><div class="mt-auto flex flex-col gap-4"><div class="h-6 bg-surface-on-surface/10 rounded w-1/3"></div><div class="h-10 bg-surface-on-surface/10 rounded"></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../vue-starter-template/app/components/wishlist/ProductTileSkeleton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "WishlistProductTileSkeleton" });

export { __nuxt_component_1 as default };
