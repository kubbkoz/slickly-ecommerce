import { defineEventHandler, getQuery, createError } from 'h3';
import { useRuntimeConfig } from '#imports';
import { getAdminToken } from '../../utils/shopwareAdmin';

/**
 * GET /api/account/returns?email={email}
 *
 * Vráti zoznam return requestov pre daný email zákazníka.
 * Klient musí preposlať vlastný email zo session (volá sa len pre prihlásených).
 *
 * Response:
 *   {
 *     total: number,
 *     elements: [{
 *       id, referenceNumber, formType, orderNumber, status,
 *       customerName, customerEmail, createdAt, reasonCategory
 *     }, ...]
 *   }
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const adminEndpoint = config.shopwareAdminEndpoint as string;
  if (!adminEndpoint) {
    throw createError({ statusCode: 503, statusMessage: 'Shopware Admin API not configured' });
  }

  const query = getQuery(event);
  const email = String(query.email ?? '').trim().toLowerCase();
  if (!email) {
    throw createError({ statusCode: 400, statusMessage: 'email query param required' });
  }

  try {
    const token = await getAdminToken();
    const res: any = await $fetch(`${adminEndpoint}mtsport-return-request?filter[customerEmail]=${encodeURIComponent(email)}&sort=-createdAt&limit=50`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });

    const elements = (res?.data ?? []).map((r: any) => ({
      id:               r.id,
      referenceNumber:  r.referenceNumber,
      formType:         r.formType,
      orderNumber:      r.orderNumber,
      status:           r.status,
      customerName:     r.customerName,
      customerEmail:    r.customerEmail,
      reasonCategory:   r.reasonCategory,
      createdAt:        r.createdAt,
    }));

    return { total: res?.meta?.total ?? elements.length, elements };
  } catch (e: any) {
    console.error('[account/returns] Admin API failed:', e?.message || e);
    return { total: 0, elements: [] };
  }
});
