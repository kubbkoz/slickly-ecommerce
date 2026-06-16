<script setup lang="ts">
const cart = useCartStore()
const { formatPrice } = useCurrency()

const closeBtn = ref<HTMLButtonElement | null>(null)
let previouslyFocused: HTMLElement | null = null

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && cart.isDrawerOpen) cart.closeDrawer()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

watch(() => cart.isDrawerOpen, (open) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) {
    previouslyFocused = document.activeElement as HTMLElement
    nextTick(() => closeBtn.value?.focus())
  } else {
    previouslyFocused?.focus()
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
        class="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-background flex flex-col shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Košík"
      >
        <div class="flex items-center justify-between px-stack-md md:px-6 h-16 border-b border-grid-line shrink-0">
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

        <div v-if="cart.items.length" class="flex-grow overflow-y-auto overscroll-y-contain divide-y divide-grid-line px-stack-md md:px-6">
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

        <div v-else class="flex-grow flex flex-col items-center justify-center gap-stack-md text-center px-stack-md">
          <span class="material-symbols-outlined text-[56px] text-on-surface-variant opacity-30" aria-hidden="true">shopping_bag</span>
          <p class="font-body-md text-body-md text-on-surface-variant">Váš košík je prázdny</p>
        </div>

        <div v-if="cart.items.length" class="border-t border-grid-line px-stack-md md:px-6 py-stack-md flex flex-col gap-stack-sm shrink-0">
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
            class="h-12 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.99] hover:bg-primary/85 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
