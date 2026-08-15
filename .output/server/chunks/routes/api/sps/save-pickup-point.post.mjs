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

const savePickupPoint_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const config = useRuntimeConfig();
  const endpoint = config.public.shopware.endpoint;
  const accessToken = config.public.shopware.accessToken;
  if (!endpoint || !accessToken) {
    throw createError({ statusCode: 503, statusMessage: "Shopware Store API not configured" });
  }
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.orderId) || !((_a = body == null ? void 0 : body.pickupPoint) == null ? void 0 : _a.id)) {
    throw createError({ statusCode: 400, statusMessage: "Missing orderId or pickupPoint" });
  }
  try {
    const res = await $fetch(`${endpoint.replace(/\/+$/, "")}/mtsport-sps/pickup-point`, {
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
    const swStatus = ((_b = e == null ? void 0 : e.response) == null ? void 0 : _b.status) || (e == null ? void 0 : e.statusCode);
    const swData = (_d = e == null ? void 0 : e.data) != null ? _d : (_c = e == null ? void 0 : e.response) == null ? void 0 : _c._data;
    const swDetail = ((_f = (_e = swData == null ? void 0 : swData.errors) == null ? void 0 : _e[0]) == null ? void 0 : _f.detail) || ((_h = (_g = swData == null ? void 0 : swData.errors) == null ? void 0 : _g[0]) == null ? void 0 : _h.title) || (swData == null ? void 0 : swData.error) || (e == null ? void 0 : e.message) || "Save pickup point failed";
    console.error(
      "[sps/save-pickup-point] Shopware Store API failed:",
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

export { savePickupPoint_post as default };
