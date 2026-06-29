<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Loader2 } from 'lucide-vue-next';
import ReturnFormStep1 from '~/components/returns/ReturnFormStep1.vue';
import ReturnFormStep2 from '~/components/returns/ReturnFormStep2.vue';
import ReturnFormStep3 from '~/components/returns/ReturnFormStep3.vue';
import ReturnFormSuccess from '~/components/returns/ReturnFormSuccess.vue';
import { useReturnForm, type FormType } from '~/composables/useReturnForm';

definePageMeta({ layout: 'default' });

const route = useRoute();
const queryType = computed<FormType>(() =>
  route.query.type === 'reklamacia' ? 'reklamacia' : 'vratenie',
);

const {
  currentStep, totalSteps, formData, attachments, warrantyFiles,
  orderLookup, isSubmitting, submitError, submitResult, stepErrors,
  labels, reasons,
  nextStep, prevStep,
  debouncedLookup, addFiles, removeFile, submit,
} = useReturnForm({ initialFormType: queryType.value });

const onSubmit = async () => { await submit(); };

const progress = computed(() => {
  if (currentStep.value === 4) return 100;
  return Math.round(((currentStep.value as number) / totalSteps) * 100);
});

useHead({
  title: 'Odstúpenie od zmluvy a reklamácia',
  meta: [
    { name: 'description', content: 'Vyplňte formulár pre odstúpenie od kúpnej zmluvy alebo reklamáciu tovaru v zmysle § 20a zákona č. 108/2024 Z. z.' },
    { property: 'og:title', content: 'Odstúpenie od zmluvy a reklamácia | SLICKLY' },
  ],
});
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-12">
    <div class="max-w-4xl mx-auto px-4">

      <!-- Hero header -->
      <header class="text-center mb-10">
        <p class="text-[10px] uppercase tracking-widest text-brand font-tech mb-2">Zákaznícka podpora</p>
        <h1 class="font-tech text-4xl sm:text-5xl font-black uppercase tracking-wide mb-4">
          Odstúpenie / Reklamácia
        </h1>
        <p class="text-sm text-gray-600 max-w-2xl mx-auto">
          V súlade s § 20a zákona č. 108/2024 Z. z. o ochrane spotrebiteľa máte právo odstúpiť od zmluvy
          bez udania dôvodu do <strong>14 dní</strong> od prevzatia tovaru.
        </p>
      </header>

      <!-- Form container -->
      <div class="bg-white shadow-sm">

        <!-- Progress (only for steps 1-3) -->
        <div v-if="currentStep <= 3" class="bg-gray-50 border-b border-gray-100 px-6 py-4">
          <div class="flex items-center justify-between text-[10px] uppercase tracking-widest font-tech text-gray-500 mb-2">
            <span :class="(currentStep as number) >= 1 ? 'text-brand font-bold' : ''">1 · Objednávka</span>
            <span :class="(currentStep as number) >= 2 ? 'text-brand font-bold' : ''">2 · Vaše údaje</span>
            <span :class="(currentStep as number) >= 3 ? 'text-brand font-bold' : ''">3 · Potvrdenie</span>
          </div>
          <div class="h-1 bg-gray-200 overflow-hidden">
            <div class="h-full bg-brand transition-all duration-300" :style="{ width: progress + '%' }" />
          </div>
        </div>

        <!-- Content -->
        <div class="px-6 sm:px-10 py-8">
          <ReturnFormStep1
            v-if="currentStep === 1"
            :form-data="formData"
            :order-lookup="orderLookup"
            :errors="stepErrors[1]"
            @lookup="debouncedLookup"
            @update:formType="formData.formType = $event"
          />
          <ReturnFormStep2
            v-else-if="currentStep === 2"
            :form-data="formData"
            :attachments="attachments"
            :warranty-files="warrantyFiles"
            :reasons="reasons"
            :labels="labels"
            :errors="stepErrors[2]"
            @add-files="addFiles"
            @remove-file="removeFile"
          />
          <ReturnFormStep3
            v-else-if="currentStep === 3"
            :form-data="formData"
            :errors="stepErrors[3]"
            :submit-error="submitError"
          />
          <ReturnFormSuccess
            v-else-if="currentStep === 4 && submitResult"
            :reference-number="submitResult.referenceNumber"
            :email="formData.customerEmail"
            :form-type="formData.formType"
          />
        </div>

        <!-- Action footer -->
        <div v-if="currentStep <= 3" class="border-t border-gray-100 px-6 sm:px-10 py-5 flex items-center justify-between gap-3 bg-gray-50">
          <button v-if="currentStep > 1"
                  type="button"
                  class="text-sm font-bold uppercase tracking-wider font-tech text-gray-500 hover:text-black"
                  @click="prevStep">
            ← Späť
          </button>
          <span v-else></span>

          <button v-if="currentStep < 3"
                  type="button"
                  class="bg-brand text-white px-8 py-3 text-sm font-bold uppercase tracking-wider font-tech hover:bg-brand/90 transition-colors"
                  @click="nextStep">
            Pokračovať →
          </button>

          <button v-else
                  type="button"
                  :disabled="isSubmitting || !formData.gdprConsent"
                  class="bg-brand text-white px-8 py-3 text-sm font-bold uppercase tracking-wider font-tech hover:bg-brand/90 transition-colors disabled:opacity-50 flex items-center"
                  @click="onSubmit">
            <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
            Odoslať žiadosť
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
