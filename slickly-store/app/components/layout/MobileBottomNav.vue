<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Home, Heart, ShoppingCart, ChevronUp } from 'lucide-vue-next';
// @ts-ignore
import { useCart, useUser } from '@shopware/composables';
// @ts-ignore
import { useUiState } from '~/composables/useUiState';
import { useCustomerWishlist } from '~/composables/useCustomerWishlist';
import { useRouter } from 'vue-router';

const { cartItems } = useCart();
const { toggleCartSidebar } = useUiState();
const { wishlistItems } = useCustomerWishlist();
const { isLoggedIn } = useUser();
const router = useRouter();
const config = useRuntimeConfig();

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

// Global modal state
const isWishlistModalOpen = useState('wishlistModalOpen', () => false);
const isLoginModalOpen = useState('loginModalOpen', () => false);
const isBottomNavVisible = useState('mobileBottomNavVisible', () => false);
const forceOverrideNavVisibility = useState<boolean | null>('forceOverrideNavVisibility', () => null);

let lastScrollY = 0;

const handleScroll = () => {
  if (forceOverrideNavVisibility.value !== null) {
     isBottomNavVisible.value = forceOverrideNavVisibility.value;
     return;
  }
  const currentScrollY = window.scrollY;
  // Objaví sa on scroll dole - ukážeme ak scrolloval viac ako 200px
  if (currentScrollY > 200) {
     isBottomNavVisible.value = true;
  } else {
     isBottomNavVisible.value = false;
  }
};

watch(forceOverrideNavVisibility, (newVal) => {
   if (newVal !== null) {
      isBottomNavVisible.value = newVal;
   } else {
      handleScroll();
   }
});

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const handleWishlistClick = () => {
  if (!isLoggedIn.value) {
    isLoginModalOpen.value = true;
  } else {
    isWishlistModalOpen.value = true;
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <Transition
    enter-active-class="transition-transform duration-300 ease-out"
    enter-from-class="translate-y-full"
    enter-to-class="translate-y-0"
    leave-active-class="transition-transform duration-200 ease-in"
    leave-from-class="translate-y-0"
    leave-to-class="translate-y-full"
  >
    <div 
      v-show="isBottomNavVisible" 
      class="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] pb-safe"
      role="navigation"
      aria-label="Spodná mobilná navigácia"
    >
      <div class="h-[60px] flex items-center justify-between px-2 gap-3 w-full">
        <!-- Košík -->
        <button 
          @click="toggleCartSidebar(true)"
          class="flex flex-col items-center justify-center w-[64px] h-full flex-shrink-0 text-gray-500 bg-transparent hover:text-brand transition-colors focus:outline-none relative group"
        >
          <div class="relative">
            <ShoppingCart class="w-5 h-5 mb-1" />
            <span v-if="cartCount > 0" class="absolute -top-1.5 -right-2.5 bg-amber text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {{ cartCount }}
             </span>
          </div>
          <span class="text-[9px] font-bold uppercase tracking-wider font-sans">Košík</span>
        </button>

        <!-- Dynamic CTA Slot -->
        <div id="mobile-nav-cta" class="flex-1 flex justify-center empty:hidden"></div>

        <!-- Scroll to Top -->
        <button 
          @click="scrollToTop"
          class="flex flex-col items-center justify-center w-[64px] h-full flex-shrink-0 text-black bg-transparent hover:text-brand transition-colors focus:outline-none"
        >
          <ChevronUp class="w-5 h-5 mb-1" />
          <span class="text-[9px] font-bold uppercase tracking-wider font-sans">Hore</span>
        </button>
      </div>
    </div>
  </Transition>
</template>
