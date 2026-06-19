<script setup lang="ts">
import { getProductById, getRelatedProducts, type Product } from '~/data/products'
import { categories } from '~/data/categories'

const cart = useCartStore()
const { formatPrice } = useCurrency()

const closeBtn = ref<HTMLButtonElement | null>(null)
let previouslyFocused: HTMLElement | null = null

const upsellProducts = computed<Product[]>(() => {
  const cartIds = new Set(cart.items.map((i) => i.productId))
  const seen = new Set<string>()
  const result: Product[] = []
  for (const item of cart.items) {
    const product = getProductById(item.productId)
    if (!product) continue
    for (const rel of getRelatedProducts(product, 6)) {
      if (result.length >= 6) break
      if (cartIds.has(rel.id) || seen.has(rel.id)) continue
      if (!rel.inStock) continue
      seen.add(rel.id)
      result.push(rel)
    }
    if (result.length >= 6) break
  }
  return result
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') cart.closeDrawer()
}

let scrollY = 0
watch(() => cart.isDrawerOpen, (open) => {
  if (!import.meta.client) return
  if (open) {
    window.addEventListener('keydown', onKeydown)
    scrollY = window.scrollY
    document.body.classList.add('overflow-locked')
    document.body.style.top = `-${scrollY}px`
    previouslyFocused = document.activeElement as HTMLElement
    nextTick(() => closeBtn.value?.focus())
  } else {
    window.removeEventListener('keydown', onKeydown)
    document.body.classList.remove('overflow-locked')
    document.body.style.top = ''
    window.scrollTo(0, scrollY)
    previouslyFocused?.focus()
  }
})

onBeforeUnmount(() => {
  if (cart.isDrawerOpen) {
    window.removeEventListener('keydown', onKeydown)
    document.body.classList.remove('overflow-locked')
    document.body.style.top = ''
  }
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
</script>

<template>
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
        v-if="cart.isDrawerOpen"
        class="fixed inset-0 z-[60] bg-on-background/40"
        @click="cart.closeDrawer()"
      />
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <aside
        v-if="cart.isDrawerOpen"
        class="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-background flex flex-col shadow-xl safe-top"
        role="dialog"
        aria-modal="true"
        aria-label="Košík"
      >
        <div class="flex items-center justify-between px-stack-md md:px-6 h-16 border-b border-grid-line shrink-0" style="margin-top: env(safe-area-inset-top, 0px)">
          <h2 class="font-headline-sm text-headline-sm uppercase">Košík ({{ cart.itemCount }})</h2>
          <button
            ref="closeBtn"
            type="button"
            aria-label="Zavrieť košík"
            class="min-w-11 min-h-11 -mr-2 flex items-center justify-center text-on-surface-variant hover:text-on-background cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            @click="cart.closeDrawer()"
          >
            <span class="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </div>

        <div v-if="cart.items.length" class="flex-grow overflow-y-auto overscroll-y-contain px-stack-md md:px-6">
          <div class="divide-y divide-grid-line">
            <div v-for="item in cart.items" :key="item.productId" class="flex items-center gap-stack-sm py-stack-sm">
              <NuxtLink
                :to="`/produkty/${item.slug}`"
                class="w-16 h-16 shrink-0 bg-surface-container-lowest border border-grid-line overflow-hidden"
                @click="cart.closeDrawer()"
              >
                <img :src="item.image" :alt="item.name" loading="lazy" class="w-full h-full object-cover" />
              </NuxtLink>

              <div class="flex-grow min-w-0 flex flex-col gap-1">
                <NuxtLink
                  :to="`/produkty/${item.slug}`"
                  class="font-body-md text-body-md uppercase hover:text-primary truncate transition-colors duration-200"
                  @click="cart.closeDrawer()"
                >
                  {{ item.name }}
                </NuxtLink>
                <div class="flex items-center border border-outline-variant rounded-default w-fit" role="group" aria-label="Množstvo">
                  <button
                    type="button"
                    class="min-w-11 min-h-11 flex items-center justify-center text-on-surface-variant hover:text-on-background cursor-pointer transition-colors duration-200 [touch-action:manipulation] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    :aria-label="`Znížiť množstvo: ${item.name}`"
                    @click="decrement(item.productId, item.quantity)"
                  >
                    <span class="material-symbols-outlined text-[16px]" aria-hidden="true">remove</span>
                  </button>
                  <span class="w-7 text-center font-technical-data text-technical-data" aria-live="polite">{{ item.quantity }}</span>
                  <button
                    type="button"
                    class="min-w-11 min-h-11 flex items-center justify-center text-on-surface-variant hover:text-on-background cursor-pointer transition-colors duration-200 [touch-action:manipulation] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    :aria-label="`Zvýšiť množstvo: ${item.name}`"
                    @click="increment(item.productId, item.quantity)"
                  >
                    <span class="material-symbols-outlined text-[16px]" aria-hidden="true">add</span>
                  </button>
                </div>
              </div>

              <div class="flex flex-col items-end shrink-0">
                <span class="font-price-display text-price-display">{{ lineTotal(item.price, item.quantity) }}</span>
                <button
                  type="button"
                  class="min-w-11 min-h-11 -mr-2 flex items-center justify-center text-on-surface-variant hover:text-error cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
                  :aria-label="`Odstrániť položku: ${item.name}`"
                  @click="cart.removeItem(item.productId)"
                >
                  <span class="material-symbols-outlined text-[18px]" aria-hidden="true">delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Upsell section — stuck to bottom, grid on desktop -->
        <section v-if="cart.items.length && upsellProducts.length" class="shrink-0 border-t border-grid-line px-stack-md md:px-6 pt-stack-sm pb-stack-sm">
          <h3 class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-stack-sm">Odporúčame dokúpiť</h3>
          <div class="flex gap-stack-sm overflow-x-auto -mx-stack-md px-stack-md pb-2 snap-x snap-mandatory hide-scrollbar overscroll-x-contain [touch-action:pan-x] md:grid md:grid-cols-3 md:overflow-visible md:snap-none md:mx-0 md:px-0 md:pb-0 md:[touch-action:auto]">
            <CartUpsellCard v-for="(p, i) in upsellProducts" :key="p.id" :product="p" :class="{ 'md:hidden': i >= 3 }" />
          </div>
        </section>

        <div v-else class="flex-grow flex flex-col items-center justify-center text-center px-stack-md md:px-6 overflow-y-auto">
          <span class="material-symbols-outlined text-[72px] text-on-surface-variant opacity-20" aria-hidden="true">shopping_bag</span>
          <h3 class="font-headline-md text-headline-md uppercase mt-stack-md">Váš košík je prázdny</h3>
          <p class="font-body-md text-body-md text-on-surface-variant mt-stack-xs max-w-xs">
            Preskúmajte naše kategórie a nájdite prémiové produkty pre vaše vozidlo.
          </p>

          <div class="grid grid-cols-2 gap-stack-sm w-full mt-stack-lg">
            <NuxtLink
              v-for="cat in categories"
              :key="cat.slug"
              :to="`/produkty?kategoria=${cat.slug}`"
              class="group flex flex-col items-center gap-2 p-stack-sm border border-grid-line rounded-default cursor-pointer transition-colors duration-200 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              @click="cart.closeDrawer()"
            >
              <div class="w-12 h-12 rounded-full overflow-hidden bg-surface-container border border-grid-line">
                <img :src="cat.image" :alt="cat.name" loading="lazy" class="w-full h-full object-cover" />
              </div>
              <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant group-hover:text-on-background transition-colors duration-200">{{ cat.name }}</span>
            </NuxtLink>
          </div>

          <NuxtLink
            to="/produkty?akcia=1"
            class="mt-stack-md h-11 px-6 w-full border border-secondary-container bg-secondary-container/20 text-on-background font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200 hover:bg-secondary-container/40 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            @click="cart.closeDrawer()"
          >
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">local_offer</span>
            Akciové ponuky
          </NuxtLink>

          <NuxtLink
            to="/produkty"
            class="mt-stack-sm h-11 px-6 w-full bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-[background-color,transform] duration-200 active:scale-[0.99] hover:bg-primary/85 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            @click="cart.closeDrawer()"
          >
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">storefront</span>
            Prejsť do obchodu
          </NuxtLink>
        </div>

        <div v-if="cart.items.length" class="border-t border-grid-line px-stack-md md:px-6 pt-stack-md pb-stack-lg flex flex-col gap-stack-sm shrink-0 safe-bottom">
          <div class="flex justify-between items-baseline">
            <span class="font-body-md text-body-md text-on-surface-variant">Medzisúčet</span>
            <span class="font-price-display text-headline-sm text-on-background">{{ formattedSubtotal }}</span>
          </div>
          <NuxtLink
            to="/kosik"
            class="h-12 border border-outline-variant text-on-background font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200 hover:border-primary rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            @click="cart.closeDrawer()"
          >
            Zobraziť košík
          </NuxtLink>
          <NuxtLink
            to="/pokladna"
            class="h-12 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-[background-color,transform] duration-200 active:scale-[0.99] hover:bg-primary/85 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            @click="cart.closeDrawer()"
          >
            <span class="material-symbols-outlined" aria-hidden="true">lock</span>
            Pokladňa
          </NuxtLink>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>
