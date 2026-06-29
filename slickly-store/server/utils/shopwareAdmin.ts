import { useRuntimeConfig, useStorage } from '#imports';

const TOKEN_KEY = 'sw-admin-token';
const TOKEN_REFRESH_BUFFER = 30_000; // refresh 30s pred expiry
const RATE_LIMIT_BACKOFF_MS = 60_000; // pri 429 — počkaj 60s pred ďalším pokusom

// In-process singleflight: pri cache miss/expiry beží len JEDEN OAuth fetch.
// Súbežné requesty čakajú na rovnaký Promise namiesto všetkých atakovať /oauth/token.
let inflightTokenPromise: Promise<string> | null = null;

// Soft-lock pri 429 — nepokúšaj sa znova kým neprejde backoff window.
let rateLimitedUntil = 0;

export async function getAdminToken(): Promise<string> {
  const config = useRuntimeConfig();
  const endpoint = config.shopwareAdminEndpoint as string;
  const clientId = config.shopwareAdminClientId as string;
  const clientSecret = config.shopwareAdminClientSecret as string;

  if (!endpoint || !clientId || !clientSecret) {
    throw new Error('Shopware Admin credentials are not configured');
  }

  const cache = useStorage('nitro:cache');

  // Pokus o načítanie tokenu z cross-worker Nitro cache
  const cached = await cache.getItem<{ value: string; expiresAt: number }>(TOKEN_KEY).catch(() => null);
  if (cached && cached.expiresAt > Date.now() + TOKEN_REFRESH_BUFFER) {
    return cached.value;
  }

  // Respect 429 backoff — ak Shopware nedávno odmietol, použij expired cache (ak existuje) alebo throw.
  // Grace fallback minimalizuje impakt rate-limitu — cached token môže ešte fungovať pár sekúnd po expiry.
  if (Date.now() < rateLimitedUntil) {
    if (cached?.value) return cached.value;
    throw new Error(`Admin OAuth rate-limited (retry in ${Math.ceil((rateLimitedUntil - Date.now()) / 1000)}s)`);
  }

  // Singleflight — ak refresh už beží, počkaj naň namiesto vlastného fetchu.
  if (inflightTokenPromise) return inflightTokenPromise;

  inflightTokenPromise = (async () => {
    try {
      const res: any = await $fetch(`${endpoint}oauth/token`, {
        method: 'POST',
        body: {
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
        },
      });

      const token = {
        value: res.access_token as string,
        expiresAt: Date.now() + (res.expires_in ?? 600) * 1000,
      };

      // Uložiť do Nitro cache (zdieľané cez workers)
      await cache.setItem(TOKEN_KEY, token).catch(() => null);
      return token.value;
    } catch (err: any) {
      // 429 → nastav backoff aby ďalšie requesty nehammerovali OAuth endpoint
      if (err?.response?.status === 429 || err?.statusCode === 429 || err?.status === 429) {
        rateLimitedUntil = Date.now() + RATE_LIMIT_BACKOFF_MS;
        console.warn(`[shopwareAdmin] OAuth rate-limited (429). Backing off ${RATE_LIMIT_BACKOFF_MS / 1000}s.`);
      }
      throw err;
    } finally {
      inflightTokenPromise = null;
    }
  })();

  return inflightTokenPromise;
}

export async function invalidateAdminToken(): Promise<void> {
  const cache = useStorage('nitro:cache');
  await cache.removeItem(TOKEN_KEY).catch(() => null);
}

export async function findCustomerIdByEmail(email: string): Promise<string | null> {
  const config = useRuntimeConfig();
  const endpoint = config.shopwareAdminEndpoint as string;
  const token = await getAdminToken();

  const res: any = await $fetch(`${endpoint}search/customer`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: {
      filter: [{ type: 'equals', field: 'email', value: email }],
      limit: 1,
    },
  });

  const items: any[] = res?.data || [];
  return items.length > 0 ? items[0].id : null;
}

export async function resetCustomerPassword(customerId: string, newPassword: string): Promise<void> {
  const config = useRuntimeConfig();
  const endpoint = config.shopwareAdminEndpoint as string;
  const token = await getAdminToken();

  const res = await $fetch.raw(`${endpoint}customer/${customerId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: { password: newPassword },
  });

  if (res.status >= 400) {
    throw new Error(`[Admin] resetCustomerPassword failed: ${res.status}`);
  }
  console.log(`[Admin] Password reset OK for ${customerId} (status ${res.status})`);
}

export async function findOrderByNumberOrEmail(
  orderNumber?: string,
  email?: string,
  firstName?: string,
  lastName?: string
): Promise<{ orders: any[]; multiple: boolean }> {
  const config = useRuntimeConfig();
  const endpoint = config.shopwareAdminEndpoint as string;
  const token = await getAdminToken();

  // 30 dní dozadu
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  let filter: any;
  let limit = 1;

  if (orderNumber) {
    // Číslo objednávky — bez dátumového obmedzenia (môže hľadať staré)
    filter = [{ type: 'equals', field: 'orderNumber', value: orderNumber.trim() }];
  } else if (email && lastName) {
    // Email + priezvisko → posledných 30 dní, všetky objednávky
    limit = 10;
    filter = [
      {
        type: 'multi',
        operator: 'AND',
        queries: [
          { type: 'equals', field: 'orderCustomer.email', value: email.trim().toLowerCase() },
          { type: 'contains', field: 'orderCustomer.lastName', value: lastName.trim() },
          { type: 'range', field: 'createdAt', parameters: { gte: since } }
        ]
      }
    ];
  } else {
    return { orders: [], multiple: false };
  }

  const res: any = await $fetch(`${endpoint}search/order`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: {
      filter,
      limit,
      sort: [{ field: 'createdAt', order: 'DESC' }],
      includes: {
        order: ['id', 'orderNumber', 'stateMachineState', 'createdAt', 'orderCustomer', 'deliveries', 'transactions'],
        order_customer: ['email', 'firstName', 'lastName'],
        order_delivery: ['stateMachineState'],
        order_transaction: ['stateMachineState'],
        state_machine_state: ['name', 'technicalName']
      },
      associations: {
        stateMachineState: {},   // ← order-level stav (chýbalo!)
        deliveries: {
          limit: 1,
          associations: { stateMachineState: {} }
        },
        transactions: {
          limit: 1,
          sort: [{ field: 'createdAt', order: 'DESC' }],
          associations: { stateMachineState: {} }
        }
      }
    },
  });

  const items: any[] = res?.data || [];
  return { orders: items, multiple: items.length > 1 };
}
