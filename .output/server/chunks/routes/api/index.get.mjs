import { d as defineEventHandler, b as useStorage, a as getAdminToken, u as useRuntimeConfig } from '../../nitro/nitro.mjs';
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

const CACHE_KEY = "badge:all";
const CACHE_TTL = 300;
const NEGATIVE_CACHE_TTL = 60;
function parseJsonField(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string" && x.length > 0) : [];
  } catch {
    return [];
  }
}
async function resolveStreamsToProductIds(streamIds, adminEndpoint, token) {
  if (!streamIds.length) return [];
  const CONCURRENCY = 3;
  const ids = /* @__PURE__ */ new Set();
  for (let i = 0; i < streamIds.length; i += CONCURRENCY) {
    const batch = streamIds.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (streamId) => {
        var _a, _b;
        try {
          const res = await $fetch(`${adminEndpoint}search/product`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            body: {
              limit: 500,
              includes: { product: ["id"] },
              filter: [
                { type: "equals", field: "parentId", value: null },
                { type: "equals", field: "productStreams.id", value: streamId }
              ]
            }
          });
          for (const p of (_a = res == null ? void 0 : res.data) != null ? _a : []) {
            if (p == null ? void 0 : p.id) ids.add(p.id);
          }
        } catch (e) {
          console.error(`[badges] Stream ${streamId} resolve failed:`, (_b = e == null ? void 0 : e.message) != null ? _b : e);
        }
      })
    );
  }
  return [...ids];
}
const index_get = defineEventHandler(async () => {
  var _a, _b, _c, _d, _e;
  const storage = useStorage("redis");
  const cached = await storage.getItem(CACHE_KEY);
  if (cached && typeof cached.expiresAt === "number" && cached.expiresAt > Date.now()) {
    return cached.payload;
  }
  const config = useRuntimeConfig();
  const adminEndpoint = config.shopwareAdminEndpoint;
  try {
    const token = await getAdminToken();
    const res = await $fetch(`${adminEndpoint}search/mtsport-badge`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      body: {
        filter: [{ type: "equals", field: "active", value: true }],
        sort: [{ field: "sort", order: "ASC" }],
        limit: 200,
        associations: { products: { includes: { product: ["id"] } } },
        includes: {
          mtsport_badge: [
            "id",
            "name",
            "text",
            "bgColor",
            "textColor",
            "position",
            "pdpPosition",
            "size",
            "active",
            "sort",
            "applyProductIds",
            "applyCategoryIds",
            "applyTagIds",
            "applyManufacturerIds",
            "applyProductStreamIds",
            "applyIsNewDays",
            "applyHasDiscount",
            "applyMinPrice",
            "applyMaxPrice",
            "applyMinStock",
            "applyMaxStock",
            "applyMinRating",
            "applyDateFrom",
            "applyDateTo",
            "products"
          ],
          product: ["id"]
        }
      }
    });
    const elements = await Promise.all(
      ((_a = res == null ? void 0 : res.data) != null ? _a : []).map(async (b) => {
        var _a2, _b2, _c2, _d2, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G;
        const streamIds = parseJsonField((_a2 = b.applyProductStreamIds) != null ? _a2 : b.apply_product_stream_ids);
        const resolvedStreamProductIds = streamIds.length ? await resolveStreamsToProductIds(streamIds, adminEndpoint, token) : [];
        const assignedProductIds = Array.isArray(b.products) ? b.products.map((p) => String(p.id)).filter(Boolean) : [];
        return {
          id: b.id,
          name: (_b2 = b.name) != null ? _b2 : "",
          text: (_c2 = b.text) != null ? _c2 : "",
          bgColor: (_e2 = (_d2 = b.bgColor) != null ? _d2 : b.bg_color) != null ? _e2 : "#22c55e",
          textColor: (_g = (_f = b.textColor) != null ? _f : b.text_color) != null ? _g : "#ffffff",
          position: (_h = b.position) != null ? _h : "both",
          pdpPosition: (_j = (_i = b.pdpPosition) != null ? _i : b.pdp_position) != null ? _j : "top",
          size: (_k = b.size) != null ? _k : "md",
          active: b.active !== false,
          sort: (_l = b.sort) != null ? _l : 0,
          applyProductIds: parseJsonField((_m = b.applyProductIds) != null ? _m : b.apply_product_ids),
          applyCategoryIds: parseJsonField((_n = b.applyCategoryIds) != null ? _n : b.apply_category_ids),
          applyTagIds: parseJsonField((_o = b.applyTagIds) != null ? _o : b.apply_tag_ids),
          applyManufacturerIds: parseJsonField((_p = b.applyManufacturerIds) != null ? _p : b.apply_manufacturer_ids),
          applyProductStreamIds: streamIds,
          applyResolvedStreamProductIds: resolvedStreamProductIds,
          applyIsNewDays: (_r = (_q = b.applyIsNewDays) != null ? _q : b.apply_is_new_days) != null ? _r : null,
          applyHasDiscount: !!((_s = b.applyHasDiscount) != null ? _s : b.apply_has_discount),
          // Advanced gating filters
          applyMinPrice: (_u = (_t = b.applyMinPrice) != null ? _t : b.apply_min_price) != null ? _u : null,
          applyMaxPrice: (_w = (_v = b.applyMaxPrice) != null ? _v : b.apply_max_price) != null ? _w : null,
          applyMinStock: (_y = (_x = b.applyMinStock) != null ? _x : b.apply_min_stock) != null ? _y : null,
          applyMaxStock: (_A = (_z = b.applyMaxStock) != null ? _z : b.apply_max_stock) != null ? _A : null,
          applyMinRating: (_C = (_B = b.applyMinRating) != null ? _B : b.apply_min_rating) != null ? _C : null,
          applyDateFrom: (_E = (_D = b.applyDateFrom) != null ? _D : b.apply_date_from) != null ? _E : null,
          applyDateTo: (_G = (_F = b.applyDateTo) != null ? _F : b.apply_date_to) != null ? _G : null,
          assignedProductIds
        };
      })
    );
    await storage.setItem(
      CACHE_KEY,
      { payload: elements, expiresAt: Date.now() + CACHE_TTL * 1e3 },
      { ttl: CACHE_TTL }
    );
    return elements;
  } catch (e) {
    const status = (_d = (_c = (_b = e == null ? void 0 : e.response) == null ? void 0 : _b.status) != null ? _c : e == null ? void 0 : e.statusCode) != null ? _d : e == null ? void 0 : e.status;
    console.error(`[badges] Admin API failed${status ? ` (${status})` : ""}:`, (_e = e == null ? void 0 : e.message) != null ? _e : e);
    await storage.setItem(
      CACHE_KEY,
      { payload: [], expiresAt: Date.now() + NEGATIVE_CACHE_TTL * 1e3 },
      { ttl: NEGATIVE_CACHE_TTL }
    ).catch(() => null);
    return [];
  }
});

export { index_get as default };
