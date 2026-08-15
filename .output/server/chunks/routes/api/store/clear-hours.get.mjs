import { d as defineEventHandler, b as useStorage } from '../../../nitro/nitro.mjs';
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

const clearHours_get = defineEventHandler(async () => {
  const storage = useStorage("redis");
  await storage.removeItem("store:hours").catch(() => null);
  return { cleared: "store:hours" };
});

export { clearHours_get as default };
