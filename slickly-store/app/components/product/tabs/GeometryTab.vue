<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Info } from 'lucide-vue-next';

const props = defineProps<{
  availableSizes: string[];
  product?: any;
}>();

// Extrahovanie veľkostí a ich rozsahov z configuratorSettings produktu
const formatOptionLabel = (name: string) => {
  const index = name.indexOf('(');
  if (index === -1) return { top: name, bottom: '' };
  return {
    top: name.substring(0, index).trim(),
    bottom: name.substring(index).trim()
  };
};

const extractedSizes = computed(() => {
  if (!props.product?.configuratorSettings) return [];
  
  const sizeSettings = props.product.configuratorSettings.filter((cs: any) => {
    const groupName = cs.option?.group?.translated?.name?.toLowerCase() || cs.option?.group?.name?.toLowerCase() || '';
    return groupName.includes('veľkosť') || groupName.includes('rám') || groupName.includes('size');
  });

  return sizeSettings.map((cs: any) => {
    const name = cs.option?.translated?.name || cs.option?.name || '';
    const parsed = formatOptionLabel(name);
    let min = 150;
    let max = 205;
    
    if (parsed.bottom) {
        const matches = parsed.bottom.match(/(\d+)\s*(-|do)\s*(\d+)/i) || parsed.bottom.match(/(\d+)/g);
        if (matches && matches.length >= 3 && matches[2]?.includes('-')) {
           min = parseInt(matches[1] || '150');
           max = parseInt(matches[3] || '205');
        } else if (matches && matches.length >= 2) {
           min = parseInt(matches[0] || '150');
           max = parseInt(matches[1] || '205');
        }
    }

    return {
      id: cs.option?.id,
      name: name,
      short: parsed.top,
      min: min,
      max: max
    };
  }).sort((a: any, b: any) => a.min - b.min);
});

const parentMinHeight = computed(() => props.product?.customFields?.mtsport_height_min ?? 150);
const parentMaxHeight = computed(() => props.product?.customFields?.mtsport_height_max ?? 205);

const geoRiderHeight = ref(175);
const geoActiveSize = ref('');

// Nastavenie defaultnej výšky na stred posuvníka. Spustí sa len na začiatku.
watch([parentMinHeight, parentMaxHeight], ([min, max]) => {
  const defaultHeight = Math.round((min + max) / 2);
  geoRiderHeight.value = defaultHeight;
}, { immediate: true });

// Nastavenie defaultnej aktívnej záložky, ak existujú hodnoty
watch(() => extractedSizes.value, (newSizes) => {
  if (newSizes.length > 0 && !geoActiveSize.value) {
     geoActiveSize.value = newSizes[0].short;
  }
}, { immediate: true });

const activeSizeObj = computed(() => extractedSizes.value.find((s: any) => s.short === geoActiveSize.value));

const recommendedSize = computed(() => {
    if (!extractedSizes.value.length) return geoActiveSize.value;
    
    const height = geoRiderHeight.value;
    const matches = extractedSizes.value.filter((s: any) => height >= s.min && height <= s.max);
    
    if (matches.length > 0) {
        return matches.map((m: any) => m.short).join(' / ');
    }
    
    // Ak hodnota nevyhovuje priamemu rozsahu, priraď najbližšiu min alebo max
    if (height < extractedSizes.value[0].min) return extractedSizes.value[0].short;
    const last = extractedSizes.value[extractedSizes.value.length - 1];
    if (height > last.max) return last.short;
    
    return geoActiveSize.value || 'M';
});

const geometryData: Record<string, Record<string, string>> = {
    'XS': { 'Wheel Size': '27.5"', 'Seat Tube': '440', 'Top Tube': '550', 'Head Tube': '100', 'Reach': '390', 'Stack': '590', 'Wheelbase': '1140' },
    'S': { 'Wheel Size': '29"', 'Seat Tube': '480', 'Top Tube': '580', 'Head Tube': '110', 'Reach': '420', 'Stack': '605', 'Wheelbase': '1170' },
    'M': { 'Wheel Size': '29"', 'Seat Tube': '503', 'Top Tube': '605', 'Head Tube': '120', 'Reach': '450', 'Stack': '615', 'Wheelbase': '1200' },
    'L': { 'Wheel Size': '29"', 'Seat Tube': '520', 'Top Tube': '630', 'Head Tube': '130', 'Reach': '475', 'Stack': '630', 'Wheelbase': '1230' },
    'XL': { 'Wheel Size': '29"', 'Seat Tube': '540', 'Top Tube': '650', 'Head Tube': '145', 'Reach': '500', 'Stack': '645', 'Wheelbase': '1260' },
};

const currentGeometry = computed(() => {
    // Mapujeme do mockov, aby nám zostali hodnoty (skúšame match stringu, napr. "M" voči mock dátam)
    if (activeSizeObj.value) {
        for (const key in geometryData) {
            if (activeSizeObj.value.short.includes(key)) return geometryData[key];
        }
    }
    return geometryData['M'] || {};
});

</script>

<template>
  <div class="animate-fade-in font-sans">
      <div class="flex flex-col lg:flex-row gap-12">
          <!-- Left Side: Visuals & Slider -->
          <div class="flex-1">
            <div class="bg-[#f7f9fa] p-6 mb-8 border border-gray-100 flex items-center justify-center">
              <img 
                src="https://www.mt-sport.sk/wp-content/uploads/2025/07/image-58.png.webp" 
                alt="Geometry Diagram" 
                class="w-full h-auto max-h-[250px] object-contain mix-blend-multiply"
              />
            </div>
            <div class="bg-[#f7f9fa] p-6 border border-gray-100">
              <label class="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 text-center">
                Výška jazdca: <span class="text-brand text-base">{{ geoRiderHeight }} cm</span>
              </label>
              <div class="relative px-2">
                <input 
                  type="range" 
                  :min="parentMinHeight" 
                  :max="parentMaxHeight" 
                  v-model.number="geoRiderHeight"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand"
                />
                <div class="flex justify-between text-[10px] text-gray-400 mt-2 font-mono font-bold">
                  <span>{{ parentMinHeight }}cm</span>
                  <span>{{ Math.round((parentMinHeight + parentMaxHeight)/2) }}cm</span>
                  <span>{{ parentMaxHeight }}cm</span>
                </div>
              </div>
              <div class="mt-6 text-center">
                <span class="text-xs text-gray-400 uppercase font-bold tracking-widest font-chakra">Odporúčaná veľkosť:</span>
                <div class="text-2xl font-black font-tech text-black mt-1 leading-none">{{ recommendedSize }}</div>
              </div>
            </div>
          </div>

          <!-- Right Side: Data Table -->
          <div class="flex-1">
            <div class="flex flex-wrap gap-1.5 mb-6 border-b border-gray-100 pb-4">
              <button
                v-for="size in (extractedSizes.length ? extractedSizes : [{short: 'M'}])"
                :key="size.short"
                @click="geoActiveSize = size.short"
                class="flex items-center justify-center px-4 py-2 text-sm font-bold uppercase tracking-widest transition-all duration-200 border font-chakra"
                :class="geoActiveSize === size.short 
                  ? 'bg-black text-white border-black shadow-md' 
                  : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-600'"
              >
                {{ size.short }}
              </button>
            </div>
            <h3 class="text-xl font-bold uppercase font-tech mb-8 text-center lg:text-left tracking-tight">
              {{ activeSizeObj ? activeSizeObj.name : 'M 54 (175-185cm)' }}
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4 mb-8">
              <div v-for="(value, key) in currentGeometry" :key="key" class="text-center">
                  <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 font-chakra leading-tight">{{ key }}</span>
                  <span class="block text-lg font-bold font-montserrat text-gray-900 leading-none">{{ value }}<span class="text-[10px] ml-0.5 font-bold uppercase opacity-60">{{ key === 'Wheel Size' ? '' : 'mm' }}</span></span>
              </div>
              
              <!-- Static filler -->
              <div class="text-center">
                <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 font-chakra leading-tight">BB Drop</span>
                <span class="block text-lg font-bold font-montserrat text-gray-900 leading-none">70 <span class="text-[10px] ml-0.5 font-bold uppercase opacity-60">mm</span></span>
              </div>
                <div class="text-center">
                <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 font-chakra leading-tight">Seat Angle</span>
                <span class="block text-lg font-bold font-montserrat text-gray-900 leading-none">74<span class="text-[10px] ml-0.5 font-bold uppercase opacity-60">°</span></span>
              </div>
                <div class="text-center">
                <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 font-chakra leading-tight">Head Angle</span>
                <span class="block text-lg font-bold font-montserrat text-gray-900 leading-none">68<span class="text-[10px] ml-0.5 font-bold uppercase opacity-60">°</span></span>
              </div>
              <div class="text-center">
                <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 font-chakra leading-tight">Chainstay</span>
                <span class="block text-lg font-bold font-montserrat text-gray-900 leading-none">435 <span class="text-[10px] ml-0.5 font-bold uppercase opacity-60">mm</span></span>
              </div>
            </div>

            <!-- Náš tip — pod rozmermi rámu -->
            <div class="mt-8 p-6 bg-blue-50 text-[13px] text-blue-900 leading-relaxed overflow-hidden relative flex gap-4 items-start">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-400"></div>
              <Info class="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <strong class="font-tech uppercase tracking-wider text-xs block mb-1">Náš tip</strong>
                <p>Ak sa nachádzate na rozmedzí dvoch veľkostí, pre športovejšiu jazdu zvoľte menší rám, pre komfortnejšiu jazdu zvoľte väčší rám.</p>
                <p class="mt-2">Ak si neviete vybrať správnu veľkosť, radi Vám pomôžeme. Zavolajte nám na <a href="tel:+421948993236" class="font-bold underline hover:text-blue-700">+421 948 993 236</a> alebo napíšte na <a href="mailto:info@mtsport.sk" class="font-bold underline hover:text-blue-700">info@mtsport.sk</a>.</p>
              </div>
            </div>
          </div>
      </div>

    </div>
</template>

<style scoped>
/* Custom Slider Styling to match screenshot */
input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
}

input[type='range']::-webkit-slider-runnable-track {
  width: 100%;
  height: 2px;
  background: var(--brand-color);
  border-radius: 0;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 16px;
  width: 16px;
  background: var(--brand-color);
  cursor: pointer;
  margin-top: -7px;
  border-radius: 0;
  box-shadow: 0 0 0 4px white, 0 4px 10px rgba(0,0,0,0.1);
}

input[type='range']::-moz-range-track {
  width: 100%;
  height: 2px;
  background: var(--brand-color);
}

input[type='range']::-moz-range-thumb {
  height: 16px;
  width: 16px;
  background: var(--brand-color);
  cursor: pointer;
  border-radius: 0;
  border: 4px solid white;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
</style>
