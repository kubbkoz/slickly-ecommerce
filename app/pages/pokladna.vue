<script setup lang="ts">
import { getProductById } from '~/data/products'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { checkoutAddressSchema, SUPPORTED_COUNTRIES } from '~/composables/useCheckoutSchema'

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

const step = ref(1)
const stepLabels = ['Adresa', 'Doprava', 'Platba']

const formattedSubtotal = computed(() => formatPrice(cart.subtotal))

const savingsTotal = computed(() => {
  return cart.items.reduce((total, item) => {
    const product = getProductById(item.productId)
    if (product?.oldPrice && product.oldPrice > item.price) {
      return total + (product.oldPrice - item.price) * item.quantity
    }
    return total
  }, 0)
})
const formattedSavings = computed(() => formatPrice(savingsTotal.value))

// ── Shipping options ──
const shippingOptions = [
  { id: 'gls', label: 'GLS Kuriér', description: 'Doručenie na adresu', time: '2–3 prac. dni', price: 0, icon: 'local_shipping' },
  { id: 'packeta', label: 'Packeta Z-BOX', description: 'Výdajné miesto / Z-BOX', time: '2–3 prac. dni', price: 0, icon: 'package_2' },
  { id: 'post', label: 'Slovenská pošta', description: 'Doručenie na adresu', time: '3–5 prac. dní', price: 0, icon: 'mail' },
  { id: 'express', label: 'Expresné doručenie', description: 'GLS Express na adresu', time: 'Nasledujúci prac. deň', price: 4.90, icon: 'bolt' },
] as const

// ── VeeValidate + Zod: Step 1 (Address) ──
const { validate: validateAddress, errors } = useForm({
  validationSchema: toTypedSchema(checkoutAddressSchema),
  initialValues: {
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'SK',
    isBusiness: false,
    companyName: '',
    ico: '',
    dic: '',
    icDph: '',
  },
})

function useCheckoutField(name: string) {
  const { value, handleBlur, meta } = useField(() => name)
  return { value, handleBlur, meta }
}

const email = useCheckoutField('email')
const phone = useCheckoutField('phone')
const firstName = useCheckoutField('firstName')
const lastName = useCheckoutField('lastName')
const address = useCheckoutField('address')
const city = useCheckoutField('city')
const postalCode = useCheckoutField('postalCode')
const country = useCheckoutField('country')
const isBusiness = useCheckoutField('isBusiness')
const companyName = useCheckoutField('companyName')
const ico = useCheckoutField('ico')
const dic = useCheckoutField('dic')
const icDph = useCheckoutField('icDph')

function fieldClass(name: string) {
  const fields = { email, phone, firstName, lastName, address, city, postalCode, country, companyName, ico, dic, icDph } as Record<string, typeof email>
  const field = fields[name]
  const hasError = field?.meta.touched && errors.value[name]
  return hasError ? 'border-error focus:border-error' : 'border-outline-variant focus:border-primary'
}

const phonePlaceholder = computed(() => {
  const placeholders: Record<string, string> = {
    SK: '+421 9XX XXX XXX', CZ: '+420 XXX XXX XXX', HU: '+36 XX XXX XXXX',
    AT: '+43 XXXX XXXXXX', PL: '+48 XXX XXX XXX', DE: '+49 XXXX XXXXXXX',
  }
  return placeholders[country.value.value as string] ?? '+XXX XXX XXX XXX'
})

const postalPlaceholder = computed(() => {
  const placeholders: Record<string, string> = {
    SK: '841 01', CZ: '110 00', HU: '1011', AT: '1010', PL: '00-001', DE: '10115',
  }
  return placeholders[country.value.value as string] ?? '00000'
})

// ── Steps 2 & 3: simple reactive (no complex validation needed) ──
const shipping = ref('gls')
const payment = ref('card')

const shippingCost = computed(() => {
  const opt = shippingOptions.find((o) => o.id === shipping.value)
  return opt?.price ?? 0
})
const formattedShipping = computed(() => (shippingCost.value === 0 ? 'Zdarma' : formatPrice(shippingCost.value)))
const orderTotal = computed(() => cart.subtotal + shippingCost.value)
const formattedTotal = computed(() => formatPrice(orderTotal.value))

// ── Step navigation with validation ──
async function goToStep(target: number) {
  if (target > step.value && step.value === 1) {
    const result = await validateAddress()
    if (!result.valid) return
  }
  step.value = target
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ── Order placement ──
const isPlacing = ref(false)
const isPlaced = ref(false)

interface PlacedOrder {
  orderNumber: string
  email: string
  items: typeof cart.items
  subtotal: number
  shipping: { label: string; time: string; price: number }
  payment: string
  total: number
  address: string
  date: string
}
const placedOrder = ref<PlacedOrder | null>(null)

function generateOrderNumber() {
  const year = new Date().getFullYear()
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `SL-${year}${rand}`
}

async function placeOrder() {
  isPlacing.value = true
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const shippingOpt = shippingOptions.find((o) => o.id === shipping.value)!
  const paymentLabels: Record<string, string> = { card: 'Platobná karta', transfer: 'Bankový prevod', cod: 'Dobierka' }

  placedOrder.value = {
    orderNumber: generateOrderNumber(),
    email: email.value.value as string,
    items: [...cart.items],
    subtotal: cart.subtotal,
    shipping: { label: shippingOpt.label, time: shippingOpt.time, price: shippingOpt.price },
    payment: paymentLabels[payment.value] ?? payment.value,
    total: orderTotal.value,
    address: `${firstName.value.value} ${lastName.value.value}, ${address.value.value}, ${postalCode.value.value} ${city.value.value}, ${SUPPORTED_COUNTRIES.find((c) => c.code === country.value.value)?.name ?? country.value.value}`,
    date: new Date().toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' }),
  }

  cart.clear()
  isPlaced.value = true
  isPlacing.value = false
}

const trackingSteps = [
  { label: 'Prijatá', labelDesktop: 'Objednávka prijatá', icon: 'check_circle', done: true },
  { label: 'Platba', labelDesktop: 'Spracovanie platby', icon: 'payments', done: false, current: true },
  { label: 'Príprava', labelDesktop: 'Príprava zásielky', icon: 'inventory_2', done: false },
  { label: 'Odoslaná', labelDesktop: 'Odoslaná', icon: 'local_shipping', done: false },
  { label: 'Doručená', labelDesktop: 'Doručená', icon: 'home', done: false },
]
</script>

<template>
  <div class="w-full md:max-w-[1536px] md:mx-auto px-gutter md:px-grid-margin py-stack-md md:py-8">
    <!-- ════════ THANK YOU PAGE ════════ -->
    <template v-if="isPlaced && placedOrder">
      <div class="max-w-3xl mx-auto">
        <!-- Hero confirmation -->
        <div class="flex flex-col items-center text-center gap-stack-sm py-stack-lg md:py-12">
          <span class="material-symbols-outlined text-[72px] text-on-secondary-container" aria-hidden="true">check_circle</span>
          <h1 class="font-headline-lg text-headline-lg md:text-headline-xl uppercase">Ďakujeme za objednávku!</h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
            Objednávka <strong class="text-on-background">{{ placedOrder.orderNumber }}</strong> bola úspešne prijatá. Potvrdenie sme odoslali na <strong class="text-on-background">{{ placedOrder.email }}</strong>.
          </p>
        </div>

        <!-- Order tracking timeline -->
        <div class="border border-grid-line p-stack-md md:p-8 mb-stack-md">
          <h2 class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-stack-md">Stav objednávky</h2>
          <div class="flex items-start">
            <template v-for="(ts, idx) in trackingSteps" :key="ts.label">
              <div class="flex flex-col items-center text-center shrink-0" :class="idx === 0 || idx === trackingSteps.length - 1 ? 'w-14 md:w-auto' : 'w-14 md:w-auto'">
                <span
                  class="w-9 h-9 rounded-full flex items-center justify-center"
                  :class="ts.done
                    ? 'bg-primary text-on-primary'
                    : ts.current
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-surface-container border border-outline-variant text-on-surface-variant'
                  "
                >
                  <span class="material-symbols-outlined text-[18px]" aria-hidden="true">{{ ts.done ? 'check' : ts.icon }}</span>
                </span>
                <span
                  class="font-technical-data text-technical-data uppercase leading-tight mt-1.5 max-w-[4.5rem] md:max-w-none"
                  :class="ts.done || ts.current ? 'text-on-background' : 'text-on-surface-variant'"
                >
                  <span class="md:hidden">{{ ts.label }}</span>
                  <span class="hidden md:inline">{{ ts.labelDesktop }}</span>
                </span>
              </div>
              <div
                v-if="idx < trackingSteps.length - 1"
                class="flex-grow h-px mt-[18px] mx-1 md:mx-2"
                :class="trackingSteps[idx + 1]?.done || trackingSteps[idx + 1]?.current ? 'bg-primary' : 'bg-outline-variant'"
                aria-hidden="true"
              />
            </template>
          </div>
        </div>

        <!-- Order summary -->
        <div class="border border-grid-line p-stack-md md:p-8 mb-stack-md">
          <div class="flex items-center justify-between mb-stack-md border-b border-grid-line pb-stack-sm">
            <h2 class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Súhrn objednávky</h2>
            <span class="font-technical-data text-technical-data text-on-surface-variant uppercase">{{ placedOrder.date }}</span>
          </div>

          <div class="flex flex-col gap-stack-sm divide-y divide-grid-line mb-stack-md">
            <div v-for="item in placedOrder.items" :key="item.productId" class="flex items-center gap-stack-sm pt-stack-sm first:pt-0">
              <div class="w-14 h-14 shrink-0 bg-surface-container-lowest border border-grid-line overflow-hidden rounded-default">
                <img :src="item.image" :alt="item.name" loading="lazy" class="w-full h-full object-cover" />
              </div>
              <div class="flex-grow min-w-0">
                <p class="font-body-md text-body-md truncate">{{ item.name }}</p>
                <p class="font-technical-data text-technical-data text-on-surface-variant uppercase">x{{ item.quantity }}</p>
              </div>
              <span class="font-price-display text-price-display shrink-0">{{ formatPrice(item.price * item.quantity) }}</span>
            </div>
          </div>

          <div class="flex flex-col gap-2 border-t border-grid-line pt-stack-sm">
            <div class="flex justify-between items-baseline">
              <span class="font-body-md text-body-md text-on-surface-variant">Medzisúčet</span>
              <span class="font-body-md text-body-md">{{ formatPrice(placedOrder.subtotal) }}</span>
            </div>
            <div class="flex justify-between items-baseline">
              <span class="font-body-md text-body-md text-on-surface-variant">Doprava ({{ placedOrder.shipping.label }})</span>
              <span class="font-body-md text-body-md">{{ placedOrder.shipping.price === 0 ? 'Zdarma' : formatPrice(placedOrder.shipping.price) }}</span>
            </div>
            <div class="flex justify-between items-baseline pt-stack-sm border-t border-grid-line">
              <span class="font-headline-sm text-headline-sm uppercase">Spolu</span>
              <span class="font-price-display text-headline-md text-on-background">{{ formatPrice(placedOrder.total) }}</span>
            </div>
          </div>
        </div>

        <!-- Delivery & payment info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-stack-md mb-stack-md">
          <div class="border border-grid-line p-stack-md md:p-6">
            <h3 class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-stack-sm">Doručovacia adresa</h3>
            <p class="font-body-md text-body-md text-on-surface">{{ placedOrder.address }}</p>
            <div class="flex items-center gap-2 mt-stack-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-[18px]" aria-hidden="true">local_shipping</span>
              <span class="font-technical-data text-technical-data uppercase">{{ placedOrder.shipping.label }} &middot; {{ placedOrder.shipping.time }}</span>
            </div>
          </div>
          <div class="border border-grid-line p-stack-md md:p-6">
            <h3 class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-stack-sm">Platba</h3>
            <p class="font-body-md text-body-md text-on-surface">{{ placedOrder.payment }}</p>
            <div class="flex items-center gap-2 mt-stack-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-[18px]" aria-hidden="true">receipt_long</span>
              <span class="font-technical-data text-technical-data uppercase">Faktúra odoslaná na {{ placedOrder.email }}</span>
            </div>
          </div>
        </div>

        <!-- Next steps -->
        <div class="border border-grid-line p-stack-md md:p-8 mb-stack-lg">
          <h2 class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-stack-md">Ďalšie kroky</h2>
          <div class="flex flex-col gap-stack-md">
            <div class="flex items-start gap-stack-sm">
              <span class="material-symbols-outlined text-[22px] text-on-secondary-container mt-0.5 shrink-0" aria-hidden="true">mark_email_read</span>
              <div>
                <p class="font-body-md text-body-md font-semibold">Potvrdenie e-mailom</p>
                <p class="font-body-md text-body-md text-on-surface-variant">Na vašu e-mailovú adresu sme odoslali potvrdenie objednávky s detailmi a faktúrou.</p>
              </div>
            </div>
            <div class="flex items-start gap-stack-sm">
              <span class="material-symbols-outlined text-[22px] text-on-secondary-container mt-0.5 shrink-0" aria-hidden="true">pin_drop</span>
              <div>
                <p class="font-body-md text-body-md font-semibold">Sledovanie zásielky</p>
                <p class="font-body-md text-body-md text-on-surface-variant">Akonáhle bude zásielka odoslaná, pošleme vám e-mail s&nbsp;číslom na sledovanie.</p>
              </div>
            </div>
            <div class="flex items-start gap-stack-sm">
              <span class="material-symbols-outlined text-[22px] text-on-secondary-container mt-0.5 shrink-0" aria-hidden="true">schedule</span>
              <div>
                <p class="font-body-md text-body-md font-semibold">Predpokladané doručenie</p>
                <p class="font-body-md text-body-md text-on-surface-variant">Podľa zvoleného spôsobu dopravy je predpokladaný termín doručenia {{ placedOrder.shipping.time }}.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- CTAs -->
        <div class="flex flex-col md:flex-row items-center gap-stack-sm">
          <NuxtLink
            to="/ucet"
            class="w-full md:w-auto h-14 px-8 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-[background-color,transform] duration-200 active:scale-[0.99] hover:bg-primary/85 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span class="material-symbols-outlined" aria-hidden="true">person</span>
            Prejsť na môj účet
          </NuxtLink>
          <NuxtLink
            to="/produkty"
            class="w-full md:w-auto h-14 px-8 border border-outline-variant text-on-background font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200 hover:border-primary rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Pokračovať v nákupe
          </NuxtLink>
        </div>
      </div>
    </template>

    <!-- ════════ CHECKOUT STEPS ════════ -->
    <template v-else>
      <h1 class="sr-only">Pokladňa — {{ stepLabels[step - 1] }}</h1>
      <!-- Progress indicator -->
      <nav aria-label="Postup objednávky" class="mb-stack-lg md:mb-8">
        <ol class="flex items-center justify-center gap-0">
          <li class="flex items-center">
            <NuxtLink to="/kosik" class="flex items-center gap-1.5 group cursor-pointer">
              <span class="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-technical-data text-technical-data">
                <span class="material-symbols-outlined text-[16px]" aria-hidden="true">check</span>
              </span>
              <span class="hidden md:inline font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors duration-200">Košík</span>
            </NuxtLink>
          </li>
          <template v-for="(label, idx) in stepLabels" :key="label">
            <li
              aria-hidden="true"
              class="w-6 md:w-10 h-px mx-1 md:mx-2"
              :class="step > idx ? 'bg-primary' : 'bg-outline-variant'"
            />
            <li class="flex items-center" :aria-current="step === idx + 1 ? 'step' : undefined">
              <component
                :is="step > idx + 1 ? 'button' : 'span'"
                class="flex items-center gap-1.5"
                :class="step > idx + 1 ? 'cursor-pointer group' : ''"
                v-bind="step > idx + 1 ? { type: 'button' } : {}"
                @click="step > idx + 1 ? goToStep(idx + 1) : undefined"
              >
                <span
                  class="w-7 h-7 rounded-full flex items-center justify-center font-technical-data text-technical-data"
                  :class="step > idx + 1
                    ? 'bg-primary text-on-primary'
                    : step === idx + 1
                      ? 'bg-primary text-on-primary font-bold'
                      : 'bg-surface-container border border-outline-variant text-on-surface-variant'
                  "
                >
                  <span v-if="step > idx + 1" class="material-symbols-outlined text-[16px]" aria-hidden="true">check</span>
                  <template v-else>{{ idx + 1 }}</template>
                </span>
                <span
                  class="hidden md:inline font-label-sm text-label-sm uppercase tracking-widest transition-colors duration-200"
                  :class="step === idx + 1
                    ? 'text-on-background font-bold'
                    : step > idx + 1
                      ? 'text-on-surface-variant group-hover:text-primary'
                      : 'text-on-surface-variant'
                  "
                >{{ label }}</span>
              </component>
            </li>
          </template>
        </ol>
      </nav>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-stack-lg md:gap-12">
        <!-- ── Left column: step content ── -->
        <div class="md:col-span-2">
          <!-- STEP 1: Adresa -->
          <form v-show="step === 1" id="checkout-step1" class="flex flex-col gap-stack-lg" novalidate @submit.prevent="goToStep(2)">
            <fieldset class="flex flex-col gap-stack-sm">
              <legend class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm w-full mb-stack-sm">
                Kontaktné údaje
              </legend>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-stack-sm">
                <div class="flex flex-col gap-1 md:col-span-2">
                  <label for="checkout-email" class="font-technical-data text-technical-data uppercase text-on-surface-variant">E-mailová adresa</label>
                  <input id="checkout-email" v-model="email.value.value" type="email" inputmode="email" autocomplete="email" placeholder="vas@email.sk"
                    aria-required="true" :aria-describedby="email.meta.touched && errors.email ? 'err-email' : undefined" :aria-invalid="email.meta.touched && !!errors.email"
                    class="h-12 px-4 border bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 rounded-default" :class="fieldClass('email')" @blur="email.handleBlur" />
                  <p v-if="email.meta.touched && errors.email" id="err-email" role="alert" class="font-technical-data text-technical-data text-error">{{ errors.email }}</p>
                </div>
                <div class="flex flex-col gap-1 md:col-span-2">
                  <label for="checkout-phone" class="font-technical-data text-technical-data uppercase text-on-surface-variant">Telefón</label>
                  <input id="checkout-phone" v-model="phone.value.value" type="tel" autocomplete="tel" :placeholder="phonePlaceholder"
                    aria-required="true" :aria-describedby="phone.meta.touched && errors.phone ? 'err-phone' : undefined" :aria-invalid="phone.meta.touched && !!errors.phone"
                    class="h-12 px-4 border bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 rounded-default" :class="fieldClass('phone')" @blur="phone.handleBlur" />
                  <p v-if="phone.meta.touched && errors.phone" id="err-phone" role="alert" class="font-technical-data text-technical-data text-error">{{ errors.phone }}</p>
                </div>
              </div>
            </fieldset>

            <fieldset class="flex flex-col gap-stack-sm">
              <legend class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm w-full mb-stack-sm">
                Doručovacia adresa
              </legend>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-stack-sm">
                <div class="flex flex-col gap-1">
                  <label for="checkout-first-name" class="font-technical-data text-technical-data uppercase text-on-surface-variant">Meno</label>
                  <input id="checkout-first-name" v-model="firstName.value.value" type="text" autocomplete="given-name"
                    aria-required="true" :aria-describedby="firstName.meta.touched && errors.firstName ? 'err-first-name' : undefined" :aria-invalid="firstName.meta.touched && !!errors.firstName"
                    class="h-12 px-4 border bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 rounded-default" :class="fieldClass('firstName')" @blur="firstName.handleBlur" />
                  <p v-if="firstName.meta.touched && errors.firstName" id="err-first-name" role="alert" class="font-technical-data text-technical-data text-error">{{ errors.firstName }}</p>
                </div>
                <div class="flex flex-col gap-1">
                  <label for="checkout-last-name" class="font-technical-data text-technical-data uppercase text-on-surface-variant">Priezvisko</label>
                  <input id="checkout-last-name" v-model="lastName.value.value" type="text" autocomplete="family-name"
                    aria-required="true" :aria-describedby="lastName.meta.touched && errors.lastName ? 'err-last-name' : undefined" :aria-invalid="lastName.meta.touched && !!errors.lastName"
                    class="h-12 px-4 border bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 rounded-default" :class="fieldClass('lastName')" @blur="lastName.handleBlur" />
                  <p v-if="lastName.meta.touched && errors.lastName" id="err-last-name" role="alert" class="font-technical-data text-technical-data text-error">{{ errors.lastName }}</p>
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <label for="checkout-address" class="font-technical-data text-technical-data uppercase text-on-surface-variant">Adresa (ulica a číslo domu)</label>
                <input id="checkout-address" v-model="address.value.value" type="text" autocomplete="street-address"
                  aria-required="true" :aria-describedby="address.meta.touched && errors.address ? 'err-address' : undefined" :aria-invalid="address.meta.touched && !!errors.address"
                  class="h-12 px-4 border bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 rounded-default" :class="fieldClass('address')" @blur="address.handleBlur" />
                <p v-if="address.meta.touched && errors.address" id="err-address" role="alert" class="font-technical-data text-technical-data text-error">{{ errors.address }}</p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-stack-sm">
                <div class="flex flex-col gap-1">
                  <label for="checkout-city" class="font-technical-data text-technical-data uppercase text-on-surface-variant">Mesto</label>
                  <input id="checkout-city" v-model="city.value.value" type="text" autocomplete="address-level2"
                    aria-required="true" :aria-describedby="city.meta.touched && errors.city ? 'err-city' : undefined" :aria-invalid="city.meta.touched && !!errors.city"
                    class="h-12 px-4 border bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 rounded-default" :class="fieldClass('city')" @blur="city.handleBlur" />
                  <p v-if="city.meta.touched && errors.city" id="err-city" role="alert" class="font-technical-data text-technical-data text-error">{{ errors.city }}</p>
                </div>
                <div class="flex flex-col gap-1">
                  <label for="checkout-postal-code" class="font-technical-data text-technical-data uppercase text-on-surface-variant">PSČ</label>
                  <input id="checkout-postal-code" v-model="postalCode.value.value" type="text" autocomplete="postal-code" inputmode="numeric" :placeholder="postalPlaceholder"
                    aria-required="true" :aria-describedby="postalCode.meta.touched && errors.postalCode ? 'err-postal-code' : undefined" :aria-invalid="postalCode.meta.touched && !!errors.postalCode"
                    class="h-12 px-4 border bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 rounded-default" :class="fieldClass('postalCode')" @blur="postalCode.handleBlur" />
                  <p v-if="postalCode.meta.touched && errors.postalCode" id="err-postal-code" role="alert" class="font-technical-data text-technical-data text-error">{{ errors.postalCode }}</p>
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <label for="checkout-country" class="font-technical-data text-technical-data uppercase text-on-surface-variant">Krajina</label>
                <select id="checkout-country" v-model="country.value.value" autocomplete="country"
                  :aria-describedby="country.meta.touched && errors.country ? 'err-country' : undefined" :aria-invalid="country.meta.touched && !!errors.country"
                  class="h-12 px-4 border bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 rounded-default appearance-none cursor-pointer" :class="fieldClass('country')" @blur="country.handleBlur">
                  <option v-for="c in SUPPORTED_COUNTRIES" :key="c.code" :value="c.code">{{ c.name }}</option>
                </select>
                <p v-if="country.meta.touched && errors.country" id="err-country" role="alert" class="font-technical-data text-technical-data text-error">{{ errors.country }}</p>
              </div>
            </fieldset>

            <!-- Business toggle -->
            <fieldset class="flex flex-col gap-stack-sm">
              <label class="flex items-center gap-stack-sm cursor-pointer select-none">
                <input v-model="isBusiness.value.value" type="checkbox" class="w-5 h-5 accent-primary rounded cursor-pointer" />
                <span class="font-body-md text-body-md">Nakupujem na firmu</span>
              </label>

              <Transition
                enter-active-class="transition-[opacity,transform] duration-200 ease-out"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-[opacity,transform] duration-150 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2"
              >
                <div v-if="isBusiness.value.value" class="flex flex-col gap-stack-sm border border-grid-line p-stack-md rounded-default bg-surface-container-lowest">
                  <p class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm">Firemné údaje</p>
                  <div class="flex flex-col gap-1">
                    <label for="checkout-company" class="font-technical-data text-technical-data uppercase text-on-surface-variant">Názov firmy</label>
                    <input id="checkout-company" v-model="companyName.value.value" type="text" autocomplete="organization"
                      :aria-describedby="companyName.meta.touched && errors.companyName ? 'err-company' : undefined" :aria-invalid="companyName.meta.touched && !!errors.companyName"
                      class="h-12 px-4 border bg-white font-body-md text-body-md outline-none transition-colors duration-200 rounded-default" :class="fieldClass('companyName')" @blur="companyName.handleBlur" />
                    <p v-if="companyName.meta.touched && errors.companyName" id="err-company" role="alert" class="font-technical-data text-technical-data text-error">{{ errors.companyName }}</p>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-stack-sm">
                    <div class="flex flex-col gap-1">
                      <label for="checkout-ico" class="font-technical-data text-technical-data uppercase text-on-surface-variant">IČO</label>
                      <input id="checkout-ico" v-model="ico.value.value" type="text" inputmode="numeric"
                        :aria-describedby="ico.meta.touched && errors.ico ? 'err-ico' : undefined" :aria-invalid="ico.meta.touched && !!errors.ico"
                        class="h-12 px-4 border bg-white font-body-md text-body-md outline-none transition-colors duration-200 rounded-default" :class="fieldClass('ico')" @blur="ico.handleBlur" />
                      <p v-if="ico.meta.touched && errors.ico" id="err-ico" role="alert" class="font-technical-data text-technical-data text-error">{{ errors.ico }}</p>
                    </div>
                    <div class="flex flex-col gap-1">
                      <label for="checkout-dic" class="font-technical-data text-technical-data uppercase text-on-surface-variant">DIČ</label>
                      <input id="checkout-dic" v-model="dic.value.value" type="text" inputmode="numeric"
                        :aria-describedby="dic.meta.touched && errors.dic ? 'err-dic' : undefined" :aria-invalid="dic.meta.touched && !!errors.dic"
                        class="h-12 px-4 border bg-white font-body-md text-body-md outline-none transition-colors duration-200 rounded-default" :class="fieldClass('dic')" @blur="dic.handleBlur" />
                      <p v-if="dic.meta.touched && errors.dic" id="err-dic" role="alert" class="font-technical-data text-technical-data text-error">{{ errors.dic }}</p>
                    </div>
                    <div class="flex flex-col gap-1">
                      <label for="checkout-ic-dph" class="font-technical-data text-technical-data uppercase text-on-surface-variant">IČ DPH <span class="normal-case text-on-surface-variant/60">(nepovinné)</span></label>
                      <input id="checkout-ic-dph" v-model="icDph.value.value" type="text" :placeholder="country.value.value === 'CZ' ? 'CZ12345678' : 'SK2012345678'"
                        :aria-describedby="icDph.meta.touched && errors.icDph ? 'err-ic-dph' : undefined" :aria-invalid="icDph.meta.touched && !!errors.icDph"
                        class="h-12 px-4 border bg-white font-body-md text-body-md outline-none transition-colors duration-200 rounded-default" :class="fieldClass('icDph')" @blur="icDph.handleBlur" />
                      <p v-if="icDph.meta.touched && errors.icDph" id="err-ic-dph" role="alert" class="font-technical-data text-technical-data text-error">{{ errors.icDph }}</p>
                    </div>
                  </div>
                </div>
              </Transition>
            </fieldset>

            <!-- Step 1 submit (desktop) — hidden on mobile, shown in sticky bar -->
            <button
              type="submit"
              class="hidden md:flex h-14 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest items-center justify-center gap-2 cursor-pointer transition-[background-color,transform] duration-200 active:scale-[0.99] hover:bg-primary/85 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Pokračovať na dopravu
              <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
            </button>
          </form>

          <!-- STEP 2: Doprava -->
          <form v-show="step === 2" id="checkout-step2" class="flex flex-col gap-stack-lg" novalidate @submit.prevent="goToStep(3)">
            <fieldset class="flex flex-col gap-stack-sm">
              <legend class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm w-full mb-stack-sm">
                Spôsob dopravy
              </legend>
              <label
                v-for="opt in shippingOptions"
                :key="opt.id"
                class="flex items-center gap-stack-sm border px-4 py-4 rounded-default cursor-pointer transition-colors duration-200 hover:border-on-surface-variant focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary"
                :class="shipping === opt.id ? 'border-primary bg-surface-container-lowest' : 'border-outline-variant'"
              >
                <input v-model="shipping" type="radio" name="shipping" :value="opt.id" class="accent-primary shrink-0" />
                <span class="material-symbols-outlined text-[22px] shrink-0" aria-hidden="true">{{ opt.icon }}</span>
                <span class="flex-grow flex flex-col">
                  <span class="font-body-md text-body-md">{{ opt.label }}</span>
                  <span class="font-technical-data text-technical-data text-on-surface-variant uppercase">{{ opt.description }} &middot; {{ opt.time }}</span>
                </span>
                <span class="font-label-sm text-label-sm uppercase tracking-widest shrink-0" :class="opt.price === 0 ? 'text-on-secondary-container' : 'text-on-background'">
                  {{ opt.price === 0 ? 'Zdarma' : formatPrice(opt.price) }}
                </span>
              </label>
            </fieldset>

            <!-- Delivery address preview -->
            <div class="border border-grid-line p-stack-md rounded-default flex items-start justify-between gap-stack-sm">
              <div>
                <p class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-1">Doručiť na</p>
                <p class="font-body-md text-body-md">{{ firstName.value.value }} {{ lastName.value.value }}</p>
                <p class="font-body-md text-body-md text-on-surface-variant">{{ address.value.value }}, {{ postalCode.value.value }} {{ city.value.value }}</p>
              </div>
              <button type="button" class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant underline hover:text-primary cursor-pointer transition-colors duration-200 shrink-0" @click="goToStep(1)">
                Zmeniť
              </button>
            </div>

            <div class="flex gap-stack-sm">
              <button
                type="button"
                class="hidden md:flex h-14 px-6 border border-outline-variant text-on-background font-label-sm text-label-sm uppercase tracking-widest items-center justify-center gap-2 cursor-pointer transition-colors duration-200 hover:border-primary rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                @click="goToStep(1)"
              >
                <span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
                Späť
              </button>
              <button
                type="submit"
                class="hidden md:flex flex-grow h-14 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest items-center justify-center gap-2 cursor-pointer transition-[background-color,transform] duration-200 active:scale-[0.99] hover:bg-primary/85 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Pokračovať na platbu
                <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
              </button>
            </div>
          </form>

          <!-- STEP 3: Platba -->
          <form v-show="step === 3" id="checkout-step3" class="flex flex-col gap-stack-lg" novalidate @submit.prevent="placeOrder">
            <fieldset class="flex flex-col gap-stack-sm">
              <legend class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm w-full mb-stack-sm">
                Spôsob platby
              </legend>
              <label
                class="flex items-center gap-stack-sm border px-4 py-4 rounded-default cursor-pointer transition-colors duration-200 hover:border-on-surface-variant focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary"
                :class="payment === 'card' ? 'border-primary bg-surface-container-lowest' : 'border-outline-variant'"
              >
                <input v-model="payment" type="radio" name="payment" value="card" class="accent-primary" />
                <span class="material-symbols-outlined text-[22px]" aria-hidden="true">credit_card</span>
                <span class="flex-grow flex flex-col">
                  <span class="font-body-md text-body-md">Platobná karta</span>
                  <span class="font-technical-data text-technical-data text-on-surface-variant uppercase">Visa, Mastercard, Apple Pay, Google Pay</span>
                </span>
              </label>
              <label
                class="flex items-center gap-stack-sm border px-4 py-4 rounded-default cursor-pointer transition-colors duration-200 hover:border-on-surface-variant focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary"
                :class="payment === 'transfer' ? 'border-primary bg-surface-container-lowest' : 'border-outline-variant'"
              >
                <input v-model="payment" type="radio" name="payment" value="transfer" class="accent-primary" />
                <span class="material-symbols-outlined text-[22px]" aria-hidden="true">account_balance</span>
                <span class="flex-grow flex flex-col">
                  <span class="font-body-md text-body-md">Bankový prevod</span>
                  <span class="font-technical-data text-technical-data text-on-surface-variant uppercase">Platba prevodom na účet</span>
                </span>
              </label>
              <label
                class="flex items-center gap-stack-sm border px-4 py-4 rounded-default cursor-pointer transition-colors duration-200 hover:border-on-surface-variant focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary"
                :class="payment === 'cod' ? 'border-primary bg-surface-container-lowest' : 'border-outline-variant'"
              >
                <input v-model="payment" type="radio" name="payment" value="cod" class="accent-primary" />
                <span class="material-symbols-outlined text-[22px]" aria-hidden="true">payments</span>
                <span class="flex-grow flex flex-col">
                  <span class="font-body-md text-body-md">Dobierka</span>
                  <span class="font-technical-data text-technical-data text-on-surface-variant uppercase">Platba pri prevzatí zásielky</span>
                </span>
              </label>
            </fieldset>

            <!-- Order review summary -->
            <div class="border border-grid-line p-stack-md rounded-default flex flex-col gap-stack-sm">
              <p class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm">Súhrn pred odoslaním</p>
              <div class="flex justify-between items-baseline">
                <span class="font-body-md text-body-md text-on-surface-variant">Doručenie</span>
                <span class="font-body-md text-body-md">{{ shippingOptions.find(o => o.id === shipping)?.label }} &middot; {{ formattedShipping }}</span>
              </div>
              <div class="flex justify-between items-baseline">
                <span class="font-body-md text-body-md text-on-surface-variant">Adresa</span>
                <span class="font-body-md text-body-md text-right">{{ firstName.value.value }} {{ lastName.value.value }}, {{ city.value.value }}</span>
              </div>
              <div class="flex justify-between items-baseline">
                <span class="font-body-md text-body-md text-on-surface-variant">Kontakt</span>
                <span class="font-body-md text-body-md">{{ email.value.value }}</span>
              </div>
            </div>

            <div class="flex gap-stack-sm">
              <button
                type="button"
                class="hidden md:flex h-14 px-6 border border-outline-variant text-on-background font-label-sm text-label-sm uppercase tracking-widest items-center justify-center gap-2 cursor-pointer transition-colors duration-200 hover:border-primary rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                @click="goToStep(2)"
              >
                <span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
                Späť
              </button>
              <button
                type="submit"
                :disabled="isPlacing"
                class="hidden md:flex flex-grow h-14 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest items-center justify-center gap-2 cursor-pointer transition-[background-color,transform] duration-200 active:scale-[0.99] hover:bg-primary/85 disabled:opacity-50 disabled:cursor-not-allowed rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span class="material-symbols-outlined" :class="isPlacing ? 'animate-spin' : ''" aria-hidden="true">{{ isPlacing ? 'progress_activity' : 'lock' }}</span>
                {{ isPlacing ? 'Spracúva sa...' : 'Odoslať objednávku' }}
              </button>
              <span class="sr-only" role="status" aria-live="polite" aria-atomic="true">{{ isPlacing ? 'Objednávka sa spracúva' : '' }}</span>
            </div>
          </form>
        </div>

        <!-- ── Right column: Order summary sidebar ── -->
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
              <span class="font-technical-data text-technical-data uppercase text-on-secondary-container">-{{ formattedSavings }}</span>
            </div>
            <div class="flex justify-between items-baseline pt-stack-sm border-t border-grid-line">
              <span class="font-body-md text-body-md text-on-surface-variant">Doprava</span>
              <span class="font-technical-data text-technical-data uppercase" :class="shippingCost === 0 ? 'text-on-secondary-container' : 'text-on-background'">{{ formattedShipping }}</span>
            </div>
            <div class="flex justify-between items-baseline pt-stack-sm border-t border-grid-line">
              <span class="font-headline-sm text-headline-sm uppercase">Spolu</span>
              <span class="font-price-display text-headline-md text-on-background">{{ formattedTotal }}</span>
            </div>
          </div>

          <!-- Trust signals -->
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
      </div>

      <!-- Sticky mobile bar -->
      <div
        class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest border-t border-grid-line px-gutter py-stack-sm flex items-center justify-between gap-stack-sm safe-bottom"
      >
        <div class="flex flex-col leading-none">
          <span class="font-technical-data text-technical-data text-on-surface-variant uppercase">Spolu</span>
          <span class="font-price-display text-price-display text-on-background">{{ formattedTotal }}</span>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="step > 1"
            type="button"
            class="h-12 px-3 border border-outline-variant text-on-background flex items-center justify-center cursor-pointer transition-colors duration-200 hover:border-primary rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Späť"
            @click="goToStep(step - 1)"
          >
            <span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          </button>
          <button
            v-if="step === 1"
            type="submit"
            form="checkout-step1"
            class="h-12 px-6 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-[background-color,transform] duration-200 active:scale-[0.99] hover:bg-primary/85 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Doprava
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span>
          </button>
          <button
            v-else-if="step === 2"
            type="submit"
            form="checkout-step2"
            class="h-12 px-6 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-[background-color,transform] duration-200 active:scale-[0.99] hover:bg-primary/85 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Platba
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span>
          </button>
          <button
            v-else
            type="submit"
            form="checkout-step3"
            :disabled="isPlacing"
            class="h-12 px-6 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-[background-color,transform] duration-200 active:scale-[0.99] hover:bg-primary/85 disabled:opacity-50 disabled:cursor-not-allowed rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span class="material-symbols-outlined" :class="isPlacing ? 'animate-spin' : ''" aria-hidden="true">{{ isPlacing ? 'progress_activity' : 'lock' }}</span>
            {{ isPlacing ? '...' : 'Objednať' }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
