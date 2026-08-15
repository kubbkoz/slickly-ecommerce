import { d as defineEventHandler, r as readBody, c as createError, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const advisorProducts_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const storeApiUrl = config.public.shopware.endpoint;
  const accessToken = config.public.shopware.accessToken;
  const body = await readBody(event);
  const { queries } = body;
  if (!(queries == null ? void 0 : queries.length) || queries.length > 8) {
    throw createError({ statusCode: 400, statusMessage: "queries required (max 8)" });
  }
  const INCLUDES = {
    product: [
      "id",
      "name",
      "translated",
      "cover",
      "calculatedPrice",
      "seoUrls",
      "available",
      "availableStock",
      "parentId",
      "childCount",
      "options"
    ],
    product_media: ["media"],
    media: ["url", "thumbnails"],
    media_thumbnail: ["url", "width"],
    calculated_price: ["unitPrice", "totalPrice", "listPrice"],
    seo_url: ["seoPathInfo", "isCanonical"],
    product_option: ["id", "name", "group"],
    property_group_option: ["id", "name", "groupId"],
    property_group: ["id", "name"]
  };
  const GENERIC_PREFIXES = /* @__PURE__ */ new Set(["sada", "set", "komplet"]);
  const normalizeLabel = (label) => {
    const words = label.toLowerCase().trim().split(/\s+/);
    if (GENERIC_PREFIXES.has(words[0]) && words.length > 1) return `${words[0]} ${words[1]}`;
    return words[0];
  };
  const seenLabels = /* @__PURE__ */ new Set();
  const uniqueQueries = queries.slice(0, 5).filter((q) => {
    const norm = normalizeLabel(q.label);
    if (seenLabels.has(norm)) return false;
    seenLabels.add(norm);
    return true;
  });
  const seenIds = /* @__PURE__ */ new Set();
  const results = await Promise.all(
    uniqueQueries.map(async ({ searchQuery, label }) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
      try {
        const excludedCategory = config.public.shopware.ids.categories.komponenty;
        const res = await $fetch(`${storeApiUrl}search`, {
          method: "POST",
          headers: {
            "sw-access-key": accessToken,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: {
            search: searchQuery,
            limit: 5,
            // Fetchneme viac pre lepšiu variabilitu po filtrovaní
            filter: [
              { type: "equals", field: "active", value: true },
              {
                type: "not",
                queries: [
                  { type: "equals", field: "categoryIds", value: excludedCategory }
                ]
              }
            ],
            includes: INCLUDES,
            associations: {
              cover: { associations: { media: { associations: { thumbnails: {} } } } },
              seoUrls: {},
              options: { associations: { group: {} } },
              children: {
                limit: 30,
                includes: {
                  product: ["id", "name", "translated", "options", "calculatedPrice", "available", "availableStock"]
                },
                associations: { options: { associations: { group: {} } } }
              }
            }
          }
        });
        const elements = (res == null ? void 0 : res.elements) || ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.elements) || [];
        if (!elements.length) return null;
        const blacklist = ["mont\xE1\u017Eny", "montazny", "kovanie"];
        const filteredElements = elements.filter((p) => {
          var _a2;
          const name = (((_a2 = p.translated) == null ? void 0 : _a2.name) || p.name || "").toLowerCase();
          const categoryIds = p.categoryIds || [];
          return !blacklist.some((term) => name.includes(term)) && !categoryIds.includes(excludedCategory);
        });
        if (!filteredElements.length) return null;
        const candidates = filteredElements.slice(0, 3);
        let product = candidates.find((p) => !seenIds.has(p.parentId || p.id)) || candidates[0];
        const rootId = product.parentId || product.id;
        if (seenIds.has(rootId)) return null;
        seenIds.add(rootId);
        const imgUrl = ((_e = (_d = (_c = (_b = product.cover) == null ? void 0 : _b.media) == null ? void 0 : _c.thumbnails) == null ? void 0 : _d.find((t) => t.width >= 400)) == null ? void 0 : _e.url) || ((_g = (_f = product.cover) == null ? void 0 : _f.media) == null ? void 0 : _g.url) || null;
        const seoPath = (_i = (_h = product.seoUrls) == null ? void 0 : _h.find((s) => s.isCanonical)) == null ? void 0 : _i.seoPathInfo;
        const hasVariants = ((_j = product.childCount) != null ? _j : 0) > 0;
        const variants = [];
        if (hasVariants && ((_k = product.children) == null ? void 0 : _k.length)) {
          product.children.filter((c) => {
            var _a2;
            return c.available !== false && ((_a2 = c.availableStock) != null ? _a2 : 1) > 0;
          }).slice(0, 20).forEach((child) => {
            const opts = (child.options || []).map((o) => {
              var _a2, _b2, _c2, _d2;
              return {
                groupName: ((_b2 = (_a2 = o.group) == null ? void 0 : _a2.translated) == null ? void 0 : _b2.name) || ((_c2 = o.group) == null ? void 0 : _c2.name) || "",
                name: ((_d2 = o.translated) == null ? void 0 : _d2.name) || o.name || ""
              };
            });
            if (opts.length) {
              variants.push({ id: child.id, options: opts });
            }
          });
        }
        return {
          id: product.id,
          name: ((_l = product.translated) == null ? void 0 : _l.name) || product.name,
          label,
          price: (_n = (_m = product.calculatedPrice) == null ? void 0 : _m.unitPrice) != null ? _n : 0,
          listPrice: (_q = (_p = (_o = product.calculatedPrice) == null ? void 0 : _o.listPrice) == null ? void 0 : _p.price) != null ? _q : null,
          imageUrl: imgUrl,
          seoPath: seoPath ? `/${seoPath}` : null,
          available: (_r = product.available) != null ? _r : true,
          hasVariants,
          variants
        };
      } catch {
        return null;
      }
    })
  );
  const seenProductTypes = /* @__PURE__ */ new Set();
  const normalizeProductType = (name) => {
    const words = name.toLowerCase().trim().split(/\s+/);
    const GENERIC = /* @__PURE__ */ new Set(["sada", "set", "komplet"]);
    if (GENERIC.has(words[0]) && words.length > 1) return `${words[0]} ${words[1]}`;
    return words[0];
  };
  return results.filter(Boolean).filter((p) => {
    const type = normalizeProductType(p.name);
    if (seenProductTypes.has(type)) return false;
    seenProductTypes.add(type);
    return true;
  });
});

export { advisorProducts_post as default };
