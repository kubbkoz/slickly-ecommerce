<script setup lang="ts">
import { getProductBySlug, getRelatedProducts, categories } from '~/data/products'

const route = useRoute()
const slug = route.params.slug as string

const product = getProductBySlug(slug)

if (!product) {
  throw createError({ statusCode: 404, statusMessage: 'Produkt nebol nájdený', fatal: true })
}

const related = getRelatedProducts(product)
const categoryName = computed(() => categories.find((c) => c.slug === product!.category)?.name)

useSeoMeta({
  title: `${product.name} | SLICKLY`,
  description: product.description,
})

const cart = useCartStore()
const quantity = ref(1)
const activeImage = ref(product.gallery[0] ?? product.image)
const justAdded = ref(false)

function increment() {
  quantity.value++
}
function decrement() {
  if (quantity.value > 1) quantity.value--
}

function addToCart() {
  if (!product.inStock) return
  cart.addItem(product, quantity.value)
  cart.openDrawer()
  justAdded.value = true
  setTimeout(() => (justAdded.value = false), 1500)
}

const formattedPrice = computed(() => `${product!.price.toFixed(2)} €`)
const formattedOldPrice = computed(() => (product!.oldPrice ? `${product!.oldPrice.toFixed(2)} €` : null))
</script>

<template>
  <div class="w-full md:max-w-[1536px] md:mx-auto px-gutter md:px-grid-margin py-stack-lg md:py-12">
    <!-- Breadcrumb -->
    <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant block mb-stack-lg md:mb-8">
      <NuxtLink to="/" class="hover:text-on-background">Domov</NuxtLink> /
      <NuxtLink to="/produkty" class="hover:text-on-background">Obchod</NuxtLink>
      <template v-if="categoryName">
        / <NuxtLink :to="`/produkty?kategoria=${product.category}`" class="hover:text-on-background">{{ categoryName }}</NuxtLink>
      </template>
      / {{ product.name }}
    </span>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-stack-lg md:gap-16">
      <!-- Gallery -->
      <div class="flex flex-col gap-stack-sm">
        <div class="relative aspect-square bg-surface-container-lowest border border-grid-line overflow-hidden">
          <span class="absolute top-3 left-3 z-10 font-technical-data text-technical-data text-on-surface-variant opacity-50">{{ product.sku }}</span>
          <span
            v-if="product.badge"
            class="absolute bottom-0 left-0 bg-secondary-container text-on-background text-badge-label font-badge-label px-2 py-1 uppercase z-10"
          >
            {{ product.badge }}
          </span>
          <img :src="activeImage" :alt="product.name" class="w-full h-full object-cover" />
        </div>
        <div v-if="product.gallery.length > 1" class="flex gap-stack-sm">
          <button
            v-for="(img, idx) in product.gallery"
            :key="idx"
            class="w-20 h-20 border overflow-hidden shrink-0"
            :class="activeImage === img ? 'border-primary' : 'border-grid-line'"
            @click="activeImage = img"
          >
            <img :src="img" :alt="`${product.name} - obrázok ${idx + 1}`" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Details -->
      <div class="flex flex-col gap-stack-md">
        <div>
          <p class="font-technical-data text-technical-data text-on-tertiary-container uppercase mb-stack-xs">
            {{ product.tags.join(' • ') }}
          </p>
          <h1 class="font-headline-lg text-headline-lg md:text-headline-xl uppercase">{{ product.name }}</h1>
        </div>

        <div class="flex items-baseline gap-stack-sm">
          <span v-if="formattedOldPrice" class="font-technical-data text-technical-data text-on-surface-variant line-through">
            {{ formattedOldPrice }}
          </span>
          <span class="font-price-display text-price-display md:text-headline-lg text-on-background">{{ formattedPrice }}</span>
          <span v-if="!product.inStock" class="font-label-sm text-label-sm uppercase text-error">Vypredané</span>
          <span v-else class="font-label-sm text-label-sm uppercase text-on-secondary-container">Skladom</span>
        </div>

        <p class="font-body-md md:text-body-lg text-on-surface-variant border-l-2 border-secondary-container pl-4">
          {{ product.description }}
        </p>

        <div v-if="product.certifications.length" class="flex flex-wrap gap-3">
          <span
            v-for="cert in product.certifications"
            :key="cert"
            class="border border-on-background text-on-background font-technical-data text-technical-data px-3 py-1 uppercase flex items-center gap-2"
          >
            <span class="material-symbols-outlined text-[16px]">verified</span>
            {{ cert }}
          </span>
        </div>

        <!-- Quantity + Add to cart -->
        <div class="flex items-center gap-stack-md mt-stack-sm md:mt-4">
          <div class="flex items-center border border-outline-variant rounded-default">
            <button
              class="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-on-background disabled:opacity-30"
              :disabled="quantity <= 1"
              aria-label="Znížiť množstvo"
              @click="decrement"
            >
              <span class="material-symbols-outlined">remove</span>
            </button>
            <span class="w-10 text-center font-technical-data text-technical-data">{{ quantity }}</span>
            <button class="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-on-background" aria-label="Zvýšiť množstvo" @click="increment">
              <span class="material-symbols-outlined">add</span>
            </button>
          </div>
          <button
            type="button"
            :disabled="!product.inStock"
            class="flex-grow h-12 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed rounded-default"
            @click="addToCart"
          >
            <span class="material-symbols-outlined">{{ justAdded ? 'check' : 'add_shopping_cart' }}</span>
            {{ justAdded ? 'Pridané do košíka' : 'Pridať do košíka' }}
          </button>
        </div>

        <!-- Trust micro-info -->
        <div class="grid grid-cols-2 gap-stack-sm mt-stack-md md:mt-6 pt-stack-md border-t border-grid-line">
          <div class="flex items-center gap-2 text-on-surface-variant">
            <span class="material-symbols-outlined text-[20px]">local_shipping</span>
            <span class="font-technical-data text-technical-data uppercase">Doprava zdarma</span>
          </div>
          <div class="flex items-center gap-2 text-on-surface-variant">
            <span class="material-symbols-outlined text-[20px]">science</span>
            <span class="font-technical-data text-technical-data uppercase">Lab. certifikované</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Related products -->
    <section v-if="related.length" class="mt-stack-lg md:mt-section-padding-lg">
      <h2 class="font-headline-md text-headline-md md:text-headline-lg uppercase tracking-tight border-b border-grid-line pb-stack-sm md:pb-6 mb-stack-md md:mb-8">
        Mohlo by sa vám páčiť
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-px bg-grid-line border border-grid-line">
        <ProductCard v-for="item in related" :key="item.id" :product="item" />
      </div>
    </section>
  </div>
</template>
