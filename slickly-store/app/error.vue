<script setup lang="ts">
import { HomeIcon, ArrowLeft } from 'lucide-vue-next';

const props = defineProps<{
  error: {
    statusCode: number;
    statusMessage?: string;
    message?: string;
  };
}>();

const handleError = () => clearError({ redirect: '/' });
</script>

<template>
  <NuxtLayout name="default">
    <section class="min-h-[70vh] flex items-center justify-center bg-white py-24">
      <div class="container mx-auto px-4 lg:px-8 text-center">

        <!-- 404 číslo -->
        <div class="relative mb-8 select-none">
          <span class="text-[180px] md:text-[240px] font-tech font-black italic text-gray-100 leading-none">
            {{ error.statusCode }}
          </span>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-20 h-1 bg-brand"></div>
          </div>
        </div>

        <!-- Text -->
        <h1 class="font-tech font-black uppercase italic text-3xl md:text-5xl text-black leading-none mb-4">
          Ups! Niečo sa pokazilo
        </h1>
        <div class="section-decorator mx-auto mb-6"></div>
        <p class="text-gray-500 font-sans text-lg mb-10 max-w-md mx-auto">
          Požadovaná stránka nebola nájdená.
        </p>

        <!-- CTA -->
        <button
          class="btn-checkout inline-flex items-center justify-center gap-2 px-8 py-4 max-w-xs mx-auto"
          @click="handleError"
        >
          <HomeIcon class="w-4 h-4" aria-hidden="true" />
          Späť na domovskú stránku
        </button>

      </div>
    </section>
  </NuxtLayout>
</template>
