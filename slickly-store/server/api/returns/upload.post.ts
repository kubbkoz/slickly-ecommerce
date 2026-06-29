import { defineEventHandler, readMultipartFormData, createError } from 'h3';
import { randomUUID } from 'node:crypto';
import { useRuntimeConfig } from '#imports';
import { getAdminToken } from '../../utils/shopwareAdmin';

/**
 * POST /api/returns/upload — multipart upload do Shopware Media.
 *
 * Flow:
 *   1. Klient pošle multipart s 1 alebo viacero súbormi (field "file" alebo "file[]")
 *   2. Validácia: max 5, 10 MB/súbor, MIME whitelist
 *   3. Pre každý súbor:
 *      a) POST /api/media — vytvor prázdny media záznam (vráti UUID)
 *      b) POST /api/_action/media/{id}/upload?extension=ext&fileName=safe-name — upload bytes
 *   4. Vráti { uploaded: [{ id, fileName, url }, ...] }
 *
 * Použitie z klienta:
 *   const fd = new FormData();
 *   files.forEach(f => fd.append('file', f));
 *   const r = await fetch('/api/returns/upload', { method:'POST', body: fd });
 */

const MAX_FILES = 5;
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME = new Set([
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf',
  'video/mp4', 'video/quicktime',
]);
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
};

function safeName(name: string): string {
  return (name || 'file')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/^[-_.]+|[-_.]+$/g, '')
    .replace(/\.[^.]+$/, '')        // strip extension
    .substring(0, 64) || 'file';
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const adminEndpoint = config.shopwareAdminEndpoint as string;
  if (!adminEndpoint) {
    throw createError({ statusCode: 503, statusMessage: 'Shopware Admin API not configured' });
  }

  const parts = await readMultipartFormData(event);
  if (!parts?.length) {
    throw createError({ statusCode: 400, statusMessage: 'No files uploaded' });
  }

  const files = parts.filter((p) => p.filename && p.data && (p.name === 'file' || p.name === 'file[]' || p.name === 'files'));
  if (!files.length) {
    throw createError({ statusCode: 400, statusMessage: 'No valid file part' });
  }
  if (files.length > MAX_FILES) {
    throw createError({ statusCode: 400, statusMessage: `Max ${MAX_FILES} files allowed` });
  }

  const token = await getAdminToken();
  const uploaded: { id: string; fileName: string; url: string | null; mime: string }[] = [];

  for (const f of files) {
    const mime = f.type || 'application/octet-stream';
    if (!ALLOWED_MIME.has(mime)) {
      throw createError({ statusCode: 400, statusMessage: `Disallowed type: ${mime}` });
    }
    if (f.data.length > MAX_BYTES) {
      throw createError({ statusCode: 400, statusMessage: `File too large (>10 MB): ${f.filename}` });
    }

    const ext = MIME_TO_EXT[mime] || 'bin';
    const baseName = safeName(f.filename || 'upload');
    const fullName = `${baseName}-${Date.now()}`;

    // Pre-generujeme UUID a vytvoríme media entity s explicit id (robust pattern SW 6.7)
    const mediaId = randomUUID().replace(/-/g, '');

    try {
      // Step 1: create empty media entity with our UUID
      await $fetch(`${adminEndpoint}media`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: { id: mediaId },
      });

      // Step 2: upload bytes (Content-Type = súborový MIME, telo = raw bytes)
      const uploadUrl = `${adminEndpoint}_action/media/${mediaId}/upload?extension=${ext}&fileName=${encodeURIComponent(fullName)}`;
      await $fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': mime,
          Accept: 'application/json',
        },
        body: f.data,
      });

      // Optional: fetch resolved URL
      let url: string | null = null;
      try {
        const detail: any = await $fetch(`${adminEndpoint}media/${mediaId}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        url = detail?.data?.attributes?.url || detail?.data?.url || null;
      } catch { /* ignore */ }

      uploaded.push({ id: mediaId, fileName: f.filename || fullName, url, mime });
    } catch (e: any) {
      const status = e?.response?.status || e?.statusCode;
      const data = e?.data ?? e?.response?._data;
      const apiMsg = data?.errors?.[0]?.detail || data?.errors?.[0]?.title || JSON.stringify(data || {});
      console.error('[returns/upload] Failed for', f.filename, 'status=', status, 'detail=', apiMsg);

      // Cleanup orphan media entity ak step 2 padol
      try {
        await $fetch(`${adminEndpoint}media/${mediaId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch { /* ignore */ }

      throw createError({
        statusCode: 502,
        statusMessage: `Upload failed for ${f.filename}: ${apiMsg || e?.message || 'unknown'}`,
      });
    }
  }

  return { uploaded };
});
