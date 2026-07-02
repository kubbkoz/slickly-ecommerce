<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { onUnmounted, watch } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  title: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

onUnmounted(() => {
  document.body.style.overflow = '';
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
      <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <!-- Overlay click to close -->
        <div class="absolute inset-0" @click="emit('close')"></div>
        
        <!-- Modal Content -->
        <div class="relative w-full max-w-lg bg-white p-8 shadow-2xl rounded-default">
          <button 
            @click="emit('close')"
            class="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
            aria-label="Zatvoriť"
          >
            <X class="w-5 h-5" />
          </button>
          
          <!-- Voliteľný prefix nad titulkom (napr. ikona + label) -->
          <slot name="prefix" />

          <h2 class="text-xl font-bold uppercase tracking-wider mb-6 pr-6 font-tech text-black">{{ title }}</h2>

          <div class="prose prose-sm font-sans max-h-[70vh] overflow-y-auto w-full text-gray-600">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
