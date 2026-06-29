// POST /api/admin/catalog-refresh
// Manuálna invalidácia produktového katalógu v Redis
// Header: x-admin-secret: <WEBHOOK_SECRET>

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const secret = config.webhookSecret as string;

  if (!secret || getHeader(event, 'x-admin-secret') !== secret) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const storage = useStorage('redis');
  await Promise.all([
    storage.removeItem('catalog:products').catch(() => null),
    storage.removeItem('catalog:formatted-prompt').catch(() => null)
  ]);
  console.info('[catalog] Cache zmazaná — spúšťam refresh...');

  const products = await fetchAndCacheCatalog();

  return {
    ok: true,
    count: products.length,
    refreshedAt: new Date().toISOString()
  };
});
