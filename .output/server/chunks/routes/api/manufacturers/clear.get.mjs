import { d as defineEventHandler, g as getQuery, b as useStorage, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const clear_get = defineEventHandler(async (event) => {
  var _a, _b;
  const config = useRuntimeConfig();
  const secret = (_b = config.webhookSecret) != null ? _b : (_a = config.public) == null ? void 0 : _a.webhookSecret;
  const { secret: provided } = getQuery(event);
  if (!provided || provided !== secret) {
    return { error: "Unauthorized" };
  }
  const storage = useStorage();
  await storage.removeItem("/cache:nitro/functions:manufacturers-list:all.json");
  return { cleared: true };
});

export { clear_get as default };
