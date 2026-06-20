<script setup lang="ts">
import type { Product } from '~/data/products'

const props = defineProps<{
  mainProduct: Product
  bundleProducts: Product[]
}>()

const cart = useCartStore()
const { formatPrice } = useCurrency()
const toast = useToast()
const justAdded = ref(false)

const allProducts = computed(() => [props.mainProduct, ...props.bundleProducts])

const totalPrice = computed(() => allProducts.value.reduce((sum, p) => sum + p.price, 0))
const formattedTotal = computed(() => formatPrice(totalPrice.value))

function addBundleToCart() {
  for (const item of allProducts.value) {
    if (!item.inStock) continue
    cart.addItem(item, 1)
  }
  cart.openDrawer()
  justAdded.value = true
  toast.show('Balíček pridaný do košíka', 'shopping_bag')
  setTimeout(() => (justAdded.value = false), 1500)
}
</script>

<template>
  <div class="border border-grid-line p-stack-md md:p-6 flex flex-col md:flex-row md:items-center gap-stack-md md:gap-stack-lg">
    <div class="flex items-center gap-stack-sm flex-wrap">
      <template v-for="(item, idx) in allProducts" :key="item.id">
        <NuxtLink :to="`/produkty/${item.slug}`" class="group flex flex-col items-center gap-stack-xs w-20 md:w-24">
          <div class="w-20 h-20 md:w-24 md:h-24 bg-surface-container-lowest border border-grid-line overflow-hidden">
            <NuxtImg :src="item.image" :alt="item.name" loading="lazy" width="200" height="200" sizes="80px" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          </div>
          <span class="font-technical-data text-technical-data text-center text-on-surface-variant truncate w-full group-hover:text-primary transition-colors duration-200">{{ item.name }}</span>
        </NuxtLink>
        <span v-if="idx < allProducts.length - 1" class="material-symbols-outlined text-on-surface-variant shrink-0" aria-hidden="true">add</span>
      </template>
    </div>

    <div class="flex flex-col gap-stack-sm md:ml-auto md:items-end shrink-0">
      <div class="flex items-baseline gap-stack-sm">
        <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Cena balíčka</span>
        <span class="font-price-display text-headline-md text-on-background">{{ formattedTotal }}</span>
      </div>
      <button
        type="button"
        class="h-12 px-6 font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-[background-color,transform] duration-200 active:scale-[0.99] hover:bg-primary/85 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        :class="justAdded ? 'bg-[#2e7d32] text-white cart-success' : 'bg-primary text-on-primary'"
        @click="addBundleToCart"
      >
        <span class="material-symbols-outlined" aria-hidden="true">{{ justAdded ? 'check' : 'add_shopping_cart' }}</span>
        {{ justAdded ? 'Balíček pridaný' : 'Pridať balíček do košíka' }}
      </button>
    </div>
  </div>
</template>
