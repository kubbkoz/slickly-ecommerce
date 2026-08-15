import { d as defineEventHandler, b as useStorage, g as getQuery, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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
function extractExcerpt(html, maxSentences) {
  if (!html) return "";
  const text = html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim();
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  if (!sentences) return text.slice(0, 200);
  return sentences.slice(0, maxSentences).join(" ").trim();
}
const listing_get = defineEventHandler(async (event) => {
  var _a, _b;
  const config = useRuntimeConfig();
  const storage = useStorage("redis");
  const query = getQuery(event);
  const category = query.category || "";
  const author = query.author || "";
  const cacheKey = `blog:listing:${category || "all"}:${author || "all"}`;
  const cached = await storage.getItem(cacheKey).catch(() => null);
  if (cached) return cached;
  const endpoint = config.public.shopware.endpoint;
  const accessToken = config.public.shopware.accessToken;
  try {
    const limitParam = parseInt(query.limit) || 50;
    const filter = [
      { type: "equals", field: "active", value: true },
      { type: "equals", field: "type", value: "blog" },
      { type: "range", field: "publishedAt", parameters: { lte: (/* @__PURE__ */ new Date()).toISOString() } }
    ];
    if (category) filter.push({ type: "equals", field: "category", value: category });
    if (author) filter.push({ type: "equals", field: "author", value: author });
    const res = await $fetch(`${endpoint}mtsport-article`, {
      method: "POST",
      headers: {
        "sw-access-key": accessToken,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: {
        filter,
        sort: [
          { field: "featured", order: "DESC" },
          { field: "publishedAt", order: "DESC" }
        ],
        limit: limitParam,
        associations: {
          cover: {},
          cmsPage: { associations: { sections: { associations: { blocks: { associations: { slots: {} } } } } } }
        },
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
            "translated",
            "cover",
            "cmsPage",
            "featured",
            "featuredBadgeText",
            "cmsPageId"
          ],
          media: ["url", "thumbnails"],
          cms_page: ["sections"],
          cms_section: ["blocks"],
          cms_block: ["slots"],
          cms_slot: ["type", "data", "config"]
        }
      }
    });
    const items = (res == null ? void 0 : res.elements) || [];
    const posts = items.map((i) => {
      var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k;
      let rawText = ((_a2 = i.translated) == null ? void 0 : _a2.content) || i.content || "";
      const needsCmsExtract = !rawText || rawText.length < 50;
      if (needsCmsExtract && ((_b2 = i.cmsPage) == null ? void 0 : _b2.sections)) {
        const texts = [];
        for (const s of i.cmsPage.sections) {
          for (const b of s.blocks || []) {
            for (const sl of b.slots || []) {
              const val = ((_c = sl.data) == null ? void 0 : _c.content) || ((_e = (_d = sl.config) == null ? void 0 : _d.content) == null ? void 0 : _e.value) || "";
              if (val && typeof val === "string") texts.push(val);
            }
          }
        }
        rawText = texts.join(" ");
      }
      const teaser = ((_f = i.translated) == null ? void 0 : _f.teaser) || i.teaser || "";
      const excerpt3 = extractExcerpt(rawText, 3);
      const excerpt2 = extractExcerpt(rawText, 2);
      return {
        id: i.id,
        title: ((_g = i.translated) == null ? void 0 : _g.title) || i.title,
        slug: i.slug,
        teaser: teaser || excerpt3,
        excerpt: excerpt2,
        publishedAt: i.publishedAt || "",
        author: i.author || "SLICKLY",
        category: i.category || "",
        coverUrl: (_i = (_h = i.cover) == null ? void 0 : _h.url) != null ? _i : null,
        featured: (_j = i.featured) != null ? _j : false,
        featuredBadgeText: (_k = i.featuredBadgeText) != null ? _k : null,
        type: "blog"
      };
    });
    await storage.setItem(cacheKey, posts, { ttl: CACHE_TTL }).catch(() => null);
    return posts;
  } catch (e) {
    console.error("[Blog] Listing fetch failed:", (_b = (_a = e == null ? void 0 : e.data) != null ? _a : e == null ? void 0 : e.message) != null ? _b : e);
    return [];
  }
});

export { listing_get as default };
