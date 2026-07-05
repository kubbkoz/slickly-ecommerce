<script setup lang="ts">
import { ChevronLeft, ChevronRight, Plus, ArrowRight } from 'lucide-vue-next';
import { HERO_SLIDES } from '~/utils/constants';
import type { Slide, Hotspot } from '~/types';

const props = withDefaults(defineProps<{
  slides?: Slide[]
}>(), {
  slides: () => HERO_SLIDES
});

// Build slides with fallback to static constants if empty
const translatedSlides = computed(() => {
    if (!props.slides || props.slides.length === 0) {
        return HERO_SLIDES;
    }
    return props.slides;
});

// Static UI text
const viacInfoLabel = computed(() => 'Viac info');

// ─── Slider Logic ─────────────────────────────────────────────────────────────
const currentSlide = ref(0);
const activeHotspot = ref<string | null>(null);
const slideTimer = ref<NodeJS.Timeout | null>(null);

const slide = computed(() => translatedSlides.value[currentSlide.value]);


const goToSlide = (idx: number) => {
  if (!translatedSlides.value?.length) return;
  const target = (idx + translatedSlides.value.length) % translatedSlides.value.length;
  currentSlide.value = target;
  activeHotspot.value = null;
};

const nextSlide = () => goToSlide(currentSlide.value + 1);
const prevSlide = () => goToSlide(currentSlide.value - 1);

const handleHotspotEnter = (id: string) => {
    activeHotspot.value = id;
};
const handleHotspotLeave = () => {
    activeHotspot.value = null;
};

onMounted(() => {
  slideTimer.value = setInterval(() => {
    if (!activeHotspot.value) {
      nextSlide();
    }
  }, 6000);
});

onUnmounted(() => {
  if (slideTimer.value) clearInterval(slideTimer.value);
});

// ─── LCP + hero-slide preload ───────────────────────────────────────────────
// Hero používa CSS background-image (kvôli ORB), takže fetchpriority na <img>
// nejde. Preload cez <link rel=preload> — browser ho dedupne s background-image.
// PRVÝ slide = LCP → fetchpriority HIGH (načíta sa okamžite).
// OSTATNÉ slidy = fetchpriority LOW (načítajú sa na pozadí, mimo kritickej cesty)
// → keď carousel rotuje, obrázok je už v cache a dekódovaný, takže neseká.
const encodeImg = (img: string | undefined) => {
  if (!img || img.startsWith('data:')) return '';
  return img.replace(/ /g, '%20').replace(/'/g, '%27');
};

useHead(computed(() => {
  const slides = translatedSlides.value || [];
  const links = slides
    .map((s, i) => {
      const href = encodeImg(s?.image);
      if (!href) return null;
      return {
        rel: 'preload',
        as: 'image',
        href,
        // prvý = high (LCP), ostatné = low (background, mimo kritickej cesty)
        fetchpriority: i === 0 ? 'high' : 'low',
      };
    })
    .filter(Boolean);
  return { link: links as any[] };
}));
</script>

<template>
  <div 
    class="relative w-full overflow-hidden bg-black text-white"
    style="height: calc(100svh - var(--navbar-height-unscrolled, 169px))"
  >
      <!-- Background Images -->
      <div class="absolute inset-0">
        <Transition name="slide-fade">
          <div :key="slide?.id || currentSlide" class="absolute inset-0 overflow-hidden">
            <!-- 
              Using CSS background-image instead of <img> tag to bypass Chrome's ORB
              (Opaque Response Blocking) which blocks cross-origin /thumbnail/ PNG requests
              in dev mode (localhost). CSS background images are NOT subject to ORB/CORS.
            -->
            <div
              class="absolute inset-0 w-full h-full bg-center bg-cover"
              :style="slide?.image ? { backgroundImage: `url('${slide.image.replace(/ /g, '%20').replace(/'/g, '%27')}')` } : {}"
              role="img"
              :aria-label="slide?.title || 'Hero Image'"
            ></div>
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-black/40 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"></div>
          </div>
        </Transition>
      </div>

      <!-- Content -->
      <div class="relative container mx-auto px-4 lg:px-8 h-full flex flex-col justify-center z-20">
        <Transition name="hero-fade" mode="out-in">
          <div :key="slide?.id || currentSlide" class="max-w-3xl pl-4 md:pl-0 border-l-4 border-brand md:border-0 relative">
            <div v-if="slide?.badge" class="inline-block bg-amber rounded-sm px-3 py-1 md:px-4 md:py-1.5 mb-3 md:mb-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-black font-tech">
              {{ slide.badge }}
            </div>
            <h1 class="text-3xl sm:text-4xl md:text-6xl font-black mb-2 md:mb-4 leading-[0.9] uppercase italic font-tech tracking-wide break-words">
              {{ slide?.title }}
            </h1>
            <p class="text-sm sm:text-base md:text-lg text-gray-200 mb-6 md:mb-8 max-w-lg font-normal leading-relaxed font-sans line-clamp-3 md:line-clamp-none">
              {{ slide?.subtitle }}
            </p>
            <div class="flex flex-col sm:flex-row gap-3">
              <NuxtLink
                :to="slide?.ctaLink || '#'"
                class="inline-flex items-center justify-center gap-3 bg-amber hover:bg-amber-dark text-black font-tech font-bold uppercase tracking-widest text-sm px-8 py-4 transition-colors w-full sm:w-auto rounded-default"
              >
                {{ slide?.cta }} <ArrowRight class="w-5 h-5" />
              </NuxtLink>
              <NuxtLink
                v-if="slide?.secondaryCta"
                :to="slide?.secondaryCtaLink || '#'"
                class="inline-flex items-center justify-center gap-3 bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-tech font-bold uppercase tracking-widest text-sm px-8 py-4 transition-colors w-full sm:w-auto rounded-default"
              >
                {{ slide?.secondaryCta }}
              </NuxtLink>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Hotspots -->
      <div v-if="slide && slide.hotspots && slide.hotspots.length > 0" class="absolute inset-0 z-20 pointer-events-none hidden lg:block">
          <div
              v-for="spot in slide.hotspots"
              :key="spot.id"
              class="absolute pointer-events-auto"
              :style="{ top: `${spot.y}%`, left: `${spot.x}%` }"
              @mouseenter="handleHotspotEnter(spot.id)"
              @mouseleave="handleHotspotLeave"
            >
              <!-- The Dot -->
              <button 
                class="relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 pointer-events-auto"
                :class="activeHotspot === spot.id ? 'bg-brand scale-110' : 'bg-white/20 backdrop-blur-sm hover:bg-brand/80'"
                :aria-label="`Zobraziť detail produktu ${spot.label || ''}`.trim()"
                :aria-expanded="activeHotspot === spot.id"
              >
                <div class="absolute inset-0 rounded-full border-2 border-white animate-pulse-slow"></div>
                <Plus class="w-4 h-4 text-white" aria-hidden="true" />
              </button>

              <!-- The Tooltip -->
              <div 
                class="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-96 bg-black/90 backdrop-blur-md p-4 shadow-2xl border-l-4 border-brand transition-all duration-300 origin-left pointer-events-auto flex gap-4"
                :class="activeHotspot === spot.id ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'"
                style="z-index: 100;"
              >
                <!-- Product Image -->
                <div v-if="spot.image" class="w-24 h-24 flex-shrink-0 bg-white p-1 rounded-sm">
                    <img
                      :src="spot.image"
                      :alt="spot.label"
                      width="96"
                      height="96"
                      loading="lazy"
                      class="w-full h-full object-contain"
                      referrerpolicy="no-referrer"
                      @error="(e) => console.error('Hotspot image failed:', spot.image, e)"
                    />
                </div>

                <div class="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 class="text-white font-bold text-lg mb-1 font-tech uppercase leading-tight line-clamp-2">{{ spot.label }}</h3>
                    <div class="flex items-center justify-between border-t border-gray-700 pt-2 mt-auto">
                        <span class="text-white font-black text-lg font-tech underline decoration-brand decoration-2 underline-offset-4">{{ spot.price }}</span>
                        <NuxtLink 
                            v-if="spot.link"
                            :to="spot.link" 
                            class="text-[10px] bg-white/10 hover:bg-white/20 px-3 py-1 text-white uppercase tracking-wider transition-colors font-sans rounded"
                        >
                            Viac info
                        </NuxtLink>
                    </div>
                </div>
              </div>
          </div>
      </div>

      <!-- Controls -->
      <div class="absolute bottom-10 right-10 flex gap-2 z-30">
        <button 
          @click.stop="prevSlide"
          class="w-14 h-14 border border-white/30 hover:bg-brand hover:border-brand flex items-center justify-center transition-all text-white bg-black/50 backdrop-blur-sm rounded-default cursor-pointer"
          aria-label="Predchádzajúca snímka"
        >
          <ChevronLeft class="w-8 h-8 pointer-events-none" aria-hidden="true" />
        </button>
        <button 
          @click.stop="nextSlide"
          class="w-14 h-14 border border-white/30 hover:bg-brand hover:border-brand flex items-center justify-center transition-all text-white bg-black/50 backdrop-blur-sm rounded-default cursor-pointer"
          aria-label="Nasledujúca snímka"
        >
          <ChevronRight class="w-8 h-8 pointer-events-none" aria-hidden="true" />
        </button>
      </div>

      <!-- Indicators -->
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
        <button
            v-for="(_, idx) in translatedSlides"
            :key="idx"
            @click.stop="goToSlide(idx)"
            class="h-1.5 transition-all duration-300 rounded-sm cursor-pointer"
            :class="currentSlide === idx ? 'w-16 bg-brand' : 'w-8 bg-white/40 hover:bg-white'"
            :aria-label="`Prejsť na snímku ${idx + 1}`"
            :aria-current="currentSlide === idx ? 'true' : 'false'"
        ></button>
      </div>
  </div>
</template>

<style scoped>
/* Background image crossfade — pure opacity, compositor-only (GPU 120Hz safe) */
.slide-fade-enter-active {
  transition: opacity 0.8s ease;
  will-change: opacity;
}
.slide-fade-leave-active {
  transition: opacity 0.6s ease;
  will-change: opacity;
  position: absolute;
  inset: 0;
}
.slide-fade-enter-from,
.slide-fade-leave-to { opacity: 0; }

/* Content crossfade — mode="out-in", clean and instant */
.hero-fade-enter-active { transition: opacity 0.3s ease; }
.hero-fade-leave-active { transition: opacity 0.18s ease; }
.hero-fade-enter-from,
.hero-fade-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .slide-fade-enter-active,
  .slide-fade-leave-active,
  .hero-fade-enter-active,
  .hero-fade-leave-active { transition-duration: 0.01ms !important; }
}
</style>
