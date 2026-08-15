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

const reviewsClearCache_get = defineEventHandler(async () => {
  const storage = useStorage();
  await storage.removeItem("/cache:nitro/functions:google-reviews:default.json").catch(() => null);
  return { success: true, message: "Cache vymazan\xE1. Daj refresh /api/google/reviews" };
});

export { reviewsClearCache_get as default };
