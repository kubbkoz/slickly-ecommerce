/**
 * auth-token.ts
 *
 * Injects `sw-context-token` cookie into every Shopware API request.
 * Does NOT call useUser() — plugins run outside component setup context.
 *
 * Token hydration (fetchUser) is handled by the components themselves via useUser().
 */
import { defineNuxtPlugin, useCookie } from '#app';
import { useShopwareContext } from '#imports';

export default defineNuxtPlugin((_nuxtApp) => {
  const { apiClient } = useShopwareContext();

  const tokenCookie = useCookie<string | null>('sw-context-token', {
    maxAge: 60 * 60 * 24 * 30, // 30 dní — košík prežije zatvorenie prehliadača
    sameSite: 'lax',
    path: '/',
  });

  // Inject token header on every outgoing request
  (apiClient as any).hook('request', (requestContext: any) => {
    const token = tokenCookie.value;
    if (token) {
      requestContext.headers = {
        ...requestContext.headers,
        'sw-context-token': token,
      };
    }
  });

  // Capture rotated token from response (Shopware may rotate token on each request)
  (apiClient as any).hook('response', (response: any) => {
    const newToken =
      response?.headers?.get?.('sw-context-token') ??
      response?.data?.contextToken ??
      null;
    if (newToken && newToken !== tokenCookie.value) {
      tokenCookie.value = newToken;
    }
  });
});
