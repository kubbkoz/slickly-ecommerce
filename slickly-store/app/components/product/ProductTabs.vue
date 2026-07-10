<script setup lang="ts">
import { ref } from 'vue';
import { ChevronDown, Star } from 'lucide-vue-next';
import RatingStars from '~/components/ui/RatingStars.vue';
import { type Product } from '~/types';
import DescriptionTab from './tabs/DescriptionTab.vue';
import SpecsTab from './tabs/SpecsTab.vue';
import ReviewsTab from './tabs/ReviewsTab.vue';
import DownloadsTab from './tabs/DownloadsTab.vue';
import DistributorTab from './tabs/DistributorTab.vue';

const props = defineProps<{
  product: Product;
  availableSizes: string[];
  reviewCount?: number;
  ratingAverage?: number;
}>();

const sections = computed(() => [
  { key: 'downloads',   label: 'Dokumenty a manuály na stiahnutie' },
  { key: 'distributor', label: 'Informácie o výrobcovi / distribútorovi' },
]);

const getLabel = (key: string) => {
  if (key === 'reviews') return `Zákaznícke hodnotenia (${props.reviewCount ?? props.product.productReviewsCount ?? 0})`;
  return sections.value.find(s => s.key === key)?.label ?? key;
};

// Open state: only one at a time (or use a Set for multi-open)
const openKey = ref<string | null>(null);

const toggle = (key: string) => {
  openKey.value = openKey.value === key ? null : key;
};

defineExpose({
  openTab: (key: string) => {
    openKey.value = key;
  }
});
</script>

<template>
  <div id="product-tabs" class="mt-24 border-t border-gray-200 bg-white">
    <div
      v-for="section in sections"
      :key="section.key"
      class="border-b border-gray-200 md:px-6"
    >
      <!-- Accordion header -->
      <button
        @click="toggle(section.key)"
        class="w-full flex items-center justify-between py-10 px-6 text-left group focus:outline-none bg-white"
        :aria-expanded="openKey === section.key"
        :aria-controls="`acc-panel-${section.key}`"
        :id="`acc-trigger-${section.key}`"
      >
        <span
          class="font-bold text-xl font-chakra"
          :class="openKey === section.key ? 'text-black' : 'text-gray-900'"
        >
          {{ getLabel(section.key) }}
        </span>
        
        <div class="flex items-center gap-6">
          <div v-if="section.key === 'reviews'" class="flex items-center">
            <RatingStars :rating="props.ratingAverage ?? props.product.ratingAverage ?? 0" />
          </div>
          <ChevronDown
            class="w-5 h-5 flex-shrink-0 transition-transform duration-300 text-gray-500"
            :class="openKey === section.key ? 'rotate-180 text-black' : ''"
            aria-hidden="true"
          />
        </div>
      </button>

      <!-- Accordion panel -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-[2000px]"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 max-h-[2000px]"
        leave-to-class="opacity-0 max-h-0"
      >
        <div
          v-if="openKey === section.key"
          :id="`acc-panel-${section.key}`"
          :aria-labelledby="`acc-trigger-${section.key}`"
          role="region"
          class="overflow-hidden pb-12 px-6 bg-white"
        >
          <DescriptionTab  v-if="section.key === 'description'" :product="product" :customFieldsMedia="(product as any).customFieldsMedia" />
          <SpecsTab        v-else-if="section.key === 'specs'"       :product="product" :availableSizes="availableSizes" />
          <ReviewsTab      v-else-if="section.key === 'reviews'"     :product="product" :ratingAverage="ratingAverage" :reviewCount="reviewCount" />
          <DownloadsTab    v-else-if="section.key === 'downloads'" :product="product" />
          <DistributorTab  v-else-if="section.key === 'distributor'" :product="product" />
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.font-chakra {
  font-family: 'Space Grotesk', sans-serif;
}

@keyframes star-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.animate-star-bounce {
  animation: star-bounce 0.4s ease-in-out;
}
</style>
