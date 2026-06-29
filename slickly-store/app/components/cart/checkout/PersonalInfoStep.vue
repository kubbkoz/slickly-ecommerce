<script setup lang="ts">
import { Globe, ChevronDown, FileText, Briefcase, ShieldCheck } from 'lucide-vue-next';
import type { ShippingAddressForm, BillingAddressForm } from '~/composables/useCheckoutFlow';

const props = defineProps<{
    formData: ShippingAddressForm;
    billingData: BillingAddressForm;
    isBillingDifferent: boolean;
    isCompanyPurchase: boolean;
    countries: { value: string; label: string }[];
}>();

const emit = defineEmits<{
    (e: 'update:formData', val: ShippingAddressForm): void;
    (e: 'update:billingData', val: BillingAddressForm): void;
    (e: 'update:isBillingDifferent', val: boolean): void;
    (e: 'update:isCompanyPurchase', val: boolean): void;
}>();

const localForm = ref({ ...props.formData });
const localBilling = ref({ ...props.billingData });

watch(localForm, (val) => emit('update:formData', val), { deep: true });
watch(localBilling, (val) => emit('update:billingData', val), { deep: true });
watch(() => props.formData, (val) => { localForm.value = { ...val }; }, { deep: true });
watch(() => props.billingData, (val) => { localBilling.value = { ...val }; }, { deep: true });
</script>

<template>
  <div class="bg-white border border-gray-200 animate-fade-in font-sans">

    <!-- Header — vzor CartHeader -->
    <div class="flex items-center gap-3 px-5 md:px-8 py-5 border-b border-gray-100">
      <span class="w-1 h-5 bg-brand inline-block flex-shrink-0"></span>
      <h2 class="text-sm font-bold tracking-[0.2em] text-gray-900 uppercase">
        Osobné údaje a adresa
      </h2>
    </div>

    <div class="px-5 md:px-8 py-6 space-y-6">

      <!-- Kontaktné údaje -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="form-label">Email *</label>
          <input v-model="localForm.email" type="email" autocomplete="email" class="form-input" placeholder="vas@email.sk" />
        </div>
        <div>
          <label class="form-label">Telefón *</label>
          <input v-model="localForm.phone" type="tel" autocomplete="tel" class="form-input" placeholder="+421 9XX XXX XXX" />
        </div>
        <div>
          <label class="form-label">Meno *</label>
          <input v-model="localForm.firstName" type="text" autocomplete="given-name" class="form-input" />
        </div>
        <div>
          <label class="form-label">Priezvisko *</label>
          <input v-model="localForm.lastName" type="text" autocomplete="family-name" class="form-input" />
        </div>
      </div>

      <!-- Doručovacia adresa -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="md:col-span-2">
          <label class="form-label flex items-center gap-1">
            <Globe class="w-3 h-3" /> Krajina doručenia *
          </label>
          <div class="relative">
            <select v-model="localForm.countryId" class="form-input appearance-none pr-10">
              <option value="" disabled>Vyberte krajinu</option>
              <option v-for="c in countries" :key="c.value" :value="c.value">{{ c.label }}</option>
            </select>
            <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div class="md:col-span-2">
          <label class="form-label">Ulica a číslo *</label>
          <input v-model="localForm.street" type="text" autocomplete="street-address" class="form-input" />
        </div>
        <div>
          <label class="form-label">Mesto *</label>
          <input v-model="localForm.city" type="text" autocomplete="address-level2" class="form-input" />
        </div>
        <div>
          <label class="form-label">PSČ *</label>
          <input v-model="localForm.zipcode" type="text" autocomplete="postal-code" class="form-input" />
        </div>
      </div>

      <!-- Iné fakturačné údaje — custom checkbox -->
      <div class="pt-4 border-t border-gray-100">
        <label class="flex items-center gap-3 cursor-pointer mb-4 group">
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
            <input v-model="localBilling.firstName" type="text" class="form-input bg-white" />
          </div>
          <div>
            <label class="form-label">Priezvisko</label>
            <input v-model="localBilling.lastName" type="text" class="form-input bg-white" />
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
            <input v-model="localBilling.street" type="text" class="form-input bg-white" />
          </div>
          <div>
            <label class="form-label">Mesto</label>
            <input v-model="localBilling.city" type="text" class="form-input bg-white" />
          </div>
          <div>
            <label class="form-label">PSČ</label>
            <input v-model="localBilling.zipcode" type="text" class="form-input bg-white" />
          </div>
        </div>
      </div>

      <!-- Nákup na firmu — custom checkbox -->
      <div class="pt-4 border-t border-gray-100">
        <label class="flex items-center gap-3 cursor-pointer mb-4 group">
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

        <div v-if="isCompanyPurchase" class="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50 border border-gray-100 p-5 animate-slide-up">
          <div class="md:col-span-2">
            <label class="form-label">Názov firmy</label>
            <input v-model="localForm.company" type="text" class="form-input bg-white" />
          </div>
          <div>
            <label class="form-label">IČO</label>
            <input v-model="localForm.ico" type="text" class="form-input bg-white" />
          </div>
          <div>
            <label class="form-label">DIČ</label>
            <input v-model="localForm.dic" type="text" class="form-input bg-white" />
          </div>
          <div>
            <label class="form-label">IČ DPH</label>
            <input v-model="localForm.icdph" type="text" class="form-input bg-white" />
          </div>
        </div>
      </div>

      <!-- Poznámka -->
      <div class="pt-4 border-t border-gray-100">
        <label class="form-label">Poznámka k objednávke</label>
        <textarea v-model="localForm.note" rows="3" class="form-input resize-none" placeholder="Nepovinné — špeciálne inštrukcie pre doručenie..." />
      </div>

      <!-- GDPR -->
      <div class="flex items-center gap-3 p-4 border border-gray-100 bg-gray-50 text-gray-500 text-[11px] font-sans">
        <ShieldCheck class="w-4 h-4 flex-shrink-0 text-brand" />
        Vaše údaje sú u nás v bezpečí a spracované výhradne podľa GDPR.
      </div>

    </div>
  </div>
</template>
