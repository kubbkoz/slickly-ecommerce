export function useOrganizationJsonLD(): void {
    const config = useRuntimeConfig();
    const appConfig = useAppConfig();
    const baseUrl = (config.public.siteUrl as string) || 'https://mtsport.store';
    const phone = appConfig.contact.phone;

    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'SLICKLY',
        url: baseUrl,
        logo: `${baseUrl}/logo.svg`,
        contactPoint: [
            {
                '@type': 'ContactPoint',
                telephone: phone.main,
                contactType: 'customer service',
                areaServed: ['SK', 'CZ', 'PL', 'HU', 'DE', 'AT'],
                availableLanguage: ['Slovak', 'Czech'],
            },
            {
                '@type': 'ContactPoint',
                telephone: phone.complaints,
                contactType: 'returns',
                areaServed: 'SK',
            },
        ],
        sameAs: [
            'https://www.facebook.com/mtsport.store',
            'https://www.instagram.com/mtsport.store',
        ],
    };

    const webSiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'SLICKLY',
        url: baseUrl,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${baseUrl}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };

    useHead({
        script: [
            { type: 'application/ld+json', children: JSON.stringify(organizationSchema) },
            { type: 'application/ld+json', children: JSON.stringify(webSiteSchema) },
        ],
    });
}
