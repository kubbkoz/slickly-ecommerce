import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { CheckCircle2 } from 'lucide-vue-next';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ReturnFormSuccess",
  __ssrInlineRender: true,
  props: {
    referenceNumber: {},
    email: {},
    formType: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-center py-8 px-4" }, _attrs))}><div class="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">`);
      _push(ssrRenderComponent(unref(CheckCircle2), { class: "w-10 h-10 text-green-600" }, null, _parent));
      _push(`</div><h2 class="font-tech text-2xl font-black uppercase tracking-wider mb-3"> Žiadosť bola úspešne prijatá </h2><p class="text-sm text-gray-600 mb-6">${ssrInterpolate(__props.formType === "reklamacia" ? "Reklamačné" : "Vrátenie")} konanie sme prijali a začneme ho spracovávať. </p><div class="inline-block border-2 border-brand bg-brand/5 px-6 py-3 mb-6"><p class="text-[10px] uppercase tracking-widest text-brand font-tech mb-1">Referenčné číslo</p><p class="text-2xl font-bold font-tech text-brand">${ssrInterpolate(__props.referenceNumber)}</p></div><div class="text-sm text-gray-600 max-w-md mx-auto space-y-2"><p>📧 Potvrdenie o prijatí sme poslali na <strong>${ssrInterpolate(__props.email)}</strong></p><p>📦 Tovar zasielajte na adresu <strong>SLICKLY, [adresa pre vrátenie — doplniť]</strong></p><p>⏱ Naše oddelenie vás bude kontaktovať do <strong>3 pracovných dní</strong></p></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/returns/ReturnFormSuccess.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ReturnFormSuccess = Object.assign(_sfc_main, { __name: "ReturnFormSuccess" });

export { ReturnFormSuccess as default };
