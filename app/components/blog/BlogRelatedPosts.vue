<script setup lang="ts">
import type { BlogPost } from '~/data/blog'

defineProps<{
  posts: BlogPost[]
}>()
</script>

<template>
  <section class="contain-section mt-stack-lg md:mt-section-padding-lg">
    <div class="flex items-end justify-between border-b border-grid-line pb-stack-sm md:pb-6 mb-stack-md md:mb-8">
      <h2 class="font-headline-md text-headline-md md:text-headline-lg uppercase tracking-tight">Ďalšie články</h2>
      <NuxtLink
        to="/blog"
        class="font-label-sm text-label-sm text-primary hover:text-on-background uppercase transition-colors duration-200 flex items-center gap-1 rounded-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Všetky články
        <span class="material-symbols-outlined text-[16px]" aria-hidden="true">arrow_forward</span>
      </NuxtLink>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-px bg-grid-line border border-grid-line">
      <NuxtLink
        v-for="post in posts"
        :key="post.id"
        :to="`/blog/${post.slug}`"
        class="group flex flex-col gap-stack-sm bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <div class="aspect-video w-full overflow-hidden">
          <NuxtImg :src="post.image" :alt="post.title" loading="lazy" width="800" height="450" sizes="640px md:340px" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
        <div class="flex flex-col gap-stack-sm p-stack-sm md:p-6">
          <div class="flex items-center justify-between gap-stack-sm">
            <span class="font-technical-data text-technical-data uppercase text-on-surface-variant tracking-widest">{{ post.category }}</span>
            <span class="font-technical-data text-technical-data text-on-surface-variant">{{ post.date }}</span>
          </div>
          <h3 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors duration-200">{{ post.title }}</h3>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
