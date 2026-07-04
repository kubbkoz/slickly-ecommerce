<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Package, Gift, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useProductHelpers } from '~/composables/useProductHelpers';

const props = defineProps<{
    user: any;
    orders: any[];
    recentlyViewed: { id: string; name: string; image: string }[];
    loyaltyPoints: number;
    totalSpent: number;
}>();

const emit = defineEmits<{ (e: 'changeTab', tab: string): void }>();

const { navigateToProduct } = useProductHelpers();
const formatNumber = (n: number) => new Intl.NumberFormat('sk-SK').format(n);

function orderStatusLabel(state: string) {
    const map: Record<string, string> = {
        open: 'Otvorená',
        in_progress: 'Spracováva sa',
        completed: 'Doručená',
        cancelled: 'Zrušená',
    };
    return map[state] || state;
}

// ── Carousel ──────────────────────────────────────────────────────────────────
const COLS = 4;
const GAP  = 16;

const carouselContainer = ref<HTMLElement | null>(null);
const containerWidth    = ref(0);
const carouselIndex     = ref(0);

const items    = computed(() => props.recentlyViewed.slice(0, 8));
const maxIndex = computed(() => Math.max(0, items.value.length - COLS));

const formatName = (name: string) => {
    if (!name) return '';
    return name.replace(/\s*\(.*?\)\s*/g, '').replace(/\s*-\s*veľkosť.*$/i, '').trim();
};

const carouselOffset = computed(() => {
    if (carouselIndex.value === 0 || containerWidth.value <= 0) return 'translateX(0px)';
    const iw = (containerWidth.value - (COLS - 1) * GAP) / COLS;
    return `translateX(-${carouselIndex.value * (iw + GAP)}px)`;
});

let ro: ResizeObserver | null = null;

onMounted(() => {
    if (!carouselContainer.value) return;
    containerWidth.value = carouselContainer.value.offsetWidth;
    ro = new ResizeObserver(([entry]) => {
        containerWidth.value = entry.contentRect.width;
        carouselIndex.value = Math.min(carouselIndex.value, maxIndex.value);
    });
    ro.observe(carouselContainer.value);
});

onUnmounted(() => ro?.disconnect());

function prevSlide() { carouselIndex.value = Math.max(0, carouselIndex.value - 1); }
function nextSlide() { carouselIndex.value = Math.min(maxIndex.value, carouselIndex.value + 1); }
</script>

<template>
    <div class="space-y-8 animate-fade-in">

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white border border-gray-100 p-7 relative overflow-hidden group hover:border-black transition-colors">
                <div class="absolute right-0 top-0 opacity-[0.03] transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    <Package class="w-32 h-32" />
                </div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 relative z-10">Aktívne objednávky</p>
                <div class="w-12 h-1 bg-brand skew-x-[-20deg] mb-4 relative z-10"></div>
                <div class="text-4xl md:text-5xl font-black font-tech text-black relative z-10">{{ orders?.filter(o => o.stateMachineState?.technicalName !== 'cancelled' && o.stateMachineState?.technicalName !== 'completed').length || 0 }}</div>
            </div>
            
            <div class="bg-white border border-gray-100 p-7 relative overflow-hidden group hover:border-black transition-colors">
                <div class="absolute right-0 top-0 opacity-[0.03] transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    <Gift class="w-32 h-32" />
                </div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 relative z-10">Vernostné body</p>
                <div class="w-12 h-1 bg-brand skew-x-[-20deg] mb-4 relative z-10"></div>
                <div class="text-4xl md:text-5xl font-black font-tech text-black relative z-10">{{ formatNumber(loyaltyPoints) }} <span class="text-xl">b</span></div>
            </div>

            <div class="bg-white border border-gray-100 p-7 relative overflow-hidden group hover:border-black transition-colors">
                <div class="absolute right-0 top-0 opacity-[0.03] transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    <span class="font-tech text-[120px] leading-none">€</span>
                </div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 relative z-10">Celkovo minuté</p>
                <div class="w-12 h-1 bg-brand skew-x-[-20deg] mb-4 relative z-10"></div>
                <div class="text-4xl md:text-5xl font-black font-tech text-black relative z-10">{{ formatNumber(Math.round(totalSpent)) }} <span class="text-xl">€</span></div>
            </div>
        </div>

        <!-- Recent orders -->
        <div class="bg-white shadow-sm p-8">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-black uppercase tracking-wide font-tech">Posledné objednávky</h2>
                <button @click="emit('changeTab', 'objednavky')" class="text-[10px] font-bold uppercase tracking-widest text-brand hover:underline">
                    Zobraziť všetky
                </button>
            </div>
            <div v-if="orders && orders.length > 0" class="space-y-4">
                <div v-for="order in orders.slice(0, 3)" :key="order.id" class="flex items-center justify-between p-5 border border-gray-100 hover:border-gray-200 transition-colors bg-gray-50/50">
                    <div class="flex items-center gap-5">
                        <div class="w-10 h-10 bg-white flex items-center justify-center border border-gray-100 text-gray-400 shrink-0">
                            <Package class="w-5 h-5" />
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black font-tech mb-1">#{{ order.orderNumber }}</span>
                            <span class="text-xs text-gray-400 font-medium">{{ new Date(order.orderDateTime).toLocaleDateString('sk-SK') }}</span>
                        </div>
                    </div>
                    <div class="text-right flex flex-col items-end gap-2">
                        <span class="font-black font-tech text-base text-black">{{ order.amountTotal?.toFixed(0) || 0 }} €</span>
                        <span class="text-[9px] font-bold uppercase tracking-widest" :class="order.stateMachineState?.technicalName === 'completed' ? 'text-green-500' : 'text-blue-500'">
                            {{ orderStatusLabel(order.stateMachineState?.technicalName || '') }}
                        </span>
                    </div>
                </div>
            </div>
            <div v-else class="py-10 text-center text-sm text-gray-400 bg-gray-50 border border-gray-100">
                Zatiaľ nemáte žiadne objednávky.
            </div>
        </div>

        <!-- Naposledy prezerané carousel -->
        <div class="bg-white shadow-sm p-8">
            <div class="flex items-center justify-between mb-8">
                <h2 class="text-xl font-black uppercase tracking-wide font-tech">Naposledy prezerané</h2>
                <div v-if="items.length > COLS" class="flex items-center gap-1">
                    <button
                        @click="prevSlide"
                        :disabled="carouselIndex === 0"
                        class="w-8 h-8 flex items-center justify-center border border-gray-200 hover:border-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Predošlé"
                    >
                        <ChevronLeft class="w-4 h-4" />
                    </button>
                    <button
                        @click="nextSlide"
                        :disabled="carouselIndex >= maxIndex"
                        class="w-8 h-8 flex items-center justify-center border border-gray-200 hover:border-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Ďalšie"
                    >
                        <ChevronRight class="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div v-if="items.length > 0" class="overflow-hidden" ref="carouselContainer">
                <div
                    class="flex transition-transform duration-300 ease-out"
                    :style="{ gap: `${GAP}px`, transform: carouselOffset }"
                >
                    <div
                        v-for="item in items"
                        :key="item.id"
                        :style="{ width: 'calc(25% - 12px)', flexShrink: '0' }"
                    >
                        <div class="group bg-white cursor-pointer relative transition-[box-shadow] duration-200 z-10 hover:z-20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] h-full" @click="navigateToProduct(item)">
                            <div class="bg-white border transition-colors duration-200 ease-in-out border-gray-100 group-hover:border-black h-full flex flex-col">
                                <!-- Image -->
                                <div class="aspect-square bg-gray-50 overflow-hidden relative flex items-center justify-center">
                                    <NuxtImg
                                        v-if="item.image && !item.image.startsWith('data:')"
                                        :src="item.image"
                                        :alt="item.name"
                                        class="w-full h-full object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-105 absolute inset-0"
                                        loading="lazy"
                                    />
                                    <Package v-else class="w-12 h-12 text-gray-300 transition-transform duration-500 group-hover:scale-105" />
                                </div>
                                <!-- Info -->
                                <div class="p-3 md:p-4 pb-4 flex-1">
                                    <h3 class="font-sans text-[13px] md:text-sm font-medium mb-2 line-clamp-2 leading-tight transition-colors duration-200 h-[2.5em] group-hover:text-brand text-gray-900">
                                        {{ formatName(item.name) }}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="py-10 text-center text-sm text-gray-400 bg-gray-50 border border-gray-100">
                Zatiaľ ste si neprezerali žiadne produkty.
            </div>
        </div>

    </div>
</template>
