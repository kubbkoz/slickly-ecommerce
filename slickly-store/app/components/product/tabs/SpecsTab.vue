<script setup lang="ts">
import { AlertTriangle, Zap, Layers, Settings, Disc, Box, CircleDot, Info } from 'lucide-vue-next';
import { type Product } from '~/types';

const props = withDefaults(defineProps<{
  product: Product;
  availableSizes: string[];
  singleColumn?: boolean;
}>(), { singleColumn: false });

// 1. PRIDANIE DO ŠPECIFIKÁCIÍ (mapovanie vlastností)
const realSpecs = computed(() => {
  const propsArray = props.product?.properties || props.product?._raw?.properties || [];
  const map = new Map<string, string[]>();

  propsArray.forEach((p: any) => {
    let gName = p.group?.translated?.name || p.group?.name;
    const pName = p.translated?.name || p.name;
    
    // Normalizácia "RIADIDLA" -> "Riadidlá"
    if (gName?.toLowerCase() === 'riadidla' || gName?.toUpperCase() === 'RIADIDLA') {
        gName = 'Riadidlá';
    }

    if (gName && pName) {
      if (!map.has(gName)) map.set(gName, []);
      if (!map.get(gName)!.includes(pName)) {
         map.get(gName)!.push(pName);
      }
    }
  });

  const specs: { key: string; value: string }[] = [];
  map.forEach((values, key) => {
    specs.push({ key, value: values.join(', ') });
  });

  if (props.product.brand) {
      specs.push({ key: 'Značka', value: props.product.brand });
  }

  return specs;
});

// 2. ROZDELENIE DO SEKCIÍ (komponenty, e-bike atď.)
const groups = computed(() => {
  const g = {
      ebike: { id: 'ebike', title: 'E-Bike Systém', icon: Zap, iconClass: 'text-yellow-500', items: [] as typeof realSpecs.value },
      frame: { id: 'frame', title: 'Rám a Odpruženie', icon: Layers, iconClass: 'text-brand', items: [] as typeof realSpecs.value },
      drivetrain: { id: 'drivetrain', title: 'Pohon a Radenie', icon: Settings, iconClass: 'text-gray-500', items: [] as typeof realSpecs.value },
      brakes: { id: 'brakes', title: 'Brzdy', icon: Disc, iconClass: 'text-red-500', items: [] as typeof realSpecs.value },
      wheels: { id: 'wheels', title: 'Kolesá a Plášte', icon: CircleDot, iconClass: 'text-blue-500', items: [] as typeof realSpecs.value },
      components: { id: 'components', title: 'Komponenty', icon: Box, iconClass: 'text-purple-500', items: [] as typeof realSpecs.value },
      other: { id: 'other', title: 'Ostatné', icon: Info, iconClass: 'text-gray-400', items: [] as typeof realSpecs.value },
    };

    realSpecs.value.forEach(spec => {
      const k = spec.key.toLowerCase();
      if (k.includes('motor') || k.includes('batér') || k.includes('kapacit') || k.includes('displej') || k.includes('nabíjačka')) {
        g.ebike.items.push(spec);
      } else if (k.includes('rám') || k.includes('vidlica') || k.includes('vidlic') || k.includes('tlmič') || k.includes('hlavové')) {
        g.frame.items.push(spec);
      } else if (k.includes('prehadzovač') || k.includes('prešmykač') || k.includes('přesmyk') || k.includes('radenie') || k.includes('kľuky') || k.includes('kazeta') || k.includes('reťaz') || k.includes('pedále') || k.includes('rýchlosti') || k.includes('stredov') || k.includes('séri')) {
        g.drivetrain.items.push(spec);
      } else if (k.includes('brzdy') || k.includes('bŕzd') || k.includes('kotúč') || k.includes('brzdov')) {
        g.brakes.items.push(spec);
      } else if (k.includes('ráfiky') || k.includes('plášte') || k.includes('náboj') || k.includes('výplet') || k.includes('kolies') || k.includes('kolesá')) {
        g.wheels.items.push(spec);
      } else if (k.includes('riadidlá') || k.includes('riadidla') || k.includes('predstavec') || k.includes('sedlovka') || k.includes('sedlo') || k.includes('madlá')) {
        g.components.items.push(spec);
      } else {
        g.other.items.push(spec);
      }
    });

    // 3. SORTING WITHIN GROUPS (Užívateľské poradie)
    const SORT_ORDER: Record<string, string[]> = {
      ebike: ['Motor', 'Batéria', 'Kapacita batérie', 'Displej', 'Nabíjačka'],
      frame: ['Rám', 'Vidlica', 'Typ vidlice'],
      brakes: ['Brzdy', 'Typ bŕzd'],
      drivetrain: ['Kľuky', 'Pedále', 'Reťaz', 'Rýchlosti']
    };

    Object.keys(g).forEach(key => {
      const groupKey = key as keyof typeof g;
      const order = SORT_ORDER[groupKey];
      if (order) {
        g[groupKey].items.sort((a, b) => {
          const ai = order.indexOf(a.key);
          const bi = order.indexOf(b.key);
          if (ai !== -1 && bi !== -1) return ai - bi;
          if (ai !== -1) return -1;
          if (bi !== -1) return 1;
          return 0;
        });
      }
    });

    return g;
});

const leftColumnKeys: (keyof typeof groups.value)[] = ['ebike', 'frame', 'drivetrain'];
const rightColumnKeys: (keyof typeof groups.value)[] = ['brakes','wheels', 'components', 'other'];

</script>

<template>
  <div class="animate-fade-in font-sans">
      <!-- Main Grid: Left and Right Columns -->
      <div :class="['grid gap-8 mb-16 items-start text-sm', singleColumn ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2']">
        
        <!-- Left Column -->
        <div class="flex flex-col gap-8">
          <template v-for="key in leftColumnKeys" :key="key">
            <div v-if="groups[key].items.length > 0" class="bg-white border border-gray-100 transition-all duration-300 rounded-default overflow-hidden h-fit">
                <div class="px-6 py-4 border-b bg-gray-50 border-gray-100 text-gray-900 flex items-center justify-between">
                <h4 class="text-lg font-black font-tech uppercase tracking-wide flex items-center">
                    <span class="mr-3"><component :is="groups[key].icon" class="w-5 h-5" :class="groups[key].iconClass" /></span>
                    {{ groups[key].title }}
                </h4>
                </div>
                
                <div class="divide-y divide-gray-50">
                <div v-for="(spec, idx) in groups[key].items" :key="idx" class="flex flex-col sm:flex-row sm:justify-between sm:items-center px-6 py-3 hover:bg-gray-100/60 transition-colors gap-1 sm:gap-4" :class="idx % 2 !== 0 ? 'bg-gray-50' : ''">
                    <span class="text-xs font-bold text-gray-400 uppercase tracking-[0.1em] font-chakra flex-shrink-0">
                    {{ spec.key }}
                    </span>
                    <span class="text-[13px] font-bold text-gray-800 text-left sm:text-right font-sans leading-snug max-w-[70%]">
                    {{ spec.value }}
                    </span>
                </div>
                </div>

                <!-- Pedal Warning (Only for drivetrain if pedals are not listed) -->
                <div 
                    v-if="key === 'drivetrain' && !groups.drivetrain.items.some(i => i.key.toLowerCase().includes('pedále'))" 
                    class="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex gap-3 items-start"
                >
                    <Info class="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <p class="text-[12px] text-gray-600 leading-normal italic">
                        Ak produkt nemá uvedené pedále je dodávaný bez nich.
                    </p>
                </div>
            </div>
          </template>
        </div>

        <!-- Right Column -->
        <div class="flex flex-col gap-8">
            <template v-for="key in rightColumnKeys" :key="key">
                <div v-if="groups[key].items.length > 0" class="bg-white border border-gray-100 transition-all duration-300 rounded-default overflow-hidden h-fit">
                    <div class="px-6 py-4 border-b bg-gray-50 border-gray-100 text-gray-900 flex items-center justify-between">
                    <h4 class="text-lg font-black font-tech uppercase tracking-wide flex items-center">
                        <span class="mr-3"><component :is="groups[key].icon" class="w-5 h-5" :class="groups[key].iconClass" /></span>
                        {{ groups[key].title }}
                    </h4>
                    </div>

                    <div class="divide-y divide-gray-50">
                    <div v-for="(spec, idx) in groups[key].items" :key="idx" class="flex flex-col sm:flex-row sm:justify-between sm:items-center px-6 py-3 hover:bg-gray-100/60 transition-colors gap-1 sm:gap-4" :class="idx % 2 !== 0 ? 'bg-gray-50' : ''">
                        <span class="text-xs font-bold text-gray-400 uppercase tracking-[0.1em] font-chakra flex-shrink-0">
                        {{ spec.key }}
                        </span>
                        <span class="text-[13px] font-bold text-gray-800 text-left sm:text-right font-sans leading-snug max-w-[70%]">
                        {{ spec.value }}
                        </span>
                    </div>
                    </div>
                </div>
            </template>
        </div>

      </div>

      <!-- Warning Box Moved to Bottom -->
      <div class="mt-12 p-6 bg-orange-50 text-[13px] text-orange-900 rounded-default shadow-sm leading-relaxed overflow-hidden relative flex gap-4 items-start border-none">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-orange-400"></div>
          <AlertTriangle class="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <strong class="font-chakra uppercase tracking-wider text-xs block mb-1 text-orange-700">Dôležité upozornenie</strong>
            <p class="leading-relaxed text-[13px]">
              Výrobca si vyhradzuje právo meniť špecifikácie, farby a parametre bez predchádzajúceho upozornenia. 
              Hmotnosti bicyklov nie sú štandardne udávané, pretože neexistuje jednotná norma váženia.
            </p>
          </div>
      </div>

    </div>
</template>

<style scoped>
.font-chakra {
  font-family: 'Space Grotesk', sans-serif;
}
</style>
