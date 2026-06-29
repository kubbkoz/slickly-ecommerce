import { defineEventHandler, readBody, createError } from 'h3';

interface CartItem {
  id: string;
  quantity: number;
}

export default defineEventHandler(async (event) => {
  const { items } = await readBody<{ items: CartItem[] }>(event);

  if (!items?.length) {
    throw createError({ statusCode: 400, statusMessage: 'No items provided' });
  }

  const validItems = items.filter((i) => i.id && i.quantity > 0);
  if (!validItems.length) {
    throw createError({ statusCode: 400, statusMessage: 'No valid items' });
  }

  // userId is verified server-side via Shopware session — never trusted from client body
  let verifiedUserId: string | null = null;
  try {
    verifiedUserId = await verifySwCustomer(event);
  } catch {
    // Anonymous save — no user association
  }

  const hash = crypto.randomUUID().replace(/-/g, '');
  const now = Date.now();
  const expiresAt = now + 30 * 24 * 60 * 60 * 1000;

  const storage = useStorage('cart-saves');

  await storage.setItem(hash, {
    items: validItems,
    createdAt: now,
    expiresAt,
    userId: verifiedUserId,
  });

  if (verifiedUserId) {
    const userKey = `user:${verifiedUserId}`;
    const existing =
      (await storage.getItem<{ hash: string; createdAt: number; itemCount: number }[]>(userKey)) ?? [];

    existing.unshift({ hash, createdAt: now, itemCount: validItems.length });
    await storage.setItem(userKey, existing.slice(0, 10));
  }

  return { hash };
});
