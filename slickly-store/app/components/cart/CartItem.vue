<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next';

interface StockInfo {
    stockStatus: 'in_stock' | 'on_order' | 'unavailable';
    stock: number;
    restockTime: number;
    isCloseout: boolean;
}

const props = defineProps<{
    item: any;
    stockInfo: StockInfo | null;
    getProductImage: (item: any) => string;
    formatPrice: (n: number) => string;
    isUpdating?: boolean;
}>();

const emit = defineEmits<{
    (e: 'remove', item: any): void;
    (e: 'update-qty', item: any, delta: number): void;
    (e: 'click-product', item: any): void;
}>();

const isSplitStock = computed(() => {
    if (!props.stockInfo || props.stockInfo.isCloseout) return false;
    return props.item.quantity > props.stockInfo.stock && props.stockInfo.stock > 0;
});

const stockClass = computed(() => {
    if (isSplitStock.value) return 'text-amber-500';
    switch (props.stockInfo?.stockStatus) {
        case 'in_stock': return 'text-green-600';
        case 'on_order': return 'text-amber-500';
        default: return 'text-brand';
    }
});

const stockDotClass = computed(() => {
    if (isSplitStock.value) return 'bg-amber-500';
    switch (props.stockInfo?.stockStatus) {
        case 'in_stock': return 'bg-green-600';
        case 'on_order': return 'bg-amber-500';
        default: return 'bg-brand';
    }
});
</script>

<template>
    <div class="flex gap-4 md:gap-5 group">
        <!-- Product Image -->
        <div
            class="w-20 h-20 bg-gray-50 border border-gray-100 flex-shrink-0 p-1 cursor-pointer hover:border-gray-300 transition-colors"
            @click="emit('click-product', item)"
        >
            <NuxtImg
                v-if="getProductImage(item) && !getProductImage(item).includes('placehold.co')"
                :src="getProductImage(item)"
                :alt="item.label"
                width="160"
                height="160"
                sizes="80px"
                class="w-full h-full object-contain mix-blend-multiply"
                format="webp"
                loading="lazy"
            />
            <img
                v-else
                :src="getProductImage(item)"
                :alt="item.label"
                width="80"
                height="80"
                loading="lazy"
                class="w-full h-full object-contain mix-blend-multiply opacity-50"
            />
        </div>

        <!-- Item Details -->
        <div class="flex-1 min-w-0 flex flex-col justify-between">
            <div>
                <div class="flex justify-between items-start">
                    <div
                        class="flex-1 pr-4 cursor-pointer group/title"
                        @click="emit('click-product', item)"
                    >
                        <h4 class="font-sans font-bold text-sm text-black leading-snug uppercase group-hover/title:text-brand transition-colors">
                            {{ item.label.replace(/\(VARIANT\)/gi, '').trim() }}
                        </h4>
                        <div v-if="item.payload?.options?.[0]" class="text-[11px] text-gray-400 font-sans mt-0.5">
                            {{ item.payload.options[0].group }}: {{ item.payload.options[0].option }}
                        </div>
                    </div>

                    <button
                        @click="emit('remove', item)"
                        class="w-8 h-8 flex items-center justify-center bg-white border border-gray-50 text-gray-300 hover:text-red-500 hover:border-red-100 transition-all ml-4 flex-shrink-0"
                        aria-label="Odstrániť z košíka"
                    >
                        <Trash2 class="w-4 h-4" />
                    </button>
                </div>

                <!-- SKU + Stock Status -->
                <div class="mt-0.5 space-y-0.5">
                    <div v-if="item.payload?.productNumber" class="text-[11px] font-sans text-gray-400 uppercase tracking-widest leading-none">
                        SKU: <span class="text-gray-500">{{ item.payload.productNumber }}</span>
                    </div>

                    <div v-if="stockInfo">
                        <div v-if="isSplitStock" class="flex items-center gap-3">
                            <div class="text-[11px] font-bold uppercase tracking-widest flex items-center gap-1 text-green-600">
                                <div class="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                                Skladom {{ stockInfo.stock }} ks
                            </div>
                            <div class="text-[11px] font-bold uppercase tracking-widest flex items-center gap-1 text-amber-500">
                                Na obj. {{ item.quantity - stockInfo.stock }} ks
                            </div>
                        </div>
                        <div v-else class="text-[11px] font-bold uppercase tracking-widest flex items-center gap-1" :class="stockClass">
                            <div class="w-1.5 h-1.5 rounded-full" :class="stockDotClass"></div>
                            <template v-if="stockInfo.stockStatus === 'in_stock'">{{ $t('availability_inStock') }}</template>
                            <template v-else-if="stockInfo.stockStatus === 'on_order'">{{ $t('availability_restockTime', { days: stockInfo.restockTime || 4 }) }}</template>
                            <template v-else>{{ $t('availability_soldOut') }}</template>
                        </div>
                    </div>
                    <div v-else class="text-[11px] font-bold uppercase tracking-widest text-gray-300 flex items-center gap-1">
                        <div class="w-1.5 h-1.5 rounded-full bg-gray-200 animate-pulse"></div>
                        Načítavam...
                    </div>
                </div>
            </div>

            <!-- Quantity + Price -->
            <div class="flex justify-between items-center mt-3">
                <div class="relative" :class="{'opacity-50 pointer-events-none': isUpdating}">
                    <QuantitySelector
                        size="sm"
                        :model-value="item.quantity"
                        :min="1"
                        @update:model-value="(newVal) => emit('update-qty', item, newVal - item.quantity)"
                    />
                    <div v-if="isUpdating" class="absolute inset-0 flex items-center justify-center">
                        <div class="w-3 h-3 border-2 border-brand/20 border-t-brand rounded-full animate-spin"></div>
                    </div>
                </div>

                <!-- Cena -->
                <div class="text-right">
                    <div
                        v-if="item.price?.listPrice && item.price.listPrice.price > item.price.totalPrice"
                        class="text-[10px] text-gray-400 line-through font-tech leading-none"
                    >
                        {{ formatPrice(item.price.listPrice.price) }}
                    </div>
                    <div class="font-black font-tech text-sm text-black leading-none">
                        {{ formatPrice(item.price?.totalPrice || 0) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
