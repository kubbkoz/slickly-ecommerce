import { defineEventHandler, createError } from 'h3';

export default defineEventHandler(async (event) => {
  // userId from query params is untrusted — verify identity via Shopware session token
  const userId = await verifySwCustomer(event);

  const storage = useStorage('cart-saves');
  const userKey = `user:${userId}`;
  const index =
    (await storage.getItem<{ hash: string; createdAt: number; itemCount: number }[]>(userKey)) ?? [];

  const now = Date.now();
  const results = await Promise.all(
    index.map(async (entry) => {
      const data = await storage.getItem<{ items: any[]; expiresAt: number }>(entry.hash);
      if (!data || data.expiresAt < now) return null;
      return {
        hash: entry.hash,
        createdAt: entry.createdAt,
        itemCount: data.items.length,
        items: data.items,
      };
    }),
  );

  const valid = results.filter(Boolean) as {
    hash: string;
    createdAt: number;
    itemCount: number;
    items: any[];
  }[];

  // Prune expired entries from index
  if (valid.length !== index.length) {
    const validHashes = new Set(valid.map((v) => v.hash));
    await storage.setItem(userKey, index.filter((e) => validHashes.has(e.hash)));
  }

  return valid;
});
