import { defineEventHandler, parseCookies } from 'h3';
import { useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const swToken = cookies['sw-context-token'];
  if (!swToken) return { error: 'not_logged_in' };

  const config = useRuntimeConfig();
  const endpoint = (config.public.shopware as any).endpoint as string;
  const accessToken = (config.public.shopware as any).accessToken as string;

  try {
    return await $fetch(`${endpoint}loyalty/summary`, {
      method: 'GET',
      headers: { 'sw-access-key': accessToken, 'sw-context-token': swToken },
    });
  } catch (e: any) {
    return { error: 'fetch_failed' };
  }
});
