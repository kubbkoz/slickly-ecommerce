<script setup lang="ts">
import { products } from '~/data/products'

const portfolio = products.slice(0, 6)
</script>

<template>
  <section class="w-full relative py-stack-lg md:py-section-padding-lg bg-surface">
    <div class="w-full md:max-w-[1536px] md:mx-auto px-gutter md:px-grid-margin flex flex-col gap-stack-md md:gap-12">
      <div class="flex justify-between items-end border-b border-grid-line pb-stack-sm md:pb-6">
        <h2 class="font-headline-md text-headline-md md:text-headline-lg text-on-surface uppercase tracking-tight">Výkonnostné portfólio</h2>
        <NuxtLink
          to="/produkty"
          class="font-label-sm text-label-sm text-primary hover:text-on-background uppercase transition-colors duration-200 flex items-center gap-1 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Zobraziť všetko
          <span class="material-symbols-outlined text-[16px]" aria-hidden="true">arrow_forward</span>
        </NuxtLink>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-px bg-grid-line border border-grid-line">
        <ProductCard v-for="product in portfolio" :key="product.id" :product="product" />
      </div>
    </div>
  </section>
</template>
