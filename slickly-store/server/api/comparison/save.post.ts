import { defineEventHandler, readBody } from 'h3';
import { useStorage } from '#imports';
import crypto from 'node:crypto';

const CACHE_TTL = 60 * 60 * 24 * 7; // 7 dní

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { items, userId } = body;

  if (!Array.isArray(items) || items.length < 2) {
    return { success: false, error: 'Minimálne 2 produkty.' };
  }

  const storage = useStorage('redis');
  const hash = crypto.randomUUID().replace(/-/g, '');

  await storage.setItem(`comparison:${hash}`, {
    items,
    createdAt: new Date().toISOString(),
    userId: userId || null,
  }, { ttl: CACHE_TTL });

  if (userId) {
    const indexKey = `user:comparisons:${userId}`;
    const existing = await storage.getItem<string[]>(indexKey).catch(() => null) || [];
    const updated = [hash, ...existing.filter(h => h !== hash)].slice(0, 20);
    await storage.setItem(indexKey, updated, { ttl: CACHE_TTL * 4 }).catch(() => null);
  }

  return { success: true, hash };
});
