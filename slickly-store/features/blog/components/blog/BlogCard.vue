<script setup lang="ts">
import { Calendar, ArrowRight, BookOpen } from 'lucide-vue-next';
import { proxyMediaUrl } from '~~/app/utils/media';
import type { BlogPost } from '../../types';

const props = defineProps<{
  post: BlogPost;
  featured?: boolean;
  compact?: boolean;
}>();

const blogPath = (slug: string) => `/blog/${slug}`;
const formatDate = (d: string) =>
  d ? new Date(d).toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
const badgeText = computed(() => props.post.featuredBadgeText || 'Featured');
</script>

<template>
  <article
    class="group bg-white border border-gray-100 hover:border-gray-700 transition-colors duration-200 flex flex-col"
    :class="featured ? 'lg:flex-row' : ''"
  >
    <!-- Cover image -->
    <NuxtLink
      :to="blogPath(post.slug)"
      class="block overflow-hidden relative bg-gray-100 flex-shrink-0"
      :class="featured ? 'lg:w-3/5 aspect-[4/3]' : compact ? 'aspect-[16/7]' : 'aspect-[16/9]'"
    >
      <NuxtImg
        v-if="post.coverUrl"
        :src="proxyMediaUrl(post.coverUrl)"
        :alt="post.title"
        class="w-full h-full object-cover"
        format="webp"
        :loading="featured ? 'eager' : 'lazy'"
        sizes="sm:100vw md:50vw lg:40vw"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        <BookOpen class="w-10 h-10 text-white/20" aria-hidden="true" />
      </div>

      <!-- Badges: top-left — featured (červený) pred category (čierny) -->
      <div class="absolute top-3 left-3 flex gap-1.5 flex-wrap">
        <div v-if="featured || post.featured" class="bg-brand px-3 py-1 transform -skew-x-12">
          <span class="block transform skew-x-12 text-white text-[10px] font-bold uppercase tracking-widest font-tech leading-none">
            {{ badgeText }}
          </span>
        </div>
        <div v-if="post.category" class="bg-black px-3 py-1 transform -skew-x-12">
          <span class="block transform skew-x-12 text-white text-[10px] font-bold uppercase tracking-widest font-tech leading-none">
            {{ post.category }}
          </span>
        </div>
      </div>
    </NuxtLink>

    <!-- Content -->
    <div class="p-5 flex flex-col flex-1" :class="featured ? 'lg:p-8' : ''">
      <div class="flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 font-sans gap-2">
        <Calendar class="w-3.5 h-3.5 text-brand" aria-hidden="true" />
        {{ formatDate(post.publishedAt) }}
      </div>
      <NuxtLink :to="blogPath(post.slug)">
        <h2
          class="font-tech font-black uppercase italic leading-tight mb-3 group-hover:text-brand transition-colors line-clamp-2"
          :class="featured ? 'text-2xl lg:text-3xl' : compact ? 'text-base' : 'text-xl'"
        >{{ post.title }}</h2>
      </NuxtLink>
      <p v-if="post.teaser && !compact" class="text-sm text-gray-600 font-sans leading-relaxed line-clamp-3 mb-5 flex-1">{{ post.teaser }}</p>
      <NuxtLink :to="blogPath(post.slug)" class="flex items-center text-brand font-bold text-xs uppercase tracking-widest group/link mt-auto">
        {{ featured ? 'Čítať článok' : 'Čítať viac' }}
        <ArrowRight class="ml-2 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" aria-hidden="true" />
      </NuxtLink>
    </div>
  </article>
</template>
