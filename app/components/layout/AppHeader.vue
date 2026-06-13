<script setup lang="ts">
import { categories } from '~/data/products'

const cart = useCartStore()
const search = useSearchStore()
const wishlist = useWishlistStore()
const isMenuOpen = ref(false)
const router = useRouter()
const desktopSearchInput = ref<HTMLInputElement | null>(null)
const hamburgerBtn = ref<HTMLElement | null>(null)
const menuCloseBtn = ref<HTMLElement | null>(null)

const navLinks = [
  { label: 'Obchod', to: '/produkty' },
  { label: 'Výskum', to: '/#umenie-cistoty' },
  { label: 'Laboratórium', to: '/#preco-slickly' },
]

const { results, recommended, featured } = useSearchSuggestions(computed(() => search.query))

function submitSearch() {
  const q = search.query.trim()
  if (!q) return
  router.push({ path: '/produkty', query: { q } })
  search.close()
}

watch(
  () => search.isOpen,
  (open) => {
    if (open) nextTick(() => desktopSearchInput.value?.focus())
  },
)

watch(
  () => useRoute().fullPath,
  () => {
    isMenuOpen.value = false
    cart.closeDrawer()
    search.close()
  },
)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    search.close()
    cart.closeDrawer()
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isMenuOpen.value) isMenuOpen.value = false
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

watch(isMenuOpen, (open) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) {
    nextTick(() => menuCloseBtn.value?.focus())
  } else {
    hamburgerBtn.value?.focus()
  }
})
</script>

<template>
  <header class="w-full">
    <!-- Mobile top bar -->
    <div
      class="md:hidden fixed top-0 left-0 right-0 z-50 bg-primary text-on-primary flex items-center justify-between px-gutter h-16 border-b border-outline-variant"
    >
      <div class="flex items-center gap-stack-md">
        <button
          ref="hamburgerBtn"
          aria-label="Menu"
          aria-haspopup="dialog"
          :aria-expanded="isMenuOpen"
          class="material-symbols-outlined transition-opacity duration-200 active:scale-95 cursor-pointer"
          @click="toggleMenu"
        >
          {{ isMenuOpen ? 'close' : 'menu' }}
        </button>
        <NuxtLink to="/" class="font-headline-md text-headline-md font-extrabold tracking-tighter">
          SL<span class="logo-i">I</span>CKLY
        </NuxtLink>
      </div>
      <div class="flex items-center gap-stack-md">
        <button type="button" aria-label="Hľadať" class="cursor-pointer" @click="search.open()">
          <span class="material-symbols-outlined transition-opacity duration-200 active:scale-95 cursor-pointer" aria-hidden="true">search</span>
        </button>
        <button type="button" aria-label="Košík" class="relative cursor-pointer" @click="cart.toggleDrawer()">
          <span class="material-symbols-outlined transition-opacity duration-200 active:scale-95 cursor-pointer">shopping_bag</span>
          <span
            v-if="cart.itemCount > 0"
            class="absolute -top-1.5 -right-2 bg-secondary-container text-on-secondary-container text-[10px] font-bold leading-none rounded-full min-w-[16px] h-4 flex items-center justify-center px-1"
          >
            {{ cart.itemCount }}
          </span>
        </button>
      </div>
    </div>

    <!-- Mobile fullscreen menu overlay -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isMenuOpen"
          class="md:hidden fixed inset-0 z-[80] bg-background flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div class="flex items-center justify-between px-gutter h-16 border-b border-grid-line shrink-0">
            <NuxtLink to="/" class="font-headline-md text-headline-md font-extrabold tracking-tighter text-on-background" @click="isMenuOpen = false">
              SL<span class="logo-i">I</span>CKLY
            </NuxtLink>
            <button
              ref="menuCloseBtn"
              type="button"
              aria-label="Zavrieť menu"
              class="min-w-11 min-h-11 -mr-2 flex items-center justify-center text-on-surface-variant hover:text-on-background cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-default"
              @click="isMenuOpen = false"
            >
              <span class="material-symbols-outlined" aria-hidden="true">close</span>
            </button>
          </div>

          <nav class="flex-grow overflow-y-auto px-gutter py-stack-lg flex flex-col">
            <NuxtLink to="/" class="font-headline-md text-headline-md uppercase tracking-tight text-on-background hover:text-primary py-stack-sm border-b border-grid-line rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              Domov
            </NuxtLink>
            <NuxtLink to="/produkty" class="font-headline-md text-headline-md uppercase tracking-tight text-on-background hover:text-primary py-stack-sm border-b border-grid-line rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              Všetky produkty
            </NuxtLink>
            <NuxtLink
              v-for="category in categories"
              :key="category.slug"
              :to="`/produkty?kategoria=${category.slug}`"
              class="font-headline-sm text-headline-sm uppercase tracking-tight text-on-surface-variant hover:text-primary py-stack-sm border-b border-grid-line rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {{ category.name }}
            </NuxtLink>

            <div class="flex flex-col gap-stack-md mt-stack-lg">
              <NuxtLink
                v-for="link in navLinks"
                :key="link.label"
                :to="link.to"
                class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {{ link.label }}
              </NuxtLink>
            </div>
          </nav>

          <div class="border-t border-grid-line px-gutter py-stack-md flex flex-col gap-stack-md shrink-0">
            <LocaleSwitcher variant="light" drop-direction="up" />
            <div class="grid grid-cols-3 gap-stack-sm">
              <NuxtLink
                to="/oblubene"
                class="flex flex-col items-center gap-1 py-stack-sm text-on-surface-variant hover:text-primary transition-colors duration-200 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span class="material-symbols-outlined" aria-hidden="true">favorite</span>
                <span class="font-technical-data text-technical-data uppercase">Obľúbené</span>
              </NuxtLink>
              <NuxtLink
                to="/ucet"
                class="flex flex-col items-center gap-1 py-stack-sm text-on-surface-variant hover:text-primary transition-colors duration-200 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span class="material-symbols-outlined" aria-hidden="true">person</span>
                <span class="font-technical-data text-technical-data uppercase">Účet</span>
              </NuxtLink>
              <button
                type="button"
                class="flex flex-col items-center gap-1 py-stack-sm text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                @click="isMenuOpen = false; cart.toggleDrawer()"
              >
                <span class="material-symbols-outlined" aria-hidden="true">shopping_bag</span>
                <span class="font-technical-data text-technical-data uppercase">Košík</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Desktop bar -->
    <div class="hidden md:block w-full pt-4 pb-2 px-grid-margin bg-surface-container-lowest sticky top-0 z-50">
      <div class="bg-primary border-none max-w-[1536px] mx-auto px-6 py-4 flex justify-between items-center shadow-sm rounded-default relative">
        <template v-if="!search.isOpen">
          <NuxtLink
            to="/"
            class="font-headline-md text-headline-sm font-bold tracking-tighter text-white hover:opacity-90 transition-opacity duration-150"
          >
            SLICKL<span class="logo-dot">Y</span>
          </NuxtLink>
          <nav class="flex items-center gap-8 order-1">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.label"
              :to="link.to"
              class="font-label-sm text-label-sm text-white/70 hover:text-white transition-colors duration-150 uppercase"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>
          <div class="flex-grow max-w-xl px-12 order-2">
            <button
              type="button"
              class="relative w-full text-left cursor-pointer rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-container"
              @click="search.open()"
            >
              <span class="block w-full bg-white text-black/40 font-label-sm text-label-sm px-4 py-2 rounded-default uppercase">VYHĽADAŤ PRODUKT...</span>
              <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-black/40" aria-hidden="true">search</span>
            </button>
          </div>
          <div class="flex items-center gap-6 order-3">
            <LocaleSwitcher variant="dark" />
            <NuxtLink
              to="/oblubene"
              class="text-white hover:text-secondary-container transition-colors duration-150 relative cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-container rounded-default"
              aria-label="Obľúbené"
            >
              <span class="material-symbols-outlined text-[22px]" aria-hidden="true">favorite</span>
              <span
                v-if="wishlist.count > 0"
                class="absolute -top-1 -right-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold px-1 rounded-full min-w-[16px] text-center"
              >
                {{ wishlist.count }}
              </span>
            </NuxtLink>
            <NuxtLink to="/ucet" class="text-white hover:text-secondary-container transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-container rounded-default" aria-label="Účet">
              <span class="material-symbols-outlined text-[22px]" aria-hidden="true">person</span>
            </NuxtLink>
            <button
              type="button"
              class="text-white hover:text-secondary-container transition-colors duration-150 relative cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-container rounded-default"
              aria-label="Košík"
              @click="cart.toggleDrawer()"
            >
              <span class="material-symbols-outlined text-[22px]" aria-hidden="true">shopping_cart</span>
              <span
                class="absolute -top-1 -right-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold px-1 rounded-full min-w-[16px] text-center"
              >
                {{ cart.itemCount }}
              </span>
            </button>
          </div>
        </template>

        <form v-else role="search" class="w-full flex items-center gap-stack-sm" @submit.prevent="submitSearch">
          <span class="material-symbols-outlined text-white" aria-hidden="true">search</span>
          <input
            ref="desktopSearchInput"
            v-model="search.query"
            type="search"
            placeholder="VYHĽADAŤ PRODUKT, KATEGÓRIU..."
            class="flex-grow bg-transparent text-white placeholder:text-white/50 font-label-sm text-label-sm uppercase tracking-wider outline-none border-none"
          />
          <button
            type="button"
            aria-label="Zavrieť vyhľadávanie"
            class="min-w-11 min-h-11 flex items-center justify-center text-white hover:text-secondary-container cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-container rounded-default"
            @click="search.close()"
          >
            <span class="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </form>

        <div
          v-if="search.isOpen"
          class="absolute top-full left-0 right-0 mt-2 bg-background border border-grid-line shadow-xl rounded-default max-h-[70vh] overflow-y-auto p-6 z-50"
        >
          <SearchContent
            :query="search.query"
            :results="results"
            :recommended="recommended"
            :featured="featured"
            :categories="categories"
            @select="search.close()"
          />
        </div>
      </div>
    </div>
  </header>
</template>
