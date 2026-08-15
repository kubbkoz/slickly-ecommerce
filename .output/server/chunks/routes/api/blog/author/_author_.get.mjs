import { d as defineEventHandler, b as useStorage, h as getRouterParam, u as useRuntimeConfig } from '../../../../nitro/nitro.mjs';
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

const CACHE_TTL = 60 * 15;
const _author__get = defineEventHandler(async (event) => {
  var _a;
  const config = useRuntimeConfig();
  const storage = useStorage("redis");
  const author = getRouterParam(event, "author");
  const cacheKey = `blog:author:${author}`;
  const cached = await storage.getItem(cacheKey).catch(() => null);
  if (cached) return cached;
  const endpoint = config.public.shopware.endpoint;
  const accessToken = config.public.shopware.accessToken;
  try {
    const res = await $fetch(`${endpoint}mtsport-article`, {
      method: "POST",
      headers: { "sw-access-key": accessToken, Accept: "application/json", "Content-Type": "application/json" },
      body: {
        filter: [
          { type: "equals", field: "active", value: true },
          { type: "equals", field: "author", value: author },
          { type: "range", field: "publishedAt", parameters: { lte: (/* @__PURE__ */ new Date()).toISOString() } }
        ],
        sort: [{ field: "publishedAt", order: "DESC" }],
        limit: 100,
        associations: { cover: {} },
        includes: {
          mtsport_article: ["id", "title", "slug", "teaser", "publishedAt", "author", "category", "translated", "cover", "featured", "featuredBadgeText"],
          media: ["url", "thumbnails"]
        }
      }
    });
    const posts = ((res == null ? void 0 : res.elements) || []).map((i) => {
      var _a2, _b, _c, _d, _e, _f;
      return {
        id: i.id,
        title: ((_a2 = i.translated) == null ? void 0 : _a2.title) || i.title,
        slug: i.slug,
        teaser: ((_b = i.translated) == null ? void 0 : _b.teaser) || i.teaser || "",
        publishedAt: i.publishedAt || "",
        author: i.author || "",
        category: i.category || "",
        coverUrl: (_d = (_c = i.cover) == null ? void 0 : _c.url) != null ? _d : null,
        featured: (_e = i.featured) != null ? _e : false,
        featuredBadgeText: (_f = i.featuredBadgeText) != null ? _f : null,
        type: "blog"
      };
    });
    await storage.setItem(cacheKey, posts, { ttl: CACHE_TTL }).catch(() => null);
    return posts;
  } catch (e) {
    console.error("[Blog] Author fetch failed:", (_a = e == null ? void 0 : e.message) != null ? _a : e);
    return [];
  }
});

export { _author__get as default };
