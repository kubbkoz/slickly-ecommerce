<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { Home, User, ShoppingCart, Search, Heart } from 'lucide-vue-next';
// @ts-ignore
import { useCart, useUser } from '@shopware/composables';
// @ts-ignore
import { useUiState } from '~/composables/useUiState';
import { useCustomerWishlist } from '~/composables/useCustomerWishlist';
import { useRoute } from 'vue-router';

const { cartItems } = useCart();
const { toggleCartSidebar, toggleMobileSearch } = useUiState();
const { isLoggedIn } = useUser();
const { wishlistItems, loadWishlist } = useCustomerWishlist();
const route = useRoute();
const localePath = useLocalePath();
const config = useRuntimeConfig();

const isHomeActive = computed(() => route.path === localePath('/'));
const isAccountActive = computed(() => route.path.startsWith(localePath('/account')));

const _virtualIds = computed(() => [
    config.public.shopware.ids.products?.expressShipping,
    config.public.shopware.ids.products?.dobierka,
    config.public.shopware.ids.products?.balneBike,
    config.public.shopware.ids.products?.balneEbike,
].filter(Boolean) as string[]);
const cartCount = computed(() =>
    (cartItems.value || []).filter((i: any) =>
        i.type === 'product' && !_virtualIds.value.includes(i.referencedId)
    ).length
);

// Global modal state — shared with NavIcons.vue (same useState keys), so
// opening from the bottom nav reuses the exact same modal instances.
const isLoginModalOpen = useState('loginModalOpen', () => false);
const isWishlistModalOpen = useState('wishlistModalOpen', () => false);
// Lišta je STATICKÁ (app-like) — vždy viditeľná na mobile. State ostáva `true` a nemení sa;
// ChatBot ho stále číta pre svoje bottom offsety, preto sa kľúč nemaže.
const isBottomNavVisible = useState('mobileBottomNavVisible', () => true);
isBottomNavVisible.value = true;

onMounted(() => {
  loadWishlist();
});

function handleUserClick() {
  if (isLoggedIn.value) {
    navigateTo(localePath('/account'));
  } else {
    isLoginModalOpen.value = true;
  }
}

function handleWishlistClick() {
  if (!isLoggedIn.value) {
    isLoginModalOpen.value = true;
  } else {
    isWishlistModalOpen.value = true;
  }
}
</script>

<template>
    <div
      class="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] pb-safe"
      role="navigation"
      aria-label="Spodná mobilná navigácia"
    >
      <div class="h-[60px] flex items-center justify-between w-full">
        <!-- Domov -->
        <NuxtLink
          :to="localePath('/')"
          class="flex-1 flex flex-col items-center justify-center h-full min-w-0 transition-colors focus:outline-none"
          :class="isHomeActive ? 'text-amber' : 'text-gray-500 hover:text-brand'"
          aria-label="Domov"
        >
          <Home class="w-5 h-5 mb-1" />
          <span class="text-[9px] font-bold uppercase tracking-wider font-sans">Domov</span>
        </NuxtLink>

        <!-- Hľadať -->
        <button
          @click="toggleMobileSearch(true)"
          class="flex-1 flex flex-col items-center justify-center h-full min-w-0 text-gray-500 bg-transparent hover:text-brand transition-colors focus:outline-none"
          aria-label="Hľadať"
        >
          <Search class="w-5 h-5 mb-1" />
          <span class="text-[9px] font-bold uppercase tracking-wider font-sans">Hľadať</span>
        </button>

        <!-- Košík -->
        <button
          @click="toggleCartSidebar(true)"
          class="flex-1 flex flex-col items-center justify-center h-full min-w-0 text-gray-500 bg-transparent hover:text-brand transition-colors focus:outline-none relative group"
          aria-label="Košík"
        >
          <div class="relative">
            <ShoppingCart class="w-5 h-5 mb-1" />
            <span v-if="cartCount > 0" class="absolute -top-1.5 -right-2.5 bg-amber text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {{ cartCount }}
             </span>
          </div>
          <span class="text-[9px] font-bold uppercase tracking-wider font-sans">Košík</span>
        </button>

        <!-- Obľúbené -->
        <button
          @click="handleWishlistClick"
          class="flex-1 flex flex-col items-center justify-center h-full min-w-0 text-gray-500 bg-transparent hover:text-brand transition-colors focus:outline-none relative group"
          aria-label="Obľúbené"
        >
          <div class="relative">
            <ClientOnly>
              <Heart class="w-5 h-5 mb-1" />
              <span v-if="wishlistItems.length > 0" class="absolute -top-1.5 -right-2.5 bg-amber text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {{ wishlistItems.length }}
               </span>
              <template #fallback>
                <Heart class="w-5 h-5 mb-1" />
              </template>
            </ClientOnly>
          </div>
          <span class="text-[9px] font-bold uppercase tracking-wider font-sans">Obľúbené</span>
        </button>

        <!-- Účet -->
        <button
          @click="handleUserClick"
          class="flex-1 flex flex-col items-center justify-center h-full min-w-0 transition-colors focus:outline-none"
          :class="isAccountActive ? 'text-amber' : 'text-gray-500 hover:text-brand'"
          aria-label="Môj účet"
        >
          <User class="w-5 h-5 mb-1" />
          <span class="text-[9px] font-bold uppercase tracking-wider font-sans">Účet</span>
        </button>
      </div>
    </div>
</template>
