import { d as defineEventHandler, v as verifySwCustomer, b as useStorage } from '../../../nitro/nitro.mjs';
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

const userSaves_get = defineEventHandler(async (event) => {
  var _a;
  const userId = await verifySwCustomer(event);
  const storage = useStorage("cart-saves");
  const userKey = `user:${userId}`;
  const index = (_a = await storage.getItem(userKey)) != null ? _a : [];
  const now = Date.now();
  const results = await Promise.all(
    index.map(async (entry) => {
      const data = await storage.getItem(entry.hash);
      if (!data || data.expiresAt < now) return null;
      return {
        hash: entry.hash,
        createdAt: entry.createdAt,
        itemCount: data.items.length,
        items: data.items
      };
    })
  );
  const valid = results.filter(Boolean);
  if (valid.length !== index.length) {
    const validHashes = new Set(valid.map((v) => v.hash));
    await storage.setItem(userKey, index.filter((e) => validHashes.has(e.hash)));
  }
  return valid;
});

export { userSaves_get as default };
