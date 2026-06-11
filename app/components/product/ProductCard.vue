<script setup lang="ts">
import type { Product } from '~/data/products'

const props = defineProps<{
  product: Product
}>()

const cart = useCartStore()
const justAdded = ref(false)

function addToCart() {
  if (!props.product.inStock) return
  cart.addItem(props.product)
  justAdded.value = true
  setTimeout(() => (justAdded.value = false), 1200)
}

const formattedPrice = computed(() => `${props.product.price.toFixed(2)} €`)
const formattedOldPrice = computed(() =>
  props.product.oldPrice ? `${props.product.oldPrice.toFixed(2)} €` : null,
)
</script>

<template>
  <div class="group relative flex flex-col h-full bg-surface-container-lowest border border-grid-line transition-colors duration-300 hover:bg-surface">
    <NuxtLink :to="`/produkty/${product.slug}`" class="relative aspect-square overflow-hidden block bg-surface-container-lowest">
      <span class="absolute top-3 left-3 z-10 font-technical-data text-technical-data text-on-surface-variant opacity-50">{{ product.sku }}</span>
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span
        v-if="product.badge"
        class="absolute bottom-0 left-0 bg-secondary-container text-on-background text-badge-label font-badge-label px-2 py-1 uppercase rounded-tr-xs"
      >
        {{ product.badge }}
      </span>
      <span
        v-if="!product.inStock"
        class="absolute inset-0 bg-surface-container-lowest/70 flex items-center justify-center font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant"
      >
        Vypredané
      </span>
    </NuxtLink>
    <div class="p-stack-md flex flex-col gap-stack-xs flex-grow">
      <NuxtLink :to="`/produkty/${product.slug}`">
        <h3 class="font-headline-md text-headline-md text-on-surface truncate hover:text-primary transition-colors">{{ product.name }}</h3>
      </NuxtLink>
      <p class="font-technical-data text-technical-data text-on-tertiary-container uppercase truncate">
        {{ product.tags.join(' • ') }}
      </p>
      <div class="flex justify-between items-end mt-auto pt-stack-sm">
        <div class="flex flex-col leading-none">
          <span v-if="formattedOldPrice" class="font-technical-data text-technical-data text-on-surface-variant line-through mb-0.5">
            {{ formattedOldPrice }}
          </span>
          <span class="font-price-display text-price-display text-on-background">{{ formattedPrice }}</span>
        </div>
        <button
          type="button"
          :disabled="!product.inStock"
          class="w-10 h-10 shrink-0 bg-primary text-on-primary flex items-center justify-center rounded-sm transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
          :aria-label="`Pridať ${product.name} do košíka`"
          @click="addToCart"
        >
          <span class="material-symbols-outlined">{{ justAdded ? 'check' : 'add_shopping_cart' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
