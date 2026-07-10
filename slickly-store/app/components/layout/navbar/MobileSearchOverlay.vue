<script setup lang="ts">
import { ArrowLeft, Search, X, Mic, Loader2, TrendingUp, Clock, Star, ChevronRight, Store } from 'lucide-vue-next';
import { usePrice }               from '#imports';
import { useRecentSearches }      from './search/useRecentSearches';
import { useSearchSuggest }       from './search/useSearchSuggest';
import { useFeaturedProducts }    from './search/useFeaturedProducts';
import { formatRating }           from '~/utils/format';
import { useSearchIntent }        from '~/composables/useSearchIntent';

defineOptions({ name: 'MobileSearchOverlay' });

const props = defineProps<{ isOpen: boolean }>();
const emit  = defineEmits(['close']);

const router     = useRouter();
const localePath = useLocalePath();
const { t }      = useStaticTranslations();
const { getFormattedPrice }                = usePrice();
const { getProductUrl, getProductImageUrl, getFormattedName } = useProductHelpers();
const { resolve: resolveIntent }           = useSearchIntent();

// ── Shared composables (same as desktop SearchBar) ────────────────────────────
const searchQuery = ref('');

const { recentSearches, load: loadRecent, save: saveRecent, remove: removeRecent, clear: clearAllRecent } = useRecentSearches();
const {
    getProducts, suggestManufacturers, totalResults,
    isLoading, showEmpty, showResults, fetchSuggest, searchTerm,
} = useSearchSuggest(searchQuery);

const { featuredProducts, fetch: fetchFeatured } = useFeaturedProducts();

// ── Voice search ──────────────────────────────────────────────────────────────
const isListening    = ref(false);
const recognitionRef = ref<any>(null);
const inputRef       = ref<HTMLInputElement | null>(null);

const trendingSearches = [
    'Exteriér', 'Leštenie', 'Ochrana karosérie',
    'Interiér', 'Príslušenstvo', 'Špeciálna ponuka',
];

// ── Open / close ──────────────────────────────────────────────────────────────
watch(() => props.isOpen, (opened) => {
    if (opened) {
        loadRecent();
        fetchFeatured();
        nextTick(() => inputRef.value?.focus());
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
        searchQuery.value = '';
        searchTerm.value  = '';
    }
});

const onClose = () => {
    emit('close');
};

// ── Navigation ────────────────────────────────────────────────────────────────
const navigateToSearch = (term?: string) => {
    const q = (term ?? searchQuery.value).trim();
    if (!q) return;
    saveRecent(q);
    onClose();

    const { path } = resolveIntent(q);
    router.push(localePath(path));
};

const handleProductClick = (product: any) => {
    onClose();
    router.push(localePath(getProductUrl(product)));
};

// Recent → populate input + suggest
const handlePickTerm = (term: string) => {
    searchQuery.value = term;
    fetchSuggest(term);
};

// Trending → go directly to search results page
const handleTrendingClick = (term: string) => {
    navigateToSearch(term);
};

// Manufacturer click → search by manufacturer name
const handleManufacturerClick = (mfr: any) => {
    navigateToSearch(mfr.name);
};

// ── Voice ─────────────────────────────────────────────────────────────────────
const handleVoiceSearch = async () => {
    if (isListening.value && recognitionRef.value) {
        recognitionRef.value.stop();
        isListening.value = false;
        return;
    }
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
    try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        // @ts-ignore
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SR();
        recognitionRef.value = recognition;
        recognition.lang = 'sk-SK';
        recognition.interimResults = false;
        recognition.onstart  = () => isListening.value = true;
        recognition.onend    = () => isListening.value = false;
        recognition.onresult = (ev: any) => { searchQuery.value = ev.results[0][0].transcript; };
        recognition.onerror  = () => { isListening.value = false; };
        recognition.start();
    } catch { isListening.value = false; }
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-250 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[110] flex flex-col bg-white font-sans"
        role="dialog"
        aria-modal="true"
        aria-label="Vyhľadávanie"
      >

        <!-- ── HEADER ─────────────────────────────────────────────────────── -->
        <div class="bg-gray-50 border-b border-gray-200 flex items-center gap-3 px-3 py-3 flex-shrink-0">
          <!-- Back -->
          <button
            @click="onClose"
            class="p-2 text-black hover:text-brand transition-colors flex-shrink-0"
            aria-label="Zatvoriť vyhľadávanie"
          >
            <ArrowLeft class="w-6 h-6" />
          </button>

          <!-- Input -->
          <div class="flex-1 relative">
            <input
              ref="inputRef"
              type="text"
              v-model="searchQuery"
              :placeholder="isListening ? 'Počúvam…' : t('hladat_placeholder')"
              class="w-full bg-transparent text-black placeholder-gray-500 text-base font-medium focus:outline-none pr-20"
              :class="{ 'placeholder-brand animate-pulse': isListening }"
              autocomplete="off"
              autocorrect="off"
              spellcheck="false"
              @keyup.enter="navigateToSearch()"
            />

            <!-- Right actions inside input -->
            <div class="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin text-brand" />
              <button
                v-else-if="searchQuery"
                @click="searchQuery = ''"
                class="p-1.5 text-gray-500 hover:text-black transition-colors"
              >
                <X class="w-5 h-5" />
              </button>
              <template v-else>
                <button
                  @click="handleVoiceSearch"
                  class="p-1.5 transition-colors"
                  :class="isListening ? 'text-brand' : 'text-gray-500'"
                  aria-label="Hlasové vyhľadávanie"
                >
                  <Mic class="w-5 h-5" :class="{ 'animate-pulse': isListening }" />
                </button>
              </template>
            </div>
          </div>

          <!-- Search CTA -->
          <button
            @click="navigateToSearch()"
            class="bg-brand text-white px-4 py-2 text-sm font-bold uppercase tracking-wide flex-shrink-0 active:bg-red-800 transition-colors"
          >
            <Search class="w-4 h-4" />
          </button>
        </div>

        <!-- ── CONTENT (scrollable) ──────────────────────────────────────── -->
        <div class="flex-1 overflow-y-auto">

          <!-- ── EMPTY STATE: no query ──────────────────────────────────── -->
          <div v-if="showEmpty" class="p-4 space-y-6">

            <!-- Nedávne hľadania -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="flex items-center gap-1.5">
                  <Clock class="w-3.5 h-3.5 text-blue-500" />
                  <span class="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-900 font-montserrat">
                    Nedávne hľadania
                  </span>
                </span>
                <button
                  v-if="recentSearches.length > 0"
                  @click="clearAllRecent()"
                  class="text-[10px] text-gray-400 uppercase tracking-wider font-montserrat bg-white hover:text-brand transition-colors"
                  type="button"
                >
                  Zmazať
                </button>
              </div>

              <div v-if="recentSearches.length > 0" class="flex flex-wrap gap-2">
                <button
                  v-for="term in recentSearches"
                  :key="term"
                  class="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 border border-gray-200 text-[13px] font-medium text-gray-700 active:bg-gray-100 transition-colors"
                  @click="handlePickTerm(term)"
                  type="button"
                >
                  <Clock class="w-3 h-3 text-gray-300 flex-shrink-0" />
                  <span>{{ term }}</span>
                  <span
                    @click.stop="removeRecent(term)"
                    class="w-5 h-5 flex items-center justify-center text-gray-300 text-xs"
                    role="button"
                    aria-label="Odstrániť"
                  >✕</span>
                </button>
              </div>
              <p v-else class="text-sm text-gray-400 italic">Žiadne nedávne hľadania</p>
            </div>

            <div class="h-px bg-gray-100"></div>

            <!-- Populárne hľadania -->
            <div>
              <div class="flex items-center gap-1.5 mb-3">
                <TrendingUp class="w-3.5 h-3.5 text-success" />
                <span class="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-900 font-montserrat">
                  Populárne hľadania
                </span>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="term in trendingSearches"
                  :key="term"
                  @click="handleTrendingClick(term)"
                  class="px-2.5 py-1.5 text-[13px] font-medium border border-gray-200 text-gray-700 active:bg-gray-50 font-sans"
                  type="button"
                >
                  {{ term }}
                </button>
              </div>
            </div>

            <!-- Populárne produkty -->
            <template v-if="featuredProducts.length > 0">
              <div class="h-px bg-gray-100"></div>
              <div>
                <div class="flex items-center gap-1.5 mb-4">
                  <Star class="w-3.5 h-3.5 text-amber-400 fill-current" />
                  <span class="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-900 font-montserrat">
                    Populárne produkty
                  </span>
                </div>
                <!-- 2-column grid on mobile -->
                <div class="grid grid-cols-2 gap-3">
                  <button
                    v-for="product in featuredProducts.slice(0, 6)"
                    :key="product.id"
                    @click="handleProductClick(product)"
                    class="group bg-white border border-gray-100 active:border-gray-400 transition-all text-left flex flex-col"
                    type="button"
                  >
                    <div class="w-full aspect-square bg-[#f7f9fa] overflow-hidden flex-shrink-0">
                      <img
                        :src="getProductImageUrl(product)"
                        :alt="product.translated?.name || product.name"
                        class="w-full h-full object-contain p-3 mix-blend-multiply"
                        loading="lazy"
                      />
                    </div>
                    <div class="p-2.5 flex flex-col flex-1">
                      <!-- Rating -->
                      <div class="h-[18px] flex items-center gap-1 mb-1">
                        <template v-if="(product.ratingAverage || 0) > 0">
                          <Star class="w-3 h-3 fill-[#ffc107] text-[#ffc107]" />
                          <span class="text-[10px] font-bold font-tech">{{ formatRating(product.ratingAverage) }}</span>
                          <span class="text-[10px] text-gray-400 ml-0.5">
                            ({{ product.productReviewsCount || product.reviewCount || product.customFields?.mtsport_review_count || 0 }})
                          </span>
                        </template>
                      </div>
                      <p class="text-[12px] font-medium text-gray-900 leading-tight line-clamp-2 mb-1.5 flex-1">
                        {{ getFormattedName(product) }}
                      </p>
                      <span class="text-[14px] font-bold font-tech text-black">
                        {{ getFormattedPrice(product.calculatedPrice?.unitPrice) }}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </template>
          </div>

          <!-- ── RESULTS STATE: has query ────────────────────────────────── -->
          <div v-else-if="showResults">
            <!-- Loading skeleton remains the same as it's a list pattern -->
            <div v-if="isLoading" class="p-4 space-y-3">
              <div v-for="i in 4" :key="i" class="flex gap-3 animate-pulse">
                <div class="w-16 h-16 bg-gray-100 flex-shrink-0"></div>
                <div class="flex-1 space-y-2 py-1">
                  <div class="h-3 bg-gray-100 w-3/4"></div>
                  <div class="h-3 bg-gray-100 w-1/2"></div>
                </div>
              </div>
            </div>

            <template v-else>
              <!-- Manufacturers (horizontal scroll) -->
              <div v-if="suggestManufacturers.length > 0" class="px-4 pt-4 pb-2">
                <div class="flex items-center gap-1.5 mb-3">
                  <Store class="w-3.5 h-3.5 text-violet-500" />
                  <span class="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-900 font-montserrat">
                    Výrobcovia
                  </span>
                </div>
                <div class="flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
                  <button
                    v-for="mfr in suggestManufacturers"
                    :key="mfr.id"
                    @click="handleManufacturerClick(mfr)"
                    class="flex-shrink-0 flex flex-col items-center gap-2 p-3 border border-gray-100 active:border-gray-300 min-w-[80px] transition-colors"
                    type="button"
                  >
                    <!-- Logo or monogram -->
                    <div class="w-12 h-12 border border-gray-100 flex items-center justify-center overflow-hidden bg-white">
                      <img
                        v-if="mfr.logo"
                        :src="mfr.logo"
                        :alt="mfr.name"
                        class="w-full h-full object-contain p-1"
                      />
                      <span v-else class="text-sm font-black text-gray-600 font-tech">
                        {{ mfr.name.slice(0, 2).toUpperCase() }}
                      </span>
                    </div>
                    <span class="text-[10px] font-bold text-gray-700 uppercase tracking-wide text-center leading-tight font-montserrat">
                      {{ mfr.name }}
                    </span>
                  </button>
                </div>
              </div>

              <div v-if="suggestManufacturers.length > 0" class="h-px bg-gray-100 mx-4"></div>

              <!-- Products list -->
              <div v-if="getProducts?.length > 0" class="p-4 space-y-2">
                <ProductCardMini
                  v-for="product in getProducts"
                  :key="product.id"
                  :product="product"
                  @click="onClose"
                />
              </div>

              <!-- No results -->
              <div v-else class="flex flex-col items-center justify-center py-16 px-8 text-center">
                <Search class="w-12 h-12 text-gray-200 mb-4" />
                <p class="text-gray-500 font-medium mb-1">Žiadne výsledky pre</p>
                <p class="font-black text-gray-900 text-lg">"{{ searchQuery }}"</p>
              </div>

            </template>
          </div>
        </div>

        <!-- ── FOOTER: Sticky Search CTA (vysunie sa zdola) ──────────────── -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="translate-y-full opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="translate-y-full opacity-0"
        >
          <div
            v-if="!showEmpty && getProducts?.length > 0"
            class="sticky bottom-0 p-4 bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-20 flex-shrink-0"
          >
            <button
              @click="navigateToSearch()"
              class="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest active:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
              type="button"
            >
              <Search class="w-4 h-4" />
              Hľadať "{{ searchQuery }}" — {{ totalResults }} výsledkov
            </button>
          </div>
        </Transition>

      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
