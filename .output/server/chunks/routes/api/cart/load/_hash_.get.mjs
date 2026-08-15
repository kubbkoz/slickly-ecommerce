import { d as defineEventHandler, h as getRouterParam, c as createError, b as useStorage } from '../../../../nitro/nitro.mjs';
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

const _hash__get = defineEventHandler(async (event) => {
  const hash = getRouterParam(event, "hash");
  if (!hash) {
    throw createError({ statusCode: 400, statusMessage: "Hash required" });
  }
  if (!/^[0-9a-f]{32}$/i.test(hash)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid hash format" });
  }
  const storage = useStorage("cart-saves");
  const data = await storage.getItem(hash);
  if (!data) {
    throw createError({ statusCode: 404, statusMessage: "Saved cart not found or expired" });
  }
  if (data.expiresAt && Date.now() > data.expiresAt) {
    await storage.removeItem(hash);
    throw createError({ statusCode: 410, statusMessage: "Saved cart has expired" });
  }
  return { items: data.items };
});

export { _hash__get as default };
