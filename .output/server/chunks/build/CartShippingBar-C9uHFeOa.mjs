import { defineComponent, unref, useSSRContext } from 'vue';
import { ssrInterpolate, ssrRenderClass, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
import { Truck } from 'lucide-vue-next';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CartShippingBar",
  __ssrInlineRender: true,
  props: {
    amountToFreeShipping: {},
    freeShippingPercent: {},
    freeThreshold: {},
    formatPrice: {},
    variant: { default: "page" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.amountToFreeShipping !== null) {
        _push(`<!--[-->`);
        if (__props.variant === "sidebar") {
          _push(`<div class="px-8 pt-4 pb-3 flex-shrink-0"><div class="flex items-center mb-2">`);
          if (__props.amountToFreeShipping > 0) {
            _push(`<span class="text-[12px] font-sans text-gray-400"> Nakúpte ešte za <span class="text-black font-bold">${ssrInterpolate(__props.formatPrice(__props.amountToFreeShipping))}</span> a dopravu máte <span class="font-bold text-black">ZADARMO</span></span>`);
          } else {
            _push(`<span class="text-[12px] font-bold text-green-600 font-sans"> Gratulujeme! Dopravu máte ZADARMO. </span>`);
          }
          _push(`</div><div class="w-full h-1 bg-gray-100 overflow-hidden"><div class="${ssrRenderClass([__props.amountToFreeShipping <= 0 ? "bg-green-600" : "bg-brand", "h-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"])}" style="${ssrRenderStyle({ width: `${__props.freeShippingPercent}%` })}"></div></div></div>`);
        } else {
          _push(`<!--[-->`);
          if (__props.amountToFreeShipping > 0) {
            _push(`<div class="bg-white border border-gray-100 p-5 mb-4"><div class="flex items-center justify-between mb-2"><span class="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">`);
            _push(ssrRenderComponent(unref(Truck), { class: "w-3.5 h-3.5" }, null, _parent));
            if (__props.freeThreshold) {
              _push(`<!--[-->Doprava zadarmo od ${ssrInterpolate(__props.freeThreshold)}€<!--]-->`);
            } else {
              _push(`<!---->`);
            }
            _push(`</span><span class="text-[10px] font-bold text-brand uppercase tracking-widest"> Chýba ${ssrInterpolate(__props.formatPrice(__props.amountToFreeShipping))}</span></div><div class="h-1 w-full bg-gray-100 overflow-hidden"><div class="h-full bg-brand transition-all duration-700" style="${ssrRenderStyle({ width: `${__props.freeShippingPercent}%` })}"></div></div></div>`);
          } else {
            _push(`<div class="bg-white border border-brand/20 p-4 mb-4 flex items-center gap-3">`);
            _push(ssrRenderComponent(unref(Truck), { class: "w-4 h-4 text-brand flex-shrink-0" }, null, _parent));
            _push(`<span class="text-[11px] font-bold uppercase tracking-widest text-brand">Doprava zadarmo!</span></div>`);
          }
          _push(`<!--]-->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart/CartShippingBar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CartShippingBar = Object.assign(_sfc_main, { __name: "CartShippingBar" });

export { CartShippingBar as default };
