<script setup lang="ts">
import { featuredPost, regularPosts } from '~/data/blog'

useSeo({
  title: 'Blog | Návody, novinky a starostlivosť o vozidlo | SLICKLY',
  description: 'Tipy, návody a novinky zo sveta starostlivosti o vozidlo – keramická ochrana, detailing a starostlivosť o interiér.',
  canonicalPath: '/blog',
})

useBreadcrumbJsonLd([
  { name: 'Domov', path: '/' },
  { name: 'Blog', path: '/blog' },
])
</script>

<template>
  <div class="w-full md:max-w-[1536px] md:mx-auto px-gutter md:px-grid-margin py-stack-lg md:py-12">
    <!-- Breadcrumb + header -->
    <div class="flex flex-col gap-stack-xs md:gap-2 mb-stack-lg md:mb-8 border-b border-grid-line pb-stack-lg md:pb-6">
      <span class="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
        <NuxtLink to="/" class="hover:text-on-background">Domov</NuxtLink> / Blog
      </span>
      <h1 class="font-headline-lg text-headline-lg md:text-headline-xl uppercase">Blog</h1>
      <p class="font-body-md md:text-body-lg text-on-surface-variant max-w-2xl">
        Tipy, návody a novinky zo sveta starostlivosti o vozidlo.
      </p>
    </div>

    <!-- Featured post -->
    <NuxtLink
      :to="`/blog/${featuredPost.slug}`"
      class="group grid grid-cols-1 md:grid-cols-2 gap-stack-md md:gap-12 mb-stack-lg md:mb-section-padding-lg rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div class="relative aspect-video md:aspect-auto overflow-hidden bg-on-background">
        <span class="absolute top-3 left-3 z-10 bg-secondary-container text-on-secondary-container text-badge-label font-badge-label px-2 py-1 uppercase">
          Featured
        </span>
        <img
          :src="featuredPost.image"
          :alt="featuredPost.title"
          fetchpriority="high"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div class="flex flex-col gap-stack-sm justify-center">
        <div class="flex items-center gap-stack-sm">
          <span class="font-technical-data text-technical-data uppercase text-on-surface-variant tracking-widest">{{ featuredPost.category }}</span>
          <span class="font-technical-data text-technical-data text-on-surface-variant">{{ featuredPost.date }} · {{ featuredPost.readingTime }}</span>
        </div>
        <h2 class="font-headline-md text-headline-md md:text-headline-lg text-on-surface uppercase tracking-tight group-hover:text-primary transition-colors duration-200">
          {{ featuredPost.title }}
        </h2>
        <p class="font-body-md md:text-body-lg text-on-surface-variant">{{ featuredPost.excerpt }}</p>
        <span class="font-label-sm text-label-sm uppercase tracking-widest text-primary flex items-center gap-2 mt-stack-xs">
          Prečítať celý článok
          <span class="material-symbols-outlined text-[16px]" aria-hidden="true">arrow_forward</span>
        </span>
      </div>
    </NuxtLink>

    <!-- Regular posts -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-px bg-grid-line border border-grid-line">
      <NuxtLink
        v-for="post in regularPosts"
        :key="post.id"
        :to="`/blog/${post.slug}`"
        class="group flex flex-col gap-stack-sm bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <div class="aspect-video w-full overflow-hidden">
          <img
            :src="post.image"
            :alt="post.title"
            loading="lazy"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div class="flex flex-col gap-stack-sm p-stack-sm md:p-6">
          <div class="flex items-center justify-between gap-stack-sm">
            <span class="font-technical-data text-technical-data uppercase text-on-surface-variant tracking-widest">{{ post.category }}</span>
            <span class="font-technical-data text-technical-data text-on-surface-variant">{{ post.date }}</span>
          </div>
          <h3 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors duration-200">{{ post.title }}</h3>
          <p class="font-body-md text-body-md text-on-surface-variant">{{ post.excerpt }}</p>
          <span class="font-label-sm text-label-sm uppercase tracking-widest text-primary flex items-center gap-2 mt-stack-xs">
            Prečítať celé
            <span class="material-symbols-outlined text-[16px]" aria-hidden="true">arrow_forward</span>
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
