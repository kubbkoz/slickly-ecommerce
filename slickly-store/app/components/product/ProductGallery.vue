<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { X, ChevronDown, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-vue-next';
import { type Product } from '~/types';
import { badgeSizeClass, type Badge } from '~/composables/useProductBadges';

const props = withDefaults(defineProps<{
  product: Product;
  activeImage: string;
  galleryImages: string[];
  imageBadges?: Badge[];
}>(), {
  imageBadges: () => [] as Badge[],
});

const emit = defineEmits<{
  (e: 'update:activeImage', img: string): void;
  (e: 'update:galleryImages', imgs: string[]): void;
}>();

// ─── SSR-SAFE: All image data comes from props (resolved server-side) ─────────
const allMedia = computed<string[]>(() => {
  const fromGallery = props.galleryImages.length > 0
    ? props.galleryImages
    : props.activeImage ? [props.activeImage] : [];
  return [...new Set(fromGallery)].filter(Boolean);
});

const firstImage = computed(() => allMedia.value[0] || '');
const gridImages = computed(() => allMedia.value.slice(1));

// ─── Desktop grid expand/collapse ────────────────────────────────────────────
const isExpanded = ref(false);
const displayedGridImages = computed(() =>
  isExpanded.value ? gridImages.value : gridImages.value.slice(0, 4)
);
const hasHiddenImages = computed(() => gridImages.value.length > 4);

const toggleExpand = async () => {
  if (isExpanded.value) {
    const target = document.getElementById('gallery-toggle-area');
    isExpanded.value = false;
    await nextTick();
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    isExpanded.value = true;
  }
};

// ─── Mobile Carousel ──────────────────────────────────────────────────────────
const mobileCarouselRef = ref<HTMLElement | null>(null);
const currentSlide = ref(0);
const handleScroll = (e: Event) => {
  const el = e.target as HTMLElement;
  currentSlide.value = Math.round(el.scrollLeft / el.clientWidth);
};
const scrollToSlide = (idx: number) => {
  if (!mobileCarouselRef.value) return;
  mobileCarouselRef.value.scrollTo({ left: mobileCarouselRef.value.clientWidth * idx, behavior: 'smooth' });
  currentSlide.value = idx;
};

// ─── Desktop Point Zoom (grid images) ────────────────────────────────────────
const handleZoomMove = (e: MouseEvent) => {
  const container = e.currentTarget as HTMLElement;
  if (!container) return;
  const rect = container.getBoundingClientRect();
  container.style.setProperty('--x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
  container.style.setProperty('--y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
};

// ─── Skeleton loader ──────────────────────────────────────────────────────────
const imageLoaded = ref<Record<number, boolean>>({});
const onImageLoad = (idx: number) => { imageLoaded.value[idx] = true; };

// ─── Discount badge ───────────────────────────────────────────────────────────
const discount = computed(() => {
  const oldPrice = Number((props.product as any).oldPrice);
  const price    = Number((props.product as any).price);
  return (oldPrice && price) ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
});

// ─── Fullscreen Lightbox ──────────────────────────────────────────────────────
const isFullscreenOpen = ref(false);
const currentFsIndex   = ref(0);
const fsImageLoaded    = ref<Record<number, boolean>>({});
const fsThumbnailsRef  = ref<HTMLElement | null>(null);

// Zoom state
const isZoomed    = ref(false);
const zoomOriginX = ref(50);
const zoomOriginY = ref(50);

const openFullscreen = (index: number) => {
  currentFsIndex.value = index;
  isZoomed.value = false;
  isFullscreenOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeFullscreen = () => {
  isFullscreenOpen.value = false;
  isZoomed.value = false;
  document.body.style.overflow = '';
};

const goToImage = (idx: number) => {
  isZoomed.value = false;
  currentFsIndex.value = (idx + allMedia.value.length) % allMedia.value.length;
};
const prevImage = () => goToImage(currentFsIndex.value - 1);
const nextImage = () => goToImage(currentFsIndex.value + 1);

// Zoom click — first click zooms in at cursor position, second click zooms out
const handleFsZoomClick = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();
  if (!isZoomed.value) {
    zoomOriginX.value = ((e.clientX - rect.left) / rect.width) * 100;
    zoomOriginY.value = ((e.clientY - rect.top)  / rect.height) * 100;
    isZoomed.value = true;
  } else {
    isZoomed.value = false;
  }
};

// Panning when zoomed
const handleFsMouseMove = (e: MouseEvent) => {
  if (!isZoomed.value) return;
  const el = e.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();
  zoomOriginX.value = ((e.clientX - rect.left) / rect.width) * 100;
  zoomOriginY.value = ((e.clientY - rect.top)  / rect.height) * 100;
};

// Touch swipe
const touchStartX = ref(0);
const handleTouchStart = (e: TouchEvent) => { touchStartX.value = e.touches[0].clientX; };
const handleTouchEnd   = (e: TouchEvent) => {
  if (isZoomed.value) return;
  const diff = touchStartX.value - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) diff > 0 ? nextImage() : prevImage();
};

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (!isFullscreenOpen.value) return;
  if (e.key === 'ArrowRight') nextImage();
  else if (e.key === 'ArrowLeft') prevImage();
  else if (e.key === 'Escape') { if (isZoomed.value) isZoomed.value = false; else closeFullscreen(); }
};

// Scroll active thumbnail into view when image changes
watch(currentFsIndex, async () => {
  await nextTick();
  const container = fsThumbnailsRef.value;
  if (!container) return;
  const thumb = container.children[currentFsIndex.value] as HTMLElement | undefined;
  thumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
});

onMounted(() => { window.addEventListener('keydown', handleKeydown); });
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});

</script>

<template>
  <div class="w-full" role="region" aria-label="Galéria produktu">

    <!-- ─── MOBILE GALLERY ──────────────────────────────────────────────────── -->
    <div class="lg:hidden relative w-full flex flex-col bg-white border-b border-gray-100 pb-3">

      <div
        ref="mobileCarouselRef"
        class="relative w-full aspect-[4/5] sm:aspect-square bg-[#f7f9fa] flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar [touch-action:pan-x_pan-y] rounded-default"
        @scroll="handleScroll"
      >
        <div
          v-for="(img, idx) in allMedia"
          :key="idx"
          class="flex-shrink-0 w-full h-full snap-center relative"
          @click="openFullscreen(idx)"
        >
          <div v-if="!imageLoaded[idx]" class="absolute inset-0 bg-gray-100 animate-pulse" />
          <div class="absolute inset-0 p-1 md:p-2 flex items-center justify-center">
            <NuxtImg
              :src="img"
              class="w-full h-full object-contain mix-blend-multiply cursor-custom-zoom"
              format="webp"
              :loading="idx === 0 ? 'eager' : 'lazy'"
              :fetchpriority="idx === 0 ? 'high' : 'auto'"
              referrerpolicy="no-referrer"
              @load="onImageLoad(idx)"
            />
          </div>
        </div>

        <!-- Mobile swipe dots indicator (signals carousel is swipeable) -->
        <div
          v-if="allMedia.length > 1"
          class="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 pointer-events-none z-10"
          aria-hidden="true"
        >
          <span
            v-for="(_, idx) in allMedia"
            :key="`dot-${idx}`"
            class="h-[3px] transition-all duration-200"
            :class="currentSlide === idx ? 'w-5 bg-brand' : 'w-1.5 bg-gray-300'"
          />
        </div>
      </div>

      <!-- Mobile thumbnails -->
      <div v-if="allMedia.length > 1" class="flex gap-2 overflow-x-auto hide-scrollbar px-4 pt-3 pb-1 mt-1 scroll-smooth snap-x">
        <button
          v-for="(img, idx) in allMedia"
          :key="idx"
          @click="scrollToSlide(idx)"
          class="flex-shrink-0 snap-center w-16 h-16 bg-[#f7f9fa] border transition-all duration-200 flex items-center justify-center p-2 focus:outline-none rounded-default"
          :class="currentSlide === idx ? 'border-brand shadow-sm' : 'border-gray-200 opacity-60 hover:opacity-100'"
          :aria-label="`Zobraziť obrázok ${idx + 1}`"
        >
          <NuxtImg :src="img" class="w-full h-full mix-blend-multiply" :class="idx === 0 ? 'object-contain' : 'object-cover'" format="webp" loading="lazy" referrerpolicy="no-referrer" />
        </button>
      </div>

      <!-- Mobile custom PDP badges (pdpPosition='image') — top-left of hero -->
      <div
        v-if="imageBadges.length"
        class="absolute top-3 left-3 flex flex-row flex-wrap gap-1 z-20 pointer-events-none max-w-[calc(100%-1.5rem)]"
      >
        <span
          v-for="badge in imageBadges"
          :key="badge.id"
          :class="['font-bold uppercase tracking-wider leading-none font-tech shadow-sm', badgeSizeClass(badge.size)]"
          :style="{ backgroundColor: badge.bgColor, color: badge.textColor }"
        >{{ badge.text }}</span>
      </div>

    </div>

    <!-- ─── DESKTOP GALLERY ──────────────────────────────────────────────────── -->
    <div class="hidden lg:block">

      <!-- Hero image -->
      <div
        class="relative w-full bg-[#f7f9fa] overflow-hidden group aspect-square rounded-default
               [@media(min-width:1200px)_and_(max-width:1536px)]:aspect-[4/3]"
      >
        <div v-if="!imageLoaded[0] && firstImage" class="absolute inset-0 bg-gray-200 animate-pulse" aria-hidden="true" />

        <NuxtImg
          v-if="firstImage"
          :src="firstImage"
          :alt="`${product.name} — hlavný pohľad`"
          class="absolute inset-0 w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105 cursor-custom-zoom"
          format="webp"
          loading="eager"
          fetchpriority="high"
          referrerpolicy="no-referrer"
          @load="onImageLoad(0)"
          @click="openFullscreen(0)"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <span class="text-6xl font-tech uppercase opacity-20">{{ product.name }}</span>
        </div>

        <!-- Custom PDP badges (pdpPosition='image') — top-left of hero, side-by-side -->
        <div
          v-if="imageBadges.length"
          class="absolute top-4 left-4 flex flex-row flex-wrap gap-1.5 z-20 pointer-events-none max-w-[calc(100%-2rem)]"
        >
          <span
            v-for="badge in imageBadges"
            :key="badge.id"
            :class="['font-bold uppercase tracking-wider leading-none font-tech shadow-sm', badgeSizeClass(badge.size)]"
            :style="{ backgroundColor: badge.bgColor, color: badge.textColor }"
          >{{ badge.text }}</span>
        </div>

        <!-- Zoom hint badge -->
        <div class="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/40 text-white px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <ZoomIn class="w-3.5 h-3.5" />
          <span class="text-[10px] font-bold uppercase tracking-widest font-sans">Zväčšiť</span>
        </div>

      </div>

      <!-- Grid images 2-n -->
      <div v-if="gridImages.length > 0" class="relative">
        <div class="grid grid-cols-2 gap-[1px] mt-[1px]">
          <div
            v-for="(img, idx) in displayedGridImages"
            :key="idx"
            class="relative aspect-square overflow-hidden group cursor-custom-zoom rounded-default"
            @click="openFullscreen(idx + 1)"
            @mousemove="handleZoomMove"
          >
            <div v-if="!imageLoaded[idx + 1]" class="absolute inset-0 bg-gray-100 animate-pulse" aria-hidden="true" />
            <NuxtImg
              :src="img"
              :alt="`${product.name} — pohľad ${idx + 2}`"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-150"
              style="transform-origin: var(--x, 50%) var(--y, 50%)"
              :class="{ 'opacity-0': !imageLoaded[idx + 1], 'opacity-100 transition-opacity duration-500': imageLoaded[idx + 1] }"
              format="webp"
              loading="lazy"
              referrerpolicy="no-referrer"
              @load="onImageLoad(idx + 1)"
            />
          </div>
          <div v-if="displayedGridImages.length % 2 !== 0" class="aspect-square" aria-hidden="true" />
        </div>

        <div
          v-if="hasHiddenImages"
          id="gallery-toggle-area"
          class="absolute left-0 right-0 z-20 flex justify-center -bottom-8"
        >
          <button
            @click="toggleExpand"
            class="bg-white text-black px-10 py-5 font-bold text-sm tracking-widest uppercase flex items-center justify-center transition-all hover:bg-black hover:text-white font-sans group border border-black rounded-default"
          >
            {{ isExpanded ? 'Zobraziť menej' : 'Zobraziť viac' }}
            <ChevronDown class="w-4 h-4 ml-3 transition-transform duration-300" :class="isExpanded ? 'rotate-180' : 'group-hover:translate-y-0.5'" />
          </button>
        </div>
      </div>

    </div>

    <!-- ─── FULLSCREEN LIGHTBOX ───────────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isFullscreenOpen"
          class="fixed inset-0 z-[200] bg-white flex flex-col gpu-boost"
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen galéria"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-5 md:px-8 py-4 flex-shrink-0 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <span class="font-tech font-bold text-black text-sm tracking-widest">
                {{ currentFsIndex + 1 }}<span class="text-gray-300 mx-1">/</span>{{ allMedia.length }}
              </span>
              <span class="hidden md:flex items-center gap-1.5 text-gray-400 text-[10px] font-sans uppercase tracking-widest">
                <ZoomIn class="w-3 h-3" /> Kliknúť pre zoom
              </span>
            </div>
            <button
              @click="closeFullscreen"
              class="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black transition-colors"
              aria-label="Zatvoriť galériu (Esc)"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Main image area -->
          <div
            class="flex-1 relative flex items-center justify-center overflow-hidden min-h-0"
            @touchstart.passive="handleTouchStart"
            @touchend.passive="handleTouchEnd"
          >
            <!-- Prev arrow -->
            <button
              v-if="allMedia.length > 1"
              @click.stop="prevImage"
              class="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-white border border-gray-200 hover:border-brand hover:bg-brand hover:text-white text-gray-700 shadow-sm transition-all duration-200 gpu-boost"
              aria-label="Predchádzajúci obrázok (←)"
              data-arrow="prev"
            >
              <ChevronLeft class="w-5 h-5" />
            </button>

            <!-- Image with zoom -->
            <div
              class="w-full h-full flex items-center justify-center overflow-hidden px-14 md:px-16"
              :class="isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'"
              @click="handleFsZoomClick"
              @mousemove="handleFsMouseMove"
            >
              <Transition
                enter-active-class="transition-opacity duration-150"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                mode="out-in"
              >
                <NuxtImg
                  :key="currentFsIndex"
                  :src="allMedia[currentFsIndex]"
                  :alt="`${product.name} — ${currentFsIndex + 1}`"
                  class="max-w-full max-h-full object-contain select-none will-change-transform"
                  :style="isZoomed
                    ? `transform: scale(2.2); transform-origin: ${zoomOriginX}% ${zoomOriginY}%; transition: transform-origin 0s`
                    : 'transform: scale(1); transition: transform 0.2s ease'"
                  format="webp"
                  loading="eager"
                  referrerpolicy="no-referrer"
                />
              </Transition>
            </div>

            <!-- Next arrow -->
            <button
              v-if="allMedia.length > 1"
              @click.stop="nextImage"
              class="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-white border border-gray-200 hover:border-brand hover:bg-brand hover:text-white text-gray-700 shadow-sm transition-all duration-200 gpu-boost"
              aria-label="Nasledujúci obrázok (→)"
            >
              <ChevronRight class="w-6 h-6" />
            </button>

            <!-- Mobile swipe indicator (only if multiple images) -->
            <div v-if="allMedia.length > 1" class="md:hidden absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
              <div
                v-for="(_, idx) in allMedia"
                :key="idx"
                class="h-[3px] transition-all duration-200"
                :class="currentFsIndex === idx ? 'w-5 bg-brand' : 'w-1.5 bg-gray-300'"
              />
            </div>
          </div>

          <!-- Thumbnail strip -->
          <div class="border-t border-gray-100 flex-shrink-0">
            <div
              v-if="allMedia.length > 1"
              ref="fsThumbnailsRef"
              class="flex gap-2 overflow-x-auto px-4 md:px-8 py-4 hide-scrollbar"
            >
              <button
                v-for="(img, idx) in allMedia"
                :key="idx"
                @click.stop="goToImage(idx)"
                class="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 overflow-hidden transition-all duration-200 bg-gray-50"
                :class="currentFsIndex === idx
                  ? 'border-2 border-brand opacity-100'
                  : 'border border-gray-200 opacity-50 hover:opacity-90 hover:border-gray-400'"
                :aria-label="`Zobraziť obrázok ${idx + 1}`"
                :aria-current="currentFsIndex === idx ? 'true' : undefined"
              >
                <NuxtImg
                  :src="img"
                  class="w-full h-full object-contain mix-blend-multiply p-1"
                  format="webp"
                  loading="lazy"
                  referrerpolicy="no-referrer"
                />
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<style scoped>
.cursor-custom-zoom {
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Crect width='24' height='24' fill='white'/%3E%3Crect x='3' y='3' width='18' height='18' stroke='black' stroke-width='1'/%3E%3Cpath d='M14 6h4v4M18 6l-6 6M10 18H6v-4M6 18l6-6' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") 12 12, zoom-in;
}


.hide-scrollbar::-webkit-scrollbar { display: none !important; }
.hide-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
</style>
