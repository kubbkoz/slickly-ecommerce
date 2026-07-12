// GET /account/login/imitate-customer?customerId=X&token=Y&userId=Z
// Shopware admin "Login as customer" → tu prichádza redirect
// Server-side: zavolá Shopware Store API, získa context token, nastaví cookie, redirect na /account
import { getQuery, setCookie, sendRedirect, createError } from 'h3';

export default defineEventHandler(async (event) => {
  // S5 (prod audit): throttle the customer-impersonation entry point. Its safety
  // rests on the unguessable Shopware-issued token, but rate-limiting blunts
  // brute-force / token-replay abuse of this account-takeover-adjacent route.
  // Generous enough for a real admin impersonating several customers in a row.
  await checkRateLimit(event, { key: 'imitate-customer', limit: 10, windowMs: 5 * 60 * 1000 });

  const config = useRuntimeConfig();
  const endpoint = (config.public.shopware as any).endpoint as string;
  const accessToken = (config.public.shopware as any).accessToken as string;

  const query = getQuery(event);
  const customerId = query.customerId as string;
  const token = query.token as string;
  const userId = query.userId as string;

  if (!customerId || !token || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing impersonation params (customerId, token, userId)'
    });
  }

  try {
    const base = endpoint.replace(/\/$/, '');
    const res = await $fetch.raw<any>(`${base}/account/login/imitate-customer`, {
      method: 'POST',
      headers: {
        'sw-access-key': accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: { customerId, token, userId },
    });

    const contextToken = res.headers.get('sw-context-token') ?? (res._data as any)?.contextToken;
    if (!contextToken) {
      throw new Error('No sw-context-token in Shopware response');
    }

    // Nastavíme cookie ručne (Nuxt useCookie tu nefunguje rovnako)
    setCookie(event, 'sw-context-token', contextToken, {
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      secure: process.env.NODE_ENV === 'production',
    });

    console.log(`[imitate-customer] Success — customerId=${customerId}, userId=${userId}, token=${contextToken.slice(0, 8)}...`);

    // Redirect na /account
    const redirectUrl = (res._data as any)?.redirectUrl || '/account';
    return sendRedirect(event, redirectUrl, 302);
  } catch (err: any) {
    console.error('[imitate-customer] FAILED:', err?.data?.errors || err?.message || err);
    const errMsg = err?.data?.errors?.[0]?.detail || 'Imitation token invalid or expired';
    throw createError({
      statusCode: 401,
      statusMessage: `Imitate customer failed: ${errMsg}`,
    });
  }
});
