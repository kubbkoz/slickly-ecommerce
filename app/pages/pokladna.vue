<script setup lang="ts">
import { products as allProducts } from '~/data/products'

const cart = useCartStore()
const router = useRouter()
const { formatPrice } = useCurrency()

useSeo({
  title: 'Pokladňa | SLICKLY',
  description: 'Dokončite svoju objednávku SLICKLY.',
  noindex: true,
})

if (!cart.items.length) {
  await navigateTo('/kosik')
}

const formattedSubtotal = computed(() => formatPrice(cart.subtotal))

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

const form = reactive({
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  postalCode: '',
  country: 'Slovensko',
  payment: 'card',
})

const isPlacing = ref(false)
const isPlaced = ref(false)

async function placeOrder() {
  isPlacing.value = true
  await new Promise((resolve) => setTimeout(resolve, 800))
  isPlaced.value = true
  cart.clear()
  isPlacing.value = false
  setTimeout(() => router.push('/'), 2500)
}
</script>

<template>
  <div
    class="w-full md:max-w-[1536px] md:mx-auto px-gutter md:px-grid-margin py-stack-lg md:py-12"
    :class="!isPlaced ? 'pb-28 md:pb-12' : ''"
  >
    <!-- Breadcrumb -->
    <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant block mb-stack-lg md:mb-8">
      <NuxtLink to="/" class="hover:text-on-background">Domov</NuxtLink> /
      <NuxtLink to="/kosik" class="hover:text-on-background">Košík</NuxtLink> / Pokladňa
    </span>

    <h1 class="font-headline-lg text-headline-lg md:text-headline-xl uppercase border-b border-grid-line pb-stack-sm md:pb-6 mb-stack-lg md:mb-8">
      Pokladňa
    </h1>

    <!-- Success state -->
    <div v-if="isPlaced" role="status" class="flex flex-col items-center text-center gap-stack-md py-stack-lg md:py-section-padding-lg">
      <span class="material-symbols-outlined text-[64px] text-on-secondary-container" aria-hidden="true">check_circle</span>
      <h2 class="font-headline-md text-headline-md uppercase">Ďakujeme za objednávku!</h2>
      <p class="font-body-md text-body-md text-on-surface-variant max-w-md">
        Potvrdenie objednávky sme odoslali na váš e-mail. Budete presmerovaní na domovskú stránku.
      </p>
    </div>

    <form v-else id="checkout-form" class="grid grid-cols-1 md:grid-cols-3 gap-stack-lg md:gap-16" @submit.prevent="placeOrder">
      <!-- Form -->
      <div class="md:col-span-2 flex flex-col gap-stack-lg">
        <fieldset class="flex flex-col gap-stack-sm">
          <legend class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm w-full mb-stack-sm">
            Kontaktné údaje
          </legend>
          <div class="flex flex-col gap-1">
            <label for="checkout-email" class="font-technical-data text-technical-data uppercase text-on-surface-variant">E-mailová adresa</label>
            <input
              id="checkout-email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              placeholder="vas@email.sk"
              class="h-12 px-4 border border-outline-variant bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 focus:border-primary rounded-default"
            />
          </div>
        </fieldset>

        <fieldset class="flex flex-col gap-stack-sm">
          <legend class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm w-full mb-stack-sm">
            Doručovacia adresa
          </legend>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-stack-sm">
            <div class="flex flex-col gap-1">
              <label for="checkout-first-name" class="font-technical-data text-technical-data uppercase text-on-surface-variant">Meno</label>
              <input
                id="checkout-first-name"
                v-model="form.firstName"
                type="text"
                required
                autocomplete="given-name"
                class="h-12 px-4 border border-outline-variant bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 focus:border-primary rounded-default"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label for="checkout-last-name" class="font-technical-data text-technical-data uppercase text-on-surface-variant">Priezvisko</label>
              <input
                id="checkout-last-name"
                v-model="form.lastName"
                type="text"
                required
                autocomplete="family-name"
                class="h-12 px-4 border border-outline-variant bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 focus:border-primary rounded-default"
              />
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <label for="checkout-address" class="font-technical-data text-technical-data uppercase text-on-surface-variant">Adresa</label>
            <input
              id="checkout-address"
              v-model="form.address"
              type="text"
              required
              autocomplete="street-address"
              class="h-12 px-4 border border-outline-variant bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 focus:border-primary rounded-default"
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-stack-sm">
            <div class="flex flex-col gap-1">
              <label for="checkout-city" class="font-technical-data text-technical-data uppercase text-on-surface-variant">Mesto</label>
              <input
                id="checkout-city"
                v-model="form.city"
                type="text"
                required
                autocomplete="address-level2"
                class="h-12 px-4 border border-outline-variant bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 focus:border-primary rounded-default"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label for="checkout-postal-code" class="font-technical-data text-technical-data uppercase text-on-surface-variant">PSČ</label>
              <input
                id="checkout-postal-code"
                v-model="form.postalCode"
                type="text"
                required
                autocomplete="postal-code"
                inputmode="numeric"
                class="h-12 px-4 border border-outline-variant bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 focus:border-primary rounded-default"
              />
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <label for="checkout-country" class="font-technical-data text-technical-data uppercase text-on-surface-variant">Krajina</label>
            <input
              id="checkout-country"
              v-model="form.country"
              type="text"
              required
              autocomplete="country-name"
              class="h-12 px-4 border border-outline-variant bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 focus:border-primary rounded-default"
            />
          </div>
        </fieldset>

        <fieldset class="flex flex-col gap-stack-sm">
          <legend class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm w-full mb-stack-sm">
            Spôsob platby
          </legend>
          <label class="flex items-center gap-stack-sm border border-outline-variant px-4 py-3 rounded-default cursor-pointer transition-colors duration-200 hover:border-on-surface-variant focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary" :class="form.payment === 'card' ? 'border-primary' : ''">
            <input v-model="form.payment" type="radio" name="payment" value="card" class="accent-black" />
            <span class="material-symbols-outlined" aria-hidden="true">credit_card</span>
            <span class="font-body-md text-body-md">Platobná karta</span>
          </label>
          <label class="flex items-center gap-stack-sm border border-outline-variant px-4 py-3 rounded-default cursor-pointer transition-colors duration-200 hover:border-on-surface-variant focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary" :class="form.payment === 'transfer' ? 'border-primary' : ''">
            <input v-model="form.payment" type="radio" name="payment" value="transfer" class="accent-black" />
            <span class="material-symbols-outlined" aria-hidden="true">account_balance</span>
            <span class="font-body-md text-body-md">Bankový prevod</span>
          </label>
          <label class="flex items-center gap-stack-sm border border-outline-variant px-4 py-3 rounded-default cursor-pointer transition-colors duration-200 hover:border-on-surface-variant focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary" :class="form.payment === 'cod' ? 'border-primary' : ''">
            <input v-model="form.payment" type="radio" name="payment" value="cod" class="accent-black" />
            <span class="material-symbols-outlined" aria-hidden="true">local_shipping</span>
            <span class="font-body-md text-body-md">Dobierka</span>
          </label>
        </fieldset>
      </div>

      <!-- Summary -->
      <div class="flex flex-col gap-stack-md h-fit border border-grid-line p-stack-md md:p-6">
        <div class="flex items-center justify-between border-b border-grid-line pb-stack-sm">
          <h2 class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
            Vaša objednávka
          </h2>
          <NuxtLink
            to="/kosik"
            class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant underline hover:text-primary transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-default"
          >
            Upraviť
          </NuxtLink>
        </div>
        <div class="flex flex-col gap-stack-sm divide-y divide-grid-line">
          <div v-for="item in cart.items" :key="item.productId" class="flex justify-between items-center gap-stack-sm pt-stack-sm first:pt-0">
            <div class="flex items-center gap-stack-sm min-w-0">
              <div class="w-12 h-12 shrink-0 bg-surface-container-lowest border border-grid-line overflow-hidden">
                <img :src="item.image" :alt="item.name" loading="lazy" class="w-full h-full object-cover" />
              </div>
              <div class="min-w-0">
                <p class="font-body-md text-body-md truncate">{{ item.name }}</p>
                <p class="font-technical-data text-technical-data text-on-surface-variant uppercase">x{{ item.quantity }}</p>
              </div>
            </div>
            <span class="font-price-display text-price-display shrink-0">{{ formatPrice(item.price * item.quantity) }}</span>
          </div>
        </div>
        <div v-if="savingsTotal > 0" class="flex justify-between items-baseline">
          <span class="font-body-md text-body-md text-on-surface-variant">Vaša úspora</span>
          <span class="font-technical-data text-technical-data uppercase text-on-secondary-container">−{{ formattedSavings }}</span>
        </div>
        <div class="flex justify-between items-baseline pt-stack-sm border-t border-grid-line">
          <span class="font-body-md text-body-md text-on-surface-variant">Doprava</span>
          <span class="font-technical-data text-technical-data uppercase text-on-secondary-container">Zdarma</span>
        </div>
        <div class="flex justify-between items-baseline pt-stack-sm border-t border-grid-line">
          <span class="font-headline-sm text-headline-sm uppercase">Spolu</span>
          <span class="font-price-display text-headline-md text-on-background">{{ formattedSubtotal }}</span>
        </div>
        <button
          type="submit"
          :disabled="isPlacing"
          class="h-12 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.99] hover:bg-primary/85 disabled:opacity-50 disabled:cursor-not-allowed rounded-default mt-stack-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span class="material-symbols-outlined" :class="isPlacing ? 'animate-spin' : ''" aria-hidden="true">{{ isPlacing ? 'progress_activity' : 'lock' }}</span>
          {{ isPlacing ? 'Spracúva sa...' : 'Odoslať objednávku' }}
        </button>
        <span class="sr-only" role="status">{{ isPlacing ? 'Objednávka sa spracúva' : '' }}</span>

        <!-- Trust signals -->
        <div class="flex flex-col gap-2 pt-stack-sm border-t border-grid-line mt-1">
          <div class="flex items-center gap-2 text-on-surface-variant">
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">lock</span>
            <span class="font-technical-data text-technical-data uppercase">256-bit SSL šifrovanie</span>
          </div>
          <div class="flex items-center gap-2 text-on-surface-variant">
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">replay</span>
            <span class="font-technical-data text-technical-data uppercase">30-dňová záruka vrátenia peňazí</span>
          </div>
        </div>
      </div>
    </form>

    <!-- Sticky mobile submit bar -->
    <div
      v-if="!isPlaced"
      class="md:hidden fixed bottom-16 left-0 right-0 z-40 bg-surface-container-lowest border-t border-grid-line px-gutter py-stack-sm flex items-center justify-between gap-stack-sm shadow-[0_-2px_8px_rgba(0,0,0,0.06)]"
    >
      <div class="flex flex-col leading-none">
        <span class="font-technical-data text-technical-data text-on-surface-variant uppercase">Spolu</span>
        <span class="font-price-display text-price-display text-on-background">{{ formattedSubtotal }}</span>
      </div>
      <button
        type="submit"
        form="checkout-form"
        :disabled="isPlacing"
        class="h-12 px-6 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.99] hover:bg-primary/85 disabled:opacity-50 disabled:cursor-not-allowed rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span class="material-symbols-outlined" :class="isPlacing ? 'animate-spin' : ''" aria-hidden="true">{{ isPlacing ? 'progress_activity' : 'lock' }}</span>
        {{ isPlacing ? '...' : 'Objednať' }}
      </button>
    </div>
  </div>
</template>
