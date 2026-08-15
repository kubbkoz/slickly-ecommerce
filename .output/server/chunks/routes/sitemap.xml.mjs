import { d as defineEventHandler, S as setHeader, u as useRuntimeConfig } from '../nitro/nitro.mjs';
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

async function fetchSeoUrlPage(apiBase, accessToken, salesChannelId, page, limit = 500) {
  var _a, _b;
  const res = await $fetch(`${apiBase}seo-url`, {
    method: "POST",
    headers: {
      "sw-access-key": accessToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      filter: [
        { type: "equals", field: "isDeleted", value: false },
        { type: "equals", field: "isCanonical", value: true },
        { type: "equals", field: "salesChannelId", value: salesChannelId }
      ],
      includes: { seo_url: ["seoPathInfo", "routeName", "isCanonical", "isDeleted", "updatedAt"] },
      limit,
      page
    })
  });
  return { elements: (_a = res == null ? void 0 : res.elements) != null ? _a : [], total: (_b = res == null ? void 0 : res.total) != null ? _b : 0 };
}
function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
const sitemap_xml = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const config = useRuntimeConfig();
  const apiBase = ((_b = (_a = config.public) == null ? void 0 : _a.shopware) == null ? void 0 : _b.endpoint) || "https://mtsport.store/store-api/";
  const accessToken = ((_d = (_c = config.public) == null ? void 0 : _c.shopware) == null ? void 0 : _d.accessToken) || "";
  const salesChannelId = ((_g = (_f = (_e = config.public) == null ? void 0 : _e.shopware) == null ? void 0 : _f.ids) == null ? void 0 : _g.salesChannel) || "";
  const baseUrl = ((_h = config.public) == null ? void 0 : _h.siteUrl) || "https://mtsport.store";
  const staticUrls = [
    { loc: baseUrl, changefreq: "daily", priority: "1.0" },
    { loc: `${baseUrl}/search`, changefreq: "weekly", priority: "0.5" }
  ];
  const allSeoUrls = [];
  try {
    const firstPage = await fetchSeoUrlPage(apiBase, accessToken, salesChannelId, 1);
    allSeoUrls.push(...firstPage.elements);
    const totalPages = Math.ceil(firstPage.total / 500);
    if (totalPages > 1) {
      const remaining = await Promise.all(
        Array.from(
          { length: totalPages - 1 },
          (_, i) => fetchSeoUrlPage(apiBase, accessToken, salesChannelId, i + 2)
        )
      );
      remaining.forEach((r) => allSeoUrls.push(...r.elements));
    }
  } catch (err) {
    console.error("[sitemap.xml] Shopware SEO URL fetch failed:", err);
  }
  const allowedRoutes = /* @__PURE__ */ new Set([
    "frontend.detail.page",
    "frontend.navigation.page",
    "frontend.landing.page"
  ]);
  const seoEntries = allSeoUrls.filter(
    (u) => u.seoPathInfo && allowedRoutes.has(u.routeName)
  );
  const urlEntries = [
    ...staticUrls.map(
      (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    ),
    ...seoEntries.map((u) => {
      const loc = escapeXml(`${baseUrl}/${u.seoPathInfo}`);
      const isProduct = u.routeName === "frontend.detail.page";
      return `  <url>
    <loc>${loc}</loc>
    <changefreq>${isProduct ? "weekly" : "daily"}</changefreq>
    <priority>${isProduct ? "0.8" : "0.9"}</priority>
    ${u.updatedAt ? `<lastmod>${u.updatedAt.split("T")[0]}</lastmod>` : ""}
  </url>`;
    })
  ];
  setHeader(event, "Content-Type", "application/xml; charset=utf-8");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries.join("\n")}
</urlset>`;
});

export { sitemap_xml as default };
