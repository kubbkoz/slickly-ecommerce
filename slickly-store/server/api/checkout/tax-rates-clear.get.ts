import { defineEventHandler, getQuery, createError } from 'h3';
import { useStorage, useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { secret } = getQuery(event);

  if (secret !== config.webhookSecret) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  // Key format matches Nitro's internal defineCachedFunction convention:
  // [base, group, name, key + '.json'].join(':') — see server/api/checkout/tax-rates.get.ts
  // (name: 'checkout-tax-rates', getKey: () => 'all'). No public API exposes this directly.
  const storage = useStorage();
  await storage.removeItem('/cache:nitro/functions:checkout-tax-rates:all.json');
  return { cleared: true };
});
