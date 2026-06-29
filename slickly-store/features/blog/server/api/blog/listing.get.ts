import { defineEventHandler, getQuery } from 'h3';
import { useStorage, useRuntimeConfig } from '#imports';

const CACHE_TTL = 60 * 30; // 30 minút

interface BlogPostShape {
  id: string;
  title: string;
  slug: string;
  teaser: string;
  excerpt: string;
  publishedAt: string;
  author: string;
  category: string;
  coverUrl: string | null;
  featured: boolean;
  featuredBadgeText: string | null;
  type: string;
}

function extractExcerpt(html: string, maxSentences: number): string {
  if (!html) return '';
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  if (!sentences) return text.slice(0, 200);
  return sentences.slice(0, maxSentences).join(' ').trim();
}

export default defineEventHandler(async (event) => {
  const config  = useRuntimeConfig();
  const storage = useStorage('redis');
  const query   = getQuery(event);

  const category = (query.category as string) || '';
  const author   = (query.author as string) || '';
  const cacheKey = `blog:listing:${category || 'all'}:${author || 'all'}`;

  const cached = await storage.getItem<BlogPostShape[]>(cacheKey).catch(() => null);
  if (cached) return cached;

  const endpoint    = (config.public.shopware as any).endpoint as string;
  const accessToken = (config.public.shopware as any).accessToken as string;

  try {
    const limitParam = parseInt(query.limit as string) || 50;
    const filter: any[] = [
      { type: 'equals', field: 'active', value: true },
      { type: 'equals', field: 'type', value: 'blog' },
      { type: 'range', field: 'publishedAt', parameters: { lte: new Date().toISOString() } },
    ];
    if (category) filter.push({ type: 'equals', field: 'category', value: category });
    if (author)   filter.push({ type: 'equals', field: 'author', value: author });

    const res: any = await $fetch(`${endpoint}mtsport-article`, {
      method: 'POST',
      headers: {
        'sw-access-key': accessToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: {
        filter,
        sort: [
          { field: 'featured', order: 'DESC' },
          { field: 'publishedAt', order: 'DESC' },
        ],
        limit: limitParam,
        associations: {
          cover: {},
          cmsPage: { associations: { sections: { associations: { blocks: { associations: { slots: {} } } } } } },
        },
        includes: {
          mtsport_article: [
            'id', 'title', 'slug', 'teaser', 'content', 'publishedAt', 'author', 'category',
            'translated', 'cover', 'cmsPage', 'featured', 'featuredBadgeText', 'cmsPageId',
          ],
          media: ['url', 'thumbnails'],
          cms_page: ['sections'],
          cms_section: ['blocks'],
          cms_block: ['slots'],
          cms_slot: ['type', 'data', 'config'],
        },
      },
    });

    const items: any[] = res?.elements || [];

    const posts: BlogPostShape[] = items.map((i) => {
      let rawText = i.translated?.content || i.content || '';
      const needsCmsExtract = !rawText || rawText.length < 50;
      if (needsCmsExtract && i.cmsPage?.sections) {
        const texts: string[] = [];
        for (const s of i.cmsPage.sections) {
          for (const b of s.blocks || []) {
            for (const sl of b.slots || []) {
              const val = sl.data?.content || sl.config?.content?.value || '';
              if (val && typeof val === 'string') texts.push(val);
            }
          }
        }
        rawText = texts.join(' ');
      }
      const teaser = i.translated?.teaser || i.teaser || '';
      const excerpt3 = extractExcerpt(rawText, 3);
      const excerpt2 = extractExcerpt(rawText, 2);

      return {
        id: i.id,
        title: i.translated?.title || i.title,
        slug: i.slug,
        teaser: teaser || excerpt3,
        excerpt: excerpt2,
        publishedAt: i.publishedAt || '',
        author: i.author || 'SLICKLY',
        category: i.category || '',
        coverUrl: i.cover?.url ?? null,
        featured: i.featured ?? false,
        featuredBadgeText: i.featuredBadgeText ?? null,
        type: 'blog',
      };
    });

    await storage.setItem(cacheKey, posts, { ttl: CACHE_TTL }).catch(() => null);
    return posts;
  } catch (e: any) {
    console.error('[Blog] Listing fetch failed:', e?.data ?? e?.message ?? e);
    return [];
  }
});
