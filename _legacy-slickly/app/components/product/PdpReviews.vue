<script setup lang="ts">
import type { Product } from '~/data/products'

defineProps<{
  product: Product
  averageRating: number
}>()
</script>

<template>
  <section class="contain-section mt-stack-lg md:mt-section-padding-lg">
    <div class="flex flex-wrap items-baseline justify-between gap-stack-sm border-b border-grid-line pb-stack-sm md:pb-6 mb-stack-md md:mb-8">
      <h2 class="font-headline-md text-headline-md md:text-headline-lg uppercase tracking-tight">
        Čo hovoria zákazníci
      </h2>
      <div v-if="product.reviews.length" class="flex items-center gap-2">
        <ProductRating :rating="averageRating" :size="18" />
        <span class="font-technical-data text-technical-data text-on-surface-variant">
          {{ averageRating.toFixed(1) }} / 5 ({{ product.reviews.length }})
        </span>
      </div>
    </div>
    <div v-if="product.reviews.length" class="grid grid-cols-1 md:grid-cols-2 gap-stack-md md:gap-16">
      <article
        v-for="review in product.reviews"
        :key="`${review.author}-${review.date}`"
        class="border border-grid-line p-stack-md flex flex-col gap-stack-sm"
      >
        <div class="flex items-center justify-between gap-stack-sm">
          <ProductRating :rating="review.rating" />
          <span class="font-technical-data text-technical-data text-on-surface-variant uppercase shrink-0">{{ review.date }}</span>
        </div>
        <p class="font-body-md text-body-md text-on-surface-variant">{{ review.text }}</p>
        <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-background">{{ review.author }}</span>
      </article>
    </div>
    <p v-else class="font-body-md text-body-md text-on-surface-variant">
      Tento produkt ešte nemá žiadne hodnotenia.
    </p>
  </section>
</template>
