<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import { sanitizeHtml } from '~~/app/utils/sanitize';
import { proxyMediaUrl } from '~~/app/utils/media';
import type { BlogPostDetail } from '../../types';

const route = useRoute();

const { data: post } = await useAsyncData<BlogPostDetail | null>(
  `blog-post-${route.params.slug}`,
  () => $fetch<BlogPostDetail>(`/api/blog/${route.params.slug}`).catch(() => null)
);

if (!post.value) {
  throw createError({ statusCode: 404, message: 'Článok nebol nájdený' });
}

useSeoMeta({
  title:               () => post.value?.metaTitle || post.value?.title || 'SLICKLY Blog',
  description:         () => post.value?.metaDescription || post.value?.teaser || '',
  ogTitle:             () => post.value?.title || '',
  ogDescription:       () => post.value?.teaser || '',
  ogImage:             () => post.value?.coverUrl ? proxyMediaUrl(post.value.coverUrl) : undefined,
  ogType:              'article',
  ogLocale:            'sk_SK',
  articlePublishedTime: () => post.value?.publishedAt || undefined,
  articleModifiedTime:  () => post.value?.publishedAt || undefined,
  articleSection:      () => post.value?.category || undefined,
});

useBlogPostingJsonLD(post.value);
</script>

<template>
  <article v-if="post" class="min-h-screen bg-white">

    <BlogHero :post="post" />

    <div class="container mx-auto px-4 lg:px-8 py-16">
      <div class="mtsport-blog-content">
        <CmsPage
          v-if="post.cmsPage?.sections?.length"
          :content="post.cmsPage"
        />

        <div
          v-else-if="post.content"
          v-html="sanitizeHtml(post.content)"
        ></div>

        <div
          v-else-if="!post.cmsPage && !post.content"
          class="py-8 text-gray-400 text-sm italic"
        >
          Tento článok nemá obsah. Pridajte text do poľa Obsah článku alebo priraďte CMS rozloženie.
        </div>
      </div>

      <div class="mt-16 pt-8 border-t border-gray-100">
        <NuxtLink
          to="/blog"
          class="inline-flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-widest hover:text-black transition-colors font-sans border-b border-brand pb-0.5"
        >
          <ArrowLeft class="w-3.5 h-3.5" aria-hidden="true" />
          Všetky články
        </NuxtLink>
      </div>
    </div>

  </article>
</template>
