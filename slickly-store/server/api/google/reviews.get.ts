import { defineEventHandler, getQuery } from 'h3';
import { useStorage, useRuntimeConfig } from '#imports';

const PLACE_ID  = 'ChIJ1f4ccNbJFUcRUbCbvaArmfw';
const CACHE_KEY = 'google:places:reviews';
const CACHE_TTL = 60 * 60 * 24; // 24h

const STAR_NEW: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

const EMPTY_RESPONSE = { rating: 0, totalReviews: 0, reviews: [] as any[] };

// In-memory fallback keď Redis nedostupný
let memoryCache: { data: any; expiresAt: number } | null = null;

function getFromMemory(): any | null {
  if (memoryCache && Date.now() < memoryCache.expiresAt) return memoryCache.data;
  return null;
}
function setToMemory(data: any) {
  memoryCache = { data, expiresAt: Date.now() + CACHE_TTL * 1000 };
}

interface NormalizedPayload {
  rating: number;
  totalReviews: number;
  reviews: Array<{
    author: string;
    photo: string | null;
    rating: number;
    text: string;
    date: string;
  }>;
  source?: string;
}

async function tryLegacyApi(apiKey: string): Promise<NormalizedPayload | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json`
      + `?place_id=${PLACE_ID}`
      + `&fields=name,rating,user_ratings_total,reviews`
      + `&language=sk`
      + `&reviews_sort=newest`
      + `&key=${apiKey}`;

    const res = await $fetch<any>(url);
    if (res.status !== 'OK') return null;

    const r = res.result ?? {};
    return {
      source:       'legacy-places-api',
      rating:       r.rating              ?? 0,
      totalReviews: r.user_ratings_total  ?? 0,
      reviews: ((r.reviews ?? []) as any[])
        .filter((rv) => (rv.text ?? '').trim().length > 0)
        .map((rv) => ({
          author: rv.author_name             ?? 'Zákazník',
          photo:  rv.profile_photo_url       ?? null,
          rating: rv.rating                  ?? 5,
          text:   rv.text                    ?? '',
          date:   rv.relative_time_description ?? '',
        })),
    };
  } catch {
    return null;
  }
}

async function tryNewApi(apiKey: string): Promise<NormalizedPayload | null> {
  try {
    const res = await $fetch<any>(
      `https://places.googleapis.com/v1/places/${PLACE_ID}`,
      {
        headers: {
          'X-Goog-Api-Key':   apiKey,
          'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,reviews',
        },
      }
    );

    return {
      source:       'places-api-new',
      rating:       res.rating          ?? 0,
      totalReviews: res.userRatingCount ?? 0,
      reviews: ((res.reviews ?? []) as any[])
        .filter((r) => (r.text?.text ?? '').trim().length > 0)
        .map((r) => ({
          author: r.authorAttribution?.displayName ?? 'Zákazník',
          photo:  r.authorAttribution?.photoUri    ?? null,
          rating: r.rating                         ?? 5,
          text:   r.text?.text                     ?? '',
          date:   r.relativePublishTimeDescription ?? '',
        })),
    };
  } catch {
    return null;
  }
}

export default defineEventHandler(async (event) => {
  const config  = useRuntimeConfig();
  const storage = useStorage('redis');
  const query   = getQuery(event);
  const isDebug = query.debug === '1';

  // 1. Cache hit (Redis → memory fallback)
  if (!isDebug) {
    const cached = await storage.getItem<any>(CACHE_KEY).catch(() => null);
    if (cached) return cached;
    const mem = getFromMemory();
    if (mem) return mem;
  }

  // 2. Bez API kľúča → cache prázdny result, nevolaj API
  if (!config.googlePlacesApiKey) {
    setToMemory(EMPTY_RESPONSE);
    await storage.setItem(CACHE_KEY, EMPTY_RESPONSE, { ttl: CACHE_TTL }).catch(() => null);
    return EMPTY_RESPONSE;
  }

  // 3. Skús legacy → fallback new
  let payload = await tryLegacyApi(config.googlePlacesApiKey);
  if (!payload || payload.reviews.length === 0) {
    const newPayload = await tryNewApi(config.googlePlacesApiKey);
    if (newPayload && newPayload.reviews.length > 0) payload = newPayload;
  }

  // 4. Výsledok (aj prázdny) cachuj na 24h — zabraní opakovaným volaniam
  const result = payload || EMPTY_RESPONSE;
  setToMemory(result);
  await storage.setItem(CACHE_KEY, result, { ttl: CACHE_TTL }).catch(() => null);
  return result;
});
