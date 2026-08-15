import { defineComponent, computed, mergeProps, unref, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrRenderVNode, ssrInterpolate } from 'vue/server-renderer';
import { Truck, Sparkles, Car, Package } from 'lucide-vue-next';
import { F as FEATURES } from './constants-Dm0Yhftm.mjs';
import { u as useScrollReveal } from './useScrollReveal-hir-7v74.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Features",
  __ssrInlineRender: true,
  setup(__props) {
    const icons = { Package, Car, Sparkles, Truck };
    const translatedFeatures = computed(() => {
      return FEATURES.map((f, i) => ({
        ...f,
        title: f.title,
        desc: f.desc
      }));
    });
    const { target, isVisible } = useScrollReveal();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "target",
        ref: target,
        class: "py-14 md:py-20 bg-gray-50 border-b border-gray-100"
      }, _attrs))}><div class="container mx-auto px-4 lg:px-8"><div class="${ssrRenderClass([unref(isVisible) ? "reveal-visible" : "reveal", "reveal-base grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"])}"><!--[-->`);
      ssrRenderList(unref(translatedFeatures), (feature, idx) => {
        _push(`<div class="group flex items-start space-x-3 md:space-x-4 p-3 md:p-4 transition-all duration-300"><div class="flex-shrink-0 bg-black text-amber p-3 md:p-4 rounded-default transition-all duration-300 group-hover:bg-amber group-hover:text-black group-hover:-translate-y-1">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(icons[feature.icon]), { class: "w-5 h-5 md:w-6 md:h-6" }, null), _parent);
        _push(`</div><div class="transition-transform duration-300 group-hover:-translate-y-1"><p class="font-bold text-xs md:text-base mb-1 font-tech tracking-wide leading-tight">${ssrInterpolate(feature.title)}</p><p class="text-gray-500 text-[11px] md:text-sm leading-snug md:leading-relaxed">${ssrInterpolate(feature.desc)}</p></div></div>`);
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/Features.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Features = Object.assign(_sfc_main, { __name: "Features" });

export { Features as default };
