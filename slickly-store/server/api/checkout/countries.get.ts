import { defineEventHandler } from 'h3';
import { useStorage, useRuntimeConfig } from '#imports';

const CACHE_KEY = 'checkout:countries:v1';
const CACHE_TTL = 3600;

export interface DeliveryCountryDto {
  id: string;
  name: string;
  iso: string;
}

export default defineEventHandler(async (): Promise<DeliveryCountryDto[]> => {
  const storage = useStorage('redis');
  const cached = await storage.getItem<DeliveryCountryDto[]>(CACHE_KEY);
  if (cached) return cached;

  const config = useRuntimeConfig();
  const endpoint = (config.public as any).shopware?.endpoint as string;
  const accessToken = (config.public as any).shopware?.accessToken as string;

  try {
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

    const countries: DeliveryCountryDto[] = (res.elements || [])
      .map((c: any) => ({
        id: c.id as string,
        name: ((c.translated?.name || c.name || '') as string).trim(),
        iso: ((c.iso || '') as string).toUpperCase(),
      }))
      .filter((c: DeliveryCountryDto) => c.iso && c.name);

    await storage.setItem(CACHE_KEY, countries, { ttl: CACHE_TTL });
    return countries;
  } catch (e: any) {
    console.error('[checkout/countries] Failed:', e?.message ?? e);
    return [];
  }
});
