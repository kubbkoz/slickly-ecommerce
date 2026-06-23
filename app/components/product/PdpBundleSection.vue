<script setup lang="ts">
import type { Product } from '~/data/products'

defineProps<{
  mainProduct: Product
  bundleProducts: Product[]
}>()
</script>

<template>
  <section class="contain-section mt-stack-lg md:mt-section-padding-lg">
    <h2 class="font-headline-md text-headline-md md:text-headline-lg uppercase tracking-tight border-b border-grid-line pb-stack-sm md:pb-6 mb-stack-md md:mb-8">
      Odporúčame k tomu
    </h2>
    <ProductBundle :main-product="mainProduct" :bundle-products="bundleProducts" />
  </section>
</template>
