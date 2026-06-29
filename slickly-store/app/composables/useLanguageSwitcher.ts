import { useInternationalization, useSessionContext, useShopwareContext, useRoute, useI18n, useShopwareLanguage } from '#imports';

const STATIC_PATH_PREFIXES = ['/blog', '/store', '/about', '/account', '/checkout', '/wishlist', '/search'];

export const useLanguageSwitcher = () => {
    const { changeLanguage } = useInternationalization();
    const { refreshSessionContext } = useSessionContext();
    const { apiClient } = useShopwareContext();
    const { locales, locale } = useI18n();
    const route = useRoute();
    const { showLoader } = usePageLoader();
    const { resolveSlug } = useCategoryCache();

    // Slugify helper — converts translated name to URL slug
    const slugify = (text: string): string =>
        text.toString().toLowerCase().normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-')
            .trim();

    /**
     * Get the foreignKey (category ID) for the current page.
     * Priority: useCategoryCache (O(1)) → history.state
     */
    const getCurrentEntityId = (cleanPath: string): string | null => {
        // 1st: O(1) lookup from category cache
        const slug = cleanPath.replace(/^\//, '').replace(/\/$/, '');
        const cached = resolveSlug(slug);
        if (cached) {
            return cached.id;
        }

        // 2nd: history.state — set by Nuxt router / PageResolver
        if (import.meta.client && history.state?.foreignKey) {
            return history.state.foreignKey;
        }

        return null;
    };

    /**
     * Resolves the translated slug for a category in the target language.
     * Uses readCategory with sw-language-id header to get the translated name,
     * then slugifies it. This works even when Shopware has no SEO URLs configured.
     */
    const resolveTranslatedSlug = async (foreignKey: string, targetLanguageId: string): Promise<string | null> => {
        try {
            const response = await (apiClient.invoke as any)(`readCategory post /category/${foreignKey}`, {
                headers: { "sw-language-id": targetLanguageId },
                body: {
                    // Also fetch seoUrls in case Shopware has them — prefer those over slugified name
                    associations: { seoUrls: {} }
                }
            }) as any;

            const category = response.data;
            if (!category) return null;

            // Priority: canonical SEO URL slug > slugified translated name
            const seoUrl = category.seoUrls?.find((u: any) => u.isCanonical)?.seoPathInfo
                || category.seoUrls?.[0]?.seoPathInfo;
            if (seoUrl) {
                return seoUrl;
            }

            // Fallback: slugify the translated category name
            const translatedName = category.translated?.name || category.name;
            if (translatedName) {
                return slugify(translatedName);
            }

            return null;
        } catch (e) {
            console.warn('[LanguageSwitcher] resolveTranslatedSlug failed:', e);
            return null;
        }
    };

    const { getLocaleForLanguageId } = useShopwareLanguage();

    const switchLanguage = async (languageId: string) => {
        console.warn('[LanguageSwitcher] Language switching is currently DISABLED.');
        /*
        try {
            // ... (original logic commented out for single-lang SK stability)
            showLoader();
            // ... rest of the function ...
        } catch (e) {
            console.error('[LanguageSwitcher] ERROR:', e);
        }
        */
    };

    return { switchLanguage };
};
