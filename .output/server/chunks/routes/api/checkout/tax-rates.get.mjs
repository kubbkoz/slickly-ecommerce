import { d as defineEventHandler, i as defineCachedFunction, u as useRuntimeConfig, a as getAdminToken } from '../../../nitro/nitro.mjs';
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
const STANDARD_TAX_ID = "019b07f46927733d9c025876e11c296b";
const STANDARD_TAX_RATE_FALLBACK = 23;
const fetchTaxRates = defineCachedFunction(
  async () => {
    var _a;
    const config = useRuntimeConfig();
    const adminEndpoint = config.shopwareAdminEndpoint;
    const token = await getAdminToken();
    const rulesRes = await $fetch(`${adminEndpoint}search/tax-rule`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      body: {
        limit: 500,
        filter: [{ type: "equals", field: "taxId", value: STANDARD_TAX_ID }],
        includes: { tax_rule: ["countryId", "taxRate"] }
      }
    });
    const map = { _default: STANDARD_TAX_RATE_FALLBACK };
    for (const rule of (_a = rulesRes == null ? void 0 : rulesRes.data) != null ? _a : []) {
      if (rule.countryId && rule.taxRate != null) {
        map[rule.countryId] = rule.taxRate;
      }
    }
    return map;
  },
  { name: "checkout-tax-rates", getKey: () => "all", maxAge: CACHE_TTL }
);
const taxRates_get = defineEventHandler(async () => {
  var _a;
  try {
    return await fetchTaxRates();
  } catch (e) {
    console.error("[tax-rates] Failed:", (_a = e == null ? void 0 : e.message) != null ? _a : e);
    return { _default: STANDARD_TAX_RATE_FALLBACK };
  }
});

export { taxRates_get as default };
