import { defineEventHandler, getRouterParam } from 'h3';
import { useStorage, useRuntimeConfig } from '#imports';

const CACHE_TTL = 60 * 15; // 15 minút

export default defineEventHandler(async (event) => {
  const config  = useRuntimeConfig();
  const storage = useStorage('redis');
  const author  = getRouterParam(event, 'author') as string;

  const cacheKey = `blog:author:${author}`;
  const cached = await storage.getItem(cacheKey).catch(() => null);
  if (cached) return cached;

  const endpoint    = (config.public.shopware as any).endpoint as string;
  const accessToken = (config.public.shopware as any).accessToken as string;

  try {
    const res: any = await $fetch(`${endpoint}mtsport-article`, {
      method: 'POST',
      headers: { 'sw-access-key': accessToken, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: {
        filter: [
          { type: 'equals', field: 'active', value: true },
          { type: 'equals', field: 'author', value: author },
          { type: 'range', field: 'publishedAt', parameters: { lte: new Date().toISOString() } },
        ],
        sort: [{ field: 'publishedAt', order: 'DESC' }],
        limit: 100,
        associations: { cover: {} },
        includes: {
          mtsport_article: ['id', 'title', 'slug', 'teaser', 'publishedAt', 'author', 'category', 'translated', 'cover', 'featured', 'featuredBadgeText'],
          media: ['url', 'thumbnails'],
        },
      },
    });

    const posts = (res?.elements || []).map((i: any) => ({
      id: i.id,
      title: i.translated?.title || i.title,
      slug: i.slug,
      teaser: i.translated?.teaser || i.teaser || '',
      publishedAt: i.publishedAt || '',
      author: i.author || '',
      category: i.category || '',
      coverUrl: i.cover?.url ?? null,
      featured: i.featured ?? false,
      featuredBadgeText: i.featuredBadgeText ?? null,
      type: 'blog',
    }));

    await storage.setItem(cacheKey, posts, { ttl: CACHE_TTL }).catch(() => null);
    return posts;
  } catch (e: any) {
    console.error('[Blog] Author fetch failed:', e?.message ?? e);
    return [];
  }
});
