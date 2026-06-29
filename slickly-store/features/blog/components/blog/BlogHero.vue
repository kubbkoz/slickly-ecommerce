<script setup lang="ts">
import { Calendar, ArrowLeft, User } from 'lucide-vue-next';
import { proxyMediaUrl } from '~~/app/utils/media';
import type { BlogPostDetail } from '../../types';

const props = defineProps<{
  post: BlogPostDetail;
}>();

const formatDate = (d: string) =>
  d ? new Date(d).toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
</script>

<template>
  <div class="relative bg-black overflow-hidden">
    <div v-if="post.heroCoverUrl || post.coverUrl" class="absolute inset-0">
      <NuxtImg
        :src="proxyMediaUrl((post as any).heroCoverUrl || post.coverUrl!)"
        :alt="post.title"
        class="w-full h-full object-cover opacity-40"
        format="webp"
        loading="eager"
        sizes="100vw"
      />
    </div>
    <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-70"></div>

    <div class="container mx-auto px-4 lg:px-8 py-20 relative z-10">
      <NuxtLink
        to="/blog"
        class="inline-flex items-center gap-2 text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest mb-8 transition-colors font-sans"
      >
        <ArrowLeft class="w-4 h-4" aria-hidden="true" />
        SLICKLY Blog
      </NuxtLink>

      <div class="flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-widest text-white/50 font-sans mb-6">
        <span class="flex items-center gap-1.5">
          <Calendar class="w-3.5 h-3.5 text-brand" aria-hidden="true" />
          {{ formatDate(post.publishedAt) }}
        </span>
        <NuxtLink
          v-if="post.author"
          :to="`/blog/autor/${encodeURIComponent(post.author)}`"
          class="flex items-center gap-1.5 hover:text-brand transition-colors"
        >
          <User class="w-3.5 h-3.5 text-brand" aria-hidden="true" />
          {{ post.author }}
        </NuxtLink>
        <span v-if="post.category" class="bg-brand/20 text-brand px-2 py-0.5 font-bold">
          {{ post.category }}
        </span>
      </div>

      <h1 class="text-3xl md:text-5xl lg:text-6xl font-tech font-black uppercase italic text-white leading-none max-w-4xl">
        {{ post.title }}
      </h1>
      <div class="section-decorator mt-6"></div>

      <p v-if="post.teaser" class="mt-6 text-gray-300 font-sans text-lg leading-relaxed max-w-2xl">
        {{ post.teaser }}
      </p>
    </div>
  </div>
</template>
