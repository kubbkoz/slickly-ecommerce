import { computed, isRef, unref } from 'vue';
import { useNavigation, useShopwareContext, useAsyncData, useI18n, useShopwareLanguage, useNuxtApp, useRuntimeConfig } from '#imports';
import { getCategoryUrl } from '~/utils/url';

/**
 * Resolves active category, full breadcrumb chain, subcategory navigation list,
 * and hierarchical URLs from the current navigationId.
 *
 * Category hierarchy model:
 * - Level 1: Root (Domov) — hidden in breadcrumb
 * - Level 2: /bicykle
 * - Level 3: /horske-bicykle
 * - Level 4: /horske-bicykle/panske  (hierarchické URL)
 *
 * Synchronous composable - registers useAsyncData during component setup.
 */
// Shopware IDs môžu byť 32 hex znakov BEZ pomlčiek ALEBO štandardný UUID s pomlčkami
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$|^[0-9a-f]{32}$/i;
const isValidUuid = (id: unknown): id is string => typeof id === 'string' && UUID_REGEX.test(id);

export const useCategory = (navigationIdProp: string | any) => {
    // Defensive ID resolution: unref() pre prípad keď sa odovzdá Ref<string> alebo objekt namiesto čistého stringu
    const _rawId = unref(navigationIdProp);
    const navigationId: string = (
        typeof _rawId === 'string' ? _rawId :
        (_rawId && typeof _rawId === 'object' && typeof _rawId.id === 'string') ? _rawId.id :
        ''
    );
    const { apiClient } = useShopwareContext();
    const { locale } = useI18n();
    const { currentLanguageId } = useShopwareLanguage();
    // FIX-1.5: Root category ID from runtimeConfig — not hardcoded anymore.
    const config = useRuntimeConfig();
    const rootCategoryId = config.public.rootCategoryId as string;

    // 1. Global nav tree (Level 2 categories — children of root)
    const { data: navigationElements } = useAsyncData<any[]>(
        `global-navigation-tree-${locale.value}`,
        async () => {
            try {
                const response = await apiClient.invoke("readCategoryList post /category", {
                    headers: { "sw-language-id": currentLanguageId.value },
                    body: {
                        limit: 100,
                        filter: [
                            { type: "equals", field: "parentId", value: rootCategoryId },
                            { type: "equals", field: "active", value: true },
                            { type: "equals", field: "visible", value: true }
                        ],
                        associations: {
                            children: {
                                filter: [
                                    { type: "equals", field: "active", value: true },
                                    { type: "equals", field: "visible", value: true }
                                ],
                                associations: {
                                    seoUrls: {},
                                    media: {}
                                }
                            },
                            seoUrls: {},
                            media: {}
                        },
                    }
                });
                return response.data.elements || [];
            } catch (e) {
                console.error('Failed to load global nav tree', e);
                return [];
            }
        },
        {
            lazy: true,
            getCachedData(key) {
                const nuxtApp = useNuxtApp();
                return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
            }
        }
    );

    // 2. Current category data — includes `path` (pipe-separated parentId chain) and `breadcrumb`
    const { data: categoryDataResponse, status: categoryStatusVal } = useAsyncData<any>(
        `category-${navigationId}-${locale.value}`,
        async () => {
            if (!isValidUuid(navigationId)) {
                console.warn('[useCategory] Invalid UUID for category fetch:', navigationId);
                return null;
            }
            try {
                const res = await apiClient.invoke(`readCategory post /category/${navigationId}` as any, {
                    headers: { "sw-language-id": currentLanguageId.value },
                    body: { associations: { media: {} } }
                });
                return res.data;
            } catch (e) {
                console.error('Category fetch error:', e);
                return null;
            }
        },
        {
            lazy: true,
            getCachedData(key) {
                const nuxtApp = useNuxtApp();
                return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
            }
        }
    );

    // 3. Direct children of current category (for subcategory grid)
    const { data: categoryChildrenResponse } = useAsyncData<any[]>(
        `category-children-${navigationId}-${locale.value}`,
        async () => {
            if (!isValidUuid(navigationId)) {
                console.warn('[useCategory] Invalid UUID for children fetch:', navigationId);
                return [];
            }
            try {
                const response = await apiClient.invoke("readCategoryList post /category", {
                    headers: { "sw-language-id": currentLanguageId.value },
                    body: {
                        filter: [
                            { type: "equals", field: "parentId", value: navigationId },
                            { type: "equals", field: "active", value: true }
                        ],
                        associations: {
                            media: {},
                            seoUrls: {}
                        }
                    }
                });
                return response.data?.elements || [];
            } catch (e) {
                console.error("Failed to load category children", e);
                return [];
            }
        },
        {
            lazy: true,
            getCachedData(key) {
                const nuxtApp = useNuxtApp();
                return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
            }
        }
    );

    // 4. Ancestor chain — načítame VŠETKY ancestor kategórie naraz pre breadcrumb
    //    category.path = "|rootId|bicykleId|horskeId|" → z toho vieme IDs predkov
    const { data: ancestorCategories } = useAsyncData<any[]>(
        `category-ancestors-${navigationId}-${locale.value}`,
        async () => {
            if (!isValidUuid(navigationId)) return [];
            // Počkáme na category data (spustí sa len po kategórii fetch)
            // Načítame kategóriu znову s path info (category data z bodu 2 to má)
            try {
                const res = await apiClient.invoke(`readCategory post /category/${navigationId}` as any, {
                    headers: { "sw-language-id": currentLanguageId.value },
                    body: {}
                });
                const cat = res.data;
                if (!cat?.path) return [];

                // path = "|rootId|bicykleId|horskeId|" → vyextrahujeme IDs (bez root)
                const pathIds = cat.path
                    .split('|')
                    .filter((id: string) => id.trim() && isValidUuid(id.trim()))
                    .filter((id: string) => id !== rootCategoryId); // Vynechať root

                if (pathIds.length === 0) return [];

                // Načítame všetky ancestor kategórie naraz
                const ancestorRes = await apiClient.invoke("readCategoryList post /category", {
                    headers: { "sw-language-id": currentLanguageId.value },
                    body: {
                        filter: [
                            { type: "equalsAny", field: "id", value: pathIds }
                        ],
                        associations: {
                            seoUrls: {}
                        },
                        limit: 20
                    }
                });

                const cats = ancestorRes.data?.elements || [];
                // Zoradiť podľa level — level 2 (root children) je prvý
                cats.sort((a: any, b: any) => (a.level || 0) - (b.level || 0));
                return cats;
            } catch (e) {
                console.error('[useCategory] Failed to load ancestors:', e);
                return [];
            }
        },
        {
            lazy: true,
            getCachedData(key) {
                const nuxtApp = useNuxtApp();
                return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
            }
        }
    );

    // --- Derived computeds ---

    const categoryData = computed(() => categoryDataResponse.value);
    const categoryStatus = computed(() => categoryStatusVal.value);
    const categoryName = computed(() => categoryData.value?.translated?.name || categoryData.value?.name || '');
    const categoryDescription = computed(() => categoryData.value?.translated?.description || '');
    const categoryImage = computed(() => categoryData.value?.media?.url || '');
    const categoryLevel = computed(() => categoryData.value?.level || 2);
    // SEO fields from Shopware category settings
    const categoryMetaTitle       = computed(() => categoryData.value?.translated?.metaTitle       || categoryData.value?.metaTitle       || '');
    const categoryMetaDescription = computed(() => categoryData.value?.translated?.metaDescription || categoryData.value?.metaDescription || '');
    const categoryKeywords        = computed(() => categoryData.value?.translated?.keywords        || categoryData.value?.keywords        || '');

    // parentCategory — len priamy predok (pre back-compat so StickyToolbar)
    const parentCategory = computed(() => {
        if (!navigationElements.value) return null;
        // Level 2 kategória nemá parent (okrem root)
        const isTopLevel = navigationElements.value.find((cat: any) => cat.id === navigationId);
        if (isTopLevel) return null;
        // Level 3: pozri priamy parent v nav tree
        for (const parent of navigationElements.value) {
            if (parent.children?.find((child: any) => child.id === navigationId)) {
                return parent;
            }
        }
        // Level 4+: použijeme ancestors
        if (ancestorCategories.value && ancestorCategories.value.length > 0) {
            return ancestorCategories.value[ancestorCategories.value.length - 1]; // priamy parent
        }
        return null;
    });

    const isTopLevelCategory = computed(() => categoryLevel.value <= 2);

    /**
     * Plný breadcrumb chain (bez Domov/root, bez aktuálnej kategórie).
     * Formát: [{name, url}, ...]
     * Pre Pánske (level 4): [{name: 'Bicykle', url: '/bicykle'}, {name: 'Horské bicykle', url: '/horske-bicykle'}]
     */
    const breadcrumbChain = computed(() => {
        const ancestors = ancestorCategories.value || [];
        // Pre level 2 (napr. /bicykle) — žiadny breadcrumb predok
        if (ancestors.length === 0) return [];

        return ancestors.map((cat: any) => ({
            id: cat.id,
            name: cat.translated?.name || cat.name || '',
            url: getCategoryUrl(cat)
        }));
    });

    /**
     * Hierarchické URL pre aktuálnu kategóriu
     * Level 2: /bicykle
     * Level 3: /horske-bicykle (flat SEO URL)
     * Level 4: /horske-bicykle/panske (poskladané z parent SEO slug + vlastný slug)
     */
    const currentCategoryUrl = computed(() => {
        if (!categoryData.value) return '/';
        // Pre level 2 a 3 — použijeme SEO URL priamo
        if (categoryLevel.value <= 3) return getCategoryUrl(categoryData.value);
        // Pre level 4+ — poskladáme hierarchickú URL
        const ownSlug = getCategoryUrl(categoryData.value).replace(/^\//, '');
        const parentAncestor = ancestorCategories.value?.find((a: any) => a.level === (categoryLevel.value - 1));
        if (parentAncestor) {
            const parentSlug = getCategoryUrl(parentAncestor).replace(/^\//, '');
            if (parentSlug && !parentSlug.startsWith('navigation/')) {
                return `/${parentSlug}/${ownSlug}`;
            }
        }
        return `/${ownSlug}`;
    });

    /**
     * Subcategory list — pre grid v hero sekcii.
     * URL pre child kategórie (level 4):
     *   poskladané ako currentCategoryUrl + "/" + childSlug
     */
    const subcategories = computed(() => {
        const buildChildUrl = (child: any): string => {
            const childSlug = getCategoryUrl(child).replace(/^\//, '');
            // Ak sme na level 3 stránke (/horske-bicykle), child je level 4 → /horske-bicykle/panske
            const parentSlug = categoryLevel.value >= 3
                ? getCategoryUrl(categoryData.value).replace(/^\//, '')
                : null;

            if (parentSlug && !parentSlug.startsWith('navigation/') && childSlug && !childSlug.startsWith('navigation/')) {
                return `/${parentSlug}/${childSlug}`;
            }
            return `/${childSlug}`;
        };

        // Priority 1: Direct children of the currently loaded category
        if (categoryChildrenResponse.value && categoryChildrenResponse.value.length > 0) {
            return categoryChildrenResponse.value.map((c: any) => ({
                id: c.id,
                name: (c.translated?.name || c.name || '').trim(),
                image: c.media?.url || '',
                description: c.translated?.description || c.description || '',
                url: buildChildUrl(c)
            }));
        }

        // Priority 2: Fallback to siblings (legacy logic for level 2 pages)
        let source: any[] = [];
        if (isTopLevelCategory.value) {
            const navItem = navigationElements.value?.find((cat: any) => cat.id === navigationId);
            source = navItem?.children || [];
        } else {
            source = parentCategory.value?.children || [];
        }

        return source
            .filter((c: any) => c.id !== navigationId)
            .map((c: any) => ({
                id: c.id,
                name: (c.translated?.name || c.name || '').trim(),
                image: c.media?.url || '',
                description: c.translated?.description || c.description || '',
                url: getCategoryUrl(c)
            }));
    });

    // "Všetky produkty" link in StickyToolbar — URL priameho parenta
    const parentCategoryUrl = computed(() => {
        if (parentCategory.value) return getCategoryUrl(parentCategory.value);
        return getCategoryUrl({ id: navigationId } as any);
    });

    // Active subcategory for StickyToolbar highlighting (null = "Všetky" is active)
    const activeSubcategory = computed(() => (isTopLevelCategory.value ? null : navigationId));

    return {
        parentCategory,
        isTopLevelCategory,
        categoryData,
        categoryStatus,
        categoryName,
        categoryDescription,
        categoryImage,
        categoryLevel,
        categoryMetaTitle,
        categoryMetaDescription,
        categoryKeywords,
        breadcrumbChain,
        currentCategoryUrl,
        subcategories,
        parentCategoryUrl,
        activeSubcategory,
    };
};
