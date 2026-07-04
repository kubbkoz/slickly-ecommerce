<script setup lang="ts">
import { Trash2, Zap, Loader2 } from 'lucide-vue-next';

defineProps<{ 
    isExpressShipping: boolean;
    expressProduct?: any;
}>();

const emit = defineEmits<{
    (e: 'update:isExpressShipping', val: boolean): void;
}>();

const { cartItems, removeItem, changeProductQuantity } = useCart();
const productCartItems = computed(() => (cartItems.value || []).filter((i: any) => i.type === 'product'));
const promoCartItems = computed(() => (cartItems.value || []).filter((i: any) => i.type !== 'product'));
const removingId = ref<string | null>(null);

const updateQuantity = async (item: any, delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
        removingId.value = item.id;
        await removeItem(item);
        removingId.value = null;
    } else {
        await changeProductQuantity({ id: item.id, quantity: newQty });
    }
};

const handleRemove = async (item: any) => {
    removingId.value = item.id;
    await removeItem(item);
    removingId.value = null;
};

const formatPrice = (price: number) =>
    new Intl.NumberFormat('sk-SK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);

const getImage = (item: any): string => {
    const url = item.cover?.url || item.payload?.cover?.url || '';
    if (!url) return 'https://placehold.co/160x160';
    return import.meta.dev ? url.replace(/^https:\/\/mtsport\.store/, '/mts-proxy') : url;
};
</script>

<template>
  <div class="space-y-4 animate-fade-in font-sans">

    <!-- ── Obsah košíka ── -->
    <div class="bg-white border border-gray-200">

      <!-- Header — vzor z CartHeader.vue -->
      <div class="flex items-center justify-between px-5 md:px-8 py-5 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <span class="w-1 h-5 bg-brand inline-block flex-shrink-0"></span>
          <h2 class="text-sm font-bold tracking-[0.2em] text-gray-900 uppercase font-sans">
            OBSAH KOŠÍKA ({{ cartItems.filter((i: any) => i.type === 'product').length }})
          </h2>
        </div>
      </div>

      <!-- Items — vzor z CartItem.vue -->
      <div class="divide-y divide-gray-50">
        <div
          v-for="item in productCartItems"
          :key="item.id"
          class="flex gap-4 md:gap-5 px-5 md:px-8 py-5 transition-opacity duration-300"
          :class="removingId === item.id ? 'opacity-40' : 'opacity-100'"
        >
          <!-- Image — identický s CartItem -->
          <div class="w-20 h-20 bg-gray-50 border border-gray-100 flex-shrink-0 p-1">
            <NuxtImg
              v-if="!getImage(item).includes('placehold.co')"
              :src="getImage(item)"
              :alt="item.label"
              class="w-full h-full object-contain mix-blend-multiply"
              format="webp"
              loading="lazy"
            />
            <img v-else :src="getImage(item)" :alt="item.label" class="w-full h-full object-contain opacity-40" />
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0 flex flex-col justify-between">
            <div class="flex justify-between items-start gap-2">
              <div class="min-w-0 flex-1">
                <h4 class="font-sans font-bold text-sm text-black leading-snug uppercase">
                  {{ item.label.replace(/\(VARIANT\)/gi, '').trim() }}
                </h4>
                <div v-if="item.payload?.options?.[0]" class="text-[11px] text-gray-400 font-sans mt-0.5">
                  {{ item.payload.options[0].group }}: {{ item.payload.options[0].option }}
                </div>
              </div>
              <button
                class="w-8 h-8 flex items-center justify-center bg-white border border-gray-50 text-gray-300 hover:text-red-500 hover:border-red-100 transition-all flex-shrink-0"
                :disabled="removingId === item.id"
                @click="handleRemove(item)"
                aria-label="Odstrániť z košíka"
              >
                <Loader2 v-if="removingId === item.id" class="w-4 h-4 animate-spin" />
                <Trash2 v-else class="w-4 h-4" />
              </button>
            </div>

            <!-- Quantity + Price — identický s CartItem -->
            <div class="flex justify-between items-center mt-3">
              <QuantitySelector
                size="sm"
                :model-value="item.quantity"
                :min="1"
                @update:model-value="(newVal) => updateQuantity(item, newVal - item.quantity)"
              />

              <div class="text-right">
                <div
                  v-if="item.price?.listPrice && item.price.listPrice.price > item.price.totalPrice"
                  class="text-xs text-gray-400 line-through font-tech"
                >
                  {{ formatPrice(item.price.listPrice.price) }} €
                </div>
                <div class="font-black font-tech text-sm text-black">
                  {{ formatPrice(item.price?.totalPrice ?? 0) }} €
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Promo / zľavové položky (Shopware default) -->
        <div
          v-for="promo in promoCartItems"
          :key="promo.id"
          class="flex items-center justify-between gap-3 px-5 md:px-8 py-4"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div class="flex-shrink-0 px-1.5 py-0.5 bg-brand text-white text-[9px] font-black uppercase tracking-widest">
              KÓD
            </div>
            <div class="min-w-0">
              <span class="text-xs font-bold uppercase text-gray-800 truncate block">{{ promo.label }}</span>
              <span v-if="promo.payload?.code" class="text-[10px] font-mono text-gray-400 uppercase">{{ promo.payload.code }}</span>
            </div>
          </div>
          <span class="font-black font-tech text-sm text-brand flex-shrink-0">
            {{ formatPrice(promo.price?.totalPrice || 0) }} €
          </span>
        </div>
      </div>
    </div>

    <!-- ── Expresné odoslanie — zhodný štýl s CartFooter ── -->
    <div class="bg-white border border-gray-200">
      <label class="flex items-start gap-4 cursor-pointer p-5 md:px-8 group">

        <!-- Custom checkbox — identický s CartFooter.vue -->
        <div class="relative flex items-center justify-center w-4 h-4 border border-gray-300 group-hover:border-black transition-colors bg-white flex-shrink-0 mt-0.5">
          <input
            type="checkbox"
            class="sr-only"
            :checked="isExpressShipping"
            @change="(e) => emit('update:isExpressShipping', (e.target as HTMLInputElement).checked)"
          />
          <div v-if="isExpressShipping" class="w-2.5 h-2.5 bg-black"></div>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
            <span class="text-[11px] font-bold uppercase tracking-widest font-sans text-black flex items-center gap-2">
              <Zap class="w-3.5 h-3.5 text-yellow-500 fill-current flex-shrink-0" />
              Expresné odoslanie (do 24 hodín)
            </span>
            <span class="font-tech font-black text-sm text-black flex-shrink-0 ml-3">+ {{ formatPrice(expressProduct?.calculatedPrice?.unitPrice || 12.90) }} €</span>
          </div>
          <p class="text-[11px] text-gray-400 font-sans leading-relaxed">
            Vašu objednávku vybavíme prednostne. Garantované odoslanie počas pracovných dní.
          </p>
        </div>
      </label>
    </div>

  </div>
</template>
