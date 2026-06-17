<script setup lang="ts">
import type { Product } from '~/data/products'

const props = defineProps<{ product: Product }>()

const cart = useCartStore()
const { formatPrice } = useCurrency()
const justAdded = ref(false)

function quickAdd() {
  if (!props.product.inStock) return
  cart.addItem(props.product, 1)
  justAdded.value = true
  setTimeout(() => (justAdded.value = false), 1200)
}

const formattedPrice = computed(() => formatPrice(props.product.price))
const formattedOldPrice = computed(() => props.product.oldPrice ? formatPrice(props.product.oldPrice) : null)
</script>

<template>
  <div class="w-32 shrink-0 flex flex-col bg-surface-container-lowest border border-grid-line snap-start">
    <NuxtLink :to="`/produkty/${product.slug}`" class="relative aspect-square overflow-hidden block" @click="cart.closeDrawer()">
      <img :src="product.image" :alt="product.name" loading="lazy" class="w-full h-full object-cover" />
      <span
        v-if="product.badge"
        class="absolute bottom-0 left-0 bg-secondary-container text-on-background text-[9px] font-badge-label px-1.5 py-0.5 uppercase"
      >{{ product.badge }}</span>
    </NuxtLink>
    <div class="p-2 flex flex-col gap-1 flex-grow">
      <NuxtLink
        :to="`/produkty/${product.slug}`"
        class="font-technical-data text-[11px] leading-tight text-on-surface line-clamp-2 hover:text-primary transition-colors duration-200"
        @click="cart.closeDrawer()"
      >{{ product.name }}</NuxtLink>
      <div class="flex items-end justify-between mt-auto">
        <div class="flex flex-col leading-none">
          <span v-if="formattedOldPrice" class="text-[9px] text-on-surface-variant line-through">{{ formattedOldPrice }}</span>
          <span class="font-price-display text-[13px] text-on-background">{{ formattedPrice }}</span>
        </div>
        <button
          type="button"
          :disabled="!product.inStock"
          class="w-8 h-8 shrink-0 bg-primary text-on-primary flex items-center justify-center rounded-sm cursor-pointer transition-all duration-200 active:scale-90 hover:bg-primary/85 [touch-action:manipulation] disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          :aria-label="`Pridať ${product.name} do košíka`"
          @click="quickAdd"
        >
          <span class="material-symbols-outlined text-[16px]" aria-hidden="true">{{ justAdded ? 'check' : 'add' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
