<script setup lang="ts">
import { computed } from 'vue';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-vue-next';
import type { ReturnFormData } from '~/composables/useReturnForm';

const props = defineProps<{
  formData: ReturnFormData;
  errors: string[];
  submitError: string | null;
}>();

const typeLabel = computed(() =>
  props.formData.formType === 'reklamacia' ? 'Reklamácia' : 'Vrátenie tovaru',
);

const summary = computed(() => [
  { label: 'Typ žiadosti', value: typeLabel.value },
  { label: 'Číslo objednávky', value: props.formData.orderNumber },
  { label: 'Dátum objednávky', value: props.formData.orderDate || '—' },
  { label: 'Číslo faktúry', value: props.formData.invoiceNumber || '—' },
  { label: 'Meno', value: `${props.formData.firstName} ${props.formData.lastName}`.trim() },
  { label: 'Email', value: props.formData.customerEmail },
  { label: 'Telefón', value: props.formData.customerPhone },
  { label: 'Adresa', value: props.formData.customerAddress },
  ...(props.formData.bankAccount ? [{ label: 'IBAN', value: props.formData.bankAccount }] : []),
  { label: 'Popis tovaru', value: props.formData.itemsDescription },
  { label: 'Dôvod', value: props.formData.reasonDetail },
  { label: 'Príloh', value: `${props.formData.attachmentPaths.length} (fotky/videá), ${props.formData.warrantyPaths.length} (záručný list)` },
]);
</script>

<template>
  <div class="space-y-5">
    <h3 class="text-sm font-bold uppercase tracking-widest font-tech text-gray-700">
      Súhrn žiadosti
    </h3>

    <div class="border border-gray-200 divide-y divide-gray-100 text-sm">
      <div v-for="row in summary" :key="row.label" class="flex flex-col sm:flex-row sm:justify-between py-3 px-4 gap-1">
        <span class="text-gray-500 font-medium text-xs uppercase tracking-wider font-tech">{{ row.label }}</span>
        <span class="text-gray-900 font-medium sm:text-right sm:max-w-[60%] whitespace-pre-line">{{ row.value }}</span>
      </div>
    </div>

    <!-- Return address card -->
    <div class="border border-gray-200 p-4 bg-gray-50">
      <p class="text-xs uppercase tracking-widest font-tech text-gray-500 mb-2">
        Tovar zasielajte na adresu:
      </p>
      <p class="font-bold font-tech text-lg mb-1">SLICKLY</p>
      <p class="text-sm text-gray-700 flex items-start mb-2">
        <MapPin class="w-4 h-4 mr-2 text-brand mt-0.5 flex-shrink-0" />
        [adresa pre vrátenie — doplniť]
      </p>
      <div class="flex flex-wrap gap-4 text-xs">
        <a href="tel:+421948993236" class="flex items-center text-gray-700 hover:text-brand">
          <Phone class="w-3.5 h-3.5 mr-1" /> 0948 993 236
        </a>
        <a href="mailto:info@slickly.sk" class="flex items-center text-gray-700 hover:text-brand">
          <Mail class="w-3.5 h-3.5 mr-1" /> info@slickly.sk
        </a>
      </div>
    </div>

    <!-- GDPR confirm -->
    <label class="flex items-start cursor-pointer">
      <input v-model="formData.gdprConsent" type="checkbox"
             class="mt-1 mr-3 w-4 h-4 accent-brand" />
      <span class="text-sm text-gray-700 leading-relaxed">
        Potvrdzujem, že všetky uvedené údaje sú správne a súhlasím s podaním žiadosti podľa § 20a zákona č. 108/2024 Z. z. o ochrane spotrebiteľa.
      </span>
    </label>

    <NuxtLink to="/poucenie-o-uplatneni-prava-spotrebitela"
              target="_blank"
              class="inline-flex items-center text-xs text-brand hover:underline">
      <ExternalLink class="w-3 h-3 mr-1" />
      Prečítať poučenie o uplatnení práva spotrebiteľa
    </NuxtLink>

    <p class="text-xs text-gray-500 italic" v-if="formData.formType === 'vratenie'">
      Kúpna cena bude vrátená na IBAN po doručení a skontrolovaní tovaru, do 14 dní od doručenia.
    </p>

    <div v-if="errors.length" class="border border-brand bg-brand/5 p-3 text-xs text-brand">
      <ul class="list-disc list-inside space-y-1">
        <li v-for="err in errors" :key="err">{{ err }}</li>
      </ul>
    </div>

    <div v-if="submitError" class="border border-brand bg-brand/5 p-3 text-sm text-brand">
      <strong>Chyba pri odoslaní:</strong> {{ submitError }}
    </div>
  </div>
</template>
