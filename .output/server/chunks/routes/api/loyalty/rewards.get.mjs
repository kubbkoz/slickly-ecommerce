import { d as defineEventHandler, p as parseCookies, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const rewards_get = defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const swToken = cookies["sw-context-token"];
  if (!swToken) return { rewards: [], availablePoints: 0 };
  const config = useRuntimeConfig();
  const endpoint = config.public.shopware.endpoint;
  const accessToken = config.public.shopware.accessToken;
  try {
    return await $fetch(`${endpoint}loyalty/rewards`, {
      method: "GET",
      headers: { "sw-access-key": accessToken, "sw-context-token": swToken }
    });
  } catch {
    return { rewards: [], availablePoints: 0 };
  }
});

export { rewards_get as default };
