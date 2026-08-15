import { d as defineEventHandler, e as getHeader, c as createError, b as useStorage, f as fetchAndCacheCatalog, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const catalogRefresh_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const secret = config.webhookSecret;
  if (!secret || getHeader(event, "x-admin-secret") !== secret) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const storage = useStorage("redis");
  await Promise.all([
    storage.removeItem("catalog:products").catch(() => null),
    storage.removeItem("catalog:formatted-prompt").catch(() => null)
  ]);
  console.info("[catalog] Cache zmazan\xE1 \u2014 sp\xFA\u0161\u0165am refresh...");
  const products = await fetchAndCacheCatalog();
  return {
    ok: true,
    count: products.length,
    refreshedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
});

export { catalogRefresh_post as default };
