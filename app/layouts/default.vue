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
    <AppHeader />
    <main class="flex-grow flex flex-col w-full relative pt-16 md:pt-0 pb-16 md:pb-0">
      <slot />
    </main>
    <AppFooter />
    <MobileBottomNav />
    <CartDrawer />
    <SearchOverlay />
  </div>
</template>
