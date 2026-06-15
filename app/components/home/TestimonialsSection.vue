<script setup lang="ts">
import { products } from '~/data/products'

const allReviews = products.flatMap((product) =>
  product.reviews.map((review) => ({ ...review, productName: product.name, productSlug: product.slug })),
)

const averageRating = computed(() => {
  if (!allReviews.length) return 0
  return allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
})

const featured = allReviews.filter((r) => r.rating >= 4).slice(0, 6)

const stats = [
  { value: '12 000+', label: 'Spokojných klientov' },
  { value: '24+', label: 'Mesiacov ochrany' },
  { value: '99.8%', label: 'Efektivita odpudzovania vody' },
]
</script>

<template>
  <section class="w-full relative py-stack-lg md:py-section-padding-lg bg-surface-container border-y border-grid-line">
    <div class="w-full md:max-w-[1536px] md:mx-auto px-gutter md:px-grid-margin flex flex-col gap-stack-md md:gap-12">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-stack-sm border-b border-grid-line pb-stack-sm md:pb-6">
        <div>
          <h2 class="font-headline-md text-headline-md md:text-headline-lg uppercase tracking-tight">Čo hovoria naši klienti</h2>
          <p class="font-body-md text-body-md text-on-surface-variant mt-1">Overené hodnotenia od skutočných zákazníkov.</p>
        </div>
        <div class="flex items-center gap-3">
          <ProductRating :rating="averageRating" :size="22" />
          <span class="font-price-display text-headline-sm text-on-background">{{ averageRating.toFixed(1) }}/5</span>
          <span class="font-technical-data text-technical-data text-on-surface-variant uppercase">({{ allReviews.length }}+ recenzií)</span>
        </div>
      </div>

      <!-- Stats strip -->
      <div class="grid grid-cols-3 gap-px bg-grid-line border border-grid-line">
        <div v-for="stat in stats" :key="stat.label" class="bg-surface px-stack-sm md:px-stack-md py-stack-md flex flex-col items-center text-center gap-1">
          <span class="font-price-display text-headline-md md:text-headline-lg text-on-background">{{ stat.value }}</span>
          <span class="font-technical-data text-technical-data text-on-surface-variant uppercase">{{ stat.label }}</span>
        </div>
      </div>

      <!-- Mobile: horizontal scroll -->
      <div class="md:hidden flex gap-stack-sm overflow-x-auto px-gutter -mx-gutter scroll-px-gutter hide-scrollbar snap-x">
        <article
          v-for="review in featured"
          :key="`${review.author}-${review.date}`"
          class="min-w-[280px] snap-start border border-grid-line p-stack-md flex flex-col gap-stack-sm bg-surface"
        >
          <div class="flex items-center justify-between gap-stack-sm">
            <ProductRating :rating="review.rating" />
            <span class="font-technical-data text-technical-data text-on-surface-variant uppercase">{{ review.date }}</span>
          </div>
          <p class="font-body-md text-body-md text-on-surface-variant flex-grow">{{ review.text }}</p>
          <div class="flex items-center justify-between gap-stack-sm pt-stack-sm border-t border-grid-line">
            <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-background">{{ review.author }}</span>
            <NuxtLink :to="`/produkty/${review.productSlug}`" class="font-technical-data text-technical-data text-primary hover:text-secondary uppercase truncate ml-2">
              {{ review.productName }}
            </NuxtLink>
          </div>
        </article>
      </div>

      <!-- Desktop: grid -->
      <div class="hidden md:grid grid-cols-3 gap-px bg-grid-line border border-grid-line">
        <article
          v-for="review in featured"
          :key="`${review.author}-${review.date}`"
          class="p-6 flex flex-col gap-stack-sm bg-surface"
        >
          <div class="flex items-center justify-between gap-stack-sm">
            <ProductRating :rating="review.rating" />
            <span class="font-technical-data text-technical-data text-on-surface-variant uppercase">{{ review.date }}</span>
          </div>
          <p class="font-body-md text-body-md text-on-surface-variant flex-grow">{{ review.text }}</p>
          <div class="flex items-center justify-between gap-stack-sm pt-stack-sm border-t border-grid-line">
            <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-background">{{ review.author }}</span>
            <NuxtLink :to="`/produkty/${review.productSlug}`" class="font-technical-data text-technical-data text-primary hover:text-secondary uppercase truncate ml-2">
              {{ review.productName }}
            </NuxtLink>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
