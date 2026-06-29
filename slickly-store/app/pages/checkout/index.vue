<script setup lang="ts">
import { ArrowLeft, ArrowRight, Loader2, AlertCircle, ShoppingBag, User, Check, CheckCircle2 } from 'lucide-vue-next';

definePageMeta({ layout: 'checkout' });

useHead({ title: 'Pokladňa | SLICKLY' });

const { isEmpty } = useCart();
const { isLoggedIn } = useUser();
const isLoginModalOpen = useState('loginModalOpen', () => false);
const localePath = useLocalePath();

const GUEST_BENEFITS = [
  'Uľahčíme, urýchlime a zvýhodníme Váš nákup.',
  'Prehľad objednávok v používateľskom účte.',
  'Nikdy Vám už neunikne žiadna naša akcia, alebo zľava.',
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
    placeOrder,
} = useCheckoutFlow();

useBalneSync(selectedShippingMethodId);

// Mapovanie interných krokov (1,2) na display kroky (2,3) pre CheckoutSteps
const displayStep = computed(() => currentStep.value + 1);

// Synchonizácia s checkout layout — layout číta tento state pre navbar
const checkoutNavStep = useState('checkoutNavStep', () => 2);
watch(displayStep, (step) => { 
    if (checkoutNavStep.value !== step) checkoutNavStep.value = step; 
}, { immediate: true });

// Spätná väzba z layoutu (klikateľné kroky)
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

// --- Dynamic Express Shipping Price ---
const { apiClient } = useShopwareContext();
const config = useRuntimeConfig();
const expressProductId = config.public.shopware.ids.products?.expressShipping;
const dobierkaProductId = config.public.shopware.ids.products?.dobierka;

const [{ data: expressProduct }, { data: dobierkaProduct }] = await Promise.all([
    useAsyncData('checkout-express-product', async () => {
        if (!expressProductId) return null;
        try {
            const res = await apiClient.invoke('readProduct post /product' as any, {
                body: {
                    filter: [{ type: 'equals', field: 'id', value: expressProductId }],
                    includes: {
                        product: ['id', 'translated', 'calculatedPrice', 'seoUrls', 'cover'],
                        product_media: ['media'],
                        media: ['url', 'thumbnails']
                    }
                }
            });
            return (res?.data || res)?.elements?.[0] || null;
        } catch (e) { return null; }
    }),
    useAsyncData('checkout-dobierka-product', async () => {
        if (!dobierkaProductId) return null;
        try {
            const res = await apiClient.invoke('readProduct post /product' as any, {
                body: {
                    filter: [{ type: 'equals', field: 'id', value: dobierkaProductId }],
                    includes: { product: ['id', 'calculatedPrice'] }
                }
            });
            return (res?.data || res)?.elements?.[0] || null;
        } catch (e) { return null; }
    }),
]);

const resolveImageUrl = (imgObj?: any) => {
    const url = imgObj?.url || imgObj?.media?.url;
    if (!url) return 'https://placehold.co/160x160';
    if (import.meta.dev && url.startsWith('https://mtsport.store')) {
        return url.replace(/^https:\/\/mtsport\.store/, '/mts-proxy');
    }
    return url;
};
</script>

<template>
  <div class="container mx-auto px-4 lg:px-8">

    <!-- Prázdny košík -->
    <div v-if="isEmpty" class="flex flex-col items-center justify-center py-24 text-center">
      <div class="text-[120px] font-black font-tech uppercase text-gray-100 leading-none mb-6 select-none">EMPTY</div>
      <h2 class="text-2xl font-black font-tech uppercase mb-3">Košík je prázdny</h2>
      <p class="text-gray-500 mb-8 font-sans text-sm">Pridajte produkty do košíka a vráťte sa späť.</p>
      <BaseLink to="/" class="btn-checkout inline-flex max-w-xs gap-2">
        <ShoppingBag class="w-5 h-5" /> Späť do obchodu
      </BaseLink>
    </div>

    <template v-else>
      <!-- Step indikátor odstránený - je v navbare (layout) -->

      <!-- Nadpis kroku (Aero Style z košíka) -->
      <div class="mb-8 pb-6 border-b border-gray-200">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end">
          <div>
            <h1 v-if="currentStep === 1" class="text-3xl md:text-5xl font-black uppercase font-tech tracking-wide text-black italic leading-none">
              KONTAKTNÉ <span class="text-brand">ÚDAJE</span>
            </h1>
            <h1 v-if="currentStep === 2" class="text-3xl md:text-5xl font-black uppercase font-tech tracking-wide text-black italic leading-none">
              DOPRAVA A <span class="text-brand">PLATBA</span>
            </h1>
          </div>

          <button
            v-if="currentStep === 2"
            @click="prevStep"
            class="flex items-center gap-2 mt-4 md:mt-0 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-brand transition-colors"
          >
            <ArrowLeft class="w-3.5 h-3.5" /> Späť na kontaktné údaje
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">

        <!-- ───── Ľavý stĺpec: obsah kroku ───── -->
        <div class="space-y-4 min-w-0">

          <!-- Login banner — len pre neprihlásených -->
          <div v-if="!isLoggedIn" class="bg-black text-white px-4 md:px-6 py-4 flex items-center gap-3">
            <div class="w-8 h-8 bg-brand flex items-center justify-center flex-shrink-0">
              <User class="w-4 h-4 text-white" />
            </div>
            <div>
              <div class="font-black uppercase tracking-wide text-sm font-tech">
                Máte už účet?
                <button @click="isLoginModalOpen = true" class="text-brand hover:underline cursor-pointer ml-1 bg-transparent border-0 p-0 font-black uppercase tracking-wide text-sm font-tech">Prihláste sa</button>
              </div>
              <div class="text-xs text-gray-400 font-sans mt-0.5">Predvyplníme vaše adresy a osobné údaje automaticky.</div>
            </div>
          </div>

          <!-- Voľba: registrácia vs. hosť -->
          <div v-if="!isLoggedIn" class="border border-gray-200 bg-white">
            <!-- Toggle -->
            <div class="flex divide-x divide-gray-200">
              <button
                @click="createAccount = true"
                class="flex-1 flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left bg-transparent border-0"
                :class="createAccount ? 'bg-gray-50' : ''"
              >
                <div class="w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-colors"
                     :class="createAccount ? 'bg-black border-black' : 'border-gray-300'">
                  <Check v-if="createAccount" class="w-2.5 h-2.5 text-white" :stroke-width="3" />
                </div>
                <span class="text-[13px] font-sans" :class="createAccount ? 'text-black font-bold' : 'text-gray-500 font-medium'">
                  Chcem sa zaregistrovať
                </span>
              </button>
              <button
                @click="createAccount = false"
                class="flex-1 flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left bg-transparent border-0"
                :class="!createAccount ? 'bg-gray-50' : ''"
              >
                <div class="w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-colors"
                     :class="!createAccount ? 'bg-black border-black' : 'border-gray-300'">
                  <Check v-if="!createAccount" class="w-2.5 h-2.5 text-white" :stroke-width="3" />
                </div>
                <span class="text-[13px] font-sans" :class="!createAccount ? 'text-black font-bold' : 'text-gray-500 font-medium'">
                  Nákup bez registrácie
                </span>
              </button>
            </div>

            <!-- Panel: register / guest — jeden Transition mode=out-in zabraňuje preblikávaniu -->
            <div class="border-t border-gray-100 overflow-hidden">
              <Transition
                mode="out-in"
                enter-active-class="transition-opacity duration-150 ease-out"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition-opacity duration-100 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <!-- Register mód: heslo -->
                <div v-if="createAccount" key="register" class="px-5 py-4 bg-white space-y-3">
                  <p class="text-[11px] font-bold uppercase tracking-widest text-gray-400 font-sans">Heslo k novému účtu</p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label class="form-label">Heslo <span class="text-brand">*</span></label>
                      <input
                        v-model="accountPassword"
                        type="password"
                        placeholder="Min. 8 znakov"
                        autocomplete="new-password"
                        class="form-input w-full"
                      />
                    </div>
                    <div>
                      <label class="form-label">Potvrdiť heslo <span class="text-brand">*</span></label>
                      <input
                        v-model="accountPasswordConfirm"
                        type="password"
                        placeholder="Zopakujte heslo"
                        autocomplete="new-password"
                        class="form-input w-full"
                      />
                    </div>
                  </div>
                  <p v-if="accountPassword && accountPasswordConfirm && accountPassword !== accountPasswordConfirm" class="text-[11px] text-brand font-bold font-sans">
                    Heslá sa nezhodujú.
                  </p>
                </div>

                <!-- Hosť mód: výhody registrácie -->
                <div v-else key="guest" class="px-5 py-4 bg-white">
                  <p class="text-sm font-bold font-sans text-black mb-3">Prečo je výhodné si u nás vytvoriť účet?</p>
                  <ul class="space-y-2 mb-3">
                    <li v-for="benefit in GUEST_BENEFITS" :key="benefit" class="flex items-start gap-2.5">
                      <CheckCircle2 class="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span class="text-[13px] font-sans text-gray-600">{{ benefit }}</span>
                    </li>
                  </ul>
                  <button
                    @click="createAccount = true"
                    class="text-[13px] font-bold font-sans underline text-black hover:text-brand transition-colors bg-transparent border-0 p-0 cursor-pointer"
                  >
                    Chcem sa zaregistrovať
                  </button>
                </div>
              </Transition>
            </div>
          </div>

          <!-- KROK 1: Doručenie (adresa + spôsob dopravy) -->
          <DeliveryStep
            v-if="currentStep === 1"
            v-model:form-data="shippingAddress"
            v-model:billing-data="billingAddress"
            v-model:is-billing-different="isBillingDifferent"
            v-model:is-company-purchase="isCompanyPurchase"
            :countries="countries"
            :shipping-methods="shippingMethods"
            :shipping-method="selectedShippingMethodId"
            @update:shipping-method="handleShippingMethodChange"
          />

          <!-- KROK 2: Doprava a Platba -->
          <PaymentStep
            v-if="currentStep === 2"
            v-model:payment-method="selectedPaymentMethodId"
            v-model:shipping-method="selectedShippingMethodId"
            v-model:agreed-to-terms="agreedToTerms"
            v-model:is-express-shipping="isExpressShipping"
            v-model:pickup-point="selectedPickupPoint"
            :payment-methods="paymentMethods"
            :shipping-methods="shippingMethods"
            :express-product="expressProduct"
            :dobierka-product="dobierkaProduct"
            :shipping-address="shippingAddress"
            :countries="countries"
            @update:payment-method="handlePaymentMethodChange"
            @update:shipping-method="handleShippingMethodChange"
          />

          <!-- Error banner -->
          <div
            v-if="submitError"
            class="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 p-4 text-sm font-sans"
          >
            <AlertCircle class="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p class="font-medium">{{ submitError }}</p>
          </div>


        </div>

        <!-- ───── Pravý stĺpec: Súhrn + CTA ───── -->
        <aside class="lg:sticky lg:top-6">
          <OrderSummary
            :step="displayStep"
            :shipping-method-id="selectedShippingMethodId"
            :payment-method-id="selectedPaymentMethodId"
            :shipping-methods="shippingMethods"
            :payment-methods="paymentMethods"
            v-model:is-express-shipping="isExpressShipping"
            :express-product="expressProduct"
            :dobierka-product="dobierkaProduct"
            :country-iso="selectedCountryIso"
            :tax-rate="selectedCountryTaxRate"
            :is-reverse-charge="isB2bReverseCharge"
            :is-company-purchase="isCompanyPurchase"
            :can-action="currentStep === 1 ? canProceedToPayment : canPlaceOrder"
            :is-submitting="isSubmitting"
            :action-label="currentStep === 1 ? 'Pokračovať na dopravu a platbu' : 'Záväzne objednať'"
            :back-label="currentStep === 1 ? 'Späť do košíka' : 'Späť na kontaktné údaje'"
            @action="currentStep === 1 ? nextStep() : handlePlaceOrder()"
            @back="currentStep === 1 ? router.push(localePath('/cart')) : prevStep()"
          />
        </aside>

      </div>
    </template>
  </div>
</template>
