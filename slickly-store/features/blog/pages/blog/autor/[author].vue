<script setup lang="ts">
import { User, ArrowLeft } from 'lucide-vue-next';
import type { BlogPost } from '../../../types';

const route = useRoute();
const author = computed(() => route.params.author as string);

const { data: posts, pending } = await useAsyncData<BlogPost[]>(
  `blog-author-${author.value}`,
  () => $fetch<BlogPost[]>(`/api/blog/author/${author.value}`),
  { watch: [author] }
);

useSeoMeta({
  title: () => `Články od: ${author.value} — SLICKLY Blog`,
  description: () => `Všetky blogové články od autora ${author.value}.`,
});
</script>

<template>
  <div class="min-h-screen bg-white">

    <div class="bg-black text-white py-14 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-70"></div>
      <div class="container mx-auto px-4 lg:px-8 relative z-10">
        <NuxtLink to="/blog" class="inline-flex items-center gap-2 text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest mb-6 transition-colors font-sans">
          <ArrowLeft class="w-4 h-4" />
          SLICKLY Blog
        </NuxtLink>
        <div class="flex items-center gap-3 mb-3">
          <User class="w-5 h-5 text-brand" />
          <span class="text-brand text-xs font-bold uppercase tracking-widest font-sans">Autor</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-tech font-black uppercase italic text-white leading-none">
          {{ author }}
        </h1>
        <div class="section-decorator mt-4"></div>
        <p v-if="posts && posts.length" class="mt-4 text-gray-400 font-sans text-sm">
          {{ posts.length }} {{ posts.length === 1 ? 'článok' : 'článkov' }}
        </p>
      </div>
    </div>

    <div class="container mx-auto px-4 lg:px-8 py-16">
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="bg-gray-50 border border-gray-100 animate-pulse">
          <div class="aspect-[16/9] bg-gray-200"></div>
          <div class="p-6 space-y-3">
            <div class="h-3 bg-gray-200 w-1/3"></div>
            <div class="h-5 bg-gray-200 w-4/5"></div>
          </div>
        </div>
      </div>
      <div v-else-if="!posts?.length" class="text-center py-24">
        <User class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-400 font-sans">Žiadne články od tohto autora.</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BlogCard v-for="post in posts" :key="post.id" :post="post" />
      </div>
    </div>

  </div>
</template>
