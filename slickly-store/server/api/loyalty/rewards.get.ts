import { defineEventHandler, parseCookies } from 'h3';
import { useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const swToken = cookies['sw-context-token'];
  if (!swToken) return { rewards: [], availablePoints: 0 };

  const config = useRuntimeConfig();
  const endpoint = (config.public.shopware as any).endpoint as string;
  const accessToken = (config.public.shopware as any).accessToken as string;

  try {
    return await $fetch(`${endpoint}loyalty/rewards`, {
      method: 'GET',
      headers: { 'sw-access-key': accessToken, 'sw-context-token': swToken },
    });
  } catch {
    return { rewards: [], availablePoints: 0 };
  }
});
