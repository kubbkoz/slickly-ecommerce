import { d as defineEventHandler, e as getHeader, c as createError, r as readBody, b as useStorage, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const webhook_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const authHeader = getHeader(event, "x-webhook-secret");
  const expectedSecret = config.webhookSecret;
  if (expectedSecret && authHeader !== expectedSecret) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const body = await readBody(event);
  const {
    orderNumber,
    email,
    orderState,
    deliveryState,
    paymentState,
    customer,
    tracking,
    updatedAt
  } = body;
  if (!orderNumber || !email) {
    throw createError({ statusCode: 400, statusMessage: "orderNumber and email required" });
  }
  const storage = useStorage("redis");
  const CACHE_TTL = 2592e3;
  const orderData = {
    orderNumber,
    email,
    orderState: orderState || null,
    deliveryState: deliveryState || null,
    paymentState: paymentState || null,
    customer: customer || null,
    tracking: tracking || null,
    lastUpdate: updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
    cachedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  await Promise.all([
    storage.setItem(`order:${orderNumber}`, orderData, { ttl: CACHE_TTL }),
    storage.setItem(`order:${orderNumber}:${email.toLowerCase()}`, orderData, { ttl: CACHE_TTL })
  ]);
  console.info(`[webhook] Order ${orderNumber} updated: order=${orderState}, delivery=${deliveryState}, payment=${paymentState}`);
  return { ok: true, orderNumber, cachedAt: orderData.cachedAt };
});

export { webhook_post as default };
