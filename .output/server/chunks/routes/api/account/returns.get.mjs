import { d as defineEventHandler, c as createError, g as getQuery, a as getAdminToken, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const returns_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const config = useRuntimeConfig();
  const adminEndpoint = config.shopwareAdminEndpoint;
  if (!adminEndpoint) {
    throw createError({ statusCode: 503, statusMessage: "Shopware Admin API not configured" });
  }
  const query = getQuery(event);
  const email = String((_a = query.email) != null ? _a : "").trim().toLowerCase();
  if (!email) {
    throw createError({ statusCode: 400, statusMessage: "email query param required" });
  }
  try {
    const token = await getAdminToken();
    const res = await $fetch(`${adminEndpoint}mtsport-return-request?filter[customerEmail]=${encodeURIComponent(email)}&sort=-createdAt&limit=50`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
    });
    const elements = ((_b = res == null ? void 0 : res.data) != null ? _b : []).map((r) => ({
      id: r.id,
      referenceNumber: r.referenceNumber,
      formType: r.formType,
      orderNumber: r.orderNumber,
      status: r.status,
      customerName: r.customerName,
      customerEmail: r.customerEmail,
      reasonCategory: r.reasonCategory,
      createdAt: r.createdAt
    }));
    return { total: (_d = (_c = res == null ? void 0 : res.meta) == null ? void 0 : _c.total) != null ? _d : elements.length, elements };
  } catch (e) {
    console.error("[account/returns] Admin API failed:", (e == null ? void 0 : e.message) || e);
    return { total: 0, elements: [] };
  }
});

export { returns_get as default };
