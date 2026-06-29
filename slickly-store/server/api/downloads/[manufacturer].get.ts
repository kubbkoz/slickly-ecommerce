import { defineEventHandler, getRouterParam, getQuery } from 'h3';
import { useStorage, useRuntimeConfig } from '#imports';
import { getAdminToken } from '~~/server/utils/shopwareAdmin';

const CACHE_TTL = 60 * 60 * 24; // 24h

export interface DownloadFile {
  id: string;
  fileName: string;
  title: string;
  url: string;
  mimeType: string;
  fileSize: number;
}

export default defineEventHandler(async (event) => {
  const manufacturer = getRouterParam(event, 'manufacturer') as string;
  if (!manufacturer) return [];

  const folderName = decodeURIComponent(manufacturer).toLowerCase();
  const cacheKey = `downloads:${folderName}`;
  const storage = useStorage('redis');

  const query = getQuery(event);
  if (query.clear === '1') {
    await storage.removeItem(cacheKey).catch(() => null);
    return { cleared: cacheKey };
  }

  const cached = await storage.getItem<DownloadFile[]>(cacheKey).catch(() => null);
  if (cached) return cached;

  try {
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
    if (!parentFolder) {
      await storage.setItem(cacheKey, [], { ttl: CACHE_TTL }).catch(() => null);
      return [];
    }

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
    if (!folder) {
      await storage.setItem(cacheKey, [], { ttl: CACHE_TTL }).catch(() => null);
      return [];
    }
    const folderId = folder.id;

    // 2. Načítaj médiá z foldera
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
    const files: DownloadFile[] = items.map((m: any) => {
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

    await storage.setItem(cacheKey, files, { ttl: CACHE_TTL }).catch(() => null);
    return files;
  } catch (e: any) {
    if (process.dev) console.error('[downloads]', e?.message || e);
    return [];
  }
});
