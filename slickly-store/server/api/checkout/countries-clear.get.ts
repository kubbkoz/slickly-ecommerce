import { defineEventHandler, getQuery, createError } from 'h3';
import { useStorage, useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  if (query.secret !== config.webhookSecret) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  // Key format matches Nitro's internal defineCachedFunction convention:
  // [base, group, name, key + '.json'].join(':') — see server/api/checkout/countries.get.ts
  // (name: 'checkout-countries', getKey: () => 'v1'). No public API exposes this directly.
  const storage = useStorage();
  await storage.removeItem('/cache:nitro/functions:checkout-countries:v1.json');
  return { cleared: true };
});
