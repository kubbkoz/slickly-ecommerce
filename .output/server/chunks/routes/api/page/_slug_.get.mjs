import { d as defineEventHandler, b as useStorage, h as getRouterParam, c as createError, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const CACHE_TTL = 60 * 60;
const _slug__get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e;
  const config = useRuntimeConfig();
  const storage = useStorage("redis");
  const slug = getRouterParam(event, "slug");
  const cacheKey = `page:${slug}`;
  const cached = await storage.getItem(cacheKey).catch(() => null);
  if (cached) return cached;
  const endpoint = config.public.shopware.endpoint;
  const accessToken = config.public.shopware.accessToken;
  const headers = { "sw-access-key": accessToken, Accept: "application/json", "Content-Type": "application/json" };
  try {
    const res = await $fetch(`${endpoint}mtsport-article`, {
      method: "POST",
      headers,
      body: {
        filter: [
          { type: "equals", field: "active", value: true },
          { type: "equals", field: "slug", value: slug }
        ],
        limit: 1,
        associations: { cover: {} },
        includes: {
          mtsport_article: ["id", "title", "slug", "teaser", "content", "metaTitle", "metaDescription", "translated", "cover", "cmsPageId", "type"],
          media: ["url", "thumbnails"]
        }
      }
    });
    const item = ((res == null ? void 0 : res.elements) || [])[0];
    if (!item) return null;
    if (item.type === "blog") return null;
    let cmsPage = null;
    if (item.cmsPageId) {
      try {
        cmsPage = await $fetch(`${endpoint}cms/${item.cmsPageId}`, {
          method: "POST",
          headers,
          body: {
            includes: {
              cms_page: ["id", "name", "type", "sections"],
              cms_section: ["id", "type", "position", "sizingMode", "mobileBehavior", "backgroundColor", "backgroundMediaMode", "cssClass", "blocks"],
              cms_block: ["id", "type", "position", "cssClass", "marginTop", "marginBottom", "marginLeft", "marginRight", "backgroundColor", "backgroundMediaMode", "slots"],
              cms_slot: ["id", "type", "slot", "data", "config", "fieldConfig"],
              media: ["url", "thumbnails", "alt", "title"],
              media_thumbnail: ["url", "width", "height"]
            }
          }
        });
      } catch {
      }
    }
    const t = item.translated || {};
    const page = {
      id: item.id,
      title: t.title || item.title,
      slug: item.slug,
      teaser: t.teaser || item.teaser || "",
      content: t.content || item.content || "",
      metaTitle: t.metaTitle || item.metaTitle || (t.title || item.title),
      metaDescription: t.metaDescription || item.metaDescription || "",
      coverUrl: (_b = (_a = item.cover) == null ? void 0 : _a.url) != null ? _b : null,
      heroCoverUrl: (_d = (_c = item.heroCover) == null ? void 0 : _c.url) != null ? _d : null,
      type: "page",
      cmsPage: cmsPage != null ? cmsPage : null
    };
    await storage.setItem(cacheKey, page, { ttl: CACHE_TTL }).catch(() => null);
    return page;
  } catch (e) {
    if ((e == null ? void 0 : e.statusCode) === 404) throw e;
    console.error("[Page] Fetch failed:", (_e = e == null ? void 0 : e.message) != null ? _e : e);
    throw createError({ statusCode: 502, message: "Str\xE1nka do\u010Dasne nedostupn\xE1" });
  }
});

export { _slug__get as default };
