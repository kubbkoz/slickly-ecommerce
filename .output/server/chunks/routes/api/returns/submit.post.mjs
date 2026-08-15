import { d as defineEventHandler, c as createError, r as readBody, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const submit_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g;
  const config = useRuntimeConfig();
  const endpoint = config.public.shopware.endpoint;
  const accessToken = config.public.shopware.accessToken;
  if (!endpoint || !accessToken) {
    throw createError({ statusCode: 503, statusMessage: "Shopware Store API not configured" });
  }
  const body = await readBody(event);
  const required = ["formType", "orderNumber", "firstName", "lastName", "customerEmail", "customerPhone", "customerAddress", "itemsDescription", "reasonDetail"];
  for (const f of required) {
    if (!(body == null ? void 0 : body[f])) {
      throw createError({ statusCode: 400, statusMessage: `Missing field: ${f}` });
    }
  }
  if (!["vratenie", "reklamacia"].includes(body.formType)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid formType" });
  }
  if (body.formType === "vratenie" && !body.bankAccount) {
    throw createError({ statusCode: 400, statusMessage: "IBAN required for vratenie" });
  }
  try {
    const res = await $fetch(`${endpoint.replace(/\/+$/, "")}/mtsport-return`, {
      method: "POST",
      headers: {
        "sw-access-key": accessToken,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body
    });
    return res;
  } catch (e) {
    const swStatus = ((_a = e == null ? void 0 : e.response) == null ? void 0 : _a.status) || (e == null ? void 0 : e.statusCode);
    const swData = (_c = e == null ? void 0 : e.data) != null ? _c : (_b = e == null ? void 0 : e.response) == null ? void 0 : _b._data;
    const swDetail = ((_e = (_d = swData == null ? void 0 : swData.errors) == null ? void 0 : _d[0]) == null ? void 0 : _e.detail) || ((_g = (_f = swData == null ? void 0 : swData.errors) == null ? void 0 : _f[0]) == null ? void 0 : _g.title) || (swData == null ? void 0 : swData.error) || (e == null ? void 0 : e.message) || "Submit failed";
    console.error(
      "[returns/submit] Shopware Store API failed:",
      "status=",
      swStatus,
      "detail=",
      swDetail,
      "fullData=",
      JSON.stringify(swData != null ? swData : {}).substring(0, 500)
    );
    throw createError({
      statusCode: 502,
      statusMessage: `Shopware ${swStatus || ""}: ${swDetail}`.trim()
    });
  }
});

export { submit_post as default };
