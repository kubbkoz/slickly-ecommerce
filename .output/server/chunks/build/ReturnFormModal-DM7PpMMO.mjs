import { defineComponent, watch, computed, unref, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { X, Loader2 } from 'lucide-vue-next';
import { u as useReturnForm } from './useReturnForm-BPYvUkOC.mjs';
import ReturnFormStep1 from './ReturnFormStep1-J6OeDrR0.mjs';
import ReturnFormStep2 from './ReturnFormStep2-DMCLLvW8.mjs';
import ReturnFormStep3 from './ReturnFormStep3-BmRowXns.mjs';
import ReturnFormSuccess from './ReturnFormSuccess-CYofRI6H.mjs';
import './server.mjs';
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
import './nuxt-link-B7B0pxEe.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ReturnFormModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    initialFormType: { default: "vratenie" },
    initialOrderNumber: {},
    initialOrderDate: {},
    initialOrderId: {},
    initialEmail: {},
    initialFirstName: {},
    initialLastName: {},
    initialCustomerPhone: {},
    initialCustomerAddress: {},
    initialItemsDescription: {},
    skipOrderLookup: { type: Boolean, default: false }
  },
  emits: ["close", "submitted"],
  setup(__props, { emit: __emit }) {
    const props = __props;
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
    } = useReturnForm({
      initialFormType: props.initialFormType,
      initialOrderNumber: props.initialOrderNumber,
      initialOrderDate: props.initialOrderDate,
      initialOrderId: props.initialOrderId,
      initialEmail: props.initialEmail,
      initialFirstName: props.initialFirstName,
      initialLastName: props.initialLastName,
      initialCustomerPhone: props.initialCustomerPhone,
      initialCustomerAddress: props.initialCustomerAddress,
      initialItemsDescription: props.initialItemsDescription,
      skipOrderLookup: props.skipOrderLookup
    });
    watch(() => props.isOpen, (open) => {
      if (open) {
        (void 0).body.style.overflow = "hidden";
        formData.formType = props.initialFormType ?? "vratenie";
        if (props.initialOrderNumber !== void 0) formData.orderNumber = props.initialOrderNumber;
        if (props.initialOrderDate !== void 0) formData.orderDate = props.initialOrderDate;
        if (props.initialOrderId !== void 0) formData.orderId = props.initialOrderId;
        if (props.initialEmail !== void 0) formData.customerEmail = props.initialEmail;
        if (props.initialFirstName !== void 0) formData.firstName = props.initialFirstName;
        if (props.initialLastName !== void 0) formData.lastName = props.initialLastName;
        if (props.initialCustomerPhone !== void 0) formData.customerPhone = props.initialCustomerPhone;
        if (props.initialCustomerAddress !== void 0) formData.customerAddress = props.initialCustomerAddress;
        if (props.initialItemsDescription !== void 0) formData.itemsDescription = props.initialItemsDescription;
      } else {
        (void 0).body.style.overflow = "";
      }
    });
    const progress = computed(() => {
      if (currentStep.value === 4) return 100;
      return Math.round(currentStep.value / totalSteps * 100);
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.isOpen) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-stretch sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"><div class="absolute inset-0"></div><div class="relative bg-white w-full sm:max-w-[720px] sm:max-h-[92vh] h-full sm:h-auto flex flex-col rounded-default shadow-2xl overflow-hidden"><div class="border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0"><div><p class="text-[10px] uppercase tracking-widest text-gray-500 font-tech">${ssrInterpolate(unref(formData).formType === "reklamacia" ? "Reklamácia" : "Vrátenie tovaru")}</p><h2 class="font-tech text-xl font-black uppercase tracking-wide">${ssrInterpolate(unref(currentStep) === 4 ? "Hotovo" : unref(currentStep) === 3 ? "Potvrdenie" : unref(currentStep) === 2 ? "Vaše údaje" : "Objednávka")}</h2></div><button aria-label="Zatvoriť" class="text-gray-500 hover:text-black p-2 -mr-2">`);
          _push2(ssrRenderComponent(unref(X), { class: "w-5 h-5" }, null, _parent));
          _push2(`</button></div>`);
          if (unref(currentStep) <= 3) {
            _push2(`<div class="bg-gray-50 border-b border-gray-100 px-6 py-3 flex-shrink-0"><div class="flex items-center justify-between text-[10px] uppercase tracking-widest font-tech text-gray-500 mb-1.5"><span class="${ssrRenderClass(unref(currentStep) >= 1 ? "text-brand font-bold" : "")}">1 · Objednávka</span><span class="${ssrRenderClass(unref(currentStep) >= 2 ? "text-brand font-bold" : "")}">2 · Vaše údaje</span><span class="${ssrRenderClass(unref(currentStep) >= 3 ? "text-brand font-bold" : "")}">3 · Potvrdenie</span></div><div class="h-1 bg-gray-200 overflow-hidden"><div class="h-full bg-brand transition-all duration-300" style="${ssrRenderStyle({ width: progress.value + "%" })}"></div></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="flex-1 overflow-y-auto scrollbar-hide px-6 py-5">`);
          if (unref(currentStep) === 1) {
            _push2(ssrRenderComponent(ReturnFormStep1, {
              "form-data": unref(formData),
              "order-lookup": unref(orderLookup),
              errors: unref(stepErrors)[1],
              "skip-order-lookup": __props.skipOrderLookup,
              onLookup: unref(debouncedLookup),
              "onUpdate:formType": ($event) => unref(formData).formType = $event
            }, null, _parent));
          } else if (unref(currentStep) === 2) {
            _push2(ssrRenderComponent(ReturnFormStep2, {
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
            _push2(ssrRenderComponent(ReturnFormStep3, {
              "form-data": unref(formData),
              errors: unref(stepErrors)[3],
              "submit-error": unref(submitError)
            }, null, _parent));
          } else if (unref(currentStep) === 4 && unref(submitResult)) {
            _push2(ssrRenderComponent(ReturnFormSuccess, {
              "reference-number": unref(submitResult).referenceNumber,
              email: unref(formData).customerEmail,
              "form-type": unref(formData).formType
            }, null, _parent));
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
          if (unref(currentStep) <= 3) {
            _push2(`<div class="border-t border-gray-100 px-6 py-4 flex items-center justify-between gap-3 flex-shrink-0 bg-white">`);
            if (unref(currentStep) > 1 && !__props.skipOrderLookup) {
              _push2(`<button type="button" class="text-sm font-bold uppercase tracking-wider font-tech text-gray-500 hover:text-black"> ← Späť </button>`);
            } else {
              _push2(`<span></span>`);
            }
            if (unref(currentStep) < 3) {
              _push2(`<button type="button" class="bg-brand text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wider font-tech hover:bg-brand/90 transition-colors disabled:opacity-50"> Pokračovať → </button>`);
            } else {
              _push2(`<button type="button"${ssrIncludeBooleanAttr(unref(isSubmitting) || !unref(formData).gdprConsent) ? " disabled" : ""} class="bg-brand text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wider font-tech hover:bg-brand/90 transition-colors disabled:opacity-50 flex items-center">`);
              if (unref(isSubmitting)) {
                _push2(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 mr-2 animate-spin" }, null, _parent));
              } else {
                _push2(`<!---->`);
              }
              _push2(` Odoslať žiadosť </button>`);
            }
            _push2(`</div>`);
          } else {
            _push2(`<div class="border-t border-gray-100 px-6 py-4 flex justify-center"><button type="button" class="bg-brand text-white px-8 py-2.5 text-sm font-bold uppercase tracking-wider font-tech hover:bg-brand/90 transition-colors"> Zatvoriť </button></div>`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/returns/ReturnFormModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ReturnFormModal = Object.assign(_sfc_main, { __name: "ReturnFormModal" });

export { ReturnFormModal as default };
