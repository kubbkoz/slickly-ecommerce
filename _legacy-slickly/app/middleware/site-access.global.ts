/**
 * Coming-soon gate. Visitors without the unlock cookie are redirected to
 * /coming-soon; once unlocked there, they're sent back to the homepage.
 * Skipped during static prerendering so build-time generation of routes
 * (e.g. the prerendered "/") isn't turned into a redirect.
 */
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server && import.meta.prerender) return

  const access = useSiteAccess()

  if (to.path === '/coming-soon') {
    if (access.value) return navigateTo('/')
    return
  }

  if (!access.value) return navigateTo('/coming-soon')
})
