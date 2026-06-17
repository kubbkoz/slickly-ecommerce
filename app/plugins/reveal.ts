/**
 * v-reveal — fades elements up as they scroll into view.
 *
 * Usage: <section v-reveal> ... </section>
 *
 * Registered universally (so SSR can resolve the directive) but all browser
 * work is guarded to the client. On the client it adds `.reveal` (hiding the
 * element) and then `.is-revealed` once it intersects the viewport. Skipped
 * when the user prefers reduced motion, so content is never hidden from them.
 */
export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null
  let reduceMotion = false

  if (import.meta.client) {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduceMotion && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries, obs) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed')
              obs.unobserve(entry.target)
            }
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      )
    }
  }

  nuxtApp.vueApp.directive('reveal', {
    // Prevents SSR from choking on a directive with no server behaviour.
    getSSRProps: () => ({}),
    mounted(el: HTMLElement) {
      if (!import.meta.client || reduceMotion || !observer) return
      el.classList.add('reveal')
      observer.observe(el)
    },
    unmounted(el: HTMLElement) {
      observer?.unobserve(el)
    },
  })
})
