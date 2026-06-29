<script setup lang="ts">
import { Star } from 'lucide-vue-next';

const props = defineProps<{
  rating: number;
  maxRating?: number;
  sizeClass?: string;
}>();

const max = props.maxRating ?? 5;
const percentage = computed(() => Math.min(100, Math.max(0, (props.rating / max) * 100)));
</script>

<template>
  <div class="relative inline-flex items-center">
    <!-- Background Stars (Gray) -->
    <div class="flex items-center gap-0.5 text-gray-200">
      <Star 
        v-for="i in max" 
        :key="i" 
        :class="sizeClass || 'w-4 h-4'" 
        class="fill-current stroke-none" 
      />
    </div>
    
    <!-- Foreground Stars (Yellow/Partial) -->
    <div 
      class="flex items-center gap-0.5 text-yellow-400 absolute top-0 left-0 overflow-hidden whitespace-nowrap select-none pointer-events-none"
      :style="{ width: `${percentage}%` }"
    >
      <Star 
        v-for="i in max" 
        :key="i" 
        :class="sizeClass || 'w-4 h-4'" 
        class="fill-current stroke-none" 
      />
    </div>
  </div>
</template>

<style scoped>
/* Ensure stars don't shrink inside the clipped container */
svg {
  flex-shrink: 0;
}
</style>
