<script setup lang="ts">
import { blogPosts } from '~/data/blog'

const posts = blogPosts.slice(0, 3)
</script>

<template>
  <section class="w-full relative py-stack-lg md:py-section-padding-lg bg-surface-container border-y border-grid-line">
    <div class="w-full md:max-w-[1536px] md:mx-auto px-gutter md:px-grid-margin flex flex-col gap-stack-md md:gap-12">
      <div class="flex justify-between items-end border-b border-grid-line pb-stack-sm md:pb-6">
        <div class="flex flex-col gap-1">
          <h2 class="font-headline-md text-headline-md md:text-headline-lg uppercase tracking-tight">Blog</h2>
          <p class="font-body-md text-body-md text-on-surface-variant">Tipy, návody a novinky zo sveta starostlivosti o vozidlo.</p>
        </div>
        <NuxtLink
          to="/blog"
          class="hidden md:flex gap-2 items-center font-label-sm text-label-sm text-primary hover:text-secondary uppercase transition-colors duration-200 shrink-0 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Zobraziť všetko
          <span class="material-symbols-outlined text-[16px]" aria-hidden="true">arrow_forward</span>
        </NuxtLink>
        <NuxtLink
          to="/blog"
          class="md:hidden min-h-11 flex items-center text-on-surface-variant font-badge-label text-badge-label uppercase border-b border-on-surface-variant transition-colors duration-200 hover:text-on-background shrink-0 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Všetko
        </NuxtLink>
      </div>

      <!-- Mobile: horizontal scroll -->
      <div class="md:hidden flex gap-stack-sm overflow-x-auto px-gutter -mx-gutter scroll-px-gutter hide-scrollbar snap-x">
        <NuxtLink
          v-for="post in posts"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          class="group min-w-[280px] snap-start flex flex-col gap-stack-sm bg-surface border border-grid-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <div class="relative aspect-video w-full overflow-hidden">
            <span
              v-if="post.featured"
              class="absolute top-2 left-2 z-10 bg-secondary-container text-on-secondary-container text-badge-label font-badge-label px-2 py-1 uppercase"
            >
              Featured
            </span>
            <img :src="post.image" :alt="post.title" loading="lazy" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          </div>
          <div class="flex flex-col gap-stack-sm p-stack-sm">
            <div class="flex items-center justify-between gap-stack-sm">
              <span class="font-technical-data text-technical-data uppercase text-secondary tracking-widest">{{ post.category }}</span>
              <span class="font-technical-data text-technical-data text-on-surface-variant">{{ post.date }}</span>
            </div>
            <h3 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors duration-200">{{ post.title }}</h3>
            <p class="font-body-md text-body-md text-on-surface-variant">{{ post.excerpt }}</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Desktop: grid -->
      <div class="hidden md:grid grid-cols-3 gap-px bg-grid-line border border-grid-line">
        <NuxtLink
          v-for="post in posts"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          class="group flex flex-col gap-stack-sm bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <div class="relative aspect-video w-full overflow-hidden">
            <span
              v-if="post.featured"
              class="absolute top-3 left-3 z-10 bg-secondary-container text-on-secondary-container text-badge-label font-badge-label px-2 py-1 uppercase"
            >
              Featured
            </span>
            <img :src="post.image" :alt="post.title" loading="lazy" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          </div>
          <div class="flex flex-col gap-stack-sm p-6">
            <div class="flex items-center justify-between gap-stack-sm">
              <span class="font-technical-data text-technical-data uppercase text-secondary tracking-widest">{{ post.category }}</span>
              <span class="font-technical-data text-technical-data text-on-surface-variant">{{ post.date }}</span>
            </div>
            <h3 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors duration-200">{{ post.title }}</h3>
            <p class="font-body-md text-body-md text-on-surface-variant">{{ post.excerpt }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
