<script setup lang="ts">
import { Scale, Trash2, ExternalLink, Copy, Loader2 } from 'lucide-vue-next';

const comparisons = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    comparisons.value = await $fetch<any[]>('/api/account/comparisons');
  } catch { comparisons.value = []; }
  loading.value = false;
});

const copied = ref<string | null>(null);

const copyLink = (hash: string) => {
  const url = `${window.location.origin}/porovnanie/${hash}`;
  navigator.clipboard.writeText(url).catch(() => {});
  copied.value = hash;
  setTimeout(() => { copied.value = null; }, 3000);
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' });
</script>

<template>
  <div class="bg-white shadow-sm p-8 animate-fade-in">
    <h2 class="text-xl font-black uppercase tracking-wide font-tech mb-8">Moje porovnania</h2>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-20 bg-gray-100 animate-pulse" />
    </div>

    <div v-else-if="!comparisons.length" class="text-center py-16">
      <Scale class="w-12 h-12 text-gray-200 mx-auto mb-4" />
      <p class="text-gray-400 font-sans text-sm">Zatiaľ nemáte žiadne uložené porovnania.</p>
      <p class="text-gray-400 font-sans text-xs mt-1">Na stránke produktu kliknite "Porovnať" a uložte porovnanie.</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="comp in comparisons" :key="comp.hash" class="border border-gray-200 p-4 md:p-6">
        <div class="flex items-start justify-between gap-4 mb-4">
          <div>
            <p class="text-xs text-gray-400 font-sans">{{ formatDate(comp.createdAt) }}</p>
            <p class="text-sm font-bold mt-1">{{ comp.items?.length || 0 }} produktov</p>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="copyLink(comp.hash)"
              class="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border border-gray-200 hover:border-black transition-colors"
            >
              <template v-if="copied === comp.hash"><Check class="w-3 h-3 text-green-600" /> Skopírované</template>
              <template v-else><Copy class="w-3 h-3" /> Link</template>
            </button>
            <NuxtLink
              :to="`/porovnanie/${comp.hash}`"
              class="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-black text-white hover:bg-brand transition-colors"
            >
              <ExternalLink class="w-3 h-3" /> Otvoriť
            </NuxtLink>
          </div>
        </div>

        <div class="flex gap-3 overflow-x-auto">
          <div v-for="item in (comp.items || [])" :key="item.id" class="flex-shrink-0 w-20 text-center">
            <img :src="item.image" :alt="item.name" class="w-16 h-16 object-contain mx-auto mb-1" />
            <p class="text-[10px] font-bold uppercase leading-tight line-clamp-2">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
