<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from '#imports';

const props = defineProps<{
  stock: number;
  availableStock?: number;
  isCloseout?: boolean;
  restockTime?: number;
}>();

const { t } = useI18n();

/**
 * LOGIC MATCHING PDP (VariantSelector.vue)
 * - isAvailable: stock > 0
 * - isCloseout: explicit flag for discontinued items
 */
const effectiveStock = computed(() => props.availableStock ?? props.stock ?? 0);
const isAvailable = computed(() => effectiveStock.value > 0);

const status = computed(() => {
  if (isAvailable.value) {
    return {
      dotClass: 'bg-success shadow-[0_0_8px_rgba(82,166,63,0.5)]',
      text: `${t('availability_inStock')} ${effectiveStock.value >= 3 ? '> 3ks' : `${effectiveStock.value}ks`}`
    };
  }
  
  if (!props.isCloseout) {
    return {
      dotClass: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]',
      text: t('availability_restockTime', { days: props.restockTime || 4 })
    };
  }
  
  return {
    dotClass: 'bg-brand shadow-[0_0_8px_rgba(182,0,5,0.4)]',
    text: t('availability_soldOut')
  };
});
</script>

<template>
  <div class="flex items-center gap-2 animate-fade-in" aria-live="polite">
    <!-- Dot (Gulička) with Subtle Breathe & Glow -->
    <div class="relative flex items-center justify-center w-2 h-2">
      <div 
        class="absolute inset-0 rounded-full animate-breathe opacity-40"
        :class="status.dotClass.split(' ')[0]"
      />
      <div 
        class="relative w-2 h-2 rounded-full shrink-0" 
        :class="status.dotClass"
        aria-hidden="true"
      />
    </div>
    
    <!-- Text (Always Black & Semibold as requested) -->
    <span 
      class="text-[10px] md:text-[11px] font-semibold uppercase tracking-tight font-sans whitespace-nowrap text-black"
    >
      {{ status.text }}
    </span>
  </div>
</template>

<style scoped>
.font-tech {
  font-family: 'Space Grotesk', sans-serif;
}

@keyframes breathe {
  0% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(2); opacity: 0; }
  100% { transform: scale(1); opacity: 0.4; }
}

.animate-breathe {
  animation: breathe 3s ease-in-out infinite;
}
</style>
