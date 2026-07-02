<script setup lang="ts">
import { useProductHelpers } from '~/composables/useProductHelpers';
import RatingStars from '~/components/ui/RatingStars.vue';
import { formatRating } from '~/utils/format';
import { Heart, Star, ChevronLeft, ChevronRight, ArrowRight, Scale } from 'lucide-vue-next';
import AddToCartButton from '~/components/ui/AddToCartButton.vue';
import BaseStockStatus from '~/components/ui/BaseStockStatus.vue';
import { useCustomerWishlist } from '~/composables/useCustomerWishlist';
import { useProductBadges, badgeSizeClass } from '~/composables/useProductBadges';
import { useProductComparison } from '~/composables/useProductComparison';
import { useUser, useState } from '#imports';

defineOptions({ name: 'ProductCard' });

const props = defineProps<{
    product: any;
}>();

const emit = defineEmits(['addToCompare', 'openWatchdog', 'openPriceOffer']);

const {
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
    FALLBACK_IMAGE,
} = useProductHelpers();

const localePath = useLocalePath();
const productUrl = computed(() => localePath(getProductUrl(props.product)));

const { toggleWishlist, isInWishlist } = useCustomerWishlist();
const { getProductBadges } = useProductBadges();
const { addToComparison, removeFromComparison, isInComparison } = useProductComparison();
const productBadges = computed(() => getProductBadges(props.product, 'card'));
const { isLoggedIn } = useUser();
const isLoginModalOpen = useState('loginModalOpen', () => false);
const toast = useState('wishlistToast', () => ({ show: false, productName: '', action: 'add' as 'add' | 'remove' }));
const comparisonToast = useState('comparisonToast', () => ({ show: false, productName: '', action: 'add' as 'add' | 'remove' }));

// Reaktívna úprava cien podľa vybranej krajiny (zmena krajiny = okamžitý prepočet)
const { adjustPrice } = useCountrySelector();
const displayPrice = computed(() => {
    const p = getPrice(props.product);
    return p != null ? adjustPrice(p) : p;
});
const displayOldPrice = computed(() => {
    const p = getOldPrice(props.product);
    return p != null ? adjustPrice(p) : null;
});

const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
};
const shortDescription = computed(() => {
    if (!props.product.description) return '';
    return stripHtml(props.product.description);
});

// Reactive state
const isHovered = ref(false);
const quantity  = ref(1);

// Carousel State
const currentImageIndex = ref(0);
const scrollContainer = ref<HTMLElement | null>(null);

// Extracts all unique media URLs from the product, prioritizing the cover image
const productMedia = computed(() => {
    const mainImage = getProductImageUrl(props.product);
    if (!props.product?.media || !Array.isArray(props.product.media)) return [mainImage];
    
    // Get gallery images, rewrite URLs for dev, and exclude the main image to prevent duplication
    const gallery = [...props.product.media]
        .sort((a, b) => (a.position || 0) - (b.position || 0))
        .map(m => {
            const url = m.media?.url;
            return url ? (import.meta.dev ? url.replace(/^https:\/\/mtsport\.store/, '/mts-proxy') : url) : null;
        })
        .filter((url): url is string => !!url && url !== mainImage);

    // Cover image always wins the first slot
    return [mainImage, ...gallery];
});

const hasMultipleImages = computed(() => productMedia.value.length > 1);

const scrollToImage = (index: number) => {
    currentImageIndex.value = index;
};

// Touch support for swiping
let touchStartX = 0;
const handleTouchStart = (e: TouchEvent) => {
    touchStartX = e.touches[0].clientX;
};
const handleTouchEnd = (e: TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX - touchEndX;
    if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
            currentImageIndex.value = (currentImageIndex.value + 1) % productMedia.value.length;
        } else {
            currentImageIndex.value = (currentImageIndex.value - 1 + productMedia.value.length) % productMedia.value.length;
        }
    }
};

const nextImage = (e: MouseEvent) => {
    e.stopPropagation();
    const next = (currentImageIndex.value + 1) % productMedia.value.length;
    scrollToImage(next);
};

const prevImage = (e: MouseEvent) => {
    e.stopPropagation();
    const prev = (currentImageIndex.value - 1 + productMedia.value.length) % productMedia.value.length;
    scrollToImage(prev);
};

const hasVariants = computed(() => (props.product.children?.length ?? 0) > 0);

const increment = (e: MouseEvent) => {
    e.stopPropagation();
    quantity.value++;
};
const decrement = (e: MouseEvent) => {
    e.stopPropagation();
    if (quantity.value > 1) quantity.value--;
};

const handleWishlistClick = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn.value) {
        isLoginModalOpen.value = true;
        return;
    }
    const id = props.product.id;
    const wasInWishlist = isInWishlist(id);
    await toggleWishlist(id, props.product);
    toast.value = {
        show: true,
        productName: props.product.translated?.name || props.product.name || '',
        action: wasInWishlist ? 'remove' : 'add'
    };
};

const handleCompareClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const id = props.product.id;
    const name = props.product.translated?.name || props.product.name || '';
    if (isInComparison(id)) {
        removeFromComparison(id);
        comparisonToast.value = { show: true, productName: name, action: 'remove' };
    } else {
        const added = addToComparison({
            id,
            name,
            image: getProductImageUrl(props.product),
            price: getPrice(props.product) || 0,
            oldPrice: getOldPrice(props.product),
            productNumber: props.product.productNumber || '',
            categoryName: props.product.categories?.[0]?.translated?.name || '',
            manufacturer: props.product.manufacturer?.translated?.name || '',
            properties: (props.product.properties || []).map((p: any) => ({
                group: p.group?.translated?.name || p.group?.name || '',
                value: p.translated?.name || p.name || '',
            })),
        });
        if (added) {
            comparisonToast.value = { show: true, productName: name, action: 'add' };
            useState('comparisonNavOpen', () => false).value = true;
        }
    }
};

const handleHoverPrefetch = () => {
    isHovered.value = true;
};
</script>

<template>
    <a
        :href="productUrl"
        class="group bg-white cursor-pointer relative transition-[box-shadow] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] transform-gpu gpu-boost flex flex-col touch-manipulation"
        :class="[
            isHovered ? 'z-20 shadow-[0_20px_50px_rgba(0,0,0,0.08)]' : 'z-10'
        ]"
        :aria-label="`Detail produktu ${product.translated?.name || product.name}`"
        @mouseenter="handleHoverPrefetch"
        @mouseleave="() => { isHovered = false; scrollToImage(0); }"
        @click.prevent="navigateToProduct(product)"
    >
        <!-- Card body: border handling to merge with expansion -->
        <div
            class="bg-white border transition-colors duration-200 ease-in-out flex flex-col flex-1 rounded-default overflow-hidden"
            :class="[
                isHovered ? 'border-black' : 'border-gray-100'
            ]"
        >
            <!-- Image Section: Multi-image Slider (Synchronized Translate) -->
            <div 
                class="relative w-full aspect-[3/4] overflow-hidden group/img"
                @touchstart="handleTouchStart"
                @touchend="handleTouchEnd"
            >
                <div 
                    class="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform bg-gray-50"
                    :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }"
                >
                    <div 
                        v-for="(image, index) in productMedia" 
                        :key="index"
                        class="flex-shrink-0 w-full h-full bg-transparent"
                    >
                        <NuxtImg
                            :alt="`${product.translated?.name || product.name || ''} - foto ${index + 1}`"
                            :src="image"
                            width="400"
                            height="400"
                            sizes="50vw sm:50vw md:33vw lg:25vw"
                            class="w-full h-full object-contain p-4 mix-blend-multiply pointer-events-none"
                            :loading="index < 1 ? 'eager' : 'lazy'"
                            :fetchpriority="index === 0 ? 'high' : 'low'"
                        />
                    </div>
                </div>

                <!-- Desktop Arrows (Minimalist) -->
                <template v-if="hasMultipleImages">
                    <button
                        class="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 bg-transparent border-none p-0
                               hidden md:flex items-center justify-center text-black/40 hover:text-black transition-all 
                               opacity-0 group-hover/img:opacity-100 pointer-events-auto z-10"
                        @click.prevent.stop="prevImage"
                        aria-label="Predošlý obrázok"
                    >
                        <ChevronLeft class="w-6 h-6 stroke-[1.5px]" />
                    </button>
                    <button
                        class="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 bg-transparent border-none p-0
                               hidden md:flex items-center justify-center text-black/40 hover:text-black transition-all 
                               opacity-0 group-hover/img:opacity-100 pointer-events-auto z-10"
                        @click.prevent.stop="nextImage"
                        aria-label="Ďalší obrázok"
                    >
                        <ChevronRight class="w-6 h-6 stroke-[1.5px]" />
                    </button>

                    <!-- Dynamic Progress Bar Indicator (Synchronized) -->
                    <div 
                        v-if="hasMultipleImages"
                        class="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-200/50 transition-opacity duration-300 pointer-events-none"
                        :class="[
                            'md:opacity-0 md:group-hover/img:opacity-100',
                            'opacity-100'
                        ]"
                    >
                        <div 
                            class="h-full bg-brand transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                            :style="{ 
                                width: (100 / productMedia.length) + '%',
                                transform: `translateX(${currentImageIndex * 100}%)`
                            }"
                        ></div>
                    </div>
                </template>

                <!-- Custom badges — top-left of image, side-by-side -->
                <div v-if="productBadges.length" class="absolute top-2 left-2 flex flex-row flex-wrap gap-1 z-10 pointer-events-none max-w-[calc(100%-1rem)]">
                    <span
                        v-for="badge in productBadges"
                        :key="badge.id"
                        :class="['font-bold uppercase tracking-wider leading-none font-tech', badgeSizeClass(badge.size)]"
                        :style="{ backgroundColor: badge.bgColor, color: badge.textColor }"
                    >{{ badge.text }}</span>
                </div>

                <!-- Rating — bottom-left of image -->
                <div
                    v-if="(product.ratingAverage || product.rating) > 0"
                    class="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-sm z-10 pointer-events-none text-xs font-tech text-gray-900"
                >
                    <Star class="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span class="font-bold">{{ formatRating(product.ratingAverage || product.rating) }}</span>
                    <span class="text-[10px] text-gray-600 font-medium" :aria-label="`${product.productReviewsCount || 0} recenzií`">
                        ({{ product.productReviewsCount || product.reviewCount || product.customFields?.mtsport_review_count || 0 }})
                    </span>
                </div>

                <!-- Wishlist -->
                <button
                    @click.stop="handleWishlistClick"
                    class="absolute top-2 right-2 w-9 h-9 flex items-center justify-center bg-white border border-gray-100 transition-colors duration-200 z-10 pointer-events-auto group/wish mt-0 rounded-default"
                    :title="isInWishlist(product.id) ? 'Odstrániť z obľúbených' : 'Pridať do obľúbených'"
                    aria-label="Prepnúť obľúbené"
                >
                    <Heart
                        class="w-4 h-4 transition-colors duration-200"
                        :class="isInWishlist(product.id) ? 'fill-brand text-brand' : 'text-gray-300 group-hover/wish:text-brand'"
                    />
                </button>
                <!-- Porovnať -->
                <button
                    @click.stop="handleCompareClick"
                    class="absolute top-13 right-2 w-9 h-9 flex items-center justify-center bg-white border border-gray-100 transition-colors duration-200 z-10 pointer-events-auto group/comp rounded-default"
                    :title="isInComparison(product.id) ? 'Odobrať z porovnania' : 'Pridať do porovnania'"
                    aria-label="Prepnúť porovnanie"
                >
                    <Scale
                        class="w-4 h-4 transition-colors duration-200"
                        :class="isInComparison(product.id) ? 'text-blue-500' : 'text-gray-300 group-hover/comp:text-blue-500'"
                    />
                </button>
            </div>

            <!-- Info Section -->
            <div class="p-2 md:p-4 flex flex-col flex-1">
                <!-- Varianty (variabilný) — nad názvom produktu -->
                <div v-if="hasVariants" class="flex flex-wrap gap-1.5 mb-2">
                    <div
                        v-for="child in sortVariants(product.children, product)"
                        :key="child.id"
                        class="relative min-w-[38px] h-7 border flex items-center justify-center text-center px-1.5 transition-colors duration-150 font-tech rounded-sm"
                        :title="(() => {
                            const label = getVariantLabel(child, product);
                            return label?.includes('(') ? label.split('(')[1]?.replace(')', '') : '';
                        })()"
                        :class="[
                            child.availableStock > 0
                                ? 'border-green-400 bg-white cursor-pointer hover:bg-success-light'
                                : (child.isCloseout ?? product.isCloseout)
                                    ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                                    : 'border-amber-400 bg-white cursor-pointer hover:bg-amber-50'
                        ]"
                        role="button"
                        :aria-label="`Veľkosť ${getVariantLabel(child, product)?.split('(')?.[0]?.trim()} — ${child.availableStock > 0 ? 'skladom' : (child.isCloseout ?? product.isCloseout) ? 'vypredané' : 'na objednávku'}`"
                        tabindex="0"
                        @click.stop="navigateToProduct(child)"
                        @keydown.enter="navigateToProduct(child)"
                        @keydown.space.prevent="navigateToProduct(child)"
                    >
                        <span class="text-[13px] font-black text-black leading-none">
                            {{ getVariantLabel(child, product)?.split('(')?.[0]?.trim() || '' }}
                        </span>
                        <div v-if="(child.isCloseout ?? product.isCloseout) && !(child.availableStock > 0)" class="absolute inset-0 pointer-events-none overflow-hidden">
                            <svg class="w-full h-full" preserveAspectRatio="none">
                                <line x1="0" y1="100%" x2="100%" y2="0" stroke="#cccccc" stroke-width="1" />
                            </svg>
                        </div>
                    </div>
                </div>

                <h3
                    class="font-sans text-[13px] md:text-sm font-medium mb-1.5 line-clamp-2 leading-tight transition-colors duration-200 h-[2.5em]"
                    :class="isHovered ? 'text-brand' : 'text-gray-900'"
                >
                    {{ getFormattedName(product) }}
                </h3>

                <!-- Úryvok popisu — 2 riadky -->
                <p v-if="shortDescription" class="text-[11px] text-gray-500 font-sans leading-snug line-clamp-2 mb-3">
                    {{ shortDescription }}
                </p>

                <!-- Sklad (jednoduchý produkt) — varianty sú teraz nad názvom -->
                <div v-if="!hasVariants" class="flex flex-wrap gap-1.5 mb-5">
                    <div
                        class="relative min-w-[38px] h-7 border flex items-center justify-center text-center px-2 font-tech rounded-sm"
                        :class="[
                            (product.availableStock || product.stock || 0) > 0
                                ? 'border-green-400 bg-white stock-pulse-green'
                                : (product.isCloseout || product._raw?.isCloseout)
                                    ? 'border-gray-200 bg-gray-50 opacity-60'
                                    : 'border-amber-400 bg-white stock-pulse-amber'
                        ]"
                    >
                        <span class="text-[11px] font-bold text-black leading-none uppercase tracking-tight whitespace-nowrap">
                            <template v-if="(product.availableStock || product.stock || 0) > 0">
                                Skladom
                            </template>
                            <template v-else-if="product.isCloseout || product._raw?.isCloseout">
                                Vypredané
                            </template>
                            <template v-else>
                                U nás do {{ product.restockTime || product._raw?.restockTime || 4 }} dní
                            </template>
                        </span>
                        <div v-if="(product.isCloseout || product._raw?.isCloseout) && !((product.availableStock || product.stock || 0) > 0)" class="absolute inset-0 pointer-events-none overflow-hidden">
                            <svg class="w-full h-full" preserveAspectRatio="none">
                                <line x1="0" y1="100%" x2="100%" y2="0" stroke="#cccccc" stroke-width="1" />
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Spodný riadok: cena vľavo + button vpravo -->
                <div class="mt-auto flex items-end justify-between gap-2">
                    <div class="flex flex-col min-w-0">
                        <span v-if="calculateDiscount(product) > 0"
                            class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-black uppercase tracking-wider bg-amber leading-none w-fit mb-1 rounded-sm">
                            -{{ calculateDiscount(product) }}%
                        </span>
                        <span class="text-lg md:text-xl font-bold font-tech text-black leading-none">
                            <template v-if="hasPriceVariance(product)">Od </template>{{ displayPrice }} €
                        </span>
                        <span v-if="displayOldPrice" class="text-gray-500 line-through text-sm font-tech leading-none mt-0.5">{{ displayOldPrice }} €</span>
                    </div>

                    <!-- Variabilný → Zobraziť produkt; Jednoduchý → Kúpiť -->
                    <!-- Mobile: len ikona; Desktop: plný text -->
                    <button
                        v-if="hasVariants"
                        type="button"
                        class="inline-flex items-center justify-center shrink-0 bg-gray-100 hover:bg-gray-200 text-black transition-colors w-10 h-10 md:w-auto md:h-10 md:gap-1.5 md:px-3 md:font-tech md:font-bold md:uppercase md:tracking-widest md:text-[11px] md:whitespace-nowrap rounded-default"
                        @click.stop="navigateToProduct(product)"
                    >
                        <span class="hidden md:inline">Zobraziť produkt</span>
                        <ArrowRight class="w-4 h-4 md:w-3.5 md:h-3.5" />
                    </button>
                    <AddToCartButton
                        v-else
                        :product="product"
                        :quantity="1"
                        variant="primary"
                        class="!h-10 shrink-0 !w-10 !px-0 !py-0 md:!w-auto md:!px-3 !text-[11px] font-tech whitespace-nowrap [&>span]:hidden [&>span]:md:inline"
                        :show-text="true"
                        :icon-right="true"
                        label="Pridať do košíka"
                    />
                </div>
            </div>
        </div>
    </a>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.stock-pulse-green {
    animation: stock-pulse-green 2.5s ease-in-out infinite;
}
.stock-pulse-amber {
    animation: stock-pulse-amber 2.5s ease-in-out infinite;
}
@keyframes stock-pulse-green {
    0%, 100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
    50% { box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.25); }
}
@keyframes stock-pulse-amber {
    0%, 100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0); }
    50% { box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.25); }
}
</style>
