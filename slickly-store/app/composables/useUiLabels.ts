import { useAsyncData, useShopwareContext, useI18n, useSessionContext } from '#imports';

/**
 * Composable for fetching and managing global UI labels (button texts, link labels, etc.)
 * managed via Shopware Custom Fields on a designated configuration category.
 */
export const useUiLabels = () => {
    const { apiClient } = useShopwareContext();
    const { locale } = useI18n();
    const { sessionContext, languageIdChain } = useSessionContext();
    const config = useRuntimeConfig();

    const CONFIG_CATEGORY_ID = config.public.shopware.ids.categories.flashSales; // Note: flashSales ID is also used for global labels/links

    // Get current language ID more reliably
    const languageId = computed(() =>
        languageIdChain.value?.[0] ||
        sessionContext.value?.context?.languageIdChain?.[0]
    );

    /**
     * Fetches labels from the designated Shopware category.
     */
    const { data: labels, refresh, pending, error } = useAsyncData(
        `ui-labels-${locale.value}-${languageId.value}`,
        async () => {
            try {
                const langId = languageId.value;
                if (!langId) return {};

                const res = await apiClient.invoke(`readCategory post /category/${CONFIG_CATEGORY_ID}` as any, {});

                const data = res?.data;
                if (!data) return {};

                // Merge translated fields on top of base fields
                return { ...(data.customFields || {}), ...(data.translated?.customFields || {}) };
            } catch (e) {
                console.error('[useUiLabels] Fetch failed:', e);
                return {};
            }
        },
        {
            watch: [languageId, locale],
            getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key],
            server: true
        }
    );

    /**
     * Helper to retrieve a specific label by its custom field key.
     * @param key - The technical name of the custom field (e.g., 'btn_all_categories')
     * @param fallback - Text to return if the field is missing
     */
    const getLabel = (key: string, fallback: string = ''): string => {
        return labels.value?.[key] || fallback;
    };

    return {
        /**
         * Raw labels object (Custom Fields)
         */
        labels,
        /**
         * Helper to get a single label with fallback
         */
        getLabel,
        /**
         * Refreshes the labels from API
         */
        refresh,
        /**
         * Loading state
         */
        pending,
        /**
         * Error state
         */
        error
    };
};
