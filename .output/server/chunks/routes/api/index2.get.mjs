import { d as defineEventHandler, i as defineCachedFunction, u as useRuntimeConfig, a as getAdminToken } from '../../nitro/nitro.mjs';
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

const CACHE_TTL = 600;
function slugify(text) {
  return text.toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").trim();
}
async function fetchProductCounts(adminEndpoint, token) {
  var _a, _b, _c, _d, _e;
  try {
    const res = await $fetch(`${adminEndpoint}search/product`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      body: {
        limit: 1,
        filter: [{ type: "equals", field: "parentId", value: null }],
        aggregations: [
          { name: "mans", type: "terms", field: "manufacturerId", limit: 1e3 }
        ]
      }
    });
    const buckets = (_c = (_b = (_a = res == null ? void 0 : res.aggregations) == null ? void 0 : _a.mans) == null ? void 0 : _b.buckets) != null ? _c : [];
    const map = {};
    for (const b of buckets) {
      if (b == null ? void 0 : b.key) map[b.key] = (_d = b.count) != null ? _d : 0;
    }
    return map;
  } catch (e) {
    console.warn("[manufacturers] product count aggregation failed:", (_e = e == null ? void 0 : e.message) != null ? _e : e);
    return {};
  }
}
const fetchManufacturers = defineCachedFunction(
  async () => {
    var _a, _b, _c, _d, _e;
    const config = useRuntimeConfig();
    const adminEndpoint = config.shopwareAdminEndpoint;
    try {
      const token = await getAdminToken();
      const res = await $fetch(`${adminEndpoint}search/product-manufacturer`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        body: {
          limit: 500,
          sort: [{ field: "name", order: "ASC" }],
          associations: { media: {} },
          includes: {
            product_manufacturer: ["id", "name", "translated", "link", "media"],
            media: ["url"]
          }
        }
      });
      const counts = await fetchProductCounts(adminEndpoint, token);
      const seenSlugs = /* @__PURE__ */ new Set();
      const items = ((_a = res == null ? void 0 : res.data) != null ? _a : []).map((m) => {
        var _a2, _b2, _c2, _d2, _e2;
        const name = ((_a2 = m.translated) == null ? void 0 : _a2.name) || m.name || "";
        let slug = slugify(name) || m.id;
        if (seenSlugs.has(slug)) {
          let i = 2;
          while (seenSlugs.has(`${slug}-${i}`)) i++;
          slug = `${slug}-${i}`;
        }
        seenSlugs.add(slug);
        return {
          id: m.id,
          name,
          slug,
          logoUrl: (_c2 = (_b2 = m.media) == null ? void 0 : _b2.url) != null ? _c2 : null,
          link: (_d2 = m.link) != null ? _d2 : null,
          productCount: (_e2 = counts[m.id]) != null ? _e2 : 0
        };
      });
      return items;
    } catch (e) {
      const status = (_d = (_c = (_b = e == null ? void 0 : e.response) == null ? void 0 : _b.status) != null ? _c : e == null ? void 0 : e.statusCode) != null ? _d : e == null ? void 0 : e.status;
      console.error(`[manufacturers] Admin API failed${status ? ` (${status})` : ""}:`, (_e = e == null ? void 0 : e.message) != null ? _e : e);
      return [];
    }
  },
  { name: "manufacturers-list", getKey: () => "all", maxAge: CACHE_TTL }
);
const index_get = defineEventHandler(async () => {
  return fetchManufacturers();
});

export { index_get as default };
