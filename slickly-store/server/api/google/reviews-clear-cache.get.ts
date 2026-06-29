/**
 * DEV/admin helper: vymaže cached Google reviews z Redis.
 * Použitie: navštív http://localhost:3000/api/google/reviews-clear-cache
 * Po novom fetchnutí cez /api/google/reviews dostaneš fresh dáta.
 */
import { defineEventHandler } from 'h3';
import { useStorage } from '#imports';

export default defineEventHandler(async () => {
  const storage = useStorage('redis');
  await storage.removeItem('google:places:reviews').catch(() => null);
  return { success: true, message: 'Cache vymazaná. Daj refresh /api/google/reviews' };
});
