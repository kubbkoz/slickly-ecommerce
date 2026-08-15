import { defineComponent, computed, ref, mergeProps, withCtx, unref, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { Plus, Loader2, RotateCcw, Wrench, Package } from 'lucide-vue-next';
import { f as useUser, h as useAsyncData } from './server.mjs';
import BaseButton from './BaseButton-BJMOoNbK.mjs';
import ReturnFormModal from './ReturnFormModal-DM7PpMMO.mjs';
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
import './useReturnForm-BPYvUkOC.mjs';
import './ReturnFormStep1-J6OeDrR0.mjs';
import './ReturnFormStep2-DMCLLvW8.mjs';
import './ReturnFormStep3-BmRowXns.mjs';
import './ReturnFormSuccess-CYofRI6H.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AccountTabReklamacie",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useUser();
    const userEmail = computed(() => user.value?.email || "");
    const userPhone = computed(() => {
      const u = user.value;
      return u?.defaultBillingAddress?.phoneNumber || u?.defaultShippingAddress?.phoneNumber || "";
    });
    const formatAddress = (addr) => {
      if (!addr) return "";
      const parts = [];
      if (addr.street) parts.push(String(addr.street));
      const cityLine = [addr.zipcode, addr.city].filter(Boolean).join(" ");
      if (cityLine) parts.push(cityLine);
      if (addr.country?.name || addr.country?.translated?.name) {
        parts.push(addr.country?.translated?.name || addr.country?.name);
      }
      return parts.join("\n");
    };
    const userAddress = computed(() => {
      const u = user.value;
      return formatAddress(u?.defaultBillingAddress) || formatAddress(u?.defaultShippingAddress) || "";
    });
    const { data, pending, error, refresh } = useAsyncData(
      () => `account-returns-${userEmail.value}`,
      async () => {
        if (!userEmail.value) return { total: 0, elements: [] };
        return await $fetch("/api/account/returns", {
          params: { email: userEmail.value }
        });
      },
      { default: () => ({ total: 0, elements: [] }), watch: [userEmail] }
    );
    const requests = computed(() => data.value?.elements ?? []);
    const isEmpty = computed(() => !pending.value && requests.value.length === 0);
    const isModalOpen = ref(false);
    const modalFormType = ref("reklamacia");
    const openModal = (type) => {
      modalFormType.value = type;
      isModalOpen.value = true;
    };
    const onSubmitted = async () => {
      setTimeout(() => refresh(), 1500);
    };
    const formatDate = (iso) => {
      try {
        return new Date(iso).toLocaleDateString("sk-SK", { day: "2-digit", month: "2-digit", year: "numeric" });
      } catch {
        return iso;
      }
    };
    const typeLabel = (t) => t === "reklamacia" ? "Reklamácia" : "Vrátenie";
    const typeClass = (t) => t === "reklamacia" ? "text-orange-700 bg-orange-50 border-orange-200" : "text-blue-700 bg-blue-50 border-blue-200";
    const statusLabel = (s) => {
      switch (s) {
        case "received":
          return "Prijatá";
        case "processing":
          return "Spracováva sa";
        case "approved":
          return "Schválená";
        case "rejected":
          return "Zamietnutá";
        default:
          return s;
      }
    };
    const statusClass = (s) => {
      switch (s) {
        case "approved":
          return "bg-green-50 text-green-700 border border-green-200";
        case "rejected":
          return "bg-red-50 text-red-700 border border-red-200";
        case "processing":
          return "bg-blue-50 text-blue-700 border border-blue-200";
        case "received":
        default:
          return "bg-gray-100 text-gray-700 border border-gray-200";
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white p-8 shadow-sm animate-fade-in" }, _attrs))}><div class="flex items-center justify-between mb-8"><h2 class="text-xl font-black uppercase tracking-wide font-tech">Reklamácie a vrátenie</h2>`);
      if (!isEmpty.value) {
        _push(ssrRenderComponent(BaseButton, {
          variant: "primary",
          size: "sm",
          onClick: ($event) => openModal("reklamacia")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Plus), { class: "w-3.5 h-3.5 mr-2" }, null, _parent2, _scopeId));
              _push2(` Nová žiadosť `);
            } else {
              return [
                createVNode(unref(Plus), { class: "w-3.5 h-3.5 mr-2" }),
                createTextVNode(" Nová žiadosť ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(pending)) {
        _push(`<div class="py-16 flex justify-center">`);
        _push(ssrRenderComponent(unref(Loader2), { class: "w-8 h-8 text-gray-300 animate-spin" }, null, _parent));
        _push(`</div>`);
      } else if (isEmpty.value) {
        _push(`<div class="bg-gray-50 py-20 px-8 border border-gray-100 text-center flex flex-col items-center justify-center">`);
        _push(ssrRenderComponent(unref(RotateCcw), { class: "w-12 h-12 text-gray-300 mb-6" }, null, _parent));
        _push(`<h3 class="text-[13px] font-bold uppercase tracking-widest text-gray-600 mb-3">Žiadne aktívne prípady</h3><p class="text-gray-400 text-sm mb-8 max-w-md">Momentálne neevidujeme žiadne reklamácie ani vrátenia tovaru.</p><div class="flex flex-col sm:flex-row gap-3"><button class="border-2 border-brand text-brand px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-brand hover:text-white transition-colors bg-white flex items-center justify-center">`);
        _push(ssrRenderComponent(unref(RotateCcw), { class: "w-3.5 h-3.5 mr-2" }, null, _parent));
        _push(` Vrátenie tovaru </button><button class="border-2 border-gray-300 text-gray-700 px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:border-brand hover:text-brand transition-colors bg-white flex items-center justify-center">`);
        _push(ssrRenderComponent(unref(Wrench), { class: "w-3.5 h-3.5 mr-2" }, null, _parent));
        _push(` Nová reklamácia </button></div></div>`);
      } else {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(requests.value, (req) => {
          _push(`<div class="border border-gray-200 hover:border-brand transition-colors p-4 sm:p-5"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div class="flex-1"><div class="flex items-center gap-2 mb-1"><span class="font-tech text-base font-bold tracking-wider">${ssrInterpolate(req.referenceNumber)}</span><span class="${ssrRenderClass([typeClass(req.formType), "text-[10px] px-2 py-0.5 uppercase tracking-wider font-tech font-bold border"])}">${ssrInterpolate(typeLabel(req.formType))}</span></div><div class="text-xs text-gray-500 flex items-center gap-3 flex-wrap"><span class="flex items-center">`);
          _push(ssrRenderComponent(unref(Package), { class: "w-3 h-3 mr-1" }, null, _parent));
          _push(` Objednávka #${ssrInterpolate(req.orderNumber)}</span><span>·</span><span>${ssrInterpolate(formatDate(req.createdAt))}</span></div></div><div><span class="${ssrRenderClass([statusClass(req.status), "text-[10px] px-3 py-1.5 uppercase tracking-wider font-tech font-bold"])}">${ssrInterpolate(statusLabel(req.status))}</span></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(ssrRenderComponent(ReturnFormModal, {
        "is-open": isModalOpen.value,
        "initial-form-type": modalFormType.value,
        "initial-email": userEmail.value,
        "initial-first-name": unref(user)?.firstName,
        "initial-last-name": unref(user)?.lastName,
        "initial-customer-phone": userPhone.value,
        "initial-customer-address": userAddress.value,
        onClose: ($event) => isModalOpen.value = false,
        onSubmitted
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/account/AccountTabReklamacie.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main, { __name: "AccountTabReklamacie" });

export { __nuxt_component_5 as default };
