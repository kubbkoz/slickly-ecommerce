<script setup lang="ts">
import { categories, type Product } from '~/data/products'

const props = defineProps<{
  product: Product
}>()

const cart = useCartStore()
const wishlist = useWishlistStore()
const { formatPrice } = useCurrency()
const justAdded = ref(false)

// Cover image first, then any additional gallery shots (deduped). Used for the
// mobile swipe gallery on the card.
const cardImages = computed(() => {
  const seen = new Set<string>()
  const out: string[] = []
  for (const src of [props.product.image, ...props.product.gallery]) {
    if (src && !seen.has(src)) {
      seen.add(src)
      out.push(src)
    }
  }
  return out
})

const cardRoot = ref<HTMLElement | null>(null)
const galleryEl = ref<HTMLElement | null>(null)
const activeImage = ref(0)

function onGalleryScroll() {
  const node = galleryEl.value
  if (!node) return
  activeImage.value = Math.round(node.scrollLeft / node.clientWidth)
}

// Reset back to the cover image whenever the card leaves the viewport.
// Uses a shared IntersectionObserver to avoid per-card overhead.
let sharedGalleryResetObserver: IntersectionObserver | null = null
const galleryResetCallbacks = new WeakMap<Element, () => void>()

function getGalleryResetObserver(): IntersectionObserver {
  if (!sharedGalleryResetObserver) {
    sharedGalleryResetObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            galleryResetCallbacks.get(entry.target)?.()
          }
        }
      },
      { threshold: 0 },
    )
  }
  return sharedGalleryResetObserver
}

onMounted(() => {
  if (!import.meta.client || cardImages.value.length < 2) return
  const node = cardRoot.value
  if (!node) return
  const observer = getGalleryResetObserver()
  galleryResetCallbacks.set(node, () => {
    if (galleryEl.value && galleryEl.value.scrollLeft !== 0) {
      galleryEl.value.scrollTo({ left: 0 })
      activeImage.value = 0
    }
  })
  observer.observe(node)
  onBeforeUnmount(() => {
    observer.unobserve(node)
    galleryResetCallbacks.delete(node)
  })
})

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
  <div ref="cardRoot" class="group relative flex flex-col h-full bg-surface-container-lowest border border-grid-line transition-[background-color,transform] duration-200 hover:bg-surface active:scale-[0.98] md:active:scale-100">
    <button
      type="button"
      class="absolute top-2 right-2 z-20 min-w-11 min-h-11 flex items-center justify-center bg-surface-container-lowest/90 rounded-full cursor-pointer transition-colors duration-200 hover:text-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [touch-action:manipulation]"
      :class="wishlist.has(product.id) ? 'text-error' : 'text-on-surface-variant'"
      :aria-label="wishlist.has(product.id) ? `Odstrániť ${product.name} z obľúbených` : `Pridať ${product.name} do obľúbených`"
      :aria-pressed="wishlist.has(product.id)"
      @click="wishlist.toggle(product.id)"
    >
      <span class="material-symbols-outlined text-[18px]" :style="wishlist.has(product.id) ? { fontVariationSettings: &quot;'FILL' 1&quot; } : {}" aria-hidden="true">favorite</span>
    </button>
    <NuxtLink :to="`/produkty/${product.slug}`" class="relative aspect-square overflow-hidden block bg-surface-container-lowest">
      <span class="absolute top-3 left-3 z-10 font-technical-data text-technical-data text-on-surface-variant bg-surface-container-lowest/90 px-1.5 py-0.5 rounded-xs">{{ product.sku }}</span>

      <!-- Mobile: swipeable gallery -->
      <div
        v-if="cardImages.length > 1"
        ref="galleryEl"
        class="md:hidden absolute inset-0 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar overscroll-x-contain [touch-action:pan-x]"
        @scroll.passive="onGalleryScroll"
      >
        <img
          v-for="(img, idx) in cardImages"
          :key="idx"
          :src="img"
          :alt="idx === 0 ? product.name : `${product.name} – obrázok ${idx + 1}`"
          loading="lazy"
          class="w-full h-full shrink-0 snap-center object-cover"
        />
      </div>
      <!-- Mobile single image (no gallery) -->
      <img
        v-else
        :src="product.image"
        :alt="product.name"
        loading="lazy"
        class="md:hidden w-full h-full object-cover"
      />

      <!-- Desktop: cover image with hover zoom -->
      <img
        :src="product.image"
        :alt="product.name"
        loading="lazy"
        class="hidden md:block w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <!-- Image indicator dots (mobile, multi-image only) -->
      <div
        v-if="cardImages.length > 1"
        class="md:hidden absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5"
        aria-hidden="true"
      >
        <span
          v-for="(img, idx) in cardImages"
          :key="idx"
          class="h-1.5 rounded-full transition-[width,background-color] duration-200 shadow-sm"
          :class="idx === activeImage ? 'w-4 bg-primary' : 'w-1.5 bg-surface-container-lowest/90'"
        />
      </div>

      <span
        v-if="product.badge"
        class="absolute bottom-0 left-0 z-10 bg-secondary-container text-on-background text-badge-label font-badge-label px-2 py-1 uppercase rounded-tr-xs"
      >
        {{ product.badge }}
      </span>
      <span
        v-if="!product.inStock"
        class="absolute inset-0 z-10 bg-surface-container-lowest/70 flex items-center justify-center font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant"
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
          class="min-w-11 min-h-11 shrink-0 bg-primary text-on-primary flex items-center justify-center rounded-sm cursor-pointer transition-[background-color,transform] duration-200 active:scale-90 hover:bg-primary/85 [touch-action:manipulation] disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          :aria-label="`Pridať ${product.name} do košíka`"
          @click="addToCart"
        >
          <span class="material-symbols-outlined" aria-hidden="true">{{ justAdded ? 'check' : 'add_shopping_cart' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
