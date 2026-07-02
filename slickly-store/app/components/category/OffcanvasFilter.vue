<script setup lang="ts">
import { X, Loader2, RotateCcw, SlidersHorizontal } from 'lucide-vue-next';
import ProductFilters from './ProductFilters.vue';
import { watch, ref, computed, onMounted, onUnmounted } from 'vue';
import { useDebounceFn, useWindowSize } from '@vueuse/core';
import { useCategoryFilters } from '../../composables/useCategoryFilters';
import { useCategoryListing } from '../../composables/useCategoryListing';

interface Props {
    isOpen: boolean;
    navigationId?: string; 
    categoryName?: string; // New: for context-aware CTA
    aggregations?: any;
    brands: { id: string, name: string }[];
    sizes: string[];
    genders: string[];
    colors: string[];
    wheelSizes: string[];
    wheelsNorm?: { id: string, name: string }[];
    forkNorm?: { id: string, name: string }[];
    brakesNorm?: { id: string, name: string }[];
    gearsNorm?: { id: string, name: string }[];
    motorNorm?: { id: string, name: string }[];
    batteryNorm?: { id: string, name: string }[];
    colorsNorm?: { id: string, name: string, color?: string | null }[];
    minPrice: number;
    maxPrice: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    (e: 'close'): void;
}>();

const {
    selectedBrands,
    selectedSizes,
    selectedGenders,
    selectedColors,
    selectedWheelSizes,
    priceRange,
    inStockOnly,
    onDemandOnly,
    isFeatured,
    isPromotion,
    searchQuery,
    clearAllFilters,
    handleBrandToggle,
    handleSizeToggle,
    handleGenderToggle,
    handleColorToggle,
    handleWheelSizeToggle,
    riderHeight,
    selectedWheelsNorm,
    selectedForkNorm,
    selectedBrakesNorm,
    selectedGearsNorm,
    selectedMotorNorm,
    selectedBatteryNorm,
    toggleWheelsNorm,
    toggleForkNorm,
    toggleBrakesNorm,
    toggleGearsNorm,
    toggleMotorNorm,
    toggleBatteryNorm,
    toggleColorNorm,
    activeFilterCount
} = useCategoryFilters();

// --- Dynamic Count Logic ---
const { total, listingStatus } = useCategoryListing(props.navigationId || '', {
    sortBy: ref('name-asc'),
    selectedBrands,
    selectedProperties: computed(() => [
        ...selectedSizes.value,
        ...selectedGenders.value,
        ...selectedWheelSizes.value
    ]),
    selectedColors,
    priceRange,
    inStockOnly,
    onDemandOnly,
    isFeatured,
    isPromotion,
    searchQuery,
    riderHeight,
    selectedWheelsNorm,
    selectedForkNorm,
    selectedBrakesNorm,
    selectedGearsNorm,
    selectedMotorNorm,
    selectedBatteryNorm,
});

const ctaLabel = computed(() => {
    if (listingStatus.value === 'pending') return 'NAČÍTAVAM...';
    if (total.value === 0) return 'ŽIADNE VÝSLEDKY';
    
    // Slovak pluralization for "produkt"
    const count = total.value;
    let label = 'PRODUKTOV'; // Default for 0, 5+
    
    if (count === 1) {
        label = 'PRODUKT';
    } else if (count >= 2 && count <= 4) {
        label = 'PRODUKTY';
    }
    
    return `ZOBRAZIŤ ${count} ${label}`;
});

const isCTAActive = computed(() => total.value > 0);

// --- Search Logic ---
const localSearchValue = ref(searchQuery.value);
watch(() => searchQuery.value, (newVal) => {
    if (localSearchValue.value !== newVal) localSearchValue.value = newVal;
});

const emitSearch = useDebounceFn((value: string) => {
    searchQuery.value = value;
}, 400);

const handleSearchInput = (e: Event) => {
    const val = (e.target as HTMLInputElement).value;
    localSearchValue.value = val;
    emitSearch(val);
};



// --- Lifecycle & Accessibility ---
const { width: windowWidth } = useWindowSize();
const isMobile = computed(() => windowWidth.value < 768);

const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) emit('close');
};

onMounted(() => window.addEventListener('keydown', handleEsc));
onUnmounted(() => window.removeEventListener('keydown', handleEsc));

watch(() => props.isOpen, (isOpen) => {
    if (isOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});
</script>

<template>
    <Teleport to="body">
        <!-- Backdrop Overlay -->
        <Transition name="fade">
            <div
                v-if="isOpen"
                class="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
                @click="emit('close')"
            ></div>
        </Transition>

        <!-- Aero Drawer Panel -->
        <Transition name="aero-left">
            <aside
                v-if="isOpen"
                class="fixed z-[101] flex flex-col gpu-boost
                       md:top-4 md:bottom-4 md:left-4 md:right-auto md:w-[440px]
                       bottom-0 left-0 right-0 max-h-[88vh] md:max-h-none
                       bg-white border border-gray-100
                       shadow-[0_40px_100px_rgba(0,0,0,0.15)] rounded-none overflow-hidden"
            >
                <!-- Header: Clean Bold Space Grotesk -->
                <div class="flex items-center justify-between px-8 py-6 flex-shrink-0">
                    <div class="flex items-center gap-3">
                        <SlidersHorizontal class="w-4 h-4 text-gray-900" :stroke-width="1.8" />
                        <h2 class="text-sm font-bold tracking-[0.2em] text-gray-900 font-montserrat uppercase">Filtre</h2>
                    </div>
                    <button
                        @click="emit('close')"
                        class="w-10 h-10 flex items-center justify-center bg-gray-900/5 hover:bg-gray-900/10 text-gray-900 transition-all rounded-none"
                        aria-label="Zavrieť filter"
                    >
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <!-- Search Integration -->
                <div class="px-8 pb-4 flex-shrink-0">
                    <div class="relative group">
                        <input
                            :value="localSearchValue"
                            @input="handleSearchInput"
                            type="text"
                            placeholder="Hľadať v kategórii..."
                            class="w-full pl-12 pr-4 py-4 bg-gray-50 border-none focus:ring-0 font-montserrat text-sm rounded-none transition-all"
                        />
                        <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto px-8 pb-32 no-scrollbar custom-content-fade">
                    <ProductFilters
                        :category-name="categoryName"
                        :aggregations="aggregations"
                        :brands="brands"
                        :sizes="sizes"
                        :genders="genders"
                        :colors="colors"
                        :wheel-sizes="wheelSizes"
                        :selected-brands="selectedBrands"
                        @brandToggle="handleBrandToggle"
                        :selected-sizes="selectedSizes"
                        @sizeToggle="handleSizeToggle"
                        :selected-genders="selectedGenders"
                        @genderToggle="handleGenderToggle"
                        :selected-colors="selectedColors"
                        @colorToggle="handleColorToggle"
                        :selected-wheel-sizes="selectedWheelSizes"
                        @wheelSizeToggle="handleWheelSizeToggle"
                        :price-range="priceRange"
                        @update:priceRange="priceRange = $event"
                        :min-price="minPrice"
                        :max-price="maxPrice"
                        :in-stock-only="inStockOnly"
                        @update:inStockOnly="inStockOnly = $event"
                        :on-demand-only="onDemandOnly"
                        @update:onDemandOnly="onDemandOnly = $event"
                        :is-featured="isFeatured"
                        @update:isFeatured="isFeatured = $event"
                        :wheels-norm="wheelsNorm"
                        :fork-norm="forkNorm"
                        :brakes-norm="brakesNorm"
                        :gears-norm="gearsNorm"
                        :motor-norm="motorNorm"
                        :battery-norm="batteryNorm"
                        :colors-norm="colorsNorm"
                        :rider-height="riderHeight"
                        @update:riderHeight="riderHeight = $event"
                        :selected-wheels-norm="selectedWheelsNorm"
                        :selected-fork-norm="selectedForkNorm"
                        :selected-brakes-norm="selectedBrakesNorm"
                        :selected-gears-norm="selectedGearsNorm"
                        :selected-motor-norm="selectedMotorNorm"
                        :selected-battery-norm="selectedBatteryNorm"
                        @toggleWheelsNorm="toggleWheelsNorm"
                        @toggleForkNorm="toggleForkNorm"
                        @toggleBrakesNorm="toggleBrakesNorm"
                        @toggleGearsNorm="toggleGearsNorm"
                        @toggleMotorNorm="toggleMotorNorm"
                        @toggleBatteryNorm="toggleBatteryNorm"
                        @toggleColorNorm="toggleColorNorm"
                    />
                </div>

                <!-- Action Footer: Aero Style -->
                <div class="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex flex-col gap-3 rounded-none shadow-[0_-10px_30px_rgba(0,0,0,0.03)] focus-within:z-50">
                    <div class="flex gap-4">
                        <!-- Reset Button: Small Square with Wheel Icon -->
                        <button
                            v-if="activeFilterCount > 0"
                            @click="clearAllFilters"
                            class="w-14 h-14 bg-white border border-gray-200 text-gray-900 transition-all duration-300 rounded-none group flex items-center justify-center active:scale-95 shadow-sm hover:border-gray-900 gpu-boost"
                            title="Resetovať filtre"
                            aria-label="Resetovať všetky filtre"
                        >
                             <RotateCcw class="w-5 h-5 group-hover:rotate-[-180deg] transition-transform duration-500" aria-hidden="true" />
                        </button>
                        
                        <!-- Main CTA -->
                        <button
                            @click="total > 0 ? emit('close') : clearAllFilters()"
                            class="flex-1 h-14 transition-all duration-300 font-sans uppercase text-[10px] md:text-sm font-bold tracking-[0.2em] rounded-none flex items-center justify-center gap-3 relative overflow-hidden active:scale-[0.98] gpu-boost"
                            :class="isCTAActive ? 'bg-brand hover:bg-brand-dark text-white shadow-xl' : 'bg-gray-100 text-gray-400'"
                        >
                            <Loader2 v-if="listingStatus === 'pending'" class="w-4 h-4 animate-spin text-white" aria-hidden="true" />
                            <span v-else>{{ ctaLabel }}</span>
                        </button>
                    </div>
                </div>
            </aside>
        </Transition>
    </Teleport>
</template>

<style scoped>
/* Aero Transition from Left (Filter) */
.aero-left-enter-active, .aero-left-leave-active {
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}

@media (min-width: 768px) {
    .aero-left-enter-from, .aero-left-leave-to {
        transform: translateX(-110%);
        opacity: 0;
    }
}

@media (max-width: 767px) {
    .aero-left-enter-from, .aero-left-leave-to {
        transform: translateY(100%);
        opacity: 0;
    }
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


