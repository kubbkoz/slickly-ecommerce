<script setup lang="ts">
import { CheckCircle } from 'lucide-vue-next';

defineProps<{
  onBackToShop: () => void;
}>();
</script>

<template>
  <div class="bg-white p-12 text-center border-t-4 border-brand animate-fade-in font-sans">
      <div class="w-24 h-24 bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle class="w-12 h-12 text-green-600" />
      </div>
      <h2 class="text-4xl font-black font-tech uppercase mb-4">Ďakujeme za <span class="text-brand">objednávku!</span></h2>
      <div class="section-decorator mx-auto mt-3 mb-6"></div>
      <p class="text-gray-500 mb-8 max-w-md mx-auto font-sans text-sm">
          Potvrdenie objednávky sme vám poslali na email. Hneď ako tovar vyexpedujeme, budeme vás informovať SMS správou.
      </p>
      <BaseButton variant="primary" size="lg" @click="onBackToShop">
          Späť na úvod
      </BaseButton>
  </div>
</template>
