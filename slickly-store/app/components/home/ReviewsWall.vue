<script setup lang="ts">
import { ExternalLink, ArrowRight } from 'lucide-vue-next';
import RatingStars from '~/components/ui/RatingStars.vue';

const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Google&query_place_id=ChIJ1f4ccNbJFUcRUbCbvaArmfw';

interface Review {
  author: string;
  photo: string | null;
  rating: number;
  text: string;
  date: string;
}
interface ReviewsData {
  rating: number;
  totalReviews: number;
  reviews: Review[];
}

const { data, pending } = useAsyncData<ReviewsData>(
  'google-reviews',
  () => $fetch<ReviewsData>('/api/google/reviews').catch(() => ({ rating: 0, totalReviews: 0, reviews: [] })),
  { getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key] }
);

const reviews     = computed(() => data.value?.reviews ?? []);
const rating      = computed(() => data.value?.rating ?? 0);
const total       = computed(() => data.value?.totalReviews ?? 0);
const hasReviews = computed(() => reviews.value.length > 0);

// Photo error tracking
const photoErrors = ref<Record<number, boolean>>({});
const onPhotoError = (idx: number) => { photoErrors.value[idx] = true; };
const showPhoto = (idx: number, photo: string | null) => !!photo && !photoErrors.value[idx];

// AggregateRating JSON-LD
watchEffect(() => {
  if (!rating.value) return;
  useHead({
    script: [{
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BikeStore',
        name: 'SLICKLY',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: rating.value,
          reviewCount: total.value,
          bestRating: 5,
          worstRating: 1,
        },
      }),
    }],
  });
});
</script>

<template>
  <section class="py-24 bg-gray-50 border-t border-gray-100 min-h-[300px]">
    <div class="container mx-auto px-4 lg:px-8">

      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <h2 class="section-h2 mb-4">
            Čo hovoria <span class="text-brand">zákazníci</span>
          </h2>
          <div class="section-decorator mb-6"></div>
        </div>

        <!-- Aggregate badge (len keď máme dáta) -->
        <a
          v-if="hasReviews"
          :href="MAPS_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-3 group flex-shrink-0"
          aria-label="Pozrieť všetky recenzie na Google"
        >
          <RatingStars :rating="rating" size-class="w-5 h-5" />
          <div class="text-right">
            <span class="block font-tech font-black text-2xl text-black leading-none">
              {{ rating.toFixed(1) }}
            </span>
            <span class="block text-[10px] uppercase tracking-widest text-gray-400 font-sans whitespace-nowrap">
              {{ total }} recenzií · Google
            </span>
          </div>
          <ExternalLink class="w-4 h-4 text-gray-300 group-hover:text-brand transition-colors" aria-hidden="true" />
        </a>
      </div>

      <!-- Skeleton -->
      <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div
          v-for="i in 5"
          :key="`rev-skeleton-${i}`"
          class="bg-white border border-gray-100 p-6 flex flex-col gap-4 rounded-default"
        >
          <div class="flex gap-1">
            <div v-for="s in 5" :key="s" class="w-4 h-4 bg-gray-200 animate-pulse rounded-full" />
          </div>
          <div class="space-y-2 flex-1">
            <div class="h-3 bg-gray-100 animate-pulse w-full" />
            <div class="h-3 bg-gray-100 animate-pulse w-5/6" />
            <div class="h-3 bg-gray-100 animate-pulse w-4/6" />
          </div>
          <div class="flex items-center gap-3 pt-4 border-t border-gray-50">
            <div class="w-9 h-9 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
            <div class="space-y-1 flex-1">
              <div class="h-3 bg-gray-200 animate-pulse w-24" />
              <div class="h-2 bg-gray-100 animate-pulse w-16" />
            </div>
          </div>
        </div>
      </div>

      <!-- Real reviews -->
      <div v-else-if="hasReviews">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <article
            v-for="(review, idx) in reviews"
            :key="idx"
            class="review-card bg-white border border-gray-100 p-6 flex flex-col gap-4 relative transition-colors duration-200 rounded-default"
          >
            <RatingStars :rating="review.rating" size-class="w-4 h-4" />
            <p class="font-sans text-sm text-gray-600 leading-relaxed line-clamp-5 flex-1">
              {{ review.text }}
            </p>
            <div class="flex items-center gap-3 mt-auto pt-4 border-t border-gray-50">
              <img
                v-if="showPhoto(idx, review.photo)"
                :src="review.photo!"
                :alt="review.author"
                class="w-9 h-9 rounded-full object-cover flex-shrink-0"
                loading="lazy"
                width="36"
                height="36"
                referrerpolicy="no-referrer"
                crossorigin="anonymous"
                @error="onPhotoError(idx)"
              />
              <div
                v-else
                class="w-9 h-9 rounded-full bg-brand flex items-center justify-center flex-shrink-0"
                aria-hidden="true"
              >
                <span class="text-white text-sm font-tech font-bold">
                  {{ review.author.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div class="min-w-0 flex-1">
                <span class="block font-tech font-bold uppercase text-xs text-black tracking-wide truncate">
                  {{ review.author }}
                </span>
                <span class="block text-[10px] text-gray-400 uppercase tracking-wider font-sans">
                  {{ review.date }}
                </span>
              </div>
            </div>
          </article>
        </div>

        <div class="flex justify-end mt-8">
          <a
            :href="MAPS_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-3 bg-black hover:bg-black/80 text-white font-tech font-bold uppercase tracking-widest text-sm px-8 py-4 transition-colors rounded-default"
          >
            Pozrieť recenzie na Google <ArrowRight class="w-5 h-5" />
          </a>
        </div>
      </div>

      <!-- Fallback keď API zlyhalo alebo 0 recenzií -->
      <div v-else class="flex justify-end py-8">
        <a
          :href="MAPS_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-3 bg-black hover:bg-black/80 text-white font-tech font-bold uppercase tracking-widest text-sm px-8 py-4 transition-colors rounded-default"
        >
          Pozrieť recenzie na Google <ArrowRight class="w-5 h-5" />
        </a>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Hover — tmavšia šedá border */
.review-card:hover {
  border-color: #9ca3af; /* tailwind gray-400 */
}
</style>
