import { d as defineEventHandler, g as getQuery, a as getAdminToken, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const checkEmail_get = defineEventHandler(async (event) => {
  var _a;
  const { email } = getQuery(event);
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return { exists: false };
  }
  const config = useRuntimeConfig();
  const endpoint = config.shopwareAdminEndpoint;
  try {
    const token = await getAdminToken();
    const res = await $fetch(`${endpoint}/api/customer`, {
      headers: { Authorization: `Bearer ${token}` },
      query: {
        "filter[email]": email.toLowerCase().trim(),
        limit: 1,
        "fields[customer]": "id"
      }
    });
    return { exists: ((_a = res == null ? void 0 : res.total) != null ? _a : 0) > 0 };
  } catch {
    return { exists: false };
  }
});

export { checkEmail_get as default };
