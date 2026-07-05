<script setup lang="ts">
import { ShieldCheck, User } from 'lucide-vue-next';
// @ts-ignore
import { useUser } from '@shopware/composables';

const { user, isLoggedIn } = useUser();
const isLoginModalOpen = useState('loginModalOpen', () => false);
const localePath = useLocalePath();

function handleUserClick() {
  if (isLoggedIn.value) navigateTo(localePath('/account'));
  else isLoginModalOpen.value = true;
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans flex flex-col">

    <header class="bg-black flex-shrink-0 shadow-xl fixed top-0 left-0 right-0 z-50">
      <!-- Amber akcentová linka na vrchu -->
      <div class="h-[3px] bg-amber w-full"></div>

      <div class="container mx-auto px-4 lg:px-8 h-[72px] flex items-center justify-between">

        <!-- LEFT — rovnaká šírka ako right pre symetrické centrovanie na desktope;
             na mobile prirodzená šírka (center steps je tam skryté, netreba symetriu) -->
        <div class="w-auto lg:w-[300px] flex items-center gap-5 flex-shrink-0">
          <NuxtLink :to="localePath('/')" aria-label="SLICKLY Domov"
            class="font-tech font-black uppercase leading-none tracking-tighter flex items-baseline text-white text-[2.5rem]">
            <span>SL</span><span class="logo-i-wrap"><span class="logo-i-dot bg-amber"></span>I</span><span>CKLY</span>
          </NuxtLink>
          <div class="hidden lg:flex items-center gap-2 border-l border-gray-700 pl-5 text-gray-200">
            <ShieldCheck class="w-4 h-4 text-amber flex-shrink-0" />
            <span class="text-xs font-bold uppercase tracking-widest whitespace-nowrap">Bezpečný nákup</span>
          </div>
        </div>

        <!-- CENTER — steps symetricky vycentrované. Iba desktop (lg+) — na mobile
             by fixné w-[300px] bočné stĺpce steps pretlačili cez logo (viď mobilný pruh nižšie). -->
        <div class="hidden lg:flex flex-1 justify-center items-center">
          <CheckoutSteps :current-step="1" surface="dark" />
        </div>

        <!-- RIGHT — rovnaká šírka ako left -->
        <div class="w-auto lg:w-[300px] flex justify-end flex-shrink-0">
          <button
            @click="handleUserClick"
            class="flex items-center gap-2 text-white hover:text-amber transition-colors bg-gray-900 border border-gray-700 hover:border-gray-500 px-4 py-2.5 focus:outline-none"
            aria-label="Prihlásiť sa / Môj účet"
          >
            <User class="w-4 h-4 flex-shrink-0" />
            <span class="text-[11px] font-bold uppercase tracking-widest font-sans">
              <template v-if="isLoggedIn && user?.firstName">{{ user.firstName }}</template>
              <template v-else>Prihlásiť sa</template>
            </span>
          </button>
        </div>

      </div>

      <!-- Mobilný pruh s krokmi — POD hlavným riadkom (nie cez logo). Amber pozadie, čierne písmo. -->
      <div class="lg:hidden bg-amber py-2.5 flex justify-center border-t border-black/10">
        <CheckoutSteps :current-step="1" surface="amber" />
      </div>
    </header>

    <!-- Spacer zodpovedajúci výške headera (3px + 72px, + mobilný pruh s krokmi na < lg) -->
    <div class="h-[123px] lg:h-[75px] flex-shrink-0"></div>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-gray-200 bg-white py-4 flex-shrink-0">
      <div class="container mx-auto px-4 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest font-sans">
        © {{ new Date().getFullYear() }} SLICKLY s.r.o.
        <span class="mx-2 text-gray-300">·</span>Bezpečné SSL šifrovanie
        <span class="mx-2 text-gray-300">·</span>GDPR
      </div>
    </footer>

    <AppModal :is-open="isLoginModalOpen" title="Prihlásenie" @close="isLoginModalOpen = false">
      <LoginForm @success="isLoginModalOpen = false" @close="isLoginModalOpen = false" />
    </AppModal>

  </div>
</template>

<style scoped>
/* Decorative amber dot above the "I" (uppercase has no natural tittle) */
.logo-i-wrap {
  position: relative;
  display: inline-block;
}
.logo-i-dot {
  position: absolute;
  top: -0.32em;
  left: 50%;
  transform: translateX(-50%);
  width: 0.16em;
  height: 0.16em;
  border-radius: 9999px;
}
</style>
