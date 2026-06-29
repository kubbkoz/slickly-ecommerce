import { type H3Event, getCookie, getHeader, createError } from 'h3';

/**
 * Reads the Shopware context token from request cookies or headers,
 * calls the Store API to verify it, and returns the authenticated customer ID.
 * Throws 401 if the token is absent, invalid, or belongs to a guest session.
 */
export async function verifySwCustomer(event: H3Event): Promise<string> {
  const contextToken =
    getCookie(event, 'sw-context-token') ?? getHeader(event, 'sw-context-token');

  if (!contextToken) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const config = useRuntimeConfig();
  const endpoint = (config.public?.shopware?.endpoint as string) ?? '';
  const accessToken = (config.public?.shopware?.accessToken as string) ?? '';

  try {
    const customer = await $fetch<{ id: string }>(`${endpoint}account/customer`, {
      headers: {
        'sw-access-key': accessToken,
        'sw-context-token': contextToken,
        Accept: 'application/json',
      },
    });

    if (!customer?.id) throw new Error('no id');
    return customer.id;
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid or guest session' });
  }
}

/**
 * Vráti { id, email } pre prihláseného Shopware zákazníka.
 * Používa sa pre passkey endpointy ktoré potrebujú email (kľúč v WebAuthn store).
 */
export async function verifySwCustomerWithEmail(event: H3Event): Promise<{ id: string; email: string }> {
  const contextToken =
    getCookie(event, 'sw-context-token') ?? getHeader(event, 'sw-context-token');

  if (!contextToken) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const config = useRuntimeConfig();
  const endpoint = (config.public?.shopware?.endpoint as string) ?? '';
  const accessToken = (config.public?.shopware?.accessToken as string) ?? '';

  try {
    const customer = await $fetch<{ id: string; email: string; guest?: boolean }>(`${endpoint}account/customer`, {
      headers: {
        'sw-access-key': accessToken,
        'sw-context-token': contextToken,
        Accept: 'application/json',
      },
    });

    if (!customer?.id || !customer?.email || customer.guest) {
      throw new Error('not a logged-in customer');
    }
    return { id: customer.id, email: customer.email };
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid or guest session' });
  }
}
