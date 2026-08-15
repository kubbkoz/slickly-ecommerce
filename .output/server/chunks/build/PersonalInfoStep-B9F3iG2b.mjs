import { defineComponent, ref, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { Globe, ChevronDown, FileText, Briefcase, ShieldCheck } from 'lucide-vue-next';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PersonalInfoStep",
  __ssrInlineRender: true,
  props: {
    formData: {},
    billingData: {},
    isBillingDifferent: { type: Boolean },
    isCompanyPurchase: { type: Boolean },
    countries: {}
  },
  emits: ["update:formData", "update:billingData", "update:isBillingDifferent", "update:isCompanyPurchase"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const localForm = ref({ ...props.formData });
    const localBilling = ref({ ...props.billingData });
    watch(localForm, (val) => emit("update:formData", val), { deep: true });
    watch(localBilling, (val) => emit("update:billingData", val), { deep: true });
    watch(() => props.formData, (val) => {
      localForm.value = { ...val };
    }, { deep: true });
    watch(() => props.billingData, (val) => {
      localBilling.value = { ...val };
    }, { deep: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white border border-gray-200 animate-fade-in font-sans" }, _attrs))}><div class="flex items-center gap-3 px-5 md:px-8 py-5 border-b border-gray-100"><span class="w-1 h-5 bg-brand inline-block flex-shrink-0"></span><h2 class="text-sm font-bold tracking-[0.2em] text-gray-900 uppercase"> Osobné údaje a adresa </h2></div><div class="px-5 md:px-8 py-6 space-y-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-5"><div><label class="form-label">Email *</label><input${ssrRenderAttr("value", unref(localForm).email)} type="email" autocomplete="email" class="form-input" placeholder="vas@email.sk"></div><div><label class="form-label">Telefón *</label><input${ssrRenderAttr("value", unref(localForm).phone)} type="tel" autocomplete="tel" class="form-input" placeholder="+421 9XX XXX XXX"></div><div><label class="form-label">Meno *</label><input${ssrRenderAttr("value", unref(localForm).firstName)} type="text" autocomplete="given-name" class="form-input"></div><div><label class="form-label">Priezvisko *</label><input${ssrRenderAttr("value", unref(localForm).lastName)} type="text" autocomplete="family-name" class="form-input"></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-5"><div class="md:col-span-2"><label class="form-label flex items-center gap-1">`);
      _push(ssrRenderComponent(unref(Globe), { class: "w-3 h-3" }, null, _parent));
      _push(` Krajina doručenia * </label><div class="relative"><select class="form-input appearance-none pr-10"><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(localForm).countryId) ? ssrLooseContain(unref(localForm).countryId, "") : ssrLooseEqual(unref(localForm).countryId, "")) ? " selected" : ""}>Vyberte krajinu</option><!--[-->`);
      ssrRenderList(__props.countries, (c) => {
        _push(`<option${ssrRenderAttr("value", c.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(localForm).countryId) ? ssrLooseContain(unref(localForm).countryId, c.value) : ssrLooseEqual(unref(localForm).countryId, c.value)) ? " selected" : ""}>${ssrInterpolate(c.label)}</option>`);
      });
      _push(`<!--]--></select>`);
      _push(ssrRenderComponent(unref(ChevronDown), { class: "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" }, null, _parent));
      _push(`</div></div><div class="md:col-span-2"><label class="form-label">Ulica a číslo *</label><input${ssrRenderAttr("value", unref(localForm).street)} type="text" autocomplete="street-address" class="form-input"></div><div><label class="form-label">Mesto *</label><input${ssrRenderAttr("value", unref(localForm).city)} type="text" autocomplete="address-level2" class="form-input"></div><div><label class="form-label">PSČ *</label><input${ssrRenderAttr("value", unref(localForm).zipcode)} type="text" autocomplete="postal-code" class="form-input"></div></div><div class="pt-4 border-t border-gray-100"><label class="flex items-center gap-3 cursor-pointer mb-4 group"><div class="relative flex items-center justify-center w-4 h-4 border border-gray-300 group-hover:border-black transition-colors bg-white flex-shrink-0"><input type="checkbox" class="sr-only"${ssrIncludeBooleanAttr(__props.isBillingDifferent) ? " checked" : ""}>`);
      if (__props.isBillingDifferent) {
        _push(`<div class="w-2.5 h-2.5 bg-black"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><span class="text-[11px] font-bold uppercase tracking-widest text-black flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(FileText), { class: "w-3.5 h-3.5 text-gray-400" }, null, _parent));
      _push(` Iné fakturačné údaje </span></label>`);
      if (__props.isBillingDifferent) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50 border border-gray-100 p-5 animate-slide-up"><div><label class="form-label">Meno</label><input${ssrRenderAttr("value", unref(localBilling).firstName)} type="text" class="form-input bg-white"></div><div><label class="form-label">Priezvisko</label><input${ssrRenderAttr("value", unref(localBilling).lastName)} type="text" class="form-input bg-white"></div><div class="md:col-span-2"><label class="form-label flex items-center gap-1">`);
        _push(ssrRenderComponent(unref(Globe), { class: "w-3 h-3" }, null, _parent));
        _push(` Fakturačná krajina</label><div class="relative"><select class="form-input bg-white appearance-none pr-10"><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(localBilling).countryId) ? ssrLooseContain(unref(localBilling).countryId, "") : ssrLooseEqual(unref(localBilling).countryId, "")) ? " selected" : ""}>Vyberte krajinu</option><!--[-->`);
        ssrRenderList(__props.countries, (c) => {
          _push(`<option${ssrRenderAttr("value", c.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(localBilling).countryId) ? ssrLooseContain(unref(localBilling).countryId, c.value) : ssrLooseEqual(unref(localBilling).countryId, c.value)) ? " selected" : ""}>${ssrInterpolate(c.label)}</option>`);
        });
        _push(`<!--]--></select>`);
        _push(ssrRenderComponent(unref(ChevronDown), { class: "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" }, null, _parent));
        _push(`</div></div><div class="md:col-span-2"><label class="form-label">Ulica a číslo</label><input${ssrRenderAttr("value", unref(localBilling).street)} type="text" class="form-input bg-white"></div><div><label class="form-label">Mesto</label><input${ssrRenderAttr("value", unref(localBilling).city)} type="text" class="form-input bg-white"></div><div><label class="form-label">PSČ</label><input${ssrRenderAttr("value", unref(localBilling).zipcode)} type="text" class="form-input bg-white"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="pt-4 border-t border-gray-100"><label class="flex items-center gap-3 cursor-pointer mb-4 group"><div class="relative flex items-center justify-center w-4 h-4 border border-gray-300 group-hover:border-black transition-colors bg-white flex-shrink-0"><input type="checkbox" class="sr-only"${ssrIncludeBooleanAttr(__props.isCompanyPurchase) ? " checked" : ""}>`);
      if (__props.isCompanyPurchase) {
        _push(`<div class="w-2.5 h-2.5 bg-black"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><span class="text-[11px] font-bold uppercase tracking-widest text-black flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Briefcase), { class: "w-3.5 h-3.5 text-gray-400" }, null, _parent));
      _push(` Nakupujem na firmu </span></label>`);
      if (__props.isCompanyPurchase) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50 border border-gray-100 p-5 animate-slide-up"><div class="md:col-span-2"><label class="form-label">Názov firmy</label><input${ssrRenderAttr("value", unref(localForm).company)} type="text" class="form-input bg-white"></div><div><label class="form-label">IČO</label><input${ssrRenderAttr("value", unref(localForm).ico)} type="text" class="form-input bg-white"></div><div><label class="form-label">DIČ</label><input${ssrRenderAttr("value", unref(localForm).dic)} type="text" class="form-input bg-white"></div><div><label class="form-label">IČ DPH</label><input${ssrRenderAttr("value", unref(localForm).icdph)} type="text" class="form-input bg-white"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="pt-4 border-t border-gray-100"><label class="form-label">Poznámka k objednávke</label><textarea rows="3" class="form-input resize-none" placeholder="Nepovinné — špeciálne inštrukcie pre doručenie...">${ssrInterpolate(unref(localForm).note)}</textarea></div><div class="flex items-center gap-3 p-4 border border-gray-100 bg-gray-50 text-gray-500 text-[11px] font-sans">`);
      _push(ssrRenderComponent(unref(ShieldCheck), { class: "w-4 h-4 flex-shrink-0 text-brand" }, null, _parent));
      _push(` Vaše údaje sú u nás v bezpečí a spracované výhradne podľa GDPR. </div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart/checkout/PersonalInfoStep.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PersonalInfoStep = Object.assign(_sfc_main, { __name: "PersonalInfoStep" });

export { PersonalInfoStep as default };
