<script setup lang="ts">
const cart = useCartStore()
const wishlist = useWishlistStore()
const locale = useLocaleStore()

onMounted(() => {
  cart.hydrate()
  wishlist.hydrate()
  locale.hydrate()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background text-on-background selection:bg-secondary-container selection:text-on-secondary-container">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-on-primary focus:px-4 focus:py-2 focus:rounded-default font-label-sm text-label-sm uppercase tracking-widest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-container"
    >
      Preskočiť na obsah
    </a>
    <AppHeader />
    <main id="main-content" class="flex-grow flex flex-col w-full relative pt-16 md:pt-0 pb-16 md:pb-0">
      <slot />
    </main>
    <AppFooter />
    <MobileBottomNav />
    <CartDrawer />
    <SearchOverlay />
  </div>
</template>
