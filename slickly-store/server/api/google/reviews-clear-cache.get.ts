/**
 * DEV/admin helper: vymaže cached Google reviews z Redis.
 * Použitie: navštív http://localhost:3000/api/google/reviews-clear-cache
 * Po novom fetchnutí cez /api/google/reviews dostaneš fresh dáta.
 */
import { defineEventHandler } from 'h3';
import { useStorage } from '#imports';

export default defineEventHandler(async () => {
  // Key format matches Nitro's internal defineCachedFunction convention:
  // [base, group, name, key + '.json'].join(':') — see server/api/google/reviews.get.ts
  // (name: 'google-reviews', getKey: () => 'default'). No public API exposes this directly.
  const storage = useStorage();
  await storage.removeItem('/cache:nitro/functions:google-reviews:default.json').catch(() => null);
  return { success: true, message: 'Cache vymazaná. Daj refresh /api/google/reviews' };
});
