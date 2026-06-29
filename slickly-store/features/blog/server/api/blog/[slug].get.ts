import { defineEventHandler, getRouterParam, createError } from 'h3';
import { useStorage, useRuntimeConfig } from '#imports';

const CACHE_TTL = 60 * 30; // 30 minút

interface BlogPostDetailShape {
  id: string;
  title: string;
  slug: string;
  teaser: string;
  content: string;
  publishedAt: string;
  author: string;
  category: string;
  coverUrl: string | null;
  metaTitle: string;
  metaDescription: string;
  cmsPage: any | null;
}

export default defineEventHandler(async (event) => {
  const config  = useRuntimeConfig();
  const storage = useStorage('redis');
  const slug    = getRouterParam(event, 'slug') as string;

  const cacheKey = `blog:post:${slug}`;
  const cached = await storage.getItem<BlogPostDetailShape>(cacheKey).catch(() => null);
  if (cached) return cached;

  const endpoint    = (config.public.shopware as any).endpoint as string;
  const accessToken = (config.public.shopware as any).accessToken as string;

  const headers = {
    'sw-access-key': accessToken,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  try {
    // 1. Fetch článok — základné polia + cover + heroCover + cmsPageId
    const res: any = await $fetch(`${endpoint}mtsport-article`, {
      method: 'POST',
      headers,
      body: {
        filter: [
          { type: 'equals', field: 'active', value: true },
          { type: 'equals', field: 'type', value: 'blog' },
          { type: 'equals', field: 'slug', value: slug },
          { type: 'range', field: 'publishedAt', parameters: { lte: new Date().toISOString() } },
        ],
        limit: 1,
        associations: { cover: {}, heroCover: {} },
        includes: {
          mtsport_article: [
            'id', 'title', 'slug', 'teaser', 'content', 'publishedAt',
            'author', 'category', 'metaTitle', 'metaDescription',
            'translated', 'cover', 'heroCover', 'cmsPageId',
            'featured', 'featuredBadgeText',
          ],
          media: ['url', 'thumbnails'],
        },
      },
    });

    const item = (res?.elements || [])[0];
    if (!item) {
      throw createError({ statusCode: 404, message: 'Článok nebol nájdený' });
    }

    // 2. Fetch CMS page cez natívny Shopware endpoint — správny formát pre <CmsPage>
    let cmsPage: any = null;
    const cmsPageId: string | null = item.cmsPageId ?? null;
    if (cmsPageId) {
      try {
        cmsPage = await $fetch(`${endpoint}cms/${cmsPageId}`, {
          method: 'POST',
          headers,
          body: {
            includes: {
              cms_page: ['id', 'name', 'type', 'sections'],
              cms_section: ['id', 'type', 'position', 'sizingMode', 'mobileBehavior',
                            'backgroundColor', 'backgroundMediaMode', 'cssClass', 'blocks'],
              cms_block: ['id', 'type', 'position', 'sectionPosition', 'cssClass', 'marginTop', 'marginBottom',
                          'marginLeft', 'marginRight', 'backgroundColor', 'backgroundMediaMode', 'slots'],
              cms_slot: ['id', 'type', 'slot', 'data', 'config', 'fieldConfig', 'translated'],
              media: ['url', 'thumbnails', 'alt', 'title'],
              media_thumbnail: ['url', 'width', 'height'],
            },
          },
        });
      } catch (cmsErr: any) {
        console.warn(`[Blog] CMS page fetch failed for ${cmsPageId}:`, cmsErr?.message ?? cmsErr);
        // cmsPage zostane null — fallback na content pole
      }
    }

    const t = item.translated || {};
    const teaser = t.teaser || item.teaser || '';

    const post: BlogPostDetailShape = {
      id: item.id,
      title: t.title || item.title,
      slug: item.slug,
      teaser,
      content: t.content || item.content || '',
      publishedAt: item.publishedAt || '',
      author: item.author || 'SLICKLY',
      category: item.category || '',
      coverUrl: item.cover?.url ?? null,
      heroCoverUrl: item.heroCover?.url ?? null,
      metaTitle: t.metaTitle || item.metaTitle || (t.title || item.title),
      metaDescription: t.metaDescription || item.metaDescription || teaser,
      featured: item.featured ?? false,
      featuredBadgeText: item.featuredBadgeText ?? null,
      type: 'blog',
      cmsPage: cmsPage ?? null,
    };

    await storage.setItem(cacheKey, post, { ttl: CACHE_TTL }).catch(() => null);
    return post;
  } catch (e: any) {
    if (e?.statusCode === 404) throw e;
    console.error('[Blog] Detail fetch failed:', e?.data ?? e?.message ?? e);
    throw createError({ statusCode: 502, message: 'Blog dočasne nedostupný' });
  }
});
