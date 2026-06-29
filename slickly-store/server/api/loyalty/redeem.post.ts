import { defineEventHandler, parseCookies, readBody } from 'h3';
import { useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const swToken = cookies['sw-context-token'];
  if (!swToken) return { success: false, error: 'not_logged_in' };

  const config = useRuntimeConfig();
  const endpoint = (config.public.shopware as any).endpoint as string;
  const accessToken = (config.public.shopware as any).accessToken as string;
  const body = await readBody(event);

  try {
    return await $fetch(`${endpoint}loyalty/redeem`, {
      method: 'POST',
      body: { rewardId: body.rewardId },
      headers: { 'sw-access-key': accessToken, 'sw-context-token': swToken },
    });
  } catch (e: any) {
    return { success: false, error: e?.data?.error || 'Nepodarilo sa uplatniť odmenu.' };
  }
});
