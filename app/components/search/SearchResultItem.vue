<script setup lang="ts">
import type { Product } from '~/data/products'

const props = defineProps<{ product: Product }>()

const { formatPrice } = useCurrency()
const formattedPrice = computed(() => formatPrice(props.product.price))
</script>

<template>
  <NuxtLink
    :to="`/produkty/${product.slug}`"
    class="flex items-center gap-stack-sm py-stack-sm group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-default"
  >
    <div class="w-14 h-14 shrink-0 bg-surface-container-lowest border border-grid-line overflow-hidden">
      <NuxtImg :src="product.image" :alt="product.name" loading="lazy" width="200" height="200" sizes="80px" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
    </div>
    <div class="flex-grow min-w-0">
      <p class="font-body-md text-body-md text-on-surface truncate group-hover:text-primary transition-colors duration-200">{{ product.name }}</p>
      <p class="font-technical-data text-technical-data text-on-surface-variant uppercase truncate">{{ product.tags.join(' • ') }}</p>
    </div>
    <span class="font-price-display text-price-display shrink-0">{{ formattedPrice }}</span>
  </NuxtLink>
</template>
