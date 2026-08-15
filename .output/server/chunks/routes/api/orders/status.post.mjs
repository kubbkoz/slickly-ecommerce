import { d as defineEventHandler, r as readBody, c as createError, b as useStorage, j as hash, o as findOrderByNumberOrEmail, u as useRuntimeConfig, q as getOrderStateMessage, t as getDeliveryStateMessage, w as getPaymentStateMessage, x as buildCombinedStateMessage } from '../../../nitro/nitro.mjs';
import 'nodemailer';
import 'node:crypto';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'anymatch';
import 'lru-cache';
import 'vue-router';
import 'node:url';
import '@iconify/utils';
import 'consola';

function buildOrderResult(order) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const orderState = ((_a = order.stateMachineState) == null ? void 0 : _a.technicalName) || null;
  const deliveryState = ((_d = (_c = (_b = order.deliveries) == null ? void 0 : _b[0]) == null ? void 0 : _c.stateMachineState) == null ? void 0 : _d.technicalName) || null;
  const paymentState = ((_g = (_f = (_e = order.transactions) == null ? void 0 : _e[0]) == null ? void 0 : _f.stateMachineState) == null ? void 0 : _g.technicalName) || null;
  const oInfo = orderState ? getOrderStateMessage(orderState) : null;
  const dInfo = deliveryState ? getDeliveryStateMessage(deliveryState) : null;
  const pInfo = paymentState ? getPaymentStateMessage(paymentState) : null;
  return {
    orderNumber: order.orderNumber,
    states: {
      order: { name: (oInfo == null ? void 0 : oInfo.label) || "Nezn\xE1my stav", technicalName: orderState, message: (oInfo == null ? void 0 : oInfo.message) || null },
      delivery: deliveryState ? { name: (dInfo == null ? void 0 : dInfo.label) || "Nezn\xE1my stav", technicalName: deliveryState, message: (dInfo == null ? void 0 : dInfo.message) || null } : null,
      payment: paymentState ? { name: (pInfo == null ? void 0 : pInfo.label) || "Nezn\xE1my stav", technicalName: paymentState, message: (pInfo == null ? void 0 : pInfo.message) || null } : null
    },
    message: buildCombinedStateMessage({ order: orderState, delivery: deliveryState, payment: paymentState }),
    createdAt: order.createdAt,
    customer: { email: (_h = order.orderCustomer) == null ? void 0 : _h.email, name: `${((_i = order.orderCustomer) == null ? void 0 : _i.firstName) || ""} ${((_j = order.orderCustomer) == null ? void 0 : _j.lastName) || ""}`.trim() }
  };
}
function buildResponseFromCache(cached) {
  const oInfo = cached.orderState ? getOrderStateMessage(cached.orderState) : null;
  const dInfo = cached.deliveryState ? getDeliveryStateMessage(cached.deliveryState) : null;
  const pInfo = cached.paymentState ? getPaymentStateMessage(cached.paymentState) : null;
  return {
    found: true,
    orderNumber: cached.orderNumber,
    states: {
      order: { name: (oInfo == null ? void 0 : oInfo.label) || "Nezn\xE1my stav", technicalName: cached.orderState, message: (oInfo == null ? void 0 : oInfo.message) || null },
      delivery: cached.deliveryState ? { name: (dInfo == null ? void 0 : dInfo.label) || "Nezn\xE1my stav", technicalName: cached.deliveryState, message: (dInfo == null ? void 0 : dInfo.message) || null } : null,
      payment: cached.paymentState ? { name: (pInfo == null ? void 0 : pInfo.label) || "Nezn\xE1my stav", technicalName: cached.paymentState, message: (pInfo == null ? void 0 : pInfo.message) || null } : null
    },
    message: buildCombinedStateMessage({ order: cached.orderState, delivery: cached.deliveryState, payment: cached.paymentState }),
    createdAt: cached.lastUpdate,
    tracking: cached.tracking || null,
    customer: { email: cached.email, name: cached.customer || "" },
    source: "push-cache"
  };
}
const status_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const { orderNumber, email, firstName, lastName } = body;
  if (!orderNumber && !(email && lastName)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Zadajte \u010D\xEDslo objedn\xE1vky, alebo email + priezvisko"
    });
  }
  const SUPPORT_PHONE = "+421 918 564 238";
  const CACHE_TTL = 1800;
  try {
    const storage = useStorage("redis");
    if (orderNumber) {
      const pushed = await storage.getItem(`order:${orderNumber}`).catch(() => null);
      if (pushed == null ? void 0 : pushed.orderNumber) {
        return buildResponseFromCache(pushed);
      }
    }
    if (orderNumber && email) {
      const pushed = await storage.getItem(`order:${orderNumber}:${email.toLowerCase()}`).catch(() => null);
      if (pushed == null ? void 0 : pushed.orderNumber) {
        return buildResponseFromCache(pushed);
      }
    }
    const cacheKey = `order-lookup:${hash({ orderNumber, email, firstName, lastName })}`;
    const cached = await storage.getItem(cacheKey).catch(() => null);
    if (cached) return cached;
    const n8nUrl = config.n8nWebhookUrl;
    if (n8nUrl && orderNumber) {
      try {
        const n8nResult = await $fetch(n8nUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: { orderNumber, email },
          timeout: 8e3
        });
        if (n8nResult == null ? void 0 : n8nResult.found) return n8nResult;
      } catch {
      }
    }
    const { orders, multiple } = await findOrderByNumberOrEmail(orderNumber, email, firstName, lastName);
    if (!orders.length) {
      const msg = multiple === false && !orderNumber ? `Nena\u0161li sa \u017Eiadne objedn\xE1vky za posledn\xFDch 30 dn\xED. Star\u0161ia hist\xF3ria objedn\xE1vok je dostupn\xE1 po prihl\xE1sen\xED do v\xE1\u0161ho \xFA\u010Dtu.` : `Objedn\xE1vka sa nena\u0161la. Kontaktujte pros\xEDm na\u0161u podporu.`;
      const errorResponse = { found: false, message: msg, support: SUPPORT_PHONE };
      await storage.setItem(cacheKey, errorResponse, { ttl: 300 }).catch(() => null);
      return errorResponse;
    }
    const result = {
      found: true,
      multiple: orders.length > 1,
      orders: orders.map(buildOrderResult),
      // Späť-kompatibilita — prvá objednávka ako hlavná
      ...orders.length === 1 ? buildOrderResult(orders[0]) : {
        orderNumber: null,
        message: `Na\u0161li sme ${orders.length} objedn\xE1vky za posledn\xFDch 30 dn\xED.`,
        states: null,
        createdAt: null,
        customer: buildOrderResult(orders[0]).customer
      }
    };
    await storage.setItem(cacheKey, result, { ttl: CACHE_TTL }).catch(() => null);
    return result;
  } catch (error) {
    console.error("Order lookup error:", error);
    return {
      found: false,
      message: "Chyba pri vyh\u013Ead\xE1van\xED objedn\xE1vky. Kontaktujte pros\xEDm na\u0161u podporu.",
      support: SUPPORT_PHONE
    };
  }
});

export { status_post as default };
