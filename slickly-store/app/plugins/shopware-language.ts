import { defineNuxtPlugin, useRoute } from '#app';
import { useShopwareContext } from '#imports';

export default defineNuxtPlugin((nuxtApp) => {
    const route = useRoute();
    const { apiClient } = useShopwareContext();
    const config = useRuntimeConfig();

    const langMap = config.public.shopware.ids.languages;

    // FIX-2.4: Replaced fragile startsWith('/cz') which matched unrelated paths like /czar-bike.
    // Now uses an ordered PREFIX_MAP with explicit trailing-slash guards.
    // Tuple order matters: longer prefixes (e.g. '/cz/') must come before shorter ones (e.g. '/cz').
    const PREFIX_MAP: [string, string][] = [
        ['/cz/', langMap.cz], ['/pl/', langMap.pl],
        ['/en/', langMap.en], ['/de/', langMap.de], ['/hu/', langMap.hu],
        ['/cz',  langMap.cz], ['/pl',  langMap.pl],
        ['/en',  langMap.en], ['/de',  langMap.de], ['/hu',  langMap.hu],
    ];

    (apiClient as any).hook('request', (requestContext: any) => {
        const path = route.path;
        const langId = PREFIX_MAP.find(([prefix]) =>
            path === prefix || path.startsWith(prefix + '/') || path.startsWith(prefix)
        )?.[1] ?? langMap.sk!;

        requestContext.headers = {
            ...requestContext.headers,
            'sw-language-id': langId
        };
    });
});
