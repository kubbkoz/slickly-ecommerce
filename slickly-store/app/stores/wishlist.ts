import { defineStore } from 'pinia';

export interface WishlistProduct {
    id: string;
    translated: { name: string };
    cover?: { media?: { url: string } };
    calculatedPrice?: { unitPrice: number };
    seoUrls?: any[];
}

export const useWishlistStore = defineStore('wishlist', () => {
    const config = useRuntimeConfig();
    const shopwareEndpoint = (config.public?.shopware as any)?.endpoint ?? `${(config.public.siteUrl as string) || 'https://mtsport.store'}/store-api/`;
    const accessToken = (config.public?.shopware as any)?.accessToken ?? '';
    const { isLoggedIn } = useUser();

    const wishlistItems = ref<WishlistProduct[]>([]);
    const isWishlistLoading = ref(false);

    const getHeaders = () => {
        const tokenCookie = useCookie<string | null>('sw-context-token');
        return {
            'sw-access-key': accessToken,
            'Content-Type': 'application/json',
            ...(tokenCookie.value ? { 'sw-context-token': tokenCookie.value } : {}),
        };
    };

    async function loadWishlist() {
        if (!isLoggedIn.value) return;

        isWishlistLoading.value = true;
        try {
            const base = shopwareEndpoint.replace(/\/$/, '');
            const res: any = await $fetch(`${base}/customer/wishlist`, {
                method: 'POST',
                headers: getHeaders(),
                body: {
                    limit: 100,
                    associations: { cover: {}, seoUrls: {} },
                },
            });
            wishlistItems.value = res?.elements || res?.products?.elements || [];
        } catch (e: any) {
            if (e?.response?.status === 404 || e?.statusCode === 404) {
                wishlistItems.value = [];
            } else {
                console.error('Customer Wishlist load error', e);
            }
        } finally {
            isWishlistLoading.value = false;
        }
    }

    function isInWishlist(productId: string) {
        return wishlistItems.value.some((p) => p.id === productId);
    }

    async function toggleWishlist(productId: string, productDataForOptimisticUI?: any) {
        if (!isLoggedIn.value) return false;

        const base = shopwareEndpoint.replace(/\/$/, '');
        isWishlistLoading.value = true;

        if (isInWishlist(productId)) {
            try {
                await $fetch(`${base}/customer/wishlist/delete/${productId}`, {
                    method: 'DELETE',
                    headers: getHeaders(),
                });
                wishlistItems.value = wishlistItems.value.filter((p) => p.id !== productId);
            } catch (e) {
                console.error('Wishlist delete error:', e);
            }
        } else {
            try {
                await $fetch(`${base}/customer/wishlist/add/${productId}`, {
                    method: 'POST',
                    headers: getHeaders(),
                    body: {},
                });
                if (!isInWishlist(productId)) {
                    wishlistItems.value.push({ id: productId, ...productDataForOptimisticUI } as WishlistProduct);
                }
            } catch (e) {
                console.error('Wishlist add error:', e);
            }
        }

        isWishlistLoading.value = false;
        return true;
    }

    return { wishlistItems, isWishlistLoading, loadWishlist, isInWishlist, toggleWishlist };
});
