import { defineEventHandler, getQuery } from 'h3';
import { useStorage } from '#imports';

export default defineEventHandler(async (event) => {
  const storage = useStorage('db');
  const q = getQuery(event);
  const productId = q.productId as string || '41fc61c28d1949af17dbe967e205b4a1';

  const allKeys = await storage.getKeys().catch(() => ['ERROR_GETKEYS']);
  const watchdogKeys = allKeys.filter(k => k.includes('watchdog'));
  const matchingKeys = allKeys.filter(k => k.startsWith(`watchdog:${productId}:`));

  const values: Record<string, any> = {};
  for (const key of matchingKeys.slice(0, 5)) {
    values[key] = await storage.getItem(key).catch(() => null);
  }

  return {
    storageType: 'redis',
    totalKeys: allKeys.length,
    watchdogKeys: watchdogKeys.length,
    matchingKeys: matchingKeys.length,
    sampleKeys: watchdogKeys.slice(0, 10),
    values,
  };
});
