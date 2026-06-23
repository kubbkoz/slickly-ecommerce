<script setup lang="ts">
import { getPostBySlug, getOtherPosts } from '~/data/blog'

const route = useRoute()
const slug = route.params.slug as string

const post = getPostBySlug(slug)

if (!post) {
  throw createError({ statusCode: 404, statusMessage: 'Článok nebol nájdený', fatal: true })
}

const otherPosts = getOtherPosts(post.slug, 2)

useSeo({
  title: `${post.title} | Blog | SLICKLY`,
  description: post.excerpt,
  canonicalPath: `/blog/${post.slug}`,
  image: post.image,
  type: 'article',
})

useBreadcrumbJsonLd([
  { name: 'Domov', path: '/' },
  { name: 'Blog', path: '/blog' },
  { name: post.title, path: `/blog/${post.slug}` },
])

useJsonLd({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.excerpt,
  image: absoluteUrl(post.image),
  datePublished: post.isoDate,
  dateModified: post.isoDate,
  author: { '@type': 'Organization', name: post.author || 'SLICKLY', url: useSiteUrl() },
  publisher: {
    '@type': 'Organization',
    name: 'SLICKLY',
    logo: { '@type': 'ImageObject', url: absoluteUrl('/favicon.ico') },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(`/blog/${post.slug}`) },
})
</script>

<template>
  <div class="w-full md:max-w-[1536px] md:mx-auto px-gutter md:px-grid-margin py-stack-lg md:py-12">
    <!-- Breadcrumb -->
    <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant block mb-stack-lg md:mb-8">
      <NuxtLink to="/" class="hover:text-on-background">Domov</NuxtLink> /
      <NuxtLink to="/blog" class="hover:text-on-background">Blog</NuxtLink> /
      {{ post.category }}
    </span>

    <article class="max-w-3xl mx-auto">
      <!-- Header -->
      <header class="flex flex-col gap-stack-sm mb-stack-lg md:mb-12">
        <span class="font-technical-data text-technical-data uppercase text-on-surface-variant tracking-widest">{{ post.category }}</span>
        <h1 class="font-headline-lg text-headline-lg md:text-headline-xl uppercase">{{ post.title }}</h1>
        <div class="flex items-center gap-2 font-technical-data text-technical-data text-on-surface-variant">
          <span>{{ post.author }}</span>
          <span aria-hidden="true">·</span>
          <span>{{ post.date }}</span>
          <span aria-hidden="true">·</span>
          <span>{{ post.readingTime }}</span>
        </div>
      </header>

      <!-- Hero image -->
      <div class="aspect-video w-full overflow-hidden mb-stack-lg md:mb-12 bg-on-background">
        <NuxtImg :src="post.image" :alt="post.title" fetchpriority="high" preload width="1200" height="675" sizes="640px md:1024px" class="w-full h-full object-cover" />
      </div>

      <!-- Content -->
      <div class="flex flex-col gap-stack-md">
        <template v-for="(block, idx) in post.content" :key="idx">
          <p v-if="block.type === 'paragraph'" class="font-body-md md:text-body-lg text-on-surface-variant">
            {{ block.text }}
          </p>

          <h2 v-else-if="block.type === 'heading'" class="font-headline-md text-headline-md md:text-headline-lg uppercase tracking-tight mt-stack-sm md:mt-8">
            {{ block.text }}
          </h2>

          <ul v-else-if="block.type === 'list'" class="flex flex-col gap-stack-sm">
            <li v-for="(item, i) in block.items" :key="i" class="flex items-start gap-2 font-body-md md:text-body-lg text-on-surface-variant">
              <span class="material-symbols-outlined text-secondary-container text-[20px] shrink-0" aria-hidden="true">check</span>
              <span>{{ item }}</span>
            </li>
          </ul>

          <ol v-else-if="block.type === 'steps'" class="flex flex-col gap-stack-md">
            <li v-for="(step, i) in block.items" :key="i" class="flex items-start gap-stack-sm md:gap-stack-md">
              <span class="shrink-0 w-8 h-8 flex items-center justify-center bg-primary text-on-primary font-technical-data text-technical-data rounded-full">
                {{ i + 1 }}
              </span>
              <div class="flex flex-col gap-1 pt-1">
                <h3 class="font-headline-sm text-headline-sm text-on-surface">{{ step.title }}</h3>
                <p class="font-body-md md:text-body-lg text-on-surface-variant">{{ step.text }}</p>
              </div>
            </li>
          </ol>

          <blockquote v-else-if="block.type === 'quote'" class="border-l-2 border-secondary-container pl-stack-md flex flex-col gap-1">
            <p class="font-headline-sm text-headline-sm text-on-background italic">„{{ block.text }}“</p>
            <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">{{ block.author }}</span>
          </blockquote>
        </template>
      </div>
    </article>

    <!-- Ďalšie články -->
    <LazyBlogRelatedPosts v-if="otherPosts.length" v-reveal hydrate-on-visible :posts="otherPosts" />
  </div>
</template>
