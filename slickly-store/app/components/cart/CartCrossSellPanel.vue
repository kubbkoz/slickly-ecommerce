<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next';

defineProps<{
    crossSells: any[];
    isOpen: boolean;
    isLoading?: boolean;
    getProductImageUrl: (p: any) => string;
    getPrice: (p: any) => number;
    formatPrice: (n: number) => string;
}>();

const emit = defineEmits<{
    (e: 'navigate', product: any): void;
}>();
</script>

<template>
    <!-- Desktop Side Panel (left of drawer) -->
    <Transition name="panel-slide">
        <div
            v-if="isOpen && (crossSells.length > 0 || isLoading)"
            class="hidden md:flex flex-col absolute top-0 bottom-0 right-full -mr-[1px] w-[280px] bg-[#f9f9f9] border-y border-l border-gray-200 shadow-[-20px_0_40px_rgba(0,0,0,0.03)] pt-6 pb-6 overflow-hidden text-center"
        >
            <h3 class="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-5 px-5 font-sans">
                Mohlo by vás zaujímať
            </h3>

            <!-- Scrollable Content Container -->
            <div class="flex-1 w-full overflow-y-auto px-5 space-y-5 custom-content-fade custom-scrollbar">
                
                <!-- Loading Skeleton -->
                <template v-if="isLoading">
                    <div v-for="i in 3" :key="i" class="w-full animate-pulse">
                        <div class="w-full aspect-square bg-gray-200 border border-gray-100 mb-2"></div>
                        <div class="h-3 bg-gray-200 rounded-sm w-3/4 mx-auto mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded-sm w-1/2 mx-auto"></div>
                    </div>
                </template>

                <!-- Actual Content -->
                <template v-else>
                    <div
                        v-for="fp in crossSells"
                        :key="fp.id"
                        class="w-full group cursor-pointer"
                        @click="emit('navigate', fp)"
                    >
                        <div class="w-full aspect-square bg-white border border-gray-100 mb-2 overflow-hidden flex items-center justify-center p-4">
                            <NuxtImg
                                :src="getProductImageUrl(fp)"
                                format="webp"
                                loading="lazy"
                                class="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <h4 class="text-[10px] font-bold text-black line-clamp-2 leading-tight font-sans mb-1">
                            {{ fp.translated?.name || fp.name }}
                        </h4>
                        <div class="text-[12px] font-black font-tech text-black">{{ formatPrice(getPrice(fp)) }}</div>
                        <div class="mt-1.5 text-[9px] uppercase font-bold tracking-widest text-gray-400 group-hover:text-black transition-colors flex items-center justify-center gap-1">
                            Zobraziť <ArrowRight class="w-3 h-3" />
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </Transition>

</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}

/* Simplified and unified animation to match the toggle button accurately */
.panel-slide-enter-active,
.panel-slide-leave-active {
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.panel-slide-enter-from,
.panel-slide-leave-to {
    transform: translateX(100%);
}

.panel-slide-enter-to,
.panel-slide-leave-from {
    transform: translateX(0);
}
</style>
