<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  variant?: 'primary' | 'secondary' | 'outline' | 'brand-outline' | 'ghost' | 'white';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  disabled?: boolean;
  to?: string;
  type?: 'button' | 'submit' | 'reset';
}>();

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary': return 'bg-amber text-black hover:bg-amber-dark border border-amber';
    case 'secondary': return 'btn-secondary border border-transparent shadow-sm px-6 py-3';
    case 'outline': return 'bg-transparent text-white border border-white hover:bg-white hover:text-black';
    case 'brand-outline': return 'bg-transparent text-brand border border-brand hover:bg-brand hover:text-white';
    case 'ghost': return 'bg-transparent text-black hover:bg-gray-100 border border-transparent';
    case 'white': return 'bg-white text-black hover:bg-gray-100 border border-white';
    default: return 'bg-amber text-black hover:bg-amber-dark border border-amber';
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'px-4 py-2 text-xs';
    case 'lg': return 'px-8 py-4 text-base';
    default: return 'px-6 py-3 text-sm';
  }
});

const baseClasses = computed(() => [
  'inline-flex items-center justify-center font-bold uppercase tracking-widest transition-colors duration-300 rounded-default disabled:opacity-50 disabled:cursor-not-allowed',
  variantClasses.value,
  sizeClasses.value,
  props.block ? 'w-full' : ''
].join(' '));
</script>

<template>
  <NuxtLink v-if="to && !disabled" :to="to" :class="baseClasses">
    <slot />
  </NuxtLink>
  <button v-else :type="type || 'button'" :class="baseClasses" :disabled="disabled">
    <slot />
  </button>
</template>
