import { d as defineEventHandler, m as requireDebugAuth, b as useStorage, g as getQuery } from '../../../nitro/nitro.mjs';
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

const debug_get = defineEventHandler(async (event) => {
  requireDebugAuth(event);
  const storage = useStorage("db");
  const q = getQuery(event);
  const productId = q.productId || "41fc61c28d1949af17dbe967e205b4a1";
  const allKeys = await storage.getKeys().catch(() => ["ERROR_GETKEYS"]);
  const watchdogKeys = allKeys.filter((k) => k.includes("watchdog"));
  const matchingKeys = allKeys.filter((k) => k.startsWith(`watchdog:${productId}:`));
  const values = {};
  for (const key of matchingKeys.slice(0, 5)) {
    values[key] = await storage.getItem(key).catch(() => null);
  }
  return {
    storageType: "redis",
    totalKeys: allKeys.length,
    watchdogKeys: watchdogKeys.length,
    matchingKeys: matchingKeys.length,
    sampleKeys: watchdogKeys.slice(0, 10),
    values
  };
});

export { debug_get as default };
