import { defineEventHandler, getQuery } from 'h3';
import { useRuntimeConfig, useStorage } from '#imports';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const secret = (config.webhookSecret ?? config.public?.webhookSecret) as string;
  const { secret: provided } = getQuery(event);

  if (!provided || provided !== secret) {
    return { error: 'Unauthorized' };
  }

  const storage = useStorage('redis');
  await storage.removeItem('badge:all');

  return { cleared: true };
});
