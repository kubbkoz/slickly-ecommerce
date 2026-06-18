<script setup lang="ts">
import { getProductBySlug, getRelatedProducts, getBundleProducts, type Product } from '~/data/products'
import { categories } from '~/data/categories'

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

useSeo({
  title: categoryName.value
    ? `${product.name} | ${categoryName.value} | SLICKLY`
    : `${product.name} | SLICKLY`,
  description: product.description,
  canonicalPath: `/produkty/${product.slug}`,
  image: product.image,
  type: 'product',
})

// Product + Offer + AggregateRating + Review structured data, plus the
// breadcrumb trail (Domov > Obchod > Kategória > Produkt).
useProductJsonLd(product)
useBreadcrumbJsonLd([
  { name: 'Domov', path: '/' },
  { name: 'Obchod', path: '/produkty' },
  ...(categoryName.value
    ? [{ name: categoryName.value, path: `/produkty?kategoria=${product.category}` }]
    : []),
  { name: product.name, path: `/produkty/${product.slug}` },
])

const cart = useCartStore()
const { formatPrice } = useCurrency()
const toast = useToast()
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
  toast.show(`${product.name} — pridané do košíka (${quantity.value}×)`, 'shopping_bag')
  setTimeout(() => (justAdded.value = false), 1500)
}

const formattedPrice = computed(() => formatPrice(product!.price))
const formattedOldPrice = computed(() => (product!.oldPrice ? formatPrice(product!.oldPrice) : null))

// ── Gallery lightbox ──
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const zoomed = ref(false)
const zoomPos = ref({ x: 50, y: 50 })
const lightboxRef = ref<HTMLElement | null>(null)
let previouslyFocused: HTMLElement | null = null

let scrollLockY = 0
function openLightbox(idx: number) {
  lightboxIndex.value = idx
  lightboxOpen.value = true
  zoomed.value = false
  previouslyFocused = document.activeElement as HTMLElement
  scrollLockY = window.scrollY
  document.body.classList.add('overflow-locked')
  document.body.style.top = `-${scrollLockY}px`
  window.addEventListener('keydown', onLightboxKeydown)
  nextTick(() => lightboxRef.value?.focus())
}

function closeLightbox() {
  lightboxOpen.value = false
  zoomed.value = false
  window.removeEventListener('keydown', onLightboxKeydown)
  document.body.classList.remove('overflow-locked')
  document.body.style.top = ''
  window.scrollTo(0, scrollLockY)
  previouslyFocused?.focus()
}

function lightboxPrev() {
  zoomed.value = false
  lightboxIndex.value = (lightboxIndex.value - 1 + product.gallery.length) % product.gallery.length
}

function lightboxNext() {
  zoomed.value = false
  lightboxIndex.value = (lightboxIndex.value + 1) % product.gallery.length
}

function toggleZoom(e: MouseEvent) {
  zoomed.value = !zoomed.value
  if (zoomed.value) updateZoomPos(e)
}

function updateZoomPos(e: MouseEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  zoomPos.value = {
    x: ((e.clientX - rect.left) / rect.width) * 100,
    y: ((e.clientY - rect.top) / rect.height) * 100,
  }
}

// Touch swipe support
let touchStartX = 0
let touchStartY = 0
function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}
function onTouchEnd(e: TouchEvent) {
  if (zoomed.value) return
  const dx = e.changedTouches[0].clientX - touchStartX
  const dy = e.changedTouches[0].clientY - touchStartY
  if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return
  if (dx > 0) lightboxPrev()
  else lightboxNext()
}

// Focus trap inside lightbox
function onLightboxKeydown(e: KeyboardEvent) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  else if (e.key === 'ArrowLeft') lightboxPrev()
  else if (e.key === 'ArrowRight') lightboxNext()
  else if (e.key === 'Tab') {
    const focusable = lightboxRef.value?.querySelectorAll<HTMLElement>('button, [tabindex="0"]')
    if (!focusable?.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onLightboxKeydown)
  document.body.classList.remove('overflow-locked')
  document.body.style.top = ''
})
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
        <button
          type="button"
          class="relative aspect-square bg-surface-container-lowest border border-grid-line overflow-hidden cursor-zoom-in group/gallery"
          aria-label="Zväčšiť obrázok"
          @click="openLightbox(product.gallery.indexOf(activeImage))"
        >
          <span class="absolute top-3 left-3 z-10 font-technical-data text-technical-data text-on-surface-variant bg-surface-container-lowest/90 px-1.5 py-0.5 rounded-xs">{{ product.sku }}</span>
          <span
            v-if="product.badge"
            class="absolute bottom-0 left-0 bg-secondary-container text-on-background text-badge-label font-badge-label px-2 py-1 uppercase z-10"
          >
            {{ product.badge }}
          </span>
          <img
            :src="activeImage"
            :alt="categoryName ? `${product.name} – ${categoryName}` : product.name"
            fetchpriority="high"
            class="w-full h-full object-cover transition-transform duration-500 group-hover/gallery:scale-105"
          />
          <span class="absolute bottom-3 right-3 z-10 w-10 h-10 bg-surface-container-lowest/90 flex items-center justify-center rounded-full text-on-surface-variant opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-200">
            <span class="material-symbols-outlined text-[20px]" aria-hidden="true">zoom_in</span>
          </span>
        </button>
        <div v-if="product.gallery.length > 1" class="flex gap-stack-sm overflow-x-auto hide-scrollbar" role="group" aria-label="Galéria produktu">
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
          <p class="font-technical-data text-technical-data text-secondary uppercase mb-stack-xs">
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
            class="flex-grow h-12 font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-[background-color,transform] duration-200 active:scale-[0.99] hover:bg-primary/85 disabled:opacity-30 disabled:cursor-not-allowed rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            :class="justAdded ? 'bg-[#2e7d32] text-white cart-success' : 'bg-primary text-on-primary'"
            @click="addToCart"
          >
            <span class="material-symbols-outlined" aria-hidden="true">{{ justAdded ? 'check' : 'add_shopping_cart' }}</span>
            {{ justAdded ? 'Pridané do košíka' : 'Pridať do košíka' }}
          </button>
        </div>
        <span class="sr-only" role="status">{{ justAdded ? 'Produkt bol pridaný do košíka' : '' }}</span>

        <!-- Express checkout -->
        <div v-if="product.inStock" class="flex flex-col gap-stack-xs">
          <p class="font-technical-data text-technical-data uppercase text-on-surface-variant text-center tracking-widest">Alebo kúpte rýchlo cez</p>
          <div class="flex gap-stack-sm">
            <button
              type="button"
              class="flex-1 h-12 bg-[#000000] text-white font-body-md text-body-md flex items-center justify-center gap-2 rounded-default cursor-pointer transition-opacity duration-200 hover:opacity-85 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Kúpiť cez Apple Pay"
            >
              <svg class="h-5 w-auto" viewBox="0 0 165.521 40" fill="currentColor" aria-hidden="true"><path d="M150.698 0h-46.903c-.565 0-1.127.003-1.694.009-.478.005-.953.017-1.432.046-.94.056-1.878.178-2.796.427a8.938 8.938 0 00-2.563 1.162 9.08 9.08 0 00-2.125 1.943 8.965 8.965 0 00-1.398 2.497c-.296.88-.447 1.78-.516 2.696-.04.478-.051.958-.059 1.438-.007.574-.01 1.15-.01 1.723v18.117c0 .574.003 1.147.01 1.722.008.479.019.96.059 1.437.069.917.22 1.818.516 2.697.298.882.71 1.723 1.398 2.496a9.035 9.035 0 002.125 1.943 8.95 8.95 0 002.563 1.162c.918.249 1.856.372 2.796.427.479.029.954.04 1.432.046.567.006 1.129.009 1.694.009h46.903c.564 0 1.13-.003 1.69-.009.48-.006.958-.017 1.436-.046.94-.055 1.877-.178 2.795-.427a8.936 8.936 0 002.565-1.162 9.088 9.088 0 002.124-1.943 8.985 8.985 0 001.398-2.496c.296-.879.449-1.78.517-2.697.038-.477.049-.958.057-1.437.01-.575.01-1.148.01-1.722V11.94c0-.573 0-1.149-.01-1.723-.008-.48-.019-.96-.057-1.438-.068-.916-.221-1.816-.517-2.696a8.95 8.95 0 00-1.398-2.497 9.071 9.071 0 00-2.124-1.943 8.917 8.917 0 00-2.565-1.162c-.918-.249-1.855-.371-2.795-.427a69.57 69.57 0 00-1.436-.046C151.828.003 151.262 0 150.698 0z"/><path fill="#000" d="M150.698 1.532l1.672.009c.46.005.917.016 1.376.043.792.048 1.553.145 2.298.347a7.43 7.43 0 012.128.966 7.542 7.542 0 011.767 1.615 7.451 7.451 0 011.16 2.074c.253.754.387 1.528.443 2.34.034.458.045.92.052 1.394.009.568.009 1.136.009 1.707v18.032c0 .572 0 1.137-.009 1.709-.007.47-.018.933-.052 1.39-.056.815-.19 1.589-.443 2.342a7.462 7.462 0 01-1.16 2.073 7.579 7.579 0 01-1.767 1.616 7.414 7.414 0 01-2.128.967c-.747.202-1.506.298-2.298.346-.46.028-.918.039-1.382.044-.56.006-1.12.009-1.678.009h-46.903c-.553 0-1.113-.003-1.667-.009-.466-.005-.926-.016-1.389-.044-.792-.048-1.552-.144-2.298-.346a7.379 7.379 0 01-2.128-.967 7.55 7.55 0 01-1.768-1.616 7.433 7.433 0 01-1.159-2.073c-.253-.753-.389-1.527-.444-2.342-.034-.459-.046-.922-.053-1.396-.007-.567-.009-1.132-.009-1.703V11.97c0-.57.002-1.133.009-1.7.007-.476.019-.94.053-1.4.055-.814.191-1.587.444-2.341a7.422 7.422 0 011.159-2.074 7.513 7.513 0 011.768-1.615 7.426 7.426 0 012.128-.966c.746-.202 1.506-.299 2.298-.347.463-.027.923-.038 1.389-.043l1.667-.009h46.903"/><path fill="#FFF" d="M43.508 26.132a5.025 5.025 0 01-2.697-4.477c0-1.873.95-3.52 2.396-4.402-.912-1.34-2.347-2.18-3.984-2.209-1.676-.174-3.304 1.003-4.16 1.003-.87 0-2.186-.988-3.605-.958a5.31 5.31 0 00-4.47 2.72c-1.932 3.348-.491 8.269 1.361 10.976.929 1.325 2.016 2.805 3.434 2.753 1.39-.058 1.91-.885 3.588-.885 1.665 0 2.147.885 3.591.852 1.49-.024 2.432-1.332 3.33-2.67a10.962 10.962 0 001.517-3.088 4.85 4.85 0 01-2.901-2.615zm-2.7-12.93c.78-.96 1.312-2.27 1.166-3.597-1.13.048-2.512.765-3.319 1.71-.72.842-1.362 2.204-1.196 3.497 1.266.098 2.56-.64 3.349-1.61zM65.084 31.674h-2.54l-1.39-4.373h-4.832l-1.327 4.373H52.5l4.787-14.88h2.956l4.841 14.88zm-4.357-6.213l-1.391-4.29c-.147-.44-.423-1.477-.829-3.107h-.046c-.163.69-.424 1.727-.782 3.107l-1.373 4.29h4.421zM79.382 26.34c0 1.773-.48 3.169-1.437 4.19-.863.917-1.935 1.374-3.212 1.374-1.38 0-2.373-.495-2.977-1.486h-.044v5.513h-2.44V24.675c0-1.115-.029-2.259-.089-3.433h2.148l.135 1.652h.044c.775-1.245 1.946-1.867 3.509-1.867 1.234 0 2.263.49 3.086 1.472.827.982 1.237 2.276 1.237 3.882l.04-.041zm-2.498.073c0-1.024-.231-1.867-.697-2.53-.508-.694-1.19-1.04-2.046-1.04-.58 0-1.107.194-1.584.577a2.867 2.867 0 00-.973 1.522c-.08.31-.12.565-.12.765v1.752c0 .764.235 1.41.705 1.938.47.528 1.078.792 1.822.792.887 0 1.578-.343 2.073-1.029.496-.685.744-1.587.744-2.708l.076-.039zM93.655 26.34c0 1.773-.48 3.169-1.438 4.19-.862.917-1.934 1.374-3.21 1.374-1.38 0-2.374-.495-2.978-1.486h-.044v5.513h-2.44V24.675c0-1.115-.03-2.259-.09-3.433h2.148l.135 1.652h.045c.775-1.245 1.945-1.867 3.508-1.867 1.233 0 2.263.49 3.086 1.472.826.982 1.237 2.276 1.237 3.882l.04-.041zm-2.498.073c0-1.024-.232-1.867-.698-2.53-.507-.694-1.19-1.04-2.045-1.04-.58 0-1.109.194-1.585.577a2.87 2.87 0 00-.973 1.522 2.86 2.86 0 00-.12.765v1.752c0 .764.236 1.41.706 1.938.47.527 1.077.792 1.822.792.887 0 1.578-.343 2.073-1.029.496-.685.744-1.587.744-2.708l.076-.039zM109.08 27.633c0 1.23-.427 2.231-1.284 3.003-.94.848-2.253 1.272-3.933 1.272-1.554 0-2.802-.299-3.741-.896l.535-2.032c1.015.605 2.13.909 3.343.909.887 0 1.578-.2 2.073-.603.495-.4.742-.94.742-1.617 0-.602-.204-1.107-.614-1.516-.406-.408-1.078-.789-2.013-1.141-2.557-.952-3.834-2.345-3.834-4.176 0-1.19.44-2.165 1.32-2.924.878-.76 2.05-1.14 3.512-1.14 1.303 0 2.387.228 3.253.683l-.58 1.99c-.81-.44-1.726-.662-2.747-.662-.83 0-1.479.204-1.945.61-.392.364-.588.808-.588 1.332 0 .586.222 1.074.667 1.461.391.36 1.098.744 2.122 1.154 1.262.497 2.2 1.077 2.81 1.74.613.661.918 1.487.918 2.477l-.062-.028zM118.94 22.983h-2.682v5.063c0 1.286.45 1.93 1.348 1.93.414 0 .758-.035 1.03-.108l.064 1.85c-.513.193-1.186.29-2.018.29-1.024 0-1.824-.312-2.399-.938-.576-.625-.863-1.676-.863-3.152v-4.935h-1.599v-1.828h1.599v-2.01l2.393-.722v2.732h2.682l-.555 1.828z"/><path fill="#FFF" d="M132.633 26.393c0 1.62-.467 2.95-1.399 3.992-.978 1.073-2.278 1.608-3.902 1.608-1.565 0-2.812-.512-3.74-1.537-.929-1.024-1.393-2.318-1.393-3.88 0-1.636.48-2.975 1.44-4.017.96-1.043 2.246-1.564 3.858-1.564 1.565 0 2.824.511 3.772 1.536.907 1.002 1.364 2.287 1.364 3.862zm-2.507.09c0-.976-.213-1.813-.639-2.512-.498-.837-1.207-1.256-2.125-1.256-.954 0-1.675.419-2.165 1.256-.427.699-.639 1.55-.639 2.556 0 .976.212 1.813.639 2.512.51.837 1.222 1.256 2.139 1.256.903 0 1.613-.427 2.133-1.282.436-.714.657-1.558.657-2.53zM143.468 23.29a4.382 4.382 0 00-.774-.065c-.831 0-1.474.314-1.927.945-.397.564-.596 1.277-.596 2.14v5.364h-2.438l.02-7.004c0-1.18-.03-2.255-.09-3.227h2.126l.088 1.956h.066c.252-.672.644-1.213 1.18-1.622a2.842 2.842 0 011.69-.557c.228 0 .434.015.616.044v2.026h.039zM155.983 25.962a8.033 8.033 0 01-.087 1.268h-7.314c.028 1.018.358 1.797.993 2.334.574.474 1.32.712 2.233.712a7.6 7.6 0 002.81-.505l.362 1.693c-.99.44-2.157.66-3.505.66-1.62 0-2.896-.476-3.824-1.429-.928-.952-1.392-2.231-1.392-3.836 0-1.573.432-2.884 1.297-3.93.906-1.118 2.131-1.677 3.675-1.677 1.515 0 2.663.559 3.443 1.677.618.886.927 1.982.927 3.285l-.618-.252zm-2.323-.727c.02-.678-.133-1.264-.454-1.76-.412-.637-.044-1.057-1.677-1.057-.599 0-1.102.21-1.509.627-.333.358-.531.83-.596 1.418l4.236-.228z"/></svg>
            </button>
            <button
              type="button"
              class="flex-1 h-12 bg-white text-[#3C4043] border border-[#dadce0] font-body-md text-body-md flex items-center justify-center gap-2 rounded-default cursor-pointer transition-opacity duration-200 hover:bg-[#f8f9fa] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Kúpiť cez Google Pay"
            >
              <svg class="h-5 w-auto" viewBox="0 0 435 174" fill="none" aria-hidden="true"><path d="M206.2 84.58v50.75h-16.1V10h42.7a38.61 38.61 0 0127.58 10.87 34.85 34.85 0 0111.42 26.45 35.13 35.13 0 01-11.42 26.72l-.28.28A38.04 38.04 0 01232.8 85h-26.6v-.42zm0-59.17v43.07h27.03a22.22 22.22 0 0016.52-6.85 22.43 22.43 0 000-29.24 21.38 21.38 0 00-16.38-6.98H206.2z" fill="#3C4043"/><path d="M289.6 50.25c11.97 0 21.38 3.22 28.22 9.65 6.85 6.44 10.28 15.26 10.28 26.18v52.95h-15.4v-11.97h-.7c-6.72 9.94-15.54 14.91-26.6 14.91-9.38 0-17.26-2.8-23.55-8.4a26.96 26.96 0 01-9.52-21.1c0-8.96 3.36-16.04 10.08-21.24 6.72-5.18 15.68-7.84 26.88-7.84 9.52 0 17.36 1.75 23.52 5.25v-3.64c0-6.3-2.52-11.62-7.56-15.96a25.04 25.04 0 00-17.08-6.58c-9.66 0-17.36 4.06-23.1 12.18l-14.14-8.96c8.26-12.04 20.44-18.06 36.54-18.06l.02.62zm-20.72 66.92a18.34 18.34 0 007.28 14.77 24.55 24.55 0 0015.54 5.46c8.4 0 15.82-3.08 22.26-9.24 6.44-6.16 9.66-13.44 9.66-21.84-5.04-3.92-12.04-5.88-21-5.88-6.58 0-12.04 1.61-16.38 4.83-4.48 3.36-6.72 7.42-6.72 12.18l-.64-.28z" fill="#3C4043"/><path d="M412.3 53.19l-53.76 123.62h-16.52l19.88-43.61-35.28-80.01h17.36l25.34 61.04h.42l24.64-61.04h17.92z" fill="#3C4043"/><path d="M142.06 73.47c0-4.83-.42-9.52-1.12-14.07H73.22v26.32h38.78a33.3 33.3 0 01-14.35 21.84v17.78h23.1c13.58-12.46 21.31-30.94 21.31-51.87z" fill="#4285F4"/><path d="M73.22 142.28c19.32 0 35.56-6.3 47.46-17.22l-23.1-17.78c-6.44 4.34-14.63 6.86-24.36 6.86-18.62 0-34.44-12.6-40.04-29.52H9.38v18.34a71.65 71.65 0 0063.84 39.32z" fill="#34A853"/><path d="M33.18 84.62a43.48 43.48 0 010-27.72V38.56H9.38a71.81 71.81 0 000 64.4l23.8-18.34z" fill="#FBBC04"/><path d="M73.22 27.24c10.5 0 19.88 3.64 27.3 10.64l20.3-20.3C108.64 6.58 92.54 0 73.22 0 45.08 0 20.72 14.49 9.38 35.56l23.8 18.34c5.6-16.92 21.42-26.66 40.04-26.66z" fill="#EA4335"/></svg>
            </button>
          </div>
        </div>

        <!-- Trust micro-info -->
        <div class="grid grid-cols-2 gap-stack-sm mt-stack-md md:mt-6 pt-stack-md border-t border-grid-line">
          <div class="flex items-center gap-2 text-on-surface-variant">
            <span class="material-symbols-outlined text-[20px]" aria-hidden="true">local_shipping</span>
            <span class="font-technical-data text-technical-data uppercase">Doprava zdarma</span>
          </div>
          <div class="flex items-center gap-2 text-on-surface-variant">
            <span class="material-symbols-outlined text-[20px]" aria-hidden="true">shield</span>
            <span class="font-technical-data text-technical-data uppercase">Overená kvalita</span>
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

    <!-- Podobné produkty -->
    <section v-if="related.length" class="mt-stack-lg md:mt-section-padding-lg">
      <h2 class="font-headline-md text-headline-md md:text-headline-lg uppercase tracking-tight border-b border-grid-line pb-stack-sm md:pb-6 mb-stack-md md:mb-8">
        Podobné produkty
      </h2>
      <ProductCarousel :products="related" />
    </section>

    <!-- Naposledy prezerané -->
    <section v-if="recentlyViewedProducts.length" class="mt-stack-lg md:mt-section-padding-lg">
      <h2 class="font-headline-md text-headline-md md:text-headline-lg uppercase tracking-tight border-b border-grid-line pb-stack-sm md:pb-6 mb-stack-md md:mb-8">
        Naposledy prezerané
      </h2>
      <ProductCarousel :products="recentlyViewedProducts" />
    </section>

    <!-- Gallery lightbox -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200 ease-out motion-reduce:duration-0"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150 ease-in motion-reduce:duration-0"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="lightboxOpen"
          ref="lightboxRef"
          tabindex="-1"
          class="fixed inset-0 z-[80] bg-on-background/95 flex flex-col outline-none"
          role="dialog"
          aria-modal="true"
          aria-label="Galéria produktu"
          @touchstart.passive="onTouchStart"
          @touchend="onTouchEnd"
        >
          <!-- Top bar -->
          <div class="flex items-center justify-between px-4 md:px-8 h-16 shrink-0">
            <span class="font-technical-data text-technical-data text-white/60 uppercase" aria-live="polite">
              {{ lightboxIndex + 1 }} / {{ product.gallery.length }}
            </span>
            <button
              type="button"
              aria-label="Zavrieť galériu"
              class="min-w-11 min-h-11 flex items-center justify-center text-white/60 hover:text-white cursor-pointer transition-colors duration-200 [touch-action:manipulation] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              @click="closeLightbox"
            >
              <span class="material-symbols-outlined" aria-hidden="true">close</span>
            </button>
          </div>

          <!-- Main image area -->
          <div class="flex-grow flex items-center justify-center relative overflow-hidden min-h-0 px-4 md:px-20">
            <!-- Prev arrow -->
            <button
              v-if="product.gallery.length > 1"
              type="button"
              aria-label="Predchádzajúci obrázok"
              class="absolute left-2 md:left-6 z-10 min-w-11 min-h-11 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white cursor-pointer transition-colors duration-200 [touch-action:manipulation] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              @click="lightboxPrev"
            >
              <span class="material-symbols-outlined" aria-hidden="true">chevron_left</span>
            </button>

            <!-- Image -->
            <div
              class="max-w-full max-h-full aspect-square md:aspect-auto md:max-w-[80vh] flex items-center justify-center [touch-action:manipulation]"
              :class="zoomed ? 'cursor-zoom-out overflow-auto' : 'cursor-zoom-in'"
              @click="toggleZoom"
              @mousemove="zoomed && updateZoomPos($event)"
            >
              <img
                :src="product.gallery[lightboxIndex]"
                :alt="`${product.name} – obrázok ${lightboxIndex + 1}`"
                class="select-none transition-transform duration-300 motion-reduce:duration-0"
                :class="zoomed ? 'scale-[2.5]' : 'max-w-full max-h-[calc(100dvh-12rem)] object-contain'"
                :style="zoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}"
                draggable="false"
              />
            </div>

            <!-- Next arrow -->
            <button
              v-if="product.gallery.length > 1"
              type="button"
              aria-label="Ďalší obrázok"
              class="absolute right-2 md:right-6 z-10 min-w-11 min-h-11 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white cursor-pointer transition-colors duration-200 [touch-action:manipulation] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              @click="lightboxNext"
            >
              <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
            </button>
          </div>

          <!-- Thumbnail strip -->
          <div v-if="product.gallery.length > 1" class="flex justify-center gap-3 px-4 py-4 shrink-0 overflow-x-auto hide-scrollbar">
            <button
              v-for="(img, idx) in product.gallery"
              :key="idx"
              type="button"
              class="w-16 h-16 md:w-20 md:h-20 border-2 overflow-hidden shrink-0 cursor-pointer transition-[border-color,opacity] duration-200 [touch-action:manipulation] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              :class="lightboxIndex === idx ? 'border-white opacity-100' : 'border-transparent opacity-40 hover:opacity-70'"
              :aria-label="`Zobraziť obrázok ${idx + 1}`"
              @click="lightboxIndex = idx; zoomed = false"
            >
              <img :src="img" :alt="`${product.name} – ${idx + 1}`" loading="lazy" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
