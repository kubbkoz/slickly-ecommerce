import { defineComponent, computed, ref, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderTeleport, ssrRenderAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { Plus, ShieldCheck, MapPin, Tag, CheckCircle, Edit2, Loader2, Trash2, X, XCircle, AlertCircle } from 'lucide-vue-next';
import { _ as _export_sfc, e as useShopwareContext, f as useUser } from './server.mjs';
import { u as useCountries } from './useCountries-DcMVa9Fw.mjs';
import { u as useSalutations } from './useSalutations-BJL9Pq5t.mjs';
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
  __name: "AccountTabAdresy",
  __ssrInlineRender: true,
  props: {
    customerAddresses: {},
    user: {}
  },
  emits: ["refresh"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useShopwareContext();
    const { getCountries } = useCountries();
    const { getSalutations } = useSalutations();
    useUser();
    const sortedAddresses = computed(() => {
      if (!props.customerAddresses) return [];
      return [...props.customerAddresses].sort((a, b) => {
        const aDef = a.id === props.user?.defaultBillingAddressId || a.id === props.user?.defaultShippingAddressId;
        const bDef = b.id === props.user?.defaultBillingAddressId || b.id === props.user?.defaultShippingAddressId;
        if (aDef && !bDef) return -1;
        if (!aDef && bDef) return 1;
        return 0;
      });
    });
    const isDrawerOpen = ref(false);
    const isEditing = ref(false);
    const isSaving = ref(false);
    const error = ref(null);
    const viesStatus = ref("idle");
    const viesCompanyName = ref("");
    const viesError = ref("");
    let viesDebounceTimer = null;
    async function validateVies(vatId) {
      const cleaned = vatId.trim().replace(/\s/g, "");
      if (!cleaned || cleaned.length < 4) {
        viesStatus.value = "idle";
        viesCompanyName.value = "";
        viesError.value = "";
        return;
      }
      if (!/^[A-Za-z]{2}\d{2,}/.test(cleaned)) {
        viesStatus.value = "idle";
        viesError.value = "Formát: SK1234567890";
        return;
      }
      viesStatus.value = "loading";
      viesCompanyName.value = "";
      viesError.value = "";
      try {
        const result = await $fetch("/api/vies-validate", {
          query: { vatId: cleaned }
        });
        if (result.valid) {
          viesStatus.value = "valid";
          viesCompanyName.value = result.name || "";
          viesError.value = "";
          if (result.name) {
            form.value.company = result.name;
          }
          if (cleaned.startsWith("SK") || cleaned.startsWith("CZ")) {
            form.value.dic = cleaned.substring(2);
          }
        } else {
          viesStatus.value = "invalid";
          viesCompanyName.value = "";
          viesError.value = result.error || "IČ DPH nie je registrované v systéme VIES.";
        }
      } catch (err) {
        viesStatus.value = "error";
        viesCompanyName.value = "";
        viesError.value = err?.data?.message || err?.statusMessage || "VIES služba nedostupná.";
      }
    }
    const form = ref({
      id: "",
      salutationId: "",
      firstName: "",
      lastName: "",
      isCompany: false,
      company: "",
      vatId: "",
      ico: "",
      dic: "",
      phoneNumber: "",
      email: "",
      street: "",
      zipcode: "",
      city: "",
      countryId: "",
      isDefaultBilling: false,
      isDefaultShipping: false
    });
    watch(() => form.value.vatId, (newVal) => {
      if (viesDebounceTimer) clearTimeout(viesDebounceTimer);
      if (!newVal?.trim()) {
        viesStatus.value = "idle";
        viesCompanyName.value = "";
        viesError.value = "";
        return;
      }
      viesDebounceTimer = setTimeout(() => {
        validateVies(newVal);
      }, 800);
    });
    watch(() => form.value.isCompany, (isCompany) => {
      if (!isCompany) {
        form.value.company = "";
        form.value.vatId = "";
        form.value.ico = "";
        form.value.dic = "";
        viesStatus.value = "idle";
        viesCompanyName.value = "";
        viesError.value = "";
      }
    });
    const isDeleting = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "animate-fade-in bg-white p-8 shadow-sm relative" }, _attrs))} data-v-1cd13f98><div class="flex justify-between items-center mb-8 border-b border-gray-100 pb-5" data-v-1cd13f98><h2 class="text-xl font-black uppercase tracking-wide font-tech" data-v-1cd13f98>Moje adresy</h2><button class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black border border-gray-200 hover:border-black px-5 py-2.5 transition-colors" data-v-1cd13f98>`);
      _push(ssrRenderComponent(unref(Plus), { class: "w-3.5 h-3.5" }, null, _parent));
      _push(` Pridať adresu </button></div>`);
      if (sortedAddresses.value && sortedAddresses.value.length > 0) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-v-1cd13f98><!--[-->`);
        ssrRenderList(sortedAddresses.value, (addr) => {
          _push(`<div class="${ssrRenderClass([addr.id === __props.user?.defaultBillingAddressId || addr.id === __props.user?.defaultShippingAddressId ? "border-l-4 border-l-brand" : "hover:border-black", "bg-gray-50 border border-gray-100 p-6 relative group transition-all"])}" data-v-1cd13f98><div class="absolute top-4 right-4 flex gap-2" data-v-1cd13f98>`);
          if (addr.id === __props.user?.defaultBillingAddressId) {
            _push(`<span class="text-[9px] font-bold text-white bg-brand px-2 py-0.5 uppercase tracking-wide flex items-center gap-1" data-v-1cd13f98>`);
            _push(ssrRenderComponent(unref(ShieldCheck), { class: "w-3 h-3" }, null, _parent));
            _push(` Fakturačná</span>`);
          } else {
            _push(`<!---->`);
          }
          if (addr.id === __props.user?.defaultShippingAddressId) {
            _push(`<span class="text-[9px] font-bold text-white bg-black px-2 py-0.5 uppercase tracking-wide flex items-center gap-1" data-v-1cd13f98>`);
            _push(ssrRenderComponent(unref(MapPin), { class: "w-3 h-3" }, null, _parent));
            _push(` Dodacia</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="mb-4 pr-32" data-v-1cd13f98><h3 class="font-bold text-base text-black mb-1 capitalize" data-v-1cd13f98>${ssrInterpolate(addr.firstName)} ${ssrInterpolate(addr.lastName)}</h3>`);
          if (addr.company) {
            _push(`<p class="text-xs font-bold text-gray-500 flex items-center gap-1 mb-1" data-v-1cd13f98>`);
            _push(ssrRenderComponent(unref(Tag), { class: "w-3 h-3" }, null, _parent));
            _push(` ${ssrInterpolate(addr.company)}</p>`);
          } else {
            _push(`<!---->`);
          }
          if (addr.company || addr.customFields?.mtsport_ico) {
            _push(`<div class="mt-2 text-xs text-gray-500 space-y-1 mb-3" data-v-1cd13f98>`);
            if (addr.customFields?.mtsport_ico) {
              _push(`<p data-v-1cd13f98>IČO: ${ssrInterpolate(addr.customFields.mtsport_ico)}</p>`);
            } else {
              _push(`<!---->`);
            }
            if (addr.customFields?.mtsport_dic) {
              _push(`<p data-v-1cd13f98>DIČ: ${ssrInterpolate(addr.customFields.mtsport_dic)}</p>`);
            } else {
              _push(`<!---->`);
            }
            if (__props.user?.vatIds?.[0] && addr.id === __props.user?.defaultBillingAddressId) {
              _push(`<p class="flex items-center gap-1.5" data-v-1cd13f98> IČ DPH: ${ssrInterpolate(__props.user.vatIds[0])} <span class="relative group/vies flex items-center cursor-help" data-v-1cd13f98>`);
              _push(ssrRenderComponent(unref(CheckCircle), { class: "w-3 h-3 text-green-500" }, null, _parent));
              _push(`<span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/vies:block w-max bg-black text-white text-[9px] px-2 py-1 uppercase tracking-widest z-10 whitespace-nowrap" data-v-1cd13f98>Overené cez VIES</span></span></p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><p class="text-sm text-gray-600 leading-relaxed" data-v-1cd13f98>${ssrInterpolate(addr.street)}<br data-v-1cd13f98> ${ssrInterpolate(addr.zipcode)} ${ssrInterpolate(addr.city)}<br data-v-1cd13f98> ${ssrInterpolate(addr.country?.name || "Slovensko")}</p><div class="flex flex-wrap items-center gap-4 mt-6 border-t border-gray-100 pt-4" data-v-1cd13f98><button class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-black hover:text-brand transition-colors" data-v-1cd13f98>`);
          _push(ssrRenderComponent(unref(Edit2), { class: "w-3 h-3" }, null, _parent));
          _push(` Upraviť </button><button class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"${ssrIncludeBooleanAttr(isDeleting.value === addr.id) ? " disabled" : ""} data-v-1cd13f98>`);
          if (isDeleting.value === addr.id) {
            _push(ssrRenderComponent(unref(Loader2), { class: "w-3 h-3 animate-spin" }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(Trash2), { class: "w-3 h-3" }, null, _parent));
          }
          _push(` Zmazať </button><div class="flex-1" data-v-1cd13f98></div><div class="flex gap-2 flex-col sm:flex-row items-end sm:items-center mt-2 sm:mt-0 w-full sm:w-auto border-t border-gray-100 sm:border-0 pt-3 sm:pt-0" data-v-1cd13f98>`);
          if (addr.id !== __props.user?.defaultBillingAddressId) {
            _push(`<button class="text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand transition-colors underline" data-v-1cd13f98> Nastaviť ako fakturačnú </button>`);
          } else {
            _push(`<!---->`);
          }
          if (addr.id !== __props.user?.defaultShippingAddressId) {
            _push(`<button class="text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors underline" data-v-1cd13f98> Nastaviť ako dodaciu </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="py-16 text-center text-sm text-gray-400 bg-gray-50 border border-gray-100" data-v-1cd13f98> Nemáte uložené žiadne adresy. </div>`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (isDrawerOpen.value) {
          _push2(`<div class="fixed inset-0 z-50 flex justify-end font-sans" data-v-1cd13f98><div class="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" data-v-1cd13f98></div><div class="relative w-full md:w-[440px] bg-white h-full shadow-2xl flex flex-col animate-slide-in-right" data-v-1cd13f98><div class="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white z-10" data-v-1cd13f98><h2 class="text-xl font-bold font-sans uppercase tracking-[0.2em] text-black" data-v-1cd13f98>${ssrInterpolate(isEditing.value ? "Úprava adresy" : "Nová adresa")}</h2><button class="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-black hover:text-white transition-colors text-black shrink-0" data-v-1cd13f98>`);
          _push2(ssrRenderComponent(unref(X), { class: "w-5 h-5" }, null, _parent));
          _push2(`</button></div><div class="flex-1 overflow-y-auto px-8 py-6 scrollbar-hide" data-v-1cd13f98><form id="address-form" class="space-y-6 pb-20" data-v-1cd13f98>`);
          if (error.value) {
            _push2(`<div class="bg-red-50 text-red-600 p-4 text-sm flex gap-3 border border-red-100" data-v-1cd13f98>`);
            _push2(ssrRenderComponent(unref(X), { class: "w-5 h-5 shrink-0" }, null, _parent));
            _push2(` ${ssrInterpolate(error.value)}</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="space-y-4" data-v-1cd13f98><h3 class="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2" data-v-1cd13f98>Kontaktné údaje</h3><div class="grid grid-cols-2 gap-4" data-v-1cd13f98><div class="col-span-2" data-v-1cd13f98><label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2" data-v-1cd13f98>Oslovenie *</label><select required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-medium focus:border-black outline-none transition-colors" data-v-1cd13f98><!--[-->`);
          ssrRenderList(unref(getSalutations), (s) => {
            _push2(`<option${ssrRenderAttr("value", s.id)} data-v-1cd13f98${ssrIncludeBooleanAttr(Array.isArray(form.value.salutationId) ? ssrLooseContain(form.value.salutationId, s.id) : ssrLooseEqual(form.value.salutationId, s.id)) ? " selected" : ""}>${ssrInterpolate(s.displayName)}</option>`);
          });
          _push2(`<!--]--></select></div><div data-v-1cd13f98><label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2" data-v-1cd13f98>Meno *</label><input${ssrRenderAttr("value", form.value.firstName)} type="text" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-medium focus:border-black outline-none transition-colors" data-v-1cd13f98></div><div data-v-1cd13f98><label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2" data-v-1cd13f98>Priezvisko *</label><input${ssrRenderAttr("value", form.value.lastName)} type="text" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-medium focus:border-black outline-none transition-colors" data-v-1cd13f98></div><div class="col-span-2 sm:col-span-1" data-v-1cd13f98><label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2" data-v-1cd13f98>Telefón</label><input${ssrRenderAttr("value", form.value.phoneNumber)} type="tel" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-medium focus:border-black outline-none transition-colors" data-v-1cd13f98></div><div class="col-span-2 sm:col-span-1" data-v-1cd13f98><label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2" data-v-1cd13f98>E-mail (voliteľné)</label><input${ssrRenderAttr("value", form.value.email)} type="email" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-medium focus:border-black outline-none transition-colors" data-v-1cd13f98></div></div></div><div class="space-y-4 mt-6" data-v-1cd13f98><h3 class="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2" data-v-1cd13f98>Nastavenia adresy</h3><div class="flex flex-col gap-3" data-v-1cd13f98><label class="flex items-center gap-3 cursor-pointer group" data-v-1cd13f98><div class="${ssrRenderClass([form.value.isDefaultBilling ? "bg-black border-black" : "bg-white", "relative flex items-center justify-center w-5 h-5 border border-gray-300 group-hover:border-black transition-colors"])}" data-v-1cd13f98>`);
          if (form.value.isDefaultBilling) {
            _push2(ssrRenderComponent(unref(CheckCircle), { class: "w-3.5 h-3.5 text-white" }, null, _parent));
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(form.value.isDefaultBilling) ? ssrLooseContain(form.value.isDefaultBilling, null) : form.value.isDefaultBilling) ? " checked" : ""} class="hidden" data-v-1cd13f98><span class="text-[11px] font-bold uppercase tracking-widest text-black" data-v-1cd13f98>Nastaviť ako predvolenú fakturačnú</span></label><label class="flex items-center gap-3 cursor-pointer group" data-v-1cd13f98><div class="${ssrRenderClass([form.value.isDefaultShipping ? "bg-black border-black" : "bg-white", "relative flex items-center justify-center w-5 h-5 border border-gray-300 group-hover:border-black transition-colors"])}" data-v-1cd13f98>`);
          if (form.value.isDefaultShipping) {
            _push2(ssrRenderComponent(unref(CheckCircle), { class: "w-3.5 h-3.5 text-white" }, null, _parent));
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(form.value.isDefaultShipping) ? ssrLooseContain(form.value.isDefaultShipping, null) : form.value.isDefaultShipping) ? " checked" : ""} class="hidden" data-v-1cd13f98><span class="text-[11px] font-bold uppercase tracking-widest text-black" data-v-1cd13f98>Nastaviť ako predvolenú dodaciu</span></label></div></div><div class="space-y-4 mt-6" data-v-1cd13f98><div class="flex items-center justify-between border-b border-gray-100 pb-2" data-v-1cd13f98><h3 class="text-[10px] font-bold uppercase tracking-widest text-gray-400" data-v-1cd13f98>Firemné údaje</h3><label class="flex items-center gap-2 cursor-pointer group" data-v-1cd13f98><span class="text-[10px] font-bold text-black uppercase tracking-widest" data-v-1cd13f98>Nakupujem na firmu</span><div class="${ssrRenderClass([form.value.isCompany ? "bg-black border-black" : "bg-white", "relative flex items-center justify-center w-4 h-4 border border-gray-300 group-hover:border-black transition-colors"])}" data-v-1cd13f98>`);
          if (form.value.isCompany) {
            _push2(ssrRenderComponent(unref(CheckCircle), { class: "w-3 h-3 text-white" }, null, _parent));
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(form.value.isCompany) ? ssrLooseContain(form.value.isCompany, null) : form.value.isCompany) ? " checked" : ""} class="hidden" data-v-1cd13f98></label></div>`);
          if (form.value.isCompany) {
            _push2(`<div class="animate-fade-in space-y-4 mt-4" data-v-1cd13f98><div data-v-1cd13f98><label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2" data-v-1cd13f98> IČ DPH * `);
            if (viesStatus.value === "valid") {
              _push2(`<span class="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 tracking-wider flex items-center gap-1" data-v-1cd13f98>`);
              _push2(ssrRenderComponent(unref(CheckCircle), { class: "w-3 h-3" }, null, _parent));
              _push2(` Overené VIES </span>`);
            } else if (viesStatus.value === "invalid") {
              _push2(`<span class="text-[9px] text-red-600 bg-red-50 px-1.5 py-0.5 tracking-wider flex items-center gap-1" data-v-1cd13f98>`);
              _push2(ssrRenderComponent(unref(XCircle), { class: "w-3 h-3" }, null, _parent));
              _push2(` Neplatné </span>`);
            } else if (viesStatus.value === "error") {
              _push2(`<span class="text-[9px] text-amber-600 bg-amber-50 px-1.5 py-0.5 tracking-wider flex items-center gap-1" data-v-1cd13f98>`);
              _push2(ssrRenderComponent(unref(AlertCircle), { class: "w-3 h-3" }, null, _parent));
              _push2(` Nedostupné </span>`);
            } else {
              _push2(`<span class="text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 tracking-wider" data-v-1cd13f98>Validované cez VIES</span>`);
            }
            _push2(`</label><div class="relative" data-v-1cd13f98><input${ssrRenderAttr("value", form.value.vatId)} type="text" placeholder="SK..." class="${ssrRenderClass([{
              "border-green-400 bg-green-50/30": viesStatus.value === "valid",
              "border-red-400 bg-red-50/30": viesStatus.value === "invalid",
              "border-amber-400": viesStatus.value === "error",
              "border-gray-200 focus:border-black": viesStatus.value === "idle" || viesStatus.value === "loading"
            }, "w-full px-4 py-3 pr-12 bg-gray-50 border text-sm font-medium outline-none transition-colors"])}" data-v-1cd13f98><div class="absolute right-3 top-1/2 -translate-y-1/2" data-v-1cd13f98>`);
            if (viesStatus.value === "loading") {
              _push2(ssrRenderComponent(unref(Loader2), { class: "w-5 h-5 text-gray-400 animate-spin" }, null, _parent));
            } else if (viesStatus.value === "valid") {
              _push2(ssrRenderComponent(unref(CheckCircle), { class: "w-5 h-5 text-green-500" }, null, _parent));
            } else if (viesStatus.value === "invalid") {
              _push2(ssrRenderComponent(unref(XCircle), { class: "w-5 h-5 text-red-500" }, null, _parent));
            } else if (viesStatus.value === "error") {
              _push2(ssrRenderComponent(unref(AlertCircle), { class: "w-5 h-5 text-amber-500" }, null, _parent));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
            if (viesStatus.value === "invalid" && viesError.value) {
              _push2(`<p class="mt-1.5 text-[11px] text-red-600" data-v-1cd13f98>${ssrInterpolate(viesError.value)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (viesStatus.value === "error" && viesError.value) {
              _push2(`<p class="mt-1.5 text-[11px] text-amber-600" data-v-1cd13f98>${ssrInterpolate(viesError.value)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div data-v-1cd13f98><label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2" data-v-1cd13f98> Názov spoločnosti * `);
            if (viesStatus.value === "valid" && viesCompanyName.value) {
              _push2(`<span class="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 tracking-wider flex items-center gap-1" data-v-1cd13f98>`);
              _push2(ssrRenderComponent(unref(ShieldCheck), { class: "w-3 h-3" }, null, _parent));
              _push2(` z VIES </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</label><input${ssrRenderAttr("value", form.value.company)} type="text"${ssrIncludeBooleanAttr(form.value.isCompany) ? " required" : ""} class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-medium focus:border-black outline-none transition-colors" data-v-1cd13f98></div><div class="grid grid-cols-2 gap-4" data-v-1cd13f98><div class="col-span-2 sm:col-span-1" data-v-1cd13f98><label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2" data-v-1cd13f98>IČO *</label><input${ssrRenderAttr("value", form.value.ico)} type="text"${ssrIncludeBooleanAttr(form.value.isCompany) ? " required" : ""} class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-medium focus:border-black outline-none transition-colors" data-v-1cd13f98></div><div class="col-span-2 sm:col-span-1" data-v-1cd13f98><label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2" data-v-1cd13f98>DIČ</label><input${ssrRenderAttr("value", form.value.dic)} type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-medium focus:border-black outline-none transition-colors" data-v-1cd13f98></div></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="space-y-4 mt-6" data-v-1cd13f98><h3 class="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2" data-v-1cd13f98>Doručovacia adresa</h3><div class="col-span-2" data-v-1cd13f98><label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2" data-v-1cd13f98>Ulica a číslo *</label><input${ssrRenderAttr("value", form.value.street)} type="text" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-medium focus:border-black outline-none transition-colors" data-v-1cd13f98></div><div class="grid grid-cols-2 gap-4" data-v-1cd13f98><div data-v-1cd13f98><label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2" data-v-1cd13f98>PSČ *</label><input${ssrRenderAttr("value", form.value.zipcode)} type="text" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-medium focus:border-black outline-none transition-colors" data-v-1cd13f98></div><div data-v-1cd13f98><label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2" data-v-1cd13f98>Mesto *</label><input${ssrRenderAttr("value", form.value.city)} type="text" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-medium focus:border-black outline-none transition-colors" data-v-1cd13f98></div></div><div class="col-span-2" data-v-1cd13f98><label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2" data-v-1cd13f98>Krajina *</label><select required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm font-medium focus:border-black outline-none transition-colors" data-v-1cd13f98><!--[-->`);
          ssrRenderList(unref(getCountries), (c) => {
            _push2(`<option${ssrRenderAttr("value", c.id)} data-v-1cd13f98${ssrIncludeBooleanAttr(Array.isArray(form.value.countryId) ? ssrLooseContain(form.value.countryId, c.id) : ssrLooseEqual(form.value.countryId, c.id)) ? " selected" : ""}>${ssrInterpolate(c.translated?.name || c.name || "Neznáma krajina")}</option>`);
          });
          _push2(`<!--]--></select></div></div></form></div><div class="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-10" data-v-1cd13f98><button type="submit" form="address-form"${ssrIncludeBooleanAttr(isSaving.value) ? " disabled" : ""} class="w-full h-14 bg-brand text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-brand-dark transition-colors flex items-center justify-center" data-v-1cd13f98>`);
          if (isSaving.value) {
            _push2(ssrRenderComponent(unref(Loader2), { class: "w-5 h-5 animate-spin mr-2" }, null, _parent));
          } else {
            _push2(`<!---->`);
          }
          if (!isSaving.value) {
            _push2(`<span data-v-1cd13f98>${ssrInterpolate(isEditing.value ? "Uložiť zmeny" : "Pridať adresu")}</span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/account/AccountTabAdresy.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-1cd13f98"]]), { __name: "AccountTabAdresy" });

export { __nuxt_component_4 as default };
