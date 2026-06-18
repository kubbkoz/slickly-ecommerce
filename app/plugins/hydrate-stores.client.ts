export default defineNuxtPlugin(() => {
  useCartStore().hydrate()
  useWishlistStore().hydrate()
  useLocaleStore().hydrate()
  useRecentlyViewedStore().hydrate()
})
