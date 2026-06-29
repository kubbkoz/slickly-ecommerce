import type { Schemas } from '#shopware';

type Breadcrumb = { name: string; path: string };

export function useProductJsonLD(
    product: Schemas['Product'],
    breadcrumbs: Breadcrumb[] = [],
): void {
    // useRequestURL() funguje na SSR aj CSR — eliminuje window check a hardcoded fallback
    const { origin: baseUrl } = useRequestURL();

    const p = product as any;

    const name        = p.translated?.name || p.name || '';
    const description = p.translated?.description
        ? p.translated.description.replace(/<[^>]*>/g, '').trim()
        : '';
    const sku      = p.productNumber || '';
    const price    = p.calculatedPrice?.unitPrice ?? p.price?.gross ?? 0;
    const coverUrl = p.cover?.media?.url || p.media?.[0]?.media?.url || '';
    const images   = [
        coverUrl,
        ...(p.media || []).map((m: any) => m.media?.url).filter(Boolean),
    ].filter(Boolean);
    const inStock    = (p.availableStock ?? p.stock ?? 0) > 0 || p.isCloseout === false;
    const seoPath    = p.seoUrls?.[0]?.seoPathInfo || '';
    const productUrl = `${baseUrl}/${seoPath}`;
    const brand      = p.manufacturer?.translated?.name || p.manufacturer?.name || '';

    const productSchema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name,
        sku,
        url: productUrl,
        offers: {
            '@type': 'Offer',
            url: productUrl,
            priceCurrency: 'EUR',
            price: price.toFixed(2),
            availability: inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            seller: { '@type': 'Organization', name: 'SLICKLY' },
        },
    };

    if (description) productSchema.description = description;
    if (images.length) productSchema.image = images.length === 1 ? images[0] : images;
    if (brand) productSchema.brand = { '@type': 'Brand', name: brand };

    // AggregateRating — zobrazuje hviezdičky priamo vo výsledkoch Google
    const rating       = p.ratingAverage ?? p.rating ?? 0;
    const reviewCount  = p.productReviewsCount ?? p.reviewsCount ?? 0;
    if (rating > 0 && reviewCount > 0) {
        productSchema.aggregateRating = {
            '@type':       'AggregateRating',
            ratingValue:   rating.toFixed(1),
            reviewCount,
            bestRating:    '5',
            worstRating:   '1',
        };
    }

    // isVariantOf — pre variant produkty prepája na parent ProductGroup
    if (p.parentId) {
        productSchema.isVariantOf = {
            '@type': 'ProductGroup',
            url: productUrl.replace(/\/[^/]+$/, ''), // approximácia parent URL
        };
    }

    const scripts: { type: string; children: string }[] = [
        { type: 'application/ld+json', children: JSON.stringify(productSchema) },
    ];

    // BreadcrumbList
    if (breadcrumbs.length > 0) {
        const crumbs = [
            { name: 'Domov', url: baseUrl },
            ...breadcrumbs.map((b) => ({
                name: b.name,
                url: `${baseUrl}/${b.path.replace(/^\//, '')}`,
            })),
            { name, url: productUrl },
        ];

        scripts.push({
            type: 'application/ld+json',
            children: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: crumbs.map((crumb, i) => ({
                    '@type':    'ListItem',
                    position:   i + 1,
                    name:       crumb.name,
                    item:       crumb.url,
                })),
            }),
        });
    }

    // FAQPage schema — primárny citáciový zdroj pre Google SGE a AI search engines
    // Priorita: custom fields (mts_faq_q1/mts_faq_a1 ... q5/a5) → auto-generated fallback
    const faqItems: { question: string; answer: string }[] = [];

    for (let i = 1; i <= 5; i++) {
        const q = p.customFields?.[`mts_faq_q${i}`];
        const a = p.customFields?.[`mts_faq_a${i}`];
        if (q && a) faqItems.push({ question: String(q), answer: String(a) });
    }

    // Auto-generated FAQs ak custom fields nie sú vyplnené
    if (faqItems.length === 0 && name) {
        faqItems.push({
            question: `Kde kúpiť ${name}?`,
            answer: `${name} je dostupný na SLICKLY e-shope. ${inStock ? 'Produkt je aktuálne skladom.' : 'Produkt je dostupný na objednávku.'} Aktuálna cena: ${price.toFixed(2)} €.`,
        });
        if (brand) {
            faqItems.push({
                question: `Kto vyrába ${name}?`,
                answer: `${name} je produkt značky ${brand}, ktorú SLICKLY distribuuje na slovenskom trhu.`,
            });
        }
        faqItems.push({
            question: `Aká je záruka na ${name}?`,
            answer: `Na produkty zakúpené v SLICKLY e-shope sa vzťahuje zákonná záruka 24 mesiacov. Viac informácií nájdete v sekcii Záručné podmienky.`,
        });
    }

    if (faqItems.length > 0) {
        scripts.push({
            type: 'application/ld+json',
            children: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqItems.map((item) => ({
                    '@type': 'Question',
                    name: item.question,
                    acceptedAnswer: { '@type': 'Answer', text: item.answer },
                })),
            }),
        });
    }

    useHead({ script: scripts });
}
