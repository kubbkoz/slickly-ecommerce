<script setup lang="ts">
import { ChevronDown, Check, Search } from 'lucide-vue-next';
import { ref, computed } from 'vue';

interface Props {
  categoryName?: string;
  aggregations?: any;
  brands: { id: string, name: string }[];
  sizes: string[];
  genders: string[];
  colors: string[];
  wheelSizes: string[];
  selectedBrands: string[];
  selectedSizes: string[];
  selectedGenders: string[];
  selectedColors: string[];
  selectedWheelSizes: string[];
  priceRange: [number, number];
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  onDemandOnly: boolean;
  isFeatured?: boolean;
  wheelsNorm?: { id: string, name: string }[];
  forkNorm?: { id: string, name: string }[];
  brakesNorm?: { id: string, name: string }[];
  gearsNorm?: { id: string, name: string }[];
  motorNorm?: { id: string, name: string }[];
  batteryNorm?: { id: string, name: string }[];
  colorsNorm?: { id: string, name: string, color?: string | null }[];

  selectedWheelsNorm?: string[];
  selectedForkNorm?: string[];
  selectedBrakesNorm?: string[];
  selectedGearsNorm?: string[];
  selectedMotorNorm?: string[];
  selectedBatteryNorm?: string[];
  
  className?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'brandToggle', value: string): void;
  (e: 'sizeToggle', value: string): void;
  (e: 'genderToggle', value: string): void;
  (e: 'colorToggle', value: string): void;
  (e: 'wheelSizeToggle', value: string): void;
  (e: 'update:priceRange', value: [number, number]): void;
  (e: 'update:inStockOnly', value: boolean): void;
  (e: 'update:onDemandOnly', value: boolean): void;
  (e: 'update:isFeatured', value: boolean): void;
  (e: 'toggleWheelsNorm', value: string): void;
  (e: 'toggleForkNorm', value: string): void;
  (e: 'toggleBrakesNorm', value: string): void;
  (e: 'toggleGearsNorm', value: string): void;
  (e: 'toggleMotorNorm', value: string): void;
  (e: 'toggleBatteryNorm', value: string): void;
  (e: 'toggleColorNorm', value: string): void;
}>();

const openSections = ref<Record<string, boolean>>({
  price: true,
  brands: false,
  motor: false,
  battery: false,
  fork: false,
  brakes: false,
  gears: false,
  colors: false,
  wheelsNorm: false,
  availability: false
});

const brandSearch = ref('');

const toggleSection = (section: string) => {
  openSections.value[section] = !openSections.value[section];
};

// --- Brand Logos Logic ---
// We try to extract manufacturer entities from aggregations to get their logos
const manufacturerLogos = computed(() => {
  const manufacturers = props.aggregations?.manufacturer?.entities || [];
  const map: Record<string, string> = {};
  manufacturers.forEach((m: any) => {
    if (m.media?.url) map[m.id] = m.media.url;
  });
  return map;
});

const filteredBrands = computed(() => {
  if (!props.brands) return [];
  return props.brands.filter(brand => 
    brand.name.toLowerCase().includes(brandSearch.value.toLowerCase())
  );
});

const showAllBrands = ref(false);

const displayedBrands = computed(() => {
  if (brandSearch.value || showAllBrands.value) return filteredBrands.value;
  return filteredBrands.value.slice(0, 6);
});

const hasMoreBrands = computed(() => {
  if (brandSearch.value) return false;
  return filteredBrands.value.length > 6 && !showAllBrands.value;
});

// --- Filter Logic Adjustments ---

const onBrandToggle = (brand: string) => emit('brandToggle', brand);
const onSizeToggle = (size: string) => emit('sizeToggle', size);
const onGenderToggle = (gender: string) => emit('genderToggle', gender);
const onColorToggle = (color: string) => emit('colorToggle', color);
const onWheelSizeToggle = (size: string) => emit('wheelSizeToggle', size);
const formatPriceDisplay = (val: number) => {
  if (val % 1 === 0) return val.toString();
  // Round to 2 decimals and use comma
  return val.toFixed(2).replace('.', ',').replace(',00', '');
};

const onPriceChange = (range: [number, number]) => {
  // 1. Ensure min doesn't exceed max
  let [r0, r1] = range;
  
  // 2. Rounding logic: snapping to whole numbers unless at boundaries
  // We use a small epsilon for boundary detection
  if (Math.abs(r0 - props.minPrice) < 2) r0 = props.minPrice;
  else r0 = Math.round(r0);
  
  if (Math.abs(r1 - props.maxPrice) < 2) r1 = props.maxPrice;
  else r1 = Math.round(r1);

  // Safety check
  if (r0 > r1) {
    // If it's the min handle moving, push max. If max moving, push min.
    // Simplifying: just prevent crossing
    if (range[0] !== props.priceRange[0]) r0 = r1;
    else r1 = r0;
  }

  emit('update:priceRange', [r0, r1]);
};
const onStockToggle = () => emit('update:inStockOnly', !props.inStockOnly);
const onDemandToggle = () => emit('update:onDemandOnly', !props.onDemandOnly);
const onFeaturedToggle = () => emit('update:isFeatured', !props.isFeatured);

// --- Dual Slider Logic ---
const currentMin = computed(() => props.priceRange[0] === 0 ? props.minPrice : props.priceRange[0]);
const currentMax = computed(() => props.priceRange[1] === 10000 ? props.maxPrice : props.priceRange[1]);

const trackLeft = computed(() => {
  const total = props.maxPrice - props.minPrice;
  if (total <= 0) return 0;
  return ((currentMin.value - props.minPrice) / total) * 100;
});

const trackRight = computed(() => {
  const total = props.maxPrice - props.minPrice;
  if (total <= 0) return 0;
  return 100 - (((currentMax.value - props.minPrice) / total) * 100);
});

</script>

<template>
  <div :class="`${className || ''}`">

    <!-- 1. Price Range -->
    <div class="border-b border-gray-100">
       <button 
        @click="toggleSection('price')"
        class="flex items-center justify-between w-full py-5 bg-white group transition-colors hover:text-brand"
        :aria-expanded="openSections.price"
        aria-controls="filter-section-price"
      >
        <span class="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 font-montserrat">CENA</span>
        <ChevronDown :class="`w-4 h-4 text-gray-400 transition-transform duration-300 ${openSections.price ? 'rotate-180' : ''}`" aria-hidden="true" />
      </button>
      
      <div v-if="openSections.price" id="filter-section-price" class="pb-6 px-1">
           <!-- Dual Slider Wrapper -->
           <div class="relative h-10 flex flex-col justify-center">
             <!-- Track Background -->
             <div class="absolute w-full h-[1px] bg-gray-100 rounded-default overflow-hidden">
               <!-- Highlighted Range Track -->
               <div 
                 class="absolute h-full bg-brand transition-all duration-150"
                 :style="{ left: `${trackLeft}%`, right: `${trackRight}%` }"
               ></div>
             </div>

             <!-- Min Slider -->
             <input 
              type="range" 
              :min="Math.floor(minPrice)" 
              :max="Math.ceil(maxPrice)" 
              step="1"
              :value="currentMin"
              @input="(e) => onPriceChange([Number((e.target as HTMLInputElement).value), priceRange[1]])"
              class="absolute w-full h-1 appearance-none bg-transparent pointer-events-none custom-dual-input z-[10]"
             />

             <!-- Max Slider -->
             <input 
              type="range" 
              :min="Math.floor(minPrice)" 
              :max="Math.ceil(maxPrice)" 
              step="1"
              :value="currentMax"
              @input="(e) => onPriceChange([priceRange[0], Number((e.target as HTMLInputElement).value)])"
              class="absolute w-full h-1 appearance-none bg-transparent pointer-events-none custom-dual-input z-[20]"
             />
           </div>

           <div class="flex gap-2 mt-4">
             <div class="relative flex-1">
                <input 
                  type="text" 
                  :value="formatPriceDisplay(currentMin)"
                  @change="(e) => onPriceChange([Number((e.target as HTMLInputElement).value.replace(',', '.')) || minPrice, priceRange[1]])"
                  class="w-full p-3 bg-gray-50 border-none text-xs font-bold text-gray-900 rounded-default focus:ring-1 focus:ring-gray-200 text-center"
                />
             </div>
             <div class="relative flex-1">
                <input 
                  type="text" 
                  :value="formatPriceDisplay(currentMax)"
                  @change="(e) => onPriceChange([priceRange[0], Number((e.target as HTMLInputElement).value.replace(',', '.')) || maxPrice])"
                  class="w-full p-3 bg-gray-50 border-none text-xs font-bold text-gray-900 rounded-default focus:ring-1 focus:ring-gray-200 text-center"
                />
             </div>
           </div>
      </div>
    </div>

    <!-- 10. Availability -->
    <div class="border-b border-gray-100 py-6">
      <div class="flex flex-col gap-2">
        <button 
          @click="onStockToggle"
          class="flex items-center justify-between w-full p-4 rounded-default transition-all border"
          :class="inStockOnly ? 'bg-brand border-brand text-white shadow-md' : 'bg-gray-50 border-transparent hover:bg-gray-100 text-gray-700'"
        >
          <div class="flex flex-col items-start gap-0.5">
            <span class="text-[11px] font-bold uppercase tracking-widest leading-none">Skladom</span>
            <span :class="`text-[9px] uppercase tracking-wider font-montserrat ${inStockOnly ? 'text-gray-300' : 'text-gray-400'}`">Odosielame ihneď</span>
          </div>
          <div :class="`w-4 h-4 rounded-sm border flex items-center justify-center ${
            inStockOnly ? 'bg-white border-white text-brand' : 'bg-white border-gray-300'
          }`">
            <Check v-if="inStockOnly" class="w-3 h-3" stroke-width="3" />
          </div>
        </button>

        <button 
          @click="onDemandToggle"
          class="flex items-center justify-between w-full p-4 rounded-default transition-all border"
          :class="onDemandOnly ? 'bg-brand border-brand text-white shadow-md' : 'bg-gray-50 border-transparent hover:bg-gray-100 text-gray-700'"
        >
          <div class="flex flex-col items-start gap-0.5">
            <span class="text-[11px] font-bold uppercase tracking-widest leading-none">Na objednávku</span>
            <span :class="`text-[9px] uppercase tracking-wider font-montserrat ${onDemandOnly ? 'text-gray-300' : 'text-gray-400'}`">Odosielame za 3-5 dní</span>
          </div>
          <div
            class="w-4 h-4 rounded-sm border flex items-center justify-center"
            :class="onDemandOnly ? 'bg-white border-white text-brand' : 'bg-white border-gray-300'"
          >
            <Check v-if="onDemandOnly" class="w-3 h-3" stroke-width="3" />
          </div>
        </button>

        <!-- Odporúčané produkty (markAsTopseller) -->
        <button 
          @click="onFeaturedToggle"
          class="flex items-center justify-between w-full p-4 rounded-default transition-all border"
          :class="isFeatured ? 'bg-brand border-brand text-white shadow-md' : 'bg-gray-50 border-transparent hover:bg-gray-100 text-gray-700'"
        >
          <div class="flex flex-col items-start gap-0.5">
            <span class="text-[11px] font-bold uppercase tracking-widest leading-none">Odporúčané produkty</span>
            <span :class="`text-[9px] uppercase tracking-wider font-montserrat ${isFeatured ? 'text-gray-300' : 'text-gray-400'}`">Vybrali sme pre vás</span>
          </div>
          <div
            class="w-4 h-4 rounded-sm border flex items-center justify-center"
            :class="isFeatured ? 'bg-white border-white text-brand' : 'bg-white border-gray-300'"
          >
            <Check v-if="isFeatured" class="w-3 h-3" stroke-width="3" />
          </div>
        </button>
      </div>
    </div>


     <!-- 8. Motor Norm (E-bike only) -->
    <div v-if="(categoryName?.toLowerCase().includes('elektro') || categoryName?.toLowerCase().includes('e-bike')) && motorNorm && motorNorm.length > 0" class="border-b border-gray-100">
        <button 
          @click="toggleSection('motor')"
          class="flex items-center justify-between w-full py-5 bg-white group transition-colors hover:text-brand"
          :aria-expanded="openSections.motor"
          aria-controls="filter-section-motor"
        >
          <span class="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 font-montserrat">Motor</span>
          <ChevronDown :class="`w-4 h-4 text-gray-400 transition-transform duration-300 ${openSections.motor ? 'rotate-180' : ''}`" aria-hidden="true" />
        </button>
        <div v-if="openSections.motor" id="filter-section-motor" class="flex flex-col gap-1 pb-6 px-1">
             <label v-for="item in motorNorm" :key="item.id" class="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer transition-colors group">
                <input type="checkbox" :checked="selectedMotorNorm?.includes(item.id)" @change="emit('toggleMotorNorm', item.id)" class="text-brand border-gray-300 rounded-sm focus:ring-brand/20 w-4 h-4 transition-all" />
                <span class="text-[11px] font-bold text-gray-700 uppercase group-hover:text-gray-900 transition-colors">{{ item.name }}</span>
             </label>
        </div>
    </div>

    <!-- 9. Battery Norm (E-bike only) -->
    <div v-if="(categoryName?.toLowerCase().includes('elektro') || categoryName?.toLowerCase().includes('e-bike')) && batteryNorm && batteryNorm.length > 0" class="border-b border-gray-100">
        <button 
          @click="toggleSection('battery')"
          class="flex items-center justify-between w-full py-5 bg-white group transition-colors hover:text-brand"
          :aria-expanded="openSections.battery"
          aria-controls="filter-section-battery"
        >
          <span class="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 font-montserrat">Batéria</span>
          <ChevronDown :class="`w-4 h-4 text-gray-400 transition-transform duration-300 ${openSections.battery ? 'rotate-180' : ''}`" aria-hidden="true" />
        </button>
        <div v-if="openSections.battery" id="filter-section-battery" class="flex flex-col gap-1 pb-6 px-1">
             <label v-for="item in batteryNorm" :key="item.id" class="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer transition-colors group">
                <input type="checkbox" :checked="selectedBatteryNorm?.includes(item.id)" @change="emit('toggleBatteryNorm', item.id)" class="text-brand border-gray-300 rounded-sm focus:ring-brand/20 w-4 h-4 transition-all" />
                <span class="text-[11px] font-bold text-gray-700 uppercase group-hover:text-gray-900 transition-colors">{{ item.name }}</span>
             </label>
        </div>
    </div>

    <!-- 3. Brands: Logos -->
    <div class="border-b border-gray-100">
       <button 
        @click="toggleSection('brands')"
        class="flex items-center justify-between w-full py-5 bg-white group transition-colors hover:text-brand"
        :aria-expanded="openSections.brands"
        aria-controls="filter-section-brands"
      >
        <span class="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 font-montserrat">Značka</span>
        <ChevronDown :class="`w-4 h-4 text-gray-400 transition-transform duration-300 ${openSections.brands ? 'rotate-180' : ''}`" aria-hidden="true" />
      </button>

      <div v-if="openSections.brands" id="filter-section-brands" class="space-y-4 pb-6 px-1">
           <div class="relative">
              <input 
                type="text" 
                placeholder="Hľadať značku..." 
                v-model="brandSearch"
                class="w-full pl-10 pr-4 py-3 bg-gray-50 border-none text-xs font-montserrat rounded-default focus:ring-1 focus:ring-gray-200"
              />
              <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
           </div>

           <div class="grid grid-cols-2 gap-2 overflow-y-auto pr-2 custom-aero-scrollbar" :class="showAllBrands ? 'max-h-60' : ''">
             <button 
                v-for="brand in displayedBrands" 
                :key="brand.id"
                @click="onBrandToggle(brand.id)"
                :class="selectedBrands.includes(brand.id) ? 'bg-brand border-brand text-white' : 'bg-white border-gray-100 hover:border-gray-300 text-gray-600'"
                class="p-3 flex items-center gap-3 transition-all rounded-sm border"
              >
                <div v-if="manufacturerLogos[brand.id]" class="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                    <img :src="manufacturerLogos[brand.id]" :alt="brand.name" class="max-w-full max-h-full object-contain" :class="selectedBrands.includes(brand.id) ? 'brightness-0 invert' : 'grayscale'" />
                </div>
                <span class="text-[11px] font-bold truncate flex-1 text-left leading-tight">{{ brand.name }}</span>
              </button>
           </div>

           <!-- Show More Toggle (With Logo Preview) -->
           <button 
              v-if="hasMoreBrands" 
              @click="showAllBrands = true"
              class="w-full mt-2 py-3 px-4 flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-widest text-brand transition-all rounded-default outline-none border border-transparent hover:border-brand/20 hover:bg-brand/5 group"
           >
              <div class="flex items-center gap-1.5 overflow-hidden flex-1">
                 <template v-for="(brand, idx) in filteredBrands.slice(6, 10)" :key="brand.id">
                    <img v-if="manufacturerLogos[brand.id]" :src="manufacturerLogos[brand.id]" class="w-4 h-4 object-contain opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all font-tech" />
                 </template>
                 <span class="ml-1">Zobraziť viac ({{ filteredBrands.length }})</span>
              </div>
              <ChevronDown class="w-3 h-3 flex-shrink-0 group-hover:translate-y-0.5 transition-transform" />
           </button>
      </div>
    </div>

    <!-- 4. Wheels Norm -->
    <div v-if="wheelsNorm && wheelsNorm.length > 0" class="border-b border-gray-100">
        <button 
          @click="toggleSection('wheelsNorm')"
          class="flex items-center justify-between w-full py-5 bg-white group transition-colors hover:text-brand"
          :aria-expanded="openSections.wheelsNorm"
          aria-controls="filter-section-wheels"
        >
          <span class="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 font-montserrat">Veľkosť kolies</span>
          <ChevronDown :class="`w-4 h-4 text-gray-400 transition-transform duration-300 ${openSections.wheelsNorm ? 'rotate-180' : ''}`" aria-hidden="true" />
        </button>
        <div v-if="openSections.wheelsNorm" id="filter-section-wheels" class="flex flex-col gap-1 pb-6 px-1">
             <label v-for="item in wheelsNorm" :key="item.id" class="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer transition-colors group">
                <input type="checkbox" :checked="selectedWheelsNorm?.includes(item.id)" @change="emit('toggleWheelsNorm', item.id)" class="text-brand border-gray-300 rounded-sm focus:ring-brand/20 w-4 h-4 transition-all" />
                <span class="text-[11px] font-bold text-gray-700 uppercase group-hover:text-gray-900 transition-colors">{{ item.name }}</span>
             </label>
        </div>
    </div>

    <!-- 5. Fork Norm -->
    <div v-if="forkNorm && forkNorm.length > 0" class="border-b border-gray-100">
        <button 
          @click="toggleSection('fork')"
          class="flex items-center justify-between w-full py-5 bg-white group transition-colors hover:text-brand"
          :aria-expanded="openSections.fork"
          aria-controls="filter-section-fork"
        >
          <span class="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 font-montserrat">Vidlica</span>
          <ChevronDown :class="`w-4 h-4 text-gray-400 transition-transform duration-300 ${openSections.fork ? 'rotate-180' : ''}`" aria-hidden="true" />
        </button>
        <div v-if="openSections.fork" id="filter-section-fork" class="flex flex-col gap-1 pb-6 px-1">
             <label v-for="item in forkNorm" :key="item.id" class="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer transition-colors group">
                <input type="checkbox" :checked="selectedForkNorm?.includes(item.id)" @change="emit('toggleForkNorm', item.id)" class="text-brand border-gray-300 rounded-sm focus:ring-brand/20 w-4 h-4 transition-all" />
                <span class="text-[11px] font-bold text-gray-700 uppercase group-hover:text-gray-900 transition-colors">{{ item.name }}</span>
             </label>
        </div>
    </div>

    <!-- 6. Brakes Norm -->
    <div v-if="brakesNorm && brakesNorm.length > 0" class="border-b border-gray-100">
        <button 
          @click="toggleSection('brakes')"
          class="flex items-center justify-between w-full py-5 bg-white group transition-colors hover:text-brand"
          :aria-expanded="openSections.brakes"
          aria-controls="filter-section-brakes"
        >
          <span class="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 font-montserrat">Brzdy</span>
          <ChevronDown :class="`w-4 h-4 text-gray-400 transition-transform duration-300 ${openSections.brakes ? 'rotate-180' : ''}`" aria-hidden="true" />
        </button>
        <div v-if="openSections.brakes" id="filter-section-brakes" class="flex flex-col gap-1 pb-6 px-1">
             <label v-for="item in brakesNorm" :key="item.id" class="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer transition-colors group">
                <input type="checkbox" :checked="selectedBrakesNorm?.includes(item.id)" @change="emit('toggleBrakesNorm', item.id)" class="text-brand border-gray-300 rounded-sm focus:ring-brand/20 w-4 h-4 transition-all" />
                <span class="text-[11px] font-bold text-gray-700 uppercase group-hover:text-gray-900 transition-colors">{{ item.name }}</span>
             </label>
        </div>
    </div>

    <!-- 7. Gears Norm -->
    <div v-if="gearsNorm && gearsNorm.length > 0" class="border-b border-gray-100">
        <button 
          @click="toggleSection('gears')"
          class="flex items-center justify-between w-full py-5 bg-white group transition-colors hover:text-brand"
          :aria-expanded="openSections.gears"
          aria-controls="filter-section-gears"
        >
          <span class="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 font-montserrat">Prehadzovačka</span>
          <ChevronDown :class="`w-4 h-4 text-gray-400 transition-transform duration-300 ${openSections.gears ? 'rotate-180' : ''}`" aria-hidden="true" />
        </button>
        <div v-if="openSections.gears" id="filter-section-gears" class="flex flex-col gap-1 pb-6 px-1">
             <label v-for="item in gearsNorm" :key="item.id" class="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer transition-colors group">
                <input type="checkbox" :checked="selectedGearsNorm?.includes(item.id)" @change="emit('toggleGearsNorm', item.id)" class="text-brand border-gray-300 rounded-sm focus:ring-brand/20 w-4 h-4 transition-all" />
                <span class="text-[11px] font-bold text-gray-700 uppercase group-hover:text-gray-900 transition-colors">{{ item.name }}</span>
             </label>
        </div>
    </div>

    <!-- 8. Colors Norm -->
    <div v-if="colorsNorm && colorsNorm.length > 0" class="border-b border-gray-100">
        <button 
          @click="toggleSection('colors')"
          class="flex items-center justify-between w-full py-5 bg-white group transition-colors hover:text-brand"
          :aria-expanded="openSections.colors"
          aria-controls="filter-section-colors"
        >
          <span class="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 font-montserrat">Farba</span>
          <ChevronDown :class="`w-4 h-4 text-gray-400 transition-transform duration-300 ${openSections.colors ? 'rotate-180' : ''}`" aria-hidden="true" />
        </button>
        <div v-if="openSections.colors" id="filter-section-colors" class="pb-6 px-1">
             <div class="flex flex-wrap gap-3">
                <button 
                  v-for="item in colorsNorm" 
                  :key="item.id"
                  @click="emit('toggleColorNorm', item.id)"
                  class="group relative flex flex-col items-center justify-center p-0.5 rounded-full transition-all duration-300 transform active:scale-90"
                  :title="item.name"
                  :aria-label="item.name"
                >
                    <!-- Enhanced Outer Ring for Selected State -->
                    <div 
                      class="w-8 h-8 rounded-full border-2 transition-all p-0.5"
                      :class="selectedColors?.includes(item.id) ? 'border-brand scale-110 shadow-lg shadow-brand/20' : 'border-transparent group-hover:border-gray-200'"
                    >
                        <!-- Inner Color Swatch -->
                        <div 
                            class="w-full h-full rounded-full border border-gray-100 shadow-inner" 
                            :style="{ backgroundColor: item.color || '#e5e7eb' }"
                        ></div>
                    </div>
                </button>
             </div>
        </div>
    </div>




  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Custom Aero Scrollbar for Brand List */
.custom-aero-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-aero-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-aero-scrollbar::-webkit-scrollbar-thumb {
  background: #E5E7EB;
}
.custom-aero-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--brand-color);
}

/* Custom slider thumb styling for Dual handles */
.custom-dual-input {
  pointer-events: none;
}

.custom-dual-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  pointer-events: auto;
  height: 18px;
  width: 18px;
  border-radius: 0;
  background: var(--brand-color);
  cursor: grab;
  border: 4px solid #fff;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
  position: relative;
  z-index: 50;
}

.custom-dual-input::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.custom-dual-input::-webkit-slider-thumb:active {
  cursor: grabbing;
  transform: scale(1);
}

/* Firefox compatibility */
.custom-dual-input::-moz-range-thumb {
  pointer-events: auto;
  height: 18px;
  width: 18px;
  border-radius: 0;
  background: var(--brand-color);
  cursor: grab;
  border: 4px solid #fff;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
</style>
