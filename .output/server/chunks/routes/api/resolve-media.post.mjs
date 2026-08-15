import { d as defineEventHandler, r as readBody, a as getAdminToken, C as invalidateAdminToken, u as useRuntimeConfig } from '../../nitro/nitro.mjs';
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

const resolveMedia_post = defineEventHandler(async (event) => {
  const { ids } = await readBody(event);
  if (!Array.isArray(ids) || ids.length === 0) return {};
  const config = useRuntimeConfig();
  const endpoint = config.shopwareAdminEndpoint;
  const clientId = config.shopwareAdminClientId;
  const clientSecret = config.shopwareAdminClientSecret;
  if (!clientId || !clientSecret) return {};
  const safeIds = ids.slice(0, 500);
  try {
    const token = await getAdminToken();
    const res = await $fetch(`${endpoint}search/media`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      },
      body: {
        filter: [{ type: "equalsAny", field: "id", value: safeIds }],
        includes: { media: ["id", "url"] },
        limit: safeIds.length
      }
    });
    const items = (res == null ? void 0 : res.data) || [];
    const map = {};
    for (const item of items) {
      if (item.id && item.url) map[item.id] = item.url;
    }
    return map;
  } catch (e) {
    await invalidateAdminToken();
    return {};
  }
});

export { resolveMedia_post as default };
