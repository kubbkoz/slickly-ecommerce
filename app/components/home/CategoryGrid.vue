<script setup lang="ts">
import { categories } from '~/data/products'

// Asymmetric bento layout: Karoséria spans the top, Interiér is a tall
// right-hand column, Kolesá and Ochrana fill the bottom row beside it.
// Spans add up to full rows on both the 2-col mobile and 12-col desktop
// grids, so every card stays inside the section (no overflow row).
const spans = [
  'col-span-2 md:col-span-8 md:row-span-1', // Karoséria - large top
  'col-span-1 md:col-span-4 row-span-2', // Interiér - tall side
  'col-span-1 md:col-span-4 md:row-span-1', // Kolesá - bottom left
  'col-span-1 md:col-span-4 md:row-span-1', // Ochrana - bottom right
]
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
            class="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div class="absolute bottom-stack-md md:bottom-8 left-stack-md md:left-8 right-stack-md md:right-8">
            <h3 class="text-white font-headline-md text-headline-md md:text-headline-lg font-bold uppercase mb-1 md:mb-2">
              {{ category.name }}
            </h3>
            <span class="flex text-white/80 font-label-sm text-label-sm uppercase items-center gap-2 group-hover:text-secondary-container transition-colors duration-200">
              Preskúmať produkty
              <span class="material-symbols-outlined text-[16px] transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">arrow_forward</span>
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
