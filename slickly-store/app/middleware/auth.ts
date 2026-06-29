// middleware/auth.ts
// Redirects unauthenticated users away from protected pages.
//
// Async + session-context refresh:
//   Pri prvej návšteve protected route (po OAuth callback / page reload / direct URL)
//   useUser().isLoggedIn vracia stale `false`, lebo session context ešte nebol fetched.
//   Bez await refreshSessionContext() by middleware odhlásil aj plne autentifikovaného
//   používateľa. Cookie `sw-context-token` nastavený server-side (OAuth callback)
//   sa pretaví do user state až po /store-api/context fetchi.
export default defineNuxtRouteMiddleware(async () => {
  const { isLoggedIn } = useUser();

  if (!isLoggedIn.value && import.meta.client) {
    const { refreshSessionContext } = useSessionContext();
    await refreshSessionContext().catch(() => {});
  }

  if (!isLoggedIn.value) {
    return navigateTo('/');
  }
});
