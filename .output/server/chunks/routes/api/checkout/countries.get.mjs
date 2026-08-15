import { d as defineEventHandler, i as defineCachedFunction, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const CACHE_TTL = 3600;
const fetchCountries = defineCachedFunction(
  async () => {
    var _a, _b;
    const config = useRuntimeConfig();
    const endpoint = (_a = config.public.shopware) == null ? void 0 : _a.endpoint;
    const accessToken = (_b = config.public.shopware) == null ? void 0 : _b.accessToken;
    const res = await $fetch(`${endpoint}country`, {
      method: "POST",
      headers: {
        "sw-access-key": accessToken,
        "Content-Type": "application/json"
      },
      body: {
        filter: [{ type: "equals", field: "active", value: true }],
        includes: { country: ["id", "name", "translated", "iso", "position"] },
        sort: [{ field: "position", order: "ASC" }],
        limit: 100
      }
    });
    return (res.elements || []).map((c) => {
      var _a2;
      return {
        id: c.id,
        name: (((_a2 = c.translated) == null ? void 0 : _a2.name) || c.name || "").trim(),
        iso: (c.iso || "").toUpperCase()
      };
    }).filter((c) => c.iso && c.name);
  },
  { name: "checkout-countries", getKey: () => "v1", maxAge: CACHE_TTL }
);
const countries_get = defineEventHandler(async () => {
  var _a;
  try {
    return await fetchCountries();
  } catch (e) {
    console.error("[checkout/countries] Failed:", (_a = e == null ? void 0 : e.message) != null ? _a : e);
    return [];
  }
});

export { countries_get as default };
