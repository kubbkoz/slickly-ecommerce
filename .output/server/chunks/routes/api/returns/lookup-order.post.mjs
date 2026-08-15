import { d as defineEventHandler, c as createError, r as readBody, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const lookupOrder_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const endpoint = config.public.shopware.endpoint;
  const accessToken = config.public.shopware.accessToken;
  if (!endpoint || !accessToken) {
    throw createError({ statusCode: 503, statusMessage: "Shopware Store API not configured" });
  }
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.orderNumber) || !(body == null ? void 0 : body.email)) {
    throw createError({ statusCode: 400, statusMessage: "orderNumber and email required" });
  }
  try {
    const res = await $fetch(`${endpoint.replace(/\/+$/, "")}/mtsport-return/lookup-order`, {
      method: "POST",
      headers: {
        "sw-access-key": accessToken,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: {
        orderNumber: String(body.orderNumber).trim(),
        email: String(body.email).trim()
      }
    });
    return res;
  } catch (e) {
    console.error("[returns/lookup-order] Shopware Store API failed:", (e == null ? void 0 : e.message) || e);
    return { found: false, error: "lookup_failed" };
  }
});

export { lookupOrder_post as default };
