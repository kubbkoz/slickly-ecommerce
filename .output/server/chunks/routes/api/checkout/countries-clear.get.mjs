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

const countriesClear_get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  if (query.secret !== config.webhookSecret) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const storage = useStorage();
  await storage.removeItem("/cache:nitro/functions:checkout-countries:v1.json");
  return { cleared: true };
});

export { countriesClear_get as default };
