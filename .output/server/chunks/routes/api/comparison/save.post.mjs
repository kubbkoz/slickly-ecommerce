import { d as defineEventHandler, r as readBody, b as useStorage } from '../../../nitro/nitro.mjs';
import nodeCrypto from 'node:crypto';
import 'nodemailer';
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

const CACHE_TTL = 60 * 60 * 24 * 7;
const save_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { items, userId } = body;
  if (!Array.isArray(items) || items.length < 2) {
    return { success: false, error: "Minim\xE1lne 2 produkty." };
  }
  const storage = useStorage("redis");
  const hash = nodeCrypto.randomUUID().replace(/-/g, "");
  await storage.setItem(`comparison:${hash}`, {
    items,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    userId: userId || null
  }, { ttl: CACHE_TTL });
  if (userId) {
    const indexKey = `user:comparisons:${userId}`;
    const existing = await storage.getItem(indexKey).catch(() => null) || [];
    const updated = [hash, ...existing.filter((h) => h !== hash)].slice(0, 20);
    await storage.setItem(indexKey, updated, { ttl: CACHE_TTL * 4 }).catch(() => null);
  }
  return { success: true, hash };
});

export { save_post as default };
