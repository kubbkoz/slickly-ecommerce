<script setup lang="ts">
import { categories } from '~/data/products'

// Asymmetric layout spans matching the desktop 12-col / mobile 2-col grid mockups
const spans = [
  'col-span-2 md:col-span-8 md:row-span-1', // Karoséria - large
  'col-span-1 md:col-span-4 md:row-span-2', // Interiér - tall side
  'col-span-1 md:col-span-4 md:row-span-1', // Kolesá - small
  'col-span-2 md:col-span-8 md:row-span-1', // Ochrana - wide
]

const featured = [true, true, false, false]
</script>

<template>
  <section class="w-full bg-surface-container-lowest py-stack-lg md:py-section-padding-lg md:border-b md:border-grid-line">
    <div class="md:max-w-[1536px] md:mx-auto px-gutter md:px-grid-margin">
      <h2 class="font-headline-md text-headline-md md:text-headline-lg uppercase mb-stack-lg md:mb-8">Hlavné kategórie</h2>
      <div class="grid grid-cols-2 md:grid-cols-12 md:grid-rows-2 gap-stack-md md:gap-4 auto-rows-[160px] md:auto-rows-auto md:h-[600px]">
        <NuxtLink
          v-for="(category, index) in categories"
          :key="category.slug"
          :to="`/produkty?kategoria=${category.slug}`"
          class="relative group overflow-hidden bg-on-background focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-secondary-container"
          :class="spans[index]"
        >
          <img
            :src="category.image"
            :alt="category.name"
            :loading="index === 0 ? 'eager' : 'lazy'"
            class="absolute inset-0 w-full h-full object-cover opacity-60 md:opacity-70 transition-transform duration-700 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div class="absolute bottom-stack-md md:bottom-8 left-stack-md md:left-8">
            <h3
              class="text-white font-bold uppercase mb-1"
              :class="featured[index] ? 'font-headline-md text-headline-md md:text-headline-lg md:mb-2' : 'font-headline-md text-headline-md'"
            >
              {{ category.name }}
            </h3>
            <span
              v-if="featured[index]"
              class="hidden md:flex text-white/80 font-label-sm text-label-sm uppercase items-center gap-2 group-hover:text-secondary-container transition-colors"
            >
              Preskúmať produkty
              <span class="material-symbols-outlined text-[16px]" aria-hidden="true">arrow_forward</span>
            </span>
            <span v-else class="text-white/80 text-[12px] uppercase">Zobraziť viac</span>
            <div v-if="featured[index]" class="md:hidden w-8 h-1 bg-secondary-container mt-2"></div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
