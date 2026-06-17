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

const step = ref(1)
const stepLabels = ['Adresa', 'Doprava', 'Platba']

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

// ── Shipping options ──
const shippingOptions = [
  { id: 'gls', label: 'GLS Kuriér', description: 'Doručenie na adresu', time: '2–3 prac. dni', price: 0, icon: 'local_shipping' },
  { id: 'packeta', label: 'Packeta Z-BOX', description: 'Výdajné miesto / Z-BOX', time: '2–3 prac. dni', price: 0, icon: 'package_2' },
  { id: 'post', label: 'Slovenská pošta', description: 'Doručenie na adresu', time: '3–5 prac. dní', price: 0, icon: 'mail' },
  { id: 'express', label: 'Expresné doručenie', description: 'GLS Express na adresu', time: 'Nasledujúci prac. deň', price: 4.90, icon: 'bolt' },
] as const

const shippingCost = computed(() => {
  const opt = shippingOptions.find((o) => o.id === form.shipping)
  return opt?.price ?? 0
})
const formattedShipping = computed(() => (shippingCost.value === 0 ? 'Zdarma' : formatPrice(shippingCost.value)))
const orderTotal = computed(() => cart.subtotal + shippingCost.value)
const formattedTotal = computed(() => formatPrice(orderTotal.value))

// ── Form state ──
const form = reactive({
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  country: 'Slovensko',
  isBusiness: false,
  companyName: '',
  ico: '',
  dic: '',
  icDph: '',
  shipping: 'gls',
  payment: 'card',
})

const touched = reactive<Record<string, boolean>>({})
function touch(field: string) { touched[field] = true }

const errors = computed(() => {
  const e: Record<string, string> = {
    email: !form.email
      ? 'E-mailová adresa je povinná'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
        ? 'Zadajte platný e-mail'
        : '',
    firstName: !form.firstName.trim() ? 'Meno je povinné' : '',
    lastName: !form.lastName.trim() ? 'Priezvisko je povinné' : '',
    phone: !form.phone.trim()
      ? 'Telefónne číslo je povinné'
      : !/^[+]?[\d\s-]{6,}$/.test(form.phone.trim())
        ? 'Zadajte platné telefónne číslo'
        : '',
    address: !form.address.trim() ? 'Adresa je povinná' : '',
    city: !form.city.trim() ? 'Mesto je povinné' : '',
    postalCode: !form.postalCode.trim()
      ? 'PSČ je povinné'
      : !/^\d{5}$/.test(form.postalCode.replace(/\s/g, ''))
        ? 'PSČ musí mať 5 číslic'
        : '',
    country: !form.country.trim() ? 'Krajina je povinná' : '',
  }
  if (form.isBusiness) {
    e.companyName = !form.companyName.trim() ? 'Názov firmy je povinný' : ''
    e.ico = !form.ico.trim()
      ? 'IČO je povinné'
      : !/^\d{6,8}$/.test(form.ico.replace(/\s/g, ''))
        ? 'IČO musí mať 6–8 číslic'
        : ''
    e.dic = !form.dic.trim() ? 'DIČ je povinné' : ''
  }
  return e
})

const step1Fields = ['email', 'firstName', 'lastName', 'phone', 'address', 'city', 'postalCode', 'country']
const step1BusinessFields = ['companyName', 'ico', 'dic']

function inputClass(field: string) {
  const hasError = touched[field] && errors.value[field]
  return hasError
    ? 'border-error focus:border-error'
    : 'border-outline-variant focus:border-primary'
}

function goToStep(target: number) {
  if (target > step.value) {
    if (step.value === 1 && !validateStep1()) return
  }
  step.value = target
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function validateStep1(): boolean {
  const fields = [...step1Fields, ...(form.isBusiness ? step1BusinessFields : [])]
  fields.forEach((f) => (touched[f] = true))
  return fields.every((f) => !errors.value[f])
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

  const shippingOpt = shippingOptions.find((o) => o.id === form.shipping)!
  const paymentLabels: Record<string, string> = { card: 'Platobná karta', transfer: 'Bankový prevod', cod: 'Dobierka' }

  placedOrder.value = {
    orderNumber: generateOrderNumber(),
    email: form.email,
    items: [...cart.items],
    subtotal: cart.subtotal,
    shipping: { label: shippingOpt.label, time: shippingOpt.time, price: shippingOpt.price },
    payment: paymentLabels[form.payment] ?? form.payment,
    total: orderTotal.value,
    address: `${form.firstName} ${form.lastName}, ${form.address}, ${form.postalCode} ${form.city}`,
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
            class="w-full md:w-auto h-14 px-8 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.99] hover:bg-primary/85 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
                  <input id="checkout-email" v-model="form.email" type="email" autocomplete="email" placeholder="vas@email.sk"
                    :aria-describedby="touched.email && errors.email ? 'err-email' : undefined" :aria-invalid="touched.email && !!errors.email"
                    class="h-12 px-4 border bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 rounded-default" :class="inputClass('email')" @blur="touch('email')" />
                  <p v-if="touched.email && errors.email" id="err-email" role="alert" class="font-technical-data text-technical-data text-error">{{ errors.email }}</p>
                </div>
                <div class="flex flex-col gap-1 md:col-span-2">
                  <label for="checkout-phone" class="font-technical-data text-technical-data uppercase text-on-surface-variant">Telefón</label>
                  <input id="checkout-phone" v-model="form.phone" type="tel" autocomplete="tel" placeholder="+421 9XX XXX XXX"
                    :aria-describedby="touched.phone && errors.phone ? 'err-phone' : undefined" :aria-invalid="touched.phone && !!errors.phone"
                    class="h-12 px-4 border bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 rounded-default" :class="inputClass('phone')" @blur="touch('phone')" />
                  <p v-if="touched.phone && errors.phone" id="err-phone" role="alert" class="font-technical-data text-technical-data text-error">{{ errors.phone }}</p>
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
                  <input id="checkout-first-name" v-model="form.firstName" type="text" autocomplete="given-name"
                    :aria-describedby="touched.firstName && errors.firstName ? 'err-first-name' : undefined" :aria-invalid="touched.firstName && !!errors.firstName"
                    class="h-12 px-4 border bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 rounded-default" :class="inputClass('firstName')" @blur="touch('firstName')" />
                  <p v-if="touched.firstName && errors.firstName" id="err-first-name" role="alert" class="font-technical-data text-technical-data text-error">{{ errors.firstName }}</p>
                </div>
                <div class="flex flex-col gap-1">
                  <label for="checkout-last-name" class="font-technical-data text-technical-data uppercase text-on-surface-variant">Priezvisko</label>
                  <input id="checkout-last-name" v-model="form.lastName" type="text" autocomplete="family-name"
                    :aria-describedby="touched.lastName && errors.lastName ? 'err-last-name' : undefined" :aria-invalid="touched.lastName && !!errors.lastName"
                    class="h-12 px-4 border bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 rounded-default" :class="inputClass('lastName')" @blur="touch('lastName')" />
                  <p v-if="touched.lastName && errors.lastName" id="err-last-name" role="alert" class="font-technical-data text-technical-data text-error">{{ errors.lastName }}</p>
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <label for="checkout-address" class="font-technical-data text-technical-data uppercase text-on-surface-variant">Adresa (ulica a číslo domu)</label>
                <input id="checkout-address" v-model="form.address" type="text" autocomplete="street-address"
                  :aria-describedby="touched.address && errors.address ? 'err-address' : undefined" :aria-invalid="touched.address && !!errors.address"
                  class="h-12 px-4 border bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 rounded-default" :class="inputClass('address')" @blur="touch('address')" />
                <p v-if="touched.address && errors.address" id="err-address" role="alert" class="font-technical-data text-technical-data text-error">{{ errors.address }}</p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-stack-sm">
                <div class="flex flex-col gap-1">
                  <label for="checkout-city" class="font-technical-data text-technical-data uppercase text-on-surface-variant">Mesto</label>
                  <input id="checkout-city" v-model="form.city" type="text" autocomplete="address-level2"
                    :aria-describedby="touched.city && errors.city ? 'err-city' : undefined" :aria-invalid="touched.city && !!errors.city"
                    class="h-12 px-4 border bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 rounded-default" :class="inputClass('city')" @blur="touch('city')" />
                  <p v-if="touched.city && errors.city" id="err-city" role="alert" class="font-technical-data text-technical-data text-error">{{ errors.city }}</p>
                </div>
                <div class="flex flex-col gap-1">
                  <label for="checkout-postal-code" class="font-technical-data text-technical-data uppercase text-on-surface-variant">PSČ</label>
                  <input id="checkout-postal-code" v-model="form.postalCode" type="text" autocomplete="postal-code" inputmode="numeric"
                    :aria-describedby="touched.postalCode && errors.postalCode ? 'err-postal-code' : undefined" :aria-invalid="touched.postalCode && !!errors.postalCode"
                    class="h-12 px-4 border bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 rounded-default" :class="inputClass('postalCode')" @blur="touch('postalCode')" />
                  <p v-if="touched.postalCode && errors.postalCode" id="err-postal-code" role="alert" class="font-technical-data text-technical-data text-error">{{ errors.postalCode }}</p>
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <label for="checkout-country" class="font-technical-data text-technical-data uppercase text-on-surface-variant">Krajina</label>
                <input id="checkout-country" v-model="form.country" type="text" autocomplete="country-name"
                  :aria-describedby="touched.country && errors.country ? 'err-country' : undefined" :aria-invalid="touched.country && !!errors.country"
                  class="h-12 px-4 border bg-surface-container-lowest font-body-md text-body-md outline-none transition-colors duration-200 rounded-default" :class="inputClass('country')" @blur="touch('country')" />
                <p v-if="touched.country && errors.country" id="err-country" role="alert" class="font-technical-data text-technical-data text-error">{{ errors.country }}</p>
              </div>
            </fieldset>

            <!-- Business toggle -->
            <fieldset class="flex flex-col gap-stack-sm">
              <label class="flex items-center gap-stack-sm cursor-pointer select-none">
                <input v-model="form.isBusiness" type="checkbox" class="w-5 h-5 accent-primary rounded cursor-pointer" />
                <span class="font-body-md text-body-md">Nakupujem na firmu</span>
              </label>

              <Transition
                enter-active-class="transition-all duration-200 ease-out"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-150 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2"
              >
                <div v-if="form.isBusiness" class="flex flex-col gap-stack-sm border border-grid-line p-stack-md rounded-default bg-surface-container-lowest">
                  <p class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm">Firemné údaje</p>
                  <div class="flex flex-col gap-1">
                    <label for="checkout-company" class="font-technical-data text-technical-data uppercase text-on-surface-variant">Názov firmy</label>
                    <input id="checkout-company" v-model="form.companyName" type="text" autocomplete="organization"
                      :aria-describedby="touched.companyName && errors.companyName ? 'err-company' : undefined" :aria-invalid="touched.companyName && !!errors.companyName"
                      class="h-12 px-4 border bg-white font-body-md text-body-md outline-none transition-colors duration-200 rounded-default" :class="inputClass('companyName')" @blur="touch('companyName')" />
                    <p v-if="touched.companyName && errors.companyName" id="err-company" role="alert" class="font-technical-data text-technical-data text-error">{{ errors.companyName }}</p>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-stack-sm">
                    <div class="flex flex-col gap-1">
                      <label for="checkout-ico" class="font-technical-data text-technical-data uppercase text-on-surface-variant">IČO</label>
                      <input id="checkout-ico" v-model="form.ico" type="text" inputmode="numeric"
                        :aria-describedby="touched.ico && errors.ico ? 'err-ico' : undefined" :aria-invalid="touched.ico && !!errors.ico"
                        class="h-12 px-4 border bg-white font-body-md text-body-md outline-none transition-colors duration-200 rounded-default" :class="inputClass('ico')" @blur="touch('ico')" />
                      <p v-if="touched.ico && errors.ico" id="err-ico" role="alert" class="font-technical-data text-technical-data text-error">{{ errors.ico }}</p>
                    </div>
                    <div class="flex flex-col gap-1">
                      <label for="checkout-dic" class="font-technical-data text-technical-data uppercase text-on-surface-variant">DIČ</label>
                      <input id="checkout-dic" v-model="form.dic" type="text"
                        :aria-describedby="touched.dic && errors.dic ? 'err-dic' : undefined" :aria-invalid="touched.dic && !!errors.dic"
                        class="h-12 px-4 border bg-white font-body-md text-body-md outline-none transition-colors duration-200 rounded-default" :class="inputClass('dic')" @blur="touch('dic')" />
                      <p v-if="touched.dic && errors.dic" id="err-dic" role="alert" class="font-technical-data text-technical-data text-error">{{ errors.dic }}</p>
                    </div>
                    <div class="flex flex-col gap-1">
                      <label for="checkout-ic-dph" class="font-technical-data text-technical-data uppercase text-on-surface-variant">IČ DPH <span class="normal-case text-on-surface-variant/60">(nepovinné)</span></label>
                      <input id="checkout-ic-dph" v-model="form.icDph" type="text"
                        class="h-12 px-4 border border-outline-variant focus:border-primary bg-white font-body-md text-body-md outline-none transition-colors duration-200 rounded-default" />
                    </div>
                  </div>
                </div>
              </Transition>
            </fieldset>

            <!-- Step 1 submit (desktop) — hidden on mobile, shown in sticky bar -->
            <button
              type="submit"
              class="hidden md:flex h-14 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.99] hover:bg-primary/85 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
                :class="form.shipping === opt.id ? 'border-primary bg-surface-container-lowest' : 'border-outline-variant'"
              >
                <input v-model="form.shipping" type="radio" name="shipping" :value="opt.id" class="accent-primary shrink-0" />
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
                <p class="font-body-md text-body-md">{{ form.firstName }} {{ form.lastName }}</p>
                <p class="font-body-md text-body-md text-on-surface-variant">{{ form.address }}, {{ form.postalCode }} {{ form.city }}</p>
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
                class="hidden md:flex flex-grow h-14 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.99] hover:bg-primary/85 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
                :class="form.payment === 'card' ? 'border-primary bg-surface-container-lowest' : 'border-outline-variant'"
              >
                <input v-model="form.payment" type="radio" name="payment" value="card" class="accent-primary" />
                <span class="material-symbols-outlined text-[22px]" aria-hidden="true">credit_card</span>
                <span class="flex-grow flex flex-col">
                  <span class="font-body-md text-body-md">Platobná karta</span>
                  <span class="font-technical-data text-technical-data text-on-surface-variant uppercase">Visa, Mastercard, Apple Pay, Google Pay</span>
                </span>
              </label>
              <label
                class="flex items-center gap-stack-sm border px-4 py-4 rounded-default cursor-pointer transition-colors duration-200 hover:border-on-surface-variant focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary"
                :class="form.payment === 'transfer' ? 'border-primary bg-surface-container-lowest' : 'border-outline-variant'"
              >
                <input v-model="form.payment" type="radio" name="payment" value="transfer" class="accent-primary" />
                <span class="material-symbols-outlined text-[22px]" aria-hidden="true">account_balance</span>
                <span class="flex-grow flex flex-col">
                  <span class="font-body-md text-body-md">Bankový prevod</span>
                  <span class="font-technical-data text-technical-data text-on-surface-variant uppercase">Platba prevodom na účet</span>
                </span>
              </label>
              <label
                class="flex items-center gap-stack-sm border px-4 py-4 rounded-default cursor-pointer transition-colors duration-200 hover:border-on-surface-variant focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary"
                :class="form.payment === 'cod' ? 'border-primary bg-surface-container-lowest' : 'border-outline-variant'"
              >
                <input v-model="form.payment" type="radio" name="payment" value="cod" class="accent-primary" />
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
                <span class="font-body-md text-body-md">{{ shippingOptions.find(o => o.id === form.shipping)?.label }} &middot; {{ formattedShipping }}</span>
              </div>
              <div class="flex justify-between items-baseline">
                <span class="font-body-md text-body-md text-on-surface-variant">Adresa</span>
                <span class="font-body-md text-body-md text-right">{{ form.firstName }} {{ form.lastName }}, {{ form.city }}</span>
              </div>
              <div class="flex justify-between items-baseline">
                <span class="font-body-md text-body-md text-on-surface-variant">Kontakt</span>
                <span class="font-body-md text-body-md">{{ form.email }}</span>
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
                class="hidden md:flex flex-grow h-14 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.99] hover:bg-primary/85 disabled:opacity-50 disabled:cursor-not-allowed rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span class="material-symbols-outlined" :class="isPlacing ? 'animate-spin' : ''" aria-hidden="true">{{ isPlacing ? 'progress_activity' : 'lock' }}</span>
                {{ isPlacing ? 'Spracúva sa...' : 'Odoslať objednávku' }}
              </button>
              <span class="sr-only" role="status">{{ isPlacing ? 'Objednávka sa spracúva' : '' }}</span>
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
        class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest border-t border-grid-line px-gutter py-stack-sm flex items-center justify-between gap-stack-sm shadow-[0_-2px_8px_rgba(0,0,0,0.06)]"
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
            class="h-12 px-6 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.99] hover:bg-primary/85 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Doprava
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span>
          </button>
          <button
            v-else-if="step === 2"
            type="submit"
            form="checkout-step2"
            class="h-12 px-6 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.99] hover:bg-primary/85 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Platba
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span>
          </button>
          <button
            v-else
            type="submit"
            form="checkout-step3"
            :disabled="isPlacing"
            class="h-12 px-6 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.99] hover:bg-primary/85 disabled:opacity-50 disabled:cursor-not-allowed rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span class="material-symbols-outlined" :class="isPlacing ? 'animate-spin' : ''" aria-hidden="true">{{ isPlacing ? 'progress_activity' : 'lock' }}</span>
            {{ isPlacing ? '...' : 'Objednať' }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
