export default defineNuxtPlugin(() => {
  useRecentlyViewedStore().hydrate()
})
