export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null
  let skipReveal = false

  if (import.meta.client) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width: 767px)').matches
    skipReveal = reduceMotion || isMobile
    if (!skipReveal && typeof IntersectionObserver !== 'undefined') {
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
    getSSRProps: () => ({}),
    mounted(el: HTMLElement) {
      if (!import.meta.client || skipReveal || !observer) return
      el.classList.add('reveal')
      observer.observe(el)
    },
    unmounted(el: HTMLElement) {
      observer?.unobserve(el)
    },
  })
})
