import { defineEventHandler } from 'h3';
import { useStorage } from '#imports';

export default defineEventHandler(async () => {
  const storage = useStorage('redis');
  await storage.removeItem('store:hours').catch(() => null);
  return { cleared: 'store:hours' };
});
