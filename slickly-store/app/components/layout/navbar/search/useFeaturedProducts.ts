import { ref } from 'vue';
import { useShopwareContext } from '#imports';

/**
 * Fetches products with markAsTopseller = true from Store API.
 * Used in the search dropdown empty state ("Populárne produkty").
 * Results are cached after first fetch.
 */
export const useFeaturedProducts = () => {
    const { apiClient } = useShopwareContext();

    const featuredProducts = ref<any[]>([]);
    const loading          = ref(false);
    const fetched          = ref(false);

    const fetch = async () => {
        if (fetched.value) return; // cache — fetch only once per page load
        loading.value = true;
        try {
            const res = await apiClient.invoke('readProduct post /product' as any, {
                body: {
                    filter: [
                        { type: 'equals', field: 'markAsTopseller', value: true },
                        { type: 'equals', field: 'parentId',        value: null },
                    ],
                    limit: 6,
                    sort: [{ field: 'sales', order: 'DESC' }],
                    associations: {
                        cover: { associations: { media: {} } },
                        seoUrls: {},
                    },
                    includes: {
                        product: ['id', 'name', 'translated', 'cover', 'calculatedPrice', 'seoUrls', 'ratingAverage', 'productReviewsCount', 'reviewCount', 'childCount', 'customFields'],
                        calculated_price: ['unitPrice'],
                        product_media:    ['media'],
                        media:            ['url', 'thumbnails'],
                        seo_url:          ['seoPathInfo', 'isCanonical'],
                    },
                },
            });

            const raw = (res as any)?.data ?? res;
            featuredProducts.value = raw?.elements ?? [];
            fetched.value = true;
        } catch (e) {
            console.error('[useFeaturedProducts] error:', e);
        } finally {
            loading.value = false;
        }
    };

    return { featuredProducts, loading, fetch };
};
