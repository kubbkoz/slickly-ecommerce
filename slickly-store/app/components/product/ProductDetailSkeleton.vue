<script setup lang="ts">
import { onMounted } from 'vue';
onMounted(() => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
});
</script>

<template>
  <div class="bg-white min-h-screen font-sans animate-pulse">
    <div class="max-w-[1536px] mx-auto flex flex-col lg:flex-row lg:items-start lg:px-8">
      
      <!-- LEFT COLUMN: Gallery Skeleton -->
      <div class="w-full lg:w-[58%] xl:w-[60%] lg:pt-8 flex flex-col">
        <!-- Mobile Header Skeleton -->
        <div class="lg:hidden w-full px-4 pt-4 pb-4">
          <div class="h-3 w-32 bg-gray-100 mb-4 rounded" /> <!-- Breadcrumb -->
          <div class="h-8 w-3/4 bg-gray-100 mb-2 rounded" /> <!-- Title -->
          <div class="h-4 w-24 bg-gray-100 rounded" /> <!-- Rating -->
        </div>

        <!-- Main Gallery Image Placeholder -->
        <div class="w-full aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden">
           <!-- Shimmering effect overlay -->
           <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
        </div>

        <!-- Desktop Grid Placeholders -->
        <div class="hidden lg:grid grid-cols-2 gap-[1px] mt-[1px]">
          <div v-for="i in 2" :key="i" class="aspect-square bg-gray-50" />
        </div>
      </div>

      <!-- RIGHT COLUMN: Info Skeleton -->
      <div class="w-full lg:w-[42%] xl:w-[40%] lg:sticky lg:top-[var(--navbar-height-scrolled,88px)] lg:h-[calc(100vh-var(--navbar-height-scrolled,88px))] px-4 md:px-6 xl:px-10 py-6 lg:py-8 lg:pt-16">
        
        <!-- Brand Logo -->
        <div class="h-6 w-24 bg-gray-100 mb-6 rounded hidden lg:block" />
        
        <!-- Desktop Breadcrumbs -->
        <div class="h-4 w-48 bg-gray-50 mb-10 rounded hidden lg:block" />

        <!-- Title -->
        <div class="h-10 w-full bg-gray-100 mb-4 rounded" />
        <div class="h-10 w-2/3 bg-gray-100 mb-8 rounded" />

        <!-- Price -->
        <div class="h-8 w-32 bg-gray-100 mb-10 rounded" />

        <!-- Variants Label -->
        <div class="h-4 w-24 bg-gray-50 mb-4 rounded" />
        <!-- Size Grid -->
        <div class="grid grid-cols-4 gap-2 mb-10">
          <div v-for="i in 8" :key="i" class="h-12 bg-gray-50 border border-gray-100 rounded-sm" />
        </div>

        <!-- Buttons -->
        <div class="h-16 w-full bg-black/5 mb-3 rounded-sm" />
        <div class="h-16 w-full bg-gray-100 rounded-sm" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>
