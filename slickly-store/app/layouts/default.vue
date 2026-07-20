<script setup lang="ts">
import Navbar from '~/components/layout/Navbar.vue';
import MobileBottomNav from '~/components/layout/MobileBottomNav.vue';
// PreFooter + Footer are below the fold on every page but were hydrating eagerly
// (PageSpeed: ~9s Script Evaluation from the eager tree). Rendered below via the
// global Lazy* + `hydrate-on-visible` form so their SSR HTML still ships (SEO/links
// intact) but their client hydration — incl. Footer's category fetch + Newsletter
// form — is deferred until the user scrolls them into view.

// Async-loaded: the cart sidebar (already ClientOnly, only ever opened by user
// action) pulled its whole subtree — CartHeader/CartItem/CartCrossSellPanel/
// CartFooter/CartShippingBar/CartEmptyState — into this layout's own critical
// CSS, render-blocking on every single page load. Deferred to its own chunk.
const CartSidebar = defineAsyncComponent(() => import('~/components/cart/CartSidebar.vue'));

// Hreflang + canonical + og:locale tags pre všetky lokality (sk/cz/de/hu/en/pl).
// i18n v10 API: { dir, lang, seo } — `seo: true` generuje hreflang alternates
// + canonical link + og:locale meta. (`addSeoAttributes` bol v8 kľúč, ignorovaný.)
const i18nHead = useLocaleHead({ seo: true });
useHead(computed(() => ({
    htmlAttrs: i18nHead.value.htmlAttrs ?? {},
    link: i18nHead.value.link ?? [],
    meta: i18nHead.value.meta ?? [],
})));
</script>

<template>
  <!-- pb: statická mobilná bottom navigácia (60px + safe inset) nesmie prekrývať footer -->
  <div class="min-h-screen bg-white font-sans antialiased relative text-gray-900 layout-wrapper pb-[calc(60px+env(safe-area-inset-bottom,0px))] lg:pb-0">
    <ClientOnly>
      <CartSidebar />
    </ClientOnly>
    
    <!-- FIX-A11Y: Navbar component renders its own <nav> landmark internally.
         Using <div> wrapper avoids duplicate/nested landmark violations. -->
    <Navbar />
    
    <main id="main-content">
      <slot />
    </main>
    
    <LazyPreFooter hydrate-on-visible />

    <!-- FIX-A11Y: Footer component renders its own <footer> tag internally.
         Wrapping it in another <footer> caused "duplicate contentinfo landmark" a11y violation. -->
    <LazyFooter hydrate-on-visible />
    
    <!-- Statická spodná lišta: renderuje sa v SSR (deterministická, fixed bottom-0),
         aby bola viditeľná OKAMŽITE — nie až po dohydratovaní (~26 s). Badge s počtom
         v košíku je interne obalený v <ClientOnly> (SSR košík = prázdny). -->
    <MobileBottomNav />

    <ClientOnly>
      <LazyChatBot />
      <LazyWishlistToast />
      <LazyComparisonToast />
      <LazyScrollToTop />
    </ClientOnly>
  </div>
</template>



<style>
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
