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
  if (!hash) throw createError({ statusCode: 400, message: "Hash required" });
  const storage = useStorage("redis");
  const data = await storage.getItem(`comparison:${hash}`).catch(() => null);
  if (!data) throw createError({ statusCode: 404, message: "Porovnanie nen\xE1jden\xE9 alebo vypr\u0161alo" });
  return data;
});

export { _hash__get as default };
