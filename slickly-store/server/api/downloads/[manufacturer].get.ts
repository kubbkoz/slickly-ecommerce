import { defineEventHandler, getRouterParam, getQuery } from 'h3';
import { useStorage, useRuntimeConfig, defineCachedFunction } from '#imports';
import { getAdminToken } from '~~/server/utils/shopwareAdmin';

// `useStorage('redis')` without a mapped `redis:` mount falls back to the default
// MEMORY/FS driver, which ignores TTL in raw `setItem(..., { ttl })` — the cache
// would never expire. defineCachedFunction checks expiry itself (entry.mtime),
// independent of the storage driver.
const CACHE_TTL = 60 * 60 * 24; // 24h

export interface DownloadFile {
  id: string;
  fileName: string;
  title: string;
  url: string;
  mimeType: string;
  fileSize: number;
}

const fetchDownloads = defineCachedFunction(
  async (folderName: string): Promise<DownloadFile[]> => {
    const config = useRuntimeConfig();
    const endpoint = config.shopwareAdminEndpoint as string;
    const token = await getAdminToken();
    const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json' };

    // 1. Nájdi parent folder "Manualy"
    const parentRes: any = await $fetch(`${endpoint}search/media-folder`, {
      method: 'POST', headers,
      body: {
        filter: [{ type: 'equals', field: 'name', value: 'Manualy' }],
        includes: { media_folder: ['id', 'name'] },
        limit: 1,
      },
    });
    const parentFolder = (parentRes?.data || [])[0];
    if (!parentFolder) return [];

    // 2. Nájdi subfolder výrobcu v Manualy/
    const subRes: any = await $fetch(`${endpoint}search/media-folder`, {
      method: 'POST', headers,
      body: {
        filter: [
          { type: 'equals', field: 'parentId', value: parentFolder.id },
          { type: 'contains', field: 'name', value: folderName },
        ],
        includes: { media_folder: ['id', 'name'] },
        limit: 5,
      },
    });

    const subFolders = (subRes?.data || []) as any[];
    const folder = subFolders.find((f: any) => (f.attributes?.name || f.name || '').toLowerCase() === folderName)
      || subFolders[0];
    if (!folder) return [];
    const folderId = folder.id;

    // 3. Načítaj médiá z foldera
    const mediaRes: any = await $fetch(`${endpoint}search/media`, {
      method: 'POST', headers,
      body: {
        filter: [{ type: 'equals', field: 'mediaFolderId', value: folderId }],
        includes: { media: ['id', 'fileName', 'title', 'url', 'mimeType', 'fileSize', 'translated'] },
        sort: [{ field: 'fileName', order: 'ASC' }],
        limit: 50,
      },
    });

    const items = (mediaRes?.data || []) as any[];
    return items.map((m: any) => {
      const a = m.attributes || m;
      return {
        id: m.id || a.id,
        fileName: a.fileName || '',
        title: a.translated?.title || a.title || a.fileName || '',
        url: a.url || '',
        mimeType: a.mimeType || '',
        fileSize: a.fileSize || 0,
      };
    }).filter((f: DownloadFile) => f.url);
  },
  {
    name: 'downloads-by-manufacturer',
    getKey: (folderName: string) => folderName,
    maxAge: CACHE_TTL,
  },
);

export default defineEventHandler(async (event): Promise<DownloadFile[] | { cleared: string }> => {
  const manufacturer = getRouterParam(event, 'manufacturer') as string;
  if (!manufacturer) return [];

  const folderName = decodeURIComponent(manufacturer).toLowerCase();

  const query = getQuery(event);
  if (query.clear === '1') {
    // Key format matches Nitro's internal defineCachedFunction convention:
    // [base, group, name, key + '.json'].join(':'). No public API exposes
    // "invalidate this defineCachedFunction entry" directly.
    const storage = useStorage();
    await storage.removeItem(`/cache:nitro/functions:downloads-by-manufacturer:${folderName}.json`).catch(() => null);
    return { cleared: folderName };
  }

  try {
    return await fetchDownloads(folderName);
  } catch (e: any) {
    if (process.dev) console.error('[downloads]', e?.message || e);
    return [];
  }
});
