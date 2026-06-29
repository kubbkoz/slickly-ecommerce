import { defineEventHandler, getRouterParam, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const hash = getRouterParam(event, 'hash');
  if (!hash) throw createError({ statusCode: 400, statusMessage: 'Hash required' });

  // Only valid 32-char hex hashes (crypto.randomUUID sans dashes)
  if (!/^[0-9a-f]{32}$/i.test(hash)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid hash format' });
  }

  const storage = useStorage('cart-saves');
  const data = await storage.getItem<{ userId?: string | null }>(hash);

  if (!data) throw createError({ statusCode: 404, statusMessage: 'Not found' });

  if (data.userId) {
    // User-owned cart: verify the caller owns it via Shopware session
    let callerId: string;
    try {
      callerId = await verifySwCustomer(event);
    } catch {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
    }
    if (callerId !== data.userId) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
    }

    await storage.removeItem(hash);

    const userKey = `user:${data.userId}`;
    const index = (await storage.getItem<{ hash: string }[]>(userKey)) ?? [];
    await storage.setItem(userKey, index.filter((e) => e.hash !== hash));
  } else {
    // Anonymous cart — hash itself is the shared secret; no ownership check
    await storage.removeItem(hash);
  }

  return { ok: true };
});
