<script setup lang="ts">
import { useProductHelpers } from '~/composables/useProductHelpers';

const props = defineProps<{
  product: any;
}>();

const {
  getProductImageUrl,
  getPrice,
  getOldPrice,
  calculateDiscount,
  navigateToProduct,
  getFormattedName
} = useProductHelpers();

const imageUrl = computed(() => getProductImageUrl(props.product));
const discount = computed(() => calculateDiscount(props.product));

const emit = defineEmits(['click']);

const handleCardClick = () => {
  emit('click');
  navigateToProduct(props.product);
};
</script>

<template>
  <div 
    @click="handleCardClick"
    class="flex gap-4 p-3 bg-white hover:bg-gray-50 transition-all duration-300 cursor-pointer group rounded-default border border-gray-100/50 hover:border-brand/20"
  >
    <!-- Image -->
    <div class="w-20 h-20 bg-white shrink-0 relative overflow-hidden flex items-center justify-center p-2 rounded-default border border-gray-100/50">
       <img
          :src="imageUrl"
          :alt="product.name"
          width="80"
          height="80"
          loading="lazy"
          class="w-full h-full object-contain transition-transform duration-500 rounded-default"
       />
       <div v-if="discount > 0" class="absolute top-0 left-0 bg-amber text-black text-[9px] font-bold px-1.5 py-0.5 z-10">
         -{{ discount }}%
       </div>
    </div>

    <!-- Info -->
    <div class="flex flex-col justify-center min-w-0">
      <h4 class="font-sans text-xs font-medium uppercase tracking-tight text-gray-900 group-hover:text-brand transition-colors line-clamp-2 leading-none mb-2">
        {{ getFormattedName(product) }}
      </h4>
      <div class="flex items-baseline gap-2">
        <span class="font-tech font-black text-lg text-black leading-none">
          {{ getPrice(product) }} €
        </span>
        <span v-if="getOldPrice(product)" class="text-[10px] text-gray-400 line-through font-tech">
          {{ getOldPrice(product) }} €
        </span>
      </div>
    </div>
  </div>
</template>
