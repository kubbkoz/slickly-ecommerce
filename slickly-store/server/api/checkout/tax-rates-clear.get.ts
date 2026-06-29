import { defineEventHandler, getQuery, createError } from 'h3';
import { useStorage, useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { secret } = getQuery(event);

  if (secret !== config.webhookSecret) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const storage = useStorage('redis');
  await storage.removeItem('checkout:tax-rates');
  return { cleared: true };
});
