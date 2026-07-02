<script setup lang="ts">
import { ChevronDown, ChevronUp } from 'lucide-vue-next';

interface Props {
  modelValue: number;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  min: 1,
  size: 'md',
});

const emit = defineEmits<{
  (e: 'update:modelValue', val: number): void;
}>();

const updateQuantity = (val: number) => {
  const newVal = Math.max(props.min, props.max ? Math.min(props.max, val) : val);
  emit('update:modelValue', newVal);
};

const handleQuantityInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value;
  if (val !== '') {
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      updateQuantity(num);
    }
  }
};

const handleQuantityBlur = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const val = parseInt(target.value, 10);
  if (isNaN(val) || val < props.min) {
    updateQuantity(props.min);
    target.value = String(props.min);
  } else if (props.max && val > props.max) {
    updateQuantity(props.max);
    target.value = String(props.max);
  }
};
</script>

<template>
  <div 
    class="flex items-center bg-gray-100/50 relative group border border-transparent hover:border-gray-200 transition-colors rounded-default"
    :class="[
      size === 'sm' ? 'h-11 min-w-[4.5rem] px-3' : 'h-14 min-w-[5rem] px-4'
    ]"
    role="group" 
    aria-label="Nastavenie množstva"
  >
    <input 
      type="number"
      inputmode="numeric"
      :min="min"
      :max="max"
      :value="modelValue"
      @input="handleQuantityInput"
      @blur="handleQuantityBlur"
      @keyup.enter="handleQuantityBlur"
      class="flex-1 min-w-0 text-left font-tech font-black text-black bg-transparent border-none p-0 focus:ring-0 focus:outline-none hide-arrows" 
      :class="[
        size === 'sm' ? 'text-lg max-w-[2.5rem]' : 'text-xl max-w-[3rem]'
      ]"
      role="spinbutton" 
      aria-live="polite"
      aria-label="Zadať množstvo"
    />
    <div class="flex flex-col h-full justify-center -mr-1">
      <button 
        @click="updateQuantity(modelValue + 1)" 
        class="p-0.5 text-gray-400 hover:text-brand transition-colors"
        aria-label="Zvýšiť množstvo"
      >
        <ChevronUp :class="size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'" />
      </button>
      <button 
        @click="updateQuantity(modelValue - 1)" 
        class="p-0.5 text-gray-400 hover:text-brand transition-colors"
        aria-label="Znížiť množstvo"
      >
        <ChevronDown :class="size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'" />
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Hide arrows in number input */
.hide-arrows::-webkit-outer-spin-button,
.hide-arrows::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
.hide-arrows {
  -moz-appearance: textfield;
  appearance: textfield;
}

.font-tech {
  font-family: 'Space Grotesk', sans-serif;
}
</style>
