import { _ as __nuxt_component_0 } from './nuxt-link-B7B0pxEe.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain } from 'vue/server-renderer';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-vue-next';
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
import './server.mjs';
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
  __name: "ReturnFormStep3",
  __ssrInlineRender: true,
  props: {
    formData: {},
    errors: {},
    submitError: {}
  },
  setup(__props) {
    const props = __props;
    const typeLabel = computed(
      () => props.formData.formType === "reklamacia" ? "Reklamácia" : "Vrátenie tovaru"
    );
    const summary = computed(() => [
      { label: "Typ žiadosti", value: typeLabel.value },
      { label: "Číslo objednávky", value: props.formData.orderNumber },
      { label: "Dátum objednávky", value: props.formData.orderDate || "—" },
      { label: "Číslo faktúry", value: props.formData.invoiceNumber || "—" },
      { label: "Meno", value: `${props.formData.firstName} ${props.formData.lastName}`.trim() },
      { label: "Email", value: props.formData.customerEmail },
      { label: "Telefón", value: props.formData.customerPhone },
      { label: "Adresa", value: props.formData.customerAddress },
      ...props.formData.bankAccount ? [{ label: "IBAN", value: props.formData.bankAccount }] : [],
      { label: "Popis tovaru", value: props.formData.itemsDescription },
      { label: "Dôvod", value: props.formData.reasonDetail },
      { label: "Príloh", value: `${props.formData.attachmentPaths.length} (fotky/videá), ${props.formData.warrantyPaths.length} (záručný list)` }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-5" }, _attrs))}><h3 class="text-sm font-bold uppercase tracking-widest font-tech text-gray-700"> Súhrn žiadosti </h3><div class="border border-gray-200 divide-y divide-gray-100 text-sm"><!--[-->`);
      ssrRenderList(summary.value, (row) => {
        _push(`<div class="flex flex-col sm:flex-row sm:justify-between py-3 px-4 gap-1"><span class="text-gray-500 font-medium text-xs uppercase tracking-wider font-tech">${ssrInterpolate(row.label)}</span><span class="text-gray-900 font-medium sm:text-right sm:max-w-[60%] whitespace-pre-line">${ssrInterpolate(row.value)}</span></div>`);
      });
      _push(`<!--]--></div><div class="border border-gray-200 p-4 bg-gray-50"><p class="text-xs uppercase tracking-widest font-tech text-gray-500 mb-2"> Tovar zasielajte na adresu: </p><p class="font-bold font-tech text-lg mb-1">SLICKLY</p><p class="text-sm text-gray-700 flex items-start mb-2">`);
      _push(ssrRenderComponent(unref(MapPin), { class: "w-4 h-4 mr-2 text-brand mt-0.5 flex-shrink-0" }, null, _parent));
      _push(` [adresa pre vrátenie — doplniť] </p><div class="flex flex-wrap gap-4 text-xs"><a href="tel:+421918564238" class="flex items-center text-gray-700 hover:text-brand">`);
      _push(ssrRenderComponent(unref(Phone), { class: "w-3.5 h-3.5 mr-1" }, null, _parent));
      _push(` 0918 564 238 </a><a href="mailto:info@slickly.sk" class="flex items-center text-gray-700 hover:text-brand">`);
      _push(ssrRenderComponent(unref(Mail), { class: "w-3.5 h-3.5 mr-1" }, null, _parent));
      _push(` info@slickly.sk </a></div></div><label class="flex items-start cursor-pointer"><input${ssrIncludeBooleanAttr(Array.isArray(__props.formData.gdprConsent) ? ssrLooseContain(__props.formData.gdprConsent, null) : __props.formData.gdprConsent) ? " checked" : ""} type="checkbox" class="mt-1 mr-3 w-4 h-4 accent-brand"><span class="text-sm text-gray-700 leading-relaxed"> Potvrdzujem, že všetky uvedené údaje sú správne a súhlasím s podaním žiadosti podľa § 20a zákona č. 108/2024 Z. z. o ochrane spotrebiteľa. </span></label>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/poucenie-o-uplatneni-prava-spotrebitela",
        target: "_blank",
        class: "inline-flex items-center text-xs text-brand hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ExternalLink), { class: "w-3 h-3 mr-1" }, null, _parent2, _scopeId));
            _push2(` Prečítať poučenie o uplatnení práva spotrebiteľa `);
          } else {
            return [
              createVNode(unref(ExternalLink), { class: "w-3 h-3 mr-1" }),
              createTextVNode(" Prečítať poučenie o uplatnení práva spotrebiteľa ")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (__props.formData.formType === "vratenie") {
        _push(`<p class="text-xs text-gray-500 italic"> Kúpna cena bude vrátená na IBAN po doručení a skontrolovaní tovaru, do 14 dní od doručenia. </p>`);
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
      if (__props.submitError) {
        _push(`<div class="border border-brand bg-brand/5 p-3 text-sm text-brand"><strong>Chyba pri odoslaní:</strong> ${ssrInterpolate(__props.submitError)}</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/returns/ReturnFormStep3.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ReturnFormStep3 = Object.assign(_sfc_main, { __name: "ReturnFormStep3" });

export { ReturnFormStep3 as default };
