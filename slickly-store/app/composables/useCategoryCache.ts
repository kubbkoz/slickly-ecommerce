import { useShopwareContext, useAsyncData, useI18n, useShopwareLanguage, useNuxtApp } from '#imports';
import { withRetry } from '~/utils/retry';

interface CachedCategory {
    id: string;
    name: string;
    slug: string;            // slugified name (dashes, lowercase)
    parentId: string | null;
    seoPathInfo?: string;     // canonical SEO URL slug if available
    url: string;              // final URL for links (from seoUrls or slugified name)
    children?: CachedCategory[];
}

/**
 * Global category cache — fetches ALL active categories ONCE per locale
 * and builds a slug→category lookup map for instant O(1) resolution.
 *
 * Used by:
 * - PageResolver ([...all].vue) for fast slug → categoryId resolution
 * - DesktopNav for main menu items
 * - useCategory (StickyToolbar) for subcategory list
 */
export const useCategoryCache = () => {
    const { apiClient } = useShopwareContext();
    const { locale } = useI18n();
    const { currentLanguageId } = useShopwareLanguage();
    const langId = currentLanguageId.value;

    // Slugify helper — matches the url.ts slugify logic
    const slugify = (text: string): string =>
        text.toString().toLowerCase().normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-')
            .trim();

    // Main data fetch — cached per locale via useAsyncData key
    const { data: allCategories } = useAsyncData<CachedCategory[]>(
        `category-cache-${locale.value}`,
        async () => {
            try {
                // Fetch active+visible categories (limit 100 = Shopware MAX_LIMIT)
                // Children come via associations, not counted against this limit
                const response = await withRetry(() => apiClient.invoke("readCategoryList post /category", {
                    headers: { "sw-language-id": langId },
                    body: {
                        limit: 100,
                        filter: [
                            { type: "equals", field: "active", value: true },
                            { type: "equals", field: "visible", value: true },
                        ],
                        associations: {
                            seoUrls: {},
                            media: {},
                            children: {
                                filter: [
                                    { type: "equals", field: "active", value: true },
                                    { type: "equals", field: "visible", value: true },
                                ],
                                associations: {
                                    seoUrls: {},
                                    media: {},
                                }
                            }
                        },
                        // §4 — payload trim: len polia použité v resolveSlug/getNavCategories/getSubcategories
                        includes: {
                            category: ['id', 'name', 'translated', 'parentId', 'seoUrls', 'media', 'children'],
                            seo_url: ['seoPathInfo', 'isCanonical'],
                            media: ['url'],
                        }
                    }
                }));

                const elements = response.data.elements || [];
                return elements.map((cat: any) => {
                    const seoPath = cat.seoUrls?.[0]?.seoPathInfo;
                    const name = cat.translated?.name || cat.name || '';
                    return {
                        id: cat.id,
                        name,
                        slug: slugify(name),
                        parentId: cat.parentId,
                        seoPathInfo: seoPath,
                        url: seoPath ? `/${seoPath}` : `/${slugify(name)}`,
                        children: cat.children?.map((child: any) => {
                            const childSeoPath = child.seoUrls?.[0]?.seoPathInfo;
                            const childName = child.translated?.name || child.name || '';
                            return {
                                id: child.id,
                                name: childName,
                                slug: slugify(childName),
                                parentId: child.parentId,
                                seoPathInfo: childSeoPath,
                                url: childSeoPath ? `/${childSeoPath}` : `/${slugify(childName)}`,
                            };
                        }) || [],
                    } as CachedCategory;
                });
            } catch (e) {
                console.error('[CategoryCache] Failed to load:', e);
                return [];
            }
        },
        {
            lazy: true, // ← non-blocking: loads in background after first page render
            getCachedData(key) {
                // fetch-once: reuse naprieč navigáciami (rovnaký vzor ako useCategory.ts)
                const nuxtApp = useNuxtApp();
                return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
            }
        }
    );

    /**
     * O(1) slug → categoryId lookup.
     * Tries: exact SEO path match → slugified name match → hyphenated slug match.
     */
    const resolveSlug = (slug: string): CachedCategory | null => {
        if (!allCategories.value) return null;

        const normalizedSlug = slug.replace(/^\//, '').replace(/\/$/, '').toLowerCase();

        for (const cat of allCategories.value) {
            // Check top-level
            if (cat.seoPathInfo === normalizedSlug) return cat;
            if (cat.slug === normalizedSlug) return cat;
            // Hyphened slug match (e.g. "elektrobicykle" matches "Elektrobicykle")
            if (slugify(cat.name) === normalizedSlug) return cat;

            // Check children
            for (const child of (cat.children || [])) {
                if (child.seoPathInfo === normalizedSlug) return child;
                if (child.slug === normalizedSlug) return child;
                if (slugify(child.name) === normalizedSlug) return child;
            }
        }

        return null;
    };

    /**
     * Get top-level navigation categories (for DesktopNav main menu)
     */
    const getNavCategories = (rootParentId: string) => {
        return computed(() => {
            if (!allCategories.value) return [];
            return allCategories.value.filter(c => c.parentId === rootParentId);
        });
    };

    /**
     * Get subcategories for a given category ID (for StickyToolbar)
     */
    const getSubcategories = (categoryId: string) => {
        return computed(() => {
            if (!allCategories.value) return [];
            // If it's a top-level category, return its children
            const topLevel = allCategories.value.find(c => c.id === categoryId);
            if (topLevel) return topLevel.children || [];
            // If it's a sub-level category, return siblings
            for (const parent of allCategories.value) {
                if (parent.children?.some(c => c.id === categoryId)) {
                    return parent.children;
                }
            }
            return [];
        });
    };

    return {
        allCategories,
        resolveSlug,
        getNavCategories,
        getSubcategories,
        slugify,
    };
};
