import { d as defineEventHandler, e as getHeader, c as createError, b as useStorage, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const refresh_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const secret = getHeader(event, "x-webhook-secret");
  if (!config.webhookSecret || secret !== config.webhookSecret) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  const storage = useStorage("redis");
  const keys = await storage.getKeys("blog:").catch(() => []);
  await Promise.all(keys.map((k) => storage.removeItem(k).catch(() => null)));
  return { invalidated: keys.length, keys };
});

export { refresh_post as default };
