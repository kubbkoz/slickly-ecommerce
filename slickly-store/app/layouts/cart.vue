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
      <!-- Brand červená linka na vrchu -->
      <div class="h-[3px] bg-brand w-full"></div>

      <div class="container mx-auto px-4 lg:px-8 h-[72px] flex items-center">

        <!-- LEFT — rovnaká šírka ako right pre symetrické centrovanie -->
        <div class="w-[300px] flex items-center gap-5 flex-shrink-0">
          <NuxtLink :to="localePath('/')" aria-label="SLICKLY Domov"
            class="font-tech font-black italic uppercase leading-none tracking-tighter flex items-baseline">
            <span class="text-brand text-[2.5rem]">MT</span>
            <span class="text-white text-[2.5rem]">SPORT</span>
            <span class="text-brand text-[2.5rem]">.</span>
          </NuxtLink>
          <div class="hidden lg:flex items-center gap-2 border-l border-gray-700 pl-5 text-gray-200">
            <ShieldCheck class="w-4 h-4 text-brand flex-shrink-0" />
            <span class="text-xs font-bold uppercase tracking-widest whitespace-nowrap">Bezpečný nákup</span>
          </div>
        </div>

        <!-- CENTER — steps symetricky vycentrované -->
        <div class="flex-1 flex justify-center items-center">
          <CheckoutSteps :current-step="1" :dark="true" />
        </div>

        <!-- RIGHT — rovnaká šírka ako left -->
        <div class="w-[300px] flex justify-end flex-shrink-0">
          <button
            @click="handleUserClick"
            class="flex items-center gap-2 text-white hover:text-brand transition-colors bg-gray-900 border border-gray-700 hover:border-gray-500 px-4 py-2.5 focus:outline-none"
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
    </header>

    <!-- Spacer zodpovedajúci výške headera (3px + 72px) -->
    <div class="h-[75px] flex-shrink-0"></div>

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
