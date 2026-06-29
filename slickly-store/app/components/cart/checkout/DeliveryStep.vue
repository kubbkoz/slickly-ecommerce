<script setup lang="ts">
import { Globe, ChevronDown, FileText, Briefcase, ShieldCheck, Truck, MapPin, CheckCircle, XCircle, AlertCircle, Loader2, User, LogIn } from 'lucide-vue-next';
import type { ShippingAddressForm, BillingAddressForm } from '~/composables/useCheckoutFlow';
import {
    validateShippingForm, validateBillingForm, companyLabel,
    MAX_NAME_LEN, MAX_COMPANY_LEN,
} from '~/utils/checkoutValidation';

const props = defineProps<{
    formData: ShippingAddressForm;
    billingData: BillingAddressForm;
    isBillingDifferent: boolean;
    isCompanyPurchase: boolean;
    countries: { value: string; label: string; iso?: string }[];
    shippingMethods: any[];
    shippingMethod: string;
}>();

const emit = defineEmits<{
    (e: 'update:formData', val: ShippingAddressForm): void;
    (e: 'update:billingData', val: BillingAddressForm): void;
    (e: 'update:isBillingDifferent', val: boolean): void;
    (e: 'update:isCompanyPurchase', val: boolean): void;
    (e: 'update:shippingMethod', val: string): void;
}>();

const { isLoggedIn } = useUser();
const { openModal } = useUiState();
const { cartItems } = useCart();
const localForm = ref({ ...props.formData });
const localBilling = ref({ ...props.billingData });

// ── Email exists check ────────────────────────────────────────────────────
const isLoginModalOpen = useState('loginModalOpen', () => false);
const emailExists = ref(false);
const emailCheckLoading = ref(false);
let emailDebounceTimer: ReturnType<typeof setTimeout> | null = null;

const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

const runEmailCheck = async (val: string) => {
    if (!val || !isValidEmail(val)) return;
    if (emailDebounceTimer) { clearTimeout(emailDebounceTimer); emailDebounceTimer = null; }
    emailCheckLoading.value = true;
    try {
        const res = await $fetch<{ exists: boolean }>('/api/account/check-email', { query: { email: val } });
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

// VIES real-time validácia

const showShipping = computed(() =>
    !!(localForm.value.firstName && localForm.value.lastName &&
       localForm.value.email && localForm.value.street &&
       localForm.value.city && localForm.value.zipcode && localForm.value.countryId)
);

// ── Country-aware validácia (inline UX) ────────────────────────────────────
const shippingIso = computed(() =>
    (props.countries.find(c => c.value === localForm.value.countryId)?.iso || '').toUpperCase()
);
const billingIso = computed(() =>
    (props.countries.find(c => c.value === localBilling.value.countryId)?.iso || '').toUpperCase()
);

const touched = reactive<Record<string, boolean>>({});
const billingTouched = reactive<Record<string, boolean>>({});
const markTouched = (f: string) => { touched[f] = true; };
const markBillingTouched = (f: string) => { billingTouched[f] = true; };

const errors = computed(() =>
    validateShippingForm(localForm.value, shippingIso.value, props.isCompanyPurchase)
);
const billingErrors = computed(() =>
    props.isBillingDifferent ? validateBillingForm(localBilling.value, billingIso.value) : {}
);

const fieldErr = (f: string): string => (touched[f] ? errors.value[f] : '') || '';
const billingErr = (f: string): string => (billingTouched[f] ? (billingErrors.value as Record<string, string>)[f] : '') || '';

const errInputClass = (f: string) => fieldErr(f) ? 'border-red-400 ring-2 ring-red-400/10' : '';
const billingErrInputClass = (f: string) => billingErr(f) ? 'border-red-400 ring-2 ring-red-400/10' : '';

// Country-aware názvy firemných polí (CZ/PL ekvivalenty v zátvorke)
const lblIco = computed(() => companyLabel('ico', shippingIso.value));
const lblDic = computed(() => companyLabel('dic', shippingIso.value));
const lblVat = computed(() => companyLabel('vat', shippingIso.value));

// IČ DPH placeholder podľa vybranej krajiny
const vatPlaceholder = computed(() => {
    const c = props.countries.find(c => c.value === localForm.value.countryId);
    return (c?.iso || 'SK') + '...';
});

// VIES real-time validácia
const viesStatus = ref<'idle' | 'loading' | 'valid' | 'invalid' | 'error'>('idle');
const viesCompanyName = ref('');
const viesError = ref('');
let viesDebounceTimer: ReturnType<typeof setTimeout> | null = null;

async function validateVies(vatId: string) {
    const cleaned = vatId.trim().replace(/\s/g, '');
    if (!cleaned || cleaned.length < 4) {
        viesStatus.value = 'idle';
        viesCompanyName.value = '';
        viesError.value = '';
        return;
    }
    if (!/^[A-Za-z]{2}\d{2,}/.test(cleaned)) {
        viesStatus.value = 'idle';
        viesError.value = 'Formát: SK1234567890';
        return;
    }
    viesStatus.value = 'loading';
    viesCompanyName.value = '';
    viesError.value = '';
    try {
        const result = await $fetch<{ valid: boolean; name?: string; error?: string }>('/api/vies-validate', {
            query: { vatId: cleaned },
        });
        if (result.valid) {
            viesStatus.value = 'valid';
            viesCompanyName.value = result.name || '';
            viesError.value = '';
            if (result.name) localForm.value.company = result.name;
            if (cleaned.startsWith('SK') || cleaned.startsWith('CZ')) {
                localForm.value.dic = cleaned.substring(2);
            }
        } else {
            viesStatus.value = 'invalid';
            viesCompanyName.value = '';
            viesError.value = result.error || 'IČ DPH nie je registrované v systéme VIES.';
        }
    } catch (err: any) {
        viesStatus.value = 'error';
        viesCompanyName.value = '';
        viesError.value = err?.data?.message || err?.statusMessage || 'VIES služba nedostupná.';
    }
}

watch(() => localForm.value.icdph, (newVal) => {
    if (viesDebounceTimer) clearTimeout(viesDebounceTimer);
    if (!newVal?.trim()) {
        viesStatus.value = 'idle';
        viesCompanyName.value = '';
        viesError.value = '';
        return;
    }
    viesDebounceTimer = setTimeout(() => validateVies(newVal), 800);
});

// Reset pri odkliknutí firmy
watch(() => props.isCompanyPurchase, (isCompany) => {
    if (!isCompany) {
        localForm.value.company = '';
        localForm.value.icdph = '';
        localForm.value.ico = '';
        localForm.value.dic = '';
        viesStatus.value = 'idle';
        viesCompanyName.value = '';
        viesError.value = '';
    } else if (localForm.value.icdph) {
        validateVies(localForm.value.icdph);
    }
}, { immediate: true });

watch(localForm, (val) => {
    emit('update:formData', val);
}, { deep: true });

watch(localBilling, (val) => {
    emit('update:billingData', val);
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
</script>

<template>
  <div class="space-y-4 animate-fade-in font-sans">


    <!-- ── Kontaktné údaje ── -->
    <div class="bg-white border border-gray-200">
      <div class="flex items-center gap-3 px-5 md:px-6 py-5 border-b border-gray-100 bg-white">
        <User class="w-4 h-4 text-gray-900" :stroke-width="1.8" />
        <h2 class="text-xs font-bold tracking-[0.2em] text-gray-900 font-sans uppercase leading-none">Kontaktné údaje</h2>
      </div>
      <div class="px-5 md:px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="md:col-span-2">
          <label class="form-label">Email *</label>
          <div class="relative">
            <input
              v-model="localForm.email"
              type="email"
              autocomplete="email"
              class="form-input pr-9"
              :class="errInputClass('email')"
              placeholder="vas@email.sk"
              @blur="markTouched('email'); runEmailCheck(localForm.email)"
            />
            <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Loader2 v-if="emailCheckLoading" class="w-4 h-4 text-gray-400 animate-spin" />
            </div>
          </div>
          <p v-if="fieldErr('email')" class="mt-1 text-[11px] text-red-600">{{ fieldErr('email') }}</p>
          <div v-if="emailExists && !isLoggedIn" class="mt-2 flex items-center gap-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2">
            <LogIn class="w-3.5 h-3.5 flex-shrink-0" />
            <span>Na tento e-mail už existuje účet. <button type="button" @click="isLoginModalOpen = true" class="font-bold underline hover:text-brand transition-colors bg-transparent border-0 p-0 cursor-pointer">Chcete sa prihlásiť?</button></span>
          </div>
        </div>
        <div>
          <label class="form-label">Meno *</label>
          <input v-model="localForm.firstName" type="text" autocomplete="given-name" :maxlength="MAX_NAME_LEN" class="form-input" :class="errInputClass('firstName')" @blur="markTouched('firstName')" />
          <p v-if="fieldErr('firstName')" class="mt-1 text-[11px] text-red-600">{{ fieldErr('firstName') }}</p>
        </div>
        <div>
          <label class="form-label">Priezvisko *</label>
          <input v-model="localForm.lastName" type="text" autocomplete="family-name" :maxlength="MAX_NAME_LEN" class="form-input" :class="errInputClass('lastName')" @blur="markTouched('lastName')" />
          <p v-if="fieldErr('lastName')" class="mt-1 text-[11px] text-red-600">{{ fieldErr('lastName') }}</p>
        </div>
        <div class="md:col-span-2">
          <label class="form-label">Telefón *</label>
          <input v-model="localForm.phone" type="tel" autocomplete="tel" class="form-input" :class="errInputClass('phone')" placeholder="+421 9XX XXX XXX" @blur="markTouched('phone')" />
          <p v-if="fieldErr('phone')" class="mt-1 text-[11px] text-red-600">{{ fieldErr('phone') }}</p>
        </div>
      </div>
    </div>

    <!-- ── Adresa doručenia ── -->
    <div class="bg-white border border-gray-200">
      <div class="flex items-center gap-3 px-5 md:px-6 py-5 border-b border-gray-100 bg-white">
        <MapPin class="w-4 h-4 text-gray-900" :stroke-width="1.8" />
        <h2 class="text-xs font-bold tracking-[0.2em] text-gray-900 font-sans uppercase leading-none">Adresa doručenia</h2>
      </div>
      <div class="px-5 md:px-8 py-6 space-y-5">
        <div>
          <label class="form-label flex items-center gap-1"><Globe class="w-3 h-3" /> Krajina *</label>
          <div class="relative">
            <select v-model="localForm.countryId" class="form-input appearance-none pr-10">
              <option value="" disabled>Vyberte krajinu</option>
              <option v-for="c in countries" :key="c.value" :value="c.value">{{ c.label }}</option>
            </select>
            <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label class="form-label">Ulica a číslo *</label>
          <input v-model="localForm.street" type="text" autocomplete="street-address" maxlength="60" class="form-input" :class="errInputClass('street')" @blur="markTouched('street')" />
          <p v-if="fieldErr('street')" class="mt-1 text-[11px] text-red-600">{{ fieldErr('street') }}</p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">Mesto *</label>
            <input v-model="localForm.city" type="text" autocomplete="address-level2" class="form-input" :class="errInputClass('city')" @blur="markTouched('city')" />
            <p v-if="fieldErr('city')" class="mt-1 text-[11px] text-red-600">{{ fieldErr('city') }}</p>
          </div>
          <div>
            <label class="form-label">PSČ *</label>
            <input v-model="localForm.zipcode" type="text" autocomplete="postal-code" class="form-input" :class="errInputClass('zipcode')" @blur="markTouched('zipcode')" />
            <p v-if="fieldErr('zipcode')" class="mt-1 text-[11px] text-red-600">{{ fieldErr('zipcode') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Voliteľné: Iné fakturačné údaje ── -->
    <div class="bg-white border border-gray-200 px-5 md:px-8 py-5 space-y-4">

      <label class="flex items-center gap-3 cursor-pointer group">
        <div class="relative flex items-center justify-center w-4 h-4 border border-gray-300 group-hover:border-black transition-colors bg-white flex-shrink-0">
          <input
            type="checkbox"
            class="sr-only"
            :checked="isBillingDifferent"
            @change="(e) => emit('update:isBillingDifferent', (e.target as HTMLInputElement).checked)"
          />
          <div v-if="isBillingDifferent" class="w-2.5 h-2.5 bg-black"></div>
        </div>
        <span class="text-[11px] font-bold uppercase tracking-widest text-black flex items-center gap-2">
          <FileText class="w-3.5 h-3.5 text-gray-400" />
          Iné fakturačné údaje
        </span>
      </label>

      <div v-if="isBillingDifferent" class="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50 border border-gray-100 p-5 animate-slide-up">
        <div>
          <label class="form-label">Meno</label>
          <input v-model="localBilling.firstName" type="text" :maxlength="MAX_NAME_LEN" class="form-input bg-white" :class="billingErrInputClass('firstName')" @blur="markBillingTouched('firstName')" />
          <p v-if="billingErr('firstName')" class="mt-1 text-[11px] text-red-600">{{ billingErr('firstName') }}</p>
        </div>
        <div>
          <label class="form-label">Priezvisko</label>
          <input v-model="localBilling.lastName" type="text" :maxlength="MAX_NAME_LEN" class="form-input bg-white" :class="billingErrInputClass('lastName')" @blur="markBillingTouched('lastName')" />
          <p v-if="billingErr('lastName')" class="mt-1 text-[11px] text-red-600">{{ billingErr('lastName') }}</p>
        </div>
        <div class="md:col-span-2">
          <label class="form-label flex items-center gap-1"><Globe class="w-3 h-3" /> Fakturačná krajina</label>
          <div class="relative">
            <select v-model="localBilling.countryId" class="form-input bg-white appearance-none pr-10">
              <option value="" disabled>Vyberte krajinu</option>
              <option v-for="c in countries" :key="c.value" :value="c.value">{{ c.label }}</option>
            </select>
            <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div class="md:col-span-2">
          <label class="form-label">Ulica a číslo</label>
          <input v-model="localBilling.street" type="text" maxlength="60" class="form-input bg-white" :class="billingErrInputClass('street')" @blur="markBillingTouched('street')" />
          <p v-if="billingErr('street')" class="mt-1 text-[11px] text-red-600">{{ billingErr('street') }}</p>
        </div>
        <div>
          <label class="form-label">Mesto</label>
          <input v-model="localBilling.city" type="text" class="form-input bg-white" :class="billingErrInputClass('city')" @blur="markBillingTouched('city')" />
          <p v-if="billingErr('city')" class="mt-1 text-[11px] text-red-600">{{ billingErr('city') }}</p>
        </div>
        <div>
          <label class="form-label">PSČ</label>
          <input v-model="localBilling.zipcode" type="text" class="form-input bg-white" :class="billingErrInputClass('zipcode')" @blur="markBillingTouched('zipcode')" />
          <p v-if="billingErr('zipcode')" class="mt-1 text-[11px] text-red-600">{{ billingErr('zipcode') }}</p>
        </div>
      </div>

      <label class="flex items-center gap-3 cursor-pointer group">
        <div class="relative flex items-center justify-center w-4 h-4 border border-gray-300 group-hover:border-black transition-colors bg-white flex-shrink-0">
          <input
            type="checkbox"
            class="sr-only"
            :checked="isCompanyPurchase"
            @change="(e) => emit('update:isCompanyPurchase', (e.target as HTMLInputElement).checked)"
          />
          <div v-if="isCompanyPurchase" class="w-2.5 h-2.5 bg-black"></div>
        </div>
        <span class="text-[11px] font-bold uppercase tracking-widest text-black flex items-center gap-2">
          <Briefcase class="w-3.5 h-3.5 text-gray-400" />
          Nakupujem na firmu
        </span>
      </label>

      <div v-if="isCompanyPurchase" class="animate-slide-up space-y-4 bg-gray-50 border border-gray-100 p-6">
        <!-- 1. IČ DPH — prvé, VIES overenie -->
        <div>
          <label class="form-label flex items-center gap-2">
            {{ lblVat }} *
            <span v-if="viesStatus === 'valid'" class="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 tracking-wider flex items-center gap-1">
              <CheckCircle class="w-3 h-3" /> Overené VIES
            </span>
            <span v-else-if="viesStatus === 'invalid'" class="text-[9px] text-red-600 bg-red-50 px-1.5 py-0.5 tracking-wider flex items-center gap-1">
              <XCircle class="w-3 h-3" /> Neplatné
            </span>
            <span v-else-if="viesStatus === 'error'" class="text-[9px] text-amber-600 bg-amber-50 px-1.5 py-0.5 tracking-wider flex items-center gap-1">
              <AlertCircle class="w-3 h-3" /> Nedostupné
            </span>
          </label>
          <div class="relative">
            <input 
              v-model="localForm.icdph" 
              type="text" 
              :placeholder="vatPlaceholder"
              class="form-input bg-white pr-12 transition-all duration-200" 
              :class="{
                'border-green-400 ring-2 ring-green-400/10': viesStatus === 'valid',
                'border-red-400 ring-2 ring-red-400/10': viesStatus === 'invalid',
                'border-amber-400': viesStatus === 'error'
              }"
            />
            <div class="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 v-if="viesStatus === 'loading'" class="w-5 h-5 text-gray-400 animate-spin" />
              <CheckCircle v-else-if="viesStatus === 'valid'" class="w-5 h-5 text-green-500" />
              <XCircle v-else-if="viesStatus === 'invalid'" class="w-5 h-5 text-red-500" />
              <AlertCircle v-else-if="viesStatus === 'error'" class="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <p v-if="viesStatus === 'invalid' && viesError" class="mt-1.5 text-[11px] text-red-600">
            {{ viesError }}
          </p>
          <p v-if="viesStatus === 'error' && viesError" class="mt-1.5 text-[11px] text-amber-600">
            {{ viesError }}
          </p>
        </div>

        <!-- 2. Názov firmy — auto-fill z VIES -->
        <div>
          <label class="form-label flex items-center gap-2">
            Názov firmy *
            <span v-if="viesStatus === 'valid' && viesCompanyName" class="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 tracking-wider flex items-center gap-1">
              <ShieldCheck class="w-3 h-3" /> z VIES
            </span>
          </label>
          <input v-model="localForm.company" type="text" :maxlength="MAX_COMPANY_LEN" class="form-input bg-white" :class="errInputClass('company')" @blur="markTouched('company')" />
          <p v-if="fieldErr('company')" class="mt-1 text-[11px] text-red-600">{{ fieldErr('company') }}</p>
        </div>

        <!-- 3. IČO + DIČ -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label">{{ lblIco }} *</label>
            <input v-model="localForm.ico" type="text" class="form-input bg-white" :class="errInputClass('ico')" @blur="markTouched('ico')" />
            <p v-if="fieldErr('ico')" class="mt-1 text-[11px] text-red-600">{{ fieldErr('ico') }}</p>
          </div>
          <div>
            <label class="form-label">{{ lblDic }}</label>
            <input v-model="localForm.dic" type="text" class="form-input bg-white" :class="errInputClass('dic')" @blur="markTouched('dic')" />
            <p v-if="fieldErr('dic')" class="mt-1 text-[11px] text-red-600">{{ fieldErr('dic') }}</p>
          </div>
        </div>
      </div>

      <!-- Poznámka -->
      <div class="pt-2 border-t border-gray-100">
        <label class="form-label">Poznámka k objednávke</label>
        <textarea
          v-model="localForm.note"
          rows="3"
          class="form-input resize-none"
          placeholder="Nepovinné — špeciálne inštrukcie pre doručenie..."
        />
      </div>

      <!-- GDPR -->
      <div class="flex items-center gap-3 p-4 border border-brand/20 bg-brand/5 text-gray-600 text-[11px] font-sans">
        <ShieldCheck class="w-4 h-4 flex-shrink-0 text-brand" />
        Vaše údaje sú u nás v bezpečí a spracované výhradne podľa GDPR.
      </div>

    </div>
  </div>
</template>
