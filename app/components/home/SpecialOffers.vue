<script setup lang="ts">
import { products } from '~/data/products'

const offers = products.filter((p) => p.badge).slice(0, 3)
</script>

<template>
  <section class="py-stack-lg md:py-12 md:border-b md:border-grid-line bg-surface">
    <div class="md:max-w-[1536px] md:mx-auto md:px-grid-margin">
      <div class="flex justify-between items-center md:items-end px-gutter md:px-0 mb-stack-md md:mb-8">
        <h3 class="font-headline-md text-headline-md md:text-headline-lg uppercase tracking-tight">Špeciálne ponuky</h3>
        <NuxtLink
          to="/produkty?akcia=1"
          class="hidden md:flex gap-2 items-center font-label-sm text-label-sm text-primary hover:text-secondary uppercase transition-colors duration-200 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Zobraziť všetko
          <span class="material-symbols-outlined text-[16px]" aria-hidden="true">arrow_forward</span>
        </NuxtLink>
        <NuxtLink
          to="/produkty?akcia=1"
          class="md:hidden min-h-11 flex items-center text-on-surface-variant font-badge-label text-badge-label uppercase border-b border-on-surface-variant transition-colors duration-200 hover:text-on-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Všetko
        </NuxtLink>
      </div>

      <!-- Mobile: horizontal scroll -->
      <div class="md:hidden flex gap-gutter overflow-x-auto px-gutter hide-scrollbar snap-x">
        <div v-for="product in offers" :key="product.id" class="min-w-[240px] snap-start">
          <ProductCard :product="product" />
        </div>
      </div>

      <!-- Desktop: grid -->
      <div class="hidden md:grid grid-cols-3 gap-px bg-grid-line border border-grid-line">
        <ProductCard v-for="product in offers" :key="product.id" :product="product" />
      </div>
    </div>
  </section>
</template>
