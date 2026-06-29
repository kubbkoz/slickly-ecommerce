import { findOrderByNumberOrEmail } from '../../utils/shopwareAdmin';
import { getOrderStateMessage, getDeliveryStateMessage, getPaymentStateMessage, buildCombinedStateMessage } from '../../utils/orderStateMessages';
import { hash } from 'ohash';

function buildOrderResult(order: any) {
  const orderState = order.stateMachineState?.technicalName || null;
  const deliveryState = order.deliveries?.[0]?.stateMachineState?.technicalName || null;
  const paymentState = order.transactions?.[0]?.stateMachineState?.technicalName || null;
  const oInfo = orderState ? getOrderStateMessage(orderState) : null;
  const dInfo = deliveryState ? getDeliveryStateMessage(deliveryState) : null;
  const pInfo = paymentState ? getPaymentStateMessage(paymentState) : null;

  return {
    orderNumber: order.orderNumber,
    states: {
      order: { name: oInfo?.label || 'Neznámy stav', technicalName: orderState, message: oInfo?.message || null },
      delivery: deliveryState ? { name: dInfo?.label || 'Neznámy stav', technicalName: deliveryState, message: dInfo?.message || null } : null,
      payment: paymentState ? { name: pInfo?.label || 'Neznámy stav', technicalName: paymentState, message: pInfo?.message || null } : null
    },
    message: buildCombinedStateMessage({ order: orderState, delivery: deliveryState, payment: paymentState }),
    createdAt: order.createdAt,
    customer: { email: order.orderCustomer?.email, name: `${order.orderCustomer?.firstName || ''} ${order.orderCustomer?.lastName || ''}`.trim() }
  };
}

function buildResponseFromCache(cached: any) {
  const oInfo = cached.orderState ? getOrderStateMessage(cached.orderState) : null;
  const dInfo = cached.deliveryState ? getDeliveryStateMessage(cached.deliveryState) : null;
  const pInfo = cached.paymentState ? getPaymentStateMessage(cached.paymentState) : null;

  return {
    found: true,
    orderNumber: cached.orderNumber,
    states: {
      order: { name: oInfo?.label || 'Neznámy stav', technicalName: cached.orderState, message: oInfo?.message || null },
      delivery: cached.deliveryState ? { name: dInfo?.label || 'Neznámy stav', technicalName: cached.deliveryState, message: dInfo?.message || null } : null,
      payment: cached.paymentState ? { name: pInfo?.label || 'Neznámy stav', technicalName: cached.paymentState, message: pInfo?.message || null } : null
    },
    message: buildCombinedStateMessage({ order: cached.orderState, delivery: cached.deliveryState, payment: cached.paymentState }),
    createdAt: cached.lastUpdate,
    tracking: cached.tracking || null,
    customer: { email: cached.email, name: cached.customer || '' },
    source: 'push-cache' as const
  };
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const { orderNumber, email, firstName, lastName } = body as {
    orderNumber?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  };

  // Validácia: buď číslo objednávky, alebo email + priezvisko
  if (!orderNumber && !(email && lastName)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Zadajte číslo objednávky, alebo email + priezvisko'
    });
  }

  const SUPPORT_PHONE = '+421 948 993 236';
  const CACHE_TTL = 1800; // 30 min

  try {
    const storage = useStorage('redis');

    // 1. Push cache (z n8n webhook) — najrýchlejší
    if (orderNumber) {
      const pushed = await storage.getItem<any>(`order:${orderNumber}`).catch(() => null);
      if (pushed?.orderNumber) {
        return buildResponseFromCache(pushed);
      }
    }
    if (orderNumber && email) {
      const pushed = await storage.getItem<any>(`order:${orderNumber}:${email.toLowerCase()}`).catch(() => null);
      if (pushed?.orderNumber) {
        return buildResponseFromCache(pushed);
      }
    }

    // 2. Hash-based lookup cache
    const cacheKey = `order-lookup:${hash({ orderNumber, email, firstName, lastName })}`;
    const cached = await storage.getItem(cacheKey).catch(() => null);
    if (cached) return cached;

    // 3a. n8n fallback (len pre lookup podľa čísla)
    const n8nUrl = (config as any).n8nWebhookUrl as string;
    if (n8nUrl && orderNumber) {
      try {
        const n8nResult = await $fetch<any>(n8nUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: { orderNumber, email },
          timeout: 8000
        });
        if (n8nResult?.found) return n8nResult;
      } catch { /* n8n nedostupný */ }
    }

    // 3b. Shopware Admin API
    const { orders, multiple } = await findOrderByNumberOrEmail(orderNumber, email, firstName, lastName);

    if (!orders.length) {
      const msg = multiple === false && !orderNumber
        ? `Nenašli sa žiadne objednávky za posledných 30 dní. Staršia história objednávok je dostupná po prihlásení do vášho účtu.`
        : `Objednávka sa nenašla. Kontaktujte prosím našu podporu.`;
      const errorResponse = { found: false, message: msg, support: SUPPORT_PHONE };
      await storage.setItem(cacheKey, errorResponse, { ttl: 300 }).catch(() => null);
      return errorResponse;
    }

    const result = {
      found: true,
      multiple: orders.length > 1,
      orders: orders.map(buildOrderResult),
      // Späť-kompatibilita — prvá objednávka ako hlavná
      ...(orders.length === 1 ? buildOrderResult(orders[0]) : {
        orderNumber: null,
        message: `Našli sme ${orders.length} objednávky za posledných 30 dní.`,
        states: null,
        createdAt: null,
        customer: buildOrderResult(orders[0]).customer
      })
    };

    await storage.setItem(cacheKey, result, { ttl: CACHE_TTL }).catch(() => null);
    return result;
  } catch (error) {
    console.error('Order lookup error:', error);
    return {
      found: false,
      message: 'Chyba pri vyhľadávaní objednávky. Kontaktujte prosím našu podporu.',
      support: SUPPORT_PHONE
    };
  }
});
