import { defineEventHandler } from 'h3';
import { useRuntimeConfig, useStorage } from '#imports';
import { getAdminToken } from '../../utils/shopwareAdmin';

const CACHE_KEY = 'badge:all';
const CACHE_TTL = 300; // 5 minút (success)
const NEGATIVE_CACHE_TTL = 60; // 1 minúta (failure — zabraňuje retry storm pri 429/500)

interface BadgeRaw {
  id: string;
  name: string;
  text: string;
  bgColor: string;
  textColor: string;
  position: string;
  pdpPosition: 'top' | 'image';
  size: 'sm' | 'md' | 'lg';
  active: boolean;
  sort: number;
  applyProductIds: string[];
  applyCategoryIds: string[];
  applyTagIds: string[];
  applyManufacturerIds: string[];
  applyProductStreamIds: string[];
  applyResolvedStreamProductIds: string[]; // expanded streams → product UUIDs
  applyIsNewDays: number | null;
  applyHasDiscount: boolean;
  // ── Advanced gating filters (v2.0) ──
  applyMinPrice: number | null;
  applyMaxPrice: number | null;
  applyMinStock: number | null;
  applyMaxStock: number | null;
  applyMinRating: number | null;
  applyDateFrom: string | null; // ISO 8601
  applyDateTo: string | null;
  // ── ManyToMany manual assignment (highest priority) ──
  assignedProductIds: string[];
}

function parseJsonField(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string' && x.length > 0) : [];
  } catch {
    return [];
  }
}

/**
 * Resolve product_stream IDs → list of product UUIDs cez Admin API.
 * Stream pravidlá sa vyhodnocujú server-side; klient potom matchuje len product.id.
 *
 * Concurrency limit (CONCURRENCY=3) — 10 badge-ov × 5 streamov by inak hammerovalo
 * Admin API 50 paralelnými requestmi → riziko 429. Sequenčné batche to obmedzia.
 */
async function resolveStreamsToProductIds(
  streamIds: string[],
  adminEndpoint: string,
  token: string,
): Promise<string[]> {
  if (!streamIds.length) return [];

  const CONCURRENCY = 3;
  const ids = new Set<string>();

  for (let i = 0; i < streamIds.length; i += CONCURRENCY) {
    const batch = streamIds.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (streamId) => {
        try {
          const res: any = await $fetch(`${adminEndpoint}search/product`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
            body: {
              limit: 500,
              includes: { product: ['id'] },
              filter: [
                { type: 'equals', field: 'parentId', value: null },
                { type: 'equals', field: 'productStreams.id', value: streamId },
              ],
            },
          });
          for (const p of res?.data ?? []) {
            if (p?.id) ids.add(p.id);
          }
        } catch (e: any) {
          console.error(`[badges] Stream ${streamId} resolve failed:`, e?.message ?? e);
        }
      }),
    );
  }

  return [...ids];
}

export default defineEventHandler(async () => {
  const storage = useStorage('redis');

  const cached = await storage.getItem<BadgeRaw[]>(CACHE_KEY);
  if (cached) return cached;

  const config = useRuntimeConfig();
  const adminEndpoint = config.shopwareAdminEndpoint as string;

  try {
    const token = await getAdminToken();

    // Použijeme search endpoint aby sme získali ManyToMany products asociáciu
    const res: any = await $fetch(`${adminEndpoint}search/mtsport-badge`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      body: {
        filter: [{ type: 'equals', field: 'active', value: true }],
        sort:   [{ field: 'sort', order: 'ASC' }],
        limit:  200,
        associations: { products: { includes: { product: ['id'] } } },
        includes: {
          mtsport_badge: [
            'id', 'name', 'text', 'bgColor', 'textColor', 'position', 'pdpPosition', 'size',
            'active', 'sort',
            'applyProductIds', 'applyCategoryIds', 'applyTagIds', 'applyManufacturerIds', 'applyProductStreamIds',
            'applyIsNewDays', 'applyHasDiscount',
            'applyMinPrice', 'applyMaxPrice', 'applyMinStock', 'applyMaxStock', 'applyMinRating',
            'applyDateFrom', 'applyDateTo',
            'products',
          ],
          product: ['id'],
        },
      },
    });

    const elements: BadgeRaw[] = await Promise.all(
      (res?.data ?? []).map(async (b: any) => {
        const streamIds = parseJsonField(b.applyProductStreamIds ?? b.apply_product_stream_ids);
        const resolvedStreamProductIds = streamIds.length
          ? await resolveStreamsToProductIds(streamIds, adminEndpoint, token)
          : [];

        // ManyToMany products — extrahuj IDs
        const assignedProductIds = Array.isArray(b.products)
          ? b.products.map((p: any) => String(p.id)).filter(Boolean)
          : [];

        return {
          id:                            b.id,
          name:                          b.name ?? '',
          text:                          b.text ?? '',
          bgColor:                       b.bgColor ?? b.bg_color ?? '#22c55e',
          textColor:                     b.textColor ?? b.text_color ?? '#ffffff',
          position:                      b.position ?? 'both',
          pdpPosition:                   (b.pdpPosition ?? b.pdp_position ?? 'top') as 'top' | 'image',
          size:                          (b.size ?? 'md') as 'sm' | 'md' | 'lg',
          active:                        b.active !== false,
          sort:                          b.sort ?? 0,
          applyProductIds:               parseJsonField(b.applyProductIds ?? b.apply_product_ids),
          applyCategoryIds:              parseJsonField(b.applyCategoryIds ?? b.apply_category_ids),
          applyTagIds:                   parseJsonField(b.applyTagIds ?? b.apply_tag_ids),
          applyManufacturerIds:          parseJsonField(b.applyManufacturerIds ?? b.apply_manufacturer_ids),
          applyProductStreamIds:         streamIds,
          applyResolvedStreamProductIds: resolvedStreamProductIds,
          applyIsNewDays:                b.applyIsNewDays ?? b.apply_is_new_days ?? null,
          applyHasDiscount:              !!(b.applyHasDiscount ?? b.apply_has_discount),
          // Advanced gating filters
          applyMinPrice:                 b.applyMinPrice  ?? b.apply_min_price  ?? null,
          applyMaxPrice:                 b.applyMaxPrice  ?? b.apply_max_price  ?? null,
          applyMinStock:                 b.applyMinStock  ?? b.apply_min_stock  ?? null,
          applyMaxStock:                 b.applyMaxStock  ?? b.apply_max_stock  ?? null,
          applyMinRating:                b.applyMinRating ?? b.apply_min_rating ?? null,
          applyDateFrom:                 b.applyDateFrom  ?? b.apply_date_from  ?? null,
          applyDateTo:                   b.applyDateTo    ?? b.apply_date_to    ?? null,
          assignedProductIds,
        };
      }),
    );

    await storage.setItem(CACHE_KEY, elements, { ttl: CACHE_TTL });
    return elements;
  } catch (e: any) {
    const status = e?.response?.status ?? e?.statusCode ?? e?.status;
    console.error(`[badges] Admin API failed${status ? ` (${status})` : ''}:`, e?.message ?? e);
    // Negative cache — krátka TTL pre prázdny result. Zabraňuje:
    //  - retry stormu pri 429 / 500 / OAuth backoff
    //  - kaskádovému zlyhaniu (každý PDP/listing request hammeroval Admin API)
    // Po uplynutí TTL sa skúsi znova.
    await storage.setItem(CACHE_KEY, [], { ttl: NEGATIVE_CACHE_TTL }).catch(() => null);
    return [];
  }
});
