import { d as defineEventHandler, p as parseCookies, g as getQuery, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const transactions_get = defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const swToken = cookies["sw-context-token"];
  if (!swToken) return { transactions: [], total: 0 };
  const config = useRuntimeConfig();
  const endpoint = config.public.shopware.endpoint;
  const accessToken = config.public.shopware.accessToken;
  const query = getQuery(event);
  try {
    return await $fetch(`${endpoint}loyalty/transactions`, {
      method: "GET",
      params: { limit: query.limit || 20, page: query.page || 1 },
      headers: { "sw-access-key": accessToken, "sw-context-token": swToken }
    });
  } catch {
    return { transactions: [], total: 0 };
  }
});

export { transactions_get as default };
