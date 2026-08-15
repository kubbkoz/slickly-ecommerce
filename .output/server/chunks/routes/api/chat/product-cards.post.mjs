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

const productCards_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const storeApiUrl = config.public.shopware.endpoint;
  const accessToken = config.public.shopware.accessToken;
  const body = await readBody(event);
  const { ids } = body;
  if (!(ids == null ? void 0 : ids.length) || ids.length > 10) {
    throw createError({ statusCode: 400, statusMessage: "ids required (max 10)" });
  }
  const res = await $fetch(`${storeApiUrl}product`, {
    method: "POST",
    headers: { "sw-access-key": accessToken, "Content-Type": "application/json", Accept: "application/json" },
    body: {
      filter: [{ type: "equalsAny", field: "id", value: ids }],
      limit: ids.length,
      includes: {
        product: ["id", "name", "translated", "calculatedPrice", "cover", "seoUrls", "manufacturer"],
        product_media: ["media"],
        media: ["url", "thumbnails"],
        media_thumbnail: ["url", "width"],
        calculated_price: ["unitPrice", "listPrice"],
        seo_url: ["seoPathInfo", "isCanonical"],
        product_manufacturer: ["name", "translated"]
      },
      associations: {
        cover: { associations: { media: { associations: { thumbnails: {} } } } },
        seoUrls: {},
        manufacturer: {}
      }
    }
  }).catch(() => null);
  const elements = (res == null ? void 0 : res.elements) || [];
  return elements.map((p) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
    const imgUrl = ((_d = (_c = (_b = (_a = p.cover) == null ? void 0 : _a.media) == null ? void 0 : _b.thumbnails) == null ? void 0 : _c.find((t) => t.width >= 400)) == null ? void 0 : _d.url) || ((_f = (_e = p.cover) == null ? void 0 : _e.media) == null ? void 0 : _f.url) || null;
    const seoPath = (_h = (_g = p.seoUrls) == null ? void 0 : _g.find((s) => s.isCanonical)) == null ? void 0 : _h.seoPathInfo;
    return {
      id: p.id,
      name: ((_i = p.translated) == null ? void 0 : _i.name) || p.name,
      price: (_k = (_j = p.calculatedPrice) == null ? void 0 : _j.unitPrice) != null ? _k : 0,
      listPrice: (_n = (_m = (_l = p.calculatedPrice) == null ? void 0 : _l.listPrice) == null ? void 0 : _m.price) != null ? _n : null,
      imageUrl: imgUrl,
      seoPath: seoPath ? `/${seoPath}` : null,
      brand: ((_p = (_o = p.manufacturer) == null ? void 0 : _o.translated) == null ? void 0 : _p.name) || ((_q = p.manufacturer) == null ? void 0 : _q.name) || null
    };
  });
});

export { productCards_post as default };
