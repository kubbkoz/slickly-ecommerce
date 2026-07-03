<script setup lang="ts">
import GlobalLoader from '~/components/ui/GlobalLoader.vue';
import Navbar from '~/components/layout/Navbar.vue';
import Footer from '~/components/layout/Footer.vue';
import PreFooter from '~/components/layout/PreFooter.vue';
import CartSidebar from '~/components/cart/CartSidebar.vue';
import MobileBottomNav from '~/components/layout/MobileBottomNav.vue';
import { useCart } from '@shopware/composables';

// Hreflang + canonical + og:locale tags pre všetky lokality (sk/cz/de/hu/en/pl).
// i18n v10 API: { dir, lang, seo } — `seo: true` generuje hreflang alternates
// + canonical link + og:locale meta. (`addSeoAttributes` bol v8 kľúč, ignorovaný.)
const i18nHead = useLocaleHead({ seo: true });
useHead(computed(() => ({
    htmlAttrs: i18nHead.value.htmlAttrs ?? {},
    link: i18nHead.value.link ?? [],
    meta: i18nHead.value.meta ?? [],
})));

// Global loader state — shared with useLanguageSwitcher (which calls showLoader() directly)
const { isLoading, hideLoader, showLoader, suppressOverlay } = usePageLoader();
const nuxtApp = useNuxtApp();

// Fix pre miznúci košík — globálne zosynchronizovanie košíka po načítaní aplikácie
const { refreshCart } = useCart();

// Timer for delayed overlay — fast navigations show skeleton only, slow show overlay
let overlayTimer: ReturnType<typeof setTimeout> | null = null;
let shownAt: number | null = null;
const THRESHOLD = 1800; // Emergency fallback: only show overlay if loading takes > 1.8s
const MIN_DISPLAY_TIME = 400; // If shown, keep for at least 400ms to allow recognition

// Client-side navigation START — delay overlay by THRESHOLD
// If suppressOverlay is set (subcategory click or variant change), skip overlay entirely
nuxtApp.hook('page:start', () => {
  if (suppressOverlay.value) return; 
  
  if (overlayTimer) clearTimeout(overlayTimer);
  overlayTimer = setTimeout(() => {
    showLoader();
    shownAt = Date.now();
  }, THRESHOLD);
});

// Client-side navigation END — clear timer + hide overlay with safety grace period
nuxtApp.hook('page:finish', () => {
  if (overlayTimer) {
    clearTimeout(overlayTimer);
    overlayTimer = null;
  }

  if (shownAt) {
    const elapsed = Date.now() - shownAt;
    const remaining = Math.max(0, MIN_DISPLAY_TIME - elapsed);
    
    setTimeout(() => {
      hideLoader();
      shownAt = null;
    }, remaining);
  } else {
    hideLoader(); 
  }
});

onMounted(async () => {
  // Synchronizácia košíka so serverom pri každom novom loade aplikácie
  // Rieši problém kedy bol košík prázdny pokým sa do neho niečo nepridalo (cache/session merge)
  try {
    if (typeof refreshCart === 'function') {
      await refreshCart();
    }
  } catch (e) {
    console.error('Failed to sync cart on mount:', e);
  }

  // If loader is visible from SSR, hide it after hydration unless navigating
  if (isLoading.value) {
    setTimeout(() => {
      // Small grace period to prevent abrupt flicker if client is very fast
      hideLoader();
    }, 200);
  }
});
</script>

<template>
  <!-- pb: statická mobilná bottom navigácia (60px + safe inset) nesmie prekrývať footer -->
  <div class="min-h-screen bg-white font-sans antialiased relative text-gray-900 layout-wrapper pb-[calc(60px+env(safe-area-inset-bottom,0px))] lg:pb-0" :data-loading="isLoading">
    <!-- Global Loader — visible immediately (SSR injected) + controlled by Vue for CSR navigations -->
    <GlobalLoader :is-visible="isLoading" />

    <ClientOnly>
      <CartSidebar />
    </ClientOnly>
    
    <!-- FIX-A11Y: Navbar component renders its own <nav> landmark internally.
         Using <div> wrapper avoids duplicate/nested landmark violations. -->
    <Navbar />
    
    <main id="main-content">
      <slot />
    </main>
    
    <PreFooter />

    <!-- FIX-A11Y: Footer component renders its own <footer> tag internally.
         Wrapping it in another <footer> caused "duplicate contentinfo landmark" a11y violation. -->
    <Footer />
    
    <ClientOnly>
      <LazyChatBot />
      <LazyWishlistToast />
      <LazyComparisonToast />
      <LazyScrollToTop />
      <MobileBottomNav />
    </ClientOnly>
  </div>
</template>



<style>
/* Spinner keyframe — referenced by inline style on overlay */
@keyframes mt-spin {
  to { transform: rotate(360deg); }
}

/* Overlay fade-out transition */
.overlay-leave-active {
  transition: opacity 350ms ease-in-out;
}
.overlay-leave-to {
  opacity: 0;
}

body {
  font-family: 'Space Grotesk', sans-serif;
  background-color: white;
  color: #111827; /* text-gray-900 */
}

h1, h2, h2, h3, h5, h6 {
  font-family: 'Space Grotesk', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.025em; /* tracking-wide */
  font-weight: 700; /* font-bold */
}

/* 
   FIX: Nahradenie zoom: 0.8 pre notebooky (1200px - 1536px).
   Namiesto neštandardného 'zoom' vlastnosti meníme veľkosť root fontu.
   Pretože Tailwind/UnoCSS používa 'rem' jednotky, zmenšením základu (16px -> 12.8px)
   sa celý UI proporčne zmenší na 80% veľkosti, čo je ekvivalent zoom: 0.8.
 */
@media screen and (min-width: 1200px) and (max-width: 1536px) {
  :root {
    font-size: 12.8px; /* 16px * 0.8 */
  }

  /* Zachovanie logiky pre roztiahnutie kontajnera z pôvodného kódu */
  .container {
    max-width: 100% !important;
    width: 100% !important;
  }
}
</style>
