<script setup lang="ts">
import { products as allProducts, getRelatedProducts, type Product } from '~/data/products'

const cart = useCartStore()
const { formatPrice } = useCurrency()

useSeo({
  title: 'Košík | SLICKLY',
  description: 'Váš nákupný košík SLICKLY.',
  noindex: true,
})

const formattedSubtotal = computed(() => formatPrice(cart.subtotal))

function lineTotal(price: number, quantity: number) {
  return formatPrice(price * quantity)
}

function increment(productId: string, quantity: number) {
  cart.updateQuantity(productId, quantity + 1)
}
function decrement(productId: string, quantity: number) {
  cart.updateQuantity(productId, quantity - 1)
}

// Total saved vs. original prices — shown in the summary as a conversion nudge.
const savingsTotal = computed(() => {
  return cart.items.reduce((total, item) => {
    const product = allProducts.find((p) => p.id === item.productId)
    if (product?.oldPrice && product.oldPrice > item.price) {
      return total + (product.oldPrice - item.price) * item.quantity
    }
    return total
  }, 0)
})
const formattedSavings = computed(() => formatPrice(savingsTotal.value))

// Cross-sell: related products from each cart item's category, excluding
// anything already in the cart.
const recommended = computed<Product[]>(() => {
  const cartIds = new Set(cart.items.map((i) => i.productId))
  const seen = new Set<string>()
  const result: Product[] = []
  for (const item of cart.items) {
    const product = allProducts.find((p) => p.id === item.productId)
    if (!product) continue
    for (const rel of getRelatedProducts(product, 4)) {
      if (result.length >= 4) break
      if (cartIds.has(rel.id) || seen.has(rel.id)) continue
      seen.add(rel.id)
      result.push(rel)
    }
    if (result.length >= 4) break
  }
  return result
})
</script>

<template>
  <div
    class="w-full md:max-w-[1536px] md:mx-auto px-gutter md:px-grid-margin py-stack-lg md:py-12"
    :class="cart.items.length ? 'pb-28 md:pb-12' : ''"
  >
    <!-- Breadcrumb -->
    <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant block mb-stack-lg md:mb-8">
      <NuxtLink to="/" class="hover:text-on-background">Domov</NuxtLink> / Košík
    </span>

    <h1 class="font-headline-lg text-headline-lg md:text-headline-xl uppercase border-b border-grid-line pb-stack-sm md:pb-6 mb-stack-lg md:mb-8">
      Nákupný košík
    </h1>

    <div v-if="cart.items.length" class="grid grid-cols-1 md:grid-cols-3 gap-stack-lg md:gap-16">
      <!-- Items -->
      <div class="md:col-span-2 flex flex-col divide-y divide-grid-line border-y border-grid-line">
        <div
          v-for="item in cart.items"
          :key="item.productId"
          class="flex items-center gap-stack-md py-stack-md"
        >
          <NuxtLink :to="`/produkty/${item.slug}`" class="w-20 h-20 md:w-28 md:h-28 shrink-0 bg-surface-container-lowest border border-grid-line overflow-hidden">
            <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
          </NuxtLink>

          <div class="flex-grow flex flex-col gap-1 min-w-0">
            <span class="font-technical-data text-technical-data text-on-surface-variant opacity-50 uppercase">{{ item.sku }}</span>
            <NuxtLink :to="`/produkty/${item.slug}`" class="font-headline-sm text-headline-sm uppercase hover:text-primary truncate">
              {{ item.name }}
            </NuxtLink>
            <span class="font-price-display text-price-display text-on-background md:hidden">{{ formatPrice(item.price) }}</span>
            <button
              type="button"
              class="flex items-center gap-1 font-label-sm text-label-sm uppercase text-on-surface-variant hover:text-error w-fit mt-1 cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
              :aria-label="`Odstrániť položku: ${item.name}`"
              @click="cart.removeItem(item.productId)"
            >
              <span class="material-symbols-outlined text-[16px]" aria-hidden="true">delete</span>
              Odstrániť
            </button>
          </div>

          <span class="hidden md:block font-price-display text-price-display text-on-background w-24 text-right shrink-0">
            {{ formatPrice(item.price) }}
          </span>

          <div class="flex items-center border border-outline-variant rounded-default shrink-0" role="group" aria-label="Množstvo">
            <button
              type="button"
              class="min-w-11 min-h-11 flex items-center justify-center text-on-surface-variant hover:text-on-background cursor-pointer transition-colors duration-200 [touch-action:manipulation] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              :aria-label="`Znížiť množstvo: ${item.name}`"
              @click="decrement(item.productId, item.quantity)"
            >
              <span class="material-symbols-outlined" aria-hidden="true">remove</span>
            </button>
            <span class="w-8 md:w-10 text-center font-technical-data text-technical-data" aria-live="polite">{{ item.quantity }}</span>
            <button
              type="button"
              class="min-w-11 min-h-11 flex items-center justify-center text-on-surface-variant hover:text-on-background cursor-pointer transition-colors duration-200 [touch-action:manipulation] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              :aria-label="`Zvýšiť množstvo: ${item.name}`"
              @click="increment(item.productId, item.quantity)"
            >
              <span class="material-symbols-outlined" aria-hidden="true">add</span>
            </button>
          </div>

          <span class="hidden md:block font-price-display text-price-display text-on-background w-24 text-right shrink-0">
            {{ lineTotal(item.price, item.quantity) }}
          </span>
        </div>
      </div>

      <!-- Summary -->
      <div class="flex flex-col gap-stack-md h-fit border border-grid-line p-stack-md md:p-6">
        <h2 class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm">
          Súhrn objednávky
        </h2>
        <div class="flex justify-between items-baseline">
          <span class="font-body-md text-body-md text-on-surface-variant">Medzisúčet</span>
          <span class="font-price-display text-price-display text-on-background">{{ formattedSubtotal }}</span>
        </div>
        <div v-if="savingsTotal > 0" class="flex justify-between items-baseline">
          <span class="font-body-md text-body-md text-on-surface-variant">Vaša úspora</span>
          <span class="font-technical-data text-technical-data uppercase text-on-secondary-container">−{{ formattedSavings }}</span>
        </div>
        <div class="flex justify-between items-baseline">
          <span class="font-body-md text-body-md text-on-surface-variant">Doprava</span>
          <span class="font-technical-data text-technical-data uppercase text-on-secondary-container">Zdarma</span>
        </div>
        <div class="flex justify-between items-baseline pt-stack-sm border-t border-grid-line">
          <span class="font-headline-sm text-headline-sm uppercase">Spolu</span>
          <span class="font-price-display text-headline-md text-on-background">{{ formattedSubtotal }}</span>
        </div>
        <NuxtLink
          to="/pokladna"
          class="h-12 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.99] hover:bg-primary/85 rounded-default mt-stack-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span class="material-symbols-outlined" aria-hidden="true">lock</span>
          Pokračovať k pokladni
        </NuxtLink>
        <NuxtLink
          to="/produkty"
          class="h-12 border border-outline-variant text-on-background font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200 hover:border-primary rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Pokračovať v nákupe
        </NuxtLink>

        <!-- Trust signals -->
        <div class="flex flex-col gap-2 pt-stack-sm border-t border-grid-line mt-1">
          <div class="flex items-center gap-2 text-on-surface-variant">
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">lock</span>
            <span class="font-technical-data text-technical-data uppercase">Bezpečná platba so šifrovaním SSL</span>
          </div>
          <div class="flex items-center gap-2 text-on-surface-variant">
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">replay</span>
            <span class="font-technical-data text-technical-data uppercase">30-dňová záruka vrátenia</span>
          </div>
          <div class="flex items-center gap-2 text-on-surface-variant">
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">local_shipping</span>
            <span class="font-technical-data text-technical-data uppercase">Doprava zdarma na všetky objednávky</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="flex flex-col items-center text-center gap-stack-md py-stack-lg md:py-section-padding-lg">
      <span class="material-symbols-outlined text-[64px] text-on-surface-variant opacity-30">shopping_bag</span>
      <h2 class="font-headline-md text-headline-md uppercase">Váš košík je prázdny</h2>
      <p class="font-body-md text-body-md text-on-surface-variant max-w-md">
        Zatiaľ ste si nepridali žiadne produkty. Preskúmajte náš sortiment a nájdite si laboratórne kalibrovanú ochranu pre vaše vozidlo.
      </p>
      <NuxtLink
        to="/produkty"
        class="h-12 px-8 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.99] hover:bg-primary/85 rounded-default mt-stack-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Prejsť do obchodu
      </NuxtLink>
    </div>

    <!-- Cross-sell -->
    <section v-if="recommended.length" class="mt-stack-lg md:mt-16 pt-stack-lg md:pt-12 border-t border-grid-line">
      <h2 class="font-headline-md text-headline-md uppercase mb-stack-md md:mb-8">Mohlo by sa vám páčiť</h2>
      <ProductCarousel :products="recommended" />
    </section>

    <!-- Sticky mobile checkout bar -->
    <div
      v-if="cart.items.length"
      class="md:hidden fixed bottom-16 left-0 right-0 z-40 bg-surface-container-lowest border-t border-grid-line px-gutter py-stack-sm flex items-center justify-between gap-stack-sm shadow-[0_-2px_8px_rgba(0,0,0,0.06)]"
    >
      <div class="flex flex-col leading-none">
        <span class="font-technical-data text-technical-data text-on-surface-variant uppercase">Spolu</span>
        <span class="font-price-display text-price-display text-on-background">{{ formattedSubtotal }}</span>
      </div>
      <NuxtLink
        to="/pokladna"
        class="h-12 px-6 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.99] hover:bg-primary/85 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span class="material-symbols-outlined" aria-hidden="true">lock</span>
        Pokladňa
      </NuxtLink>
    </div>
  </div>
</template>
