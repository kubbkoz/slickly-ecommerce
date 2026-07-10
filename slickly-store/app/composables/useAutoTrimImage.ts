// Client-side auto-crop of the near-white/transparent margin around a product
// photo, so products with different amounts of baked-in whitespace end up
// filling a consistent proportion of the ProductCard image frame.
//
// Runs entirely in the browser via Canvas — independent of whatever @nuxt/image
// provider is active server-side. This project's active provider is a custom
// Shopware one (from @shopware/cms-base-layer) that only forwards
// width/height/quality/format/fit query params to the media CDN; it has no
// concept of a trim/auto-crop operation, so that has to happen client-side.

const trimCache = new Map<string, string | null>();
const inFlight = new Map<string, Promise<string | null>>();

const BG_TOLERANCE = 18;
const SCAN_SIZE = 200;

function isBackgroundPixel(data: Uint8ClampedArray, i: number, br: number, bg: number, bb: number): boolean {
    const alpha = data[i + 3];
    if (alpha < 8) return true;
    const dr = data[i] - br, dg = data[i + 1] - bg, db = data[i + 2] - bb;
    return Math.abs(dr) + Math.abs(dg) + Math.abs(db) <= BG_TOLERANCE;
}

function findContentBox(data: Uint8ClampedArray, width: number, height: number) {
    const corners: [number, number][] = [[0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1]];
    let br = 0, bgc = 0, bb = 0;
    for (const [cx, cy] of corners) {
        const i = (cy * width + cx) * 4;
        br += data[i]; bgc += data[i + 1]; bb += data[i + 2];
    }
    br /= 4; bgc /= 4; bb /= 4;

    let top = 0;
    scanTop: for (; top < height; top++) {
        for (let x = 0; x < width; x++) {
            if (!isBackgroundPixel(data, (top * width + x) * 4, br, bgc, bb)) break scanTop;
        }
    }
    let bottom = height - 1;
    scanBottom: for (; bottom > top; bottom--) {
        for (let x = 0; x < width; x++) {
            if (!isBackgroundPixel(data, (bottom * width + x) * 4, br, bgc, bb)) break scanBottom;
        }
    }
    let left = 0;
    scanLeft: for (; left < width; left++) {
        for (let y = top; y <= bottom; y++) {
            if (!isBackgroundPixel(data, (y * width + left) * 4, br, bgc, bb)) break scanLeft;
        }
    }
    let right = width - 1;
    scanRight: for (; right > left; right--) {
        for (let y = top; y <= bottom; y++) {
            if (!isBackgroundPixel(data, (y * width + right) * 4, br, bgc, bb)) break scanRight;
        }
    }

    if (top >= bottom || left >= right) return null;

    // Skip trims that would barely change anything — not worth the extra
    // canvas/memory work, and guards against noise-driven false positives.
    const keptFraction = ((right - left) * (bottom - top)) / (width * height);
    if (1 - keptFraction < 0.02) return null;

    return { x: left, y: top, w: right - left + 1, h: bottom - top + 1 };
}

async function computeTrimmedUrl(src: string): Promise<string | null> {
    try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.decoding = 'async';
        const loaded = await new Promise<HTMLImageElement | null>((resolve) => {
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = src;
        });
        if (!loaded || !loaded.naturalWidth || !loaded.naturalHeight) return null;

        // Pass 1: cheap downscaled scan to find the content bounding box.
        const scanW = Math.min(SCAN_SIZE, loaded.naturalWidth);
        const scanH = Math.max(1, Math.round((loaded.naturalHeight / loaded.naturalWidth) * scanW));
        const scanCanvas = document.createElement('canvas');
        scanCanvas.width = scanW;
        scanCanvas.height = scanH;
        const scanCtx = scanCanvas.getContext('2d', { willReadFrequently: true });
        if (!scanCtx) return null;
        scanCtx.drawImage(loaded, 0, 0, scanW, scanH);

        let data: ImageData;
        try {
            data = scanCtx.getImageData(0, 0, scanW, scanH);
        } catch {
            // Tainted canvas — media host didn't grant CORS. Bail out silently,
            // the caller keeps showing the original untrimmed image.
            if (import.meta.dev) {
                console.warn('[useAutoTrimImage] CORS blocked canvas read, skipping trim for', src);
            }
            return null;
        }

        const box = findContentBox(data.data, scanW, scanH);
        if (!box) return null;

        // Pass 2: map the box back to full-resolution coordinates and crop the
        // original image directly (avoids the quality loss of cropping the
        // already-downscaled scan canvas).
        const scaleX = loaded.naturalWidth / scanW;
        const scaleY = loaded.naturalHeight / scanH;
        const sx = Math.max(0, Math.floor(box.x * scaleX));
        const sy = Math.max(0, Math.floor(box.y * scaleY));
        const sw = Math.min(loaded.naturalWidth - sx, Math.ceil(box.w * scaleX));
        const sh = Math.min(loaded.naturalHeight - sy, Math.ceil(box.h * scaleY));
        if (sw < 1 || sh < 1) return null;

        const outCanvas = document.createElement('canvas');
        outCanvas.width = sw;
        outCanvas.height = sh;
        const outCtx = outCanvas.getContext('2d');
        if (!outCtx) return null;
        outCtx.drawImage(loaded, sx, sy, sw, sh, 0, 0, sw, sh);

        const blob: Blob | null = await new Promise((resolve) => outCanvas.toBlob(resolve, 'image/png'));
        if (!blob) return null;
        return URL.createObjectURL(blob);
    } catch (e) {
        if (import.meta.dev) console.warn('[useAutoTrimImage] trim failed for', src, e);
        return null;
    }
}

/**
 * Returns `trimSrc(url)` — resolves to an object URL of `url` with its
 * background margin cropped, or `null` if trimming isn't possible/beneficial
 * (SSR, CORS-blocked, decode failure, near-zero margin). Results are cached
 * per source URL for the lifetime of the page, since the same product photo
 * commonly reappears across multiple ProductCard instances (listings,
 * "related products", comparison, etc.).
 */
export function useAutoTrimImage() {
    const trimSrc = (src: string | undefined | null): Promise<string | null> => {
        if (!src || !import.meta.client) return Promise.resolve(null);
        if (trimCache.has(src)) return Promise.resolve(trimCache.get(src) ?? null);
        const existing = inFlight.get(src);
        if (existing) return existing;

        const promise = computeTrimmedUrl(src).then((result) => {
            trimCache.set(src, result);
            inFlight.delete(src);
            return result;
        });
        inFlight.set(src, promise);
        return promise;
    };

    return { trimSrc };
}
