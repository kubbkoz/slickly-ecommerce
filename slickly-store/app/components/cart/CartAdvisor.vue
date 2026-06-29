<script setup lang="ts">
import { Sparkles, ShoppingCart, Plus, Loader2, RefreshCw, CheckCircle2 } from 'lucide-vue-next';
// @ts-ignore
import { useCart } from '@shopware/composables';

const props = defineProps<{
  cartItems: { name: string; category?: string; price?: number }[];
}>();

interface VariantOption {
  groupName: string;
  name: string;
}
interface AdvisorVariant {
  id: string;
  options: VariantOption[];
}
interface AdvisorProduct {
  id: string;
  name: string;
  label: string;
  price: number;
  listPrice: number | null;
  imageUrl: string | null;
  seoPath: string | null;
  available: boolean;
  hasVariants: boolean;
  variants: AdvisorVariant[];
}

const tip = ref('');
const products = ref<AdvisorProduct[]>([]);
const isLoading = ref(false);
const hasLoaded = ref(false);
const localePath = useLocalePath();

const { addProduct, cartItems: realCartItems } = useCart();

const addingIds = ref<Set<string>>(new Set());
const shakingIds = ref<Set<string>>(new Set());
const isAddingAll = ref(false);

const selectedVariants = ref<Record<string, string>>({});

const addedProductIds = computed(() => {
  const ids = new Set<string>();
  (realCartItems.value || []).forEach((item: any) => {
    if (item.referencedId) ids.add(item.referencedId);
    if (item.productId) ids.add(item.productId);
  });
  return ids;
});

const formatPrice = (p: number) =>
  new Intl.NumberFormat('sk-SK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(p);

const imgSrc = (url: string | null) => {
  if (!url) return null;
  return import.meta.dev ? url.replace(/^https:\/\/mtsport\.store/, '/mts-proxy') : url;
};

const getActiveVariant = (product: AdvisorProduct): AdvisorVariant | null => {
  const selId = selectedVariants.value[product.id];
  if (selId) return product.variants.find(v => v.id === selId) || null;
  return product.variants[0] || null;
};

const getAddId = (product: AdvisorProduct): string | null => {
  if (!product.hasVariants) return product.id;
  const active = getActiveVariant(product);
  return active?.id || null;
};

const getOptionGroups = (product: AdvisorProduct): Record<string, string[]> => {
  const groups: Record<string, string[]> = {};
  product.variants.forEach(v => {
    v.options.forEach(o => {
      if (!groups[o.groupName]) groups[o.groupName] = [];
      if (!groups[o.groupName].includes(o.name)) groups[o.groupName].push(o.name);
    });
  });
  return groups;
};

const selectVariantByOption = (product: AdvisorProduct, groupName: string, optionName: string) => {
  const match = product.variants.find(v =>
    v.options.some(o => o.groupName === groupName && o.name === optionName)
  );
  if (match) selectedVariants.value = { ...selectedVariants.value, [product.id]: match.id };
};

const triggerShake = (productId: string) => {
  shakingIds.value.add(productId);
  setTimeout(() => shakingIds.value.delete(productId), 500);
};

const fetchAdvice = async (force = false) => {
  if (!props.cartItems.length || isLoading.value) return;
  isLoading.value = true;
  selectedVariants.value = {};
  try {
    const claudeRes = await $fetch<{ tip: string; products: { searchQuery: string; label: string; priority?: number }[] }>(
      '/api/claude/cart-advisor',
      { 
        method: 'POST', 
        body: { 
          cartItems: props.cartItems,
          forceRefresh: force 
        } 
      }
    );

    tip.value = claudeRes.tip;

    if (!claudeRes.products?.length) return;

    const swProducts = await $fetch<AdvisorProduct[]>('/api/cart/advisor-products', {
      method: 'POST',
      body: { queries: claudeRes.products },
    });

    products.value = swProducts.filter(Boolean);
    hasLoaded.value = true;
  } catch {
    // silent
  } finally {
    isLoading.value = false;
  }
};

const handleAddOne = async (product: AdvisorProduct) => {
  const addId = getAddId(product);
  if (!addId) {
    triggerShake(product.id);
    // After 500ms we can still navigate if the user clicks again, but here we just shake
    return;
  }
  if (addingIds.value.has(addId)) return;
  addingIds.value = new Set([...addingIds.value, addId]);
  try {
    await addProduct({ id: addId, quantity: 1 });
  } catch {
    // silent
  } finally {
    const next = new Set(addingIds.value);
    next.delete(addId);
    addingIds.value = next;
  }
};

const handleAddAll = async () => {
  if (isAddingAll.value) return;
  isAddingAll.value = true;
  try {
    const toAdd = products.value.filter(p => p.available && !addedProductIds.value.has(p.id));
    
    // Find those that cannot be added automatically (require variant selection)
    toAdd.forEach(p => {
      if (getAddId(p) === null) triggerShake(p.id);
    });

    // Sequential adding to prevent race conditions in Shopware
    for (const p of toAdd) {
      const addId = getAddId(p);
      if (addId) {
        try {
          await addProduct({ id: addId, quantity: 1 });
          // Small delay to let Shopware session stabilize between requests
          await new Promise(r => setTimeout(r, 150));
        } catch (e) {
          console.error('AI Advisor: Failed to add', addId, e);
        }
      }
    }
  } catch {
    // silent
  } finally {
    isAddingAll.value = false;
  }
};

onMounted(() => {
  if (props.cartItems.length) fetchAdvice();
});
</script>

<template>
  <div v-if="cartItems.length" class="animate-fade-in">

    <!-- Header + Controls in one row -->
    <div class="flex items-end justify-between gap-4 mb-8">
      <div>
        <h2 class="text-2xl md:text-3xl font-bold uppercase italic font-tech tracking-tight text-black">
          Odporúčame <span class="text-brand">dokúpiť</span>
        </h2>
        <div class="w-16 h-1 bg-brand mt-2"></div>
      </div>

      <div v-if="hasLoaded && products.length > 0" class="flex items-center gap-4 flex-shrink-0 pb-1">
        <button
          class="flex items-center gap-1.5 text-gray-400 hover:text-brand font-sans text-[10px] font-medium uppercase tracking-widest transition-colors bg-transparent focus:outline-none"
          :disabled="isLoading"
          @click="fetchAdvice(true)"
        >
          <RefreshCw class="w-3 h-3" :class="{ 'animate-spin': isLoading }" />
          Ďalšie vhodné produkty
        </button>

        <button
          v-if="!products.every(p => addedProductIds.has(p.id))"
          :disabled="isAddingAll"
          class="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-[10px] font-medium uppercase tracking-widest hover:bg-brand transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-md gpu-boost"
          @click="handleAddAll"
        >
          <Loader2 v-if="isAddingAll" class="w-3 h-3 animate-spin" />
          <ShoppingCart v-else class="w-3 h-3" />
          Pridať všetko
        </button>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="isLoading && !hasLoaded" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div v-for="n in 5" :key="n" class="bg-white border border-gray-100 p-4">
        <div class="aspect-square bg-gray-50 animate-pulse mb-4" />
        <div class="space-y-3">
          <div class="h-3 bg-gray-100 animate-pulse w-3/4" />
          <div class="h-4 bg-gray-100 animate-pulse w-1/2" />
          <div class="h-9 bg-gray-50 animate-pulse w-full mt-4" />
        </div>
      </div>
    </div>

    <!-- Product Cards -->
    <div
      v-else-if="hasLoaded && products.length"
      class="grid grid-cols-2 gap-4"
      :class="products.length <= 3 ? 'md:grid-cols-3' : products.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-5'"
    >
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white border border-gray-100 hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex flex-col group relative gpu-boost"
        :class="{ 'animate-shake border-red-300': shakingIds.has(product.id) }"
      >
        <!-- Obrázok -->
        <NuxtLink
          :to="product.seoPath ? localePath(product.seoPath) : localePath('/')"
          class="block overflow-hidden bg-gray-50 aspect-square p-4 relative"
        >
          <NuxtImg
            v-if="imgSrc(product.imageUrl)"
            :src="imgSrc(product.imageUrl)!"
            :alt="product.name"
            format="webp"
            loading="lazy"
            class="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-200">
            <ShoppingCart class="w-10 h-10" />
          </div>
        </NuxtLink>

        <!-- Info -->
        <div class="p-4 flex flex-col flex-1 gap-2.5">
          <!-- Názov -->
          <NuxtLink
            :to="product.seoPath ? localePath(product.seoPath) : localePath('/')"
            class="text-[11px] font-bold uppercase tracking-tight text-black hover:text-brand transition-colors font-sans leading-tight line-clamp-2 h-7"
          >
            {{ product.name }}
          </NuxtLink>

          <!-- Výber variantu -->
          <div v-if="product.hasVariants && product.variants.length" class="min-h-[44px]">
            <div
              v-for="(values, groupName) in getOptionGroups(product)"
              :key="groupName"
              class="mb-2 last:mb-0"
            >
              <div class="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">{{ groupName }}</div>
              <div class="flex flex-wrap gap-1">
                <button
                  v-for="val in values"
                  :key="val"
                  class="px-1.5 py-0.5 text-[9px] font-bold border transition-all duration-200"
                  :class="
                    getActiveVariant(product)?.options.some(o => o.groupName === groupName && o.name === val)
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 text-gray-600 hover:border-black hover:text-black'
                  "
                  @click.prevent="selectVariantByOption(product, groupName, val)"
                >
                  {{ val }}
                </button>
              </div>
            </div>
          </div>
          <div v-else class="min-h-[44px] flex items-center">
             <!-- Removed Universal size label -->
          </div>

          <!-- Cena -->
          <div class="flex items-baseline gap-2 mt-auto">
            <span v-if="product.listPrice" class="text-[10px] text-gray-400 line-through font-tech">
              {{ formatPrice(product.listPrice) }} €
            </span>
            <span class="text-lg font-black font-tech text-black leading-none">
              {{ formatPrice(product.price) }} €
            </span>
          </div>

          <!-- Actions -->
          <div class="pt-2">
            <NuxtLink
              v-if="product.hasVariants && !getAddId(product)"
              :to="product.seoPath ? localePath(product.seoPath) : localePath('/')"
              class="w-full border border-black bg-black text-white flex items-center justify-center gap-2 py-2.5 text-[10px] font-medium uppercase tracking-widest transition-all duration-300 hover:bg-brand hover:border-brand shadow-sm gpu-boost"
            >
              <Plus class="w-3 h-3" /> Vybrať veľkosť
            </NuxtLink>
            
            <button
              v-else
              :disabled="!product.available || !!addingIds.has(getAddId(product) ?? '')"
              :class="addedProductIds.has(product.id) || (getAddId(product) && addedProductIds.has(getAddId(product)!))
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-black border-gray-200 hover:bg-black hover:text-white hover:border-black shadow-sm'"
              class="w-full border flex items-center justify-center gap-2 py-2.5 text-[10px] font-medium uppercase tracking-widest transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed gpu-boost"
              @click.prevent="handleAddOne(product)"
            >
              <Loader2 v-if="addingIds.has(getAddId(product) ?? '')" class="w-3 h-3 animate-spin" />
              <CheckCircle2 v-else-if="addedProductIds.has(product.id) || (getAddId(product) && addedProductIds.has(getAddId(product)!))" class="w-3 h-3" />
              <Plus v-else class="w-3 h-3" />
              {{ (addedProductIds.has(product.id) || (getAddId(product) && addedProductIds.has(getAddId(product)!))) ? 'Pridané' : 'Do košíka' }}
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>
