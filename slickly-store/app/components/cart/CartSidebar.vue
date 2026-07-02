<script setup lang="ts">
// @ts-ignore
import { useCart } from '@shopware/composables';
// @ts-ignore
import { useUiState } from '~/composables/useUiState';
import { onMounted, onUnmounted, watch, computed, ref } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useShopwareContext } from '#imports';
import { useFeaturedProducts } from '~/components/layout/navbar/search/useFeaturedProducts';
import { useProductHelpers } from '~/composables/useProductHelpers';
import { useShippingMetadata } from '~/composables/useShippingMetadata';
import { getCategoryUrl } from '~/utils/url';
import { useLocalePath, useRuntimeConfig, navigateTo } from '#imports';

// Sub-components
import CartHeader from './CartHeader.vue';
import CartShippingBar from './CartShippingBar.vue';
import CartEmptyState from './CartEmptyState.vue';
import CartItem from './CartItem.vue';
import CartCrossSellPanel from './CartCrossSellPanel.vue';
import CartFooter from './CartFooter.vue';

const localePath = useLocalePath();
const config = useRuntimeConfig();

const { cartItems, cart, removeItem, changeProductQuantity, addPromotionCode, refreshCart, addProduct } = useCart();
const { adjustPrice, selectedCountryDisplay } = useCountrySelector();
const { isCartSidebarOpen, toggleCartSidebar } = useUiState();
const { featuredProducts, fetch: fetchFeatured } = useFeaturedProducts();
const { getProductImageUrl, getPrice, navigateToProduct } = useProductHelpers();
const { balikovoMetadata, spsMetadata, isLoading: isShippingLoading, isFreeShippingCountry } = useShippingMetadata();

// Bike category IDs from env — same source as TrustBadges.vue
const BIKE_CATEGORY_IDS = computed(() => [
    config.public.shopware.ids.categories.bikes,
    config.public.shopware.ids.categories.ebikes,
].filter(Boolean) as string[]);

// ─── COMPUTED LOGIC ──────────────────────────────────────────────

// Počet produktových položiek pre header — virtual produkty sa nerátajú
const productItemCount = computed(() =>
    (cartItems.value || []).filter((i: any) => i.type === 'product' && !virtualProductIds.value.includes(i.referencedId)).length
);

// Subtotal pre CartFooter — raw SK gross sum bez virtual produktov; formatPrice applies adjustPrice
const computedSubtotal = computed(() =>
    cartItems.value
        .filter((i: any) => !virtualProductIds.value.includes(i.referencedId))
        .reduce((acc, item) => acc + (item.price?.totalPrice || 0), 0)
);

// Subtotal produktových pozícií — Shopware positionPrice nezahŕňa dopravné
const cartPositionPrice = computed(() => cart.value?.price?.positionPrice ?? 0);

// Bike detection across all cart items — mirrors TrustBadges.vue isBike logic.
// Uses productStockData which is populated by fetchStockForItems (below).
// Computed is lazy — productStockData is initialized before first render access.
const hasBikeInCart = computed(() =>
    Object.values(productStockData.value).some((p: any) =>
        p.categoryTree?.some((id: string) => BIKE_CATEGORY_IDS.value.includes(id)) ||
        p.categoryIds?.some((id: string) => BIKE_CATEGORY_IDS.value.includes(id))
    )
);

// Effective threshold — exact mirror of TrustBadges.vue effectiveThreshold logic:
//   bike in cart  → SPS threshold (Balíkovo not applicable for bikes)
//   no bikes      → min(Balíkovo, SPS) threshold
// null when API is still loading OR Shopware returned no parseable threshold
const effectiveThreshold = computed<number | null>(() => {
    if (isShippingLoading.value) return null;

    // CZ/PL nemajú dopravu zadarmo → skry free-shipping bar
    if (!isFreeShippingCountry(selectedCountryDisplay.value.iso)) return null;

    if (hasBikeInCart.value) {
        const t = spsMetadata.value.freeThreshold;
        return (typeof t === 'number' && t > 1) ? t : null;
    }

    const candidates = [
        balikovoMetadata.value.freeThreshold,
        spsMetadata.value.freeThreshold,
    ].filter((v): v is number => typeof v === 'number' && v > 1);
    return candidates.length > 0 ? Math.min(...candidates) : null;
});

// amountToFreeShipping:
//   null  → threshold not yet known (API pending or not parseable), bar hidden
//   0     → positionPrice ≥ threshold, doprava je zadarmo
//   > 0   → koľko € chýba do bezplatnej dopravy
const amountToFreeShipping = computed<number | null>(() => {
    if (effectiveThreshold.value === null) return null;
    return Math.max(0, effectiveThreshold.value - cartPositionPrice.value);
});

const freeShippingPercent = computed(() => {
    if (!effectiveThreshold.value) return 0;
    return Math.min(100, (cartPositionPrice.value / effectiveThreshold.value) * 100);
});

// Persistent state needed in sidebar for calculation or persistence
const orderNote = ref('');
const isCrossSellManuallyClosed = ref(false);

// ─── VIRTUAL PRODUCTS (skryté v cart UI) ─────────────────────────
const expressProductId = config.public.shopware.ids.products?.expressShipping;
const dobierkaProductId = config.public.shopware.ids.products?.dobierka;
const balneBikeProductId = config.public.shopware.ids.products?.balneBike;
const balneEbikeProductId = config.public.shopware.ids.products?.balneEbike;
const virtualProductIds = computed(() => [expressProductId, dobierkaProductId, balneBikeProductId, balneEbikeProductId].filter(Boolean) as string[]);
const { data: expressProduct } = await useAsyncData('sidebar-express-product', async () => {
    if (!expressProductId) return null;
    try {
        const res = await apiClient.invoke('readProduct post /product' as any, {
            body: { filter: [{ type: 'equals', field: 'id', value: expressProductId }], includes: { product: ['id', 'translated', 'calculatedPrice', 'seoUrls'], seo_url: ['seoPathInfo'] } }
        });
        return (res?.data || res)?.elements?.[0] || null;
    } catch (e) { return null; }
});

const isExpressInCart = computed(() => cartItems.value.some((i: any) => i.referencedId === expressProductId));
const isExpressLoading = ref(false);

const handleExpressDelivery = async (val: boolean) => {
    if (isExpressLoading.value || !expressProductId) return;
    isExpressLoading.value = true;
    try {
        const item = cartItems.value.find((i: any) => i.referencedId === expressProductId);
        if (val && !item) {
            await addProduct({ id: expressProductId, quantity: 1 });
        } else if (!val && item) {
            await removeItem(item);
        }
    } finally {
        isExpressLoading.value = false;
    }
};

// ─── CROSS SELLING LOGIC ──────────────────────────────────────────
const crossSells = ref<any[]>([]);
const isCrossSellLoading = ref(false);
const { apiClient } = useShopwareContext();

// --- CROSS SELLING LOGIC ---
const fetchCrossSells = async () => {
    isCrossSellLoading.value = true;
    crossSells.value = [];
    const itemIds = cartItems.value.filter((i: any) => i.type === 'product').map((i: any) => i.referencedId).filter(Boolean);
    
    if (!itemIds.length) {
        await fetchFeaturedFallback();
        return;
    }

    try {
        const nativeGroups: any[][] = [];
        
        // --- STEP 1: NATIVE CROSS-SELLS (MIXED) ---
        for (const id of itemIds) {
            const res = await apiClient.invoke(`readProductCrossSelling get /product/${id}/cross-selling` as any);
            const elements = (res as any)?.data || res;
            const itemCrossSells: any[] = [];
            if (Array.isArray(elements)) {
                for (const cross of elements) {
                    if (cross.products?.length > 0) {
                        itemCrossSells.push(...cross.products);
                    }
                }
            }
            if (itemCrossSells.length) {
                // Filter duplicates from the same item
                const uniqueItemPool = itemCrossSells.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
                nativeGroups.push(uniqueItemPool);
            }
        }
        
        // Interleave native results
        let pool = interleave(nativeGroups);
        pool = pool.filter(p => !itemIds.includes(p.id));

        // --- STEP 2: CATEGORY FALLBACK (if total < 10) ---
        if (pool.length < 10) {
            const categoryGroups: any[][] = [];
            const processedCategories = new Set<string>();

            for (const id of itemIds) {
                const info = productStockData.value[id];
                // Use mainCategoryId or lowest category from tree
                const targetCatId = info?.mainCategoryId || info?.categoryTree?.at(-1);
                
                if (targetCatId && !processedCategories.has(targetCatId)) {
                    processedCategories.add(targetCatId);
                    try {
                        const categoryRes = await apiClient.invoke('readProduct post /product' as any, {
                            body: {
                                limit: 10,
                                filter: [
                                    { type: 'equals', field: 'categoryIds', value: targetCatId },
                                    { type: 'not', queries: [{ type: 'equalsAny', field: 'id', value: itemIds }] }
                                ],
                                includes: {
                                    product: ['id', 'name', 'translated', 'media', 'cover', 'cheapestPrice', 'calculatedPrice', 'productNumber', 'seoUrls'],
                                    seo_url: ['seoPathInfo']
                                }
                            }
                        });
                        const related = (categoryRes.data || categoryRes)?.elements || [];
                        if (related.length) categoryGroups.push(related);
                    } catch (e) {
                        console.error('[CrossSellEngine] Category search failed:', targetCatId, e);
                    }
                }
            }
            
            // Interleave and merge
            const relatedInterleaved = interleave(categoryGroups);
            relatedInterleaved.forEach(item => {
                if (!pool.some(p => p.id === item.id)) {
                    pool.push(item);
                }
            });
        }

        // --- FINAL CONSOLIDATION ---
        if (pool.length === 0) {
            await fetchFeaturedFallback();
            return;
        }

        crossSells.value = pool.slice(0, 10);
    } catch(e) {
        console.error('[CrossSellEngine] Fatal error:', e);
        await fetchFeaturedFallback();
    } finally {
        isCrossSellLoading.value = false;
    }
};

/**
 * Interleaves arrays (Round Robin)
 */
function interleave(arrays: any[][]): any[] {
    const result: any[] = [];
    const maxLength = Math.max(...arrays.map(a => a.length));
    for (let i = 0; i < maxLength; i++) {
        for (const array of arrays) {
            if (i < array.length) {
                result.push(array[i]);
            }
        }
    }
    // Remove duplicates across the final interleaved pool
    return result.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
}

const fetchFeaturedFallback = async () => {
    await fetchFeatured();
    crossSells.value = featuredProducts.value?.slice(0, 10) || [];
    isCrossSellLoading.value = false;
};

// ─── EMPTY CART CATEGORIES ────────────────────────────────────────
const emptyCartCategories = ref<any[]>([]);
const parseAndPrefetchCategoriesForEmptyCart = async () => {
    if (emptyCartCategories.value.length > 0 || cartItems.value.length > 0) return;
    const ids = [
        config.public.shopware.ids.categories.bikes,
        config.public.shopware.ids.categories.ebikes,
        config.public.shopware.ids.categories.doplnky,
        config.public.shopware.ids.categories.komponenty,
        config.public.shopware.ids.categories.oblecenie
    ].filter((id): id is string => Boolean(id));
    try {
        const res = await apiClient.invoke('readCategoryList post /category', {
            body: { filter: [{ type: 'equalsAny', field: 'id', value: ids as any }] }
        });
        if (res?.data?.elements) {
            emptyCartCategories.value = res.data.elements.map((c: any) => ({
                id: c.id,
                name: c.translated?.name || c.name,
                url: getCategoryUrl(c)
            }));
        }
    } catch(e) {
        console.error('Failed to map empty cart categories:', e);
    }
};

// ─── SYSTEM WATCHERS & HANDLERS ────────────────────────────────────
watch(isCartSidebarOpen, (isOpen) => {
    if (isOpen) {
        document.body.style.overflow = 'hidden';
        isCrossSellManuallyClosed.value = false; // Reset manually closed state on fresh open
        fetchCrossSells();
        if (cartItems.value.length === 0) parseAndPrefetchCategoriesForEmptyCart();
    } else {
        document.body.style.overflow = '';
    }
});

const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isCartSidebarOpen.value) toggleCartSidebar(false);
};
onMounted(() => window.addEventListener('keydown', handleEsc));
onUnmounted(() => window.removeEventListener('keydown', handleEsc));

// --- UPDATING STATE ---
const updatingItems = ref<Set<string>>(new Set());

const updateQuantity = async (item: any, delta: number) => {
    if (updatingItems.value.has(item.id)) return;
    
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
        await handleRemove(item);
        return;
    }

    try {
        updatingItems.value.add(item.id);
        // Explicitly ensuring we use the line item ID for the update
        await changeProductQuantity({ 
            id: item.id, 
            quantity: newQty 
        });
        
        // Defensive refresh to ensure variants (which might trigger complex recalculations) 
        // are properly synchronized in the local state.
        if (typeof refreshCart === 'function') {
            await refreshCart();
        }
    } catch (e) {
        console.error('[CartSidebar] Failed to update variant quantity:', e);
    } finally {
        updatingItems.value.delete(item.id);
    }
};

const handleRemove = async (item: any) => {
    await removeItem(item);
    // Refresh categories if the cart becomes empty while open
    if (cartItems.value.length === 0) {
        await parseAndPrefetchCategoriesForEmptyCart();
    }
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR' }).format(adjustPrice(price));
};

const getProductImage = (item: any) => {
    const url = item.cover?.url || item.payload?.cover?.url || item.payload?.media?.[0]?.url;
    if (!url) return 'https://placehold.co/200x200?text=Product';
    return import.meta.dev ? url.replace(/^https:\/\/mtsport\.store/, '/mts-proxy') : url;
};

// ─── STOCK FETCHING ──────────────────────────────────────────────
type StockInfo = { 
    stockStatus: 'in_stock' | 'on_order' | 'unavailable'; 
    stock: number; 
    restockTime: number;
    isCloseout: boolean;
    productNumber?: string;
    translated?: any;
    seoUrls?: any;
    categoryIds?: string[];
    mainCategoryId?: string;
    categoryTree?: string[];
};
const productStockData = ref<Record<string, StockInfo>>({});

const fetchStockForItems = async () => {
    const ids = cartItems.value
        .filter((i: any) => i.type === 'product')
        .map((i: any) => i.referencedId)
        .filter((id: string) => id && !productStockData.value[id]);
    if (ids.length === 0) return;
    try {
        const res = await apiClient.invoke('readProduct post /product' as any, {
            body: {
                filter: [{ type: 'equalsAny', field: 'id', value: ids }],
                includes: { 
                    product: ['id', 'availableStock', 'isCloseout', 'stock', 'restockTime', 'seoUrls', 'productNumber', 'translated', 'categoryIds', 'mainCategoryId', 'categoryTree'],
                    seo_url: ['seoPathInfo']
                }
            }
        });
        const products = (res.data || res)?.elements || [];
        products.forEach((p: any) => {
            const stockValue = Math.max(0, p.availableStock ?? p.stock ?? 0);
            let stockStatus: 'in_stock' | 'on_order' | 'unavailable' = 'on_order';
            if (stockValue > 0) stockStatus = 'in_stock';
            else if (p.isCloseout === true) stockStatus = 'unavailable';
            
            productStockData.value[p.id] = { 
                stockStatus, 
                stock: stockValue, 
                restockTime: p.restockTime ?? 0,
                isCloseout: !!p.isCloseout,
                productNumber: p.productNumber,
                translated: p.translated,
                seoUrls: p.seoUrls,
                categoryIds: p.categoryIds || [],
                mainCategoryId: p.mainCategoryId,
                categoryTree: p.categoryTree || []
            };
        });
    } catch (e) {
        console.error('[CartSidebar] Failed to fetch exact stock mapping:', e);
    }
};

watch(cartItems, async () => {
    // 1. Update stock and category metadata
    await fetchStockForItems();
    
    // 2. If sidebar is open, recalculate cross-sells via AJAX
    if (isCartSidebarOpen.value) {
        await fetchCrossSells();
    }
}, { immediate: true, deep: true });

const getStockInfo = (item: any): StockInfo | null => {
    if (!item?.referencedId) return null;
    return productStockData.value[item.referencedId] || null;
};

const handleCoupon = async (code: string) => {
    await addPromotionCode(code);
};
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
        <div
            v-if="isCartSidebarOpen"
            class="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
            @click="toggleCartSidebar(false)"
        ></div>
    </Transition>

    <!-- Drawer Panel -->
    <Transition name="aero">
        <aside
            v-if="isCartSidebarOpen"
            class="fixed z-[101] flex flex-col will-change-transform
                   md:top-4 md:bottom-4 md:right-4 md:left-auto md:w-[440px]
                   bottom-0 left-0 right-0 h-full top-0 md:h-auto md:max-h-none"
        >            <!-- Cross-sell panel remains dynamic; sits at z-0 inside aside -->
            <CartCrossSellPanel
                :is-open="isCartSidebarOpen && !isCrossSellManuallyClosed"
                :is-loading="isCrossSellLoading"
                :cross-sells="crossSells"
                :get-product-image-url="getProductImageUrl"
                :get-price="getPrice"
                :format-price="formatPrice"
                @navigate="(p) => { toggleCartSidebar(false); navigateToProduct(p); }"
            />

            <!-- Unified Animated Toggle Button -->
            <button
                v-if="crossSells.length > 0"
                class="hidden md:flex absolute top-1/2 -translate-y-1/2 w-6 h-16 bg-white border-y border-gray-100 shadow-md 
                       items-center justify-center text-gray-400 hover:text-brand transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] z-[11]"
                :class="[
                    !isCrossSellManuallyClosed ? 'left-[-280px] border-l' : 'left-0 border-r bg-gray-50'
                ]"
                @click="isCrossSellManuallyClosed = !isCrossSellManuallyClosed"
            >
                <ChevronRight v-if="!isCrossSellManuallyClosed" class="w-4 h-4" />
                <ChevronLeft v-else class="w-4 h-4" />
            </button>

            <!-- Drawer Body: Has background and shadow to overlap the cross-sell panel -->
            <div class="relative z-10 flex flex-col h-full bg-white border border-gray-100 shadow-[0_40px_100px_rgba(0,0,0,0.15)] overflow-hidden rounded-default">

                <CartHeader :count="productItemCount" @close="toggleCartSidebar(false)" />

                <CartShippingBar
                    v-if="cartItems.length > 0"
                    variant="sidebar"
                    :amount-to-free-shipping="amountToFreeShipping"
                    :free-shipping-percent="freeShippingPercent"
                    :free-threshold="effectiveThreshold"
                    :format-price="formatPrice"
                />

                <!-- Scrollable Content -->
                <div class="flex-1 overflow-y-auto px-5 md:px-8 pb-56 no-scrollbar custom-content-fade">
                    <CartEmptyState
                        v-if="cartItems.length === 0"
                        :categories="emptyCartCategories"
                        @close="toggleCartSidebar(false)"
                    />

                    <div v-else class="space-y-6 pt-4">
                        <template v-for="item in cartItems.filter((i: any) => !virtualProductIds.includes(i.referencedId))" :key="item.id">
                            <!-- Produktová položka -->
                            <CartItem
                                v-if="item.type === 'product'"
                                :item="item"
                                :is-updating="updatingItems.has(item.id)"
                                :stock-info="getStockInfo(item)"
                                :get-product-image="getProductImage"
                                :format-price="formatPrice"
                                @remove="handleRemove"
                                @update-qty="updateQuantity"
                                @click-product="(item) => {
                                    toggleCartSidebar(false);
                                    const stockInfo = productStockData[item.referencedId];
                                    const productData = {
                                        ...item.payload,
                                        id: item.referencedId,
                                        label: item.label,
                                        productNumber: stockInfo?.productNumber || item.payload?.productNumber,
                                        translated: stockInfo?.translated || item.payload?.translated,
                                        seoUrls: stockInfo?.seoUrls
                                    };
                                    navigateToProduct(productData);
                                }"
                            />
                            <!-- Promo / zľavová položka (Shopware default) -->
                            <div
                                v-else
                                class="flex items-center justify-between gap-3 py-2 border-t border-dashed border-gray-100"
                            >
                                <div class="flex items-center gap-2 min-w-0">
                                    <div class="flex-shrink-0 px-1.5 py-0.5 bg-brand text-white text-[9px] font-black uppercase tracking-widest">
                                        KÓD
                                    </div>
                                    <span class="text-xs font-bold uppercase tracking-widest text-gray-700 truncate">
                                        {{ item.label }}
                                    </span>
                                    <span v-if="item.payload?.code" class="text-[9px] font-mono text-gray-400 uppercase hidden sm:block flex-shrink-0">
                                        {{ item.payload.code }}
                                    </span>
                                </div>
                                <span class="font-black font-tech text-sm text-brand flex-shrink-0">
                                    {{ formatPrice(item.price?.totalPrice || 0) }}
                                </span>
                            </div>
                        </template>
                    </div>
                </div>

                <CartFooter
                    v-if="cartItems.length > 0"
                    :checkout-total="computedSubtotal"
                    :format-price="formatPrice"
                    :express-product="expressProduct"
                    :is-express-in-cart="isExpressInCart"
                    :is-express-loading="isExpressLoading"
                    @checkout="() => { toggleCartSidebar(false); navigateTo('/checkout'); }"
                    @view-cart="() => { toggleCartSidebar(false); navigateTo('/cart'); }"
                    @coupon="handleCoupon"
                    @order-note="(val) => orderNote = val"
                    @express="handleExpressDelivery"
                />
            </div>
        </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.aero-enter-active, .aero-leave-active {
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}
@media (min-width: 768px) {
    .aero-enter-from, .aero-leave-to { transform: translateX(110%); opacity: 0; }
}
@media (max-width: 767px) {
    .aero-enter-from, .aero-leave-to { transform: translateY(100%); opacity: 0; }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.custom-content-fade {
    mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
}
</style>
