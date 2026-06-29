// SPA scroll behavior — resetuje scroll position pri každej navigácii.
// Vue Router default neresetuje scroll → tento plugin to rieši.
//
// Synchrónna verzia bez hook Promise patternu — žiadne riziko blokovania
// navigation flow. Nuxt sám delay-ne scroll pokiaľ Suspense nevyriesi async.

export default defineNuxtPlugin(() => {
  const router = useRouter();

  router.options.scrollBehavior = (to, from, savedPosition) => {
    // Back/forward navigation — restore previous scroll
    if (savedPosition) return savedPosition;

    // Anchor link (smooth scroll na element s navbar offsetom)
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 80,
      };
    }

    // Same route, iba query/hash zmena → nescrollovať
    if (to.path === from.path) return false;

    // Default — top instant (Nuxt automaticky delay-ne pokiaľ Suspense nedoresolve)
    return { top: 0, left: 0 };
  };
});
