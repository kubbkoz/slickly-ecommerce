<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { X, Ruler } from 'lucide-vue-next';
import BaseButton from '~/components/ui/BaseButton.vue';

const props = defineProps<{
  isOpen: boolean;
  category?: string;
  availableSizes?: string[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const riderHeight = ref(178);
const activeSize = ref('M');

watch([riderHeight, () => props.availableSizes], ([newHeight, sizes]) => {
    let calculatedSize = 'M';
    if (newHeight < 170) calculatedSize = 'XS';
    else if (newHeight >= 170 && newHeight < 180) calculatedSize = 'S';
    else if (newHeight >= 180 && newHeight < 185) calculatedSize = 'M';
    else if (newHeight >= 185 && newHeight < 195) calculatedSize = 'L';
    else calculatedSize = 'XL';

    if (sizes && sizes.length > 0) {
      if (sizes.includes(calculatedSize)) {
        activeSize.value = calculatedSize;
      } else {
         if (!sizes.includes(activeSize.value)) {
             activeSize.value = sizes[0] || 'M';
         }
      }
    } else {
      activeSize.value = calculatedSize;
    }
}, { immediate: true });

const handleEsc = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close');
};

onMounted(() => window.addEventListener('keydown', handleEsc));
onUnmounted(() => window.removeEventListener('keydown', handleEsc));

const geometryData: Record<string, Record<string, string>> = {
    'XS': { 'Wheel Size': '27.5"', 'Seat Tube': '440', 'Top Tube': '550', 'Head Tube': '100', 'Reach': '390', 'Stack': '590', 'Wheelbase': '1140' },
    'S': { 'Wheel Size': '29"', 'Seat Tube': '480', 'Top Tube': '580', 'Head Tube': '110', 'Reach': '420', 'Stack': '605', 'Wheelbase': '1170' },
    'M': { 'Wheel Size': '29"', 'Seat Tube': '503', 'Top Tube': '605', 'Head Tube': '120', 'Reach': '450', 'Stack': '615', 'Wheelbase': '1200' },
    'L': { 'Wheel Size': '29"', 'Seat Tube': '520', 'Top Tube': '630', 'Head Tube': '130', 'Reach': '475', 'Stack': '630', 'Wheelbase': '1230' },
    'XL': { 'Wheel Size': '29"', 'Seat Tube': '540', 'Top Tube': '650', 'Head Tube': '145', 'Reach': '500', 'Stack': '645', 'Wheelbase': '1260' },
};

const allSizes = ['XS', 'S', 'M', 'L', 'XL'];
const displaySizes = computed(() => props.availableSizes && props.availableSizes.length > 0 
    ? allSizes.filter(s => props.availableSizes!.includes(s))
    : allSizes);

const sizeLabels: Record<string, string> = {
    'XS': 'XS 49 (155-170cm)',
    'S': 'S 52 (170-180cm)',
    'M': 'M 54 (175-185cm)',
    'L': 'L 56 (180-190cm)',
    'XL': 'XL 58 (185-200cm)',
};

const currentGeo = computed(() => geometryData[activeSize.value] || geometryData['M']);
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" @click="emit('close')" />
      <div class="relative w-full max-w-5xl bg-white shadow-2xl animate-slide-up rounded-default overflow-hidden flex flex-col max-h-[90vh]">
        
        <!-- Header -->
        <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 class="text-2xl font-black uppercase font-tech tracking-wide mb-1 flex items-center">
              <Ruler class="w-6 h-6 mr-2 text-brand" /> TABUĽKA VEĽKOSTÍ A GEOMETRIA RÁMU
            </h2>
          </div>
          <button @click="emit('close')" class="p-2 hover:bg-gray-200 transition-colors rounded-sm">
            <X class="w-6 h-6" />
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto scrollbar-hide p-6 md:p-10">
          <div class="flex flex-col lg:flex-row gap-12">
            
            <!-- Left Side: Visuals & Slider -->
            <div class="flex-1">
              <!-- Bike Geometry Image -->
              <div class="bg-gray-50 p-6 mb-8 border border-gray-100 flex items-center justify-center">
                <img 
                  src="https://www.mt-sport.sk/wp-content/uploads/2025/07/image-58.png.webp" 
                  alt="Geometry Diagram" 
                  class="w-full h-auto max-h-[300px] object-contain mix-blend-multiply"
                />
              </div>

              <!-- Rider Height Slider -->
              <div class="bg-gray-50 p-6 border border-gray-100">
                <label class="block text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 text-center">
                  Nastavte výšku jazdca: <span class="text-brand text-lg">{{ riderHeight }} cm</span>
                </label>
                <div class="relative px-2">
                  <input 
                    type="range" 
                    min="155" 
                    max="205" 
                    v-model.number="riderHeight"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand"
                  />
                  <div class="flex justify-between text-xs text-gray-400 mt-2 font-mono font-bold">
                    <span>155cm</span>
                    <span>180cm</span>
                    <span>205cm</span>
                  </div>
                </div>
                <div class="mt-6 text-center">
                  <span class="text-sm text-gray-600">Odporúčaná veľkosť:</span>
                  <div class="text-4xl font-black font-tech text-black mt-1">
                    {{ activeSize }}
                    <span v-if="availableSizes && availableSizes.length > 0 && !availableSizes.includes(activeSize)" class="block text-xs text-red-500 font-sans mt-1">
                        (Momentálne nedostupné)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Side: Data Table -->
            <div class="flex-1">
              <!-- Size Tabs -->
              <div class="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
                <button
                    v-for="size in displaySizes"
                    :key="size"
                    @click="activeSize = size"
                    class="px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all border-b-4"
                    :class="activeSize === size ? 'border-brand text-black bg-gray-50' : 'border-transparent text-gray-400 hover:text-gray-600'"
                  >
                    {{ size }}
                  </button>
              </div>

              <h3 class="text-xl font-bold uppercase font-tech mb-6 text-center lg:text-left">
                {{ sizeLabels[activeSize] || activeSize }}
              </h3>

              <!-- Geometry Grid -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4">
                <div v-for="(value, key) in currentGeo" :key="key" class="text-center">
                    <span class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{{ key }}</span>
                    <span class="block text-xl font-black font-tech text-gray-900">{{ value }} {{ key === 'Wheel Size' ? '' : 'mm' }}</span>
                </div>
                
                <!-- Static filler data for visuals -->
                <div class="text-center">
                  <span class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">BB Drop</span>
                  <span class="block text-xl font-black font-tech text-gray-900">70 mm</span>
                </div>
                 <div class="text-center">
                  <span class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Seat Angle</span>
                  <span class="block text-xl font-black font-tech text-gray-900">74°</span>
                </div>
                 <div class="text-center">
                  <span class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Head Angle</span>
                  <span class="block text-xl font-black font-tech text-gray-900">68°</span>
                </div>
                <div class="text-center">
                  <span class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Chainstay</span>
                  <span class="block text-xl font-black font-tech text-gray-900">435 mm</span>
                </div>
              </div>

              <div class="mt-12 p-4 bg-blue-50 border border-blue-100 text-sm text-blue-800 rounded-default">
                <p><strong>Tip experta:</strong> Ak sa nachádzate na rozmedzí dvoch veľkostí, pre športovejšiu jazdu zvoľte menší rám, pre komfortnejšiu jazdu zvoľte väčší rám.</p>
              </div>
            </div>

          </div>
        </div>

         <!-- Footer -->
         <div class="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <BaseButton variant="ghost" @click="emit('close')" class="uppercase text-xs font-bold tracking-widest">Zatvoriť</BaseButton>
         </div>
      </div>
    </div>
</template>
