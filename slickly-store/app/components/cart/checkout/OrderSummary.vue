<script setup lang="ts">
import { Tag, ShieldCheck, Truck, ArrowLeft, ArrowRight, Loader2, Lock, RefreshCw, Zap, ShoppingBag, CreditCard, ChevronDown, ExternalLink } from 'lucide-vue-next';
import { useShippingMetadata } from '~/composables/useShippingMetadata';
import { useRuntimeConfig, useShopwareContext } from '#imports';

const props = defineProps<{
    step: number;
    shippingMethodId?: string;
    paymentMethodId?: string;
    shippingMethods?: any[];
    paymentMethods?: any[];
    isExpressShipping?: boolean;
    canAction?: boolean;
    isSubmitting?: boolean;
    actionLabel?: string;
    expressProduct?: any;
    dobierkaProduct?: any;
    taxRate?: number; // country-aware sadzba z useCheckoutFlow (okamžitá, bez čakania na cart)
    countryIso?: string; // ISO krajiny doručenia — checkout posiela lokálne, cart page padá na globálne
    isReverseCharge?: boolean; // B2B + cudzia EU krajina → 0% DPH, vypočítané v useCheckoutFlow
    isCompanyPurchase?: boolean;
    backLabel?: string;
}>();

const emit = defineEmits<{
    (e: 'action'): void;
    (e: 'update:isExpressShipping', val: boolean): void;
    (e: 'back'): void;
}>();

const { cartItems, cart, totalPrice, addPromotionCode } = useCart();
const config = useRuntimeConfig();
const { balikovoMetadata, spsMetadata, toptransCzMetadata, toptransPlMetadata, isLoading: isShippingLoading, parseMethod } = useShippingMetadata();
const { apiClient } = useShopwareContext();
const { selectedCountryTaxRate, selectedCountryDisplay } = useCountrySelector();

// Krajina doručenia — checkout posiela prop, cart page (step 1) padá na globálny navbar výber
const countryIso = computed(() => (props.countryIso || selectedCountryDisplay.value.iso || 'SK').toUpperCase());
// CZ/PL = fixná sadzba (Toptrans CZ/PL), žiadna doprava zadarmo
const isForeignFlat = computed(() => countryIso.value === 'CZ' || countryIso.value === 'PL');
const foreignFlatMeta = computed(() =>
    countryIso.value === 'CZ' ? toptransCzMetadata.value
    : countryIso.value === 'PL' ? toptransPlMetadata.value
    : null
);

const couponInput = ref('');
const couponError = ref('');
const couponSuccess = ref('');
const isApplyingCoupon = ref(false);

const selectedShipping = computed(() =>
    props.shippingMethods?.find((m) => m.id === props.shippingMethodId) ?? null
);
const selectedPayment = computed(() =>
    props.paymentMethods?.find((m) => m.id === props.paymentMethodId) ?? null
);

const cheapestShipping = computed<number | null>(() => {
    // CZ/PL → jediná metóda (Toptrans CZ/PL), žiadna doprava zadarmo
    if (isForeignFlat.value) {
        return foreignFlatMeta.value?.basePrice ?? null;
    }
    // Zosúladenie s progress barom: doprava je zadarmo IBA ak košík splní effectiveThreshold
    // (pre bikes = spsMetadata.freeThreshold, inak min z oboch kuriérov)
    const qualifiesForFree = effectiveThreshold.value !== null && productSubtotal.value >= effectiveThreshold.value;

    if (props.shippingMethods?.length) {
        const prices: number[] = [];
        for (const m of props.shippingMethods) {
            if (!m?.id) continue;
            // Pre bikes Balikovo nedoručuje — rovnaká logika ako v cart fallback
            if (hasBikeInCart.value && m.id === balikovoMetadata.value?.id) continue;
            const meta = parseMethod(m);
            const basePrice = meta.basePrice ?? 999;
            // Skip always-free (Osobný odber: basePrice=0 bez freeThreshold)
            if (basePrice === 0 && !meta.freeThreshold) continue;
            if (qualifiesForFree && meta.freeThreshold !== null && productSubtotal.value >= meta.freeThreshold) {
                prices.push(0);
            } else if (basePrice > 0) {
                prices.push(basePrice);
            }
        }
        return prices.length ? Math.min(...prices) : null;
    }
    // Fallback pre cart (step=1) — rovnaká logika ako effectiveThreshold:
    // bikes → len spsMetadata, ostatné → obaja kuriéri
    const metaList = hasBikeInCart.value
        ? [spsMetadata.value]
        : [balikovoMetadata.value, spsMetadata.value];
    const candidates: number[] = [];
    for (const meta of metaList) {
        if (!meta) continue;
        if (qualifiesForFree && meta.freeThreshold != null && productSubtotal.value >= meta.freeThreshold) {
            candidates.push(0);
        } else if (meta.basePrice != null && meta.basePrice > 0) {
            candidates.push(meta.basePrice);
        }
    }
    return candidates.length ? Math.min(...candidates) : null;
});

const shippingCostFromCart = computed<number>(() => {
    const deliveries = (cart.value as any)?.deliveries;
    if (!deliveries?.length) return 0;
    return deliveries[0]?.shippingCosts?.totalPrice ?? 0;
});

const dobierkaProductId = config.public.shopware.ids.products?.dobierka as string | undefined;
const dobierkaPaymentId = (config.public.shopware.ids.payment as any)?.dobierka as string | undefined;
const balneBikeId  = config.public.shopware.ids.products?.balneBike  as string | undefined;
const balneEbikeId = config.public.shopware.ids.products?.balneEbike as string | undefined;
const balneProductIds = computed(() => [balneBikeId, balneEbikeId].filter(Boolean) as string[]);
const osobnyOdberId = config.public.shopware.ids.shipping?.osobnyOdber as string | undefined;
const isOsobnyOdber = computed(() => props.shippingMethodId === osobnyOdberId);

const productSubtotal = computed(() => {
    const expressProductId = config.public.shopware.ids.products?.expressShipping;
    return cartItems.value
        .filter((i: any) =>
            i.type === 'product' &&
            i.referencedId !== expressProductId &&
            i.referencedId !== dobierkaProductId &&
            !balneProductIds.value.includes(i.referencedId)
        )
        .reduce((sum: number, i: any) => sum + (i.price?.totalPrice ?? 0), 0);
});

const balneBikeItem = computed(() =>
    cartItems.value.find((i: any) => i.referencedId === balneBikeId)
);
const balneEbikeItem = computed(() =>
    cartItems.value.find((i: any) => i.referencedId === balneEbikeId)
);
const balneBikeCost = computed(() => isOsobnyOdber.value ? 0 : (balneBikeItem.value?.price?.totalPrice ?? 0));
const balneEbikeCost = computed(() => isOsobnyOdber.value ? 0 : (balneEbikeItem.value?.price?.totalPrice ?? 0));
const balneCost = computed(() => balneBikeCost.value + balneEbikeCost.value);

const adjustedBalneBikeCost = computed(() => adjustItemPrice(balneBikeCost.value));
const adjustedBalneEbikeCost = computed(() => adjustItemPrice(balneEbikeCost.value));

const isDobierkaSelected = computed(() => props.paymentMethodId === dobierkaPaymentId);

const dobirjaCost = computed(() => {
    if (props.step < 3 || !isDobierkaSelected.value) return 0;
    const item = (cartItems.value as any[]).find((i: any) => i.referencedId === dobierkaProductId);
    return item?.price?.totalPrice ?? (props.dobierkaProduct?.calculatedPrice?.unitPrice ?? 0);
});

const adjustedDobirjaCost = computed(() => adjustItemPrice(dobirjaCost.value));

const shippingPriceToDisplay = computed(() => {
    if (!props.shippingMethodId || !selectedShipping.value) return 0;
    const meta = parseMethod(selectedShipping.value);
    // Free shipping skratka IBA pre SK — CZ/PL platia vždy fixnú sadzbu z cart deliveries
    if (!isForeignFlat.value && meta.freeThreshold !== null && productSubtotal.value >= meta.freeThreshold) {
        return 0;
    }
    return shippingCostFromCart.value;
});

// Počet platených dopráv — určuje "Doprava od X" (viac) vs "Doprava X" (jedna)
const paidMethodCount = computed(() => {
    if (isForeignFlat.value) return 1;
    const metas = hasBikeInCart.value
        ? [spsMetadata.value, balikovoMetadata.value]
        : [balikovoMetadata.value, spsMetadata.value];
    return metas.filter((m: any) => (m?.basePrice ?? 0) > 0).length || 1;
});

const expressCost = computed(() => {
    if (!props.isExpressShipping) return 0;
    return props.expressProduct?.calculatedPrice?.unitPrice ?? 12.90;
});

const displayTotal = computed(() => {
    const promos = cartItems.value
        .filter((i: any) => i.type !== 'product')
        .reduce((sum: number, i: any) => sum + (i.price?.totalPrice ?? 0), 0);
    // Doprava do SPOLU: do kroku 2 odhad (najlacnejšia dostupná), od kroku 3 vybraná metóda.
    // Pozn.: doprava sa NEráta do prahu dopravy zadarmo (ten beží na productSubtotal).
    const shipping = props.step <= 2
        ? (cheapestShipping.value && cheapestShipping.value > 0 ? cheapestShipping.value : 0)
        : shippingPriceToDisplay.value;
    return productSubtotal.value + shipping + expressCost.value + dobirjaCost.value + balneCost.value + promos;
});

// ── DPH z Shopware (country-aware) ─────────────────────────────────────────
// cart.price.calculatedTaxes = [{ taxRate, tax, price }] — Shopware vypočíta
// sadzbu podľa krajiny zákazníka. Fallback 23 % kým cart nenačítaný / krajina nevybratá.
const FALLBACK_TAX_RATE = 23;

const cartTaxes = computed(() =>
    (cart.value as any)?.price?.calculatedTaxes as { taxRate: number; tax: number; price: number }[] | undefined
);

// Efektívna sadzba — priorita: reverse charge (0%) > prop (checkout) > navbar selection > fallback
const effectiveTaxRate = computed<number>(() => {
    if (props.isReverseCharge) return 0;
    if (props.taxRate != null) return props.taxRate;
    return selectedCountryTaxRate.value; // reaktívne — zmena krajiny v navbare okamžite prepočíta
});

// Čistá (bez DPH) = vždy SK_brutto / 1.23 — netto je fixné, mení sa brutto podľa krajiny
// FALLBACK_TAX_RATE = 23 % = slovenská sadzba vstavená do brutto ceny produktu
const netDisplayTotal = computed(() => displayTotal.value / (1 + FALLBACK_TAX_RATE / 100));

// Brutto podľa krajiny zákazníka: netto × (1 + countryRate/100)
// Reverse charge: zákazník platí iba netto (0% DPH)
const adjustedDisplayTotal = computed(() => {
    if (props.isReverseCharge) return netDisplayTotal.value;
    return netDisplayTotal.value * (1 + effectiveTaxRate.value / 100);
});
const taxDisplayAmount = computed(() => props.isReverseCharge ? 0 : netDisplayTotal.value * (effectiveTaxRate.value / 100));

// Hodnota tovaru (produkty) prepočítaná podľa krajiny zákazníka
const adjustedProductSubtotal = computed(() => {
    const net = productSubtotal.value / (1 + FALLBACK_TAX_RATE / 100);
    if (props.isReverseCharge) return Math.round(net * 100) / 100;
    return Math.round(net * (1 + effectiveTaxRate.value / 100) * 100) / 100;
});

// Prepočet položky košíka (SK brutto → krajinové brutto)
const adjustItemPrice = (skGross: number): number => {
    if (!skGross) return 0;
    const net = skGross / (1 + FALLBACK_TAX_RATE / 100);
    if (props.isReverseCharge) return Math.round(net * 100) / 100;
    return Math.round(net * (1 + effectiveTaxRate.value / 100) * 100) / 100;
};

const BIKE_CATEGORY_IDS = computed(() => [
    config.public.shopware.ids.categories.bikes,
    config.public.shopware.ids.categories.ebikes,
].filter(Boolean) as string[]);

const hasBikeInCart = computed(() =>
    cartItems.value.some((i: any) =>
        i.payload?.categoryTree?.some((id: string) => BIKE_CATEGORY_IDS.value.includes(id)) ||
        i.payload?.categoryIds?.some((id: string) => BIKE_CATEGORY_IDS.value.includes(id))
    )
);

const effectiveThreshold = computed<number | null>(() => {
    if (isShippingLoading.value) return null;
    // CZ/PL nemajú dopravu zadarmo → progress bar skrytý
    if (isForeignFlat.value) return null;
    if (hasBikeInCart.value) {
        const t = spsMetadata.value?.freeThreshold;
        return (typeof t === 'number' && t > 1) ? t : null;
    }
    const candidates = [balikovoMetadata.value?.freeThreshold, spsMetadata.value?.freeThreshold]
        .filter((v): v is number => typeof v === 'number' && v > 1);
    return candidates.length > 0 ? Math.min(...candidates) : null;
});

const amountToFree = computed(() =>
    effectiveThreshold.value === null ? null : Math.max(0, effectiveThreshold.value - productSubtotal.value)
);
const freePercent = computed(() =>
    effectiveThreshold.value ? Math.min(100, (productSubtotal.value / effectiveThreshold.value) * 100) : 0
);

// ── Image fetching logic ──────────────────────────────────────────────────
const productMediaMap = ref<Record<string, string>>({});

const fetchMediaForItems = async () => {
    const ids = cartItems.value
        .filter((i: any) => i.type === 'product')
        .map((i: any) => i.referencedId)
        .filter((id: string) => id && !productMediaMap.value[id]);
    
    if (ids.length === 0) return;

    try {
        const res = await apiClient.invoke('readProduct post /product' as any, {
            body: {
                filter: [{ type: 'equalsAny', field: 'id', value: ids }],
                includes: { 
                    product: ['id', 'cover'],
                    product_media: ['media'],
                    media: ['url', 'thumbnails']
                }
            }
        });
        const products = (res.data || res)?.elements || [];
        products.forEach((p: any) => {
            const url = p.cover?.media?.url || p.cover?.url || p.cover?.media?.thumbnails?.[0]?.url;
            if (url) productMediaMap.value[p.id] = url;
        });
    } catch (e) {
        console.error('[OrderSummary] Failed to fetch media:', e);
    }
};

watch(cartItems, fetchMediaForItems, { immediate: true, deep: true });

// ── Google Reviews (reuse cached data from ReviewsWall key) ──────────────
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Google&query_place_id=ChIJ1f4ccNbJFUcRUbCbvaArmfw';
const { data: reviewsData } = useAsyncData<{ rating: number; totalReviews: number }>(
    'google-reviews',
    () => $fetch<{ rating: number; totalReviews: number }>('/api/google/reviews').catch(() => ({ rating: 4.8, totalReviews: 0 }))
);
const googleRating = computed(() => reviewsData.value?.rating ?? 4.8);
const googleTotal = computed(() => reviewsData.value?.totalReviews ?? 0);
const ratingStars = computed(() => {
    const r = Math.round(googleRating.value);
    return '★'.repeat(r) + '☆'.repeat(5 - r);
});

const activePromos = computed(() => cartItems.value.filter((i: any) => i.type !== 'product'));
const hasActivePromo = computed(() => activePromos.value.length > 0);

const handleApplyCoupon = async () => {
    if (!couponInput.value.trim()) return;
    isApplyingCoupon.value = true;
    couponError.value = '';
    couponSuccess.value = '';
    try {
        await addPromotionCode(couponInput.value.trim());
        couponSuccess.value = couponInput.value.trim().toUpperCase();
        couponInput.value = '';
    } catch {
        couponError.value = 'Neplatný alebo neaplikovateľný kód.';
    } finally {
        isApplyingCoupon.value = false;
    }
};

const formatPrice = (price: number) =>
    new Intl.NumberFormat('sk-SK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);

const resolveImageUrl = (item: any) => {
    let url = productMediaMap.value[item.referencedId] || item.cover?.url || item.cover?.media?.url || item.payload?.media?.[0]?.url;
    if (!url) return 'https://placehold.co/160x160';
    if (import.meta.dev && url.startsWith('https://mtsport.store')) {
        return url.replace(/^https:\/\/mtsport\.store/, '/mts-proxy');
    }
    return url;
};
</script>

<template>
  <div class="bg-white border border-gray-200 font-sans overflow-hidden transition-all duration-300">
    <!-- Header -->
    <div class="flex items-center gap-3 px-5 md:px-6 py-5 border-b border-gray-100 bg-white">
      <ShoppingBag class="w-4 h-4 text-gray-900" :stroke-width="1.8" />
      <h2 class="text-xs font-bold tracking-[0.2em] text-gray-900 font-sans uppercase leading-none">
        Súhrn objednávky
      </h2>
    </div>

    <!-- Product list (Checkout mode) -->
    <div v-if="step > 1" class="px-5 py-5 max-h-72 overflow-y-auto border-b border-gray-50 space-y-5 custom-scrollbar bg-white">
      <div v-for="item in cartItems.filter((i: any) => i.type === 'product' && i.referencedId !== config.public.shopware.ids.products?.expressShipping && (step >= 3 || i.referencedId !== config.public.shopware.ids.products?.dobierka) && !balneProductIds.includes(i.referencedId))" :key="item.id" class="flex gap-4 items-center">
        <div class="w-16 h-16 bg-gray-50 border border-gray-100 flex-shrink-0 relative overflow-hidden">
          <NuxtImg
            :src="resolveImageUrl(item)"
            :alt="item.label"
            format="webp"
            loading="lazy"
            class="w-full h-full object-contain mix-blend-multiply"
          />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[11px] font-black uppercase truncate font-tech leading-tight text-gray-900" :title="item.referencedId === dobierkaProductId ? 'Dobierka' : item.label">
            {{ item.referencedId === dobierkaProductId ? 'Dobierka' : item.label }}
          </p>
          <div class="flex items-center justify-between mt-1">
            <p class="text-[10px] text-gray-400 font-medium font-sans">
              {{ item.quantity }} ks × {{ formatPrice(adjustItemPrice(item.price?.unitPrice ?? 0)) }} €
            </p>
            <p class="font-black font-tech text-[13px] text-black">
              {{ formatPrice(adjustItemPrice(item.price?.totalPrice ?? 0)) }} €
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Price Breakdown -->
    <div class="px-6 py-6 space-y-4 text-sm border-b border-gray-50 bg-white">
      <div class="flex justify-between items-baseline text-gray-500">
        <span class="font-sans font-medium text-[13px]">Hodnota tovaru</span>
        <span class="font-tech font-black text-black text-base">{{ formatPrice(adjustedProductSubtotal) }} €</span>
      </div>

      <!-- Zľavový kód — hneď pod hodnotu tovaru -->
      <template v-for="promo in cartItems.filter((i: any) => i.type !== 'product')" :key="promo.id">
        <div class="flex justify-between items-baseline text-gray-500">
          <span class="font-sans font-medium text-[13px] flex items-center gap-1.5">
            <Tag class="w-3 h-3 text-brand flex-shrink-0" />
            {{ promo.label }}
          </span>
          <span class="font-tech font-black text-sm text-brand">{{ formatPrice(adjustItemPrice(promo.price?.totalPrice ?? 0)) }} €</span>
        </div>
      </template>

      <div v-if="adjustedBalneBikeCost > 0" class="flex justify-between items-baseline text-gray-500">
        <span class="font-sans font-medium text-[13px]">Balné bicykel <span class="text-[11px] text-gray-400">×{{ balneBikeItem?.quantity ?? 1 }}</span></span>
        <span class="font-tech font-black text-sm text-black">{{ formatPrice(adjustedBalneBikeCost) }} €</span>
      </div>
      <div v-if="adjustedBalneEbikeCost > 0" class="flex justify-between items-baseline text-gray-500">
        <span class="font-sans font-medium text-[13px]">Balné elektrobicykel <span class="text-[11px] text-gray-400">×{{ balneEbikeItem?.quantity ?? 1 }}</span></span>
        <span class="font-tech font-black text-sm text-black">{{ formatPrice(adjustedBalneEbikeCost) }} €</span>
      </div>

      <div class="flex justify-between items-baseline text-gray-500">
        <span class="font-sans font-medium text-[13px]">Doprava</span>
        <template v-if="step <= 2">
          <span v-if="isShippingLoading" class="text-[11px] italic font-sans text-gray-400">Načítava sa...</span>
          <span v-else-if="cheapestShipping === 0" class="font-tech font-black text-sm text-green-600">ZADARMO</span>
          <span v-else-if="cheapestShipping !== null" class="font-tech font-black text-sm text-black">{{ paidMethodCount > 1 ? 'od ' : '' }}{{ formatPrice(cheapestShipping) }} €</span>
          <span v-else class="text-[11px] italic font-sans text-gray-400">Vypočíta sa v pokladni</span>
        </template>
        <template v-else>
          <span class="font-tech font-black" :class="shippingPriceToDisplay === 0 ? 'text-green-600' : 'text-black'">
            {{ shippingPriceToDisplay === 0 ? 'ZADARMO' : `${formatPrice(shippingPriceToDisplay)} €` }}
          </span>
        </template>
      </div>

      <div class="flex justify-between items-baseline text-gray-500">
        <span class="font-sans font-medium text-[13px]">Platba</span>
        <template v-if="step <= 2">
          <span class="font-tech font-black text-sm text-green-600">ZADARMO</span>
        </template>
        <template v-else>
          <span class="font-tech font-black" :class="adjustedDobirjaCost === 0 ? 'text-green-600' : 'text-black'">
            {{ adjustedDobirjaCost === 0 ? 'ZADARMO' : `${formatPrice(adjustedDobirjaCost)} €` }}
          </span>
        </template>
      </div>

      <!-- Free shipping progress bar — cart + všetky checkout kroky -->
      <div v-if="amountToFree !== null" class="mt-[-8px]">
        <div class="flex items-center justify-between mb-2">
          <span v-if="amountToFree > 0" class="text-[12px] font-sans text-gray-500 leading-none">
              Chýba vám <span class="text-black font-bold">{{ formatPrice(amountToFree) }} €</span> do <span class="font-bold text-black uppercase tracking-tight">dopravy zadarmo</span>
          </span>
          <span v-else class="text-[12px] font-bold text-green-600 font-sans uppercase tracking-tight leading-none flex items-center gap-1">
              <Truck class="w-3.5 h-3.5" /> Dopravu máte ZADARMO
          </span>
        </div>
        <div class="w-full h-1 bg-gray-100 overflow-hidden">
          <div
              class="h-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              :class="amountToFree <= 0 ? 'bg-green-600' : 'bg-brand'"
              :style="{ width: `${freePercent}%` }"
          ></div>
        </div>
      </div>

      <template v-if="isCompanyPurchase || isReverseCharge">
        <div class="flex justify-between text-gray-400 text-[11px] pt-1 border-t border-gray-50">
          <span>Cena bez DPH</span>
          <span>{{ formatPrice(netDisplayTotal) }} €</span>
        </div>
        <div class="flex justify-between text-gray-400 text-[11px]">
          <span>{{ props.isReverseCharge ? 'Reverse charge (0 %)' : `DPH (${effectiveTaxRate} %)` }}</span>
          <span>{{ formatPrice(props.isReverseCharge ? 0 : taxDisplayAmount) }} €</span>
        </div>
      </template>
      <template v-else>
        <div class="flex justify-end text-[10px] text-gray-400 pt-1 border-t border-gray-50">
          vrátane DPH ({{ effectiveTaxRate }} %)
        </div>
      </template>

      <div class="flex justify-between items-baseline pt-4 border-t border-gray-100">
        <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Spolu</span>
        <span class="text-3xl font-black font-tech text-black leading-none">
          {{ formatPrice(adjustedDisplayTotal) }} €
        </span>
      </div>
    </div>

    <!-- Express Shipping -->
    <div class="px-6 py-4 border-b border-gray-50 bg-amber-50/20 group cursor-pointer" @click="emit('update:isExpressShipping', !props.isExpressShipping)">
      <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
              <div class="relative flex items-center justify-center w-4 h-4 border border-gray-300 group-hover:border-black transition-colors bg-white flex-shrink-0">
                  <input type="checkbox" :checked="props.isExpressShipping" class="sr-only" />
                  <div v-if="props.isExpressShipping" class="w-2.5 h-2.5 bg-brand"></div>
              </div>
              <div>
                  <div class="text-[11px] font-black uppercase tracking-widest font-tech flex items-center gap-1.5">
                      <Zap class="w-3 h-3 text-amber-500 fill-current flex-shrink-0" />
                      Expresné odoslanie
                  </div>
                  <div class="text-[9px] text-gray-400 font-sans uppercase font-bold mt-0.5 tracking-tight">Expedícia dnes do 13:00</div>
              </div>
          </div>
          <span class="font-tech font-black text-xs text-black flex-shrink-0">+ {{ formatPrice(expressProduct?.calculatedPrice?.unitPrice || 12.90) }} €</span>
      </div>
    </div>

    <!-- Coupon — accordion, aby zákazníci neodchádzali hľadať kódy -->
    <details class="border-b border-gray-50 bg-white group/coupon" :open="hasActivePromo || undefined">
      <summary class="px-6 py-4 flex items-center gap-2 font-sans font-medium text-[13px] text-black cursor-pointer hover:text-brand transition-colors list-none select-none">
        <Tag class="w-3.5 h-3.5 flex-shrink-0" />
        Mám zľavový kód
        <ChevronDown class="ml-auto w-4 h-4 opacity-60 group-open/coupon:rotate-180 transition-transform duration-200" />
      </summary>
      <div class="px-6 pb-5">
        <!-- Aktívne kódy -->
        <div v-for="promo in cartItems.filter((i: any) => i.type !== 'product')" :key="promo.id" class="flex items-center justify-between py-2 mb-2 border-b border-gray-100">
          <div class="flex items-center gap-2 min-w-0">
            <span class="px-1.5 py-0.5 bg-brand text-white text-[8px] font-black uppercase tracking-widest flex-shrink-0">KÓD</span>
            <span class="text-xs font-bold uppercase text-gray-800 truncate">{{ promo.label }}</span>
          </div>
          <span class="font-tech font-black text-sm text-brand flex-shrink-0 ml-2">{{ formatPrice(adjustItemPrice(promo.price?.totalPrice ?? 0)) }} €</span>
        </div>
        <!-- Input pre nový kód -->
        <div class="flex gap-0 border border-gray-200 focus-within:border-black transition-colors">
          <input
            v-model="couponInput"
            type="text"
            placeholder="NAPR. MT2026"
            class="flex-1 uppercase text-xs py-3 px-3 rounded-none focus:outline-none font-sans"
            @keydown.enter="handleApplyCoupon"
          />
          <button
            class="px-5 py-3 bg-gray-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 flex-shrink-0 font-sans"
            :disabled="!couponInput.trim() || isApplyingCoupon"
            @click="handleApplyCoupon"
          >
            {{ isApplyingCoupon ? '...' : 'Použiť' }}
          </button>
        </div>
        <p v-if="couponError" class="text-[11px] text-red-500 mt-1.5">{{ couponError }}</p>
        <p v-if="couponSuccess" class="text-[11px] text-green-600 mt-1.5 font-bold">✓ Kód {{ couponSuccess }} bol aplikovaný</p>
      </div>
    </details>

    <div class="px-6 py-6 bg-white">

      <!-- Sociálny dôkaz — reálne Google Reviews dáta, klikateľné -->
      <a
        :href="MAPS_URL"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-3 mb-4 p-3 bg-gray-50 border border-gray-100 hover:border-amber-300 hover:bg-amber-50/50 transition-colors group/reviews"
      >
        <div class="flex text-amber-400 text-xs gap-px leading-none flex-shrink-0">{{ ratingStars }}</div>
        <span class="text-[10px] text-gray-500 font-sans leading-tight flex-1">
          <strong class="text-black font-bold">{{ googleRating.toFixed(1).replace('.', ',') }}/5</strong>
          <template v-if="googleTotal > 0"> · {{ googleTotal }} recenzií na Google</template>
          <template v-else> · overené hodnotenia zákazníkov</template>
        </span>
        <ExternalLink class="w-3 h-3 text-gray-300 group-hover/reviews:text-amber-400 transition-colors flex-shrink-0" />
      </a>

      <button
        class="btn-checkout !text-white !font-tech !font-bold !uppercase !tracking-[0.15em] !py-0 flex items-center justify-center group/btn shadow-md hover:shadow-lg transition-all"
        :class="'!h-16'"
        :disabled="isSubmitting || !canAction"
        @click="emit('action')"
      >
        <template v-if="isSubmitting">
          <Loader2 class="w-4 h-4 mr-2 animate-spin flex-shrink-0" />
          <span class="text-[13px]">{{ actionLabel || (step === 1 ? 'Prejsť k pokladni' : 'Pokračovať') }}</span>
        </template>
        <template v-else-if="step === 1">
          <span class="text-[13px] !tracking-[0.08em] whitespace-nowrap">{{ actionLabel || 'Prejsť k pokladni' }}</span>
          <ArrowRight class="w-5 h-5 ml-2.5 flex-shrink-0" />
        </template>
        <template v-else-if="step === 2">
          <span class="text-[13px] !tracking-[0.08em] whitespace-nowrap">{{ actionLabel || 'Pokračovať' }}</span>
          <ArrowRight class="w-5 h-5 ml-2.5 flex-shrink-0" />
        </template>
        <template v-else>
          <span class="flex flex-col items-center leading-none gap-1.5">
            <span class="text-sm tracking-[0.15em] font-bold uppercase">{{ actionLabel || 'Záväzne objednať' }}</span>
            <span class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-red-300 flex-shrink-0"></span>
              <span class="font-tech font-black text-[13px] leading-none">{{ formatPrice(adjustedDisplayTotal) }} €</span>
            </span>
          </span>
        </template>
      </button>

      <div v-if="step === 1" class="mt-6 flex justify-center">
        <NuxtLink to="/" class="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft class="w-3.5 h-3.5" />
          Späť do obchodu
        </NuxtLink>
      </div>

      <div v-if="backLabel" class="mt-6 flex justify-center">
        <button @click="emit('back')" class="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors bg-transparent border-0 cursor-pointer">
          <ArrowLeft class="w-3.5 h-3.5" />
          {{ backLabel }}
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
</style>
