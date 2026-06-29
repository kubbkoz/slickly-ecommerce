/**
 * Shared cookie flag used by the coming-soon gate (middleware + login form)
 * to remember that a visitor has unlocked the full site.
 */
export function useSiteAccess() {
  return useCookie<string | null>('slickly-access', {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  })
}
