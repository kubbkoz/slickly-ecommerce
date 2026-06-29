<script setup lang="ts">
import SearchDropdownEmpty   from './SearchDropdownEmpty.vue';
import SearchDropdownResults from './SearchDropdownResults.vue';
import type { SuggestManufacturer, SuggestCategory, SuggestTag, SuggestProperty } from './useSearchSuggest';

defineOptions({ name: 'SearchDropdown' });

defineProps<{
    isOpen:             boolean;
    dropdownTop:        number;
    dropdownLeft:       number;
    dropdownWidth:      number;
    showEmpty:          boolean;
    showResults:        boolean;
    isLoading:          boolean;
    searchQuery:        string;
    // Empty state
    recentSearches:     string[];
    trendingSearches:   string[];
    featuredProducts:   any[];
    // Results state
    products:           any[];
    manufacturers:      SuggestManufacturer[];
    categories:         SuggestCategory[];
    tags:               SuggestTag[];
    properties:         SuggestProperty[];
    totalResults:       number;
    // Shared helpers
    getFormattedPrice:  (price: number) => string;
    getProductImageUrl: (product: any) => string;
}>();

const emit = defineEmits<{
    (e: 'pickTerm',       term: string): void;
    (e: 'navigateTerm',   term: string): void;
    (e: 'removeTerm',     term: string, event: Event): void;
    (e: 'clearAll'):      void;
    (e: 'productClick',   product: any): void;
    (e: 'navigateSearch', term?: string): void;
    (e: 'categoryClick',  category: SuggestCategory): void;
}>();
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isOpen"
        data-search-dropdown
        class="fixed z-[65] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.14)] border border-gray-100"
        :style="{
          top:   `${dropdownTop}px`,
          left:  `${dropdownLeft}px`,
          width: `${dropdownWidth}px`,
        }"
      >
        <div class="px-6">

          <!-- No query: recent + trending + featured products -->
          <SearchDropdownEmpty
            v-if="showEmpty"
            :recent-searches="recentSearches"
            :trending-searches="trendingSearches"
            :featured-products="featuredProducts"
            :get-formatted-price="getFormattedPrice"
            :get-product-image-url="getProductImageUrl"
            @pick-term="emit('pickTerm', $event)"
            @navigate-term="emit('navigateTerm', $event)"
            @remove-term="(term, event) => emit('removeTerm', term, event)"
            @clear-all="emit('clearAll')"
            @product-click="emit('productClick', $event)"
          />

          <!-- Has query: products + categories + tags + manufacturers + properties -->
          <SearchDropdownResults
            v-else-if="showResults"
            :products="products"
            :manufacturers="manufacturers"
            :categories="categories"
            :tags="tags"
            :properties="properties"
            :total-results="totalResults"
            :search-query="searchQuery"
            :is-loading="isLoading"
            :get-formatted-price="getFormattedPrice"
            :get-product-image-url="getProductImageUrl"
            @product-click="emit('productClick', $event)"
            @navigate-search="emit('navigateSearch', $event)"
            @category-click="emit('categoryClick', $event)"
          />

        </div>
      </div>
    </Transition>
  </Teleport>
</template>
