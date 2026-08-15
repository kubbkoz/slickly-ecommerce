import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { ChevronUp } from 'lucide-vue-next';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ScrollToTop",
  __ssrInlineRender: true,
  setup(__props) {
    const isVisible = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        "aria-label": "Späť navrch",
        class: ["hidden lg:flex fixed bottom-8 right-4 md:right-8 z-50 items-center justify-center w-12 h-12 bg-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:bg-brand hover:-translate-y-1 focus:outline-none opacity-100 rounded-default", isVisible.value ? "translate-y-0" : "translate-y-24 pointer-events-none"]
      }, _attrs))}>`);
      _push(ssrRenderComponent(unref(ChevronUp), {
        class: "w-6 h-6 transition-transform group-hover:-translate-y-0.5",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`</button>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/ScrollToTop.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ScrollToTop = Object.assign(_sfc_main, { __name: "ScrollToTop" });

export { ScrollToTop as default };
