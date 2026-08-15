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

const navigation_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
  requireDebugAuth(event);
  const config = useRuntimeConfig();
  const sw = (_a = config.public.shopware) != null ? _a : {};
  const endpoint = String(sw.endpoint || "").replace(/\/+$/, "");
  const token = String(sw.accessToken || "");
  if (!endpoint || !token) {
    return { ok: false, error: "Ch\xFDba endpoint/accessToken v runtimeConfig." };
  }
  const headers = { "sw-access-key": token, accept: "application/json", "content-type": "application/json" };
  const out = { endpoint, salesChannelId: null, rootCategoryId: null, totalCategories: 0, categories: [] };
  try {
    const ctx = await $fetch(`${endpoint}/context`, { headers, timeout: 8e3 });
    out.salesChannelId = (_c = (_b = ctx == null ? void 0 : ctx.salesChannel) == null ? void 0 : _b.id) != null ? _c : null;
    out.rootCategoryId = (_h = (_g = (_d = ctx == null ? void 0 : ctx.salesChannel) == null ? void 0 : _d.navigationCategoryId) != null ? _g : (_f = (_e = ctx == null ? void 0 : ctx.salesChannel) == null ? void 0 : _e.navigationCategory) == null ? void 0 : _f.id) != null ? _h : null;
    out.currencyId = (_j = (_i = ctx == null ? void 0 : ctx.currency) == null ? void 0 : _i.id) != null ? _j : null;
    out.languageId = (_l = (_k = ctx == null ? void 0 : ctx.salesChannel) == null ? void 0 : _k.languageId) != null ? _l : null;
  } catch (e) {
    out.contextError = String((e == null ? void 0 : e.message) || e);
  }
  try {
    const res = await $fetch(`${endpoint}/category`, {
      method: "POST",
      headers,
      timeout: 12e3,
      body: {
        limit: 500,
        includes: { category: ["id", "name", "translated", "level", "parentId", "type", "active", "visible"] },
        sort: [{ field: "level", order: "asc" }, { field: "name", order: "asc" }]
      }
    });
    const els = (_m = res == null ? void 0 : res.elements) != null ? _m : [];
    out.totalCategories = (_n = res == null ? void 0 : res.total) != null ? _n : els.length;
    out.categories = els.map((c) => {
      var _a2, _b2;
      return {
        id: c.id,
        name: (_b2 = (_a2 = c.translated) == null ? void 0 : _a2.name) != null ? _b2 : c.name,
        level: c.level,
        parentId: c.parentId,
        type: c.type,
        active: c.active,
        visible: c.visible
      };
    });
  } catch (e) {
    out.categoryError = String((e == null ? void 0 : e.message) || e);
    out.categoryStatus = (_q = (_p = (_o = e == null ? void 0 : e.response) == null ? void 0 : _o.status) != null ? _p : e == null ? void 0 : e.statusCode) != null ? _q : null;
  }
  out.hint = "Skop\xEDruj `id` kateg\xF3ri\xED do NUXT_PUBLIC_SW_ID_CAT_* (home slider, featured, flash sales\u2026), salesChannelId \u2192 NUXT_PUBLIC_SW_ID_SALES_CHANNEL, rootCategoryId \u2192 NUXT_PUBLIC_SW_ID_ROOT_CATEGORY.";
  return out;
});

export { navigation_get as default };
