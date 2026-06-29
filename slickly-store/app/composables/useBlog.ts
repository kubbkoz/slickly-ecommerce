/**
 * useBlog — wrapper pre OpenBlogware Store API (/store-api/blog)
 * Polia reflektujú reálne entity werkl_blog_entry:
 *   publishedAt, blogAuthor, media (nie author/previewMedia)
 */

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  teaser?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: string;
  active?: boolean;
  mediaId?: string | null;
  media?: { url: string; thumbnails?: Array<{ url: string; width: number }> } | null;
  blogAuthor?: { displayName?: string; name?: string } | null;
  tags?: Array<{ name: string }>;
  categories?: Array<{ name: string; id: string }>;
};

export type BlogListResponse = {
  elements: BlogPost[];
  total: number;
};

export const useBlog = () => {
  const config = useRuntimeConfig();
  const { currentLanguageId } = useShopwareLanguage();
  const SW_ENDPOINT = config.public.shopware.endpoint as string;
  const SW_TOKEN = config.public.shopware.accessToken as string;

  const _fetch = (body: Record<string, unknown>) =>
    $fetch<any>(`${SW_ENDPOINT}blog`, {
      method: 'POST',
      headers: {
        'sw-access-token': SW_TOKEN,
        'sw-language-id': currentLanguageId.value,
        'Content-Type': 'application/json',
      },
      body,
    });

  const fetchPosts = async (params?: {
    limit?: number;
    page?: number;
    filter?: Record<string, unknown>[];
    sort?: Array<{ field: string; order: 'ASC' | 'DESC' }>;
  }): Promise<BlogListResponse> => {
    try {
      const res = await _fetch({
        limit: params?.limit ?? 9,
        page: params?.page ?? 1,
        filter: [
          { type: 'equals', field: 'active', value: true },
          ...(params?.filter ?? []),
        ],
        sort: params?.sort ?? [{ field: 'publishedAt', order: 'DESC' }],
        associations: { media: {}, blogAuthor: {}, tags: {}, categories: {} },
      });
      return {
        elements: (res?.elements ?? res?.data?.elements ?? []) as BlogPost[],
        total: res?.total ?? 0,
      };
    } catch (e) {
      console.error('[useBlog] fetchPosts failed:', e);
      return { elements: [], total: 0 };
    }
  };

  const fetchPost = async (slug: string): Promise<BlogPost | null> => {
    try {
      const res = await _fetch({
        limit: 1,
        filter: [
          { type: 'equals', field: 'slug', value: slug },
          { type: 'equals', field: 'active', value: true },
        ],
        associations: { media: {}, blogAuthor: {}, tags: {}, categories: {} },
      });
      const elements = (res?.elements ?? res?.data?.elements ?? []) as BlogPost[];
      return elements[0] ?? null;
    } catch (e) {
      console.error('[useBlog] fetchPost failed:', e);
      return null;
    }
  };

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return '';
    return new Intl.DateTimeFormat('sk-SK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateStr));
  };

  const postImageUrl = (post: BlogPost): string =>
    post.media?.url ?? '';

  const authorName = (post: BlogPost): string =>
    post.blogAuthor?.displayName ?? post.blogAuthor?.name ?? '';

  return { fetchPosts, fetchPost, formatDate, postImageUrl, authorName };
};
