<script setup lang="ts">
import { ref, computed } from 'vue';
import { ShoppingCart, Search, User, Menu, X, LogOut, Settings, Loader2, Heart, Trash2, Scale } from 'lucide-vue-next';
// @ts-ignore
import { useUser, useCart, usePrice, useSessionContext } from '@shopware/composables';
// @ts-ignore
import { useUiState } from '~/composables/useUiState';
import { onClickOutside } from '@vueuse/core';
import AppModal from '~/components/ui/AppModal.vue';
import LoginForm from '~/components/auth/LoginForm.vue';
import { useCustomerWishlist } from '~/composables/useCustomerWishlist';
import { useProductComparison } from '~/composables/useProductComparison';

// ---------------------------------------------------------------------------
// State — useUser() called in setup context ✓
// ---------------------------------------------------------------------------
const { user, isLoggedIn, logout, refreshUser } = useUser();
const { refreshSessionContext } = useSessionContext();
const { count, cart, cartItems } = useCart();
const { getFormattedPrice } = usePrice();
const {
  toggleMobileMenu,
  toggleMobileSearch,
  isMobileMenuOpen,
  toggleCartSidebar,
} = useUiState();

const isLoginModalOpen = useState('loginModalOpen', () => false);
const oauthSuccessEmail = useState<string | null>('oauthSuccessEmail', () => null);
const oauthErrorCode = useState<string | null>('oauthErrorCode', () => null);
const oauthPrefillEmail = useState<string | null>('oauthPrefillEmail', () => null);
const isUserMenuOpen = ref(false);
const isAuthLoading = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);
onClickOutside(userMenuRef, () => { isUserMenuOpen.value = false; });

// ── OAuth return-from-redirect handler ─────────────────────────────────────
// Server callback redirectuje na /?oauth_success=<email> alebo /?oauth_error=<code>.
// Detekujeme query param → otvoríme modal v príslušnom stave + cleanup URL.
const route = useRoute();
const router = useRouter();

watch(
  () => [route.query.oauth_success, route.query.oauth_error, route.query.oauth_email] as const,
  async ([success, error, prefillEmail]) => {
    if (success) {
      oauthSuccessEmail.value = decodeURIComponent(String(success));
      oauthErrorCode.value = null;
      oauthPrefillEmail.value = null;
      isLoginModalOpen.value = true;
      if (import.meta.client) {
        try {
          await refreshSessionContext();
          await refreshUser();
        } catch (e) {
          console.warn('[OAuth] refreshSessionContext failed on success:', e);
        }
      }
    } else if (error) {
      oauthErrorCode.value = String(error);
      oauthSuccessEmail.value = null;
      oauthPrefillEmail.value = prefillEmail ? decodeURIComponent(String(prefillEmail)) : null;
      isLoginModalOpen.value = true;
    } else return;

    // Clean URL — odstráň oauth_* query params bez page reloadu
    const cleanQuery = { ...route.query };
    delete cleanQuery.oauth_success;
    delete cleanQuery.oauth_error;
    delete cleanQuery.oauth_email;
    router.replace({ path: route.path, query: cleanQuery });
  },
  { immediate: true },
);

const { wishlistItems, isWishlistLoading, loadWishlist, toggleWishlist } = useCustomerWishlist();
const isWishlistModalOpen = useState('wishlistModalOpen', () => false);
const { comparisonItems, comparisonCount } = useProductComparison();
const isComparisonNavOpen = useState('comparisonNavOpen', () => false);

onMounted(() => {
  loadWishlist();
});

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
const { adjustPrice } = useCountrySelector();
// Sum from cartItems excluding virtual products (positionPrice includes dobierka/express)
const formattedTotalPrice = computed(() => {
    const total = (cartItems.value || [])
        .filter((i: any) => !_virtualIds.value.includes(i.referencedId))
        .reduce((sum: number, i: any) => sum + (i.price?.totalPrice || 0), 0);
    return getFormattedPrice(adjustPrice(total));
});

// Cart bounce animation
const isCartAnimating = ref(false);
const { start: resetAnimation } = useTimeoutFn(() => { isCartAnimating.value = false; }, 600, { immediate: false });
watch(count, (n, o) => {
  if (n > (o || 0)) { isCartAnimating.value = true; resetAnimation(); }
});

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------
function handleUserClick() {
  if (isLoggedIn.value) {
    navigateTo('/account');
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


async function handleLogout() {
  isUserMenuOpen.value = false;
  isAuthLoading.value = true;
  try {
    await logout();
    await refreshSessionContext();
  } finally {
    isAuthLoading.value = false;
  }
  navigateTo('/');
}

function handleLoginSuccess() {
  isLoginModalOpen.value = false;
  oauthSuccessEmail.value = null;
  oauthErrorCode.value = null;
  oauthPrefillEmail.value = null;
}

function handleLoginClose() {
  isLoginModalOpen.value = false;
  oauthSuccessEmail.value = null;
  oauthErrorCode.value = null;
  oauthPrefillEmail.value = null;
}

const handleRemoveFromWishlist = async (id: string, name: string) => {
  await toggleWishlist(id);
  const toast = useState('wishlistToast', () => ({ show: false, productName: '', action: 'add' as 'add' | 'remove' }));
  toast.value = { 
    show: true, 
    productName: name, 
    action: 'remove' 
  };
};
</script>

<template>
  <div class="flex items-center space-x-3 text-white z-50">
    <!-- Search — mobile/tablet (<lg) now has its own tab in MobileBottomNav, so
         this desktop-only icon avoids a duplicate entry point below lg. -->
    <button
      class="hidden lg:flex text-white hover:text-amber transition-all duration-300 focus:outline-none rounded-sm bg-black p-2"
      @click="toggleMobileSearch(true)"
      aria-label="Hľadať"
    >
      <Search class="w-6 h-6" />
    </button>

    <!-- Porovnanie -->
    <button
      class="hidden md:flex text-white hover:text-amber transition-all duration-300 rounded-sm items-center bg-black p-2 relative"
      @click="isComparisonNavOpen = true"
      aria-label="Porovnanie produktov"
    >
      <ClientOnly>
        <span class="flex items-center gap-2">
          <Scale class="w-6 h-6" />
          <span
            v-if="comparisonCount > 0"
            class="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-black"
          >
            {{ comparisonCount }}
          </span>
        </span>
        <template #fallback>
          <Scale class="w-6 h-6" />
        </template>
      </ClientOnly>
    </button>

    <!-- Obľúbené — desktop only, MobileBottomNav has its own tab below lg -->
    <button
      class="hidden lg:flex text-white hover:text-amber transition-all duration-300 rounded-sm items-center bg-black p-2 relative"
      @click="handleWishlistClick"
      aria-label="Obľúbené"
    >
      <ClientOnly>
         <span class="flex items-center gap-2">
            <Heart class="w-6 h-6" />
            <span
              v-if="wishlistItems.length > 0"
              class="absolute top-0 right-0 bg-amber text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-black"
            >
              {{ wishlistItems.length }}
            </span>
         </span>
         <template #fallback>
           <span class="flex items-center gap-2">
             <Heart class="w-6 h-6" />
           </span>
         </template>
      </ClientOnly>
    </button>

    <!-- User / Account -->
    <div class="relative hidden md:block">
      <button
        class="flex text-white hover:text-amber transition-colors rounded-sm items-center bg-black p-2"
        @click="handleUserClick"
        aria-label="Môj účet"
      >
        <ClientOnly>
          <span class="flex items-center">
            <Loader2 v-if="isAuthLoading" class="w-6 h-6 animate-spin" />
            <User v-else class="w-6 h-6" />
            <span
              v-if="isLoggedIn && user?.firstName"
              class="ml-2 text-xs font-bold uppercase hidden xl:block"
            >
              {{ user.firstName }}
            </span>
          </span>
          <template #fallback>
            <span class="flex items-center">
              <User class="w-6 h-6" />
            </span>
          </template>
        </ClientOnly>
      </button>

      <!-- Logged-in dropdown removed based on request -->
    </div>

    <!-- Cart -->
    <button
      class="hidden lg:flex text-white hover:text-amber transition-all duration-300 group rounded-sm bg-black p-2 items-center gap-2"
      :class="{ 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto': isMobileMenuOpen }"
      @click="toggleCartSidebar(true)"
      aria-label="Košík"
    >
      <ClientOnly>
        <span class="flex items-center gap-2">
          <div class="relative" :class="{ 'animate-bounce': isCartAnimating }">
            <ShoppingCart class="w-6 h-6" />
            <span
              v-if="cartCount > 0"
              class="absolute -top-2 -right-2 bg-amber text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-black"
            >
              {{ cartCount }}
            </span>
          </div>
          <span class="text-sm font-bold font-montserrat hidden xl:block min-w-[4rem] text-center">
            {{ formattedTotalPrice }}
          </span>
        </span>
      </ClientOnly>
    </button>

    <!-- Mobile Menu Toggle -->
    <button
      class="lg:hidden text-white hover:text-amber transition-colors rounded-sm bg-black p-2"
      @click="toggleMobileMenu()"
      aria-label="Menu"
    >
      <X v-if="isMobileMenuOpen" class="w-7 h-7" />
      <Menu v-else class="w-7 h-7" />
    </button>

    <!-- Login Modal — title sa mení podľa OAuth state -->
    <AppModal
      :is-open="isLoginModalOpen"
      :title="oauthSuccessEmail ? 'Prihlásenie úspešné' : 'Prihlásenie'"
      @close="handleLoginClose"
    >
      <LoginForm
        :oauth-success="oauthSuccessEmail || undefined"
        :oauth-error="oauthErrorCode || undefined"
        :oauth-prefill-email="oauthPrefillEmail || undefined"
        @success="handleLoginSuccess"
        @close="handleLoginClose"
      />
    </AppModal>

    <!-- Wishlist Modal -->
    <AppModal
      :is-open="isWishlistModalOpen"
      title="Moje Obľúbené"
      @close="isWishlistModalOpen = false"
    >
       <div v-if="isWishlistLoading" class="flex justify-center p-8"><Loader2 class="w-8 h-8 animate-spin text-brand" /></div>
       <div v-else-if="wishlistItems.length === 0" class="text-center p-8 text-gray-500 font-bold uppercase tracking-wider text-sm">
          Zatiaľ nemáte žiadne obľúbené produkty.
       </div>
       <div v-else class="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <div v-for="item in wishlistItems" :key="item.id" class="flex items-center gap-4 bg-zinc-900 p-3 shadow-sm border border-zinc-800 group transition-colors hover:border-zinc-700">
             <NuxtLink :to="`/detail/${item.id}`" @click="isWishlistModalOpen = false" class="w-16 h-16 bg-white shrink-0 block">
               <img :src="item?.cover?.media?.url || 'https://placehold.co/100'" class="w-full h-full object-contain p-1" />
             </NuxtLink>
             <div class="flex-1 min-w-0">
                <NuxtLink :to="`/detail/${item.id}`" @click="isWishlistModalOpen = false" class="text-sm font-bold text-white uppercase tracking-wide group-hover:text-amber transition-colors truncate block">
                   {{ item?.translated?.name || (item as any)?.name }}
                </NuxtLink>
                <div class="text-xs text-gray-400 font-montserrat mt-1" v-if="item.calculatedPrice">
                    {{ getFormattedPrice(adjustPrice(item.calculatedPrice.unitPrice)) }}
                </div>
             </div>
              <button 
                @click="handleRemoveFromWishlist(item.id, item.translated?.name || (item as any)?.name || '')" 
                class="p-3 text-gray-500 hover:text-amber transition-colors bg-black rounded-sm border border-zinc-800 hover:border-brand/30"
                aria-label="Odstrániť z obľúbených"
              >
                <Trash2 class="w-5 h-5"/>
             </button>
          </div>
       </div>
    </AppModal>

    <!-- Comparison Modal (triggered from navbar) -->
    <ClientOnly>
      <ComparisonModal :is-open="isComparisonNavOpen" @close="isComparisonNavOpen = false" />
    </ClientOnly>
  </div>
</template>
