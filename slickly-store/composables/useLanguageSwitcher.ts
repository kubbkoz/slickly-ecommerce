import { useInternationalization, useSessionContext, useShopwareContext, useRouter, useRoute, useLocalePath, useI18n } from '#imports';

export const useLanguageSwitcher = () => {
    const { changeLanguage, replaceToDevStorefront, languages } = useInternationalization();
    const { refreshSessionContext } = useSessionContext();
    const { apiClient } = useShopwareContext();
    const localePath = useLocalePath();
    const { locales } = useI18n();

    const switchLanguage = async (languageId: string) => {
        try {
            console.log('[LanguageSwitcher] 1. switchLanguage called with ID:', languageId);

            let targetLocaleCode = 'sk'; // Default fallback

            // 1. Resolve Target Locale Code
            if (languages.value) {
                const swLang = languages.value?.find(l => l.id === languageId);
                console.log('[LanguageSwitcher] 2. Found Shopware Language:', swLang?.name, swLang?.translationCode?.code);

                if (swLang?.translationCode?.code) {
                    const nuxtLocale = (locales.value as any[]).find(l => l.language === swLang?.translationCode?.code);
                    if (nuxtLocale) {
                        targetLocaleCode = nuxtLocale.code;
                        console.log('[LanguageSwitcher] 3. Mapped to Nuxt Locale:', targetLocaleCode);
                    }
                }
            } else {
                console.warn('[LanguageSwitcher] Languages list is empty or undefined');
            }

            // 2. Specific Fallback for DE
            if (languageId === '019b07f468e470c38d4e84718ebb0ef8') {
                targetLocaleCode = 'de';
                console.log('[LanguageSwitcher] DE Fallback triggered');
            }

            // 3. Change Context
            console.log('[LanguageSwitcher] 4. Calling changeLanguage...');
            const data = await changeLanguage(languageId);
            console.log('[LanguageSwitcher] 5. changeLanguage success', data);

            // 4. Refresh Session
            await refreshSessionContext();

            // 5. Build Redirect URL
            // User requested to ALWAYS redirect to frontpage with new language prefix
            let redirectPath = localePath('/', targetLocaleCode as any);
            console.log('[LanguageSwitcher] 6. Redirecting to homepage:', redirectPath);

            // 6. Redirect
            window.location.assign(redirectPath);

        } catch (e) {
            console.error('[LanguageSwitcher] ERROR in switchLanguage:', e);
        }
    };

    return {
        switchLanguage
    };
};
