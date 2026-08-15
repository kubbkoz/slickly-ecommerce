import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { ShoppingBag, X } from 'lucide-vue-next';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CartHeader",
  __ssrInlineRender: true,
  props: {
    count: {}
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-between px-5 md:px-8 py-5 flex-shrink-0 border-b border-gray-100" }, _attrs))}><div class="flex items-center gap-3">`);
      _push(ssrRenderComponent(unref(ShoppingBag), {
        class: "w-4 h-4 text-gray-900",
        "stroke-width": 1.8
      }, null, _parent));
      _push(`<h2 class="text-sm font-bold tracking-[0.2em] text-gray-900 font-sans uppercase"> SÚČET POLOŽIEK (${ssrInterpolate(__props.count)}) </h2></div><button class="w-10 h-10 flex items-center justify-center bg-gray-900/5 hover:bg-gray-900/10 text-gray-900 transition-all rounded-sm" aria-label="Zavrieť košík">`);
      _push(ssrRenderComponent(unref(X), { class: "w-4 h-4" }, null, _parent));
      _push(`</button></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart/CartHeader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CartHeader = Object.assign(_sfc_main, { __name: "CartHeader" });

export { CartHeader as default };
