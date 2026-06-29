// POST /api/orders/webhook
// n8n posiela sem aktualizácie pri zmene stavu objednávky (Shopware Flow Builder → n8n → tu)
// Uloží do Redis s TTL 30 dní — chat lookup číta z Redis first

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // Jednoduchý shared secret — nastav WEBHOOK_SECRET v .env
  const authHeader = getHeader(event, 'x-webhook-secret');
  const expectedSecret = config.webhookSecret as string;
  if (expectedSecret && authHeader !== expectedSecret) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const body = await readBody(event);

  // n8n payload: { orderNumber, email, orderState, deliveryState, paymentState, customer, tracking? }
  const {
    orderNumber,
    email,
    orderState,
    deliveryState,
    paymentState,
    customer,
    tracking,
    updatedAt
  } = body as {
    orderNumber: string;
    email: string;
    orderState: string;
    deliveryState?: string;
    paymentState?: string;
    customer?: string;
    tracking?: string;
    updatedAt?: string;
  };

  if (!orderNumber || !email) {
    throw createError({ statusCode: 400, statusMessage: 'orderNumber and email required' });
  }

  const storage = useStorage('redis');
  const CACHE_TTL = 2_592_000; // 30 dní (rovnako ako navrhol user)

  const orderData = {
    orderNumber,
    email,
    orderState: orderState || null,
    deliveryState: deliveryState || null,
    paymentState: paymentState || null,
    customer: customer || null,
    tracking: tracking || null,
    lastUpdate: updatedAt || new Date().toISOString(),
    cachedAt: new Date().toISOString()
  };

  // Uložiť pod dvomi kľúčmi — lookup podľa čísla aj emailu
  await Promise.all([
    storage.setItem(`order:${orderNumber}`, orderData, { ttl: CACHE_TTL }),
    storage.setItem(`order:${orderNumber}:${email.toLowerCase()}`, orderData, { ttl: CACHE_TTL })
  ]);

  // Invalidovať staré hash-based lookup cache (ak existuje)
  // (nové lookup priamo číta order:{orderNumber})
  console.info(`[webhook] Order ${orderNumber} updated: order=${orderState}, delivery=${deliveryState}, payment=${paymentState}`);

  return { ok: true, orderNumber, cachedAt: orderData.cachedAt };
});
