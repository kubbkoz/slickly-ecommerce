// POST /api/blog/refresh — vyčistí Redis cache pre blog (kľúče "blog:*")
// Header: X-Webhook-Secret: $WEBHOOK_SECRET (rovnaký ako v iných admin endpointoch)
import { defineEventHandler, getHeader, createError } from 'h3';
import { useStorage, useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const secret = getHeader(event, 'x-webhook-secret');

  if (!config.webhookSecret || secret !== config.webhookSecret) {
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }

  const storage = useStorage('redis');
  const keys = await storage.getKeys('blog:').catch(() => [] as string[]);

  await Promise.all(keys.map((k) => storage.removeItem(k).catch(() => null)));

  return { invalidated: keys.length, keys };
});
