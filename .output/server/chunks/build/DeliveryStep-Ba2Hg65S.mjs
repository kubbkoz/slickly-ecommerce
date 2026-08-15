import { defineComponent, ref, watch, computed, reactive, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from 'vue/server-renderer';
import { User, Loader2, LogIn, MapPin, Globe, ChevronDown, FileText, Briefcase, CheckCircle, XCircle, AlertCircle, ShieldCheck } from 'lucide-vue-next';
import { f as useUser, a as useCart, g as useState } from './server.mjs';
import { u as useUiState } from './useUiState-BTlUPkrr.mjs';
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

const MAX_NAME_LEN = 35;
const MAX_COMPANY_LEN = 35;
const strip = (v) => (v || "").replace(/[\s\-()/.]/g, "");
const ZIP_RULES = {
  SK: { re: /^\d{3}\s?\d{2}$/, example: "029 51" },
  CZ: { re: /^\d{3}\s?\d{2}$/, example: "100 00" },
  PL: { re: /^\d{2}-?\d{3}$/, example: "00-001" },
  HU: { re: /^\d{4}$/, example: "1011" },
  AT: { re: /^\d{4}$/, example: "1010" },
  DE: { re: /^\d{5}$/, example: "10115" }
};
const ZIP_DEFAULT = { re: /^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/, example: "" };
const PHONE_RULES = {
  SK: /^(\+421|00421|0)\d{9}$/,
  CZ: /^(\+420|00420|0)?\d{9}$/,
  PL: /^(\+48|0048)?\d{9}$/,
  HU: /^(\+36|0036|06)?\d{8,9}$/,
  AT: /^(\+43|0043|0)\d{6,13}$/,
  DE: /^(\+49|0049|0)\d{6,13}$/
};
const PHONE_DEFAULT = /^\+?\d{7,15}$/;
const COMPANY_LABELS = {
  SK: { ico: "IČO", dic: "DIČ", vat: "IČ DPH" },
  CZ: { ico: "IČO", dic: "DIČ", vat: "IČ DPH (DIČ)" },
  PL: { ico: "IČO (REGON)", dic: "DIČ (NIP)", vat: "IČ DPH (NIP)" },
  HU: { ico: "IČO", dic: "DIČ", vat: "IČ DPH (ANUM)" },
  DE: { ico: "IČO", dic: "DIČ", vat: "IČ DPH (USt-IdNr)" },
  AT: { ico: "IČO", dic: "DIČ", vat: "IČ DPH (UID)" }
};
const COMPANY_LABELS_DEFAULT = { ico: "IČO", dic: "DIČ", vat: "IČ DPH" };
function companyLabel(field, iso) {
  return (COMPANY_LABELS[(iso || "").toUpperCase()] || COMPANY_LABELS_DEFAULT)[field];
}
function validateEmail(v) {
  const val = (v || "").trim();
  if (!val) return "Zadajte e-mail.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Neplatný formát e-mailu.";
  return "";
}
function validatePhone(v, iso) {
  const val = (v || "").trim();
  if (!val) return "Zadajte telefónne číslo.";
  const cleaned = strip(val);
  const re = PHONE_RULES[(iso || "").toUpperCase()] || PHONE_DEFAULT;
  if (!re.test(cleaned)) return "Neplatné telefónne číslo pre zvolenú krajinu.";
  return "";
}
function validateZip(v, iso) {
  const val = (v || "").trim();
  if (!val) return "Zadajte PSČ.";
  const rule = ZIP_RULES[(iso || "").toUpperCase()] || ZIP_DEFAULT;
  if (!rule.re.test(val)) {
    return rule.example ? `Neplatné PSČ (napr. ${rule.example}).` : "Neplatné PSČ.";
  }
  return "";
}
function validateStreet(v) {
  const val = (v || "").trim();
  if (!val) return "Zadajte ulicu a číslo.";
  if (val.length < 3) return "Príliš krátka adresa.";
  if (val.length > 60) return "Adresa je príliš dlhá (max 60).";
  return "";
}
function validateCity(v) {
  const val = (v || "").trim();
  if (!val) return "Zadajte mesto.";
  if (val.length < 2) return "Príliš krátky názov mesta.";
  return "";
}
function validateFullName(first, last) {
  const f = (first || "").trim();
  const l = (last || "").trim();
  if (!f) return "Zadajte meno.";
  if (!l) return "Zadajte priezvisko.";
  if (`${f} ${l}`.length > MAX_NAME_LEN) {
    return `Meno a priezvisko spolu max ${MAX_NAME_LEN} znakov (kuriér).`;
  }
  return "";
}
function validateCompany(v) {
  const val = (v || "").trim();
  if (!val) return "Zadajte názov firmy.";
  if (val.length > MAX_COMPANY_LEN) return `Názov firmy max ${MAX_COMPANY_LEN} znakov (kuriér).`;
  return "";
}
function validateIco(v, iso) {
  const val = strip(v || "");
  if (!val) return "Zadajte IČO.";
  const code = (iso || "").toUpperCase();
  if ((code === "SK" || code === "CZ") && !/^\d{8}$/.test(val)) {
    return "IČO musí mať 8 číslic.";
  }
  if (!/^\d{6,12}$/.test(val)) return "Neplatné IČO.";
  return "";
}
function validateDic(v, iso) {
  const val = strip(v || "");
  if (!val) return "";
  const code = (iso || "").toUpperCase();
  if (code === "SK" && !/^\d{10}$/.test(val)) return "DIČ musí mať 10 číslic.";
  if (code === "CZ" && !/^\d{8,10}$/.test(val)) return "DIČ musí mať 8–10 číslic.";
  if (!/^\d{8,12}$/.test(val)) return "Neplatné DIČ.";
  return "";
}
function validateVatFormat(v, iso) {
  const val = strip(v || "").toUpperCase();
  if (!val) return "Zadajte IČ DPH.";
  if (!/^[A-Z]{2}\d{8,12}$/.test(val)) return "Formát: napr. SK2020123456.";
  const code = (iso || "").toUpperCase();
  if (code && /^[A-Z]{2}/.test(val) && !val.startsWith(code)) {
    return `IČ DPH má začínať kódom ${code}.`;
  }
  return "";
}
function validateShippingForm(form, iso, isCompany) {
  const e = {};
  const email = validateEmail(form.email);
  if (email) e.email = email;
  const phone = validatePhone(form.phone, iso);
  if (phone) e.phone = phone;
  const name = validateFullName(form.firstName, form.lastName);
  if (name) {
    if (!form.firstName?.trim()) e.firstName = name;
    else if (!form.lastName?.trim()) e.lastName = name;
    else e.lastName = name;
  }
  if (!form.countryId) e.countryId = "Vyberte krajinu.";
  const street = validateStreet(form.street);
  if (street) e.street = street;
  const city = validateCity(form.city);
  if (city) e.city = city;
  const zip = validateZip(form.zipcode, iso);
  if (zip) e.zipcode = zip;
  if (isCompany) {
    const vat = validateVatFormat(form.icdph || "", iso);
    if (vat) e.icdph = vat;
    const comp = validateCompany(form.company || "");
    if (comp) e.company = comp;
    const ico = validateIco(form.ico || "", iso);
    if (ico) e.ico = ico;
    const dic = validateDic(form.dic || "", iso);
    if (dic) e.dic = dic;
  }
  return e;
}
function validateBillingForm(form, iso) {
  const e = {};
  const name = validateFullName(form.firstName, form.lastName);
  if (name) {
    if (!form.firstName?.trim()) e.firstName = name;
    else e.lastName = name;
  }
  if (!form.countryId) e.countryId = "Vyberte krajinu.";
  const street = validateStreet(form.street);
  if (street) e.street = street;
  const city = validateCity(form.city);
  if (city) e.city = city;
  const zip = validateZip(form.zipcode, iso);
  if (zip) e.zipcode = zip;
  return e;
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DeliveryStep",
  __ssrInlineRender: true,
  props: {
    formData: {},
    billingData: {},
    isBillingDifferent: { type: Boolean },
    isCompanyPurchase: { type: Boolean },
    countries: {},
    shippingMethods: {},
    shippingMethod: {}
  },
  emits: ["update:formData", "update:billingData", "update:isBillingDifferent", "update:isCompanyPurchase", "update:shippingMethod"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { isLoggedIn } = useUser();
    useUiState();
    const { cartItems } = useCart();
    const localForm = ref({ ...props.formData });
    const localBilling = ref({ ...props.billingData });
    useState("loginModalOpen", () => false);
    const emailExists = ref(false);
    const emailCheckLoading = ref(false);
    let emailDebounceTimer = null;
    const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    const runEmailCheck = async (val) => {
      if (!val || !isValidEmail(val)) return;
      if (emailDebounceTimer) {
        clearTimeout(emailDebounceTimer);
        emailDebounceTimer = null;
      }
      emailCheckLoading.value = true;
      try {
        const res = await $fetch("/api/account/check-email", { query: { email: val } });
        emailExists.value = res.exists;
      } catch {
        emailExists.value = false;
      } finally {
        emailCheckLoading.value = false;
      }
    };
    watch(() => localForm.value.email, (val) => {
      emailExists.value = false;
      if (emailDebounceTimer) clearTimeout(emailDebounceTimer);
      if (!val || !isValidEmail(val)) return;
      emailDebounceTimer = setTimeout(() => runEmailCheck(val), 600);
    });
    computed(
      () => !!(localForm.value.firstName && localForm.value.lastName && localForm.value.email && localForm.value.street && localForm.value.city && localForm.value.zipcode && localForm.value.countryId)
    );
    const shippingIso = computed(
      () => (props.countries.find((c) => c.value === localForm.value.countryId)?.iso || "").toUpperCase()
    );
    const billingIso = computed(
      () => (props.countries.find((c) => c.value === localBilling.value.countryId)?.iso || "").toUpperCase()
    );
    const touched = reactive({});
    const billingTouched = reactive({});
    const errors = computed(
      () => validateShippingForm(localForm.value, shippingIso.value, props.isCompanyPurchase)
    );
    const billingErrors = computed(
      () => props.isBillingDifferent ? validateBillingForm(localBilling.value, billingIso.value) : {}
    );
    const fieldErr = (f) => (touched[f] ? errors.value[f] : "") || "";
    const billingErr = (f) => (billingTouched[f] ? billingErrors.value[f] : "") || "";
    const errInputClass = (f) => fieldErr(f) ? "border-red-400 ring-2 ring-red-400/10" : "";
    const billingErrInputClass = (f) => billingErr(f) ? "border-red-400 ring-2 ring-red-400/10" : "";
    const lblIco = computed(() => companyLabel("ico", shippingIso.value));
    const lblDic = computed(() => companyLabel("dic", shippingIso.value));
    const lblVat = computed(() => companyLabel("vat", shippingIso.value));
    const vatPlaceholder = computed(() => {
      const c = props.countries.find((c2) => c2.value === localForm.value.countryId);
      return (c?.iso || "SK") + "...";
    });
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
          if (result.name) localForm.value.company = result.name;
          if (cleaned.startsWith("SK") || cleaned.startsWith("CZ")) {
            localForm.value.dic = cleaned.substring(2);
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
    watch(() => localForm.value.icdph, (newVal) => {
      if (viesDebounceTimer) clearTimeout(viesDebounceTimer);
      if (!newVal?.trim()) {
        viesStatus.value = "idle";
        viesCompanyName.value = "";
        viesError.value = "";
        return;
      }
      viesDebounceTimer = setTimeout(() => validateVies(newVal), 800);
    });
    watch(() => props.isCompanyPurchase, (isCompany) => {
      if (!isCompany) {
        localForm.value.company = "";
        localForm.value.icdph = "";
        localForm.value.ico = "";
        localForm.value.dic = "";
        viesStatus.value = "idle";
        viesCompanyName.value = "";
        viesError.value = "";
      } else if (localForm.value.icdph) {
        validateVies(localForm.value.icdph);
      }
    }, { immediate: true });
    watch(localForm, (val) => {
      emit("update:formData", val);
    }, { deep: true });
    watch(localBilling, (val) => {
      emit("update:billingData", val);
    }, { deep: true });
    watch(() => props.formData, (val) => {
      if (JSON.stringify(localForm.value) !== JSON.stringify(val)) {
        localForm.value = { ...val };
      }
    }, { deep: true });
    watch(() => props.billingData, (val) => {
      if (JSON.stringify(localBilling.value) !== JSON.stringify(val)) {
        localBilling.value = { ...val };
      }
    }, { deep: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4 animate-fade-in font-sans" }, _attrs))}><div class="bg-white border border-gray-200"><div class="flex items-center gap-3 px-5 md:px-6 py-5 border-b border-gray-100 bg-white">`);
      _push(ssrRenderComponent(unref(User), {
        class: "w-4 h-4 text-gray-900",
        "stroke-width": 1.8
      }, null, _parent));
      _push(`<h2 class="text-xs font-bold tracking-[0.2em] text-gray-900 font-sans uppercase leading-none">Kontaktné údaje</h2></div><div class="px-5 md:px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-5"><div class="md:col-span-2"><label class="form-label">Email *</label><div class="relative"><input${ssrRenderAttr("value", unref(localForm).email)} type="email" autocomplete="email" class="${ssrRenderClass([errInputClass("email"), "form-input pr-9"])}" placeholder="vas@email.sk"><div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">`);
      if (unref(emailCheckLoading)) {
        _push(ssrRenderComponent(unref(Loader2), { class: "w-4 h-4 text-gray-400 animate-spin" }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (fieldErr("email")) {
        _push(`<p class="mt-1 text-[11px] text-red-600">${ssrInterpolate(fieldErr("email"))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(emailExists) && !unref(isLoggedIn)) {
        _push(`<div class="mt-2 flex items-center gap-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2">`);
        _push(ssrRenderComponent(unref(LogIn), { class: "w-3.5 h-3.5 flex-shrink-0" }, null, _parent));
        _push(`<span>Na tento e-mail už existuje účet. <button type="button" class="font-bold underline hover:text-brand transition-colors bg-transparent border-0 p-0 cursor-pointer">Chcete sa prihlásiť?</button></span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="form-label">Meno *</label><input${ssrRenderAttr("value", unref(localForm).firstName)} type="text" autocomplete="given-name"${ssrRenderAttr("maxlength", unref(MAX_NAME_LEN))} class="${ssrRenderClass([errInputClass("firstName"), "form-input"])}">`);
      if (fieldErr("firstName")) {
        _push(`<p class="mt-1 text-[11px] text-red-600">${ssrInterpolate(fieldErr("firstName"))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="form-label">Priezvisko *</label><input${ssrRenderAttr("value", unref(localForm).lastName)} type="text" autocomplete="family-name"${ssrRenderAttr("maxlength", unref(MAX_NAME_LEN))} class="${ssrRenderClass([errInputClass("lastName"), "form-input"])}">`);
      if (fieldErr("lastName")) {
        _push(`<p class="mt-1 text-[11px] text-red-600">${ssrInterpolate(fieldErr("lastName"))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="md:col-span-2"><label class="form-label">Telefón *</label><input${ssrRenderAttr("value", unref(localForm).phone)} type="tel" autocomplete="tel" class="${ssrRenderClass([errInputClass("phone"), "form-input"])}" placeholder="+421 9XX XXX XXX">`);
      if (fieldErr("phone")) {
        _push(`<p class="mt-1 text-[11px] text-red-600">${ssrInterpolate(fieldErr("phone"))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><div class="bg-white border border-gray-200"><div class="flex items-center gap-3 px-5 md:px-6 py-5 border-b border-gray-100 bg-white">`);
      _push(ssrRenderComponent(unref(MapPin), {
        class: "w-4 h-4 text-gray-900",
        "stroke-width": 1.8
      }, null, _parent));
      _push(`<h2 class="text-xs font-bold tracking-[0.2em] text-gray-900 font-sans uppercase leading-none">Adresa doručenia</h2></div><div class="px-5 md:px-8 py-6 space-y-5"><div><label class="form-label flex items-center gap-1">`);
      _push(ssrRenderComponent(unref(Globe), { class: "w-3 h-3" }, null, _parent));
      _push(` Krajina *</label><div class="relative"><select class="form-input appearance-none pr-10"><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(localForm).countryId) ? ssrLooseContain(unref(localForm).countryId, "") : ssrLooseEqual(unref(localForm).countryId, "")) ? " selected" : ""}>Vyberte krajinu</option><!--[-->`);
      ssrRenderList(__props.countries, (c) => {
        _push(`<option${ssrRenderAttr("value", c.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(localForm).countryId) ? ssrLooseContain(unref(localForm).countryId, c.value) : ssrLooseEqual(unref(localForm).countryId, c.value)) ? " selected" : ""}>${ssrInterpolate(c.label)}</option>`);
      });
      _push(`<!--]--></select>`);
      _push(ssrRenderComponent(unref(ChevronDown), { class: "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" }, null, _parent));
      _push(`</div></div><div><label class="form-label">Ulica a číslo *</label><input${ssrRenderAttr("value", unref(localForm).street)} type="text" autocomplete="street-address" maxlength="60" class="${ssrRenderClass([errInputClass("street"), "form-input"])}">`);
      if (fieldErr("street")) {
        _push(`<p class="mt-1 text-[11px] text-red-600">${ssrInterpolate(fieldErr("street"))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="grid grid-cols-2 gap-4"><div><label class="form-label">Mesto *</label><input${ssrRenderAttr("value", unref(localForm).city)} type="text" autocomplete="address-level2" class="${ssrRenderClass([errInputClass("city"), "form-input"])}">`);
      if (fieldErr("city")) {
        _push(`<p class="mt-1 text-[11px] text-red-600">${ssrInterpolate(fieldErr("city"))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="form-label">PSČ *</label><input${ssrRenderAttr("value", unref(localForm).zipcode)} type="text" autocomplete="postal-code" class="${ssrRenderClass([errInputClass("zipcode"), "form-input"])}">`);
      if (fieldErr("zipcode")) {
        _push(`<p class="mt-1 text-[11px] text-red-600">${ssrInterpolate(fieldErr("zipcode"))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div><div class="bg-white border border-gray-200 px-5 md:px-8 py-5 space-y-4"><label class="flex items-center gap-3 cursor-pointer group"><div class="relative flex items-center justify-center w-4 h-4 border border-gray-300 group-hover:border-black transition-colors bg-white flex-shrink-0"><input type="checkbox" class="sr-only"${ssrIncludeBooleanAttr(__props.isBillingDifferent) ? " checked" : ""}>`);
      if (__props.isBillingDifferent) {
        _push(`<div class="w-2.5 h-2.5 bg-black"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><span class="text-[11px] font-bold uppercase tracking-widest text-black flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(FileText), { class: "w-3.5 h-3.5 text-gray-400" }, null, _parent));
      _push(` Iné fakturačné údaje </span></label>`);
      if (__props.isBillingDifferent) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50 border border-gray-100 p-5 animate-slide-up"><div><label class="form-label">Meno</label><input${ssrRenderAttr("value", unref(localBilling).firstName)} type="text"${ssrRenderAttr("maxlength", unref(MAX_NAME_LEN))} class="${ssrRenderClass([billingErrInputClass("firstName"), "form-input bg-white"])}">`);
        if (billingErr("firstName")) {
          _push(`<p class="mt-1 text-[11px] text-red-600">${ssrInterpolate(billingErr("firstName"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><label class="form-label">Priezvisko</label><input${ssrRenderAttr("value", unref(localBilling).lastName)} type="text"${ssrRenderAttr("maxlength", unref(MAX_NAME_LEN))} class="${ssrRenderClass([billingErrInputClass("lastName"), "form-input bg-white"])}">`);
        if (billingErr("lastName")) {
          _push(`<p class="mt-1 text-[11px] text-red-600">${ssrInterpolate(billingErr("lastName"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="md:col-span-2"><label class="form-label flex items-center gap-1">`);
        _push(ssrRenderComponent(unref(Globe), { class: "w-3 h-3" }, null, _parent));
        _push(` Fakturačná krajina</label><div class="relative"><select class="form-input bg-white appearance-none pr-10"><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(localBilling).countryId) ? ssrLooseContain(unref(localBilling).countryId, "") : ssrLooseEqual(unref(localBilling).countryId, "")) ? " selected" : ""}>Vyberte krajinu</option><!--[-->`);
        ssrRenderList(__props.countries, (c) => {
          _push(`<option${ssrRenderAttr("value", c.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(localBilling).countryId) ? ssrLooseContain(unref(localBilling).countryId, c.value) : ssrLooseEqual(unref(localBilling).countryId, c.value)) ? " selected" : ""}>${ssrInterpolate(c.label)}</option>`);
        });
        _push(`<!--]--></select>`);
        _push(ssrRenderComponent(unref(ChevronDown), { class: "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" }, null, _parent));
        _push(`</div></div><div class="md:col-span-2"><label class="form-label">Ulica a číslo</label><input${ssrRenderAttr("value", unref(localBilling).street)} type="text" maxlength="60" class="${ssrRenderClass([billingErrInputClass("street"), "form-input bg-white"])}">`);
        if (billingErr("street")) {
          _push(`<p class="mt-1 text-[11px] text-red-600">${ssrInterpolate(billingErr("street"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><label class="form-label">Mesto</label><input${ssrRenderAttr("value", unref(localBilling).city)} type="text" class="${ssrRenderClass([billingErrInputClass("city"), "form-input bg-white"])}">`);
        if (billingErr("city")) {
          _push(`<p class="mt-1 text-[11px] text-red-600">${ssrInterpolate(billingErr("city"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><label class="form-label">PSČ</label><input${ssrRenderAttr("value", unref(localBilling).zipcode)} type="text" class="${ssrRenderClass([billingErrInputClass("zipcode"), "form-input bg-white"])}">`);
        if (billingErr("zipcode")) {
          _push(`<p class="mt-1 text-[11px] text-red-600">${ssrInterpolate(billingErr("zipcode"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<label class="flex items-center gap-3 cursor-pointer group"><div class="relative flex items-center justify-center w-4 h-4 border border-gray-300 group-hover:border-black transition-colors bg-white flex-shrink-0"><input type="checkbox" class="sr-only"${ssrIncludeBooleanAttr(__props.isCompanyPurchase) ? " checked" : ""}>`);
      if (__props.isCompanyPurchase) {
        _push(`<div class="w-2.5 h-2.5 bg-black"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><span class="text-[11px] font-bold uppercase tracking-widest text-black flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Briefcase), { class: "w-3.5 h-3.5 text-gray-400" }, null, _parent));
      _push(` Nakupujem na firmu </span></label>`);
      if (__props.isCompanyPurchase) {
        _push(`<div class="animate-slide-up space-y-4 bg-gray-50 border border-gray-100 p-6"><div><label class="form-label flex items-center gap-2">${ssrInterpolate(unref(lblVat))} * `);
        if (unref(viesStatus) === "valid") {
          _push(`<span class="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 tracking-wider flex items-center gap-1">`);
          _push(ssrRenderComponent(unref(CheckCircle), { class: "w-3 h-3" }, null, _parent));
          _push(` Overené VIES </span>`);
        } else if (unref(viesStatus) === "invalid") {
          _push(`<span class="text-[9px] text-red-600 bg-red-50 px-1.5 py-0.5 tracking-wider flex items-center gap-1">`);
          _push(ssrRenderComponent(unref(XCircle), { class: "w-3 h-3" }, null, _parent));
          _push(` Neplatné </span>`);
        } else if (unref(viesStatus) === "error") {
          _push(`<span class="text-[9px] text-amber-600 bg-amber-50 px-1.5 py-0.5 tracking-wider flex items-center gap-1">`);
          _push(ssrRenderComponent(unref(AlertCircle), { class: "w-3 h-3" }, null, _parent));
          _push(` Nedostupné </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</label><div class="relative"><input${ssrRenderAttr("value", unref(localForm).icdph)} type="text"${ssrRenderAttr("placeholder", unref(vatPlaceholder))} class="${ssrRenderClass([{
          "border-green-400 ring-2 ring-green-400/10": unref(viesStatus) === "valid",
          "border-red-400 ring-2 ring-red-400/10": unref(viesStatus) === "invalid",
          "border-amber-400": unref(viesStatus) === "error"
        }, "form-input bg-white pr-12 transition-all duration-200"])}"><div class="absolute right-3 top-1/2 -translate-y-1/2">`);
        if (unref(viesStatus) === "loading") {
          _push(ssrRenderComponent(unref(Loader2), { class: "w-5 h-5 text-gray-400 animate-spin" }, null, _parent));
        } else if (unref(viesStatus) === "valid") {
          _push(ssrRenderComponent(unref(CheckCircle), { class: "w-5 h-5 text-green-500" }, null, _parent));
        } else if (unref(viesStatus) === "invalid") {
          _push(ssrRenderComponent(unref(XCircle), { class: "w-5 h-5 text-red-500" }, null, _parent));
        } else if (unref(viesStatus) === "error") {
          _push(ssrRenderComponent(unref(AlertCircle), { class: "w-5 h-5 text-amber-500" }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        if (unref(viesStatus) === "invalid" && unref(viesError)) {
          _push(`<p class="mt-1.5 text-[11px] text-red-600">${ssrInterpolate(unref(viesError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(viesStatus) === "error" && unref(viesError)) {
          _push(`<p class="mt-1.5 text-[11px] text-amber-600">${ssrInterpolate(unref(viesError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><label class="form-label flex items-center gap-2"> Názov firmy * `);
        if (unref(viesStatus) === "valid" && unref(viesCompanyName)) {
          _push(`<span class="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 tracking-wider flex items-center gap-1">`);
          _push(ssrRenderComponent(unref(ShieldCheck), { class: "w-3 h-3" }, null, _parent));
          _push(` z VIES </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</label><input${ssrRenderAttr("value", unref(localForm).company)} type="text"${ssrRenderAttr("maxlength", unref(MAX_COMPANY_LEN))} class="${ssrRenderClass([errInputClass("company"), "form-input bg-white"])}">`);
        if (fieldErr("company")) {
          _push(`<p class="mt-1 text-[11px] text-red-600">${ssrInterpolate(fieldErr("company"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="grid grid-cols-2 gap-4"><div><label class="form-label">${ssrInterpolate(unref(lblIco))} *</label><input${ssrRenderAttr("value", unref(localForm).ico)} type="text" class="${ssrRenderClass([errInputClass("ico"), "form-input bg-white"])}">`);
        if (fieldErr("ico")) {
          _push(`<p class="mt-1 text-[11px] text-red-600">${ssrInterpolate(fieldErr("ico"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><label class="form-label">${ssrInterpolate(unref(lblDic))}</label><input${ssrRenderAttr("value", unref(localForm).dic)} type="text" class="${ssrRenderClass([errInputClass("dic"), "form-input bg-white"])}">`);
        if (fieldErr("dic")) {
          _push(`<p class="mt-1 text-[11px] text-red-600">${ssrInterpolate(fieldErr("dic"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="pt-2 border-t border-gray-100"><label class="form-label">Poznámka k objednávke</label><textarea rows="3" class="form-input resize-none" placeholder="Nepovinné — špeciálne inštrukcie pre doručenie...">${ssrInterpolate(unref(localForm).note)}</textarea></div><div class="flex items-center gap-3 p-4 border border-brand/20 bg-brand/5 text-gray-600 text-[11px] font-sans">`);
      _push(ssrRenderComponent(unref(ShieldCheck), { class: "w-4 h-4 flex-shrink-0 text-brand" }, null, _parent));
      _push(` Vaše údaje sú u nás v bezpečí a spracované výhradne podľa GDPR. </div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cart/checkout/DeliveryStep.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "DeliveryStep" });
const DeliveryStep = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1
}, Symbol.toStringTag, { value: "Module" }));

export { DeliveryStep as D, __nuxt_component_1 as _, validateBillingForm as a, validateShippingForm as v };
