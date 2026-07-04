import { defineEventHandler } from 'h3';
import { useRuntimeConfig, defineCachedFunction } from '#imports';

// `useStorage('redis')` without a mapped `redis:` mount falls back to the default
// MEMORY/FS driver, which ignores TTL in raw `setItem(..., { ttl })` — the cache
// would never expire. defineCachedFunction checks expiry itself (entry.mtime),
// independent of the storage driver.
const CACHE_TTL = 3600;

export interface DeliveryCountryDto {
  id: string;
  name: string;
  iso: string;
}

// Only the SUCCESS path is wrapped/cached — a thrown error is never written to
// cache, so a transient Store API failure retries fresh on the next request
// instead of getting an empty country list stuck cached for a full hour.
const fetchCountries = defineCachedFunction(
  async (): Promise<DeliveryCountryDto[]> => {
    const config = useRuntimeConfig();
    const endpoint = (config.public as any).shopware?.endpoint as string;
    const accessToken = (config.public as any).shopware?.accessToken as string;

    const res = await $fetch<any>(`${endpoint}country`, {
      method: 'POST',
      headers: {
        'sw-access-key': accessToken,
        'Content-Type': 'application/json',
      },
      body: {
        filter: [{ type: 'equals', field: 'active', value: true }],
        includes: { country: ['id', 'name', 'translated', 'iso', 'position'] },
        sort: [{ field: 'position', order: 'ASC' }],
        limit: 100,
      },
    });

    return (res.elements || [])
      .map((c: any) => ({
        id: c.id as string,
        name: ((c.translated?.name || c.name || '') as string).trim(),
        iso: ((c.iso || '') as string).toUpperCase(),
      }))
      .filter((c: DeliveryCountryDto) => c.iso && c.name);
  },
  { name: 'checkout-countries', getKey: () => 'v1', maxAge: CACHE_TTL },
);

export default defineEventHandler(async (): Promise<DeliveryCountryDto[]> => {
  try {
    return await fetchCountries();
  } catch (e: any) {
    console.error('[checkout/countries] Failed:', e?.message ?? e);
    return [];
  }
});
