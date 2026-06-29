<script setup lang="ts">
import { SlidersHorizontal, PackageSearch, Tag, Euro, Check, X, ChevronDown, ListFilter, ArrowUpDown, LayoutList, LayoutGrid } from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { useCategoryFilters } from '../../composables/useCategoryFilters';
import { onClickOutside } from '@vueuse/core';

// Accept aggregations to dynamically map property text -> UUID without hardcoding UUIDs
interface Props {
    aggregations?: any;
    total?: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    (e: 'toggleFilter'): void;
}>();

const { 
    inStockOnly, 
    isPromotion, 
    priceRange,
    riderHeight,
    selectedGeneralProperties, 
    activeFilterCount, 
    sortBy,
    handlePropertyToggle
} = useCategoryFilters();

// --- Rider Height Dropdown Logic ---
const isHeightOpen = ref(false);
const heightModalRef = ref<HTMLElement | null>(null);
const heightButtonRef = ref<HTMLElement | null>(null);

onClickOutside(heightModalRef, () => {
    isHeightOpen.value = false;
}, { ignore: [heightButtonRef] });

// --- Sorting Logic ---
const sortOptions = [
    { value: 'topseller', label: 'Od najobľúbenejších' },
    { value: 'price-desc', label: 'Od najdrahších' },
    { value: 'price-asc', label: 'Od najlacnejších' },
    { value: 'created-at-desc', label: 'Od najnovších' },
    { value: 'rating-desc', label: 'Najlepšie hodnotené' },
    { value: 'discount-desc', label: 'Zľava voči MOC' },
    { value: 'name-asc', label: 'Názov od A-Z' },
];

const isSortOpen = ref(false);
const sortDropdownRef = ref(null);
onClickOutside(sortDropdownRef, () => isSortOpen.value = false);

const activeSortLabel = computed(() => sortOptions.find(o => o.value === sortBy.value)?.label || 'Zoradiť');

const handleSortSelect = (val: string) => {
    sortBy.value = val;
    isSortOpen.value = false;
};

// Helper to find UUID by name in aggregations
const getPropertyUuid = (nameToFind: string) => {
    if (!props.aggregations?.properties?.entities) return null;
    const entities = props.aggregations.properties.entities;
    const elements = Array.isArray(entities) ? entities : Object.values(entities);
    
    for (const group of elements as any[]) {
        if (group.options) {
            const opts = Array.isArray(group.options) ? group.options : Object.values(group.options);
            for (const opt of opts as any[]) {
                if (opt.name?.toLowerCase().includes(nameToFind.toLowerCase())) {
                    return opt.id;
                }
            }
        }
    }
    return null;
};

// Grid toggle shared state (read + toggle; FrontendNavigationPage owns localStorage persistence)
const mobileColumns = useState<1|2>('categoryMobileColumns', () => 2);

const isUnderTo = (max: number) => priceRange.value[1] === max && priceRange.value[0] === 0;

const handleChipClick = (toggleFn: () => void, event: Event) => {
    toggleFn();
    const target = event.currentTarget as HTMLElement;
    if (target) {
        requestAnimationFrame(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
    }
};

const toggleStock = (e: Event) => handleChipClick(() => { inStockOnly.value = !inStockOnly.value; }, e);
const togglePromo = (e: Event) => handleChipClick(() => { isPromotion.value = !isPromotion.value; }, e);
const togglePrice = (max: number, e: Event) => handleChipClick(() => {
    if (isUnderTo(max)) {
        priceRange.value = [0, 10000];
    } else {
        priceRange.value = [0, max];
    }
}, e);
</script>

<template>
    <div class="sticky top-[var(--navbar-height-scrolled,72px)] z-40 w-full bg-white/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-gray-100/30 mt-0 select-none gpu-boost">
        <div class="container mx-auto px-4 relative">
            <div class="flex items-center justify-between h-14">
                
                <!-- LEFT: Filter (Ghost style) -->
                <button
                    @click="emit('toggleFilter')"
                    class="flex items-center gap-2.5 md:gap-3 hover:text-brand transition-colors flex-shrink-0 group bg-transparent border-none p-0 outline-none shadow-none gpu-boost"
                    aria-label="Otvoriť filtre"
                >
                    <div class="relative w-8 h-8 flex items-center justify-center text-gray-900 group-hover:text-brand transition-all duration-300 gpu-boost">
                        <SlidersHorizontal class="w-5 h-5 flex-shrink-0" :stroke-width="1.5" aria-hidden="true" />
                        <!-- Numbered Badge -->
                        <span
                            v-if="activeFilterCount > 0"
                            class="absolute -top-1 -right-1 min-w-[16px] h-4 bg-brand border border-white rounded-full flex items-center justify-center text-white text-[9px] font-bold leading-none px-0.5 transition-transform"
                        >{{ activeFilterCount }}</span>
                    </div>
                    <span class="hidden md:inline font-bold text-[11px] md:text-xs uppercase tracking-[0.05em] font-montserrat text-gray-900 group-hover:text-brand transition-colors">Filtre</span>
                </button>

                <!-- Vertical Divider -->
                <div class="h-5 w-[1px] bg-gray-200/60 mx-2 md:mx-4 flex-shrink-0"></div>

                <!-- CENTER: Smart Chips Scroll (One-side mask) -->
                <div class="flex-1 overflow-x-auto no-scrollbar chip-mask flex items-center gap-2 md:gap-2.5 py-1 min-w-0 pr-12">
                    <button @click="toggleStock" class="chip-btn" :class="inStockOnly ? 'chip-active' : 'chip-inactive'" :aria-pressed="inStockOnly">
                        <Check v-if="inStockOnly" class="w-3.5 h-3.5" :stroke-width="1.8" aria-hidden="true" />
                        <PackageSearch v-else class="w-3.5 h-3.5 text-gray-400" :stroke-width="1.5" aria-hidden="true" />
                        <span>Skladom</span>
                    </button>

                    <button @click="togglePromo" class="chip-btn" :class="isPromotion ? 'chip-active' : 'chip-inactive'" :aria-pressed="isPromotion">
                        <Check v-if="isPromotion" class="w-3.5 h-3.5" :stroke-width="1.8" aria-hidden="true" />
                        <Tag v-else class="w-3.5 h-3.5 text-gray-400" :stroke-width="1.8" aria-hidden="true" />
                        <span>Výpredaj</span>
                    </button>

                    <button @click="togglePrice(300, $event)" class="chip-btn" :class="isUnderTo(300) ? 'chip-active' : 'chip-inactive'" :aria-pressed="isUnderTo(300)">
                        <Check v-if="isUnderTo(300)" class="w-3.5 h-3.5" :stroke-width="1.8" aria-hidden="true" />
                        <Euro v-else class="w-3.5 h-3.5 text-gray-400" :stroke-width="1.8" aria-hidden="true" />
                        <span class="whitespace-nowrap">Do 300€</span>
                    </button>

                    <button @click="togglePrice(500, $event)" class="chip-btn" :class="isUnderTo(500) ? 'chip-active' : 'chip-inactive'" :aria-pressed="isUnderTo(500)">
                        <Check v-if="isUnderTo(500)" class="w-3.5 h-3.5" :stroke-width="1.8" aria-hidden="true" />
                        <Euro v-else class="w-3.5 h-3.5 text-gray-400" :stroke-width="1.8" aria-hidden="true" />
                        <span class="whitespace-nowrap">Do 500€</span>
                    </button>

                    <button @click="togglePrice(1000, $event)" class="chip-btn" :class="isUnderTo(1000) ? 'chip-active' : 'chip-inactive'" :aria-pressed="isUnderTo(1000)">
                        <Check v-if="isUnderTo(1000)" class="w-3.5 h-3.5" :stroke-width="1.8" aria-hidden="true" />
                        <Euro v-else class="w-3.5 h-3.5 text-gray-400" :stroke-width="1.8" aria-hidden="true" />
                        <span class="whitespace-nowrap">Do 1000€</span>
                    </button>

                    <!-- Rider Height (End) -->
                    <button ref="heightButtonRef" @click="isHeightOpen = !isHeightOpen" class="chip-btn" :class="riderHeight ? 'chip-active-red' : 'chip-inactive'" :aria-expanded="isHeightOpen">
                        <Check v-if="riderHeight" class="w-3.5 h-3.5" :stroke-width="1.8" aria-hidden="true" />
                        <ArrowUpDown v-else class="w-3.5 h-3.5 text-brand" :stroke-width="2" aria-hidden="true" />
                        <span class="whitespace-nowrap">{{ riderHeight ? `Výška: ${riderHeight}cm` : 'Výška jazdca' }}</span>
                    </button>
                </div>

                <!-- Mobile: Grid column toggle -->
                <button
                    class="md:hidden flex-shrink-0 ml-1 w-9 h-9 flex items-center justify-center text-gray-600 hover:text-brand transition-colors"
                    @click="mobileColumns = mobileColumns === 1 ? 2 : 1"
                    :aria-label="mobileColumns === 1 ? 'Zobraziť 2 stĺpce' : 'Zobraziť 1 stĺpec'"
                >
                    <LayoutGrid v-if="mobileColumns === 1" class="w-[18px] h-[18px]" :stroke-width="1.8" />
                    <LayoutList v-else class="w-[18px] h-[18px]" :stroke-width="1.8" />
                </button>

                <!-- RIGHT: Sort (Modern Style) -->
                <div class="relative flex-shrink-0 ml-1 md:ml-2" ref="sortDropdownRef">
                    <button 
                        @click="isSortOpen = !isSortOpen"
                        class="flex items-center gap-2 md:gap-3 px-1 py-2 text-[10px] md:text-[11px] text-gray-900 bg-transparent hover:text-brand transition-all flex-shrink-0 group gpu-boost"
                        aria-label="Zoradiť produkty"
                    >
                        <div class="flex flex-col gap-[3px] items-start group-hover:text-brand transition-colors" aria-hidden="true">
                            <div class="h-[2px] w-5 bg-current rounded-md transition-all duration-300"></div>
                            <div class="h-[2px] w-3.5 bg-current rounded-md transition-all duration-300"></div>
                            <div class="h-[2px] w-2 bg-current rounded-md transition-all duration-300"></div>
                        </div>
                        <span class="hidden lg:inline font-bold font-montserrat tracking-tight uppercase">{{ activeSortLabel }}</span>
                        <ChevronDown class="w-3.5 h-3.5 text-gray-400 transition-transform duration-500 group-hover:text-brand" :class="{ 'rotate-180': isSortOpen }" :stroke-width="2.5" aria-hidden="true" />
                    </button>

                    <!-- Dropdown Menu (Clean SaaS style) -->
                    <transition
                        enter-active-class="transition duration-150 ease-out"
                        enter-from-class="transform opacity-0 -translate-y-2 scale-95"
                        enter-to-class="transform opacity-100 translate-y-0 scale-100"
                        leave-active-class="transition duration-100 ease-in"
                        leave-from-class="transform opacity-100 translate-y-0 scale-100"
                        leave-to-class="transform opacity-0 -translate-y-2 scale-95"
                    >
                        <div v-if="isSortOpen" class="absolute right-0 mt-3 w-60 bg-white shadow-[0_40px_80px_rgba(0,0,0,0.15)] z-50 overflow-hidden rounded-none border border-gray-100">
                            <button 
                                v-for="option in sortOptions" 
                                :key="option.value"
                                @click="handleSortSelect(option.value)"
                                class="w-full text-left px-5 py-3.5 text-[11px] md:text-xs transition-all duration-200 tracking-tight border-b border-gray-100 last:border-0 font-montserrat"
                                :class="sortBy === option.value ? 'bg-black text-white font-bold' : 'bg-white text-gray-600 font-medium hover:bg-[#f7f9fa] hover:text-gray-900'"
                            >
                                {{ option.label }}
                            </button>
                        </div>
                    </transition>
                </div>

            </div>
        </div>

        <!-- Rider Height Centered Modal -->
        <Teleport to="body">
            <Transition
                enter-active-class="transition duration-0"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div v-if="isHeightOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <!-- Backdrop overlay -->
                    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="isHeightOpen = false"></div>
                    
                    <!-- Modal Panel -->
                    <div 
                        ref="heightModalRef"
                        class="relative w-full max-w-sm bg-white shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-gray-100 p-8 rounded-none overflow-hidden transform transition-all gpu-boost"
                    >
                        <h4 class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 font-montserrat mb-6 text-center">Vaša výška (cm)</h4>
                        <div class="relative mb-6">
                            <input 
                                type="number" 
                                min="100" max="220"
                                placeholder="Napr. 180" 
                                v-model="riderHeight"
                                class="w-full p-5 bg-gray-50 border-none text-base font-bold text-gray-900 rounded-none focus:ring-1 focus:ring-brand/20 text-center transition-all font-montserrat"
                            />
                        </div>
                        <div class="flex gap-2">
                             <button @click="riderHeight = null; isHeightOpen = false" class="flex-1 py-4 bg-gray-100 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:bg-gray-200 transition-colors font-montserrat border-none">Zmazať</button>
                             <button @click="isHeightOpen = false" class="flex-1 py-4 bg-brand text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-brand-dark transition-colors font-montserrat border-none">Potvrdiť</button>
                        </div>
                        <p class="text-[9px] text-gray-400 mt-6 text-center font-montserrat uppercase tracking-wider">Autom. zúženie bicyklov na vašu postavu.</p>
                    </div>
                </div>
            </Transition>
        </Teleport>

    </div>
</template>

<style scoped>
.chip-btn {
    @apply flex-shrink-0 px-3 py-1.5 flex items-center gap-2 text-[10px] md:text-[11px] font-bold transition-all duration-300 rounded-none border border-transparent uppercase tracking-wider gpu-boost;
    font-family: 'Hanken Grotesk', sans-serif;
}

.chip-inactive {
    @apply bg-transparent text-gray-500 hover:text-black hover:bg-gray-50;
}

.chip-active {
    @apply bg-gray-900 text-white shadow-lg shadow-black/10;
}

.chip-active-red {
    @apply bg-brand text-white shadow-lg shadow-brand/20;
}

/* Icons styling consistency */
.chip-active span {
    @apply opacity-100;
}

/* Mobile horizontal scroll fading mask (One-side: Right only) */
.chip-mask {
    -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);
    mask-image: linear-gradient(to right, black 85%, transparent 100%);
}

/* Scrollbar control */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

</style>
