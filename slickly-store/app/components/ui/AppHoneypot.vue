<script setup lang="ts">
/**
 * AppHoneypot.vue
 * 
 * Reusable Honeypot component for Nuxt 4 / Shopware 6.
 * The input must be empty for a successful submission.
 * Bots often fill all available inputs, triggering the protection.
 */

const props = defineProps<{
  name?: string; // Default: shopware_honeypot
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const fieldName = props.name || 'shopware_honeypot';
</script>

<template>
  <div 
    class="hp-wrapper" 
    aria-hidden="true"
  >
    <label :for="fieldName">Do not fill this field</label>
    <input
      :id="fieldName"
      :name="fieldName"
      type="text"
      tabindex="-1"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<style scoped>
.hp-wrapper {
  opacity: 0;
  position: absolute;
  z-index: -1;
  left: -5000px;
  pointer-events: none;
}
</style>
