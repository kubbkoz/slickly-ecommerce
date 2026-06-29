import { defineEventHandler, getRouterParam, createError } from 'h3';
import { useStorage, useRuntimeConfig } from '#imports';

const CACHE_TTL = 60 * 60; // 1 hodina (statické stránky sa menia zriedka)

export default defineEventHandler(async (event) => {
  const config  = useRuntimeConfig();
  const storage = useStorage('redis');
  const slug    = getRouterParam(event, 'slug') as string;

  const cacheKey = `page:${slug}`;
  const cached = await storage.getItem(cacheKey).catch(() => null);
  if (cached) return cached;

  const endpoint    = (config.public.shopware as any).endpoint as string;
  const accessToken = (config.public.shopware as any).accessToken as string;
  const headers = { 'sw-access-key': accessToken, Accept: 'application/json', 'Content-Type': 'application/json' };

  try {
    // Fetch by slug — type filter overíme manuálne (kompatibilita s DB)
    const res: any = await $fetch(`${endpoint}mtsport-article`, {
      method: 'POST',
      headers,
      body: {
        filter: [
          { type: 'equals', field: 'active', value: true },
          { type: 'equals', field: 'slug', value: slug },
        ],
        limit: 1,
        associations: { cover: {} },
        includes: {
          mtsport_article: ['id', 'title', 'slug', 'teaser', 'content', 'metaTitle', 'metaDescription', 'translated', 'cover', 'cmsPageId', 'type'],
          media: ['url', 'thumbnails'],
        },
      },
    });

    const item = (res?.elements || [])[0];

    if (!item) return null;

    if (item.type === 'blog') return null;

    // Fetch CMS page separately
    let cmsPage: any = null;
    if (item.cmsPageId) {
      try {
        cmsPage = await $fetch(`${endpoint}cms/${item.cmsPageId}`, {
          method: 'POST',
          headers,
          body: {
            includes: {
              cms_page: ['id', 'name', 'type', 'sections'],
              cms_section: ['id', 'type', 'position', 'sizingMode', 'mobileBehavior', 'backgroundColor', 'backgroundMediaMode', 'cssClass', 'blocks'],
              cms_block: ['id', 'type', 'position', 'cssClass', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'backgroundColor', 'backgroundMediaMode', 'slots'],
              cms_slot: ['id', 'type', 'slot', 'data', 'config', 'fieldConfig'],
              media: ['url', 'thumbnails', 'alt', 'title'],
              media_thumbnail: ['url', 'width', 'height'],
            },
          },
        });
      } catch {}
    }

    const t = item.translated || {};
    const page = {
      id: item.id,
      title: t.title || item.title,
      slug: item.slug,
      teaser: t.teaser || item.teaser || '',
      content: t.content || item.content || '',
      metaTitle: t.metaTitle || item.metaTitle || (t.title || item.title),
      metaDescription: t.metaDescription || item.metaDescription || '',
      coverUrl: item.cover?.url ?? null,
      heroCoverUrl: item.heroCover?.url ?? null,
      type: 'page' as const,
      cmsPage: cmsPage ?? null,
    };

    await storage.setItem(cacheKey, page, { ttl: CACHE_TTL }).catch(() => null);
    return page;
  } catch (e: any) {
    if (e?.statusCode === 404) throw e;
    console.error('[Page] Fetch failed:', e?.message ?? e);
    throw createError({ statusCode: 502, message: 'Stránka dočasne nedostupná' });
  }
});
