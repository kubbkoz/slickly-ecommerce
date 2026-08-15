import { d as defineEventHandler, p as parseCookies, b as useStorage, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const comparisons_get = defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const swToken = cookies["sw-context-token"];
  if (!swToken) return [];
  const config = useRuntimeConfig();
  const endpoint = config.public.shopware.endpoint;
  const accessToken = config.public.shopware.accessToken;
  let userId = null;
  try {
    const customer = await $fetch(`${endpoint}account/customer`, {
      headers: { "sw-access-key": accessToken, "sw-context-token": swToken }
    });
    userId = customer == null ? void 0 : customer.id;
  } catch {
    return [];
  }
  if (!userId) return [];
  const storage = useStorage("redis");
  const hashes = await storage.getItem(`user:comparisons:${userId}`).catch(() => null) || [];
  const results = [];
  for (const hash of hashes) {
    const data = await storage.getItem(`comparison:${hash}`).catch(() => null);
    if (data) {
      results.push({ hash, ...data });
    }
  }
  return results;
});

export { comparisons_get as default };
