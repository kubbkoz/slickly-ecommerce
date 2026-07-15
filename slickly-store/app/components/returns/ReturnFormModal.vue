<script setup lang="ts">
import { computed, watch } from 'vue';
import { X, Loader2 } from 'lucide-vue-next';
import { useReturnForm, type FormType } from '~/composables/useReturnForm';
import ReturnFormStep1 from './ReturnFormStep1.vue';
import ReturnFormStep2 from './ReturnFormStep2.vue';
import ReturnFormStep3 from './ReturnFormStep3.vue';
import ReturnFormSuccess from './ReturnFormSuccess.vue';

const props = withDefaults(defineProps<{
  isOpen: boolean;
  initialFormType?: FormType;
  initialOrderNumber?: string;
  initialOrderDate?: string;
  initialOrderId?: string;
  initialEmail?: string;
  initialFirstName?: string;
  initialLastName?: string;
  initialCustomerPhone?: string;
  initialCustomerAddress?: string;
  initialItemsDescription?: string;
  skipOrderLookup?: boolean;
}>(), {
  initialFormType: 'vratenie',
  skipOrderLookup: false,
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submitted', referenceNumber: string): void;
}>();

const {
  currentStep, totalSteps, formData, attachments, warrantyFiles,
  orderLookup, isSubmitting, submitError, submitResult, stepErrors,
  labels, reasons,
  nextStep, prevStep,
  debouncedLookup, addFiles, removeFile, submit,
} = useReturnForm({
  initialFormType:         props.initialFormType,
  initialOrderNumber:      props.initialOrderNumber,
  initialOrderDate:        props.initialOrderDate,
  initialOrderId:          props.initialOrderId,
  initialEmail:            props.initialEmail,
  initialFirstName:        props.initialFirstName,
  initialLastName:         props.initialLastName,
  initialCustomerPhone:    props.initialCustomerPhone,
  initialCustomerAddress:  props.initialCustomerAddress,
  initialItemsDescription: props.initialItemsDescription,
  skipOrderLookup:         props.skipOrderLookup,
});

// Pri otvorení modal — syncuje state s aktuálnymi props (rieši stale state z predošlého open)
watch(() => props.isOpen, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden';
    // Sync form type + initial fields s aktuálnymi props (môžu sa zmeniť medzi otvoreniami)
    formData.formType        = props.initialFormType ?? 'vratenie';
    if (props.initialOrderNumber !== undefined)      formData.orderNumber      = props.initialOrderNumber;
    if (props.initialOrderDate !== undefined)        formData.orderDate        = props.initialOrderDate;
    if (props.initialOrderId !== undefined)          formData.orderId          = props.initialOrderId;
    if (props.initialEmail !== undefined)            formData.customerEmail    = props.initialEmail;
    if (props.initialFirstName !== undefined)        formData.firstName        = props.initialFirstName;
    if (props.initialLastName !== undefined)         formData.lastName         = props.initialLastName;
    if (props.initialCustomerPhone !== undefined)    formData.customerPhone    = props.initialCustomerPhone;
    if (props.initialCustomerAddress !== undefined)  formData.customerAddress  = props.initialCustomerAddress;
    if (props.initialItemsDescription !== undefined) formData.itemsDescription = props.initialItemsDescription;
  } else {
    document.body.style.overflow = '';
  }
});

const onClose = () => emit('close');

const onSubmit = async () => {
  const ok = await submit();
  if (ok && submitResult.value) {
    emit('submitted', submitResult.value.referenceNumber);
  }
};

const progress = computed(() => {
  if (currentStep.value === 4) return 100;
  return Math.round(((currentStep.value as number) / totalSteps) * 100);
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-stretch sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
        <!-- Backdrop click closes -->
        <div class="absolute inset-0" @click="onClose"></div>

        <!-- Modal container -->
        <div class="relative bg-white w-full sm:max-w-[720px] sm:max-h-[92vh] h-full sm:h-auto flex flex-col rounded-default shadow-2xl overflow-hidden">

          <!-- Header -->
          <div class="border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div>
              <p class="text-[10px] uppercase tracking-widest text-gray-500 font-tech">
                {{ formData.formType === 'reklamacia' ? 'Reklamácia' : 'Vrátenie tovaru' }}
              </p>
              <h2 class="font-tech text-xl font-black uppercase tracking-wide">
                {{ currentStep === 4 ? 'Hotovo' : currentStep === 3 ? 'Potvrdenie' : currentStep === 2 ? 'Vaše údaje' : 'Objednávka' }}
              </h2>
            </div>
            <button @click="onClose" aria-label="Zatvoriť" class="text-gray-500 hover:text-black p-2 -mr-2">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Progress bar (steps 1-3) -->
          <div v-if="currentStep <= 3" class="bg-gray-50 border-b border-gray-100 px-6 py-3 flex-shrink-0">
            <div class="flex items-center justify-between text-[10px] uppercase tracking-widest font-tech text-gray-500 mb-1.5">
              <span :class="(currentStep as number) >= 1 ? 'text-brand font-bold' : ''">1 · Objednávka</span>
              <span :class="(currentStep as number) >= 2 ? 'text-brand font-bold' : ''">2 · Vaše údaje</span>
              <span :class="(currentStep as number) >= 3 ? 'text-brand font-bold' : ''">3 · Potvrdenie</span>
            </div>
            <div class="h-1 bg-gray-200 overflow-hidden">
              <div class="h-full bg-brand transition-all duration-300" :style="{ width: progress + '%' }" />
            </div>
          </div>

          <!-- Content (scrollable) -->
          <div class="flex-1 overflow-y-auto scrollbar-hide px-6 py-5">
            <ReturnFormStep1
              v-if="currentStep === 1"
              :form-data="formData"
              :order-lookup="orderLookup"
              :errors="stepErrors[1]"
              :skip-order-lookup="skipOrderLookup"
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

          <!-- Footer (action buttons) -->
          <div v-if="currentStep <= 3" class="border-t border-gray-100 px-6 py-4 flex items-center justify-between gap-3 flex-shrink-0 bg-white">
            <button v-if="currentStep > 1 && !skipOrderLookup"
                    type="button"
                    class="text-sm font-bold uppercase tracking-wider font-tech text-gray-500 hover:text-black"
                    @click="prevStep">
              ← Späť
            </button>
            <span v-else></span>

            <button v-if="currentStep < 3"
                    type="button"
                    class="bg-brand text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wider font-tech hover:bg-brand/90 transition-colors disabled:opacity-50"
                    @click="nextStep">
              Pokračovať →
            </button>

            <button v-else
                    type="button"
                    :disabled="isSubmitting || !formData.gdprConsent"
                    class="bg-brand text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wider font-tech hover:bg-brand/90 transition-colors disabled:opacity-50 flex items-center"
                    @click="onSubmit">
              <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
              Odoslať žiadosť
            </button>
          </div>

          <div v-else class="border-t border-gray-100 px-6 py-4 flex justify-center">
            <button type="button"
                    class="bg-brand text-white px-8 py-2.5 text-sm font-bold uppercase tracking-wider font-tech hover:bg-brand/90 transition-colors"
                    @click="onClose">
              Zatvoriť
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>
