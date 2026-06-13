<script setup lang="ts">
import { getProductBySlug, getRelatedProducts, getBundleProducts, categories, type Product } from '~/data/products'

const route = useRoute()
const slug = route.params.slug as string

const product = getProductBySlug(slug)

if (!product) {
  throw createError({ statusCode: 404, statusMessage: 'Produkt nebol nájdený', fatal: true })
}

const related = getRelatedProducts(product, 6)
const bundleProducts = getBundleProducts(product)
const categoryName = computed(() => categories.find((c) => c.slug === product!.category)?.name)

const averageRating = computed(() => {
  if (!product!.reviews.length) return 0
  return product!.reviews.reduce((sum, r) => sum + r.rating, 0) / product!.reviews.length
})

const recentlyViewed = useRecentlyViewedStore()
const recentlyViewedProducts = computed(() =>
  recentlyViewed.slugs
    .filter((s) => s !== product!.slug)
    .map((s) => getProductBySlug(s))
    .filter((p): p is Product => !!p)
    .slice(0, 4),
)

onMounted(() => {
  recentlyViewed.addProduct(product!.slug)
})

useSeoMeta({
  title: `${product.name} | SLICKLY`,
  description: product.description,
})

const cart = useCartStore()
const { formatPrice } = useCurrency()
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

const formattedPrice = computed(() => formatPrice(product!.price))
const formattedOldPrice = computed(() => (product!.oldPrice ? formatPrice(product!.oldPrice) : null))
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
          <img :src="activeImage" :alt="product.name" fetchpriority="high" class="w-full h-full object-cover" />
        </div>
        <div v-if="product.gallery.length > 1" class="flex gap-stack-sm" role="group" aria-label="Galéria produktu">
          <button
            v-for="(img, idx) in product.gallery"
            :key="idx"
            type="button"
            class="w-20 h-20 border overflow-hidden shrink-0 cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            :class="activeImage === img ? 'border-primary' : 'border-grid-line hover:border-outline-variant'"
            :aria-label="`Zobraziť obrázok ${idx + 1} z ${product.gallery.length}`"
            :aria-pressed="activeImage === img"
            @click="activeImage = img"
          >
            <img :src="img" :alt="`${product.name} - obrázok ${idx + 1}`" loading="lazy" class="w-full h-full object-cover" />
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
          <div v-if="product.reviews.length" class="flex items-center gap-2 mt-stack-xs">
            <ProductRating :rating="averageRating" :size="18" />
            <span class="font-technical-data text-technical-data text-on-surface-variant">
              {{ averageRating.toFixed(1) }} / 5 ({{ product.reviews.length }})
            </span>
          </div>
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
            <span class="material-symbols-outlined text-[16px]" aria-hidden="true">verified</span>
            {{ cert }}
          </span>
        </div>

        <!-- Quantity + Add to cart -->
        <div class="flex items-center gap-stack-md mt-stack-sm md:mt-4">
          <div class="flex items-center border border-outline-variant rounded-default" role="group" aria-label="Množstvo">
            <button
              type="button"
              class="min-w-11 min-h-11 flex items-center justify-center text-on-surface-variant hover:text-on-background cursor-pointer transition-colors duration-200 [touch-action:manipulation] disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              :disabled="quantity <= 1"
              aria-label="Znížiť množstvo"
              @click="decrement"
            >
              <span class="material-symbols-outlined" aria-hidden="true">remove</span>
            </button>
            <span class="w-10 text-center font-technical-data text-technical-data" aria-live="polite">{{ quantity }}</span>
            <button
              type="button"
              class="min-w-11 min-h-11 flex items-center justify-center text-on-surface-variant hover:text-on-background cursor-pointer transition-colors duration-200 [touch-action:manipulation] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Zvýšiť množstvo"
              @click="increment"
            >
              <span class="material-symbols-outlined" aria-hidden="true">add</span>
            </button>
          </div>
          <button
            type="button"
            :disabled="!product.inStock"
            class="flex-grow h-12 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.99] hover:bg-primary/85 disabled:opacity-30 disabled:cursor-not-allowed rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            @click="addToCart"
          >
            <span class="material-symbols-outlined" aria-hidden="true">{{ justAdded ? 'check' : 'add_shopping_cart' }}</span>
            {{ justAdded ? 'Pridané do košíka' : 'Pridať do košíka' }}
          </button>
        </div>
        <span class="sr-only" role="status">{{ justAdded ? 'Produkt bol pridaný do košíka' : '' }}</span>

        <!-- Trust micro-info -->
        <div class="grid grid-cols-2 gap-stack-sm mt-stack-md md:mt-6 pt-stack-md border-t border-grid-line">
          <div class="flex items-center gap-2 text-on-surface-variant">
            <span class="material-symbols-outlined text-[20px]" aria-hidden="true">local_shipping</span>
            <span class="font-technical-data text-technical-data uppercase">Doprava zdarma</span>
          </div>
          <div class="flex items-center gap-2 text-on-surface-variant">
            <span class="material-symbols-outlined text-[20px]" aria-hidden="true">science</span>
            <span class="font-technical-data text-technical-data uppercase">Lab. certifikované</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Popis -->
    <section class="mt-stack-lg md:mt-section-padding-lg">
      <h2 class="font-headline-md text-headline-md md:text-headline-lg uppercase tracking-tight border-b border-grid-line pb-stack-sm md:pb-6 mb-stack-md md:mb-8">
        Popis
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-stack-md md:gap-16">
        <p class="md:col-span-2 font-body-md md:text-body-lg text-on-surface-variant">
          {{ product.description }}
        </p>
        <ul v-if="product.certifications.length" class="flex flex-col gap-stack-sm h-fit">
          <li
            v-for="cert in product.certifications"
            :key="cert"
            class="flex items-center gap-2 font-technical-data text-technical-data uppercase text-on-background border border-grid-line px-3 py-2"
          >
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">verified</span>
            {{ cert }}
          </li>
        </ul>
      </div>
    </section>

    <!-- Špecifikácia -->
    <section v-if="product.specifications.length" class="mt-stack-lg md:mt-section-padding-lg">
      <h2 class="font-headline-md text-headline-md md:text-headline-lg uppercase tracking-tight border-b border-grid-line pb-stack-sm md:pb-6 mb-stack-md md:mb-8">
        Špecifikácia
      </h2>
      <dl class="grid grid-cols-1 md:grid-cols-2 gap-px bg-grid-line border border-grid-line">
        <div
          v-for="spec in product.specifications"
          :key="spec.label"
          class="flex justify-between items-baseline gap-stack-sm bg-surface-container-lowest px-stack-md py-stack-sm"
        >
          <dt class="font-technical-data text-technical-data uppercase text-on-surface-variant">{{ spec.label }}</dt>
          <dd class="font-body-md text-body-md text-on-background text-right">{{ spec.value }}</dd>
        </div>
      </dl>
    </section>

    <!-- Použitie -->
    <section v-if="product.usage.length" class="mt-stack-lg md:mt-section-padding-lg">
      <h2 class="font-headline-md text-headline-md md:text-headline-lg uppercase tracking-tight border-b border-grid-line pb-stack-sm md:pb-6 mb-stack-md md:mb-8">
        Použitie
      </h2>
      <ol class="flex flex-col gap-stack-md md:max-w-2xl">
        <li v-for="(step, idx) in product.usage" :key="idx" class="flex items-start gap-stack-sm md:gap-stack-md">
          <span class="shrink-0 w-8 h-8 flex items-center justify-center bg-primary text-on-primary font-technical-data text-technical-data rounded-full">
            {{ idx + 1 }}
          </span>
          <p class="font-body-md md:text-body-lg text-on-surface-variant pt-1">{{ step }}</p>
        </li>
      </ol>
    </section>

    <!-- Čo hovoria zákazníci -->
    <section class="mt-stack-lg md:mt-section-padding-lg">
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

    <!-- Odporúčame k tomu -->
    <section v-if="bundleProducts.length" class="mt-stack-lg md:mt-section-padding-lg">
      <h2 class="font-headline-md text-headline-md md:text-headline-lg uppercase tracking-tight border-b border-grid-line pb-stack-sm md:pb-6 mb-stack-md md:mb-8">
        Odporúčame k tomu
      </h2>
      <ProductBundle :main-product="product" :bundle-products="bundleProducts" />
    </section>

    <!-- Naposledy prezerané -->
    <section v-if="recentlyViewedProducts.length" class="mt-stack-lg md:mt-section-padding-lg">
      <h2 class="font-headline-md text-headline-md md:text-headline-lg uppercase tracking-tight border-b border-grid-line pb-stack-sm md:pb-6 mb-stack-md md:mb-8">
        Naposledy prezerané
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-px bg-grid-line border border-grid-line">
        <ProductCard v-for="item in recentlyViewedProducts" :key="item.id" :product="item" />
      </div>
    </section>

    <!-- Podobné produkty -->
    <section v-if="related.length" class="mt-stack-lg md:mt-section-padding-lg">
      <h2 class="font-headline-md text-headline-md md:text-headline-lg uppercase tracking-tight border-b border-grid-line pb-stack-sm md:pb-6 mb-stack-md md:mb-8">
        Podobné produkty
      </h2>
      <ProductCarousel :products="related" />
    </section>
  </div>
</template>
