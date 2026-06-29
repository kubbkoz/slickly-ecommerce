import { ref } from 'vue';
import { useShopwareContext, useShopwareLanguage } from '#imports';

export const useProductSearch = () => {
    const { apiClient } = useShopwareContext();
    const { currentLanguageId } = useShopwareLanguage();
    const loading = ref(false);
    const products = ref<any[]>([]);

    const search = async (term: string) => {
        if (!term) return;
        loading.value = true;
        try {
            const res = await apiClient.invoke('searchPage post /search' as any, {
                body: {
                    search: term,
                    associations: {
                        cover: { associations: { media: {} } },
                        productReviews: {} // Aggregation trigger
                    },
                    includes: {
                        product: [
                            'id', 'name', 'translated', 'cover', 'calculatedPrice', 
                            'seoUrls', 'ratingAverage', 'productReviewsCount', 'customFields'
                        ],
                        seo_url: ['seoPathInfo', 'isCanonical']
                    }
                },
                headers: {
                    'sw-language-id': currentLanguageId.value
                }
            });
            products.value = res.data?.elements || [];
        } catch (e) {
            console.error('[useProductSearch] error:', e);
        } finally {
            loading.value = false;
        }
    };

    return {
        search,
        loading,
        products
    };
};
