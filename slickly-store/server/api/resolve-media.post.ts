import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const { ids } = await readBody<{ ids: unknown }>(event);

  if (!Array.isArray(ids) || ids.length === 0) return {};

  const config = useRuntimeConfig();
  const endpoint = config.shopwareAdminEndpoint as string;
  const clientId = config.shopwareAdminClientId as string;
  const clientSecret = config.shopwareAdminClientSecret as string;

  if (!clientId || !clientSecret) return {};

  // Shopware Admin API max per request = 500
  const safeIds = (ids as string[]).slice(0, 500);

  try {
    const token = await getAdminToken();

    const res: any = await $fetch(`${endpoint}search/media`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: {
        filter: [{ type: 'equalsAny', field: 'id', value: safeIds }],
        includes: { media: ['id', 'url'] },
        limit: safeIds.length,
      },
    });

    const items: any[] = res?.data || [];
    const map: Record<string, string> = {};
    for (const item of items) {
      if (item.id && item.url) map[item.id] = item.url;
    }
    return map;
  } catch (e: any) {
    // Token mohol expirovat — invalidovať cache a neskúšať znova (next request ho obnový)
    await invalidateAdminToken();

    if (process.dev) console.error('[resolve-media]', e?.data || e?.message || e);
    return {};
  }
});
