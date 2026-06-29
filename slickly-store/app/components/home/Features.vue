<script setup lang="ts">
import { Truck, Wrench, MessageCircle, ShieldCheck } from 'lucide-vue-next';
import { FEATURES } from '~/utils/constants';

const icons: Record<string, any> = { Truck, Wrench, MessageCircle, ShieldCheck };

// Extract features directly without Gemini translation layer
const translatedFeatures = computed(() => {
  return FEATURES.map((f, i) => ({
    ...f,
    title: f.title,
    desc: f.desc,
  }));
});
</script>

<template>
  <div class="py-8 md:pt-12 bg-gray-50 border-b border-gray-100">
    <div class="container mx-auto px-4 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        <div
          v-for="(feature, idx) in translatedFeatures"
          :key="idx"
          class="feature-item flex items-start space-x-2 md:space-x-4 p-2 md:p-4 transition-all duration-300"
        >
          <div class="feature-icon flex-shrink-0 bg-gray-200 text-black p-2 md:p-3 rounded-full transition-all duration-300">
            <component :is="icons[feature.icon]" class="w-4 h-4 md:w-6 md:h-6" />
          </div>
          <div class="feature-text transition-transform duration-300">
            <p class="font-bold text-[10px] md:text-sm mb-0.5 md:mb-1 font-tech tracking-wide leading-tight">{{ feature.title }}</p>
            <p class="text-gray-500 text-[10px] md:text-sm leading-snug md:leading-relaxed">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.feature-item:hover .feature-icon {
  background-color: var(--brand-color);
  color: white;
  transform: translateY(-4px);
}

.feature-item:hover .feature-text {
  transform: translateY(-4px);
}
</style>
