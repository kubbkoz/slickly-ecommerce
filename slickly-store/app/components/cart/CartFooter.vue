<script setup lang="ts">
import { Lock, ChevronDown, ChevronUp, Zap } from 'lucide-vue-next';
import { ref, computed, watch } from 'vue';

const props = defineProps<{
    checkoutTotal: number;
    formatPrice: (n: number) => string;
    expressProduct?: any;
    isExpressInCart?: boolean;
    isExpressLoading?: boolean;
}>();

const emit = defineEmits<{
    (e: 'checkout'): void;
    (e: 'view-cart'): void;
    (e: 'coupon', code: string): Promise<void> | void;
    (e: 'order-note', note: string): void;
    (e: 'express', val: boolean): void;
}>();

// Accordion state — internal, no need to lift up
const isPromoOpen = ref(false);
const isOrderNoteOpen = ref(false);
const couponInput = ref('');
const couponError = ref(false);
const couponSuccess = ref(false);
const orderNote = ref('');

const isExpressDelivery = computed({
    get: () => props.isExpressInCart || false,
    set: (val: boolean) => emit('express', val)
});

const effectiveTotal = computed(() => props.checkoutTotal);

const handleApplyCoupon = async () => {
    if (!couponInput.value.trim()) return;
    couponError.value = false;
    try {
        await emit('coupon', couponInput.value.trim());
        couponInput.value = '';
        couponSuccess.value = true;
        setTimeout(() => couponSuccess.value = false, 3000);
    } catch {
        couponError.value = true;
    }
};

watch(orderNote, (val) => emit('order-note', val));
</script>

<template>
    <div class="absolute bottom-0 left-0 right-0 px-5 md:px-8 pt-1.5 pb-4 bg-white border-t border-gray-100 flex flex-col z-10 w-full shadow-[0_-15px_30px_rgba(0,0,0,0.04)]">

        <!-- Express Checkbox -->
        <label class="flex items-center justify-between gap-3 px-0 py-2.5 mb-1 cursor-pointer group hover:bg-gray-50 -mx-1 px-1 transition-colors">
            <div class="flex items-center gap-3">
                <div
                    class="relative flex items-center justify-center w-4 h-4 border border-gray-300 group-hover:border-black transition-colors bg-white flex-shrink-0"
                    :class="{ 'opacity-50 cursor-not-allowed': isExpressLoading }"
                >
                    <input type="checkbox" v-model="isExpressDelivery" class="sr-only" :disabled="isExpressLoading" />
                    <div v-if="isExpressDelivery" class="w-2.5 h-2.5 bg-brand"></div>
                </div>
                <div>
                    <BaseLink
                        v-if="expressProduct"
                        :to="expressProduct"
                        class="text-[11px] font-black uppercase tracking-widest font-tech flex items-center gap-1.5 hover:text-brand transition-colors"
                        @click.prevent
                    >
                        <Zap class="w-3 h-3 text-amber-500 flex-shrink-0" />
                        {{ expressProduct.translated?.name || 'Expresné odoslanie' }}
                    </BaseLink>
                    <div v-else class="text-[11px] font-black uppercase tracking-widest font-tech flex items-center gap-1.5">
                        <Zap class="w-3 h-3 text-amber-500 flex-shrink-0" />
                        Expresné odoslanie
                    </div>
                    <div class="text-[10px] text-gray-400 font-sans">Expedícia ešte dnes do 13:00</div>
                </div>
            </div>
            <span class="font-tech font-black text-sm text-black flex-shrink-0">
                + {{ formatPrice(expressProduct?.calculatedPrice?.unitPrice || 12.90) }}
            </span>
        </label>

        <!-- Checkout Button -->
        <BaseButton
            variant="primary"
            block
            @click="emit('checkout')"
            class="h-14 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all"
        >
            <Lock class="w-3.5 h-3.5 mr-2 flex-shrink-0" />
            <span class="font-tech font-bold text-sm tracking-[0.15em] uppercase">Pokladňa</span>
            <span class="w-1 h-1 rounded-full bg-white mx-3 opacity-50 flex-shrink-0"></span>
            <span class="font-tech font-black text-sm leading-none">{{ formatPrice(effectiveTotal) }}</span>
        </BaseButton>

        <!-- View Cart Button -->
        <BaseButton
            variant="secondary"
            block
            @click="emit('view-cart')"
            class="h-12 mt-2 font-tech text-[11px] text-gray-600 flex items-center justify-center"
        >
            {{ $t('cart.view_cart') }}
        </BaseButton>

        <p class="text-[9px] text-gray-400 text-center tracking-wide mt-2 font-sans">
            Doprava bude vypočítaná v pokladni.
        </p>
    </div>
</template>
