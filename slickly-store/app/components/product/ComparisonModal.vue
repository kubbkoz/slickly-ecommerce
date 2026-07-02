<script setup lang="ts">
import { X, Trash2, Share2, Sparkles, Loader2, Copy, Check, LogIn, ArrowRight } from 'lucide-vue-next';
import { useProductComparison } from '~/composables/useProductComparison';
import { useUser } from '@shopware/composables';
import { useShopwareContext } from '#imports';
import { getProductUrl } from '~/utils/url';

const localePath = useLocalePath();

const discountPercent = (item: any) => {
  if (!item.oldPrice || item.oldPrice <= item.price) return 0;
  return Math.round((1 - item.price / item.oldPrice) * 100);
};

const itemUrl = (item: any) => localePath(getProductUrl({
  productNumber: item.productNumber,
  name: item.name,
  id: item.id,
}));

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { comparisonItems, removeFromComparison, clearComparison, comparisonCount } = useProductComparison();
const { isLoggedIn, user } = useUser();
const { apiClient } = useShopwareContext();
const isLoginModalOpen = useState('loginModalOpen', () => false);
const propertiesLoading = ref(false);

const fetchMissingProperties = async () => {
  const missing = comparisonItems.value.filter(item => !item.properties?.length);
  if (!missing.length) return;
  propertiesLoading.value = true;
  try {
    const res = await apiClient.invoke('readProduct post /product' as any, {
      body: {
        filter: [{ type: 'equalsAny', field: 'id', value: missing.map(m => m.id) }],
        associations: { properties: { associations: { group: {} } } },
        includes: {
          product: ['id', 'properties'],
          property_group_option: ['id', 'name', 'translated', 'group'],
          property_group: ['id', 'name', 'translated'],
        },
      },
    });
    const products = (res?.data || res)?.elements || [];
    for (const p of products) {
      const item = comparisonItems.value.find(i => i.id === p.id);
      if (item && p.properties?.length) {
        item.properties = p.properties.map((pr: any) => ({
          group: pr.group?.translated?.name || pr.group?.name || '',
          value: pr.translated?.name || pr.name || '',
        }));
      }
    }
  } catch (e: any) {
    if (process.dev) console.error('[comparison] fetch properties failed:', e?.message);
  }
  propertiesLoading.value = false;
};


const aiRecommendation = ref('');
const aiLoading = ref(false);
const shareHash = ref('');
const shareLoading = ref(false);
const copied = ref(false);

const allPropertyGroups = computed(() => {
  const groups = new Set<string>();
  comparisonItems.value.forEach(item => {
    (item.properties || []).forEach(p => groups.add(p.group));
  });
  return Array.from(groups).sort();
});

const getPropertyValue = (item: any, group: string): string => {
  const prop = (item.properties || []).find((p: any) => p.group === group);
  return prop?.value || '—';
};

const isDifferent = (group: string): boolean => {
  const values = comparisonItems.value.map(item => getPropertyValue(item, group));
  return new Set(values.filter(v => v !== '—')).size > 1;
};

const getAiRecommendation = async () => {
  if (!isLoggedIn.value) { isLoginModalOpen.value = true; return; }
  aiLoading.value = true;
  aiRecommendation.value = '';
  try {
    const res = await $fetch<any>('/api/comparison/recommend', {
      method: 'POST',
      body: { items: comparisonItems.value },
    });
    aiRecommendation.value = res.recommendation;
  } catch { aiRecommendation.value = 'AI odporúčanie momentálne nedostupné.'; }
  aiLoading.value = false;
};

const saveAndShare = async () => {
  if (!isLoggedIn.value) { isLoginModalOpen.value = true; return; }
  shareLoading.value = true;
  try {
    const res = await $fetch<any>('/api/comparison/save', {
      method: 'POST',
      body: {
        items: comparisonItems.value,
        userId: (user.value as any)?.id || null,
      },
    });
    if (res.hash) {
      shareHash.value = res.hash;
      const url = `${window.location.origin}/porovnanie/${res.hash}`;
      await navigator.clipboard.writeText(url).catch(() => {});
      copied.value = true;
      setTimeout(() => { copied.value = false; }, 3000);
    }
  } catch {}
  shareLoading.value = false;
};

const shareUrl = computed(() =>
  shareHash.value ? `${typeof window !== 'undefined' ? window.location.origin : ''}/porovnanie/${shareHash.value}` : ''
);

watch(() => props.isOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) {
    aiRecommendation.value = '';
    shareHash.value = '';
    if (comparisonItems.value.some(i => !i.properties?.length)) {
      fetchMissingProperties();
    }
  }
});

onUnmounted(() => { document.body.style.overflow = ''; });
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm p-0 md:p-4 md:pt-12">
        <div class="absolute inset-0" @click="emit('close')"></div>

        <div class="comparison-modal relative w-full h-full md:h-auto md:max-h-[85vh] max-w-4xl bg-white shadow-2xl overflow-y-auto md:overflow-hidden flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
            <h2 class="text-lg font-tech font-bold uppercase tracking-wide">Porovnanie produktov</h2>
            <button @click="emit('close')" class="text-gray-400 hover:text-black transition-colors" aria-label="Zavrieť">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto comparison-scroll px-6 py-6">
            <!-- Empty -->
            <div v-if="comparisonCount < 2" class="text-center py-12">
              <p class="text-gray-500 font-sans text-sm mb-4">
                {{ comparisonCount === 0 ? 'Zatiaľ ste nepridali žiadne produkty.' : 'Pridajte aspoň 2 produkty na porovnanie.' }}
              </p>
              <div v-if="comparisonItems.length" class="space-y-3 text-left max-w-sm mx-auto">
                <div v-for="item in comparisonItems" :key="item.id" class="flex items-center gap-3 p-3 border border-gray-100">
                  <img :src="item.image" :alt="item.name" class="w-12 h-12 object-contain flex-shrink-0" />
                  <span class="text-xs font-bold uppercase truncate flex-1">{{ item.name }}</span>
                  <button @click="removeFromComparison(item.id)" class="text-gray-400 hover:text-brand"><X class="w-4 h-4" /></button>
                </div>
              </div>
              <p class="text-xs text-gray-400 mt-6">Navštívte produkty a kliknite "Porovnať"</p>
            </div>

            <!-- Table -->
            <template v-else>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr>
                      <th class="text-left p-3 w-40 text-[10px] font-bold uppercase tracking-widest text-gray-400 align-top sticky left-0 bg-white z-10"></th>
                      <th v-for="item in comparisonItems" :key="item.id" class="p-3 text-center align-top min-w-[180px]">
                        <div class="relative flex flex-col items-center">
                          <button @click="removeFromComparison(item.id)" class="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center text-gray-300 hover:text-brand transition-colors z-10"><X class="w-3.5 h-3.5" /></button>
                          <div class="relative">
                            <img :src="item.image" :alt="item.name" class="w-24 h-24 object-contain mx-auto mb-3" />
                            <span v-if="discountPercent(item) > 0" class="absolute top-0 left-0 px-1.5 py-0.5 text-[10px] font-bold text-black bg-amber leading-none">-{{ discountPercent(item) }}%</span>
                          </div>
                          <p class="text-[11px] font-bold uppercase leading-tight line-clamp-2 mb-2 min-h-[2.5em]">{{ item.name }}</p>
                          <p class="font-tech font-black text-lg">{{ item.price }} €</p>
                          <p v-if="item.oldPrice" class="text-xs text-gray-400 line-through mb-2">{{ item.oldPrice }} €</p>
                          <NuxtLink
                            :to="itemUrl(item)"
                            @click="emit('close')"
                            class="inline-flex items-center gap-1 mt-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-black text-[10px] font-bold uppercase tracking-widest transition-colors"
                          >
                            Zobraziť <ArrowRight class="w-3 h-3" />
                          </NuxtLink>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-t border-gray-100">
                      <td class="p-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 sticky left-0 bg-white">Kategória</td>
                      <td v-for="item in comparisonItems" :key="item.id" class="p-3 text-center text-xs font-medium">{{ item.categoryName || '—' }}</td>
                    </tr>
                    <tr class="border-t border-gray-100 bg-gray-50/50">
                      <td class="p-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 sticky left-0 bg-gray-50/50">Výrobca</td>
                      <td v-for="item in comparisonItems" :key="item.id" class="p-3 text-center text-xs font-medium">{{ item.manufacturer || '—' }}</td>
                    </tr>
                    <tr v-for="(group, idx) in allPropertyGroups" :key="group" class="border-t border-gray-100" :class="idx % 2 !== 0 ? 'bg-gray-50/50' : ''">
                      <td class="p-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 sticky left-0" :class="idx % 2 !== 0 ? 'bg-gray-50/50' : 'bg-white'">{{ group }}</td>
                      <td
                        v-for="item in comparisonItems"
                        :key="item.id"
                        class="p-3 text-center text-xs"
                        :class="isDifferent(group) ? 'bg-amber-50/80 font-semibold text-black' : ''"
                      >
                        {{ getPropertyValue(item, group) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- AI Recommendation -->
              <div v-if="aiRecommendation" class="mt-6 p-5 bg-blue-50 border-l-2 border-blue-400 text-sm text-blue-900 font-sans leading-relaxed animate-fade-in">
                <p class="font-tech font-bold uppercase text-xs mb-2 flex items-center gap-1.5"><Sparkles class="w-3.5 h-3.5" /> AI odporúčanie</p>
                {{ aiRecommendation }}
              </div>

              <!-- Share URL -->
              <div v-if="shareUrl" class="mt-4 flex items-center gap-2 p-3 bg-gray-50 border border-gray-100">
                <input :value="shareUrl" readonly class="flex-1 text-xs text-gray-600 bg-transparent focus:outline-none font-mono truncate" />
                <button @click="navigator.clipboard.writeText(shareUrl); copied = true; setTimeout(() => copied = false, 3000)" class="text-gray-400 hover:text-brand flex-shrink-0">
                  <Copy class="w-4 h-4" />
                </button>
              </div>
            </template>
          </div>

          <!-- Footer actions -->
          <div v-if="comparisonCount >= 2" class="flex flex-wrap items-center gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0 bg-white">
            <button
              @click="getAiRecommendation"
              :disabled="aiLoading"
              class="flex items-center gap-2 px-5 py-2.5 bg-brand text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brand-dark transition-colors disabled:opacity-50"
            >
              <Loader2 v-if="aiLoading" class="w-3.5 h-3.5 animate-spin" />
              <Sparkles v-else class="w-3.5 h-3.5" />
              AI odporúčanie
            </button>

            <button
              @click="saveAndShare"
              :disabled="shareLoading"
              class="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-[11px] font-bold uppercase tracking-widest hover:border-black transition-colors disabled:opacity-50"
            >
              <Loader2 v-if="shareLoading" class="w-3.5 h-3.5 animate-spin" />
              <template v-else-if="copied"><Check class="w-3.5 h-3.5 text-green-600" /> Skopírované</template>
              <template v-else><Share2 class="w-3.5 h-3.5" /> Uložiť a zdieľať</template>
            </button>

            <button @click="clearComparison" class="flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand transition-colors ml-auto">
              <Trash2 class="w-3.5 h-3.5" /> Vymazať
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.comparison-scroll::-webkit-scrollbar { width: 6px; }
.comparison-scroll::-webkit-scrollbar-track { background: transparent; }
.comparison-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
.comparison-scroll::-webkit-scrollbar-thumb:hover { background: #374151; }
.comparison-scroll { scrollbar-width: thin; scrollbar-color: #d1d5db transparent; }
</style>
