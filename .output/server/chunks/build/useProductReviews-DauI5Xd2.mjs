import { ref, computed } from 'vue';
import { e as useShopwareContext } from './server.mjs';

function useProductReviews(product) {
  const { apiClient } = useShopwareContext();
  const productReviews = ref([]);
  const loadProductReviews = async (parameters = {}) => {
    const fetchedReviews = await apiClient.invoke(
      "readProductReviews post /product/{productId}/reviews",
      {
        pathParams: { productId: product.value.id },
        body: parameters
      }
    );
    productReviews.value = fetchedReviews.data.elements ?? [];
    return fetchedReviews.data;
  };
  const addReview = async (data) => {
    await apiClient.invoke(
      "saveProductReview post /product/{productId}/review",
      {
        pathParams: { productId: product.value.id },
        body: data
      }
    );
  };
  return {
    productReviews: computed(() => productReviews.value),
    loadProductReviews,
    addReview
  };
}

export { useProductReviews as u };
