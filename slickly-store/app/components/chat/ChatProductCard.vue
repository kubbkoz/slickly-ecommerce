<script setup lang="ts">
const props = defineProps<{
  product: {
    id: string;
    name: string;
    price: number;
    listPrice?: number | null;
    imageUrl?: string | null;
    seoPath?: string | null;
    brand?: string | null;
  };
}>();

const localePath = useLocalePath();

const discount = computed(() => {
  if (!props.product.listPrice || props.product.listPrice <= props.product.price) return 0;
  return Math.round(((props.product.listPrice - props.product.price) / props.product.listPrice) * 100);
});

const href = computed(() =>
  props.product.seoPath ? localePath(props.product.seoPath) : null
);

const resolvedImage = computed(() => {
  const url = props.product.imageUrl;
  if (!url) return null;
  if (import.meta.dev && url.startsWith('https://mtsport.store')) {
    return url.replace(/^https:\/\/mtsport\.store/, '/mts-proxy');
  }
  return url;
});
</script>

<template>
  <NuxtLink
    v-if="href"
    :to="href"
    class="flex gap-3 p-2.5 bg-white hover:bg-gray-50 transition-all duration-200 cursor-pointer group border border-gray-100 hover:border-brand/30 no-underline"
  >
    <!-- Obrázok -->
    <div class="w-[72px] h-[72px] bg-gray-50 shrink-0 relative overflow-hidden flex items-center justify-center p-1.5 border border-gray-100/80">
      <img
        v-if="resolvedImage"
        :src="resolvedImage"
        :alt="product.name"
        class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
        <span class="text-[10px] text-gray-400 font-tech">MT</span>
      </div>
      <div v-if="discount > 0" class="absolute top-0 left-0 bg-brand text-white text-[9px] font-bold px-1.5 py-0.5">
        -{{ discount }}%
      </div>
    </div>

    <!-- Info -->
    <div class="flex flex-col justify-center min-w-0 flex-1">
      <p v-if="product.brand" class="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-tech mb-0.5">
        {{ product.brand }}
      </p>
      <h4 class="font-sans text-[12px] font-semibold text-gray-900 group-hover:text-brand transition-colors line-clamp-2 leading-tight mb-1.5">
        {{ product.name }}
      </h4>
      <div class="flex items-baseline gap-2">
        <span class="font-tech font-black text-[15px] text-black leading-none">
          {{ product.price.toLocaleString('sk-SK') }} €
        </span>
        <span v-if="product.listPrice && product.listPrice > product.price" class="text-[10px] text-gray-400 line-through font-tech">
          {{ product.listPrice.toLocaleString('sk-SK') }} €
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
