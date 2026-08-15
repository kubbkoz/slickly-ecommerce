import { d as defineEventHandler, g as getQuery, c as createError, b as useStorage, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const taxRatesClear_get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { secret } = getQuery(event);
  if (secret !== config.webhookSecret) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const storage = useStorage();
  await storage.removeItem("/cache:nitro/functions:checkout-tax-rates:all.json");
  return { cleared: true };
});

export { taxRatesClear_get as default };
