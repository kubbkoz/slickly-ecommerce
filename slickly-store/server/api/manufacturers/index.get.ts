import { defineEventHandler } from 'h3';
import { useRuntimeConfig, defineCachedFunction } from '#imports';
import { getAdminToken } from '../../utils/shopwareAdmin';

// 10 min — `useStorage('redis')` bez namapovaného `redis:` mountu spadne na default
// MEMORY/FS driver, ktorý TTL v raw `setItem(..., { ttl })` ignoruje (cache by sa
// tak uložila navždy). `defineCachedFunction` kontroluje expiráciu sám cez
// `entry.mtime`, nezávisle od storage drivera — preto tento uniformný TTL platí
// pre úspech aj zlyhanie (jednoduchšie než dvojúrovňová cache, stále efektívne
// bráni retry stormu pri výpadku Admin API).
const CACHE_TTL = 600;

export interface ManufacturerItem {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  link: string | null;
  productCount: number;
}

// Identický algoritmus ako app/utils/url.ts::slugify — slugy MUSIA sedieť medzi
// serverom (tieto routy) a klientom (DistributorTab používa slugify(name)).
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .trim();
}

/** Admin API aggregation: manufacturerId → počet parent produktov. Best-effort. */
async function fetchProductCounts(
  adminEndpoint: string,
  token: string,
): Promise<Record<string, number>> {
  try {
    const res: any = await $fetch(`${adminEndpoint}search/product`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      body: {
        limit: 1,
        filter: [{ type: 'equals', field: 'parentId', value: null }],
        aggregations: [
          { name: 'mans', type: 'terms', field: 'manufacturerId', limit: 1000 },
        ],
      },
    });
    const buckets: any[] = res?.aggregations?.mans?.buckets ?? [];
    const map: Record<string, number> = {};
    for (const b of buckets) {
      if (b?.key) map[b.key] = b.count ?? 0;
    }
    return map;
  } catch (e: any) {
    console.warn('[manufacturers] product count aggregation failed:', e?.message ?? e);
    return {};
  }
}

const fetchManufacturers = defineCachedFunction(
  async (): Promise<ManufacturerItem[]> => {
    const config = useRuntimeConfig();
    const adminEndpoint = config.shopwareAdminEndpoint as string;

    try {
      const token = await getAdminToken();

      const res: any = await $fetch(`${adminEndpoint}search/product-manufacturer`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        body: {
          limit: 500,
          sort: [{ field: 'name', order: 'ASC' }],
          associations: { media: {} },
          includes: {
            product_manufacturer: ['id', 'name', 'translated', 'link', 'media'],
            media: ['url'],
          },
        },
      });

      const counts = await fetchProductCounts(adminEndpoint, token);

      const seenSlugs = new Set<string>();
      const items: ManufacturerItem[] = (res?.data ?? []).map((m: any) => {
        const name = m.translated?.name || m.name || '';
        let slug = slugify(name) || m.id;
        // Kolízia slugu → append -2, -3 … (unikátnosť pre /znacka/{slug})
        if (seenSlugs.has(slug)) {
          let i = 2;
          while (seenSlugs.has(`${slug}-${i}`)) i++;
          slug = `${slug}-${i}`;
        }
        seenSlugs.add(slug);

        return {
          id: m.id,
          name,
          slug,
          logoUrl: m.media?.url ?? null,
          link: m.link ?? null,
          productCount: counts[m.id] ?? 0,
        };
      });

      return items;
    } catch (e: any) {
      const status = e?.response?.status ?? e?.statusCode ?? e?.status;
      console.error(`[manufacturers] Admin API failed${status ? ` (${status})` : ''}:`, e?.message ?? e);
      // Cached too (same TTL) — prevents hammering Admin API on repeat requests during an outage.
      return [];
    }
  },
  { name: 'manufacturers-list', getKey: () => 'all', maxAge: CACHE_TTL },
);

export default defineEventHandler(async (): Promise<ManufacturerItem[]> => {
  return fetchManufacturers();
});
