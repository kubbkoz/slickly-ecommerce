<script setup lang="ts">
import { computed, watch } from 'vue';
import { RotateCcw, Wrench, Loader2, Check, AlertCircle } from 'lucide-vue-next';
import type { FormType, ReturnFormData } from '~/composables/useReturnForm';

const props = defineProps<{
  formData: ReturnFormData;
  orderLookup: {
    loading: boolean;
    found: boolean;
    within14Days: boolean;
    daysSinceOrder: number;
    order: any;
    error: string | null;
  };
  errors: string[];
  skipOrderLookup?: boolean;
}>();

const emit = defineEmits<{
  (e: 'lookup'): void;
  (e: 'update:formType', val: FormType): void;
}>();

const setType = (t: FormType) => emit('update:formType', t);

const showOrderFields = computed(() => !!props.formData.formType);

// Auto-lookup keď user dopíše orderNumber + email (debounced v parente)
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
watch(
  () => [props.formData.orderNumber, props.formData.customerEmail],
  () => {
    if (props.skipOrderLookup) return;
    if (props.formData.orderNumber.trim().length >= 3 && isValidEmail(props.formData.customerEmail)) {
      emit('lookup');
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="space-y-6">
    <!-- Type selector -->
    <div>
      <h3 class="text-sm font-bold uppercase tracking-widest font-tech text-gray-700 mb-3">
        Vyberte typ žiadosti
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          class="border-2 p-4 text-left transition-all font-tech rounded-none"
          :class="formData.formType === 'vratenie'
            ? 'border-brand bg-brand/5 text-brand'
            : 'border-gray-200 hover:border-gray-400'"
          @click="setType('vratenie')"
        >
          <div class="flex items-center mb-1">
            <RotateCcw class="w-5 h-5 mr-2" />
            <span class="font-bold uppercase tracking-wider text-sm">Vrátenie tovaru</span>
          </div>
          <p class="text-xs text-gray-500">Do 14 dní bez udania dôvodu</p>
        </button>

        <button
          type="button"
          class="border-2 p-4 text-left transition-all font-tech rounded-none"
          :class="formData.formType === 'reklamacia'
            ? 'border-brand bg-brand/5 text-brand'
            : 'border-gray-200 hover:border-gray-400'"
          @click="setType('reklamacia')"
        >
          <div class="flex items-center mb-1">
            <Wrench class="w-5 h-5 mr-2" />
            <span class="font-bold uppercase tracking-wider text-sm">Reklamácia</span>
          </div>
          <p class="text-xs text-gray-500">Poškodený alebo chybný tovar</p>
        </button>
      </div>
    </div>

    <!-- Order fields — visible after type chosen -->
    <div v-if="showOrderFields" class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
            Číslo objednávky <span class="text-brand">*</span>
          </label>
          <input
            v-model="formData.orderNumber"
            type="text"
            placeholder="napr. 10006"
            autocomplete="off"
            class="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-brand focus:outline-none font-sans"
          />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
            Email z objednávky <span class="text-brand">*</span>
          </label>
          <input
            v-model="formData.customerEmail"
            type="email"
            placeholder="vas@email.sk"
            autocomplete="email"
            class="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-brand focus:outline-none font-sans"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
            Dátum objednávky
          </label>
          <input
            v-model="formData.orderDate"
            type="date"
            class="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-brand focus:outline-none font-sans"
          />
          <p class="text-[10px] text-gray-400 mt-1">Doplní sa automaticky po nájdení objednávky.</p>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
            Číslo faktúry
          </label>
          <input
            v-model="formData.invoiceNumber"
            type="text"
            placeholder="napr. FAC-2026-1042"
            class="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-brand focus:outline-none font-sans"
          />
        </div>
      </div>

      <!-- Lookup status -->
      <div v-if="orderLookup.loading" class="flex items-center text-xs text-gray-500">
        <Loader2 class="w-4 h-4 mr-2 animate-spin" />
        Hľadám objednávku…
      </div>
      <div v-else-if="orderLookup.found" class="border p-3 text-xs"
           :class="orderLookup.within14Days ? 'border-green-200 bg-green-50 text-green-800' : 'border-orange-200 bg-orange-50 text-orange-800'">
        <div class="flex items-start">
          <Check v-if="orderLookup.within14Days" class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <AlertCircle v-else class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p class="font-bold">Objednávka nájdená</p>
            <p>{{ orderLookup.order?.customerName }} · {{ orderLookup.order?.orderDate }}</p>
            <p v-if="orderLookup.within14Days">✓ V lehote 14 dní ({{ orderLookup.daysSinceOrder }} dní od objednávky)</p>
            <p v-else>⚠ Lehota 14 dní môže byť prekročená ({{ orderLookup.daysSinceOrder }} dní od objednávky)</p>
          </div>
        </div>
      </div>
      <div v-else-if="formData.orderNumber.length >= 4 && /@/.test(formData.customerEmail) && !orderLookup.loading"
           class="border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
        Objednávka nenájdená — môžete pokračovať, údaje overíme manuálne.
      </div>
    </div>

    <!-- Errors -->
    <div v-if="errors.length" class="border border-brand bg-brand/5 p-3 text-xs text-brand">
      <ul class="list-disc list-inside space-y-1">
        <li v-for="err in errors" :key="err">{{ err }}</li>
      </ul>
    </div>
  </div>
</template>
