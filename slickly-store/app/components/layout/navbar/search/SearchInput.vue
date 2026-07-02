<script setup lang="ts">
import { ref } from 'vue';
import { Search, Loader2, X } from 'lucide-vue-next';

defineOptions({ name: 'SearchInput' });

defineProps<{
    modelValue:  string;
    isOpen:      boolean;
    isLoading:   boolean;
    placeholder: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', val: string): void;
    (e: 'focus'): void;
    (e: 'keydown', event: KeyboardEvent): void;
    (e: 'search'): void;
    (e: 'clear'): void;
}>();

// Expose the native input element so SearchBar can focus it programmatically
const inputEl = ref<HTMLInputElement | null>(null);
defineExpose({ inputEl });
</script>

<template>
  <div
    class="relative w-full flex group"
    :class="isOpen ? 'z-[70]' : 'z-10'"
  >
    <!-- Text input -->
    <input
      ref="inputEl"
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      autocomplete="off"
      spellcheck="false"
      class="w-full bg-white text-black pl-5 pr-16 py-3.5 focus:outline-none rounded-default text-sm tracking-wide placeholder-gray-400 font-sans transition-shadow duration-200"
      :class="isOpen
        ? 'shadow-[0_0_0_2px_rgba(182,0,5,1)]'
        : 'shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_0_0_1px_rgba(182,0,5,0.4)]'"
      aria-label="Hľadať produkt"
      aria-autocomplete="list"
      :aria-expanded="isOpen"
      role="combobox"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @focus="emit('focus')"
      @keydown="emit('keydown', $event)"
    />

    <!-- Clear (×) button — visible when query present -->
    <button
      v-if="modelValue"
      @click="emit('clear')"
      class="absolute right-12 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
      aria-label="Zmazať hľadanie"
      type="button"
    >
      <X class="w-4 h-4" />
    </button>

    <!-- Red submit button -->
    <button
      class="absolute right-0 top-0 h-full w-12 bg-brand text-white flex items-center justify-center hover:bg-red-700 transition-colors group/btn"
      aria-label="Hľadať"
      type="button"
      @click="emit('search')"
    >
      <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
      <Search v-else class="w-5 h-5 transition-transform group-hover/btn:scale-110" />
    </button>
  </div>
</template>
