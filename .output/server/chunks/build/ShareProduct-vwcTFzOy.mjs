import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { Check, Share2 } from 'lucide-vue-next';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ShareProduct",
  __ssrInlineRender: true,
  props: {
    product: {}
  },
  setup(__props) {
    const props = __props;
    const copied = ref(false);
    const productName = computed(() => props.product.translated?.name || props.product.name || "SLICKLY");
    computed(() => "");
    computed(() => `${productName.value} — SLICKLY`);
    computed(() => `Pozri si tento produkt na SLICKLY: ${productName.value}`);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand transition-colors group py-2" }, _attrs))}>`);
      if (unref(copied)) {
        _push(ssrRenderComponent(unref(Check), { class: "w-4 h-4 text-green-500" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Share2), { class: "w-4 h-4 text-gray-400 group-hover:text-brand transition-colors" }, null, _parent));
      }
      _push(` ${ssrInterpolate(unref(copied) ? "Skopírované" : "Zdieľať")}</button>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/ShareProduct.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ShareProduct = Object.assign(_sfc_main, { __name: "ShareProduct" });

export { ShareProduct as default };
