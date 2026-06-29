<script setup lang="ts">
/**
 * VariantSelector.vue
 * Reads configuratorSettings from the Shopware product to render grouped option buttons.
 * On selection, replaces only the last URL segment (product ID) with the chosen variant ID.
 *
 * Group UUIDs are managed via runtimeConfig.public.shopware.ids.properties.
 */

import { computed } from 'vue';
import { useRoute, useRouter, useI18n } from '#imports';
import { useProductHelpers } from '~/composables/useProductHelpers';

const props = defineProps<{
  product: any;
  selectedVariantId?: string | null;
  activeId?: string | null;
  hideInfo?: boolean;
}>();

const { getVariantLabel } = useProductHelpers();

const emit = defineEmits<{
  (e: 'variantSelected', payload: { optionId: string; groupId: string }): void;
}>();

const router = useRouter();
const route  = useRoute();
const { t } = useI18n();

// ─── Computed: group options from configuratorSettings ───────────────────────
// configuratorSettings[] = { optionId, option: { id, name, groupId, group: { id, name } } }
const variantGroups = computed(() => {
  // Collect all groups 
  const groupMap = new Map<string, { id: string; name: string; options: any[] }>();
  const settings: any[] = props.product?.configuratorSettings || []; 
  
  if (settings.length > 0) {
    for (const cs of settings) {
      const option = cs.option;
      if (!option) continue;
      const groupId = option.groupId || option.group?.id || 'default_group';

      const groupName = option.group?.translated?.name || option.group?.name || 'Veľkosť';
      if (!groupMap.has(groupId)) {
        groupMap.set(groupId, { id: groupId, name: groupName, options: [] });
      }
      
      // Nájdenie reálneho fyzického variantu (dieťaťa)
      // ROOT CAUSE FIX: Shopware API may return `options` (objects) but NOT `optionIds` (array of UUIDs)
      // for children in nested associations. We must match on BOTH to be reliable.
      const currentRaw = props.product?._raw || props.product;
      let childVariant = props.product?.children?.find((child: any) =>
        // Primary: match via optionIds (UUID array)
        child.optionIds?.includes(option.id) ||
        // Fallback: match via options association (option objects)
        child.options?.some((o: any) => o.id === option.id)
      );
      
      // Fallback: Ak sme na zvolenom variante (vlastnom produkte), info o ňom je v props.product/_raw
      const currentOptionIds = currentRaw?.optionIds || props.product?.optionIds || [];
      const currentOptions = currentRaw?.options || props.product?.options || [];
      if (!childVariant && (
        currentOptionIds.includes(option.id) ||
        currentOptions.some((o: any) => o.id === option.id)
      )) {
        childVariant = currentRaw;
      }

      // Fallback: adaptedProduct.variants (z FrontendDetailPage adaptéra)
      // Note: variants don't have optionIds, so match by id via childVariant
      
      // ─── STOCK STATUS RESOLUTION (Triple-Match Redundancy) ────────────────
      // Layer 1: Pre-computed variants array from FrontendDetailPage adapter
      //          (Matches by option.id within the variant's optionIds array)
      const preComputedVariant = props.product?.variants?.find((v: any) => 
        v.optionIds?.includes(option.id)
      );

      let realStockStatus: 'in_stock' | 'on_order' | 'unavailable' = 'on_order';
      let stockValue = 0;
      let restockTime = 0;

      if (preComputedVariant) {
        // Source found in pre-computed adapter data
        realStockStatus = preComputedVariant.stockStatus as 'in_stock' | 'on_order' | 'unavailable';
        stockValue = preComputedVariant.stockCount ?? 0;
      } else if (childVariant) {
        // Source found in raw children data
        stockValue = childVariant.availableStock ?? childVariant.stock ?? 0;
        restockTime = childVariant.restockTime ?? 0;
        // isCloseout may be null on child when inherited from parent (Shopware inheritance)
        const childIsCloseout = (childVariant.isCloseout ?? props.product?.isCloseout) === true;
        if (stockValue > 0) {
          realStockStatus = 'in_stock';
        } else if (childIsCloseout) {
          realStockStatus = 'unavailable';
        } else {
          realStockStatus = 'on_order';
        }
      }
      // Layer 3: default 'on_order' already set at declaration

      groupMap.get(groupId)!.options.push({
        id:          option.id,
        groupId:     groupId,
        name:        option.translated?.name || option.name || '',
        stockStatus: realStockStatus,
        stock:       stockValue,
        restockTime: restockTime
      });
    }
  }

  // Sort options numerically within each group
  const groups = Array.from(groupMap.values());
  for (const g of groups) {
    g.options.sort((a, b) => {
      const numA = parseFloat(a.name.match(/\d+(\.\d+)?/)?.[0] || '0');
      const numB = parseFloat(b.name.match(/\d+(\.\d+)?/)?.[0] || '0');
      if (numA && numB && numA !== numB) return numA - numB;
      return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    });
  }
  return groups;
});

// ─── ZISTENIE AKTÍVNEHO STAVU ───────────────────────────────────────────────
const isActive = (option: any) => {
  const raw = props.product?._raw || props.product;
  const optionIds = raw?.optionIds || props.product?.optionIds || [];
  
  if (Array.isArray(optionIds)) {
    return optionIds.includes(option.id);
  }
  
  // Fallback: Ak sme na rodičovi, ale máme URL query alebo lokálny state
  return String(props.activeId).toLowerCase() === String(option.id).toLowerCase();
};

const selectVariant = (option: any) => {
  if (!option || option.stockStatus === 'unavailable') return;
  
  // Zistenie groupId pre správne nahradenie vo finálnom dopyte
  const groupId = option.groupId || props.product.configuratorSettings?.find((cs: any) => cs.option?.id === option.id)?.option?.groupId;
  
  // Emitujeme optionId aj groupId ako objekt
  emit('variantSelected', { optionId: option.id, groupId: groupId });
};

// Funkcia na rozdelenie reťazca podľa zátvorky (pre dizajn veľkostí)
const formatOptionLabel = (name: string) => {
  const index = name.indexOf('(');
  if (index === -1) return { top: name, bottom: '' };
  
  return {
    top: name.substring(0, index).trim(),
    bottom: name.substring(index).trim()
  };
};
// ─── INFO O ZVOLENOM VARIANTE (SKU, EAN, SKLAD) ─────────────────────────────
const activeVariantInfo = computed(() => {
  const raw = props.product?._raw || props.product;
  if (!raw) return null;

  // Ak je to rodič, ktorý má deti, ale žiadne dieťa nie je zvolené, nezobrazujeme nič
  const isParentWithChildren = !raw.parentId && (raw.childCount > 0 || raw.children?.length > 0);
  if (isParentWithChildren) return null;

  const stock = raw.availableStock ?? raw.stock ?? 0;
  const isAvailable = stock > 0;

  return {
    sku: raw.productNumber,
    ean: raw.ean,
    stock: stock,
    restockTime: raw.restockTime ?? 0,
    isAvailable: isAvailable,
    isCloseout: raw.isCloseout
  };
});
</script>

<template>
  <div class="mb-6">
    <template v-if="variantGroups.length">
      <div v-for="group in variantGroups" :key="group.id" class="mb-4">
      <!-- Group label -->
      <p class="text-xs font-bold uppercase tracking-widest text-[#111] font-sans mb-3">
        {{ group.name.toLowerCase().includes('rám') || group.name.toLowerCase().includes('frame') || group.name.toLowerCase().includes('size') ? (group.name.toLowerCase().includes('rám') || group.name.toLowerCase().includes('frame') ? $t('pdp.size_frame') : $t('pdp.size_general')) : group.name }}
      </p>

      <!-- Option buttons (Grid 4 columns, Rectangle) -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          v-for="option in group.options"
          :key="option.id"
          :disabled="option.stockStatus === 'unavailable'"
          @click="selectVariant(option)"
          class="relative w-full h-20 md:h-22 flex flex-col items-center justify-center
                 transition-all duration-150 border-2 overflow-hidden
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset rounded-none p-2"
          :class="[
            option.stockStatus === 'unavailable'
              ? 'bg-gray-50 text-gray-300 border-gray-100 pointer-events-none'
              : isActive(option)
                ? (option.stockStatus === 'in_stock' ? 'bg-white text-black border-success' : 'bg-white text-black border-amber-400')
                : 'bg-white text-black border-gray-200 hover:border-black cursor-pointer',
          ]"
        >
          <!-- Strikethrough line for unavailable -->
          <span
            v-if="option.stockStatus === 'unavailable'"
            class="absolute inset-x-0 top-1/2 h-px bg-gray-300 -rotate-12 z-10"
            aria-hidden="true"
          />
          
          <!-- Label Wrapper with Conditional Padding for centering -->
          <div :class="[isActive(option) ? 'pb-5' : '']" class="flex flex-col items-center justify-center transition-all duration-200">
            <template v-if="formatOptionLabel(option.name).top">
              <span class="font-black text-sm md:text-base leading-tight uppercase font-tech text-center">
                {{ formatOptionLabel(option.name).top }}
              </span>
              <span v-if="formatOptionLabel(option.name).bottom" class="text-[10px] md:text-[11px] font-medium leading-tight opacity-70 text-center mt-0.5">
                {{ formatOptionLabel(option.name).bottom }}
              </span>
            </template>
            <template v-else>
               <span class="font-bold text-sm md:text-base text-center">{{ option.name }}</span>
            </template>
          </div>

          <!-- Sticky Stock Badge (Only for Active) -->
          <div 
             v-if="isActive(option)"
             class="absolute bottom-0 left-0 right-0 h-6 flex items-center justify-center text-[9px] md:text-[10px] font-bold uppercase tracking-tight text-white leading-none px-1 py-0.5"
             :class="[
               option.stockStatus === 'in_stock' ? 'bg-success' : (option.stockStatus === 'on_order' ? 'bg-amber-400' : 'bg-brand')
             ]"
          >
            <template v-if="option.stockStatus === 'in_stock'">
               {{ $t('availability_inStock') }} {{ option.stock >= 3 ? '> 3ks' : `${option.stock}ks` }}
            </template>
            <template v-else-if="option.stockStatus === 'on_order'">
               {{ $t('availability_restockTime', { days: option.restockTime || 4 }) }}
            </template>
            <template v-else>
               {{ $t('availability_soldOut') }}
            </template>
          </div>
        </button>
      </div>
     </div>
    </template>

    <!-- ─── SIMPLE PRODUCT STOCK BADGE ───────────────────────────── -->
    <template v-else-if="activeVariantInfo">
      <div class="mb-4">
        <div
          class="inline-flex items-center justify-center border-2 pointer-events-none"
          :class="[
            activeVariantInfo.isAvailable ? 'border-success' : (activeVariantInfo.isCloseout ? 'border-gray-100' : 'border-amber-400')
          ]"
        >
          <div 
             class="flex items-center justify-center text-[10px] md:text-[11px] font-bold uppercase tracking-tight text-white h-7 px-4 min-w-[120px]"
             :class="[
               activeVariantInfo.isAvailable ? 'bg-success' : (activeVariantInfo.isCloseout ? 'bg-brand' : 'bg-amber-400')
             ]"
          >
            <template v-if="activeVariantInfo.isAvailable">
               {{ $t('availability_inStock') }} {{ activeVariantInfo.stock >= 3 ? '> 3ks' : `${activeVariantInfo.stock}ks` }}
            </template>
            <template v-else-if="!activeVariantInfo.isCloseout">
               {{ $t('availability_restockTime', { days: activeVariantInfo.restockTime || 4 }) }}
            </template>
            <template v-else>
               {{ $t('availability_soldOut') }}
            </template>
          </div>
        </div>
      </div>
    </template>

    <!-- ─── COMPACT INFO LINE (SKU & EAN) ───────────────────────────── -->
       <div v-if="activeVariantInfo && !hideInfo" class="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 animate-fade-in">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-widest text-black font-sans">SKU:</span>
            <span class="text-sm font-medium text-gray-600 font-sans">{{ activeVariantInfo.sku }}</span>
          </div>
          <div v-if="activeVariantInfo.ean" class="flex items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-widest text-black font-sans">EAN:</span>
            <span class="text-sm font-medium text-gray-600 font-sans">{{ activeVariantInfo.ean }}</span>
          </div>
       </div>
  </div>
</template>
