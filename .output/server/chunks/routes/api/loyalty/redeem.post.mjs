import { d as defineEventHandler, p as parseCookies, r as readBody, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const redeem_post = defineEventHandler(async (event) => {
  var _a;
  const cookies = parseCookies(event);
  const swToken = cookies["sw-context-token"];
  if (!swToken) return { success: false, error: "not_logged_in" };
  const config = useRuntimeConfig();
  const endpoint = config.public.shopware.endpoint;
  const accessToken = config.public.shopware.accessToken;
  const body = await readBody(event);
  try {
    return await $fetch(`${endpoint}loyalty/redeem`, {
      method: "POST",
      body: { rewardId: body.rewardId },
      headers: { "sw-access-key": accessToken, "sw-context-token": swToken }
    });
  } catch (e) {
    return { success: false, error: ((_a = e == null ? void 0 : e.data) == null ? void 0 : _a.error) || "Nepodarilo sa uplatni\u0165 odmenu." };
  }
});

export { redeem_post as default };
