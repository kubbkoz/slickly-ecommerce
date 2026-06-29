// Warm-up pri štarte — načíta katalóg z Redis alebo fetchne raz zo Shopware
export default defineNitroPlugin(async () => {
  try {
    const products = await getProductCatalog(); // Redis first — fetchne len ak chýba
    console.info(`[catalog] Prefetched ${products.length} products into cache`);
  } catch (err) {
    console.warn('[catalog] Prefetch failed (will retry on first chat request):', err);
  }
});
