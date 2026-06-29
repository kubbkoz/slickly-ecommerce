<script setup lang="ts">
import { ref, onMounted, toRef } from 'vue';
import { Star, MessageSquare } from 'lucide-vue-next';
import RatingStars from '~/components/ui/RatingStars.vue';
import AppModal from '~/components/ui/AppModal.vue';
import ProductReviewForm from '~/components/product/ProductReviewForm.vue';
import { formatReviewLabel, formatRating } from '~/utils/format';
import { type Product } from '~/types';
import BaseButton from '~/components/ui/BaseButton.vue';
import { useProductReviews } from '@shopware/composables';

const props = defineProps<{
  product: Product;
  ratingAverage?: number;
  reviewCount?: number;
}>();

const { productReviews, loadProductReviews } = useProductReviews(toRef(props, 'product') as any);
const isReviewModalOpen = ref(false);

const handleReviewSuccess = async () => {
  isReviewModalOpen.value = false;
  // Refresh the reviews list
  try {
    await loadProductReviews();
  } catch (e) {
    console.error("Failed to refresh reviews", e);
  }
};

onMounted(async () => {
    try {
        await loadProductReviews();
    } catch (e) {
        console.error("Failed to load product reviews", e);
    }
});

const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('sk-SK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const getInitials = (authorName?: string) => {
    if (!authorName) return 'U';
    return authorName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};
</script>

<template>
  <div class="animate-fade-in font-sans">

      <div class="flex flex-col items-center text-center mb-16">
          <div class="text-6xl font-black font-tech text-black mb-2">{{ formatRating(ratingAverage ?? product.ratingAverage) }}</div>
          <div class="mb-4 scale-125">
               <RatingStars :rating="ratingAverage ?? product.ratingAverage ?? 0" size-class="w-5 h-5" />
          </div>
          <p class="text-gray-500 font-medium mb-8">Založené na {{ reviewCount ?? product.productReviewsCount ?? 0 }} {{ formatReviewLabel(reviewCount ?? product.productReviewsCount ?? 0, true) }}</p>
          <BaseButton variant="primary" size="lg" class="uppercase font-bold tracking-wider" @click="isReviewModalOpen = true">
              Napísať recenziu
          </BaseButton>
      </div>

      <!-- Review Modal -->
      <AppModal 
        :is-open="isReviewModalOpen" 
        title="Napísať recenziu k produktu"
        @close="isReviewModalOpen = false"
      >
        <ProductReviewForm 
          :product-id="product.id" 
          @success="handleReviewSuccess"
          @cancel="isReviewModalOpen = false"
        />
      </AppModal>

      <!-- Reviews Grid -->
      <div v-if="productReviews?.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="review in productReviews" :key="review.id" class="bg-white p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 font-tech text-lg">
                  {{ getInitials(review.externalUser || 'Zákazník') }}
                </div>
                <div class="text-left">
                  <span class="block font-bold text-sm uppercase tracking-wide">{{ review.externalUser || 'Zákazník' }}</span>
                  <span class="text-xs text-gray-400">Overený zákazník</span>
                </div>
              </div>
              <span class="text-xs text-gray-400 font-medium">{{ formatDate(review.createdAt) }}</span>
            </div>
            <div class="flex text-yellow-400 mb-4 text-xs">
                <Star v-for="i in 5" :key="i" class="w-3 h-3" :class="i <= (review.points || 0) ? 'fill-current' : 'text-gray-200'" />
            </div>
            <h4 v-if="review.title" class="font-bold text-sm mb-2 text-black">{{ review.title }}</h4>
            <p class="text-gray-600 italic leading-relaxed text-sm">
              "{{ review.content }}"
            </p>
          </div>
      </div>
      <div v-else class="text-center py-12 border border-dashed border-gray-200 rounded-lg">
          <MessageSquare class="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p class="text-gray-400 font-medium italic">Tento produkt zatiaľ nebol ohodnotený. Buďte prvý, kto napíše recenziu!</p>
      </div>
    </div>
</template>
