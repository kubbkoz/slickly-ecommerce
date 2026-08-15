import { d as defineEventHandler, r as readBody, c as createError, v as verifySwCustomer, b as useStorage } from '../../../nitro/nitro.mjs';
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

const save_post = defineEventHandler(async (event) => {
  var _a;
  const { items } = await readBody(event);
  if (!(items == null ? void 0 : items.length)) {
    throw createError({ statusCode: 400, statusMessage: "No items provided" });
  }
  const validItems = items.filter((i) => i.id && i.quantity > 0);
  if (!validItems.length) {
    throw createError({ statusCode: 400, statusMessage: "No valid items" });
  }
  let verifiedUserId = null;
  try {
    verifiedUserId = await verifySwCustomer(event);
  } catch {
  }
  const hash = crypto.randomUUID().replace(/-/g, "");
  const now = Date.now();
  const expiresAt = now + 30 * 24 * 60 * 60 * 1e3;
  const storage = useStorage("cart-saves");
  await storage.setItem(hash, {
    items: validItems,
    createdAt: now,
    expiresAt,
    userId: verifiedUserId
  });
  if (verifiedUserId) {
    const userKey = `user:${verifiedUserId}`;
    const existing = (_a = await storage.getItem(userKey)) != null ? _a : [];
    existing.unshift({ hash, createdAt: now, itemCount: validItems.length });
    await storage.setItem(userKey, existing.slice(0, 10));
  }
  return { hash };
});

export { save_post as default };
