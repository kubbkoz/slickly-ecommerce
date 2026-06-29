import { defineEventHandler } from 'h3';
import { useStorage, useRuntimeConfig } from '#imports';
import { getAdminToken } from '../../utils/shopwareAdmin';

const CACHE_KEY = 'checkout:tax-rates';
const CACHE_TTL = 3600;

// UUID štandardnej sadzby — pevne dané, nemeníme
const STANDARD_TAX_ID = '019b07f46927733d9c025876e11c296b';
const STANDARD_TAX_RATE_FALLBACK = 23;

export default defineEventHandler(async () => {
  const storage = useStorage('redis');

  const cached = await storage.getItem<Record<string, number>>(CACHE_KEY);
  if (cached) return cached;

  const config = useRuntimeConfig();
  const adminEndpoint = config.shopwareAdminEndpoint as string;

  try {
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

    await storage.setItem(CACHE_KEY, map, { ttl: CACHE_TTL });
    return map;
  } catch (e: any) {
    console.error('[tax-rates] Failed:', e?.message ?? e);
    return { _default: STANDARD_TAX_RATE_FALLBACK };
  }
});
