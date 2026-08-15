import { defineComponent, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { RotateCcw, Wrench, Loader2, Check, AlertCircle } from 'lucide-vue-next';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ReturnFormStep1",
  __ssrInlineRender: true,
  props: {
    formData: {},
    orderLookup: {},
    errors: {},
    skipOrderLookup: { type: Boolean }
  },
  emits: ["lookup", "update:formType"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const showOrderFields = computed(() => !!props.formData.formType);
    const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
    watch(
      () => [props.formData.orderNumber, props.formData.customerEmail],
      () => {
        if (props.skipOrderLookup) return;
        if (props.formData.orderNumber.trim().length >= 3 && isValidEmail(props.formData.customerEmail)) {
          emit("lookup");
        }
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div><h3 class="text-sm font-bold uppercase tracking-widest font-tech text-gray-700 mb-3"> Vyberte typ žiadosti </h3><div class="grid grid-cols-1 sm:grid-cols-2 gap-3"><button type="button" class="${ssrRenderClass([__props.formData.formType === "vratenie" ? "border-brand bg-brand/5 text-brand" : "border-gray-200 hover:border-gray-400", "border-2 p-4 text-left transition-all font-tech rounded-default"])}"><div class="flex items-center mb-1">`);
      _push(ssrRenderComponent(unref(RotateCcw), { class: "w-5 h-5 mr-2" }, null, _parent));
      _push(`<span class="font-bold uppercase tracking-wider text-sm">Vrátenie tovaru</span></div><p class="text-xs text-gray-500">Do 14 dní bez udania dôvodu</p></button><button type="button" class="${ssrRenderClass([__props.formData.formType === "reklamacia" ? "border-brand bg-brand/5 text-brand" : "border-gray-200 hover:border-gray-400", "border-2 p-4 text-left transition-all font-tech rounded-default"])}"><div class="flex items-center mb-1">`);
      _push(ssrRenderComponent(unref(Wrench), { class: "w-5 h-5 mr-2" }, null, _parent));
      _push(`<span class="font-bold uppercase tracking-wider text-sm">Reklamácia</span></div><p class="text-xs text-gray-500">Poškodený alebo chybný tovar</p></button></div></div>`);
      if (showOrderFields.value) {
        _push(`<div class="space-y-4"><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1"> Číslo objednávky <span class="text-brand">*</span></label><input${ssrRenderAttr("value", __props.formData.orderNumber)} type="text" placeholder="napr. 10006" autocomplete="off" class="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-brand focus:outline-none font-sans"></div><div><label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1"> Email z objednávky <span class="text-brand">*</span></label><input${ssrRenderAttr("value", __props.formData.customerEmail)} type="email" placeholder="vas@email.sk" autocomplete="email" class="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-brand focus:outline-none font-sans"></div></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1"> Dátum objednávky </label><input${ssrRenderAttr("value", __props.formData.orderDate)} type="date" class="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-brand focus:outline-none font-sans"><p class="text-[10px] text-gray-400 mt-1">Doplní sa automaticky po nájdení objednávky.</p></div><div><label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1"> Číslo faktúry </label><input${ssrRenderAttr("value", __props.formData.invoiceNumber)} type="text" placeholder="napr. FAC-2026-1042" class="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-brand focus:outline-none font-sans"></div></div>`);
        if (__props.orderLookup.loading) {
          _push(`<div class="flex items-center text-xs text-gray-500">`);
          _push(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 mr-2 animate-spin" }, null, _parent));
          _push(` Hľadám objednávku… </div>`);
        } else if (__props.orderLookup.found) {
          _push(`<div class="${ssrRenderClass([__props.orderLookup.within14Days ? "border-green-200 bg-green-50 text-green-800" : "border-orange-200 bg-orange-50 text-orange-800", "border p-3 text-xs"])}"><div class="flex items-start">`);
          if (__props.orderLookup.within14Days) {
            _push(ssrRenderComponent(unref(Check), { class: "w-4 h-4 mr-2 mt-0.5 flex-shrink-0" }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(AlertCircle), { class: "w-4 h-4 mr-2 mt-0.5 flex-shrink-0" }, null, _parent));
          }
          _push(`<div><p class="font-bold">Objednávka nájdená</p><p>${ssrInterpolate(__props.orderLookup.order?.customerName)} · ${ssrInterpolate(__props.orderLookup.order?.orderDate)}</p>`);
          if (__props.orderLookup.within14Days) {
            _push(`<p>✓ V lehote 14 dní (${ssrInterpolate(__props.orderLookup.daysSinceOrder)} dní od objednávky)</p>`);
          } else {
            _push(`<p>⚠ Lehota 14 dní môže byť prekročená (${ssrInterpolate(__props.orderLookup.daysSinceOrder)} dní od objednávky)</p>`);
          }
          _push(`</div></div></div>`);
        } else if (__props.formData.orderNumber.length >= 4 && /@/.test(__props.formData.customerEmail) && !__props.orderLookup.loading) {
          _push(`<div class="border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600"> Objednávka nenájdená — môžete pokračovať, údaje overíme manuálne. </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.errors.length) {
        _push(`<div class="border border-brand bg-brand/5 p-3 text-xs text-brand"><ul class="list-disc list-inside space-y-1"><!--[-->`);
        ssrRenderList(__props.errors, (err) => {
          _push(`<li>${ssrInterpolate(err)}</li>`);
        });
        _push(`<!--]--></ul></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/returns/ReturnFormStep1.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ReturnFormStep1 = Object.assign(_sfc_main, { __name: "ReturnFormStep1" });

export { ReturnFormStep1 as default };
