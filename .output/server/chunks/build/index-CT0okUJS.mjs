import __nuxt_component_0 from './BaseLink-CtWKrAdk.mjs';
import { _ as __nuxt_component_1, v as validateShippingForm, a as validateBillingForm } from './DeliveryStep-Ba2Hg65S.mjs';
import __nuxt_component_2 from './PaymentStep-8sr8refq.mjs';
import __nuxt_component_3 from './OrderSummary-TDFgl67k.mjs';
import { defineComponent, computed, watch, withAsyncContext, mergeProps, unref, withCtx, createVNode, createTextVNode, isRef, ref, inject, provide, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { ShoppingBag, ArrowLeft, User, Check, CheckCircle2, AlertCircle } from 'lucide-vue-next';
import { u as useHead, a as useCart, f as useUser, g as useState, b as useLocalePath, M as useInternationalization, c as useRouter, e as useShopwareContext, h as useAsyncData, l as useSessionContext, i as useRuntimeConfig, N as defu } from './server.mjs';
import { u as useCountrySelector } from './useCountrySelector-Cujau6dz.mjs';
import { u as useShippingMetadata } from './useShippingMetadata-C7Eoqyz6.mjs';
import { u as useCountries } from './useCountries-DcMVa9Fw.mjs';
import { u as useBalneSync } from './useBalneSync-DIvXhAAy.mjs';
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
import './useUiState-BTlUPkrr.mjs';
import './SpsPickupPointPicker-BbRa_Lhl.mjs';
import './NuxtImg-BPLMxRzm.mjs';
import './composables-x8_ENpEe.mjs';
import './useShopwareLanguage-CGPCneCN.mjs';

const shippingMethodsAssociations = {
  associations: {
    prices: {}
  }
};
function useCheckout() {
  const { apiClient } = useShopwareContext();
  const {
    sessionContext,
    selectedPaymentMethod,
    selectedShippingMethod,
    setShippingMethod,
    setPaymentMethod
  } = useSessionContext();
  const storeShippingMethods = inject("swShippingMethods", ref());
  provide("swShippingMethods", storeShippingMethods);
  const storePaymentMethods = inject("swPaymentMethods", ref());
  provide("swPaymentMethods", storePaymentMethods);
  const shippingMethods = computed(() => storeShippingMethods.value || []);
  const paymentMethods = computed(() => storePaymentMethods.value || []);
  async function getShippingMethods({ forceReload } = { forceReload: false }, associations = {}) {
    if (shippingMethods.value.length && !forceReload) return shippingMethods;
    const mergedAssociations = defu(
      shippingMethodsAssociations,
      associations
    );
    const response = await apiClient.invoke(
      "readShippingMethod post /shipping-method",
      {
        body: {
          ...mergedAssociations
        },
        query: {
          onlyAvailable: true
        }
      }
    );
    storeShippingMethods.value = response.data.elements?.sort(
      (a, b) => (a.position ?? 0) - (b.position ?? 0)
    ) || [];
    return shippingMethods;
  }
  async function getPaymentMethods({ forceReload } = { forceReload: false }) {
    if (paymentMethods.value.length && !forceReload) return paymentMethods;
    const response = await apiClient.invoke(
      "readPaymentMethod post /payment-method",
      {
        body: { onlyAvailable: true }
      }
    );
    storePaymentMethods.value = response.data.elements || [];
    return paymentMethods;
  }
  async function createOrder(params = {}) {
    const order = await apiClient.invoke("createOrder post /checkout/order", {
      body: params
    });
    return order.data;
  }
  const shippingAddress = computed(
    () => sessionContext.value?.shippingLocation?.address
  );
  const billingAddress = computed(
    () => sessionContext.value?.customer?.activeBillingAddress
  );
  return {
    getPaymentMethods,
    paymentMethods,
    getShippingMethods,
    shippingMethods,
    createOrder,
    shippingAddress,
    billingAddress,
    selectedShippingMethod,
    setShippingMethod,
    selectedPaymentMethod,
    setPaymentMethod
  };
}
const EMPTY_SHIPPING = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  zipcode: "",
  countryId: "",
  company: "",
  ico: "",
  dic: "",
  icdph: "",
  note: ""
};
const EMPTY_BILLING = {
  firstName: "",
  lastName: "",
  street: "",
  city: "",
  zipcode: "",
  countryId: ""
};
const useCheckoutFlow = () => {
  const { selectedCountryId: navbarCountryId } = useCountrySelector();
  const { isLoggedIn, isGuestSession, register, login, userDefaultBillingAddress } = useUser();
  const {
    setShippingMethod,
    setPaymentMethod,
    getShippingMethods,
    paymentMethods
  } = useCheckout();
  const { shippingMethods: rawShippingMethods } = useShippingMetadata();
  const { setCountry } = useSessionContext();
  const { getCountries } = useCountries();
  const sortedCountriesOptions = computed(
    () => [...getCountries.value ?? []].sort((a, b) => (a.position ?? 999) - (b.position ?? 999)).map((c) => ({ label: c.translated?.name ?? c.name, value: c.id, iso: (c.iso || "").toUpperCase() }))
  );
  const taxRatesMap = ref(null);
  const selectedCountryTaxRate = computed(() => {
    const countryId = shippingAddress.value.countryId;
    const map = taxRatesMap.value;
    if (!map) return 23;
    if (countryId && map[countryId] != null) return map[countryId];
    return map._default ?? 23;
  });
  const selectedCountryIso = computed(() => {
    const countryId = shippingAddress.value.countryId;
    if (!countryId) return "";
    return sortedCountriesOptions.value.find((c) => c.value === countryId)?.iso || "";
  });
  const applyCountryShippingDefault = async (iso) => {
    const shippingIds = config.public.shopware.ids.shipping;
    const currentId = selectedShippingMethodId.value;
    let nextId;
    if (iso === "CZ" && shippingIds.toptransCz && currentId !== shippingIds.toptransCz) {
      nextId = shippingIds.toptransCz;
    } else if (iso === "PL" && shippingIds.toptransPl && currentId !== shippingIds.toptransPl) {
      nextId = shippingIds.toptransPl;
    } else if (iso !== "CZ" && iso !== "PL" && (currentId === shippingIds.toptransCz || currentId === shippingIds.toptransPl) && shippingIds.toptrans) {
      nextId = shippingIds.toptrans;
    }
    if (nextId && nextId !== currentId) {
      selectedShippingMethodId.value = nextId;
      try {
        await setShippingMethod({ id: nextId });
        await refreshCart();
      } catch (e) {
      }
    }
  };
  const isB2bReverseCharge = computed(
    () => isCompanyPurchase.value && !!shippingAddress.value.countryId && selectedCountryIso.value !== "SK"
  );
  const { refreshCart, cartItems, addProduct, removeItem } = useCart();
  const { apiClient } = useShopwareContext();
  const config = useRuntimeConfig();
  const expressProductId = config.public.shopware.ids.products?.expressShipping;
  const dobierkaProductId = config.public.shopware.ids.products?.dobierka;
  const dobierkaPaymentId = config.public.shopware.ids.payment?.dobierka;
  const currentStep = ref(1);
  const isSubmitting = ref(false);
  const submitError = ref(null);
  const isBillingDifferent = ref(false);
  const isCompanyPurchase = ref(false);
  const createAccount = ref(true);
  const accountPassword = ref("");
  const accountPasswordConfirm = ref("");
  const isExpressLoading = ref(false);
  const isExpressShipping = computed({
    get: () => !!expressProductId && cartItems.value.some((i) => i.referencedId === expressProductId),
    set: async (val) => {
      if (isExpressLoading.value || !expressProductId) return;
      isExpressLoading.value = true;
      try {
        const item = cartItems.value.find((i) => i.referencedId === expressProductId);
        if (val && !item) await addProduct({ id: expressProductId, quantity: 1 });
        else if (!val && item) await removeItem(item);
      } finally {
        isExpressLoading.value = false;
      }
    }
  });
  const agreedToTerms = ref(false);
  const selectedShippingMethodId = ref("");
  const selectedPaymentMethodId = ref("");
  const selectedPickupPoint = ref(null);
  watch(selectedShippingMethodId, (id) => {
    const balikovoId = config.public.shopware.ids.shipping?.balikovo;
    if (id !== balikovoId) {
      selectedPickupPoint.value = null;
    }
  });
  const loadFromStorage = () => {
    return {};
  };
  const saveToStorage = () => {
    return;
  };
  const clearStorage = () => {
  };
  const stored = isLoggedIn.value ? {} : loadFromStorage();
  const shippingAddress = ref(stored.shipping ?? { ...EMPTY_SHIPPING, countryId: navbarCountryId.value || "" });
  const billingAddress = ref(stored.billing ?? { ...EMPTY_BILLING });
  if (stored.isBillingDiff != null) isBillingDifferent.value = stored.isBillingDiff;
  if (stored.isCompany != null) isCompanyPurchase.value = stored.isCompany;
  watch(sortedCountriesOptions, (opts) => {
    if (!shippingAddress.value.countryId && opts.length > 0) {
      shippingAddress.value.countryId = opts[0].value;
    }
  }, { immediate: true });
  watch([shippingAddress, billingAddress, isBillingDifferent, isCompanyPurchase], saveToStorage, { deep: true });
  const isUserSession = computed(() => isLoggedIn.value || isGuestSession.value);
  computed(() => {
    const a = shippingAddress.value;
    return !!(a.firstName && a.lastName && a.email && a.phone && a.street && a.city && a.zipcode && a.countryId);
  });
  const billingIsoForValidation = computed(
    () => sortedCountriesOptions.value.find((c) => c.value === billingAddress.value.countryId)?.iso || ""
  );
  const isShippingValid = computed(() => {
    const shipErrors = validateShippingForm(
      shippingAddress.value,
      selectedCountryIso.value,
      isCompanyPurchase.value
    );
    if (Object.keys(shipErrors).length > 0) return false;
    if (isBillingDifferent.value) {
      const billErrors = validateBillingForm(billingAddress.value, billingIsoForValidation.value);
      if (Object.keys(billErrors).length > 0) return false;
    }
    return true;
  });
  const canProceedToPayment = computed(
    () => isShippingValid.value && !!selectedShippingMethodId.value
  );
  const canPlaceOrder = computed(() => {
    if (!isShippingValid.value) return false;
    if (!selectedShippingMethodId.value) return false;
    if (!selectedPaymentMethodId.value) return false;
    if (!agreedToTerms.value) return false;
    const balikovoId = config.public.shopware.ids.shipping?.balikovo;
    if (balikovoId && selectedShippingMethodId.value === balikovoId && !selectedPickupPoint.value) return false;
    return true;
  });
  const goToStep = (step) => {
    currentStep.value = step;
  };
  const nextStep = () => goToStep(currentStep.value + 1);
  const prevStep = () => goToStep(currentStep.value - 1);
  const handleShippingMethodChange = async (id) => {
    selectedShippingMethodId.value = id;
    try {
      await setShippingMethod({ id });
      await refreshCart();
    } catch (e) {
    }
  };
  const handlePaymentMethodChange = async (id) => {
    selectedPaymentMethodId.value = id;
    try {
      await setPaymentMethod({ id });
      if (dobierkaProductId && dobierkaPaymentId) {
        const isDobierka = id === dobierkaPaymentId;
        const item = cartItems.value.find((i) => i.referencedId === dobierkaProductId);
        if (isDobierka && !item) await addProduct({ id: dobierkaProductId, quantity: 1 });
        else if (!isDobierka && item) await removeItem(item);
      }
      await refreshCart();
    } catch (e) {
    }
  };
  watch(isCompanyPurchase, async () => {
    const country = shippingAddress.value.countryId;
    if (!country) return;
    try {
      await setCountry(country);
      await refreshCart();
    } catch (e) {
    }
  });
  watch([() => shippingAddress.value.countryId, () => shippingAddress.value.zipcode], async ([country]) => {
    if (country) {
      try {
        await setCountry(country);
        await Promise.all([
          refreshCart(),
          getShippingMethods({ onlyAvailable: true })
        ]);
        const shippingIds = config.public.shopware.ids.shipping;
        const id = selectedShippingMethodId.value;
        const iso = selectedCountryIso.value;
        const isStaleSkOnly = [shippingIds.balikovo, shippingIds.sps, shippingIds.osobnyOdber].includes(id) && iso !== "SK";
        if (isStaleSkOnly) selectedShippingMethodId.value = "";
        await applyCountryShippingDefault(iso);
      } catch (e) {
      }
    }
  });
  const buildCompanyPayload = (addr) => {
    if (!isCompanyPurchase.value) return {};
    const payload = {};
    if (addr.company?.trim()) payload.company = addr.company.trim();
    if (addr.icdph?.trim()) payload.vatId = addr.icdph.trim();
    const customFields = {};
    if (addr.ico?.trim()) customFields.mtsport_ico = addr.ico.trim();
    if (addr.dic?.trim()) customFields.mtsport_dic = addr.dic.trim();
    if (Object.keys(customFields).length) payload.customFields = customFields;
    return payload;
  };
  const placeOrder = async () => {
    if (!canPlaceOrder.value) return null;
    isSubmitting.value = true;
    submitError.value = null;
    try {
      const addr = shippingAddress.value;
      const billing = isBillingDifferent.value ? billingAddress.value : null;
      const companyPayload = buildCompanyPayload(addr);
      if (!isUserSession.value) {
        if (createAccount.value) {
          if (!accountPassword.value || accountPassword.value.length < 8) {
            submitError.value = "Heslo musí mať aspoň 8 znakov.";
            return null;
          }
          if (accountPassword.value !== accountPasswordConfirm.value) {
            submitError.value = "Heslá sa nezhodujú.";
            return null;
          }
        }
        const billingAddr = {
          firstName: billing?.firstName || addr.firstName,
          lastName: billing?.lastName || addr.lastName,
          street: billing?.street || addr.street,
          zipcode: billing?.zipcode || addr.zipcode,
          city: billing?.city || addr.city,
          countryId: billing?.countryId || addr.countryId,
          phoneNumber: addr.phone,
          ...companyPayload
        };
        const shippingAddr = isBillingDifferent.value ? {
          firstName: addr.firstName,
          lastName: addr.lastName,
          street: addr.street,
          zipcode: addr.zipcode,
          city: addr.city,
          countryId: addr.countryId,
          phoneNumber: addr.phone
        } : void 0;
        await register({
          firstName: addr.firstName,
          lastName: addr.lastName,
          email: addr.email,
          guest: !createAccount.value,
          ...createAccount.value ? { password: accountPassword.value } : {},
          billingAddress: billingAddr,
          ...shippingAddr ? { shippingAddress: shippingAddr } : {},
          acceptedDataProtection: true,
          storefrontUrl: false ? (void 0).location.origin : useRuntimeConfig().public.siteUrl || "https://mtsport.store"
        });
        if (createAccount.value) {
          try {
            await login({ username: addr.email, password: accountPassword.value });
            useState("checkoutJustRegistered", () => false).value = true;
          } catch (e) {
          }
        }
      } else if (isLoggedIn.value && Object.keys(companyPayload).length) {
        const defaultBillingId = userDefaultBillingAddress.value?.id;
        if (defaultBillingId) {
          await apiClient.invoke("updateCustomerAddress patch /account/address/{addressId}", {
            pathParams: { addressId: defaultBillingId },
            body: companyPayload
          });
        }
      }
      await Promise.all([
        setShippingMethod({ id: selectedShippingMethodId.value }),
        setPaymentMethod({ id: selectedPaymentMethodId.value })
      ]);
      const rawNote = addr.note?.trim() ?? "";
      const customerComment = rawNote ? rawNote.replace(/<[^>]*>/g, "").slice(0, 500) || void 0 : void 0;
      const rawOrder = await apiClient.invoke("createOrder post /checkout/order", {
        body: customerComment ? { customerComment } : {}
      });
      const order = rawOrder?.data ?? rawOrder;
      const orderId = order?.id ?? null;
      refreshCart();
      clearStorage();
      const balikovoId = config.public.shopware.ids.shipping?.balikovo;
      if (orderId && selectedShippingMethodId.value === balikovoId && selectedPickupPoint.value) {
        try {
          await $fetch("/api/sps/save-pickup-point", {
            method: "POST",
            body: { orderId, pickupPoint: selectedPickupPoint.value }
          });
        } catch (e) {
        }
      }
      return orderId;
    } catch (err) {
      const detail = err?.details?.errors?.[0]?.detail || err?.data?.errors?.[0]?.detail || err?.message || "Nastala chyba pri vytváraní objednávky. Skúste to znova.";
      submitError.value = detail;
      return null;
    } finally {
      isSubmitting.value = false;
    }
  };
  return {
    currentStep,
    isSubmitting,
    submitError,
    isBillingDifferent,
    isCompanyPurchase,
    createAccount,
    accountPassword,
    accountPasswordConfirm,
    isExpressShipping,
    agreedToTerms,
    selectedShippingMethodId,
    selectedPaymentMethodId,
    selectedPickupPoint,
    shippingMethods: rawShippingMethods,
    paymentMethods,
    countries: sortedCountriesOptions,
    selectedCountryIso,
    selectedCountryTaxRate,
    isB2bReverseCharge,
    shippingAddress,
    billingAddress,
    canProceedToPayment,
    canPlaceOrder,
    goToStep,
    nextStep,
    prevStep,
    handleShippingMethodChange,
    handlePaymentMethodChange,
    placeOrder
  };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({ title: "Pokladňa | SLICKLY" });
    const { isEmpty } = useCart();
    const { isLoggedIn } = useUser();
    useState("loginModalOpen", () => false);
    const localePath = useLocalePath();
    const GUEST_BENEFITS = [
      "Uľahčíme, urýchlime a zvýhodníme Váš nákup.",
      "Prehľad objednávok v používateľskom účte.",
      "Nikdy Vám už neunikne žiadna naša akcia, alebo zľava."
    ];
    const { formatLink } = useInternationalization(localePath);
    const router = useRouter();
    const {
      currentStep,
      isSubmitting,
      submitError,
      isBillingDifferent,
      isCompanyPurchase,
      createAccount,
      accountPassword,
      accountPasswordConfirm,
      isExpressShipping,
      agreedToTerms,
      selectedShippingMethodId,
      selectedPaymentMethodId,
      selectedPickupPoint,
      shippingMethods,
      paymentMethods,
      countries,
      selectedCountryIso,
      selectedCountryTaxRate,
      isB2bReverseCharge,
      shippingAddress,
      billingAddress,
      canProceedToPayment,
      canPlaceOrder,
      nextStep,
      prevStep,
      handleShippingMethodChange,
      handlePaymentMethodChange,
      placeOrder
    } = useCheckoutFlow();
    useBalneSync(selectedShippingMethodId);
    const displayStep = computed(() => currentStep.value + 1);
    const checkoutNavStep = useState("checkoutNavStep", () => 2);
    watch(displayStep, (step) => {
      if (checkoutNavStep.value !== step) checkoutNavStep.value = step;
    }, { immediate: true });
    watch(checkoutNavStep, (step) => {
      if (step === 2 && currentStep.value !== 1) currentStep.value = 1;
      if (step === 3 && currentStep.value !== 2) currentStep.value = 2;
    });
    const handlePlaceOrder = async () => {
      const orderId = await placeOrder();
      if (orderId) {
        await router.push(formatLink(`/checkout/success/${orderId}`));
      }
    };
    const { apiClient } = useShopwareContext();
    const config = useRuntimeConfig();
    const expressProductId = config.public.shopware.ids.products?.expressShipping;
    const dobierkaProductId = config.public.shopware.ids.products?.dobierka;
    const [{ data: expressProduct }, { data: dobierkaProduct }] = ([__temp, __restore] = withAsyncContext(async () => Promise.all([
      useAsyncData("checkout-express-product", async () => {
        if (!expressProductId) return null;
        try {
          const res = await apiClient.invoke("readProduct post /product", {
            body: {
              filter: [{ type: "equals", field: "id", value: expressProductId }],
              includes: {
                product: ["id", "translated", "calculatedPrice", "seoUrls", "cover"],
                product_media: ["media"],
                media: ["url", "thumbnails"]
              }
            }
          });
          return (res?.data || res)?.elements?.[0] || null;
        } catch (e) {
          return null;
        }
      }),
      useAsyncData("checkout-dobierka-product", async () => {
        if (!dobierkaProductId) return null;
        try {
          const res = await apiClient.invoke("readProduct post /product", {
            body: {
              filter: [{ type: "equals", field: "id", value: dobierkaProductId }],
              includes: { product: ["id", "calculatedPrice"] }
            }
          });
          return (res?.data || res)?.elements?.[0] || null;
        } catch (e) {
          return null;
        }
      })
    ])), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseLink = __nuxt_component_0;
      const _component_DeliveryStep = __nuxt_component_1;
      const _component_PaymentStep = __nuxt_component_2;
      const _component_OrderSummary = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto px-4 lg:px-8" }, _attrs))}>`);
      if (unref(isEmpty)) {
        _push(`<div class="flex flex-col items-center justify-center py-24 text-center"><div class="text-[120px] font-black font-tech uppercase text-gray-100 leading-none mb-6 select-none">EMPTY</div><h2 class="text-2xl font-black font-tech uppercase mb-3">Košík je prázdny</h2><p class="text-gray-500 mb-8 font-sans text-sm">Pridajte produkty do košíka a vráťte sa späť.</p>`);
        _push(ssrRenderComponent(_component_BaseLink, {
          to: "/",
          class: "btn-checkout inline-flex max-w-xs gap-2"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ShoppingBag), { class: "w-5 h-5" }, null, _parent2, _scopeId));
              _push2(` Späť do obchodu `);
            } else {
              return [
                createVNode(unref(ShoppingBag), { class: "w-5 h-5" }),
                createTextVNode(" Späť do obchodu ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!--[--><div class="mb-8 pb-6 border-b border-gray-200"><div class="flex flex-col md:flex-row justify-between items-start md:items-end"><div>`);
        if (unref(currentStep) === 1) {
          _push(`<h1 class="text-3xl md:text-5xl font-black uppercase font-tech tracking-wide text-black italic leading-none"> KONTAKTNÉ <span class="text-brand">ÚDAJE</span></h1>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(currentStep) === 2) {
          _push(`<h1 class="text-3xl md:text-5xl font-black uppercase font-tech tracking-wide text-black italic leading-none"> DOPRAVA A <span class="text-brand">PLATBA</span></h1>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(currentStep) === 2) {
          _push(`<button class="flex items-center gap-2 mt-4 md:mt-0 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-brand transition-colors">`);
          _push(ssrRenderComponent(unref(ArrowLeft), { class: "w-3.5 h-3.5" }, null, _parent));
          _push(` Späť na kontaktné údaje </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start"><div class="space-y-4 min-w-0">`);
        if (!unref(isLoggedIn)) {
          _push(`<div class="bg-black text-white px-4 md:px-6 py-4 flex items-center gap-3"><div class="w-8 h-8 bg-brand flex items-center justify-center flex-shrink-0">`);
          _push(ssrRenderComponent(unref(User), { class: "w-4 h-4 text-white" }, null, _parent));
          _push(`</div><div><div class="font-black uppercase tracking-wide text-sm font-tech"> Máte už účet? <button class="text-brand hover:underline cursor-pointer ml-1 bg-transparent border-0 p-0 font-black uppercase tracking-wide text-sm font-tech">Prihláste sa</button></div><div class="text-xs text-gray-400 font-sans mt-0.5">Predvyplníme vaše adresy a osobné údaje automaticky.</div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (!unref(isLoggedIn)) {
          _push(`<div class="border border-gray-200 bg-white"><div class="flex divide-x divide-gray-200"><button class="${ssrRenderClass([unref(createAccount) ? "bg-gray-50" : "", "flex-1 flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left bg-transparent border-0"])}"><div class="${ssrRenderClass([unref(createAccount) ? "bg-black border-black" : "border-gray-300", "w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-colors"])}">`);
          if (unref(createAccount)) {
            _push(ssrRenderComponent(unref(Check), {
              class: "w-2.5 h-2.5 text-white",
              "stroke-width": 3
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div><span class="${ssrRenderClass([unref(createAccount) ? "text-black font-bold" : "text-gray-500 font-medium", "text-[13px] font-sans"])}"> Chcem sa zaregistrovať </span></button><button class="${ssrRenderClass([!unref(createAccount) ? "bg-gray-50" : "", "flex-1 flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left bg-transparent border-0"])}"><div class="${ssrRenderClass([!unref(createAccount) ? "bg-black border-black" : "border-gray-300", "w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-colors"])}">`);
          if (!unref(createAccount)) {
            _push(ssrRenderComponent(unref(Check), {
              class: "w-2.5 h-2.5 text-white",
              "stroke-width": 3
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div><span class="${ssrRenderClass([!unref(createAccount) ? "text-black font-bold" : "text-gray-500 font-medium", "text-[13px] font-sans"])}"> Nákup bez registrácie </span></button></div><div class="border-t border-gray-100 overflow-hidden">`);
          if (unref(createAccount)) {
            _push(`<div class="px-5 py-4 bg-white space-y-3"><p class="text-[11px] font-bold uppercase tracking-widest text-gray-400 font-sans">Heslo k novému účtu</p><div class="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label class="form-label">Heslo <span class="text-brand">*</span></label><input${ssrRenderAttr("value", unref(accountPassword))} type="password" placeholder="Min. 8 znakov" autocomplete="new-password" class="form-input w-full"></div><div><label class="form-label">Potvrdiť heslo <span class="text-brand">*</span></label><input${ssrRenderAttr("value", unref(accountPasswordConfirm))} type="password" placeholder="Zopakujte heslo" autocomplete="new-password" class="form-input w-full"></div></div>`);
            if (unref(accountPassword) && unref(accountPasswordConfirm) && unref(accountPassword) !== unref(accountPasswordConfirm)) {
              _push(`<p class="text-[11px] text-brand font-bold font-sans"> Heslá sa nezhodujú. </p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<div class="px-5 py-4 bg-white"><p class="text-sm font-bold font-sans text-black mb-3">Prečo je výhodné si u nás vytvoriť účet?</p><ul class="space-y-2 mb-3"><!--[-->`);
            ssrRenderList(GUEST_BENEFITS, (benefit) => {
              _push(`<li class="flex items-start gap-2.5">`);
              _push(ssrRenderComponent(unref(CheckCircle2), { class: "w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" }, null, _parent));
              _push(`<span class="text-[13px] font-sans text-gray-600">${ssrInterpolate(benefit)}</span></li>`);
            });
            _push(`<!--]--></ul><button class="text-[13px] font-bold font-sans underline text-black hover:text-brand transition-colors bg-transparent border-0 p-0 cursor-pointer"> Chcem sa zaregistrovať </button></div>`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(currentStep) === 1) {
          _push(ssrRenderComponent(_component_DeliveryStep, {
            "form-data": unref(shippingAddress),
            "onUpdate:formData": ($event) => isRef(shippingAddress) ? shippingAddress.value = $event : null,
            "billing-data": unref(billingAddress),
            "onUpdate:billingData": ($event) => isRef(billingAddress) ? billingAddress.value = $event : null,
            "is-billing-different": unref(isBillingDifferent),
            "onUpdate:isBillingDifferent": ($event) => isRef(isBillingDifferent) ? isBillingDifferent.value = $event : null,
            "is-company-purchase": unref(isCompanyPurchase),
            "onUpdate:isCompanyPurchase": ($event) => isRef(isCompanyPurchase) ? isCompanyPurchase.value = $event : null,
            countries: unref(countries),
            "shipping-methods": unref(shippingMethods),
            "shipping-method": unref(selectedShippingMethodId),
            "onUpdate:shippingMethod": unref(handleShippingMethodChange)
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(currentStep) === 2) {
          _push(ssrRenderComponent(_component_PaymentStep, {
            "payment-method": unref(selectedPaymentMethodId),
            "onUpdate:paymentMethod": [($event) => isRef(selectedPaymentMethodId) ? selectedPaymentMethodId.value = $event : null, unref(handlePaymentMethodChange)],
            "shipping-method": unref(selectedShippingMethodId),
            "onUpdate:shippingMethod": [($event) => isRef(selectedShippingMethodId) ? selectedShippingMethodId.value = $event : null, unref(handleShippingMethodChange)],
            "agreed-to-terms": unref(agreedToTerms),
            "onUpdate:agreedToTerms": ($event) => isRef(agreedToTerms) ? agreedToTerms.value = $event : null,
            "is-express-shipping": unref(isExpressShipping),
            "onUpdate:isExpressShipping": ($event) => isRef(isExpressShipping) ? isExpressShipping.value = $event : null,
            "pickup-point": unref(selectedPickupPoint),
            "onUpdate:pickupPoint": ($event) => isRef(selectedPickupPoint) ? selectedPickupPoint.value = $event : null,
            "payment-methods": unref(paymentMethods),
            "shipping-methods": unref(shippingMethods),
            "express-product": unref(expressProduct),
            "dobierka-product": unref(dobierkaProduct),
            "shipping-address": unref(shippingAddress),
            countries: unref(countries)
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(submitError)) {
          _push(`<div class="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 p-4 text-sm font-sans">`);
          _push(ssrRenderComponent(unref(AlertCircle), { class: "w-5 h-5 flex-shrink-0 mt-0.5" }, null, _parent));
          _push(`<p class="font-medium">${ssrInterpolate(unref(submitError))}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><aside class="lg:sticky lg:top-6">`);
        _push(ssrRenderComponent(_component_OrderSummary, {
          step: unref(displayStep),
          "shipping-method-id": unref(selectedShippingMethodId),
          "payment-method-id": unref(selectedPaymentMethodId),
          "shipping-methods": unref(shippingMethods),
          "payment-methods": unref(paymentMethods),
          "is-express-shipping": unref(isExpressShipping),
          "onUpdate:isExpressShipping": ($event) => isRef(isExpressShipping) ? isExpressShipping.value = $event : null,
          "express-product": unref(expressProduct),
          "dobierka-product": unref(dobierkaProduct),
          "country-iso": unref(selectedCountryIso),
          "tax-rate": unref(selectedCountryTaxRate),
          "is-reverse-charge": unref(isB2bReverseCharge),
          "is-company-purchase": unref(isCompanyPurchase),
          "can-action": unref(currentStep) === 1 ? unref(canProceedToPayment) : unref(canPlaceOrder),
          "is-submitting": unref(isSubmitting),
          "action-label": unref(currentStep) === 1 ? "Pokračovať na dopravu a platbu" : "Záväzne objednať",
          "back-label": unref(currentStep) === 1 ? "Späť do košíka" : "Späť na kontaktné údaje",
          onAction: ($event) => unref(currentStep) === 1 ? unref(nextStep)() : handlePlaceOrder(),
          onBack: ($event) => unref(currentStep) === 1 ? unref(router).push(unref(localePath)("/cart")) : unref(prevStep)()
        }, null, _parent));
        _push(`</aside></div><!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/checkout/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
