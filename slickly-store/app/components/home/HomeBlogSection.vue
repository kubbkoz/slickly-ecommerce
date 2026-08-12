<script setup lang="ts">
import { BookOpen, ArrowRight } from 'lucide-vue-next';
import { proxyMediaUrl } from '~~/app/utils/media';

const { data: posts, pending } = await useAsyncData(
  'home-blog-posts',
  () => $fetch('/api/blog/listing', { query: { limit: 3 } }).catch(() => [])
);

const gridPosts = computed(() => ((posts.value as any[]) ?? []).slice(0, 3));

const formatDate = (d: string) =>
  d ? new Date(d).toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

const { target, isVisible } = useScrollReveal();
</script>

<template>
  <section v-if="pending || (posts && (posts as any[]).length)" ref="target" class="py-24 bg-gray-50 border-t border-gray-100">
    <div class="container mx-auto px-4 lg:px-8">

      <div class="reveal-base flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10" :class="isVisible ? 'reveal-visible' : 'reveal'">
        <span class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase font-tech tracking-tight leading-[0.95]">
          SLICKLY <span class="text-brand">Blog</span>
        </span>
        <NuxtLink to="/blog" class="hidden lg:inline-flex btn-cta-motion">
          Pozrieť všetky články <ArrowRight class="w-5 h-5" />
        </NuxtLink>
      </div>

      <!-- Skeleton -->
      <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="space-y-3">
          <div class="aspect-[4/3] bg-gray-200 animate-pulse rounded-default" />
          <div class="h-3 bg-gray-200 animate-pulse w-1/3" />
          <div class="h-4 bg-gray-200 animate-pulse w-full" />
        </div>
      </div>

      <!-- News-style grid — big cover with bold overlaid title -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="post in gridPosts"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          class="group card-surface overflow-hidden flex flex-col"
        >
          <div class="relative aspect-[4/3] bg-gray-900 overflow-hidden">
            <NuxtImg
              v-if="post.coverUrl"
              :src="proxyMediaUrl(post.coverUrl)"
              :alt="post.title"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              format="webp"
              loading="lazy"
              sizes="sm:100vw lg:33vw"
            />
            <div v-else class="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <BookOpen class="w-12 h-12 text-white/20" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent"></div>
            <div v-if="post.category" class="absolute top-4 left-4 bg-amber rounded-sm px-3 py-1">
              <span class="block text-black text-[10px] font-bold uppercase tracking-widest font-tech">{{ post.category }}</span>
            </div>
            <h3 class="absolute bottom-4 left-4 right-4 font-tech font-black uppercase text-xl md:text-2xl leading-[0.95] text-white drop-shadow-lg line-clamp-3">
              {{ post.title }}
            </h3>
          </div>
          <div class="p-4 flex items-center justify-between gap-3">
            <span class="text-[11px] text-gray-400 font-sans">{{ formatDate(post.publishedAt) }}</span>
            <span class="text-[11px] text-black font-sans font-bold uppercase tracking-wider group-hover:text-brand transition-colors">
              Čítať viac →
            </span>
          </div>
        </NuxtLink>
      </div>

      <div class="flex justify-center mt-10 lg:hidden">
        <NuxtLink to="/blog" class="btn-cta-motion">
          Pozrieť všetky články <ArrowRight class="w-5 h-5" />
        </NuxtLink>
      </div>

    </div>
  </section>
</template>
