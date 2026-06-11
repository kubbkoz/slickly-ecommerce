<script setup lang="ts">
const cart = useCartStore()
const router = useRouter()

useSeoMeta({
  title: 'Pokladňa | SLICKLY',
  description: 'Dokončite svoju objednávku SLICKLY.',
})

if (!cart.items.length) {
  await navigateTo('/kosik')
}

const formattedSubtotal = computed(() => `${cart.subtotal.toFixed(2)} €`)

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
  <div class="w-full md:max-w-[1536px] md:mx-auto px-gutter md:px-grid-margin py-stack-lg md:py-12">
    <!-- Breadcrumb -->
    <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant block mb-stack-lg md:mb-8">
      <NuxtLink to="/" class="hover:text-on-background">Domov</NuxtLink> /
      <NuxtLink to="/kosik" class="hover:text-on-background">Košík</NuxtLink> / Pokladňa
    </span>

    <h1 class="font-headline-lg text-headline-lg md:text-headline-xl uppercase border-b border-grid-line pb-stack-sm md:pb-6 mb-stack-lg md:mb-8">
      Pokladňa
    </h1>

    <!-- Success state -->
    <div v-if="isPlaced" class="flex flex-col items-center text-center gap-stack-md py-stack-lg md:py-section-padding-lg">
      <span class="material-symbols-outlined text-[64px] text-on-secondary-container">check_circle</span>
      <h2 class="font-headline-md text-headline-md uppercase">Ďakujeme za objednávku!</h2>
      <p class="font-body-md text-body-md text-on-surface-variant max-w-md">
        Potvrdenie objednávky sme odoslali na váš e-mail. Budete presmerovaní na domovskú stránku.
      </p>
    </div>

    <form v-else class="grid grid-cols-1 md:grid-cols-3 gap-stack-lg md:gap-16" @submit.prevent="placeOrder">
      <!-- Form -->
      <div class="md:col-span-2 flex flex-col gap-stack-lg">
        <fieldset class="flex flex-col gap-stack-sm">
          <legend class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm w-full mb-stack-sm">
            Kontaktné údaje
          </legend>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="E-mailová adresa"
            class="h-12 px-4 border border-outline-variant bg-surface-container-lowest font-body-md text-body-md outline-none focus:border-primary rounded-default"
          />
        </fieldset>

        <fieldset class="flex flex-col gap-stack-sm">
          <legend class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm w-full mb-stack-sm">
            Doručovacia adresa
          </legend>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-stack-sm">
            <input
              v-model="form.firstName"
              type="text"
              required
              placeholder="Meno"
              class="h-12 px-4 border border-outline-variant bg-surface-container-lowest font-body-md text-body-md outline-none focus:border-primary rounded-default"
            />
            <input
              v-model="form.lastName"
              type="text"
              required
              placeholder="Priezvisko"
              class="h-12 px-4 border border-outline-variant bg-surface-container-lowest font-body-md text-body-md outline-none focus:border-primary rounded-default"
            />
          </div>
          <input
            v-model="form.address"
            type="text"
            required
            placeholder="Adresa"
            class="h-12 px-4 border border-outline-variant bg-surface-container-lowest font-body-md text-body-md outline-none focus:border-primary rounded-default"
          />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-stack-sm">
            <input
              v-model="form.city"
              type="text"
              required
              placeholder="Mesto"
              class="h-12 px-4 border border-outline-variant bg-surface-container-lowest font-body-md text-body-md outline-none focus:border-primary rounded-default"
            />
            <input
              v-model="form.postalCode"
              type="text"
              required
              placeholder="PSČ"
              class="h-12 px-4 border border-outline-variant bg-surface-container-lowest font-body-md text-body-md outline-none focus:border-primary rounded-default"
            />
          </div>
          <input
            v-model="form.country"
            type="text"
            required
            placeholder="Krajina"
            class="h-12 px-4 border border-outline-variant bg-surface-container-lowest font-body-md text-body-md outline-none focus:border-primary rounded-default"
          />
        </fieldset>

        <fieldset class="flex flex-col gap-stack-sm">
          <legend class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm w-full mb-stack-sm">
            Spôsob platby
          </legend>
          <label class="flex items-center gap-stack-sm border border-outline-variant px-4 py-3 rounded-default cursor-pointer" :class="form.payment === 'card' ? 'border-primary' : ''">
            <input v-model="form.payment" type="radio" value="card" class="accent-black" />
            <span class="material-symbols-outlined">credit_card</span>
            <span class="font-body-md text-body-md">Platobná karta</span>
          </label>
          <label class="flex items-center gap-stack-sm border border-outline-variant px-4 py-3 rounded-default cursor-pointer" :class="form.payment === 'transfer' ? 'border-primary' : ''">
            <input v-model="form.payment" type="radio" value="transfer" class="accent-black" />
            <span class="material-symbols-outlined">account_balance</span>
            <span class="font-body-md text-body-md">Bankový prevod</span>
          </label>
          <label class="flex items-center gap-stack-sm border border-outline-variant px-4 py-3 rounded-default cursor-pointer" :class="form.payment === 'cod' ? 'border-primary' : ''">
            <input v-model="form.payment" type="radio" value="cod" class="accent-black" />
            <span class="material-symbols-outlined">local_shipping</span>
            <span class="font-body-md text-body-md">Dobierka</span>
          </label>
        </fieldset>
      </div>

      <!-- Summary -->
      <div class="flex flex-col gap-stack-md h-fit border border-grid-line p-stack-md md:p-6">
        <h2 class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant border-b border-grid-line pb-stack-sm">
          Vaša objednávka
        </h2>
        <div class="flex flex-col gap-stack-sm divide-y divide-grid-line">
          <div v-for="item in cart.items" :key="item.productId" class="flex justify-between items-center gap-stack-sm pt-stack-sm first:pt-0">
            <div class="flex items-center gap-stack-sm min-w-0">
              <div class="w-12 h-12 shrink-0 bg-surface-container-lowest border border-grid-line overflow-hidden">
                <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
              </div>
              <div class="min-w-0">
                <p class="font-body-md text-body-md truncate">{{ item.name }}</p>
                <p class="font-technical-data text-technical-data text-on-surface-variant uppercase">x{{ item.quantity }}</p>
              </div>
            </div>
            <span class="font-price-display text-price-display shrink-0">{{ (item.price * item.quantity).toFixed(2) }} €</span>
          </div>
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
          class="h-12 bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 rounded-default mt-stack-sm"
        >
          <span class="material-symbols-outlined">{{ isPlacing ? 'hourglass_empty' : 'lock' }}</span>
          {{ isPlacing ? 'Spracúva sa...' : 'Odoslať objednávku' }}
        </button>
      </div>
    </form>
  </div>
</template>
