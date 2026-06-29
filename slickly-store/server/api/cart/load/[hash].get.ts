import { defineEventHandler, getRouterParam, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const hash = getRouterParam(event, 'hash');

  if (!hash) {
    throw createError({ statusCode: 400, statusMessage: 'Hash required' });
  }

  if (!/^[0-9a-f]{32}$/i.test(hash)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid hash format' });
  }

  const storage = useStorage('cart-saves');
  const data = await storage.getItem<{
    items: { id: string; quantity: number }[];
    createdAt: number;
    expiresAt: number;
  }>(hash);

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Saved cart not found or expired' });
  }

  if (data.expiresAt && Date.now() > data.expiresAt) {
    await storage.removeItem(hash);
    throw createError({ statusCode: 410, statusMessage: 'Saved cart has expired' });
  }

  return { items: data.items };
});
