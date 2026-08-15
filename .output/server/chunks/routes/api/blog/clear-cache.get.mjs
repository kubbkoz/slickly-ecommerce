import { d as defineEventHandler, b as useStorage, g as getQuery } from '../../../nitro/nitro.mjs';
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

const clearCache_get = defineEventHandler(async (event) => {
  const storage = useStorage("redis");
  const { slug } = getQuery(event);
  if (slug && typeof slug === "string") {
    await storage.removeItem(`blog:post:${slug}`).catch(() => null);
    return { cleared: [`blog:post:${slug}`] };
  }
  const keys = await storage.getKeys("blog:post:").catch(() => []);
  await Promise.all(keys.map((k) => storage.removeItem(k).catch(() => null)));
  return { cleared: keys };
});

export { clearCache_get as default };
