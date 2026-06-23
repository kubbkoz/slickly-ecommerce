<script setup lang="ts">
import type { Product } from '~/data/products'

defineProps<{
  products: Product[]
}>()
</script>

<template>
  <section class="contain-section mt-stack-lg md:mt-section-padding-lg">
    <h2 class="font-headline-md text-headline-md md:text-headline-lg uppercase tracking-tight border-b border-grid-line pb-stack-sm md:pb-6 mb-stack-md md:mb-8">
      Podobné produkty
    </h2>
    <ProductCarousel :products="products" />
  </section>
</template>
