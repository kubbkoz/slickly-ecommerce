<script setup lang="ts">
import { Clock, TrendingUp, Star } from 'lucide-vue-next';
import { formatRating } from '~/utils/format';

defineOptions({ name: 'SearchDropdownEmpty' });

defineProps<{
    recentSearches:     string[];
    trendingSearches:   string[];
    featuredProducts:   any[];
    getFormattedPrice:  (price: number) => string;
    getProductImageUrl: (product: any) => string;
}>();

const emit = defineEmits<{
    (e: 'pickTerm',     term: string): void;
    (e: 'removeTerm',   term: string, event: Event): void;
    (e: 'clearAll'): void;
    (e: 'navigateTerm', term: string): void;
    (e: 'productClick', product: any): void;
}>();
</script>

<template>
  <div class="py-5 space-y-5">

    <!-- ── NEDÁVNE HĽADANIA ─────────────────────────────────────────────────── -->
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
          @click="emit('clearAll')"
          class="text-[10px] text-gray-400 hover:text-brand transition-colors uppercase tracking-wider font-montserrat"
          type="button"
        >
          Zmazať
        </button>
      </div>

      <div v-if="recentSearches.length > 0" class="flex flex-wrap gap-2">
        <button
          v-for="term in recentSearches"
          :key="term"
          class="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 border border-gray-200 bg-white text-[11px] font-medium text-gray-700 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50 transition-all group font-sans"
          @click="emit('pickTerm', term)"
          type="button"
        >
          <Clock class="w-3 h-3 text-gray-300 flex-shrink-0" />
          <span>{{ term }}</span>
          <span
            @click.stop="emit('removeTerm', term, $event)"
            class="w-4 h-4 flex items-center justify-center text-gray-300 hover:text-brand hover:bg-red-50 transition-colors ml-0.5 text-xs leading-none"
            role="button"
            aria-label="Odstrániť"
          >✕</span>
        </button>
      </div>
      <p v-else class="text-xs text-gray-400 italic font-sans">Žiadne nedávne hľadania</p>
    </div>

    <div class="h-px bg-gray-100"></div>

    <!-- ── POPULÁRNE HĽADANIA ───────────────────────────────────────────────── -->
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
          @click="emit('navigateTerm', term)"
          class="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide border border-gray-200 text-gray-600 hover:border-black hover:text-black hover:bg-gray-50 transition-all font-montserrat"
          type="button"
        >
          {{ term }}
        </button>
      </div>
    </div>

    <!-- ── POPULÁRNE PRODUKTY ───────────────────────────────────────────────── -->
    <template v-if="featuredProducts.length > 0">
      <div class="h-px bg-gray-100"></div>

      <div>
        <div class="flex items-center gap-1.5 mb-3">
          <Star class="w-3.5 h-3.5 text-amber-400 fill-current" />
          <span class="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-900 font-montserrat">
            Populárne produkty
          </span>
        </div>

        <!-- 6-column product grid — miniaturized ProductCard design -->
        <div class="grid grid-cols-6 gap-2">
          <button
            v-for="product in featuredProducts.slice(0, 6)"
            :key="product.id"
            @click="emit('productClick', product)"
            class="group bg-white border border-gray-100 hover:border-black hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200 text-left flex flex-col cursor-pointer"
            type="button"
          >
            <!-- Image -->
            <div class="relative w-full aspect-square bg-[#f7f9fa] overflow-hidden flex-shrink-0">
              <img
                :src="getProductImageUrl(product)"
                :alt="product.translated?.name || product.name"
                class="absolute inset-0 w-full h-full object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            <!-- Info -->
            <div class="p-2 flex flex-col flex-1">
              <!-- Rating row (same fallback chain as ProductCard) -->
              <div class="h-[18px] flex items-center gap-1 mb-1 text-xs font-tech text-gray-900">
                <template v-if="(product.ratingAverage || 0) > 0">
                  <Star class="w-3 h-3 fill-[#ffc107] text-[#ffc107]" />
                  <span class="font-bold text-[10px]">{{ formatRating(product.ratingAverage) }}</span>
                  <span class="text-[10px] text-gray-500 ml-0.5">
                    ({{ product.productReviewsCount || product.reviewCount || product.customFields?.mtsport_review_count || 0 }})
                  </span>
                </template>
              </div>

              <!-- Name -->
              <p class="font-sans text-[11px] font-medium text-gray-900 leading-tight line-clamp-2 mb-1.5 flex-1">
                {{ product.translated?.name || product.name }}
              </p>

              <!-- Price -->
              <span class="text-[13px] font-bold font-tech text-black leading-none">
                {{ getFormattedPrice(product.calculatedPrice?.unitPrice) }}
              </span>
            </div>
          </button>
        </div>
      </div>
    </template>

  </div>
</template>
