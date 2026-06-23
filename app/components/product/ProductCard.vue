<script setup lang="ts">
import { categories } from '~/data/categories'
import type { Product } from '~/data/products'

const props = defineProps<{
  product: Product
}>()

const cart = useCartStore()
const wishlist = useWishlistStore()
const { formatPrice } = useCurrency()
const toast = useToast()
const justAdded = ref(false)
const heartPulse = ref(false)

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

let rafId = 0
function onGalleryScroll() {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = 0
    const node = galleryEl.value
    if (!node) return
    activeImage.value = Math.round(node.scrollLeft / node.clientWidth)
  })
}

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
  toast.show(`${props.product.name} — pridané do košíka`, 'shopping_bag')
  setTimeout(() => (justAdded.value = false), 1200)
}

function toggleWishlist() {
  wishlist.toggle(props.product.id)
  heartPulse.value = true
  if (wishlist.has(props.product.id)) {
    toast.show(`${props.product.name} — v obľúbených`, 'favorite')
  }
  setTimeout(() => { heartPulse.value = false }, 400)
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

const availabilityLabel = computed(() => {
  switch (props.product.availability) {
    case 'in-stock': return 'Skladom'
    case 'on-order': return 'Na objednávku'
    case 'out-of-stock': return 'Vypredané'
  }
})

const availabilityClass = computed(() => {
  switch (props.product.availability) {
    case 'in-stock': return 'bg-success/15 text-success'
    case 'on-order': return 'bg-warning/15 text-warning'
    case 'out-of-stock': return 'bg-error/15 text-error'
  }
})
</script>

<template>
  <div ref="cardRoot" class="group relative flex flex-col h-full bg-surface-container-lowest border border-grid-line transition-[background-color,transform] duration-200 hover:bg-surface active:scale-[0.99] md:active:scale-100">
    <!-- Image area wrapper -->
    <div class="relative">
      <NuxtLink :to="`/produkty/${product.slug}`" class="relative aspect-square overflow-hidden block bg-surface-container-lowest">
        <!-- TOP-LEFT: sale/promo badge -->
        <span
          v-if="product.badge"
          class="absolute top-0 left-0 z-10 bg-secondary-container text-on-background text-badge-label font-badge-label px-stack-md py-1 uppercase"
        >
          {{ product.badge }}
        </span>

        <!-- BOTTOM-LEFT: availability badge -->
        <span
          class="absolute bottom-0 left-0 z-10 font-badge-label text-badge-label px-stack-md py-1 uppercase"
          :class="availabilityClass"
        >
          {{ availabilityLabel }}
        </span>

        <!-- Mobile: swipeable gallery -->
        <div
          v-if="cardImages.length > 1"
          ref="galleryEl"
          class="md:hidden absolute inset-0 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar overscroll-x-contain [touch-action:pan-x]"
          @scroll.passive="onGalleryScroll"
        >
          <NuxtImg
            v-for="(img, idx) in cardImages"
            :key="idx"
            :src="img"
            :alt="idx === 0 ? product.name : `${product.name} – obrázok ${idx + 1}`"
            loading="lazy"
            width="600"
            height="600"
            sizes="640px md:1024px"
            class="w-full h-full shrink-0 snap-center object-cover"
          />
        </div>
        <!-- Mobile single image (no gallery) -->
        <NuxtImg
          v-else
          :src="product.image"
          :alt="product.name"
          loading="lazy"
          width="600"
          height="600"
          sizes="640px md:1024px"
          class="md:hidden w-full h-full object-cover"
        />

        <!-- Desktop: cover image with hover zoom -->
        <NuxtImg
          :src="product.image"
          :alt="product.name"
          loading="lazy"
          width="600"
          height="600"
          sizes="320px md:256px"
          class="hidden md:block w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <!-- Image indicator dots (mobile, multi-image only) -->
        <div
          v-if="cardImages.length > 1"
          class="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5"
          aria-hidden="true"
        >
          <span
            v-for="(img, idx) in cardImages"
            :key="idx"
            class="h-1.5 rounded-full transition-[width,background-color] duration-200 shadow-sm"
            :class="idx === activeImage ? 'w-4 bg-primary' : 'w-1.5 bg-surface-container-lowest/90'"
          />
        </div>

        <!-- Out-of-stock overlay -->
        <span
          v-if="product.availability === 'out-of-stock'"
          class="absolute inset-0 z-[5] bg-surface-container-lowest/60"
        />
      </NuxtLink>

      <!-- BOTTOM-RIGHT of image: wishlist button -->
      <button
        type="button"
        class="absolute bottom-2 right-2 z-20 w-8 h-8 flex items-center justify-center bg-surface-container-lowest/90 rounded-sm cursor-pointer transition-colors duration-200 hover:text-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [touch-action:manipulation]"
        :class="wishlist.has(product.id) ? 'text-error' : 'text-on-surface-variant'"
        :aria-label="wishlist.has(product.id) ? `Odstrániť ${product.name} z obľúbených` : `Pridať ${product.name} do obľúbených`"
        :aria-pressed="wishlist.has(product.id)"
        @click="toggleWishlist"
      >
        <span class="material-symbols-outlined text-[16px]" :class="{ 'heart-pulse': heartPulse }" :style="wishlist.has(product.id) ? { fontVariationSettings: &quot;'FILL' 1&quot; } : {}" aria-hidden="true">favorite</span>
      </button>
    </div>

    <div class="p-stack-md flex flex-col gap-stack-xs flex-grow">
      <NuxtLink :to="`/produkty/${product.slug}`">
        <h3 class="font-data text-body-md font-bold text-on-background uppercase line-clamp-2 hover:text-primary transition-colors">{{ product.name }}</h3>
      </NuxtLink>
      <div v-if="product.reviews.length" class="flex items-center gap-1.5">
        <ProductRating :rating="averageRating" :size="14" />
        <span class="font-technical-data text-technical-data text-on-surface-variant">({{ product.reviews.length }})</span>
      </div>
      <p class="font-technical-data text-technical-data text-on-surface-variant uppercase truncate">
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
          class="min-w-11 min-h-11 shrink-0 flex items-center justify-center rounded-sm cursor-pointer transition-[background-color,transform] duration-200 active:scale-90 hover:bg-primary/85 [touch-action:manipulation] disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          :class="justAdded ? 'bg-success text-on-success cart-success' : 'bg-primary text-on-primary'"
          :aria-label="`Pridať ${product.name} do košíka`"
          @click="addToCart"
        >
          <span class="material-symbols-outlined" aria-hidden="true">{{ justAdded ? 'check' : 'add_shopping_cart' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
