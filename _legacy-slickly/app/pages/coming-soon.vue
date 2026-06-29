<script setup lang="ts">
import { HERO_IMAGE, HERO_VIDEO } from '~/data/media'

definePageMeta({ layout: 'coming-soon' })

useSeo({
  title: 'Pripravujeme niečo nové | SLICKLY',
  description: 'Nový e-shop SLICKLY sa pripravuje. Prémiová kozmetika na starostlivosť o interiér a exteriér vozidla, detailing a veľa iného. Zostaňte naladení.',
  noindex: true,
})

const ADMIN_EMAIL = 'hello@slickly.sk'
const ADMIN_PASSWORD = 'Fmhpx8g8@#'

const access = useSiteAccess()

// SSR renders only the poster image (great for LCP). After mount we check
// the reduced-motion preference and mount the hero <video> if allowed.
const allowMotion = ref(false)

onMounted(() => {
  allowMotion.value = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

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
let previouslyFocused: HTMLElement | null = null

function openLogin() {
  showLogin.value = true
}

function closeLogin() {
  showLogin.value = false
  loginError.value = ''
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && showLogin.value) closeLogin()
}
onBeforeUnmount(() => { window.removeEventListener('keydown', onKeydown) })
watch(showLogin, (open) => {
  if (!import.meta.client) return
  if (open) window.addEventListener('keydown', onKeydown)
  else window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) {
    previouslyFocused = document.activeElement as HTMLElement
    nextTick(() => loginEmailInput.value?.focus())
  } else {
    previouslyFocused?.focus()
  }
})

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
  <div class="relative flex-grow flex flex-col overflow-hidden">
    <NuxtImg
      :src="HERO_IMAGE"
      alt=""
      aria-hidden="true"
      fetchpriority="high"
      preload
      width="1920"
      height="1080"
      sizes="640px md:1024px"
      class="absolute inset-0 w-full h-full object-cover"
    />
    <video
      v-if="allowMotion"
      class="absolute inset-0 w-full h-full object-cover"
      autoplay
      muted
      loop
      playsinline
      aria-hidden="true"
    >
      <source :src="HERO_VIDEO" type="video/mp4" />
    </video>
    <div class="absolute inset-0 bg-primary/75"></div>

    <button
      type="button"
      class="fixed top-4 right-4 md:top-6 md:right-6 z-30 min-h-11 px-4 flex items-center gap-2 bg-white/20 border border-white/20 text-on-primary font-label-sm text-label-sm uppercase tracking-widest cursor-pointer transition-colors duration-200 hover:bg-white/30 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-container"
      @click="openLogin"
    >
      <span class="material-symbols-outlined text-[18px]" aria-hidden="true">lock</span>
      Prihlásiť sa
    </button>

    <div class="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-gutter md:px-grid-margin py-stack-lg gap-stack-lg md:gap-8">
      <p class="font-headline-md font-extrabold tracking-tighter leading-none text-[clamp(3.5rem,18vw,11rem)]">
        SL<span class="relative inline-block after:content-[''] after:absolute after:-top-[0.17em] after:left-1/2 after:-translate-x-1/2 after:w-[0.17em] after:h-[0.17em] after:bg-secondary-container after:rounded-full">I</span>CKLY
      </p>

      <div class="flex flex-col items-center gap-stack-sm md:gap-4 max-w-2xl">
        <span class="font-technical-data text-technical-data uppercase text-secondary-container tracking-widest">Spúšťame už</span>
        <h1 class="font-headline-lg text-headline-lg md:text-headline-xl uppercase">Čoskoro</h1>
        <p class="font-body-md md:text-body-lg text-white/70 max-w-xl">
          Pripravujeme nový e-shop s prémiovou kozmetikou na starostlivosť o interiér a exteriér vozidla, detailing a veľa iného.
        </p>
      </div>

      <div class="flex flex-col items-center gap-stack-xs max-w-xl">
        <p class="font-body-md md:text-body-lg text-on-primary">
          <span class="text-secondary-container font-bold">Stay tuned</span> a vyhraj balíček prémiovej autokozmetiky v hodnote 100 €.
        </p>
        <p class="font-body-md text-white/60">
          Zo zapojených mailov vyžrebujeme troch víťazov.
        </p>
      </div>

      <form v-if="!subscribed" class="w-full max-w-md flex flex-col items-center gap-stack-sm" @submit.prevent="subscribe">
        <p class="font-label-sm text-label-sm text-white/50 max-w-md text-center">
          * Kliknutím na tlačidlo súhlasíte so spracovaním osobných údajov.
        </p>
        <div class="w-full flex flex-col sm:flex-row gap-stack-sm">
          <label for="coming-soon-email" class="sr-only">E-mailová adresa</label>
          <input
            id="coming-soon-email"
            v-model="newsletterEmail"
            type="email"
            required
            autocomplete="email"
            placeholder="vas@email.sk"
            class="flex-grow h-12 px-4 bg-surface-container-lowest text-on-background font-body-md text-body-md outline-none rounded-default focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            :disabled="isSubscribing"
            class="h-12 px-8 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-[background-color,transform,opacity] duration-200 active:scale-[0.99] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span class="material-symbols-outlined" :class="isSubscribing ? 'animate-spin' : ''" aria-hidden="true">{{ isSubscribing ? 'progress_activity' : 'notifications' }}</span>
            {{ isSubscribing ? 'Spracúva sa...' : 'Upozorniť ma' }}
          </button>
        </div>
      </form>

      <div v-else role="status" class="flex items-center gap-2 text-secondary-container">
        <span class="material-symbols-outlined" aria-hidden="true">check_circle</span>
        <span class="font-label-sm text-label-sm uppercase tracking-widest">Ďakujeme! Dame vám vedieť hneď po spustení.</span>
      </div>
    </div>

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
          v-if="showLogin"
          class="fixed inset-0 z-[60] bg-on-background/60"
          @click="closeLogin"
        />
      </Transition>

      <Transition
        enter-active-class="transition-opacity duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showLogin"
          class="fixed inset-0 z-[70] flex items-center justify-center px-gutter"
          role="dialog"
          aria-modal="true"
          aria-label="Prihlásenie"
        >
          <form class="w-full max-w-sm bg-primary text-on-primary border border-white/10 rounded-default p-stack-lg flex flex-col gap-stack-sm shadow-xl" @submit.prevent="login">
            <div class="flex items-center justify-between">
              <span class="font-label-sm text-label-sm uppercase tracking-widest text-white/70">Prihlásenie</span>
              <button
                type="button"
                aria-label="Zavrieť prihlásenie"
                class="min-w-11 min-h-11 -mr-2 flex items-center justify-center text-white/50 hover:text-white cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-container"
                @click="closeLogin"
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
              class="h-12 px-4 bg-surface-container-lowest text-on-background font-body-md text-body-md outline-none rounded-default focus:ring-2 focus:ring-primary"
            />

            <label for="coming-soon-login-password" class="sr-only">Heslo</label>
            <input
              id="coming-soon-login-password"
              v-model="loginPassword"
              type="password"
              required
              autocomplete="current-password"
              placeholder="Heslo"
              class="h-12 px-4 bg-surface-container-lowest text-on-background font-body-md text-body-md outline-none rounded-default focus:ring-2 focus:ring-primary"
            />

            <p v-if="loginError" role="alert" class="font-label-sm text-label-sm text-error-container">
              {{ loginError }}
            </p>

            <button
              type="submit"
              :disabled="isLoggingIn"
              class="h-12 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-[background-color,transform,opacity] duration-200 active:scale-[0.99] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span class="material-symbols-outlined" :class="isLoggingIn ? 'animate-spin' : ''" aria-hidden="true">{{ isLoggingIn ? 'progress_activity' : 'lock_open' }}</span>
              {{ isLoggingIn ? 'Prihlasovanie...' : 'Vstúpiť' }}
            </button>
          </form>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
