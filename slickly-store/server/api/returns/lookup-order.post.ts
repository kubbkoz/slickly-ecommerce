import { defineEventHandler, readBody, createError } from 'h3';
import { useRuntimeConfig } from '#imports';

/**
 * POST /api/returns/lookup-order — proxy na Shopware Store API.
 *
 * Body: { orderNumber, email }
 * Response:
 *   {
 *     found: bool,
 *     within14Days: bool,
 *     daysSinceOrder: number,
 *     order?: { orderNumber, orderDate, customerName, customerEmail, items[] }
 *   }
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const endpoint = config.public.shopware.endpoint as string;
  const accessToken = config.public.shopware.accessToken as string;

  if (!endpoint || !accessToken) {
    throw createError({ statusCode: 503, statusMessage: 'Shopware Store API not configured' });
  }

  const body = await readBody(event);
  if (!body?.orderNumber || !body?.email) {
    throw createError({ statusCode: 400, statusMessage: 'orderNumber and email required' });
  }

  try {
    const res: any = await $fetch(`${endpoint.replace(/\/+$/, '')}/mtsport-return/lookup-order`, {
      method: 'POST',
      headers: {
        'sw-access-key': accessToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: {
        orderNumber: String(body.orderNumber).trim(),
        email: String(body.email).trim(),
      },
    });
    return res;
  } catch (e: any) {
    console.error('[returns/lookup-order] Shopware Store API failed:', e?.message || e);
    return { found: false, error: 'lookup_failed' };
  }
});
