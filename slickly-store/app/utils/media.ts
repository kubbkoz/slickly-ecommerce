const SHOPWARE_ORIGIN = (import.meta.env.NUXT_PUBLIC_SITE_URL as string | undefined) || 'https://mtsport.store';

/**
 * In dev mode, rewrites mtsport.store URLs to go through the local Nitro devProxy
 * (/mts-proxy/) to avoid Chrome ORB cross-origin blocking.
 * In production (same domain), URLs are returned unchanged.
 */
export function proxyMediaUrl(url: string): string {
    if (!url) return url;
    // import.meta.dev is true only during `nuxt dev`
    if (import.meta.dev && url.startsWith(SHOPWARE_ORIGIN)) {
        return url.replace(SHOPWARE_ORIGIN, '/mts-proxy');
    }
    return url;
}


export function getMediaUrl(media: any, options: { width?: number; preferWebp?: boolean } = {}): string {
    if (!media) return '';

    const { width, preferWebp = false } = options;

    // 1. If no thumbnails or we want the original explicitly (width=0?), return original url
    // However, Shopware originals can be huge.
    if (!media.thumbnails || media.thumbnails.length === 0) {
        return proxyMediaUrl(media.url || '');
    }

    // 2. Filter valid thumbnails
    let candidates = media.thumbnails;

    // 3. Strategy: If user complained about .jpg.webp, maybe we should avoid it if possible?
    // Or maybe we should just ensure we find the *correct* one.
    // Let's try to prefer the requested width.

    if (width) {
        // Find closest width
        // Filter by extension if we want to force format? 
        // For now, let's just pick the closest width. 
        // If multiple formats exist for same width (e.g. jpg and webp), Shopware usually returns them as separate thumbnails? 
        // Actually Shopware 6 thumbnails array usually contains mixed formats if configured.

        // Sort by difference to target width
        candidates.sort((a: any, b: any) => Math.abs(a.width - width) - Math.abs(b.width - width));

        // If we want to avoid .webp if .jpg exists for the same/similar size?
        // Let's pick the first one which is closest.
        // But if strict on format:
        // const best = candidates[0];
        // return best.url;
    } else {
        // If no width specified, maybe return the largest thumbnail?
        candidates.sort((a: any, b: any) => b.width - a.width);
    }

    // Fallback: Check if the URL looks "weird" (double extension) and if we have a cleaner alternative?
    // This is heuristic.

    // For now, simple return easiest candidate.
    return proxyMediaUrl(candidates[0]?.url || media.url || '');
}

/**
 * Returns the best available media URL from a Shopware Media object.
 *
 * PRIORITY ORDER:
 * 1. media.url (original - served from /media/ path, no CORS/ORB issues)
 * 2. Largest jpg/png thumbnail as fallback
 * 3. Any thumbnail as last resort
 *
 * NEVER prefer /thumbnail/ over /media/ - the /thumbnail/ endpoint
 * causes ERR_BLOCKED_BY_ORB in dev (cross-origin from localhost).
 */
export function getSafeMediaUrl(media: any): string {
    if (!media) return '';

    // PRIORITY 1: Original media URL (/media/ path) - always prefer this
    if (media.url) return proxyMediaUrl(media.url);

    // PRIORITY 2+: Fallback to thumbnails only if media.url is missing
    if (!media.thumbnails || media.thumbnails.length === 0) return '';

    // Sort by width descending (largest first)
    const sorted = [...media.thumbnails].sort((a: any, b: any) => b.width - a.width);

    // Prefer jpg/png thumbnails over webp
    const safeExtensions = ['.jpg', '.jpeg', '.png'];
    const safeThumb = sorted.find((t: any) => {
        const url = t.url.toLowerCase();
        return safeExtensions.some(ext => url.endsWith(ext)) && !url.endsWith('.webp');
    });
    if (safeThumb) return proxyMediaUrl(safeThumb.url);

    // Accept any thumbnail (even webp)
    return proxyMediaUrl(sorted[0]?.url || '');
}

/**
 * Alias for hero slider images - same as getSafeMediaUrl.
 */
export function getHeroMediaUrl(media: any): string {
    return getSafeMediaUrl(media);
}
