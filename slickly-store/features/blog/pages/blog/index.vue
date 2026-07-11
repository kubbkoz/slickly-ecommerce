<script setup lang="ts">
import { BookOpen, ArrowRight, Calendar } from 'lucide-vue-next';
import { proxyMediaUrl } from '~~/app/utils/media';
import type { BlogPost } from '../../types';

const route = useRoute();
const activeCategory = ref('');

const { data: posts, pending } = await useAsyncData<BlogPost[]>(
  `blog-listing-${(route.query.category as string) || 'all'}`,
  () => $fetch<BlogPost[]>('/api/blog/listing'),
);

const uniqueCategories = computed(() =>
  [...new Set((posts.value ?? []).map((p: BlogPost) => p.category).filter(Boolean))]
);

const filteredPosts = computed(() =>
  !activeCategory.value
    ? (posts.value ?? [])
    : (posts.value ?? []).filter((p: BlogPost) => p.category === activeCategory.value)
);

const featuredPost = computed(() =>
  filteredPosts.value.find((p: BlogPost) => p.featured) ?? filteredPosts.value[0] ?? null
);
const regularPosts = computed(() => {
  const fp = featuredPost.value;
  return fp
    ? filteredPosts.value.filter((p: BlogPost) => p.id !== fp.id)
    : filteredPosts.value.slice(1);
});

const formatDate = (d: string) =>
  d ? new Date(d).toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

useSeoMeta({
  title:       'SLICKLY Blog',
  description: 'Novinky, recenzie, tipy zo sveta starostlivosti o auto.',
  ogTitle:     'SLICKLY Blog',
  ogDescription: 'Novinky a tipy zo sveta autokozmetiky a detailingu.',
  ogType:      'website',
  ogLocale:    'sk_SK',
});
</script>

<template>
  <div class="min-h-screen bg-white">

    <!-- Hero banner -->
    <div class="bg-black text-white py-16 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-70"></div>
      <div class="absolute top-6 right-8 text-[150px] font-black text-white/[0.04] font-tech italic uppercase leading-none select-none pointer-events-none">BLOG</div>
      <div class="container mx-auto px-4 lg:px-8 relative z-10">
        <div class="flex items-center gap-3 mb-4">
          <BookOpen class="w-5 h-5 text-brand" aria-hidden="true" />
          <span class="text-brand text-xs font-bold uppercase tracking-widest font-sans">SLICKLY Blog</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-tech font-black uppercase italic text-white leading-none">
          Zo sveta <span class="text-amber">SLICKLY</span>
        </h1>
        <div class="section-decorator mt-4"></div>
      </div>
    </div>

    <div class="container mx-auto px-4 lg:px-8 py-12">

      <!-- Category filter bar -->
      <div v-if="!pending && uniqueCategories.length" class="flex flex-wrap gap-2 mb-10">
        <button
          class="transform -skew-x-12 border transition-colors"
          :class="!activeCategory
            ? 'bg-brand border-brand text-white'
            : 'bg-white border-gray-200 text-gray-600 hover:border-brand hover:text-brand'"
          @click="activeCategory = ''"
        >
          <span class="block transform skew-x-12 px-4 py-2 text-[10px] font-bold uppercase tracking-widest font-tech leading-none">
            Všetky
          </span>
        </button>
        <button
          v-for="cat in uniqueCategories"
          :key="cat"
          class="transform -skew-x-12 border transition-colors"
          :class="activeCategory === cat
            ? 'bg-brand border-brand text-white'
            : 'bg-white border-gray-200 text-gray-600 hover:border-brand hover:text-brand'"
          @click="activeCategory = cat"
        >
          <span class="block transform skew-x-12 px-4 py-2 text-[10px] font-bold uppercase tracking-widest font-tech leading-none">
            {{ cat }}
          </span>
        </button>
      </div>

      <!-- Loading skeleton -->
      <div v-if="pending" class="space-y-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-gray-50 overflow-hidden">
          <div class="aspect-[4/3] bg-gray-200 animate-pulse" />
          <div class="p-10 space-y-4">
            <div class="h-3 bg-gray-200 animate-pulse w-24" />
            <div class="h-8 bg-gray-200 animate-pulse w-3/4" />
            <div class="h-4 bg-gray-100 animate-pulse w-full" />
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="bg-gray-50">
            <div class="aspect-[4/3] bg-gray-200 animate-pulse" />
            <div class="p-5 space-y-3">
              <div class="h-2 bg-gray-100 animate-pulse w-16" />
              <div class="h-4 bg-gray-200 animate-pulse w-full" />
              <div class="h-3 bg-gray-100 animate-pulse w-4/5" />
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredPosts.length === 0" class="text-center py-24">
        <BookOpen class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-400 font-sans">Žiadne články neboli nájdené.</p>
      </div>

      <template v-else>

        <!-- Featured — image left + text right (rovnaký ako frontpage) -->
        <NuxtLink
          v-if="featuredPost"
          :to="`/blog/${featuredPost.slug}`"
          class="group grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white border border-gray-100 hover:border-gray-300 transition-colors duration-200 overflow-hidden mb-10"
        >
          <div class="aspect-[4/3] lg:aspect-auto relative bg-gray-100 max-h-[420px] overflow-hidden">
            <NuxtImg
              v-if="featuredPost.coverUrl"
              :src="proxyMediaUrl(featuredPost.coverUrl)"
              :alt="featuredPost.title"
              class="w-full h-full object-cover"
              format="webp"
              loading="eager"
              sizes="sm:100vw lg:50vw"
            />
            <div v-else class="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <BookOpen class="w-12 h-12 text-white/20" />
            </div>
          </div>
          <div class="flex flex-col justify-center p-8 lg:p-12">
            <div class="flex items-center gap-2 mb-4">
              <div v-if="featuredPost.featured" class="bg-brand px-3 py-1 transform -skew-x-12">
                <span class="block transform skew-x-12 text-white text-[10px] font-bold uppercase tracking-widest font-tech">
                  {{ featuredPost.featuredBadgeText || 'Featured' }}
                </span>
              </div>
              <div v-if="featuredPost.category" class="bg-black px-3 py-1 transform -skew-x-12">
                <span class="block transform skew-x-12 text-white text-[10px] font-bold uppercase tracking-widest font-tech">
                  {{ featuredPost.category }}
                </span>
              </div>
            </div>
            <h2 class="font-tech font-black uppercase italic text-2xl lg:text-3xl leading-tight mb-4 group-hover:text-brand transition-colors line-clamp-3">
              {{ featuredPost.title }}
            </h2>
            <p v-if="featuredPost.teaser" class="text-sm text-gray-500 font-sans leading-relaxed line-clamp-3 mb-6">
              {{ featuredPost.teaser }}
            </p>
            <div class="text-[11px] text-gray-400 font-sans">
              {{ featuredPost.author ? `${featuredPost.author} · ` : '' }}{{ formatDate(featuredPost.publishedAt) }}
            </div>
            <span class="text-sm text-black font-sans font-medium underline hover:text-brand transition-colors mt-4 self-end">
              Zobraziť článok
            </span>
          </div>
        </NuxtLink>

        <!-- Grid cards — 4 columns, vertical cards -->
        <div v-if="regularPosts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink
            v-for="post in regularPosts"
            :key="post.id"
            :to="`/blog/${post.slug}`"
            class="group bg-white border border-gray-100 hover:border-gray-300 transition-colors duration-200 flex flex-col overflow-hidden"
          >
            <div class="aspect-[4/3] relative bg-gray-100 overflow-hidden flex-shrink-0">
              <NuxtImg
                v-if="post.coverUrl"
                :src="proxyMediaUrl(post.coverUrl)"
                :alt="post.title"
                class="w-full h-full object-cover"
                format="webp"
                loading="lazy"
                sizes="sm:100vw md:50vw lg:25vw"
              />
              <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                <BookOpen class="w-8 h-8 text-gray-400" />
              </div>
              <div v-if="post.category" class="absolute top-3 left-3 bg-black px-3 py-1 transform -skew-x-12">
                <span class="block transform skew-x-12 text-white text-[9px] font-bold uppercase tracking-widest font-tech leading-none">
                  {{ post.category }}
                </span>
              </div>
            </div>
            <div class="p-5 flex flex-col flex-1">
              <div class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 font-sans flex items-center gap-1.5">
                <Calendar class="w-3 h-3 text-brand" />
                {{ formatDate(post.publishedAt) }}
              </div>
              <h3 class="font-tech font-bold text-base uppercase leading-snug mb-3 group-hover:text-brand transition-colors line-clamp-2">
                {{ post.title }}
              </h3>
              <p v-if="post.excerpt || post.teaser" class="text-sm text-gray-500 font-sans leading-relaxed line-clamp-3 mb-4 flex-1">
                {{ post.excerpt || post.teaser }}
              </p>
              <span class="text-sm text-black font-sans font-medium underline hover:text-brand transition-colors mt-auto self-end">
                Zobraziť článok
              </span>
            </div>
          </NuxtLink>
        </div>

      </template>

    </div>
  </div>
</template>
