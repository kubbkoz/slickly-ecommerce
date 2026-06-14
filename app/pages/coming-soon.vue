<script setup lang="ts">
definePageMeta({ layout: 'coming-soon' })

useSeo({
  title: 'Pripravujeme niečo nové | SLICKLY',
  description: 'Nový e-shop SLICKLY sa pripravuje. Laboratórne kalibrovaná keramická ochrana, detailing a starostlivosť o vozidlo. Zostaňte naladení.',
  noindex: true,
})

const ADMIN_EMAIL = 'hello@slickly.sk'
const ADMIN_PASSWORD = 'Fmhpx8g8@#'

const access = useSiteAccess()

const newsletterEmail = ref('')
const isSubscribing = ref(false)
const subscribed = ref(false)

async function subscribe() {
  if (!newsletterEmail.value) return
  isSubscribing.value = true
  await new Promise((resolve) => setTimeout(resolve, 600))
  subscribed.value = true
  isSubscribing.value = false
  newsletterEmail.value = ''
}

const showLogin = ref(false)
const loginEmailInput = ref<HTMLInputElement | null>(null)
const loginEmail = ref('')
const loginPassword = ref('')
const loginError = ref('')
const isLoggingIn = ref(false)

function openLogin() {
  showLogin.value = true
  nextTick(() => loginEmailInput.value?.focus())
}

async function login() {
  loginError.value = ''
  isLoggingIn.value = true
  await new Promise((resolve) => setTimeout(resolve, 400))
  if (loginEmail.value.trim().toLowerCase() === ADMIN_EMAIL && loginPassword.value === ADMIN_PASSWORD) {
    access.value = 'granted'
    await navigateTo('/')
    return
  }
  loginError.value = 'Nesprávny e-mail alebo heslo.'
  isLoggingIn.value = false
}
</script>

<template>
  <div class="flex-grow flex flex-col relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none opacity-10 bg-blueprint"></div>

    <div class="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-gutter md:px-grid-margin py-stack-lg gap-stack-lg md:gap-8">
      <NuxtLink to="/coming-soon" class="font-headline-md text-headline-sm md:text-headline-md font-bold tracking-tighter">
        SLICKL<span class="logo-dot">Y</span>
      </NuxtLink>

      <div class="flex flex-col items-center gap-stack-sm md:gap-4 max-w-2xl">
        <span class="font-technical-data text-technical-data uppercase text-secondary-container tracking-widest">Spúšťame sa</span>
        <h1 class="font-headline-xl text-headline-xl md:text-display-lg uppercase">Čoskoro</h1>
        <p class="font-body-md md:text-body-lg text-white/70 max-w-xl">
          Pripravujeme nový e-shop s laboratórne kalibrovanou keramickou ochranou, detailingom a starostlivosťou o vozidlo. Zostaňte naladení.
        </p>
      </div>

      <form v-if="!subscribed" class="w-full max-w-md flex flex-col sm:flex-row gap-stack-sm" @submit.prevent="subscribe">
        <label for="coming-soon-email" class="sr-only">E-mailová adresa</label>
        <input
          id="coming-soon-email"
          v-model="newsletterEmail"
          type="email"
          required
          autocomplete="email"
          placeholder="vas@email.sk"
          class="flex-grow h-12 px-4 bg-white text-on-background font-body-md text-body-md outline-none rounded-default focus:ring-2 focus:ring-secondary-container"
        />
        <button
          type="submit"
          :disabled="isSubscribing"
          class="h-12 px-8 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.99] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <span class="material-symbols-outlined" :class="isSubscribing ? 'animate-spin' : ''" aria-hidden="true">{{ isSubscribing ? 'progress_activity' : 'notifications' }}</span>
          {{ isSubscribing ? 'Spracúva sa...' : 'Upozorniť ma' }}
        </button>
      </form>

      <div v-else role="status" class="flex items-center gap-2 text-secondary-container">
        <span class="material-symbols-outlined" aria-hidden="true">check_circle</span>
        <span class="font-label-sm text-label-sm uppercase tracking-widest">Ďakujeme! Dame vám vedieť hneď po spustení.</span>
      </div>
    </div>

    <div class="relative z-10 w-full px-gutter md:px-grid-margin py-stack-md flex flex-col items-center gap-stack-sm border-t border-white/10">
      <button
        v-if="!showLogin"
        type="button"
        class="font-label-sm text-label-sm uppercase tracking-widest text-white/50 hover:text-white cursor-pointer transition-colors duration-200 py-stack-sm rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-container"
        @click="openLogin"
      >
        Máte prístup? Prihláste sa
      </button>

      <form v-else class="w-full max-w-sm flex flex-col gap-stack-sm" @submit.prevent="login">
        <div class="flex items-center justify-between">
          <span class="font-label-sm text-label-sm uppercase tracking-widest text-white/70">Prihlásenie</span>
          <button
            type="button"
            aria-label="Zavrieť prihlásenie"
            class="min-w-11 min-h-11 -mr-2 flex items-center justify-center text-white/50 hover:text-white cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-container"
            @click="showLogin = false; loginError = ''"
          >
            <span class="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </div>

        <label for="coming-soon-login-email" class="sr-only">E-mail</label>
        <input
          id="coming-soon-login-email"
          ref="loginEmailInput"
          v-model="loginEmail"
          type="email"
          required
          autocomplete="email"
          placeholder="E-mail"
          class="h-12 px-4 bg-white text-on-background font-body-md text-body-md outline-none rounded-default focus:ring-2 focus:ring-secondary-container"
        />

        <label for="coming-soon-login-password" class="sr-only">Heslo</label>
        <input
          id="coming-soon-login-password"
          v-model="loginPassword"
          type="password"
          required
          autocomplete="current-password"
          placeholder="Heslo"
          class="h-12 px-4 bg-white text-on-background font-body-md text-body-md outline-none rounded-default focus:ring-2 focus:ring-secondary-container"
        />

        <p v-if="loginError" role="alert" class="font-label-sm text-label-sm text-error-container">
          {{ loginError }}
        </p>

        <button
          type="submit"
          :disabled="isLoggingIn"
          class="h-12 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.99] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <span class="material-symbols-outlined" :class="isLoggingIn ? 'animate-spin' : ''" aria-hidden="true">{{ isLoggingIn ? 'progress_activity' : 'lock_open' }}</span>
          {{ isLoggingIn ? 'Prihlasovanie...' : 'Vstúpiť' }}
        </button>
      </form>
    </div>
  </div>
</template>
