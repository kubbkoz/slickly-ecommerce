<script setup lang="ts">
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-vue-next';

const route = useRoute();

const { data, error } = await useAsyncData(
  `comparison-${route.params.hash}`,
  () => $fetch<any>(`/api/comparison/load/${route.params.hash}`).catch(() => null)
);

if (!data.value) {
  throw createError({ statusCode: 404, message: 'Porovnanie nenájdené alebo vypršalo' });
}

const items = computed(() => data.value?.items || []);

const allPropertyGroups = computed(() => {
  const groups = new Set<string>();
  items.value.forEach((item: any) => {
    (item.properties || []).forEach((p: any) => groups.add(p.group));
  });
  return Array.from(groups).sort();
});

const getPropertyValue = (item: any, group: string): string => {
  const prop = (item.properties || []).find((p: any) => p.group === group);
  return prop?.value || '—';
};

const isDifferent = (group: string): boolean => {
  const values = items.value.map((item: any) => getPropertyValue(item, group));
  return new Set(values.filter((v: string) => v !== '—')).size > 1;
};

const aiRecommendation = ref('');
const aiLoading = ref(false);

const getAiRecommendation = async () => {
  aiLoading.value = true;
  try {
    const res = await $fetch<any>('/api/comparison/recommend', {
      method: 'POST',
      body: { items: items.value },
    });
    aiRecommendation.value = res.recommendation;
  } catch { aiRecommendation.value = 'AI odporúčanie momentálne nedostupné.'; }
  aiLoading.value = false;
};

useSeoMeta({
  title: 'Porovnanie produktov | SLICKLY',
  robots: 'noindex',
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-[1536px] mx-auto px-4 lg:px-8 py-12">
      <NuxtLink to="/" class="inline-flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-widest hover:text-black transition-colors mb-8">
        <ArrowLeft class="w-3.5 h-3.5" /> Späť do obchodu
      </NuxtLink>

      <h1 class="font-tech font-black uppercase text-2xl tracking-wide text-black mb-4">Porovnanie produktov</h1>
      <div class="section-decorator mb-8"></div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm min-w-[600px]">
          <thead>
            <tr>
              <th class="text-left p-3 w-40 text-[10px] font-bold uppercase tracking-widest text-gray-400"></th>
              <th v-for="item in items" :key="item.id" class="p-3 text-center align-top min-w-[160px]">
                <img :src="item.image" :alt="item.name" class="w-24 h-24 object-contain mx-auto mb-3" />
                <p class="text-xs font-bold uppercase leading-tight line-clamp-2 mb-1">{{ item.name }}</p>
                <p class="font-tech font-black text-lg">{{ item.price }} €</p>
                <p v-if="item.oldPrice" class="text-xs text-gray-400 line-through">{{ item.oldPrice }} €</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t border-gray-100">
              <td class="p-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Kategória</td>
              <td v-for="item in items" :key="item.id" class="p-3 text-center text-xs">{{ item.categoryName || '—' }}</td>
            </tr>
            <tr class="border-t border-gray-100 bg-gray-50">
              <td class="p-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Výrobca</td>
              <td v-for="item in items" :key="item.id" class="p-3 text-center text-xs font-medium">{{ item.manufacturer || '—' }}</td>
            </tr>
            <tr v-for="(group, idx) in allPropertyGroups" :key="group" class="border-t border-gray-100" :class="idx % 2 === 0 ? '' : 'bg-gray-50'">
              <td class="p-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">{{ group }}</td>
              <td v-for="item in items" :key="item.id" class="p-3 text-center text-xs" :class="isDifferent(group) ? 'bg-amber-50 font-medium' : ''">
                {{ getPropertyValue(item, group) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-8">
        <button
          @click="getAiRecommendation"
          :disabled="aiLoading"
          class="flex items-center gap-2 px-6 py-3 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brand transition-colors disabled:opacity-50"
        >
          <Loader2 v-if="aiLoading" class="w-4 h-4 animate-spin" />
          <Sparkles v-else class="w-4 h-4" />
          AI odporúčanie
        </button>
      </div>

      <div v-if="aiRecommendation" class="mt-4 p-5 bg-blue-50 border-l-2 border-blue-400 text-sm text-blue-900 font-sans leading-relaxed animate-fade-in">
        <p class="font-tech font-bold uppercase text-xs mb-2 flex items-center gap-1.5"><Sparkles class="w-3.5 h-3.5" /> AI odporúčanie</p>
        {{ aiRecommendation }}
      </div>

      <p class="text-xs text-gray-400 mt-8">Porovnanie platné 7 dní od vytvorenia.</p>
    </div>
  </div>
</template>
