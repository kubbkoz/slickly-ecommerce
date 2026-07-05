<script setup lang="ts">
import { Check } from 'lucide-vue-next';

// surface = which background this renders on: 'dark' (black header row, desktop)
// or 'amber' (mobile-only bar below the header — see cart.vue/checkout.vue).
const props = withDefaults(defineProps<{ currentStep: number; surface?: 'dark' | 'amber' }>(), { surface: 'dark' });
const emit = defineEmits<{
  (e: 'change-step', step: number): void;
}>();

const localePath = useLocalePath();
const router = useRouter();

const steps = [
    { id: 1, label: 'Nákupný košík', path: '/cart' },
    { id: 2, label: 'Kontaktné údaje' },
    { id: 3, label: 'Doprava a platba' },
];

function handleStepClick(stepId: number) {
  if (stepId >= props.currentStep && stepId !== 1) return;
  if (stepId === 1) {
    router.push(localePath('/cart'));
  } else {
    emit('change-step', stepId);
  }
}
</script>

<template>
  <div class="select-none flex flex-col items-center">
    <!-- Riadok ikon + konektorov -->
    <div class="flex items-center">
      <template v-for="(step, idx) in steps" :key="step.id">

        <div
          class="flex items-center justify-center w-7 h-7 font-black font-tech text-xs leading-none transition-all duration-300 border-2 flex-shrink-0"
          :class="[
            (step.id < currentStep || step.id === 1) ? 'cursor-pointer hover:opacity-80' : 'cursor-default',
            surface === 'amber'
              ? (currentStep >= step.id ? 'bg-transparent border-black text-black' : 'bg-transparent border-black/25 text-black/40')
              : (currentStep >= step.id ? 'bg-brand border-brand text-white' : 'bg-transparent border-white/25 text-white/40')
          ]"
          @click="handleStepClick(step.id)"
        >
          <Check v-if="currentStep > step.id" class="w-3.5 h-3.5" />
          <span v-else>{{ step.id }}</span>
        </div>

        <div
          v-if="idx < steps.length - 1"
          class="w-8 sm:w-14 lg:w-20 h-[2px] mx-2 sm:mx-3 lg:mx-4 transition-colors duration-500 flex-shrink-0"
          :class="surface === 'amber' ? (currentStep > step.id ? 'bg-black' : 'bg-black/20') : (currentStep > step.id ? 'bg-brand' : 'bg-white/20')"
        ></div>

      </template>
    </div>

    <!-- Riadok labelov — pod ikonami, zarovnaný s každým krokom -->
    <div class="hidden sm:flex items-start mt-1.5">
      <template v-for="(step, idx) in steps" :key="`label-${step.id}`">
        <div
          class="flex-shrink-0 w-7 text-center"
          :class="(step.id < currentStep || step.id === 1) ? 'cursor-pointer' : 'cursor-default'"
          @click="handleStepClick(step.id)"
        >
          <span
            class="text-[9px] font-black uppercase tracking-widest font-tech leading-tight block"
            :class="surface === 'amber' ? (currentStep >= step.id ? 'text-black' : 'text-black/40') : (currentStep >= step.id ? 'text-white' : 'text-white/40')"
            style="width: max-content; transform: translateX(-50%); margin-left: 50%;"
          >{{ step.label }}</span>
        </div>
        <div v-if="idx < steps.length - 1" class="w-8 sm:w-14 lg:w-20 mx-2 sm:mx-3 lg:mx-4 flex-shrink-0" />
      </template>
    </div>
  </div>
</template>
