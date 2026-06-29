import type { BlogPostDetail } from '~~/features/blog/types';

export function useBlogPostingJsonLD(post: BlogPostDetail): void {
  const { origin: baseUrl } = useRequestURL();
  const imageUrl = post.heroCoverUrl || post.coverUrl;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    url: `${baseUrl}/blog/${post.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SLICKLY',
      url: baseUrl,
      logo: { '@type': 'ImageObject', url: `${baseUrl}/favicon.svg` },
    },
    author: post.author
      ? { '@type': 'Person', name: post.author }
      : { '@type': 'Organization', name: 'SLICKLY' },
    inLanguage: 'sk-SK',
  };

  const description = post.metaDescription || post.teaser;
  if (description) schema.description = description;
  if (imageUrl) schema.image = imageUrl;
  if (post.publishedAt) {
    schema.datePublished = post.publishedAt;
    schema.dateModified = post.publishedAt;
  }
  if (post.category) schema.articleSection = post.category;

  useHead({
    script: [{ type: 'application/ld+json', children: JSON.stringify(schema) }],
  });
}
