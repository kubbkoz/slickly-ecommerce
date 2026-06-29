<script setup lang="ts">
import { Building2 } from 'lucide-vue-next';
import { useLocalePath, useAsyncData, useSeoMeta } from '#imports';

interface ManufacturerItem {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  link: string | null;
  productCount: number;
}

const localePath = useLocalePath();
const { t } = useStaticTranslations();

const { data: brands } = await useAsyncData('all-brands', () =>
    $fetch<ManufacturerItem[]>('/api/manufacturers')
);

// Pozn.: t() z useStaticTranslations volá useI18n() — MUSÍ sa vyhodnotiť v setupe,
// nie v lazy getteri useSeoMeta (inak "Must be called at the top of a setup function").
const seoTitle = t('znacky');
const seoDescription = t('znacky_subtext');
useSeoMeta({
  title: seoTitle,
  description: seoDescription,
});
</script>

<template>
  <div class="bg-white min-h-screen">
    <div class="container mx-auto px-4 lg:px-8 py-12 md:py-16">

      <!-- Header -->
      <div class="mb-10 md:mb-14">
        <h1 class="section-h2 mb-4">
          {{ t('znacky') }}
        </h1>
        <div class="section-decorator mb-6" />
        <p class="text-gray-500 text-sm md:text-base lg:text-lg max-w-3xl font-light leading-relaxed font-sans">
          {{ t('znacky_subtext') }}
        </p>
      </div>

      <!-- Grid -->
      <div
        v-if="brands && brands.length"
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 md:gap-4"
      >
        <NuxtLink
          v-for="brand in brands"
          :key="brand.id"
          :to="localePath('/znacka/' + brand.slug)"
          class="group bg-white border border-gray-100 hover:border-gray-200 flex flex-col items-center justify-between p-4 md:p-6 transition-colors"
          :aria-label="brand.name"
        >
          <div class="flex-1 flex items-center justify-center w-full min-h-[64px] md:min-h-[80px]">
            <NuxtImg
              v-if="brand.logoUrl"
              :src="brand.logoUrl"
              :alt="brand.name"
              class="max-h-12 md:max-h-16 w-auto max-w-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
              loading="lazy"
            />
            <Building2 v-else class="w-10 h-10 text-gray-300 group-hover:text-gray-400 transition-colors" />
          </div>
          <span class="mt-3 font-tech font-bold uppercase text-[11px] md:text-xs tracking-wide text-gray-600 group-hover:text-black transition-colors text-center leading-tight">
            {{ brand.name }}
          </span>
        </NuxtLink>
      </div>

      <!-- Empty / error state -->
      <div v-else class="py-20 text-center">
        <Building2 class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-400 font-bold uppercase text-sm tracking-widest">
          Značky momentálne nie sú dostupné
        </p>
      </div>

    </div>
  </div>
</template>
