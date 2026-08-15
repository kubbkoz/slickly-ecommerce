import { d as defineEventHandler, m as requireDebugAuth, a as getAdminToken, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const hoursDebug_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e;
  requireDebugAuth(event);
  const config = useRuntimeConfig();
  const adminEndpoint = config.shopwareAdminEndpoint;
  const salesChannelId = (_a = config.public.shopware.ids) == null ? void 0 : _a.salesChannel;
  try {
    const token = await getAdminToken();
    const sc = await $fetch(`${adminEndpoint}sales-channel/${salesChannelId}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
    });
    const cf = (_d = (_c = (_b = sc == null ? void 0 : sc.data) == null ? void 0 : _b.customFields) != null ? _c : sc == null ? void 0 : sc.customFields) != null ? _d : null;
    return {
      salesChannelId,
      adminEndpoint,
      customFieldsFound: !!cf,
      customFieldKeys: cf ? Object.keys(cf) : [],
      customFieldValues: cf,
      rawTopLevelKeys: sc ? Object.keys(sc) : []
    };
  } catch (e) {
    return {
      error: (_e = e == null ? void 0 : e.message) != null ? _e : String(e),
      salesChannelId,
      adminEndpoint
    };
  }
});

export { hoursDebug_get as default };
