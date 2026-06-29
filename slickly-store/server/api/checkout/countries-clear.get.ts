import { defineEventHandler, getQuery, createError } from 'h3';
import { useStorage, useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  if (query.secret !== config.webhookSecret) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const storage = useStorage('redis');
  await storage.removeItem('checkout:countries:v1');
  return { cleared: true };
});
