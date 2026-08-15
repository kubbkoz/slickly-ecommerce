import { d as defineEventHandler, m as requireDebugAuth, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const shopware_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  requireDebugAuth(event);
  const config = useRuntimeConfig();
  const sw = (_a = config.public.shopware) != null ? _a : {};
  const endpoint = String(sw.endpoint || "").replace(/\/+$/, "");
  const token = String(sw.accessToken || "");
  const url = `${endpoint}/context`;
  const base = {
    endpoint,
    contextUrl: url,
    tokenPresent: token.length > 0,
    tokenPreview: token ? `${token.slice(0, 6)}\u2026(${token.length})` : "(pr\xE1zdny)",
    ids: {
      salesChannel: (_c = (_b = sw.ids) == null ? void 0 : _b.salesChannel) != null ? _c : null,
      rootCategory: (_e = (_d = sw.ids) == null ? void 0 : _d.rootCategory) != null ? _e : null,
      homeSlider: (_h = (_g = (_f = sw.ids) == null ? void 0 : _f.categories) == null ? void 0 : _g.homeSlider) != null ? _h : null
    },
    node: process.version,
    time: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (!endpoint || !token) {
    return {
      ok: false,
      reachable: null,
      httpStatus: null,
      ...base,
      hint: "Ch\xFDba endpoint alebo accessToken v runtimeConfig (build-time NUXT_PUBLIC_SHOPWARE_*)."
    };
  }
  const started = Date.now();
  try {
    const res = await $fetch.raw(url, {
      method: "GET",
      headers: { "sw-access-key": token, accept: "application/json" },
      timeout: 8e3,
      ignoreResponseError: true
    });
    const body = res._data;
    return {
      ok: res.status >= 200 && res.status < 300,
      reachable: true,
      httpStatus: res.status,
      ms: Date.now() - started,
      ...base,
      responseKeys: body && typeof body === "object" ? Object.keys(body).slice(0, 12) : null,
      errorDetail: res.status >= 400 ? (_i = body == null ? void 0 : body.errors) != null ? _i : body : null,
      hint: res.status >= 200 && res.status < 300 ? "Backend OK zo servera \u2014 token aj endpoint funguj\xFA." : res.status === 401 || res.status === 403 ? "Token je neplatn\xFD/zl\xFD (401/403). Skontroluj NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN." : `HTTP ${res.status} z backendu.`
    };
  } catch (e) {
    return {
      ok: false,
      reachable: false,
      httpStatus: null,
      ms: Date.now() - started,
      ...base,
      error: String((e == null ? void 0 : e.message) || e),
      code: (_l = (_k = e == null ? void 0 : e.code) != null ? _k : (_j = e == null ? void 0 : e.cause) == null ? void 0 : _j.code) != null ? _l : null,
      hint: "Server NEDOSIAHOL backend (network/timeout). Outbound z HostCreators je pravdepodobne blokovan\xFD \u2014 treba povoli\u0165 odch\xE1dzaj\xFAce spojenie na backend."
    };
  }
});

export { shopware_get as default };
