<script setup lang="ts">
import { Truck } from 'lucide-vue-next';

// amountToFreeShipping:
//   null  → data loading, nothing shown (prevents false "ZADARMO")
//   0     → threshold reached, shipping is free
//   > 0   → amount still needed for free shipping
withDefaults(defineProps<{
    amountToFreeShipping: number | null;
    freeShippingPercent: number;
    freeThreshold: number | null;
    formatPrice: (n: number) => string;
    variant?: 'sidebar' | 'page';
}>(), {
    variant: 'page',
});
</script>

<template>
    <template v-if="amountToFreeShipping !== null">

        <!-- ── SIDEBAR layout ─────────────────────────────────────── -->
        <div v-if="variant === 'sidebar'" class="px-8 pt-4 pb-3 flex-shrink-0">
            <div class="flex items-center mb-2">
                <span v-if="amountToFreeShipping > 0" class="text-[12px] font-sans text-gray-400">
                    Nakúpte ešte za
                    <span class="text-black font-bold">{{ formatPrice(amountToFreeShipping) }}</span>
                    a dopravu máte <span class="font-bold text-black">ZADARMO</span>
                </span>
                <span v-else class="text-[12px] font-bold text-green-600 font-sans">
                    Gratulujeme! Dopravu máte ZADARMO.
                </span>
            </div>
            <div class="w-full h-1 bg-gray-100 overflow-hidden">
                <div
                    class="h-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    :class="amountToFreeShipping <= 0 ? 'bg-green-600' : 'bg-brand'"
                    :style="{ width: `${freeShippingPercent}%` }"
                ></div>
            </div>
        </div>

        <!-- ── PAGE layout ────────────────────────────────────────── -->
        <template v-else>
            <!-- Remaining: progress bar -->
            <div v-if="amountToFreeShipping > 0" class="bg-white border border-gray-100 p-5 mb-4">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                        <Truck class="w-3.5 h-3.5" />
                        <template v-if="freeThreshold">Doprava zadarmo od {{ freeThreshold }}€</template>
                    </span>
                    <span class="text-[10px] font-bold text-brand uppercase tracking-widest">
                        Chýba {{ formatPrice(amountToFreeShipping) }}
                    </span>
                </div>
                <div class="h-1 w-full bg-gray-100 overflow-hidden">
                    <div
                        class="h-full bg-brand transition-all duration-700"
                        :style="{ width: `${freeShippingPercent}%` }"
                    ></div>
                </div>
            </div>
            <!-- Free: green banner -->
            <div v-else class="bg-white border border-brand/20 p-4 mb-4 flex items-center gap-3">
                <Truck class="w-4 h-4 text-brand flex-shrink-0" />
                <span class="text-[11px] font-bold uppercase tracking-widest text-brand">Doprava zadarmo!</span>
            </div>
        </template>

    </template>
</template>
