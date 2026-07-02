<script setup lang="ts">
import { useRoute, useRouter, navigateTo, useState } from '#imports';
import { ref, computed } from 'vue';
import { Star, Check, Truck, Minus, Plus, AlertCircle, Clock, Scale, Eye, Zap, Heart, Ruler, ChevronDown, X } from 'lucide-vue-next';
import RatingStars from '~/components/ui/RatingStars.vue';
import { type Product, type Variant } from '~/types';
import AddToCartButton from '~/components/ui/AddToCartButton.vue';
import AppModal from '~/components/ui/AppModal.vue';
import VariantSelector from '~/components/product/VariantSelector.vue';
import QuantitySelector from '~/components/ui/QuantitySelector.vue';
import TrustBadges from '~/components/product/TrustBadges.vue';
import { sanitizeHtml } from '~/utils/sanitize';
import { formatRating } from '~/utils/format';
import { useProductHelpers } from '~/composables/useProductHelpers';
import { useCustomerWishlist } from '~/composables/useCustomerWishlist';
import { useProductBadges, badgeSizeClass } from '~/composables/useProductBadges';
import BaseButton from '~/components/ui/BaseButton.vue';
// @ts-ignore
import { useUser } from '@shopware/composables';

const { isLoggedIn } = useUser();
const { t } = useI18n();
const { hasPriceVariance } = useProductHelpers();
const { toggleWishlist, isInWishlist } = useCustomerWishlist();
const { splitPdpBadges } = useProductBadges();
const pdpBadges = computed(() => splitPdpBadges(props.product).topBadges);
const route = useRoute();
const router = useRouter();

const props = defineProps<{
  product: Product;
  quantity: number;
  selectedSize: string;
  currentVariant?: Variant;
  selectedVariant?: any;
  ratingAverage?: number;
  reviewCount?: number;
}>();

const emit = defineEmits<{
  (e: 'update:quantity', q: number): void;
  (e: 'update:selectedSize', s: string): void;
  (e: 'addToCompare', event: MouseEvent, product: Product): void;
  (e: 'addToWishlist', event: MouseEvent, product: Product): void;
  (e: 'openDescription', product: Product): void;
  (e: 'openWatchdog', product: Product): void;
  (e: 'openPriceOffer', product: Product): void;
  (e: 'openSizeChart'): void;
  (e: 'variantSelected', payload: any): void;
  (e: 'openReviews'): void;
}>();

const isShippingModalOpen = ref(false);
const isWishlistLoginModalOpen = ref(false);
const isMobileVariantPanelOpen = useState('mobileVariantPanelOpen', () => false);

const config = useRuntimeConfig();
const bikeCategoryIds = computed(() =>
    [config.public.shopware.ids.categories.bikes, config.public.shopware.ids.categories.ebikes].filter(Boolean) as string[],
);

const sizeLabel = computed(() => {
    // 1. Custom field override má prednosť — nastavuje sa priamo v Shopware admine
    if (props.product.customFields?.is_bike !== undefined) {
        return props.product.customFields.is_bike ? t('pdp.size_frame') : t('pdp.size_general');
    }
    // 2. UUID-based detekcia kategórie — odolné voči premenovaniam a lokalizácii
    const productCatIds: string[] =
        (props.product as any).categoryIds ||
        ((props.product as any).categories?.map((c: any) => c.id) ?? []);
    const isBike = bikeCategoryIds.value.length > 0 &&
        productCatIds.some((id) => bikeCategoryIds.value.includes(id));
    return isBike ? t('pdp.size_frame') : t('pdp.size_general');
});

const updateQuantity = (val: number) => {
    emit('update:quantity', val);
};

const sanitizedProductName = computed(() => props.product.name?.replace(/\s*\(Variant\)$/i, '') || '');

const handleWishlistClick = async (e: MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn.value) {
        isWishlistLoginModalOpen.value = true;
        return;
    }
    const id = props.selectedVariant?.id || props.product.id;
    const wasInWishlist = isInWishlist(id);
    
    await toggleWishlist(id, props.product);
    
    // Trigger toast for both add and remove
    const toast = useState('wishlistToast', () => ({ show: false, productName: '', action: 'add' as 'add' | 'remove' }));
    toast.value = { 
        show: true, 
        productName: props.product.translated?.name || props.product.name || '',
        action: wasInWishlist ? 'remove' : 'add'
    };
};

const openGlobalLoginModal = () => {
    isWishlistLoginModalOpen.value = false;
    useState('loginModalOpen', () => false).value = true;
};

const goToRegister = () => {
    isWishlistLoginModalOpen.value = false;
    router.push(`/register?redirectTo=${encodeURIComponent(route.fullPath)}`);
};

const cartProduct = computed(() => ({
  ...props.product,
  id: props.selectedVariant?.id || props.product.id,
  name: props.selectedVariant?.name || props.product.name,
  hasVariants: (props.product.childCount ?? 0) > 0 || (props.product.children?.length ?? 0) > 0,
  _isVariantOverride: !!props.selectedVariant || !!props.product.parentId,
  isCloseout: props.selectedVariant?.isCloseout === true || props.product._raw?.isCloseout === true,
  availableStock: props.selectedVariant?.availableStock ?? props.product?.availableStock ?? props.product?._raw?.availableStock ?? 0,
  stock: props.selectedVariant?.stock ?? props.product?.stock ?? props.product?._raw?.stock ?? 0,
}));

// Derived: is the actively selected/loaded variant a closeout item?
const isActiveVariantCloseout = computed(() => {
  const raw = props.product._raw || props.product;
  // If we're on a specific variant page (parentId exists), check its isCloseout
  if (raw?.parentId) return raw?.isCloseout === true;
  // If a selectedVariant is set via query param, check it
  if (props.selectedVariant) return props.selectedVariant?.isCloseout === true;
  return false;
});

const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
};

const shortDescription = computed(() => {
    if (!props.product.description) return '';
    return stripHtml(props.product.description);
});

const { adjustPrice } = useCountrySelector();

const _listPrice = computed(() => {
    return props.selectedVariant?.calculatedPrice?.listPrice?.price ??
           props.selectedVariant?.calculatedPrices?.[0]?.listPrice?.price ??
           props.product.calculatedPrice?.listPrice?.price ??
           props.product.oldPrice;
});

const _currentPrice = computed(() => {
    return props.selectedVariant?.calculatedPrice?.unitPrice ??
           props.selectedVariant?.calculatedPrices?.[0]?.unitPrice ??
           props.product.calculatedPrice?.unitPrice ??
           props.product.price;
});

// Reaktívna krajinová úprava — zmena krajiny okamžite prepočíta ceny
const listPrice = computed(() => {
    const p = Number(_listPrice.value);
    return p ? adjustPrice(p) : _listPrice.value;
});

const currentPrice = computed(() => {
    const p = Number(_currentPrice.value);
    return p ? adjustPrice(p) : _currentPrice.value;
});

const discountPercent = computed(() => {
    const lp = Number(listPrice.value);
    const cp = Number(currentPrice.value);
    return (lp && cp && lp > cp) ? Math.round(((lp - cp) / lp) * 100) : 0;
});

const mocPrice = computed(() => {
    const cf = props.product.customFields || props.product._raw?.customFields;
    const v = cf?.mtsport_moc;
    return v && Number(v) > 0 ? Number(v) : null;
});
const pmocPrice = computed(() => {
    const cf = props.product.customFields || props.product._raw?.customFields;
    const v = cf?.mtsport_pmoc;
    return v && Number(v) > 0 ? Number(v) : null;
});
</script>

<template>
  <div role="main">
    <!-- Desktop Header Elements (Hidden on mobile as they are moved to the new MobileHeader layout block) -->
    <div class="hidden lg:block">
      <!-- Custom product badges (pdpPosition='top') — nad logom výrobcu, side-by-side -->
      <div v-if="pdpBadges.length" class="flex flex-row flex-wrap gap-1.5 mb-3">
        <span
          v-for="badge in pdpBadges"
          :key="badge.id"
          :class="['font-bold uppercase tracking-wider leading-none font-tech', badgeSizeClass(badge.size)]"
          :style="{ backgroundColor: badge.bgColor, color: badge.textColor }"
        >{{ badge.text }}</span>
      </div>

      <!-- Manufacturer Logo Section -->
      <div class="mb-2">
        <div v-if="product.manufacturer?.media?.url" class="opacity-90 hover:opacity-100 transition-opacity mb-2">
            <NuxtImg 
              :src="product.manufacturer.media.url" 
              :alt="`${product.brand} logo`"
              class="h-6 w-auto object-contain mix-blend-multiply"
              format="webp"
              loading="lazy"
            />
        </div>
      </div>
      
      <h1 class="text-2xl lg:text-3xl xl:text-4xl font-black text-black leading-tight mt-6 mb-4 font-tech uppercase tracking-wide">
        {{ sanitizedProductName }}
      </h1>

      <!-- Social proof — E-E-A-T signál, viditeľný ihneď po H1 (F-pattern) -->
      <div
        class="flex items-center gap-2 cursor-pointer group mb-4 min-h-[44px]"
        role="button"
        :aria-label="`Hodnotenie: ${formatRating(ratingAverage ?? product.ratingAverage)} z 5 hviezdičiek. Kliknutím zobrazíte recenzie.`"
        @click="emit('openReviews')"
      >
        <RatingStars :rating="ratingAverage ?? product.ratingAverage ?? 0" />
        <span class="text-[11px] font-bold text-gray-500 group-hover:text-brand font-sans transition-colors">
          {{ formatRating(ratingAverage ?? product.ratingAverage ?? 0) }}
        </span>
        <span class="text-[11px] text-gray-300 font-sans">|</span>
        <span class="text-[11px] font-bold underline underline-offset-2 decoration-gray-300 group-hover:text-brand group-hover:decoration-brand text-gray-500 font-sans transition-colors">
          {{ reviewCount ?? product.productReviewsCount ?? 0 }} {{ $t('pdp.reviews_count') }}
        </span>
        <!-- Verified badge — E-E-A-T trust signal -->
        <span
          v-if="(reviewCount ?? product.productReviewsCount ?? 0) > 0"
          class="hidden sm:flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5"
        >
          <Check class="w-2.5 h-2.5" /> Overené
        </span>
      </div>
    </div>
    
    <div v-if="shortDescription" class="hidden md:block mb-6 pb-6">
       <div class="text-gray-600 text-sm font-sans leading-relaxed line-clamp-3 mb-3">
         {{ shortDescription }}
       </div>
       <button 
         @click="emit('openDescription', product)"
         class="text-xs font-bold text-brand hover:text-black uppercase tracking-widest flex items-center transition-colors group bg-white border-0 p-0"
       >
         {{ $t('pdp.read_more') }}
         <ChevronDown class="w-4 h-4 ml-1.5 transition-transform group-hover:translate-y-0.5" />
       </button>
    </div>

    <!-- Pricing Section -->
    <div class="flex flex-col mb-8 relative mt-6 md:mt-8 lg:mt-6">
      <div v-if="discountPercent > 0" class="absolute bottom-full left-0 mb-0.5 text-sm md:text-base text-gray-400 line-through font-tech decoration-1 pointer-events-none">
          {{ listPrice }} €
      </div>
      
      <div class="flex items-center gap-4">
          <span class="text-2xl md:text-4xl font-black text-black font-tech leading-none">
            <template v-if="!selectedVariant && hasPriceVariance(product)">
              Od 
            </template>
            {{ currentPrice }} €
          </span>

          <div v-if="discountPercent > 0"
               class="relative group px-3 py-1 text-sm md:text-base font-black text-black uppercase tracking-wider font-tech bg-amber shadow-sm self-stretch flex items-center cursor-help">
             -{{ discountPercent }}%
             <div class="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black text-white text-[10px] py-2 px-3 w-44 text-center leading-snug z-50 normal-case font-sans tracking-normal font-bold shadow-xl animate-fade-in pointer-events-none">
               Zľava vypočítaná z najnižšej ceny za 30 dní pred zľavou.
               <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
             </div>
          </div>
      </div>
      <p v-if="discountPercent > 0" class="text-[10px] text-gray-400 font-sans mt-1.5 md:hidden">
        * najnižšia cena za posledných 30 dní pred zľavou
      </p>

      <!-- MOC / PMOC — maloobchodná odporúčaná cena výrobcu -->
      <div v-if="mocPrice || pmocPrice" class="flex flex-col gap-0.5 mt-2">
        <div v-if="mocPrice" class="flex items-baseline gap-1">
          <span class="text-xs text-gray-500 font-sans">MOC: {{ adjustPrice(mocPrice) }} €</span>
          <span class="relative group cursor-help inline-flex self-center">
            <span class="inline-flex items-center justify-center w-3.5 h-3.5 text-[8px] font-bold text-gray-400 border border-gray-300 rounded-full leading-none">?</span>
            <span class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black text-white text-[10px] py-2 px-3 w-52 text-center leading-snug z-50 font-sans font-medium shadow-xl pointer-events-none">
              Maloobchodná odporúčaná cena výrobcom, alebo cena, za ktorú sme produkt predávali pri zaradení do ponuky.
              <span class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></span>
            </span>
          </span>
        </div>
        <div v-if="pmocPrice" class="flex items-baseline gap-1">
          <span class="text-xs text-gray-500 font-sans">PMOC: {{ adjustPrice(pmocPrice) }} €</span>
          <span class="relative group cursor-help inline-flex self-center">
            <span class="inline-flex items-center justify-center w-3.5 h-3.5 text-[8px] font-bold text-gray-400 border border-gray-300 rounded-full leading-none">?</span>
            <span class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black text-white text-[10px] py-2 px-3 w-52 text-center leading-snug z-50 font-sans font-medium shadow-xl pointer-events-none">
              Pôvodná maloobchodná odporúčaná cena výrobcom, alebo cena, za ktorú sme produkt predávali pri zaradení do ponuky.
              <span class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></span>
            </span>
          </span>
        </div>
      </div>
    </div>

    <!-- Low-stock urgency trigger — Scarcity (Cialdini) + Fogg Trigger -->
    <!-- Zobrazí sa iba keď je sklad ≤ 5 ks a produkt nie je vypredaný -->
    <div
      v-if="cartProduct.availableStock > 0 && cartProduct.availableStock <= 5"
      class="mb-5 flex items-center gap-2.5 px-3 py-2.5 border border-amber-200 bg-amber-50"
    >
      <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0"></span>
      <span class="text-[11px] font-bold uppercase tracking-widest text-amber-800 font-sans">
        Zostávajú posledné {{ cartProduct.availableStock }} ks!
      </span>
    </div>

    <!-- VariantSelector -->
    <ClientOnly>
      <div id="pdp-variant-selector">
      <VariantSelector
        :product="product"
        :selectedVariantId="selectedVariant?.id"
        @variantSelected="(payload) => emit('variantSelected', payload)"
        class="mb-2"
      />
      </div>
    </ClientOnly>

    <!-- Legacy size selector fallback -->
    <div v-if="!product.configuratorSettings?.length && product.variants && product.variants.length > 0" role="radiogroup" :aria-label="sizeLabel" class="mb-6">
        <div class="flex justify-between items-end mb-3">
          <span class="block text-xs font-bold uppercase tracking-widest text-[#111] font-sans" id="size-label">Dostupné {{ sizeLabel.toLowerCase() }}</span>
          <button 
            @click="emit('openSizeChart')"
            class="text-xs font-bold text-gray-500 hover:text-black underline decoration-gray-300 underline-offset-4 transition-colors flex items-center"
          >
            <Ruler class="w-3 h-3 mr-1" /> Tabuľka veľkostí
          </button>
        </div>
        <div class="flex flex-wrap gap-2 items-center">
          <button
            v-for="variant in product.variants"
            :key="variant.size"
            role="radio"
            :aria-checked="selectedSize === variant.size"
            :disabled="variant.stockStatus === 'unavailable'"
            @click="emit('update:selectedSize', variant.size)"
            class="min-w-[3.5rem] w-auto px-4 h-12 flex items-center justify-center font-bold text-sm transition-all border font-sans focus:outline-none focus:ring-1 focus:ring-black rounded-sm"
            :class="[
                variant.stockStatus === 'unavailable' 
                    ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed' 
                    : selectedSize === variant.size
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-gray-300 hover:border-black'
            ]"
          >
            {{ variant.size }}
          </button>
        </div>
    </div>

    <!-- Add to Cart & Actions -->
    <div class="space-y-6 mb-10">
      <div class="flex flex-col pt-2">
        <div id="buy-btn-sentinel" class="flex gap-2 h-14 w-full mb-3">
          <QuantitySelector 
            :model-value="quantity"
            @update:model-value="updateQuantity"
          />
          <div class="flex-1">
            <AddToCartButton :product="cartProduct" :quantity="quantity" :selectedSize="selectedSize" :isCloseout="isActiveVariantCloseout" class="h-full w-full" :showText="true" />
          </div>
        </div>

        <!-- Trust Badges (Accordion style) -->
        <TrustBadges :product="product" @openWatchdog="emit('openWatchdog', product)" />

        <div class="flex items-center justify-between mt-3 w-full">
            <button @click="handleWishlistClick" class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand transition-colors group py-2">
              <Heart class="w-4 h-4 transition-colors" :class="isInWishlist(selectedVariant?.id || product.id) ? 'fill-brand text-brand' : 'text-gray-400 group-hover:text-brand'" /> Obľúbené
            </button>
            <button @click="(e) => emit('addToCompare', e, product)" class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand transition-colors group py-2">
              <Scale class="w-4 h-4 text-gray-400 group-hover:text-brand transition-colors" /> Porovnať
            </button>
            <button @click="emit('openWatchdog', product)" class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand transition-colors group py-2">
              <Eye class="w-4 h-4 text-gray-400 group-hover:text-brand transition-colors" /> Strážiť
            </button>
            <button @click="emit('openPriceOffer', product)" class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand transition-colors group py-2">
              <Zap class="w-4 h-4 text-gray-400 group-hover:text-brand transition-colors" /> Ponuka
            </button>
        </div>
      </div>
    </div>

    <!-- Wishlist Login Modal (Premium Style) -->
    <AppModal :is-open="isWishlistLoginModalOpen" title="Uloženie medzi obľúbené" @close="isWishlistLoginModalOpen = false">
      <div class="px-6 pt-8 pb-4 md:px-12 animate-fade-in font-sans">
          <div class="flex flex-col items-center text-center">
              <div class="w-24 h-24 bg-gray-50 flex items-center justify-center mb-8 border border-gray-100">
                  <Heart class="w-12 h-12 text-brand animate-heartbeat" />
              </div>
              <h4 class="text-xl font-black text-black mb-4 uppercase font-tech tracking-widest">Položka je len kúsok od vás</h4>
              <p class="text-gray-500 mb-8 max-w-sm font-sans text-sm leading-relaxed">
                  Aby ste si mohli produkty uložiť medzi obľúbené a mať k nim prístup zo všetkých zariadení, prosím, prihláste sa do svojho SLICKLY účtu.
              </p>
              <div class="flex flex-col items-center gap-6 w-full">
                  <BaseButton variant="primary" size="lg" class="w-full md:w-auto md:min-w-[280px] uppercase font-bold tracking-widest py-5" @click="openGlobalLoginModal">Prihlásiť sa</BaseButton>
                  
                  <div class="flex flex-col items-center gap-3 mt-4 pt-6 border-t border-gray-100 w-full text-center">
                      <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Ešte nemáte účet?</p>
                      <BaseButton 
                        variant="white" 
                        block 
                        class="border border-gray-200 uppercase font-black tracking-widest"
                        @click="goToRegister"
                      >
                        Zaregistrovať sa
                      </BaseButton>
                  </div>
              </div>
          </div>
      </div>
    </AppModal>

    <!-- Mobile Variant Selection Bottom Sheet -->
    <Teleport to="body">
       <!-- Backdrop -->
       <Transition
          enter-active-class="transition-opacity duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-300"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
       >
          <div v-if="isMobileVariantPanelOpen" class="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm lg:hidden" @click="isMobileVariantPanelOpen = false" />
       </Transition>

       <!-- Bottom Sheet Panel -->
       <Transition
          enter-active-class="transition-transform duration-300 cubic-out"
          enter-from-class="translate-y-full"
          enter-to-class="translate-y-0"
          leave-active-class="transition-transform duration-200 ease-in"
          leave-from-class="translate-y-0"
          leave-to-class="translate-y-full"
       >
          <div 
            v-if="isMobileVariantPanelOpen" 
            class="fixed bottom-0 inset-x-0 bg-white z-[110] rounded-none shadow-2xl lg:hidden flex flex-col pb-safe max-h-[85vh] overflow-hidden"
          >
             <!-- Handle bar -->
             <div class="w-full flex justify-center py-3" @click="isMobileVariantPanelOpen = false">
                <div class="w-12 h-1.5 bg-gray-200 rounded-full"></div>
             </div>

             <!-- Header -->
             <div class="px-5 pb-5 border-b border-gray-100 flex items-start justify-between relative">
                <div class="flex flex-col mt-1">
                   <h3 class="text-[11px] font-bold font-sans uppercase tracking-widest mb-3 text-black">Výber variantu</h3>
                   
                   <div v-if="discountPercent > 0" class="text-sm text-gray-400 line-through font-tech decoration-1 mb-0.5">
                       {{ listPrice }} €
                   </div>
                   
                   <div class="flex flex-row items-center gap-3">
                       <span class="text-2xl font-black text-black font-tech leading-none">
                         {{ currentPrice }} €
                       </span>
                       <div v-if="discountPercent > 0" class="px-2 py-0.5 text-[13px] font-black text-black uppercase tracking-wider font-tech bg-amber shadow-sm flex items-center">
                          -{{ discountPercent }}%
                       </div>
                   </div>
                </div>
                
                <button @click="isMobileVariantPanelOpen = false" class="absolute top-0 right-5 p-2 bg-gray-50 rounded-none border border-gray-100 text-black shadow-sm active:bg-gray-100 transition-colors">
                   <X class="w-5 h-5" />
                </button>
             </div>

             <!-- Body scrollable -->
             <div class="overflow-y-auto w-full px-5 py-6 hide-scrollbar relative">
                <!-- VariantSelector uses ProductInfo's emit cascade to ProductDetail -->
                <VariantSelector 
                  :product="product" 
                  :selectedVariantId="selectedVariant?.id"
                  :hideInfo="true"
                  @variantSelected="(payload) => emit('variantSelected', payload)"
                  class="mb-2"
                />
             </div>

             <!-- Footer action -->
             <div class="p-4 pt-3 border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] bg-white mt-auto w-full">
                <div class="flex gap-2 h-14 w-full">
                  <QuantitySelector 
                    :model-value="quantity"
                    @update:model-value="updateQuantity"
                  />
                  <div class="flex-1">
                    <AddToCartButton 
                       :product="cartProduct" 
                       :quantity="quantity" 
                       :selectedSize="selectedSize" 
                       :isCloseout="isActiveVariantCloseout" 
                       class="h-full w-full text-[12px] font-bold shadow-sm rounded-none tracking-widest" 
                       :showText="true" 
                       @success="isMobileVariantPanelOpen = false"
                    />
                  </div>
                </div>
             </div>
          </div>
       </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Hide arrows in number input */
.hide-arrows::-webkit-outer-spin-button,
.hide-arrows::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
.hide-arrows {
  -moz-appearance: textfield;
  appearance: textfield;
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  15% { transform: scale(1.15); }
  30% { transform: scale(1); }
  45% { transform: scale(1.15); }
  70% { transform: scale(1); }
  100% { transform: scale(1); }
}

.animate-heartbeat {
  animation: heartbeat 1.5s ease-in-out infinite;
}
</style>
