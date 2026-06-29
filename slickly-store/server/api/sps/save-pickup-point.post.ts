import { defineEventHandler, readBody, createError } from 'h3';
import { useRuntimeConfig } from '#imports';

/**
 * POST /api/sps/save-pickup-point — proxy to Shopware Store API.
 *
 * Body: { orderId: string, pickupPoint: { id, description, address, zip, city, countryISO, cod, type } }
 *
 * Response: { success: true }
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const endpoint = config.public.shopware.endpoint as string;
  const accessToken = config.public.shopware.accessToken as string;

  if (!endpoint || !accessToken) {
    throw createError({ statusCode: 503, statusMessage: 'Shopware Store API not configured' });
  }

  const body = await readBody(event);

  if (!body?.orderId || !body?.pickupPoint?.id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing orderId or pickupPoint' });
  }

  try {
    const res: any = await $fetch(`${endpoint.replace(/\/+$/, '')}/mtsport-sps/pickup-point`, {
      method: 'POST',
      headers: {
        'sw-access-key': accessToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });
    return res;
  } catch (e: any) {
    const swStatus = e?.response?.status || e?.statusCode;
    const swData = e?.data ?? e?.response?._data;
    const swDetail = swData?.errors?.[0]?.detail
                  || swData?.errors?.[0]?.title
                  || swData?.error
                  || e?.message
                  || 'Save pickup point failed';

    console.error('[sps/save-pickup-point] Shopware Store API failed:',
      'status=', swStatus,
      'detail=', swDetail,
      'fullData=', JSON.stringify(swData ?? {}).substring(0, 500),
    );

    throw createError({
      statusCode: 502,
      statusMessage: `Shopware ${swStatus || ''}: ${swDetail}`.trim(),
    });
  }
});
