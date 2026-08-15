import { ref } from 'vue';
import { e as useShopwareContext } from './server.mjs';

const useFeaturedProducts = () => {
  const { apiClient } = useShopwareContext();
  const featuredProducts = ref([]);
  const loading = ref(false);
  const fetched = ref(false);
  const fetch = async () => {
    if (fetched.value) return;
    loading.value = true;
    try {
      const res = await apiClient.invoke("readProduct post /product", {
        body: {
          filter: [
            { type: "equals", field: "markAsTopseller", value: true },
            { type: "equals", field: "parentId", value: null }
          ],
          limit: 6,
          sort: [{ field: "sales", order: "DESC" }],
          associations: {
            cover: { associations: { media: {} } },
            seoUrls: {}
          },
          includes: {
            product: ["id", "name", "translated", "cover", "calculatedPrice", "seoUrls", "ratingAverage", "productReviewsCount", "reviewCount", "childCount", "customFields"],
            calculated_price: ["unitPrice"],
            product_media: ["media"],
            media: ["url", "thumbnails"],
            seo_url: ["seoPathInfo", "isCanonical"]
          }
        }
      });
      const raw = res?.data ?? res;
      featuredProducts.value = raw?.elements ?? [];
      fetched.value = true;
    } catch (e) {
    } finally {
      loading.value = false;
    }
  };
  return { featuredProducts, loading, fetch };
};

export { useFeaturedProducts as u };
