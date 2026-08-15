import { d as defineEventHandler, m as requireDebugAuth, b as useStorage } from '../../../nitro/nitro.mjs';
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

const lastError_get = defineEventHandler(async (event) => {
  requireDebugAuth(event);
  const last = await useStorage().getItem("debug:last-error").catch(() => null);
  if (!last) {
    return { message: "No error captured yet since last server start/deploy." };
  }
  return last;
});

export { lastError_get as default };
