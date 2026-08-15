import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { MapPin, Pencil } from 'lucide-vue-next';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SpsPickupPointPicker",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    shippingAddress: {},
    countries: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    ref(false);
    computed(() => {
      const country = props.countries.find((c) => c.value === props.shippingAddress.countryId);
      return country?.iso || "SK";
    });
    computed(() => {
      const { street, zipcode, city } = props.shippingAddress;
      return [street, [zipcode, city].filter(Boolean).join(" ")].filter(Boolean).join(", ");
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-2" }, _attrs))}><button id="sps-parcelshop-wrapper-button" type="button" class="flex items-center gap-2 px-4 py-2.5 border-2 border-black text-black font-black uppercase tracking-wide text-xs font-tech hover:bg-black hover:text-white transition-colors duration-200">`);
      _push(ssrRenderComponent(unref(MapPin), { class: "w-4 h-4" }, null, _parent));
      if (__props.modelValue) {
        _push(`<!--[-->Zmeniť výdajné miesto<!--]-->`);
      } else {
        _push(`<!--[-->Vybrať výdajné miesto<!--]-->`);
      }
      _push(`</button>`);
      if (__props.modelValue) {
        _push(`<div class="border-2 border-brand/30 bg-brand/5 p-3 flex items-start gap-3">`);
        _push(ssrRenderComponent(unref(MapPin), { class: "w-4 h-4 text-brand flex-shrink-0 mt-0.5" }, null, _parent));
        _push(`<div class="text-sm font-sans text-gray-700 leading-snug min-w-0"><div class="font-bold truncate">${ssrInterpolate(__props.modelValue.description)}</div><div>${ssrInterpolate(__props.modelValue.address)}</div><div>${ssrInterpolate(__props.modelValue.zip)} ${ssrInterpolate(__props.modelValue.city)}, ${ssrInterpolate(__props.modelValue.countryISO)}</div></div><button type="button" class="ml-auto flex-shrink-0 text-gray-400 hover:text-brand transition-colors" aria-label="Zmeniť výdajné miesto">`);
        _push(ssrRenderComponent(unref(Pencil), { class: "w-4 h-4" }, null, _parent));
        _push(`</button></div>`);
      } else {
        _push(`<p class="text-[11px] text-brand font-bold font-sans"> Vyberte výdajné miesto pre dokončenie objednávky. </p>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart/checkout/SpsPickupPointPicker.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "SpsPickupPointPicker" });

export { __nuxt_component_0 as default };
