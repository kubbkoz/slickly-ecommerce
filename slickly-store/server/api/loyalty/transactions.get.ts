import { defineEventHandler, parseCookies, getQuery } from 'h3';
import { useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const swToken = cookies['sw-context-token'];
  if (!swToken) return { transactions: [], total: 0 };

  const config = useRuntimeConfig();
  const endpoint = (config.public.shopware as any).endpoint as string;
  const accessToken = (config.public.shopware as any).accessToken as string;
  const query = getQuery(event);

  try {
    return await $fetch(`${endpoint}loyalty/transactions`, {
      method: 'GET',
      params: { limit: query.limit || 20, page: query.page || 1 },
      headers: { 'sw-access-key': accessToken, 'sw-context-token': swToken },
    });
  } catch {
    return { transactions: [], total: 0 };
  }
});
