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

const summary_get = defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const swToken = cookies["sw-context-token"];
  if (!swToken) return { error: "not_logged_in" };
  const config = useRuntimeConfig();
  const endpoint = config.public.shopware.endpoint;
  const accessToken = config.public.shopware.accessToken;
  try {
    return await $fetch(`${endpoint}loyalty/summary`, {
      method: "GET",
      headers: { "sw-access-key": accessToken, "sw-context-token": swToken }
    });
  } catch (e) {
    return { error: "fetch_failed" };
  }
});

export { summary_get as default };
