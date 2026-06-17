<script setup lang="ts">
import { products as allProducts } from '~/data/products'

definePageMeta({ layout: 'checkout' })

const cart = useCartStore()
const router = useRouter()
const { formatPrice } = useCurrency()

useSeo({
  title: 'Pokladňa | SLICKLY',
  description: 'Dokončite svoju objednávku SLICKLY.',
  noindex: true,
})

onMounted(() => {
  if (!cart.items.length) cart.hydrate()
  if (!cart.items.length) navigateTo('/kosik', { replace: true })
})

const formattedSubtotal = computed(() => formatPrice(cart.subtotal))

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

const touched = reactive<Record<string, boolean>>({
  email: false,
  firstName: false,
  lastName: false,
  address: false,
  city: false,
  postalCode: false,
  country: false,
})

const errors = computed(() => ({
  email: !form.email
    ? 'E-mailová adresa je povinná'
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
      ? 'Zadajte platný e-mail'
      : '',
  firstName: !form.firstName.trim() ? 'Meno je povinné' : '',
  lastName: !form.lastName.trim() ? 'Priezvisko je povinné' : '',
  address: !form.address.trim() ? 'Adresa je povinná' : '',
  city: !form.city.trim() ? 'Mesto je povinné' : '',
  postalCode: !form.postalCode.trim()
    ? 'PSČ je povinné'
    : !/^\d{5}$/.test(form.postalCode.replace(/\s/g, ''))
      ? 'PSČ musí mať 5 číslic'
      : '',
  country: !form.country.trim() ? 'Krajina je povinná' : '',
}))

function touch(field: string) {
  touched[field] = true
}

function inputClass(field: string) {
  const hasError = touched[field] && errors.value[field as keyof typeof errors.value]
  return hasError
    ? 'border-error focus:border-error'
    : 'border-outline-variant focus:border-primary'
}

const isPlacing = ref(false)
const isPlaced = ref(false)

async function placeOrder() {
  Object.keys(touched).forEach((k) => (touched[k] = true))
  if (Object.values(errors.value).some((e) => e)) return

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
    class="w-full md:max-w-[1536px] md:mx-auto px-gutter md:px-grid-margin py-stack-md md:py-8"
    :class="!isPlaced ? 'pb-28 md:pb-12' : ''"
  >
    <!-- Progress indicator -->
    <nav v-if="!isPlaced" aria-label="Postup objednávky" class="mb-stack-lg md:mb-8">
      <ol class="flex items-center justify-center gap-0">
        <li class="flex items-center">
          <NuxtLink to="/kosik" class="flex items-center gap-1.5 group cursor-pointer">
            <span class="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-technical-data text-technical-data">
              <span class="material-symbols-outlined text-[16px]" aria-hidden="true">check</span>
            </span>
            <span class="hidden md:inline font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors duration-200">Košík</span>
          </NuxtLink>
        </li>
        <li aria-hidden="true" class="w-8 md:w-12 h-px bg-primary mx-1 md:mx-2" />
        <li class="flex items-center" aria-current="step">
          <span class="flex items-center gap-1.5">
            <span class="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-technical-data text-technical-data font-bold">2</span>
            <span class="hidden md:inline font-label-sm text-label-sm uppercase tracking-widest text-on-background font-bold">Doručenie a platba</span>
          </span>
        </li>
        <li aria-hidden="true" class="w-8 md:w-12 h-px bg-outline-variant mx-1 md:mx-2" />
        <li class="flex items-center">
          <span class="flex items-center gap-1.5">
            <span class="w-7 h-7 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant flex items-center justify-center font-technical-data text-technical-data">3</span>
            <span class="hidden md:inline font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Hotovo</span>
          </span>
        </li>
      </ol>
    </nav>

    <!-- Success state -->
    <div v-if="isPlaced" role="status" class="flex flex-col items-center text-center gap-stack-md py-stack-lg md:py-section-padding-lg">
      <span class="material-symbols-outlined text-[64px] text-on-secondary-container" aria-hidden="true">check_circle</span>
      <h1 class="font-headline-md text-headline-md uppercase">Ďakujeme za objednávku!</h1>
      <p class="font-body-md text-body-md text-on-surface-variant max-w-md">
        Potvrdenie objednávky sme odoslali na váš e-mail. Budete presmerovaní na domovskú stránku.
      </p>
    </div>

    <form v-else id="checkout-form" class="grid grid-cols-1 md:grid-cols-3 gap-stack-lg md:gap-12" novalidate @submit.prevent="placeOrder">
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
              autocomplete="email"
              placeholder="vas@email.sk"
              :aria-describedby="touched.email && errors.email ? 'err-email' : undefined"
              :aria-invalid="touched.email && !!errors.email"
              class="h-12 px-4 border bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 rounded-default"
              :class="inputClass('email')"
              @blur="touch('email')"
            />
            <p v-if="touched.email && errors.email" id="err-email" role="alert" class="font-technical-data text-technical-data text-error">
              {{ errors.email }}
            </p>
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
                autocomplete="given-name"
                :aria-describedby="touched.firstName && errors.firstName ? 'err-first-name' : undefined"
                :aria-invalid="touched.firstName && !!errors.firstName"
                class="h-12 px-4 border bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 rounded-default"
                :class="inputClass('firstName')"
                @blur="touch('firstName')"
              />
              <p v-if="touched.firstName && errors.firstName" id="err-first-name" role="alert" class="font-technical-data text-technical-data text-error">
                {{ errors.firstName }}
              </p>
            </div>
            <div class="flex flex-col gap-1">
              <label for="checkout-last-name" class="font-technical-data text-technical-data uppercase text-on-surface-variant">Priezvisko</label>
              <input
                id="checkout-last-name"
                v-model="form.lastName"
                type="text"
                autocomplete="family-name"
                :aria-describedby="touched.lastName && errors.lastName ? 'err-last-name' : undefined"
                :aria-invalid="touched.lastName && !!errors.lastName"
                class="h-12 px-4 border bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 rounded-default"
                :class="inputClass('lastName')"
                @blur="touch('lastName')"
              />
              <p v-if="touched.lastName && errors.lastName" id="err-last-name" role="alert" class="font-technical-data text-technical-data text-error">
                {{ errors.lastName }}
              </p>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <label for="checkout-address" class="font-technical-data text-technical-data uppercase text-on-surface-variant">Adresa</label>
            <input
              id="checkout-address"
              v-model="form.address"
              type="text"
              autocomplete="street-address"
              :aria-describedby="touched.address && errors.address ? 'err-address' : undefined"
              :aria-invalid="touched.address && !!errors.address"
              class="h-12 px-4 border bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 rounded-default"
              :class="inputClass('address')"
              @blur="touch('address')"
            />
            <p v-if="touched.address && errors.address" id="err-address" role="alert" class="font-technical-data text-technical-data text-error">
              {{ errors.address }}
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-stack-sm">
            <div class="flex flex-col gap-1">
              <label for="checkout-city" class="font-technical-data text-technical-data uppercase text-on-surface-variant">Mesto</label>
              <input
                id="checkout-city"
                v-model="form.city"
                type="text"
                autocomplete="address-level2"
                :aria-describedby="touched.city && errors.city ? 'err-city' : undefined"
                :aria-invalid="touched.city && !!errors.city"
                class="h-12 px-4 border bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 rounded-default"
                :class="inputClass('city')"
                @blur="touch('city')"
              />
              <p v-if="touched.city && errors.city" id="err-city" role="alert" class="font-technical-data text-technical-data text-error">
                {{ errors.city }}
              </p>
            </div>
            <div class="flex flex-col gap-1">
              <label for="checkout-postal-code" class="font-technical-data text-technical-data uppercase text-on-surface-variant">PSČ</label>
              <input
                id="checkout-postal-code"
                v-model="form.postalCode"
                type="text"
                autocomplete="postal-code"
                inputmode="numeric"
                :aria-describedby="touched.postalCode && errors.postalCode ? 'err-postal-code' : undefined"
                :aria-invalid="touched.postalCode && !!errors.postalCode"
                class="h-12 px-4 border bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 rounded-default"
                :class="inputClass('postalCode')"
                @blur="touch('postalCode')"
              />
              <p v-if="touched.postalCode && errors.postalCode" id="err-postal-code" role="alert" class="font-technical-data text-technical-data text-error">
                {{ errors.postalCode }}
              </p>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <label for="checkout-country" class="font-technical-data text-technical-data uppercase text-on-surface-variant">Krajina</label>
            <input
              id="checkout-country"
              v-model="form.country"
              type="text"
              autocomplete="country-name"
              :aria-describedby="touched.country && errors.country ? 'err-country' : undefined"
              :aria-invalid="touched.country && !!errors.country"
              class="h-12 px-4 border bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 rounded-default"
              :class="inputClass('country')"
              @blur="touch('country')"
            />
            <p v-if="touched.country && errors.country" id="err-country" role="alert" class="font-technical-data text-technical-data text-error">
              {{ errors.country }}
            </p>
          </div>
        </fieldset>

        <fieldset class="flex flex-col gap-stack-sm">
          <legend class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm w-full mb-stack-sm">
            Spôsob platby
          </legend>
          <label class="flex items-center gap-stack-sm border border-outline-variant px-4 py-3 rounded-default cursor-pointer transition-colors duration-200 hover:border-on-surface-variant focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary" :class="form.payment === 'card' ? 'border-primary' : ''">
            <input v-model="form.payment" type="radio" name="payment" value="card" class="accent-primary" />
            <span class="material-symbols-outlined" aria-hidden="true">credit_card</span>
            <span class="font-body-md text-body-md">Platobná karta</span>
          </label>
          <label class="flex items-center gap-stack-sm border border-outline-variant px-4 py-3 rounded-default cursor-pointer transition-colors duration-200 hover:border-on-surface-variant focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary" :class="form.payment === 'transfer' ? 'border-primary' : ''">
            <input v-model="form.payment" type="radio" name="payment" value="transfer" class="accent-primary" />
            <span class="material-symbols-outlined" aria-hidden="true">account_balance</span>
            <span class="font-body-md text-body-md">Bankový prevod</span>
          </label>
          <label class="flex items-center gap-stack-sm border border-outline-variant px-4 py-3 rounded-default cursor-pointer transition-colors duration-200 hover:border-on-surface-variant focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary" :class="form.payment === 'cod' ? 'border-primary' : ''">
            <input v-model="form.payment" type="radio" name="payment" value="cod" class="accent-primary" />
            <span class="material-symbols-outlined" aria-hidden="true">local_shipping</span>
            <span class="font-body-md text-body-md">Dobierka</span>
          </label>
        </fieldset>
      </div>

      <!-- Summary sidebar — sticky on desktop -->
      <div class="flex flex-col gap-stack-md h-fit md:sticky md:top-6">
        <div class="flex flex-col gap-stack-md border border-grid-line p-stack-md md:p-6">
          <div class="flex items-center justify-between border-b border-grid-line pb-stack-sm">
            <h2 class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
              Vaša objednávka ({{ cart.itemCount }})
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
                <div class="w-12 h-12 shrink-0 bg-surface-container-lowest border border-grid-line overflow-hidden rounded-default">
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
            class="h-14 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.99] hover:bg-primary/85 disabled:opacity-50 disabled:cursor-not-allowed rounded-default mt-stack-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span class="material-symbols-outlined" :class="isPlacing ? 'animate-spin' : ''" aria-hidden="true">{{ isPlacing ? 'progress_activity' : 'lock' }}</span>
            {{ isPlacing ? 'Spracúva sa...' : 'Odoslať objednávku' }}
          </button>
          <span class="sr-only" role="status">{{ isPlacing ? 'Objednávka sa spracúva' : '' }}</span>
        </div>

        <!-- Trust signals — expanded -->
        <div class="border border-grid-line p-stack-md md:p-6 flex flex-col gap-3">
          <div class="flex items-center gap-2.5 text-on-surface-variant">
            <span class="material-symbols-outlined text-[20px]" aria-hidden="true">lock</span>
            <span class="font-technical-data text-technical-data uppercase">256-bit SSL šifrovanie</span>
          </div>
          <div class="flex items-center gap-2.5 text-on-surface-variant">
            <span class="material-symbols-outlined text-[20px]" aria-hidden="true">local_shipping</span>
            <span class="font-technical-data text-technical-data uppercase">Doprava zdarma na všetky objednávky</span>
          </div>
          <div class="flex items-center gap-2.5 text-on-surface-variant">
            <span class="material-symbols-outlined text-[20px]" aria-hidden="true">replay</span>
            <span class="font-technical-data text-technical-data uppercase">30-dňová záruka vrátenia peňazí</span>
          </div>
          <div class="flex items-center gap-2.5 text-on-surface-variant">
            <span class="material-symbols-outlined text-[20px]" aria-hidden="true">verified</span>
            <span class="font-technical-data text-technical-data uppercase">Originálne produkty od autorizovaných distribútorov</span>
          </div>
          <div class="flex items-center gap-2.5 text-on-surface-variant">
            <span class="material-symbols-outlined text-[20px]" aria-hidden="true">group</span>
            <span class="font-technical-data text-technical-data uppercase">12 000+ spokojných zákazníkov</span>
          </div>
        </div>
      </div>
    </form>

    <!-- Sticky mobile submit bar -->
    <div
      v-if="!isPlaced"
      class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest border-t border-grid-line px-gutter py-stack-sm flex items-center justify-between gap-stack-sm shadow-[0_-2px_8px_rgba(0,0,0,0.06)]"
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
