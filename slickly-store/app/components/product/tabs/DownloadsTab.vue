<script setup lang="ts">
import { FileText, Download } from 'lucide-vue-next';

const props = defineProps<{
  product: any;
}>();

const manufacturerName = computed(() =>
  props.product?.manufacturer?.translated?.name
  || props.product?.manufacturer?.name
  || props.product?.brand
  || ''
);

const files = ref<any[]>([]);
const pending = ref(true);

const fetchFiles = async () => {
  if (!manufacturerName.value) { pending.value = false; return; }
  try {
    files.value = await $fetch<any[]>(`/api/downloads/${encodeURIComponent(manufacturerName.value)}`);
  } catch { files.value = []; }
  pending.value = false;
};

onMounted(fetchFiles);
watch(manufacturerName, fetchFiles);

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatType = (mime: string) => {
  if (mime.includes('pdf')) return 'PDF';
  if (mime.includes('zip') || mime.includes('compressed')) return 'ZIP';
  if (mime.includes('image')) return 'IMG';
  return mime.split('/').pop()?.toUpperCase() || 'FILE';
};
</script>

<template>
  <div class="animate-fade-in font-sans">
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="i in 2" :key="i" class="flex items-center gap-4 p-4 border border-gray-100">
        <div class="w-10 h-10 bg-gray-100 rounded-full animate-pulse flex-shrink-0" />
        <div class="flex-1 space-y-2">
          <div class="h-3 bg-gray-100 animate-pulse w-3/4" />
          <div class="h-2 bg-gray-50 animate-pulse w-1/3" />
        </div>
      </div>
    </div>

    <div v-else-if="!files.length" class="py-6 text-gray-400 text-sm italic">
      Pre tohto výrobcu nie sú dostupné žiadne dokumenty na stiahnutie.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <a
        v-for="file in files"
        :key="file.id"
        :href="file.url"
        target="_blank"
        rel="noopener noreferrer"
        :download="file.fileName"
        class="flex items-center justify-between p-4 border border-gray-200 hover:border-brand hover:shadow-md transition-all cursor-pointer group"
      >
        <div class="flex items-center">
          <div class="w-10 h-10 bg-gray-100 group-hover:bg-brand/10 rounded-full flex items-center justify-center mr-4 text-gray-500 group-hover:text-brand flex-shrink-0">
            <FileText class="w-5 h-5" />
          </div>
          <div>
            <h5 class="font-bold text-gray-900 uppercase text-sm">{{ file.title }}</h5>
            <p class="text-xs text-gray-500">{{ formatType(file.mimeType) }}, {{ formatSize(file.fileSize) }}</p>
          </div>
        </div>
        <Download class="w-5 h-5 text-gray-400 group-hover:text-brand flex-shrink-0" />
      </a>
    </div>
  </div>
</template>
