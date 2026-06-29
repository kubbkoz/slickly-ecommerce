import { defineEventHandler } from 'h3';
import { useStorage } from '#imports';

export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const swToken = cookies['sw-context-token'];
  if (!swToken) return [];

  const config = useRuntimeConfig();
  const endpoint = (config.public.shopware as any).endpoint as string;
  const accessToken = (config.public.shopware as any).accessToken as string;

  let userId: string | null = null;
  try {
    const customer: any = await $fetch(`${endpoint}account/customer`, {
      headers: { 'sw-access-key': accessToken, 'sw-context-token': swToken },
    });
    userId = customer?.id;
  } catch { return []; }

  if (!userId) return [];

  const storage = useStorage('redis');
  const hashes = await storage.getItem<string[]>(`user:comparisons:${userId}`).catch(() => null) || [];

  const results = [];
  for (const hash of hashes) {
    const data = await storage.getItem<any>(`comparison:${hash}`).catch(() => null);
    if (data) {
      results.push({ hash, ...data });
    }
  }

  return results;
});
