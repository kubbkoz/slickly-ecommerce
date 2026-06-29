export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  teaser: string;
  publishedAt: string;
  author: string;
  category: string;
  coverUrl: string | null;
  featured: boolean;
  featuredBadgeText: string | null;
  type: 'blog' | 'page';
}

export interface BlogPostDetail extends BlogPost {
  content: string;
  metaTitle: string;
  metaDescription: string;
  heroCoverUrl: string | null;
  cmsPage: any | null;
}
