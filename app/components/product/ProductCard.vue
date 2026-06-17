<script setup lang="ts">
import { categories, type Product } from '~/data/products'

const props = defineProps<{
  product: Product
}>()

const cart = useCartStore()
const wishlist = useWishlistStore()
const { formatPrice } = useCurrency()
const justAdded = ref(false)

function addToCart() {
  if (!props.product.inStock) return
  cart.addItem(props.product)
  cart.openDrawer()
  justAdded.value = true
  setTimeout(() => (justAdded.value = false), 1200)
}

const formattedPrice = computed(() => formatPrice(props.product.price))
const formattedOldPrice = computed(() =>
  props.product.oldPrice ? formatPrice(props.product.oldPrice) : null,
)
const averageRating = computed(() => {
  if (!props.product.reviews.length) return 0
  return props.product.reviews.reduce((sum, r) => sum + r.rating, 0) / props.product.reviews.length
})
const categoryName = computed(() => categories.find((c) => c.slug === props.product.category)?.name ?? '')
</script>

<template>
  <div class="group relative flex flex-col h-full bg-surface-container-lowest border border-grid-line transition-all duration-200 hover:bg-surface active:scale-[0.98] md:active:scale-100">
    <button
      type="button"
      class="absolute top-2 right-2 z-20 min-w-11 min-h-11 flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-sm rounded-full cursor-pointer transition-colors duration-200 hover:text-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [touch-action:manipulation]"
      :class="wishlist.has(product.id) ? 'text-error' : 'text-on-surface-variant'"
      :aria-label="wishlist.has(product.id) ? `Odstrániť ${product.name} z obľúbených` : `Pridať ${product.name} do obľúbených`"
      :aria-pressed="wishlist.has(product.id)"
      @click="wishlist.toggle(product.id)"
    >
      <span class="material-symbols-outlined text-[18px]" :style="wishlist.has(product.id) ? { fontVariationSettings: &quot;'FILL' 1&quot; } : {}" aria-hidden="true">favorite</span>
    </button>
    <NuxtLink :to="`/produkty/${product.slug}`" class="relative aspect-square overflow-hidden block bg-surface-container-lowest">
      <span class="absolute top-3 left-3 z-10 font-technical-data text-technical-data text-on-surface-variant opacity-50">{{ product.sku }}</span>
      <img
        :src="product.image"
        :alt="product.name"
        loading="lazy"
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
        <h3 class="font-headline-sm text-headline-sm text-on-surface line-clamp-2 hover:text-primary transition-colors">{{ product.name }}</h3>
      </NuxtLink>
      <div v-if="product.reviews.length" class="flex items-center gap-1.5">
        <ProductRating :rating="averageRating" :size="14" />
        <span class="font-technical-data text-technical-data text-on-surface-variant">({{ product.reviews.length }})</span>
      </div>
      <p class="font-technical-data text-technical-data text-secondary uppercase truncate">
        {{ categoryName }}
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
          class="min-w-11 min-h-11 shrink-0 bg-primary text-on-primary flex items-center justify-center rounded-sm cursor-pointer transition-all duration-200 active:scale-90 hover:bg-primary/85 [touch-action:manipulation] disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          :aria-label="`Pridať ${product.name} do košíka`"
          @click="addToCart"
        >
          <span class="material-symbols-outlined" aria-hidden="true">{{ justAdded ? 'check' : 'add_shopping_cart' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
