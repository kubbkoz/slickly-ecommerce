// Sitemap dynamically generated from Shopware SEO URLs.
// Cached 1 hour via Nitro routeRules in nuxt.config.ts.

interface SeoUrlItem {
    seoPathInfo: string;
    routeName: string;
    isCanonical: boolean;
    isDeleted: boolean;
    updatedAt?: string;
}

async function fetchSeoUrlPage(
    apiBase: string,
    accessToken: string,
    salesChannelId: string,
    page: number,
    limit = 500,
): Promise<{ elements: SeoUrlItem[]; total: number }> {
    const res = await $fetch<any>(`${apiBase}seo-url`, {
        method: 'POST',
        headers: {
            'sw-access-key': accessToken,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            filter: [
                { type: 'equals', field: 'isDeleted', value: false },
                { type: 'equals', field: 'isCanonical', value: true },
                { type: 'equals', field: 'salesChannelId', value: salesChannelId },
            ],
            includes: { seo_url: ['seoPathInfo', 'routeName', 'isCanonical', 'isDeleted', 'updatedAt'] },
            limit,
            page,
        }),
    });
    return { elements: res?.elements ?? [], total: res?.total ?? 0 };
}

function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const apiBase: string = (config.public?.shopware?.endpoint as string) || 'https://mtsport.store/store-api/';
    const accessToken: string = (config.public?.shopware?.accessToken as string) || '';
    const salesChannelId: string = (config.public?.shopware?.ids?.salesChannel as string) || '';
    const baseUrl: string = (config.public?.siteUrl as string) || 'https://mtsport.store';

    // Static pages always included
    const staticUrls: { loc: string; changefreq: string; priority: string }[] = [
        { loc: baseUrl, changefreq: 'daily', priority: '1.0' },
        { loc: `${baseUrl}/search`, changefreq: 'weekly', priority: '0.5' },
    ];

    // Fetch all canonical SEO URLs from Shopware (paginated, max 2000 URLs per request)
    const allSeoUrls: SeoUrlItem[] = [];
    try {
        const firstPage = await fetchSeoUrlPage(apiBase, accessToken, salesChannelId, 1);
        allSeoUrls.push(...firstPage.elements);

        const totalPages = Math.ceil(firstPage.total / 500);
        if (totalPages > 1) {
            const remaining = await Promise.all(
                Array.from({ length: totalPages - 1 }, (_, i) =>
                    fetchSeoUrlPage(apiBase, accessToken, salesChannelId, i + 2),
                ),
            );
            remaining.forEach((r) => allSeoUrls.push(...r.elements));
        }
    } catch (err) {
        console.error('[sitemap.xml] Shopware SEO URL fetch failed:', err);
    }

    // Filter: only product + category pages, exclude admin/internal routes
    const allowedRoutes = new Set([
        'frontend.detail.page',
        'frontend.navigation.page',
        'frontend.landing.page',
    ]);
    const seoEntries = allSeoUrls.filter(
        (u) => u.seoPathInfo && allowedRoutes.has(u.routeName),
    );

    // Build XML
    const urlEntries = [
        ...staticUrls.map(
            (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
        ),
        ...seoEntries.map((u) => {
            const loc = escapeXml(`${baseUrl}/${u.seoPathInfo}`);
            const isProduct = u.routeName === 'frontend.detail.page';
            return `  <url>
    <loc>${loc}</loc>
    <changefreq>${isProduct ? 'weekly' : 'daily'}</changefreq>
    <priority>${isProduct ? '0.8' : '0.9'}</priority>
    ${u.updatedAt ? `<lastmod>${u.updatedAt.split('T')[0]}</lastmod>` : ''}
  </url>`;
        }),
    ];

    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries.join('\n')}
</urlset>`;
});
