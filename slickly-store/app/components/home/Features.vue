<script setup lang="ts">
import { Package, Car, Sparkles, Truck } from 'lucide-vue-next';
import { FEATURES } from '~/utils/constants';

const icons: Record<string, any> = { Package, Car, Sparkles, Truck };

// Extract features directly without Gemini translation layer
const translatedFeatures = computed(() => {
  return FEATURES.map((f, i) => ({
    ...f,
    title: f.title,
    desc: f.desc,
  }));
});

const { target, isVisible } = useScrollReveal();
</script>

<template>
  <div ref="target" class="py-14 md:py-20 bg-gray-50 border-b border-gray-100">
    <div class="container mx-auto px-4 lg:px-8">
      <div
        class="reveal-base grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        :class="isVisible ? 'reveal-visible' : 'reveal'"
      >
        <div
          v-for="(feature, idx) in translatedFeatures"
          :key="idx"
          class="group flex items-start space-x-3 md:space-x-4 p-3 md:p-4 transition-all duration-300"
        >
          <div class="flex-shrink-0 bg-black text-amber p-3 md:p-4 rounded-default transition-all duration-300 group-hover:bg-amber group-hover:text-black group-hover:-translate-y-1">
            <component :is="icons[feature.icon]" class="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div class="transition-transform duration-300 group-hover:-translate-y-1">
            <p class="font-bold text-xs md:text-base mb-1 font-tech tracking-wide leading-tight">{{ feature.title }}</p>
            <p class="text-gray-500 text-[11px] md:text-sm leading-snug md:leading-relaxed">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
