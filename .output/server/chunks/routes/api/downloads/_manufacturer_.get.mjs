import { d as defineEventHandler, h as getRouterParam, g as getQuery, b as useStorage, i as defineCachedFunction, u as useRuntimeConfig, a as getAdminToken } from '../../../nitro/nitro.mjs';
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

const CACHE_TTL = 60 * 60 * 24;
const fetchDownloads = defineCachedFunction(
  async (folderName) => {
    const config = useRuntimeConfig();
    const endpoint = config.shopwareAdminEndpoint;
    const token = await getAdminToken();
    const headers = { Authorization: `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json" };
    const parentRes = await $fetch(`${endpoint}search/media-folder`, {
      method: "POST",
      headers,
      body: {
        filter: [{ type: "equals", field: "name", value: "Manualy" }],
        includes: { media_folder: ["id", "name"] },
        limit: 1
      }
    });
    const parentFolder = ((parentRes == null ? void 0 : parentRes.data) || [])[0];
    if (!parentFolder) return [];
    const subRes = await $fetch(`${endpoint}search/media-folder`, {
      method: "POST",
      headers,
      body: {
        filter: [
          { type: "equals", field: "parentId", value: parentFolder.id },
          { type: "contains", field: "name", value: folderName }
        ],
        includes: { media_folder: ["id", "name"] },
        limit: 5
      }
    });
    const subFolders = (subRes == null ? void 0 : subRes.data) || [];
    const folder = subFolders.find((f) => {
      var _a;
      return (((_a = f.attributes) == null ? void 0 : _a.name) || f.name || "").toLowerCase() === folderName;
    }) || subFolders[0];
    if (!folder) return [];
    const folderId = folder.id;
    const mediaRes = await $fetch(`${endpoint}search/media`, {
      method: "POST",
      headers,
      body: {
        filter: [{ type: "equals", field: "mediaFolderId", value: folderId }],
        includes: { media: ["id", "fileName", "title", "url", "mimeType", "fileSize", "translated"] },
        sort: [{ field: "fileName", order: "ASC" }],
        limit: 50
      }
    });
    const items = (mediaRes == null ? void 0 : mediaRes.data) || [];
    return items.map((m) => {
      var _a;
      const a = m.attributes || m;
      return {
        id: m.id || a.id,
        fileName: a.fileName || "",
        title: ((_a = a.translated) == null ? void 0 : _a.title) || a.title || a.fileName || "",
        url: a.url || "",
        mimeType: a.mimeType || "",
        fileSize: a.fileSize || 0
      };
    }).filter((f) => f.url);
  },
  {
    name: "downloads-by-manufacturer",
    getKey: (folderName) => folderName,
    maxAge: CACHE_TTL
  }
);
const _manufacturer__get = defineEventHandler(async (event) => {
  const manufacturer = getRouterParam(event, "manufacturer");
  if (!manufacturer) return [];
  const folderName = decodeURIComponent(manufacturer).toLowerCase();
  const query = getQuery(event);
  if (query.clear === "1") {
    const storage = useStorage();
    await storage.removeItem(`/cache:nitro/functions:downloads-by-manufacturer:${folderName}.json`).catch(() => null);
    return { cleared: folderName };
  }
  try {
    return await fetchDownloads(folderName);
  } catch (e) {
    return [];
  }
});

export { _manufacturer__get as default };
