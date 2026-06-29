import type { Schemas } from "#shopware";

export const slugify = (text: string): string => {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .trim();
};

export const getCategoryUrl = (category: Schemas['Category']): string => {
    if (!category) return '/';

    const id = category.id;
    const name = category.translated?.name || category.name;

    // 1. Try to use pre-resolved seoUrl IF it is not technical
    if (category.seoUrl && !category.seoUrl.startsWith('/navigation/') && !category.seoUrl.startsWith('navigation/')) {
        return `/${category.seoUrl.startsWith('/') ? category.seoUrl.slice(1) : category.seoUrl}`;
    }

    // 2. Try to use seoUrls array IF valid
    if (category.seoUrls && category.seoUrls.length > 0) {
        const seoPath = category.seoUrls[0]?.seoPathInfo;
        if (seoPath && !seoPath.startsWith('navigation/')) {
            return `/${seoPath.startsWith('/') ? seoPath.slice(1) : seoPath}`;
        }
    }

    // 3. Fallback to slugified name for "Fake" SEO URL
    if (name && name !== 'undefined') {
        return `/${slugify(name)}`;
    }

    // 4. Absolute fallback to ID
    if (id && id !== 'undefined') {
        return `/navigation/${id}`;
    }

    return '/';
};

/**
 * Resolves the best URL for a product.
 * Prioritizes the SLICKLY pattern: /[slugified-name]/[product-number]
 */
export const getProductUrl = (product: any): string => {
    if (!product) return '/';

    // Defensive mapping for inconsistent objects (e.g. cart items vs full product entities)
    const sku = product.productNumber || product.payload?.productNumber || product.sku;
    const name = product.translated?.name || product.name || product.label || product.payload?.translated?.name;
    const id = product.id || product.referencedId || product.payload?.id;

    // 1. SLICKLY Standard: /[slugified-name]/[product-number]
    // Only if both are present and not literally the string "undefined"
    if (name && sku && name !== 'undefined' && sku !== 'undefined') {
        return `/${slugify(name)}/${sku}`;
    }

    // 2. Fallback: Try to use pre-resolved seoUrl if it is not technical
    if (product.seoUrl && !product.seoUrl.startsWith('/detail/') && !product.seoUrl.startsWith('detail/')) {
        return `/${product.seoUrl.startsWith('/') ? product.seoUrl.slice(1) : product.seoUrl}`;
    }

    // 3. Try to use seoUrls array if available
    if (product.seoUrls && product.seoUrls.length > 0) {
        const seoPath = product.seoUrls[0]?.seoPathInfo;
        if (seoPath && !seoPath.startsWith('detail/')) {
            return `/${seoPath.startsWith('/') ? seoPath.slice(1) : seoPath}`;
        }
    }

    // 4. Absolute fallback to technical detail path
    if (id && id !== 'undefined') {
        return `/detail/${id}`;
    }

    return '/';
};

/**
 * Polymorphic URL resolver for SLICKLY.
 * Detects entity type (Product, Category, or String) and returns the correct localized URL.
 */
export const resolveUrl = (entity: any): string => {
    if (!entity) return '/';
    if (typeof entity === 'string') return entity;

    // 1. Detect PRODUCT
    // Shopware products usually have productNumber or were identified by the resolver as 'frontend.detail.page'
    if (entity.productNumber || entity.routeName === 'frontend.detail.page' || entity.referencedId) {
        return getProductUrl(entity);
    }

    // 2. Detect CATEGORY
    // Shopware categories have 'frontend.navigation.page' routeName or specific category properties
    if (entity.routeName === 'frontend.navigation.page' || entity.displayGroup === null || (entity.level && entity.path)) {
        return getCategoryUrl(entity);
    }

    // 3. Last fallback
    return '/';
};
