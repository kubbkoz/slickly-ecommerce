import { useRouter } from '#imports';
import { getProductUrl as resolveProductUrl } from '~/utils/url';

/**
 * Pure product display helpers — pricing, image resolution, variant parsing.
 * No reactive state, all are plain functions.
 */
export const useProductHelpers = () => {
    const router = useRouter();
    const config = useRuntimeConfig();

    // 1x1 gray GIF — prevents infinite 404 loops on broken images
    const FALLBACK_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';

    const handleImageError = (e: Event, product: any) => {
        const target = e.target as HTMLImageElement;
        if (target.src === FALLBACK_IMAGE) return;
        console.warn(`[Image Error] ${product.name} (${product.id})`);
        target.src = FALLBACK_IMAGE;
    };

    // V dev prostredí (localhost) browser blokuje cross-origin requesty na mtsport.store
    // cez ERR_BLOCKED_BY_ORB. Preto prečmerujeme cez exiustujúci Nitro devProxy /mts-proxy.
    // Na produkcii (resp. na mtsport.store) sú oba origin rovnaké — proxy sa nepoužíva.
    const rewriteForDev = (url: string): string => {
        if (!import.meta.dev) return url;
        return url.replace(/^https:\/\/mtsport\.store/, '/mts-proxy');
    };

    const getProductImageUrl = (product: any): string => {
        if (!product) return FALLBACK_IMAGE;
        if (product.cover?.media?.url) return rewriteForDev(product.cover.media.url);
        if (Array.isArray(product.media) && product.media.length > 0) {
            return rewriteForDev(product.media[0]?.media?.url || FALLBACK_IMAGE);
        }
        return FALLBACK_IMAGE;
    };

    // Returns the 2nd image from the media gallery for desktop hover swap.
    const getSecondaryImageUrl = (product: any): string => {
        if (!product || !Array.isArray(product.media) || product.media.length < 2) return FALLBACK_IMAGE;

        // Manual sort by position as a safety fallback if server sort is inconsistent
        const sortedMedia = [...product.media].sort((a, b) => (a.position || 0) - (b.position || 0));
        
        // Index 1 is the second image in the gallery.
        const url = sortedMedia[1]?.media?.url ?? null;
        return url ? rewriteForDev(url) : FALLBACK_IMAGE;
    };

    const calculateDiscount = (product: any): number => {
        const price = product.calculatedPrice?.unitPrice ?? product.price?.[0]?.gross;
        const listPrice = product.calculatedPrice?.listPrice?.price ?? product.price?.[0]?.listPrice?.gross;
        if (listPrice && price && listPrice > price) {
            return Math.round(((listPrice - price) / listPrice) * 100);
        }
        return 0;
    };

    const getPrice = (product: any) =>
        product.calculatedPrice?.unitPrice ?? product.price?.[0]?.gross;

    const getOldPrice = (product: any) =>
        product.calculatedPrice?.listPrice?.price ?? null;

    // Resolves the best URL for a product using the centralized SLICKLY resolver logic.
    const getProductUrl = (product: any): string => {
        return resolveProductUrl(product);
    };

    const navigateToProduct = (product: any) => {
        const localePath = useLocalePath();
        router.push(localePath(getProductUrl(product)));
    };

    // Variant label resolution priority:
    // 1. Exact group ID match (Shopware-specific "Veľkosť rámu" group IDs)
    // 2. Name match for common size group names
    // 3. Any option that resembles a size (short string with digit)
    // 4. First option as absolute fallback
    const getVariantLabel = (child: any, parent: any): string => {
        // 0. Primary source: variation (pre-merged string array from Shopware)
        if (Array.isArray(child.variation) && child.variation.length > 0) {
            // Join all variation names (e.g. ["M 45", "Black"])
            return child.variation.map((v: any) => v.name || v.translated?.name).filter(Boolean).join(', ');
        }

        // 1. Traditional options/properties mapping
        let allOptions: any[] = [...(child.options || []), ...(child.properties || [])];

        if (parent?.configuratorSettings && child.optionIds) {
            const parentOptions = parent.configuratorSettings
                .filter((cs: any) => child.optionIds.includes(cs.optionId))
                .map((cs: any) => cs.option);
            allOptions = [...allOptions, ...parentOptions];
        }

        if (allOptions.length === 0) {
            // If we have name but it contains (Variant), it's not a useful label
            const n = child.translated?.name || child.name || '';
            if (n.toUpperCase().includes('(VARIANT)')) return '';
            return n;
        }

        const FRAME_SIZE_GROUP_IDS = [
            config.public.shopware.ids.properties.frameSize,
            config.public.shopware.ids.properties.size,
        ];

        const exactMatch = allOptions.find((o: any) =>
            FRAME_SIZE_GROUP_IDS.includes(o.groupId) || FRAME_SIZE_GROUP_IDS.includes(o.group?.id)
        );
        if (exactMatch) return exactMatch.translated?.name || exactMatch.name;

        const SIZE_GROUP_NAMES = ['veľkosť rámu', 'veľkosť', 'size', 'frame size'];
        const nameMatch = allOptions.find((o: any) =>
            SIZE_GROUP_NAMES.includes((o.group?.translated?.name || o.group?.name || '').toLowerCase())
        );
        if (nameMatch) return nameMatch.translated?.name || nameMatch.name;

        const sizelike = allOptions.find((o: any) => {
            const n = o.translated?.name || o.name || '';
            return n.length < 20 && /\d/.test(n);
        });
        if (sizelike) return sizelike.translated?.name || sizelike.name;

        return allOptions[0]?.translated?.name || allOptions[0]?.name || '';
    };

    const hasPriceVariance = (product: any): boolean => {
        const variants = product.children || product.variants || [];
        if (variants.length === 0) return false;
        
        const firstPrice = getPrice(variants[0]);
        // Only returns true if at least one variant has a different price than the first one
        return variants.some((v: any) => getPrice(v) !== firstPrice);
    };

    const sortVariants = (children: any[], parent: any) =>
        [...children].sort((a, b) => {
            const labelA = getVariantLabel(a, parent);
            const labelB = getVariantLabel(b, parent);
            const numA = parseFloat(labelA.match(/\d+(\.\d+)?/)?.[0] || '0');
            const numB = parseFloat(labelB.match(/\d+(\.\d+)?/)?.[0] || '0');
            if (numA && numB && numA !== numB) return numA - numB;
            return labelA.localeCompare(labelB, undefined, { numeric: true, sensitivity: 'base' });
        });

    /**
     * Cleans up product names by removing the generic "(VARIANT)" suffix
     * and appending the specific variant label (e.g. size/frame) for clarity.
     */
    const getFormattedName = (product: any): string => {
        let name = product.translated?.name || product.name || '';
        
        // 1. Check if it's a variant (Shopware often marks them with (VARIANT))
        if (name.toUpperCase().includes('(VARIANT)')) {
            // Remove "(VARIANT)" and strip any trailing punctuation
            name = name.replace(/\(VARIANT\)/gi, '').trim().replace(/[,.]$/, '').trim();
            
            // Resolve specific variant label (e.g. "M 45")
            const label = getVariantLabel(product, null);
            
            // 2. Smart Deduplication: only append if label exists and isn't already in the name
            if (label && label.length > 0) {
                const cleanLabel = label.trim();
                const alreadyContains = name.toLowerCase().includes(cleanLabel.toLowerCase());
                
                if (!alreadyContains && cleanLabel !== name) {
                    return `${name} - ${cleanLabel}`;
                }
            }
        }
        
        return name;
    };

    return {
        FALLBACK_IMAGE,
        handleImageError,
        getProductImageUrl,
        getSecondaryImageUrl,
        calculateDiscount,
        getPrice,
        getOldPrice,
        getProductUrl,
        navigateToProduct,
        getVariantLabel,
        getFormattedName,
        hasPriceVariance,
        sortVariants,
    };
};
