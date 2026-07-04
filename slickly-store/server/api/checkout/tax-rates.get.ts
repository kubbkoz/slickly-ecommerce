import { defineEventHandler } from 'h3';
import { useRuntimeConfig, defineCachedFunction } from '#imports';
import { getAdminToken } from '../../utils/shopwareAdmin';

// `useStorage('redis')` without a mapped `redis:` mount falls back to the default
// MEMORY/FS driver, which ignores TTL in raw `setItem(..., { ttl })` — the cache
// would never expire. defineCachedFunction checks expiry itself (entry.mtime),
// independent of the storage driver, so tax rates can't get silently stuck stale.
const CACHE_TTL = 3600;

// UUID štandardnej sadzby — pevne dané, nemeníme
const STANDARD_TAX_ID = '019b07f46927733d9c025876e11c296b';
const STANDARD_TAX_RATE_FALLBACK = 23;

// Only the SUCCESS path is wrapped/cached — a thrown error is never written to
// cache (Nitro propagates it uncached), so a transient Admin API failure falls
// back to the safe default immediately and retries fresh on the very next
// request, instead of getting the fallback rate stuck cached for a full hour.
const fetchTaxRates = defineCachedFunction(
  async (): Promise<Record<string, number>> => {
    const config = useRuntimeConfig();
    const adminEndpoint = config.shopwareAdminEndpoint as string;
    const token = await getAdminToken();

    const rulesRes = await $fetch<any>(`${adminEndpoint}search/tax-rule`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      body: {
        limit: 500,
        filter: [{ type: 'equals', field: 'taxId', value: STANDARD_TAX_ID }],
        includes: { tax_rule: ['countryId', 'taxRate'] },
      },
    });

    const map: Record<string, number> = { _default: STANDARD_TAX_RATE_FALLBACK };
    for (const rule of rulesRes?.data ?? []) {
      if (rule.countryId && rule.taxRate != null) {
        map[rule.countryId] = rule.taxRate;
      }
    }

    return map;
  },
  { name: 'checkout-tax-rates', getKey: () => 'all', maxAge: CACHE_TTL },
);

export default defineEventHandler(async () => {
  try {
    return await fetchTaxRates();
  } catch (e: any) {
    console.error('[tax-rates] Failed:', e?.message ?? e);
    return { _default: STANDARD_TAX_RATE_FALLBACK };
  }
});
