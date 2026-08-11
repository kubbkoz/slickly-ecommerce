<script setup lang="ts">
import { BookOpen, ArrowRight } from 'lucide-vue-next';
import { proxyMediaUrl } from '~~/app/utils/media';

const { data: posts, pending } = await useAsyncData(
  'home-blog-posts',
  () => $fetch('/api/blog/listing', { query: { limit: 5 } }).catch(() => [])
);

const featuredPost = computed(() => (posts.value as any[])?.find((p: any) => p.featured) ?? (posts.value as any[])?.[0] ?? null);
const gridPosts = computed(() => {
  const all = (posts.value as any[]) ?? [];
  const featured = featuredPost.value;
  return featured ? all.filter((p: any) => p.id !== featured.id).slice(0, 4) : all.slice(1, 5);
});

const formatDate = (d: string) =>
  d ? new Date(d).toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

const { target, isVisible } = useScrollReveal();
</script>

<template>
  <section v-if="pending || (posts && (posts as any[]).length)" ref="target" class="py-24 bg-gray-50 border-t border-gray-100">
    <div class="container mx-auto px-4 lg:px-8">

      <div class="reveal-base mb-12" :class="isVisible ? 'reveal-visible' : 'reveal'">
        <h2 class="section-h2 mb-4">
          SLICKLY <span class="text-brand">Blog</span>
        </h2>
        <div class="section-decorator mb-6"></div>
      </div>

      <!-- Skeleton -->
      <div v-if="pending" class="space-y-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="aspect-[4/3] bg-gray-200 animate-pulse rounded-default" />
          <div class="space-y-4 py-4">
            <div class="h-3 bg-gray-200 animate-pulse w-24" />
            <div class="h-8 bg-gray-200 animate-pulse w-3/4" />
            <div class="h-4 bg-gray-100 animate-pulse w-full" />
            <div class="h-4 bg-gray-100 animate-pulse w-2/3" />
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="flex gap-4">
            <div class="w-24 h-20 bg-gray-200 animate-pulse flex-shrink-0 rounded-default" />
            <div class="flex-1 space-y-2 py-1">
              <div class="h-2 bg-gray-100 animate-pulse w-16" />
              <div class="h-3 bg-gray-200 animate-pulse w-full" />
              <div class="h-3 bg-gray-200 animate-pulse w-4/5" />
            </div>
          </div>
        </div>
      </div>

      <div v-else class="space-y-8">

        <!-- Featured article — image left + text right -->
        <NuxtLink
          v-if="featuredPost"
          :to="`/blog/${featuredPost.slug}`"
          class="group card-surface grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden"
        >
          <div class="aspect-[4/3] lg:aspect-auto relative bg-gray-100 max-h-[340px] overflow-hidden">
            <NuxtImg
              v-if="featuredPost.coverUrl"
              :src="proxyMediaUrl(featuredPost.coverUrl)"
              :alt="featuredPost.title"
              class="w-full h-full object-cover"
              format="webp"
              loading="lazy"
              sizes="sm:100vw lg:50vw"
            />
            <div v-else class="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <BookOpen class="w-12 h-12 text-white/20" />
            </div>
          </div>
          <div class="flex flex-col justify-center p-8 lg:p-12">
            <div class="flex items-center gap-2 mb-4">
              <div v-if="featuredPost.featured" class="bg-brand rounded-sm px-3 py-1">
                <span class="block text-white text-[10px] font-bold uppercase tracking-widest font-tech">
                  {{ featuredPost.featuredBadgeText || 'Featured' }}
                </span>
              </div>
              <div v-if="featuredPost.category" class="bg-black rounded-sm px-3 py-1">
                <span class="block text-white text-[10px] font-bold uppercase tracking-widest font-tech">
                  {{ featuredPost.category }}
                </span>
              </div>
            </div>
            <h3 class="font-tech font-black uppercase italic text-3xl lg:text-4xl leading-tight mb-4 group-hover:text-brand transition-colors line-clamp-3">
              {{ featuredPost.title }}
            </h3>
            <p v-if="featuredPost.teaser || featuredPost.excerpt" class="text-sm text-gray-500 font-sans leading-relaxed line-clamp-3 mb-6">
              {{ featuredPost.teaser || featuredPost.excerpt }}
            </p>
            <div class="text-[11px] text-gray-400 font-sans">
              {{ featuredPost.author ? `${featuredPost.author} · ` : '' }}{{ formatDate(featuredPost.publishedAt) }}
            </div>
          </div>
        </NuxtLink>

        <!-- 4-column grid — small cards (image left + text right) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink
            v-for="post in gridPosts"
            :key="post.id"
            :to="`/blog/${post.slug}`"
            class="group card-surface flex gap-4 p-4"
          >
            <div class="w-24 h-20 flex-shrink-0 bg-gray-100 overflow-hidden rounded-default">
              <NuxtImg
                v-if="post.coverUrl"
                :src="proxyMediaUrl(post.coverUrl)"
                :alt="post.title"
                class="w-full h-full object-cover"
                format="webp"
                loading="lazy"
                sizes="96px"
              />
              <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                <BookOpen class="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div class="flex flex-col justify-center flex-1 min-w-0">
              <div v-if="post.category" class="text-[9px] font-bold uppercase tracking-[0.15em] text-brand mb-1.5 font-tech">
                {{ post.category }}
              </div>
              <h4 class="font-tech font-bold uppercase text-xs leading-tight group-hover:text-brand transition-colors line-clamp-2 mb-1">
                {{ post.title }}
              </h4>
              <div class="text-[10px] text-gray-400 font-sans mb-1.5">
                {{ formatDate(post.publishedAt) }}
              </div>
              <span class="text-[11px] text-black font-sans font-medium underline hover:text-brand transition-colors">
                Zobraziť článok
              </span>
            </div>
          </NuxtLink>
        </div>

        <div class="flex justify-end mt-8">
          <NuxtLink
            to="/blog"
            class="btn-cta-motion"
          >
            Pozrieť všetky články <ArrowRight class="w-5 h-5" />
          </NuxtLink>
        </div>

      </div>
    </div>
  </section>
</template>
