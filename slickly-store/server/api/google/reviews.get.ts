import { defineEventHandler, getQuery, type H3Event } from 'h3';
import { useRuntimeConfig, defineCachedFunction } from '#imports';

const PLACE_ID  = 'ChIJ1f4ccNbJFUcRUbCbvaArmfw';
const CACHE_TTL = 60 * 60 * 24; // 24h

const STAR_NEW: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

const EMPTY_RESPONSE = { rating: 0, totalReviews: 0, reviews: [] as any[] };

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

// `useStorage('redis')` without a mapped `redis:` mount falls back to the default
// MEMORY/FS driver, which ignores TTL in raw `setItem(..., { ttl })` — the previous
// hand-rolled cache (storage + a separate in-process memoryCache safety net) could
// get stuck serving the same result forever. defineCachedFunction checks expiry
// itself (entry.mtime), independent of the storage driver, so one cache layer is
// now enough — the manual memoryCache fallback is no longer needed.
const fetchGoogleReviews = defineCachedFunction(
  async (_event: H3Event): Promise<NormalizedPayload | typeof EMPTY_RESPONSE> => {
    const config = useRuntimeConfig();
    if (!config.googlePlacesApiKey) return EMPTY_RESPONSE;

    let payload = await tryLegacyApi(config.googlePlacesApiKey);
    if (!payload || payload.reviews.length === 0) {
      const newPayload = await tryNewApi(config.googlePlacesApiKey);
      if (newPayload && newPayload.reviews.length > 0) payload = newPayload;
    }
    return payload || EMPTY_RESPONSE;
  },
  {
    name: 'google-reviews',
    getKey: () => 'default',
    maxAge: CACHE_TTL,
    // ?debug=1 bypasses the cache read (still writes a fresh entry) so the debug
    // endpoint always shows a live fetch instead of a cached result.
    shouldBypassCache: (event: H3Event) => getQuery(event).debug === '1',
  },
);

export default defineEventHandler(async (event) => {
  return fetchGoogleReviews(event);
});
