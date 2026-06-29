import { defineEventHandler, readBody, createError } from 'h3';
import { useRuntimeConfig } from '#imports';

/**
 * POST /api/returns/submit — proxy to Shopware Store API.
 *
 * Body: kompletný formulár (formType, orderNumber, firstName, lastName,
 *       customerEmail, customerPhone, customerAddress, ..., attachmentPaths[],
 *       warrantyPaths[])
 *
 * Response: { success: true, id, referenceNumber: 'RR-2026-12345' }
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const endpoint = config.public.shopware.endpoint as string;
  const accessToken = config.public.shopware.accessToken as string;

  if (!endpoint || !accessToken) {
    throw createError({ statusCode: 503, statusMessage: 'Shopware Store API not configured' });
  }

  const body = await readBody(event);

  // Basic frontend validation (server-side defence)
  const required = ['formType', 'orderNumber', 'firstName', 'lastName', 'customerEmail', 'customerPhone', 'customerAddress', 'itemsDescription', 'reasonDetail'];
  for (const f of required) {
    if (!body?.[f]) {
      throw createError({ statusCode: 400, statusMessage: `Missing field: ${f}` });
    }
  }
  if (!['vratenie', 'reklamacia'].includes(body.formType)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid formType' });
  }
  if (body.formType === 'vratenie' && !body.bankAccount) {
    throw createError({ statusCode: 400, statusMessage: 'IBAN required for vratenie' });
  }

  try {
    const res: any = await $fetch(`${endpoint.replace(/\/+$/, '')}/mtsport-return`, {
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
    // Parse Shopware error response (jsonapi format: { errors: [{ detail, title, code }] })
    const swStatus = e?.response?.status || e?.statusCode;
    const swData = e?.data ?? e?.response?._data;
    const swDetail = swData?.errors?.[0]?.detail
                  || swData?.errors?.[0]?.title
                  || swData?.error
                  || e?.message
                  || 'Submit failed';

    console.error('[returns/submit] Shopware Store API failed:',
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
