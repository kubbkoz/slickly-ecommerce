export default defineNuxtPlugin(() => {
  useCartStore().hydrate()
  useWishlistStore().hydrate()
  useRecentlyViewedStore().hydrate()
})
