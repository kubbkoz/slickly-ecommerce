import { d as defineEventHandler, h as getRouterParam, c as createError, b as useStorage, v as verifySwCustomer } from '../../../../nitro/nitro.mjs';
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

const _hash__delete = defineEventHandler(async (event) => {
  var _a;
  const hash = getRouterParam(event, "hash");
  if (!hash) throw createError({ statusCode: 400, statusMessage: "Hash required" });
  if (!/^[0-9a-f]{32}$/i.test(hash)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid hash format" });
  }
  const storage = useStorage("cart-saves");
  const data = await storage.getItem(hash);
  if (!data) throw createError({ statusCode: 404, statusMessage: "Not found" });
  if (data.userId) {
    let callerId;
    try {
      callerId = await verifySwCustomer(event);
    } catch {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }
    if (callerId !== data.userId) {
      throw createError({ statusCode: 403, statusMessage: "Forbidden" });
    }
    await storage.removeItem(hash);
    const userKey = `user:${data.userId}`;
    const index = (_a = await storage.getItem(userKey)) != null ? _a : [];
    await storage.setItem(userKey, index.filter((e) => e.hash !== hash));
  } else {
    await storage.removeItem(hash);
  }
  return { ok: true };
});

export { _hash__delete as default };
