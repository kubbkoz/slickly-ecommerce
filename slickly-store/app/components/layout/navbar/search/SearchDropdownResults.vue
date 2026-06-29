<script setup lang="ts">
import { Search, ChevronRight, FolderOpen, Tag, SlidersHorizontal } from 'lucide-vue-next';
import { highlightText } from '~/utils/highlight';
import { useProductHelpers } from '~/composables/useProductHelpers';
import type { SuggestManufacturer, SuggestCategory, SuggestTag, SuggestProperty } from './useSearchSuggest';

defineOptions({ name: 'SearchDropdownResults' });

const props = defineProps<{
    products:              any[];
    manufacturers:         SuggestManufacturer[];
    categories:            SuggestCategory[];
    tags:                  SuggestTag[];
    properties:            SuggestProperty[];
    totalResults:          number;
    searchQuery:           string;
    isLoading:             boolean;
    getFormattedPrice:     (price: number) => string;
    getProductImageUrl:    (product: any) => string;
}>();

const { getFormattedName } = useProductHelpers();

const emit = defineEmits<{
    (e: 'productClick',   product: any): void;
    (e: 'navigateSearch', term?: string): void;
    (e: 'categoryClick',  category: SuggestCategory): void;
}>();
</script>

<template>
  <div class="py-4 max-h-[520px] overflow-hidden">

    <!-- ── Loading shimmer (3 columns) ─────────────────────────────────────── -->
    <div
      v-if="isLoading && products.length === 0"
      class="grid grid-cols-[1fr_200px_280px] gap-0 divide-x divide-gray-100"
    >
      <div class="pr-6 space-y-3">
        <div class="h-3 w-20 bg-gray-100 animate-pulse rounded"></div>
        <div v-for="i in 5" :key="`sk-p-${i}`" class="flex items-center gap-3">
          <div class="w-11 h-11 bg-gray-100 animate-pulse flex-shrink-0"></div>
          <div class="flex-1 space-y-1.5">
            <div class="h-3 bg-gray-100 animate-pulse rounded w-3/4"></div>
            <div class="h-2.5 bg-gray-100 animate-pulse rounded w-1/4"></div>
          </div>
        </div>
      </div>
      <div class="px-6 space-y-3">
        <div class="h-3 w-20 bg-gray-100 animate-pulse rounded"></div>
        <div v-for="i in 3" :key="`sk-c-${i}`" class="flex items-center gap-2">
          <div class="w-7 h-7 bg-gray-100 animate-pulse flex-shrink-0"></div>
          <div class="h-3 bg-gray-100 animate-pulse rounded flex-1"></div>
        </div>
      </div>
      <div class="pl-6 space-y-3">
        <div class="h-3 w-20 bg-gray-100 animate-pulse rounded"></div>
        <div class="grid grid-cols-2 gap-2">
          <div v-for="i in 4" :key="`sk-m-${i}`" class="h-10 bg-gray-100 animate-pulse rounded"></div>
        </div>
      </div>
    </div>

    <!-- ── Actual results (3 columns) ──────────────────────────────────────── -->
    <div v-else class="grid grid-cols-[1fr_200px_280px] gap-0 items-start divide-x divide-gray-100">

      <!-- ─── COL 1: Products ──────────────────────────────────────────── -->
      <div class="pr-6">
        <div class="flex items-center justify-between mb-3">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] font-montserrat">
            Produkty
          </span>
          <span v-if="totalResults > 0" class="text-[10px] text-gray-400 font-sans">
            {{ totalResults }} výsledkov
          </span>
        </div>

        <div v-if="!isLoading && products.length === 0" class="py-5 text-center">
          <p class="text-sm text-gray-500 italic">
            Nenašli sa žiadne produkty pre &ldquo;{{ searchQuery }}&rdquo;
          </p>
          <button
            @click="emit('navigateSearch')"
            class="mt-2 text-xs font-bold text-brand uppercase tracking-widest hover:underline"
            type="button"
          >
            Skúsiť rozšírené hľadanie →
          </button>
        </div>

        <ul v-else class="space-y-0.5" role="listbox">
          <li
            v-for="product in products.slice(0, 6)"
            :key="product.id"
            role="option"
            class="flex items-center gap-3 px-2 py-2 -mx-2 cursor-pointer group hover:bg-[#f7f8fa] transition-colors"
            @click="emit('productClick', product)"
          >
            <div class="w-11 h-11 flex-shrink-0 bg-gray-50 border border-gray-100 p-0.5 overflow-hidden">
              <img
                :src="getProductImageUrl(product)"
                :alt="product.translated?.name || product.name"
                class="w-full h-full object-contain mix-blend-multiply"
                loading="lazy"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="text-[13px] font-medium text-gray-900 group-hover:text-brand transition-colors leading-tight line-clamp-1 font-sans"
                v-html="highlightText(getFormattedName(product), searchQuery)"
              ></p>
              <p class="text-xs font-bold text-gray-400 mt-0.5 font-tech">
                {{ getFormattedPrice(product.calculatedPrice?.unitPrice) }}
              </p>
            </div>
            <ChevronRight class="w-3.5 h-3.5 text-gray-300 group-hover:text-brand flex-shrink-0 transition-colors" />
          </li>
        </ul>

        <div v-if="products.length > 0" class="mt-3 pt-3 border-t border-gray-100">
          <button
            @click="emit('navigateSearch')"
            class="w-full py-2.5 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brand transition-colors text-center font-montserrat"
            type="button"
          >
            Zobraziť všetky výsledky
            <span v-if="totalResults > 0">({{ totalResults }})</span>
          </button>
        </div>
      </div>

      <!-- ─── COL 2: Categories + Tags ─────────────────────────────────── -->
      <div class="px-6">

        <div>
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] font-montserrat block mb-3">
            Kategórie
          </span>

          <ul v-if="categories.length > 0" class="space-y-0.5">
            <li
              v-for="cat in categories"
              :key="cat.id"
              @click="emit('categoryClick', cat)"
              class="flex items-center gap-2.5 px-2 py-1.5 -mx-2 cursor-pointer group hover:bg-[#f7f8fa] transition-colors"
            >
              <div
                v-if="cat.imageUrl"
                class="w-7 h-7 flex-shrink-0 bg-gray-50 border border-gray-100 p-0.5 overflow-hidden"
              >
                <img
                  :src="cat.imageUrl"
                  :alt="cat.name"
                  class="w-full h-full object-contain mix-blend-multiply"
                  loading="lazy"
                />
              </div>
              <div
                v-else
                class="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-gray-50 border border-gray-100"
              >
                <FolderOpen class="w-3.5 h-3.5 text-gray-300" />
              </div>
              <span
                class="text-[12px] font-medium text-gray-700 group-hover:text-brand transition-colors leading-tight line-clamp-1 font-sans"
                v-html="highlightText(cat.name, searchQuery)"
              ></span>
            </li>
          </ul>

          <p v-else class="text-[11px] text-gray-400 italic font-sans">
            Žiadne kategórie
          </p>
        </div>

        <div v-if="tags.length > 0" class="mt-4 pt-3 border-t border-gray-100">
          <span class="flex items-center gap-1.5 mb-2.5">
            <Tag class="w-3 h-3 text-gray-400" />
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] font-montserrat">
              Tagy
            </span>
          </span>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="tag in tags"
              :key="tag.id"
              @click="emit('navigateSearch', tag.name)"
              class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide border border-gray-200 text-gray-600 hover:border-black hover:text-black hover:bg-gray-50 transition-all font-montserrat"
              type="button"
            >
              {{ tag.name }}
            </button>
          </div>
        </div>

      </div>

      <!-- ─── COL 3: Manufacturers + Properties ───────────────────────── -->
      <div class="pl-6">

        <div v-if="manufacturers.length > 0">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] font-montserrat block mb-3">
            Výrobca
          </span>
          <ul class="grid grid-cols-2 gap-2">
            <li
              v-for="mfr in manufacturers.slice(0, 4)"
              :key="mfr.id"
              @click="emit('navigateSearch', mfr.name)"
              class="flex items-center gap-2 px-2.5 py-2 border border-gray-100 hover:border-gray-300 hover:bg-[#f7f8fa] cursor-pointer transition-all group"
            >
              <div
                v-if="mfr.logo"
                class="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-white border border-gray-100 p-0.5 overflow-hidden"
              >
                <img
                  :src="mfr.logo"
                  :alt="mfr.name"
                  class="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all"
                />
              </div>
              <div
                v-else
                class="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-gray-100 text-[9px] font-black text-gray-500 font-tech"
              >
                {{ mfr.name.slice(0, 2).toUpperCase() }}
              </div>
              <span
                class="text-[11px] font-bold text-gray-700 group-hover:text-gray-900 transition-colors font-sans leading-tight line-clamp-1"
                v-html="highlightText(mfr.name, searchQuery)"
              ></span>
            </li>
          </ul>
        </div>

        <div v-if="properties.length > 0" class="mt-4" :class="manufacturers.length > 0 ? 'pt-3 border-t border-gray-100' : ''">
          <span class="flex items-center gap-1.5 mb-2.5">
            <SlidersHorizontal class="w-3 h-3 text-gray-400" />
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] font-montserrat">
              Vlastnosti
            </span>
          </span>

          <ul class="space-y-1">
            <li
              v-for="prop in properties"
              :key="prop.id"
              @click="emit('navigateSearch', prop.name)"
              class="flex items-center gap-2 px-2 py-1.5 -mx-2 cursor-pointer group hover:bg-[#f7f8fa] transition-colors"
            >
              <span class="text-[10px] text-gray-400 font-sans flex-shrink-0">{{ prop.groupName }}:</span>
              <span
                class="text-[12px] font-medium text-gray-700 group-hover:text-brand transition-colors font-sans line-clamp-1"
                v-html="highlightText(prop.name, searchQuery)"
              ></span>
            </li>
          </ul>
        </div>

        <div class="mt-4" :class="manufacturers.length > 0 || properties.length > 0 ? 'pt-3 border-t border-gray-100' : ''">
          <button
            @click="emit('navigateSearch', searchQuery)"
            class="w-full py-2 border border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-widest hover:border-black hover:text-black transition-all text-center flex items-center justify-center gap-2 font-montserrat"
            type="button"
          >
            <Search class="w-3 h-3" />
            Hľadať na celom webe
          </button>
        </div>

      </div>
    </div>
  </div>
</template>
