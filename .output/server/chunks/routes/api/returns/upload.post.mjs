import { d as defineEventHandler, c as createError, D as readMultipartFormData, a as getAdminToken, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import { randomUUID } from 'node:crypto';
import 'nodemailer';
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

const MAX_FILES = 5;
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME = /* @__PURE__ */ new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "video/mp4",
  "video/quicktime"
]);
const MIME_TO_EXT = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "application/pdf": "pdf",
  "video/mp4": "mp4",
  "video/quicktime": "mov"
};
function safeName(name) {
  return (name).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9._-]/g, "-").replace(/^[-_.]+|[-_.]+$/g, "").replace(/\.[^.]+$/, "").substring(0, 64) || "file";
}
const upload_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const config = useRuntimeConfig();
  const adminEndpoint = config.shopwareAdminEndpoint;
  if (!adminEndpoint) {
    throw createError({ statusCode: 503, statusMessage: "Shopware Admin API not configured" });
  }
  const parts = await readMultipartFormData(event);
  if (!(parts == null ? void 0 : parts.length)) {
    throw createError({ statusCode: 400, statusMessage: "No files uploaded" });
  }
  const files = parts.filter((p) => p.filename && p.data && (p.name === "file" || p.name === "file[]" || p.name === "files"));
  if (!files.length) {
    throw createError({ statusCode: 400, statusMessage: "No valid file part" });
  }
  if (files.length > MAX_FILES) {
    throw createError({ statusCode: 400, statusMessage: `Max ${MAX_FILES} files allowed` });
  }
  const token = await getAdminToken();
  const uploaded = [];
  for (const f of files) {
    const mime = f.type || "application/octet-stream";
    if (!ALLOWED_MIME.has(mime)) {
      throw createError({ statusCode: 400, statusMessage: `Disallowed type: ${mime}` });
    }
    if (f.data.length > MAX_BYTES) {
      throw createError({ statusCode: 400, statusMessage: `File too large (>10 MB): ${f.filename}` });
    }
    const ext = MIME_TO_EXT[mime] || "bin";
    const baseName = safeName(f.filename || "upload");
    const fullName = `${baseName}-${Date.now()}`;
    const mediaId = randomUUID().replace(/-/g, "");
    try {
      await $fetch(`${adminEndpoint}media`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: { id: mediaId }
      });
      const uploadUrl = `${adminEndpoint}_action/media/${mediaId}/upload?extension=${ext}&fileName=${encodeURIComponent(fullName)}`;
      await $fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": mime,
          Accept: "application/json"
        },
        body: f.data
      });
      let url = null;
      try {
        const detail = await $fetch(`${adminEndpoint}media/${mediaId}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
        });
        url = ((_b = (_a = detail == null ? void 0 : detail.data) == null ? void 0 : _a.attributes) == null ? void 0 : _b.url) || ((_c = detail == null ? void 0 : detail.data) == null ? void 0 : _c.url) || null;
      } catch {
      }
      uploaded.push({ id: mediaId, fileName: f.filename || fullName, url, mime });
    } catch (e) {
      const status = ((_d = e == null ? void 0 : e.response) == null ? void 0 : _d.status) || (e == null ? void 0 : e.statusCode);
      const data = (_f = e == null ? void 0 : e.data) != null ? _f : (_e = e == null ? void 0 : e.response) == null ? void 0 : _e._data;
      const apiMsg = ((_h = (_g = data == null ? void 0 : data.errors) == null ? void 0 : _g[0]) == null ? void 0 : _h.detail) || ((_j = (_i = data == null ? void 0 : data.errors) == null ? void 0 : _i[0]) == null ? void 0 : _j.title) || JSON.stringify(data || {});
      console.error("[returns/upload] Failed for", f.filename, "status=", status, "detail=", apiMsg);
      try {
        await $fetch(`${adminEndpoint}media/${mediaId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch {
      }
      throw createError({
        statusCode: 502,
        statusMessage: `Upload failed for ${f.filename}: ${apiMsg || (e == null ? void 0 : e.message) || "unknown"}`
      });
    }
  }
  return { uploaded };
});

export { upload_post as default };
