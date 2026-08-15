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

const CACHE_TTL = 60 * 30;
const _slug__get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const config = useRuntimeConfig();
  const storage = useStorage("redis");
  const slug = getRouterParam(event, "slug");
  const cacheKey = `blog:post:${slug}`;
  const cached = await storage.getItem(cacheKey).catch(() => null);
  if (cached) return cached;
  const endpoint = config.public.shopware.endpoint;
  const accessToken = config.public.shopware.accessToken;
  const headers = {
    "sw-access-key": accessToken,
    Accept: "application/json",
    "Content-Type": "application/json"
  };
  try {
    const res = await $fetch(`${endpoint}mtsport-article`, {
      method: "POST",
      headers,
      body: {
        filter: [
          { type: "equals", field: "active", value: true },
          { type: "equals", field: "type", value: "blog" },
          { type: "equals", field: "slug", value: slug },
          { type: "range", field: "publishedAt", parameters: { lte: (/* @__PURE__ */ new Date()).toISOString() } }
        ],
        limit: 1,
        associations: { cover: {}, heroCover: {} },
        includes: {
          mtsport_article: [
            "id",
            "title",
            "slug",
            "teaser",
            "content",
            "publishedAt",
            "author",
            "category",
            "metaTitle",
            "metaDescription",
            "translated",
            "cover",
            "heroCover",
            "cmsPageId",
            "featured",
            "featuredBadgeText"
          ],
          media: ["url", "thumbnails"]
        }
      }
    });
    const item = ((res == null ? void 0 : res.elements) || [])[0];
    if (!item) {
      throw createError({ statusCode: 404, message: "\u010Cl\xE1nok nebol n\xE1jden\xFD" });
    }
    let cmsPage = null;
    const cmsPageId = (_a = item.cmsPageId) != null ? _a : null;
    if (cmsPageId) {
      try {
        cmsPage = await $fetch(`${endpoint}cms/${cmsPageId}`, {
          method: "POST",
          headers,
          body: {
            includes: {
              cms_page: ["id", "name", "type", "sections"],
              cms_section: [
                "id",
                "type",
                "position",
                "sizingMode",
                "mobileBehavior",
                "backgroundColor",
                "backgroundMediaMode",
                "cssClass",
                "blocks"
              ],
              cms_block: [
                "id",
                "type",
                "position",
                "sectionPosition",
                "cssClass",
                "marginTop",
                "marginBottom",
                "marginLeft",
                "marginRight",
                "backgroundColor",
                "backgroundMediaMode",
                "slots"
              ],
              cms_slot: ["id", "type", "slot", "data", "config", "fieldConfig", "translated"],
              media: ["url", "thumbnails", "alt", "title"],
              media_thumbnail: ["url", "width", "height"]
            }
          }
        });
      } catch (cmsErr) {
        console.warn(`[Blog] CMS page fetch failed for ${cmsPageId}:`, (_b = cmsErr == null ? void 0 : cmsErr.message) != null ? _b : cmsErr);
      }
    }
    const t = item.translated || {};
    const teaser = t.teaser || item.teaser || "";
    const post = {
      id: item.id,
      title: t.title || item.title,
      slug: item.slug,
      teaser,
      content: t.content || item.content || "",
      publishedAt: item.publishedAt || "",
      author: item.author || "SLICKLY",
      category: item.category || "",
      coverUrl: (_d = (_c = item.cover) == null ? void 0 : _c.url) != null ? _d : null,
      heroCoverUrl: (_f = (_e = item.heroCover) == null ? void 0 : _e.url) != null ? _f : null,
      metaTitle: t.metaTitle || item.metaTitle || (t.title || item.title),
      metaDescription: t.metaDescription || item.metaDescription || teaser,
      featured: (_g = item.featured) != null ? _g : false,
      featuredBadgeText: (_h = item.featuredBadgeText) != null ? _h : null,
      type: "blog",
      cmsPage: cmsPage != null ? cmsPage : null
    };
    await storage.setItem(cacheKey, post, { ttl: CACHE_TTL }).catch(() => null);
    return post;
  } catch (e) {
    if ((e == null ? void 0 : e.statusCode) === 404) throw e;
    console.error("[Blog] Detail fetch failed:", (_j = (_i = e == null ? void 0 : e.data) != null ? _i : e == null ? void 0 : e.message) != null ? _j : e);
    throw createError({ statusCode: 502, message: "Blog do\u010Dasne nedostupn\xFD" });
  }
});

export { _slug__get as default };
