<script setup lang="ts">
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Tag, ShieldCheck, Truck, RefreshCw, User, Zap } from 'lucide-vue-next';
import CartAdvisor from '~/components/cart/CartAdvisor.vue';
// @ts-ignore
import { useCart, usePrice, useUser } from '@shopware/composables';
import { useShippingMetadata } from '~/composables/useShippingMetadata';
import { useBalneSync } from '~/composables/useBalneSync';
import { useShopwareContext } from '#imports';
import { getProductUrl } from '~/utils/url';

definePageMeta({ layout: 'cart' });

useHead({
    title: 'Nákupný košík | SLICKLY',
    meta: [{ name: 'description', content: 'Skontrolujte obsah vášho nákupného košíka a prejdite k pokladni.' }],
});

const { cartItems, cart, addProduct, removeItem, changeProductQuantity, addPromotionCode, refreshCart, count } = useCart();
const { getFormattedPrice } = usePrice();
const { adjustPrice } = useCountrySelector();
const localePath = useLocalePath();
const router = useRouter();
const route = useRoute();
const goBack = () => {
    if (import.meta.client && window.history.length > 1) router.back();
    else router.push(localePath('/'));
};
const config = useRuntimeConfig();
const { balikovoMetadata, spsMetadata, isLoading: isShippingLoading } = useShippingMetadata();
useBalneSync();
const { apiClient } = useShopwareContext();

// ── Pricing ────────────────────────────────────────────────────────────────
// ── Quantity / remove ──────────────────────────────────────────────────────
const updatingId = ref<string | null>(null);

const updateQuantity = async (item: any, delta: number) => {
    const newQty = item.quantity + delta;
    updatingId.value = item.id;
    try {
        if (newQty <= 0) {
            await removeItem(item);
        } else {
            await changeProductQuantity({ id: item.id, quantity: newQty });
            if (typeof refreshCart === 'function') await refreshCart();
        }
    } finally {
        updatingId.value = null;
    }
};

const handleRemove = async (item: any) => {
    updatingId.value = item.id;
    try {
        await removeItem(item);
    } finally {
        updatingId.value = null;
    }
};

// ── Coupon ─────────────────────────────────────────────────────────────────
// ── Helpers ────────────────────────────────────────────────────────────────
const cleanLabel = (label: string | undefined | null) => (label || '').replace(/\(VARIANT\)/gi, '').trim();

const itemImage = (item: any): string => {
    const url = item.cover?.url || item.cover?.media?.url || item.payload?.cover?.url || item.payload?.media?.[0]?.url;
    if (!url) return 'https://placehold.co/200x200?text=?';
    return import.meta.dev ? url.replace(/^https:\/\/mtsport\.store/, '/mts-proxy') : url;
};

const itemUrl = (item: any): string => {
    return localePath(getProductUrl({
        ...item.payload,
        id: item.referencedId,
        name: cleanLabel(item.payload?.translated?.name || item.payload?.name || item.label),
        label: cleanLabel(item.label),
    }));
};

const itemOldPrice = (item: any): number | null => {
    const list = item.price?.listPrice?.price;
    return list && list > (item.price?.unitPrice || 0) ? list : null;
};

const discountPercent = (item: any): number => {
    const list = itemOldPrice(item);
    if (!list) return 0;
    return Math.round((1 - (item.price?.unitPrice || 0) / list) * 100);
};

// ── Virtual product IDs (hidden everywhere except checkout step 3) ──────────
const virtualProductIds = computed(() => [
    config.public.shopware.ids.products?.expressShipping,
    config.public.shopware.ids.products?.dobierka,
    config.public.shopware.ids.products?.balneBike,
    config.public.shopware.ids.products?.balneEbike,
].filter(Boolean) as string[]);

// ── Item separation ────────────────────────────────────────────────────────
// Shopware default: promo položky sú samostatné riadky (nie inline na produkte)
const productItems = computed(() => (cartItems.value || []).filter((i: any) =>
    i.type === 'product' && !virtualProductIds.value.includes(i.referencedId)
));
const promotionItems = computed(() => (cartItems.value || []).filter((i: any) => i.type !== 'product'));

// ── Stock fetching ─────────────────────────────────────────────────────────
type StockInfo = {
    stockStatus: 'in_stock' | 'on_order' | 'unavailable';
    stock: number;
    restockTime: number;
    isCloseout: boolean;
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
                includes: { product: ['id', 'availableStock', 'isCloseout', 'stock', 'restockTime', 'categoryIds', 'mainCategoryId', 'categoryTree'] }
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
                categoryIds: p.categoryIds || [],
                mainCategoryId: p.mainCategoryId,
                categoryTree: p.categoryTree || [],
            };
        });
    } catch (e) {
        console.error('[cart.vue] fetchStock failed:', e);
    }
};

// deep: true — Shopware mutuje pole namiesto nahradenia referencie
watch(cartItems, fetchStockForItems, { immediate: true, deep: true });


// ── Restore zdieľaného košíka z URL ?share=HASH ────────────────────────────
const isRestoringCart = ref(false);

const restoreSharedCart = async () => {
    const hash = route.query.share as string;
    if (!hash) return;

    isRestoringCart.value = true;
    try {
        const data = await $fetch<{ items: { id: string; quantity: number }[] }>(`/api/cart/load/${hash}`);

        if (data.items?.length) {
            await apiClient.invoke('addLineItem post /checkout/cart/line-item' as any, {
                body: {
                    items: data.items.map(item => ({
                        id: item.id,
                        referencedId: item.id,
                        quantity: item.quantity,
                        type: 'product',
                    })),
                },
            });
            await refreshCart?.();
            // Odstrán share param z URL po obnovení
            const { share: _removed, ...rest } = route.query;
            router.replace({ query: rest });
        }
    } catch (e) {
        console.error('[cart] restore shared cart failed:', e);
    } finally {
        isRestoringCart.value = false;
    }
};

onMounted(() => {
    if (route.query.share) restoreSharedCart();
});

const cartAdvisorItems = computed(() =>
    productItems.value.map((item: any) => ({
        name: cleanLabel(item.payload?.translated?.name || item.payload?.name || item.label || ''),
        category: item.payload?.categories?.[0]?.name || '',
        price: item.price?.unitPrice,
    }))
);

const { isLoggedIn } = useUser();
const isLoginModalOpen = useState('loginModalOpen', () => false);

// ── Express Shipping Product ───────────────────────────────────────────────
const expressProductId = config.public.shopware.ids.products?.expressShipping;
const { data: expressProduct } = await useAsyncData('express-product', async () => {
    if (!expressProductId) return null;
    try {
        const res = await apiClient.invoke('readProduct post /product' as any, {
            body: {
                filter: [{ type: 'equals', field: 'id', value: expressProductId }],
                includes: { 
                    product: ['id', 'translated', 'calculatedPrice', 'seoUrls', 'cover'],
                    product_media: ['media'],
                    media: ['url', 'thumbnails']
                }
            }
        });
        return (res?.data || res)?.elements?.[0] || null;
    } catch (e) {
        return null;
    }
});

const isExpressLoading = ref(false);

const expressShipping = computed({
    get: () => cartItems.value.some((i: any) => i.referencedId === expressProductId),
    set: async (val: boolean) => {
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
    }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <div class="container mx-auto px-4 lg:px-8 py-8 lg:py-14">

      <!-- ── Page Header ──────────────────────────────────────────────── -->
      <div class="mb-8 pb-6 border-b border-gray-200">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end">
          <div>
            <h1 class="text-3xl md:text-5xl font-black uppercase font-tech tracking-wide text-black italic">
              NÁKUPNÝ <span class="text-brand">KOŠÍK</span>
            </h1>
            <p v-if="productItems.length > 0" class="text-gray-500 text-sm mt-2 font-sans">
              {{ productItems.length }} {{ productItems.length === 1 ? 'položka' : productItems.length < 5 ? 'položky' : 'položiek' }}
            </p>
          </div>
        </div>

      </div>

      <!-- ── EMPTY STATE ─────────────────────────────────────────────── -->
      <div v-if="!cartItems || cartItems.length === 0" class="flex flex-col items-center justify-center py-24 text-center">
        <div class="text-[100px] font-black font-tech uppercase text-gray-100 leading-none mb-4 select-none">EMPTY</div>
        <h2 class="text-2xl font-black uppercase font-tech tracking-wide text-black mb-2">Košík je prázdny</h2>
        <p class="text-gray-500 text-sm mb-8 max-w-sm font-sans">
          Pridajte produkty a vráťte sa späť.
        </p>
        <div class="flex flex-wrap gap-3 justify-center mb-8">
          <BaseLink to="/exterier" class="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brand transition-colors">
            Exteriér
          </BaseLink>
          <BaseLink to="/lestenie" class="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brand transition-colors">
            Leštenie
          </BaseLink>
          <BaseLink to="/prislusenstvo" class="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brand transition-colors">
            Príslušenstvo
          </BaseLink>
        </div>
        <BaseLink to="/" class="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand transition-colors flex items-center gap-1.5">
          <ArrowLeft class="w-3.5 h-3.5" /> Späť na domovskú stránku
        </BaseLink>
      </div>

      <!-- ── CART CONTENT ────────────────────────────────────────────── -->
      <div v-else>
      <div class="flex flex-col lg:flex-row gap-8 items-start">

        <!-- ── LEFT: Items ───────────────────────────────────────────── -->
        <div class="flex-1 min-w-0 space-y-1">




          <!-- Items list -->
          <div
            v-for="item in productItems"
            :key="item.id"
            class="bg-white border border-gray-200 p-4 md:p-6 flex gap-4 md:gap-6 group relative transition-opacity"
            :class="updatingId === item.id ? 'opacity-50 pointer-events-none' : ''"
          >
            <!-- Discount badge -->
            <span
              v-if="discountPercent(item) > 0"
              class="absolute top-3 left-3 z-10 px-2 py-0.5 text-[9px] font-bold text-black uppercase bg-amber"
            >
              -{{ discountPercent(item) }}%
            </span>

            <!-- Image -->
            <BaseLink :to="item.payload" class="w-24 h-24 md:w-32 md:h-32 bg-gray-50 flex-shrink-0 p-2 block overflow-hidden">
              <NuxtImg
                :src="itemImage(item)"
                :alt="cleanLabel(item.label)"
                format="webp"
                loading="lazy"
                class="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
              />
            </BaseLink>

            <!-- Info -->
            <div class="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div class="flex items-start justify-between gap-2">
                  <BaseLink :to="item.payload" class="font-bold text-sm md:text-base uppercase text-black hover:text-brand transition-colors font-tech leading-tight line-clamp-2 flex-1 min-w-0 pr-2">
                    {{ cleanLabel(item.label) }}
                  </BaseLink>
                  <button
                    @click="handleRemove(item)"
                    class="w-8 h-8 flex items-center justify-center bg-gray-50 border border-gray-100 text-gray-300 hover:text-brand hover:border-brand transition-all flex-shrink-0 -mr-1"
                    aria-label="Odstrániť z košíka"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>

                <!-- Variant / options -->
                <div v-if="item.payload?.options?.length" class="mt-1.5 flex flex-wrap gap-2">
                  <span
                    v-for="opt in item.payload.options"
                    :key="opt.group"
                    class="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 bg-gray-100 text-gray-600"
                  >
                    {{ opt.group }}: {{ opt.option }}
                  </span>
                </div>

                <!-- SKU -->
                <div v-if="item.payload?.productNumber" class="mt-1 text-[10px] text-gray-400 font-medium">
                  SKU: {{ item.payload.productNumber }}
                </div>

                <!-- Stock status — split-stock logika identická s CartItem.vue -->
                <div class="mt-1.5">
                  <template v-if="item.referencedId && productStockData[item.referencedId]">
                    <!-- Split stock: qty > stock, ale nejaký sklad existuje -->
                    <div
                      v-if="!productStockData[item.referencedId]?.isCloseout
                        && item.quantity > (productStockData[item.referencedId]?.stock ?? 0)
                        && (productStockData[item.referencedId]?.stock ?? 0) > 0"
                      class="flex items-center gap-3"
                    >
                      <div class="text-[10px] font-bold uppercase tracking-widest text-green-600 flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-green-600 inline-block"></span>
                        Skladom {{ productStockData[item.referencedId]?.stock }} ks
                      </div>
                      <div class="text-[10px] font-bold uppercase tracking-widest text-amber-500 flex items-center gap-1">
                        Na obj. {{ item.quantity - (productStockData[item.referencedId]?.stock ?? 0) }} ks
                      </div>
                    </div>
                    <!-- Štandardné stavy -->
                    <div v-else-if="productStockData[item.referencedId]?.stockStatus === 'in_stock'" class="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"
                      :class="(productStockData[item.referencedId]?.stock ?? 0) <= 5 ? 'text-amber-600' : 'text-green-600'">
                      <span class="w-1.5 h-1.5 rounded-full inline-block"
                        :class="(productStockData[item.referencedId]?.stock ?? 0) <= 5 ? 'bg-amber-500 animate-pulse' : 'bg-green-600'"></span>
                      <span v-if="(productStockData[item.referencedId]?.stock ?? 0) <= 5">Zostávajú len {{ productStockData[item.referencedId]?.stock }} ks!</span>
                      <span v-else>Skladom</span>
                    </div>
                    <div v-else-if="productStockData[item.referencedId]?.stockStatus === 'on_order'" class="text-[10px] font-bold uppercase tracking-widest text-amber-500 flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
                      U nás do {{ productStockData[item.referencedId]?.restockTime || 4 }} dní
                    </div>
                    <div v-else class="text-[10px] font-bold uppercase tracking-widest text-brand flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-brand inline-block"></span>
                      Vypredané
                    </div>
                  </template>
                  <div v-else class="text-[10px] font-bold uppercase tracking-widest text-gray-300 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-gray-200 animate-pulse inline-block"></span>
                    Načítavam...
                  </div>
                </div>
              </div>

              <!-- Quantity + Price row -->
              <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mt-4">
                <!-- Quantity stepper — min 44×44px touch targets (WCAG 2.5.5) -->
                <div class="flex items-center border border-gray-200 self-start">
                  <button
                    @click="updateQuantity(item, -1)"
                    class="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"
                    :aria-label="`Znížiť množstvo ${cleanLabel(item.label)}`"
                  >
                    <Minus class="w-3.5 h-3.5" />
                  </button>
                  <span class="w-10 text-center text-sm font-black font-tech">{{ item.quantity }}</span>
                  <button
                    @click="updateQuantity(item, 1)"
                    class="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"
                    :aria-label="`Zvýšiť množstvo ${cleanLabel(item.label)}`"
                  >
                    <Plus class="w-3.5 h-3.5" />
                  </button>
                </div>

                <!-- Price -->
                <div class="flex flex-col items-end gap-0.5">
                  <span v-if="itemOldPrice(item)" class="text-xs text-gray-400 line-through font-tech">
                    {{ getFormattedPrice(adjustPrice((itemOldPrice(item) || 0) * item.quantity)) }}
                  </span>
                  <span class="text-xl font-black font-tech text-black">
                    {{ getFormattedPrice(adjustPrice(item.price?.totalPrice || 0)) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Promo / zľavové položky — pod produktami -->
          <template v-for="promo in promotionItems" :key="promo.id">
            <div class="bg-white border border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between gap-4">
              <div class="flex items-center gap-2 min-w-0">
                <Tag class="w-4 h-4 text-brand flex-shrink-0" />
                <span class="text-sm font-bold uppercase text-gray-800 truncate">Zľavový kód: {{ promo.label }}</span>
              </div>
              <span class="font-black font-tech text-lg text-brand flex-shrink-0">
                {{ getFormattedPrice(adjustPrice(promo.price?.totalPrice || 0)) }}
              </span>
            </div>
          </template>

        </div>

        <!-- ── RIGHT: Order Summary ──────────────────────────────────── -->
        <aside class="w-full lg:w-[400px] flex-shrink-0 lg:sticky lg:top-28">

          <OrderSummary
            :step="1"
            :can-action="true"
            action-label="Pokračovať do objednávky"
            v-model:is-express-shipping="expressShipping"
            :express-product="expressProduct"
            @action="navigateTo(localePath('/checkout'))"
          />

          <!-- Share + Save -->
          <div class="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 px-6">
            <ShareCart />
            <div class="w-px h-4 bg-gray-200 flex-shrink-0"></div>
            <SaveCart />
          </div>


          <!-- Restore banner -->
          <div v-if="isRestoringCart" class="flex items-center gap-3 bg-brand/5 border border-brand/20 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-brand">
            <span class="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
            Obnovovanie zdieľaného košíka...
          </div>

        </aside>

      </div><!-- /flex row -->

      <!-- ── AI Cart Advisor — plná šírka pod layoutom ─────────────── -->
      <div class="mt-14">
        <CartAdvisor :cart-items="cartAdvisorItems" />
      </div>

      </div><!-- /v-else cart content -->

    </div>
  </div>
</template>

<style scoped>
/* Scrollbar skrytý pre carousel — scoped aby neovplyvnil globálne */
.cart-no-scrollbar::-webkit-scrollbar { display: none; }
.cart-no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
