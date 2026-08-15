import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderStyle, ssrRenderComponent, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { Loader2 } from 'lucide-vue-next';
import ReturnFormStep1 from './ReturnFormStep1-J6OeDrR0.mjs';
import ReturnFormStep2 from './ReturnFormStep2-DMCLLvW8.mjs';
import ReturnFormStep3 from './ReturnFormStep3-BmRowXns.mjs';
import ReturnFormSuccess from './ReturnFormSuccess-CYofRI6H.mjs';
import { u as useReturnForm } from './useReturnForm-BPYvUkOC.mjs';
import { d as useRoute, u as useHead } from './server.mjs';
import './nuxt-link-B7B0pxEe.mjs';
import '../nitro/nitro.mjs';
import 'nodemailer';
import 'node:crypto';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'anymatch';
import 'lru-cache';
import 'vue-router';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'pinia';
import '@iconify/vue';
import '@shopware/api-client';
import '@shopware/helpers';
import 'js-cookie';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "odstupenie-od-zmluvy",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const queryType = computed(
      () => route.query.type === "reklamacia" ? "reklamacia" : "vratenie"
    );
    const {
      currentStep,
      totalSteps,
      formData,
      attachments,
      warrantyFiles,
      orderLookup,
      isSubmitting,
      submitError,
      submitResult,
      stepErrors,
      labels,
      reasons,
      debouncedLookup,
      addFiles,
      removeFile
    } = useReturnForm({ initialFormType: queryType.value });
    const progress = computed(() => {
      if (currentStep.value === 4) return 100;
      return Math.round(currentStep.value / totalSteps * 100);
    });
    useHead({
      title: "Odstúpenie od zmluvy a reklamácia",
      meta: [
        { name: "description", content: "Vyplňte formulár pre odstúpenie od kúpnej zmluvy alebo reklamáciu tovaru v zmysle § 20a zákona č. 108/2024 Z. z." },
        { property: "og:title", content: "Odstúpenie od zmluvy a reklamácia | SLICKLY" }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-gray-50 min-h-screen py-12" }, _attrs))}><div class="max-w-4xl mx-auto px-4"><header class="text-center mb-10"><p class="text-[10px] uppercase tracking-widest text-brand font-tech mb-2">Zákaznícka podpora</p><h1 class="font-tech text-4xl sm:text-5xl font-black uppercase tracking-wide mb-4"> Odstúpenie / Reklamácia </h1><p class="text-sm text-gray-600 max-w-2xl mx-auto"> V súlade s § 20a zákona č. 108/2024 Z. z. o ochrane spotrebiteľa máte právo odstúpiť od zmluvy bez udania dôvodu do <strong>14 dní</strong> od prevzatia tovaru. </p></header><div class="bg-white shadow-sm">`);
      if (unref(currentStep) <= 3) {
        _push(`<div class="bg-gray-50 border-b border-gray-100 px-6 py-4"><div class="flex items-center justify-between text-[10px] uppercase tracking-widest font-tech text-gray-500 mb-2"><span class="${ssrRenderClass(unref(currentStep) >= 1 ? "text-brand font-bold" : "")}">1 · Objednávka</span><span class="${ssrRenderClass(unref(currentStep) >= 2 ? "text-brand font-bold" : "")}">2 · Vaše údaje</span><span class="${ssrRenderClass(unref(currentStep) >= 3 ? "text-brand font-bold" : "")}">3 · Potvrdenie</span></div><div class="h-1 bg-gray-200 overflow-hidden"><div class="h-full bg-brand transition-all duration-300" style="${ssrRenderStyle({ width: progress.value + "%" })}"></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="px-6 sm:px-10 py-8">`);
      if (unref(currentStep) === 1) {
        _push(ssrRenderComponent(ReturnFormStep1, {
          "form-data": unref(formData),
          "order-lookup": unref(orderLookup),
          errors: unref(stepErrors)[1],
          onLookup: unref(debouncedLookup),
          "onUpdate:formType": ($event) => unref(formData).formType = $event
        }, null, _parent));
      } else if (unref(currentStep) === 2) {
        _push(ssrRenderComponent(ReturnFormStep2, {
          "form-data": unref(formData),
          attachments: unref(attachments),
          "warranty-files": unref(warrantyFiles),
          reasons: unref(reasons),
          labels: unref(labels),
          errors: unref(stepErrors)[2],
          onAddFiles: unref(addFiles),
          onRemoveFile: unref(removeFile)
        }, null, _parent));
      } else if (unref(currentStep) === 3) {
        _push(ssrRenderComponent(ReturnFormStep3, {
          "form-data": unref(formData),
          errors: unref(stepErrors)[3],
          "submit-error": unref(submitError)
        }, null, _parent));
      } else if (unref(currentStep) === 4 && unref(submitResult)) {
        _push(ssrRenderComponent(ReturnFormSuccess, {
          "reference-number": unref(submitResult).referenceNumber,
          email: unref(formData).customerEmail,
          "form-type": unref(formData).formType
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(currentStep) <= 3) {
        _push(`<div class="border-t border-gray-100 px-6 sm:px-10 py-5 flex items-center justify-between gap-3 bg-gray-50">`);
        if (unref(currentStep) > 1) {
          _push(`<button type="button" class="text-sm font-bold uppercase tracking-wider font-tech text-gray-500 hover:text-black"> ← Späť </button>`);
        } else {
          _push(`<span></span>`);
        }
        if (unref(currentStep) < 3) {
          _push(`<button type="button" class="bg-brand text-white px-8 py-3 text-sm font-bold uppercase tracking-wider font-tech hover:bg-brand/90 transition-colors"> Pokračovať → </button>`);
        } else {
          _push(`<button type="button"${ssrIncludeBooleanAttr(unref(isSubmitting) || !unref(formData).gdprConsent) ? " disabled" : ""} class="bg-brand text-white px-8 py-3 text-sm font-bold uppercase tracking-wider font-tech hover:bg-brand/90 transition-colors disabled:opacity-50 flex items-center">`);
          if (unref(isSubmitting)) {
            _push(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 mr-2 animate-spin" }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(` Odoslať žiadosť </button>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/odstupenie-od-zmluvy.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
