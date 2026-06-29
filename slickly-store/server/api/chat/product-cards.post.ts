// POST /api/chat/product-cards
// Prijme pole product IDs z Claude odpovede, vráti dáta pre ChatProductCard

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const storeApiUrl = (config.public.shopware as any).endpoint as string;
  const accessToken = (config.public.shopware as any).accessToken as string;

  const body = await readBody(event);
  const { ids } = body as { ids: string[] };

  if (!ids?.length || ids.length > 10) {
    throw createError({ statusCode: 400, statusMessage: 'ids required (max 10)' });
  }

  const res = await $fetch<any>(`${storeApiUrl}product`, {
    method: 'POST',
    headers: { 'sw-access-key': accessToken, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: {
      filter: [{ type: 'equalsAny', field: 'id', value: ids }],
      limit: ids.length,
      includes: {
        product: ['id', 'name', 'translated', 'calculatedPrice', 'cover', 'seoUrls', 'manufacturer'],
        product_media: ['media'],
        media: ['url', 'thumbnails'],
        media_thumbnail: ['url', 'width'],
        calculated_price: ['unitPrice', 'listPrice'],
        seo_url: ['seoPathInfo', 'isCanonical'],
        product_manufacturer: ['name', 'translated'],
      },
      associations: {
        cover: { associations: { media: { associations: { thumbnails: {} } } } },
        seoUrls: {},
        manufacturer: {},
      }
    }
  }).catch(() => null);

  const elements: any[] = res?.elements || [];

  return elements.map((p: any) => {
    const imgUrl =
      p.cover?.media?.thumbnails?.find((t: any) => t.width >= 400)?.url
      || p.cover?.media?.url
      || null;
    const seoPath = p.seoUrls?.find((s: any) => s.isCanonical)?.seoPathInfo;

    return {
      id: p.id,
      name: p.translated?.name || p.name,
      price: p.calculatedPrice?.unitPrice ?? 0,
      listPrice: p.calculatedPrice?.listPrice?.price ?? null,
      imageUrl: imgUrl,
      seoPath: seoPath ? `/${seoPath}` : null,
      brand: p.manufacturer?.translated?.name || p.manufacturer?.name || null,
    };
  });
});
