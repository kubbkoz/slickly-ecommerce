import { randomBytes } from 'node:crypto';
import { createError } from 'h3';
import { encryptText, decryptText } from './crypto';

export interface OAuthProfile {
  provider: 'google' | 'facebook';
  providerId: string;
  email: string;
  firstName: string;
  lastName: string;
}

const CRED_TTL = 365 * 24 * 3600;

async function getOAuthCreds(provider: string, id: string) {
  const raw = await useStorage('nitro:cache').getItem<string>(`oauth:${provider}:${id}`);
  if (!raw) return null;
  const [email, enc] = raw.split('||');
  return { email: email!, password: decryptText(enc!) };
}

async function setOAuthCreds(provider: string, id: string, email: string, password: string) {
  const val = `${email}||${encryptText(password)}`;
  await useStorage('nitro:cache').setItem(`oauth:${provider}:${id}`, val, { ttl: CRED_TTL });
}

/** Also store/update SW credentials indexed by email (needed for WebAuthn bridge). */
export async function setSwCredsByEmail(email: string, password: string) {
  await useStorage('nitro:cache').setItem(
    `oauth:email:${email}`,
    encryptText(password),
    { ttl: CRED_TTL }
  );
}

export async function getSwCredsByEmail(email: string): Promise<string | null> {
  const enc = await useStorage('nitro:cache').getItem<string>(`oauth:email:${email}`);
  if (!enc) return null;
  try { return decryptText(enc); } catch { return null; }
}

async function fetchDefaultIds(endpoint: string, accessToken: string) {
  const h = { 'sw-access-key': accessToken, Accept: 'application/json' };
  const [salRes, ctryRes] = await Promise.all([
    $fetch<{ elements: { id: string }[] }>(`${endpoint}salutation`, { method: 'POST', headers: h, body: {} }),
    $fetch<{ elements: { id: string }[] }>(`${endpoint}country`, {
      method: 'POST', headers: h,
      body: { filter: [{ type: 'equals', field: 'iso', value: 'SK' }], limit: 1 },
    }),
  ]);
  return {
    salutationId: salRes.elements[0]?.id ?? '',
    countryId: ctryRes.elements[0]?.id ?? '',
  };
}

/**
 * Finds or creates a Shopware customer for an OAuth user.
 * Returns the sw-context-token for the authenticated session.
 */
export async function loginOrRegisterOAuth(profile: OAuthProfile): Promise<string> {
  const config = useRuntimeConfig();
  const endpoint = (config.public?.shopware as any)?.endpoint as string;
  const accessToken = (config.public?.shopware as any)?.accessToken as string;
  const siteUrl = (config.public?.siteUrl as string) || 'http://localhost:3000';
  const h = { 'sw-access-key': accessToken, 'Content-Type': 'application/json', Accept: 'application/json' };

  // 1. Stored credentials → try login
  const stored = await getOAuthCreds(profile.provider, profile.providerId);
  if (stored) {
    try {
      const res = await $fetch.raw<any>(`${endpoint}account/login`, {
        method: 'POST', headers: h,
        body: { username: stored.email, password: stored.password },
      });
      const token = res.headers.get('sw-context-token') ?? res._data?.contextToken ?? '';
      if (token) return token;
    } catch { /* stale creds — re-register below */ }
  }

  // 2. No stored creds → register new customer
  const password = randomBytes(32).toString('hex');
  const { salutationId, countryId } = await fetchDefaultIds(endpoint, accessToken);

  try {
    const res = await $fetch.raw<any>(`${endpoint}account/register`, {
      method: 'POST', headers: h,
      body: {
        salutationId,
        email: profile.email,
        firstName: profile.firstName || 'User',
        lastName: profile.lastName || '-',
        password,
        acceptedDataProtection: true,
        billingAddress: {
          salutationId,
          firstName: profile.firstName || 'User',
          lastName: profile.lastName || '-',
          street: '-',
          zipcode: '00000',
          city: '-',
          countryId,
          phoneNumber: '+421000000000',
        },
        storefrontUrl: siteUrl,
      },
    });
    const token = res.headers.get('sw-context-token') ?? res._data?.contextToken ?? '';
    await setOAuthCreds(profile.provider, profile.providerId, profile.email, password);
    await setSwCredsByEmail(profile.email, password);
    return token;
  } catch (err: any) {
    const errors: any[] = err?.data?.errors ?? [];
    // Shopware má dva ekvivalentné kódy pre duplicitný email:
    // - VIOLATION::EMAIL_ALREADY_EXISTS (legacy)
    // - VIOLATION::CUSTOMER_EMAIL_NOT_UNIQUE (newer Shopware 6.5+)
    const isEmailDuplicate = errors.some(
      (e) => e?.code === 'VIOLATION::EMAIL_ALREADY_EXISTS'
        || e?.code === 'VIOLATION::CUSTOMER_EMAIL_NOT_UNIQUE',
    );
    if (isEmailDuplicate) {
      // Auto-linking for existing customers
      try {
        const customerId = await findCustomerIdByEmail(profile.email);
        if (customerId) {
          console.log(`[OAuth] Linking existing account for ${profile.email}`);
          const newPassword = randomBytes(32).toString('hex');
          await resetCustomerPassword(customerId, newPassword);
          await setOAuthCreds(profile.provider, profile.providerId, profile.email, newPassword);
          await setSwCredsByEmail(profile.email, newPassword);

          // Delay — Shopware Admin PATCH nie je okamžite konzistentný
          await new Promise(r => setTimeout(r, 500));

          // Login s retry (max 2× s 300ms medzerou)
          for (let attempt = 1; attempt <= 2; attempt++) {
            try {
              const loginRes = await $fetch.raw<any>(`${endpoint}account/login`, {
                method: 'POST', headers: h,
                body: { username: profile.email, password: newPassword },
              });
              const newToken = loginRes.headers.get('sw-context-token') ?? loginRes._data?.contextToken ?? '';
              if (newToken) return newToken;
            } catch (loginErr: any) {
              console.warn(`[OAuth] Login attempt ${attempt} failed for ${profile.email}:`, loginErr?.data?.errors?.[0]?.code);
              if (attempt < 2) await new Promise(r => setTimeout(r, 300));
            }
          }
        }
      } catch (linkError: any) {
        console.error('[OAuth] Account linking failed:', linkError?.data || linkError?.message || linkError);
      }

      throw createError({ statusCode: 409, statusMessage: 'EMAIL_EXISTS' });
    }
    // Verbose error logging — Shopware vracia source.pointer s presným poľom
    if (errors.length) {
      console.error('[OAuth] Shopware register validation errors:');
      errors.forEach((e: any, i: number) => {
        console.error(`  [${i}] code=${e.code} pointer=${e.source?.pointer ?? '?'} detail=${e.detail}`);
      });
    } else {
      console.error('[OAuth] Shopware register error:', err?.data ?? err?.message);
    }
    throw createError({ statusCode: 502, statusMessage: 'OAuth registration failed' });
  }
}

/** Authenticate to Shopware using stored credentials. Used by WebAuthn login bridge. */
export async function shopwareLoginByEmail(email: string): Promise<string | null> {
  const password = await getSwCredsByEmail(email);
  if (!password) return null;

  const config = useRuntimeConfig();
  const endpoint = (config.public?.shopware as any)?.endpoint as string;
  const accessToken = (config.public?.shopware as any)?.accessToken as string;

  try {
    const res = await $fetch.raw<any>(`${endpoint}account/login`, {
      method: 'POST',
      headers: { 'sw-access-key': accessToken, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: { username: email, password },
    });
    return res.headers.get('sw-context-token') ?? res._data?.contextToken ?? null;
  } catch {
    return null;
  }
}
