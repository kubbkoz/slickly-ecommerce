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
  try { await loadProductReviews(); } catch {}
};

onMounted(async () => {
  try { await loadProductReviews(); } catch {}
});

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('sk-SK', { year: 'numeric', month: 'long', day: 'numeric' });
};

const getInitials = (name?: string) => {
  if (!name) return 'Z';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const reviewTotal = computed(() => props.reviewCount ?? props.product.productReviewsCount ?? 0);
const rating = computed(() => props.ratingAverage ?? props.product.ratingAverage ?? 0);
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-10 lg:gap-16">

    <!-- LEFT — summary + button -->
    <div class="flex-shrink-0 lg:w-64">
      <div class="text-6xl font-black font-tech text-black mb-2">{{ formatRating(rating) }}</div>
      <div class="mb-3">
        <RatingStars :rating="rating" size-class="w-5 h-5" />
      </div>
      <p class="text-sm text-gray-500 font-sans mb-6">{{ reviewTotal }} {{ formatReviewLabel(reviewTotal, true) }}</p>
      <BaseButton variant="primary" class="uppercase font-bold tracking-wider text-sm" @click="isReviewModalOpen = true">
        Napísať recenziu
      </BaseButton>
    </div>

    <!-- RIGHT — reviews grid -->
    <div class="flex-1 min-w-0">
      <div v-if="productReviews?.length > 0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div
          v-for="review in productReviews"
          :key="review.id"
          class="bg-white p-5 border border-gray-100 flex flex-col"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 font-tech text-sm flex-shrink-0">
              {{ getInitials(review.externalUser || 'Zákazník') }}
            </div>
            <div class="min-w-0 flex-1">
              <span class="block font-bold text-xs uppercase tracking-wide truncate">{{ review.externalUser || 'Zákazník' }}</span>
              <span class="text-[10px] text-gray-400">{{ formatDate(review.createdAt) }}</span>
            </div>
          </div>
          <div class="flex text-amber-400 mb-3">
            <Star v-for="i in 5" :key="i" class="w-3 h-3" :class="i <= (review.points || 0) ? 'fill-current' : 'text-gray-200'" />
          </div>
          <h4 v-if="review.title" class="font-bold text-sm mb-1.5 text-black uppercase">{{ review.title }}</h4>
          <p v-if="review.content" class="text-gray-600 text-sm leading-relaxed line-clamp-4 flex-1">
            "{{ review.content }}"
          </p>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="flex items-center gap-4 py-8">
        <MessageSquare class="w-8 h-8 text-gray-300 flex-shrink-0" />
        <p class="text-gray-400 font-sans text-sm">Tento produkt zatiaľ nebol ohodnotený. Buďte prvý!</p>
      </div>
    </div>

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
</template>
