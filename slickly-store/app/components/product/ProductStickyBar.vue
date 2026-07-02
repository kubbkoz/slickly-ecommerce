<script setup lang="ts">
import { ShoppingCart, Minus, Plus, ChevronDown } from 'lucide-vue-next';
import type { Product } from '~/types';
import AddToCartButton from '~/components/ui/AddToCartButton.vue';

// Unified price format (eliminates "19.99" vs "19,99" mismatch between main + sticky)
const { getFormattedPrice } = usePrice();

const props = defineProps<{
  product: Product;
  visible: boolean;
  selectedSize?: string;
  quantity?: number;
}>();

const emit = defineEmits<{
  'update:quantity': [n: number];
}>();

const isMobileVariantPanelOpen = useState('mobileVariantPanelOpen', () => false);

const sanitizedProductName = computed(() => props.product.name?.replace(/\s*\(Variant\)$/i, '') || '');

const hasVariants = computed(() => (props.product?.childCount ?? 0) > 0 || (props.product?.children?.length ?? 0) > 0);
const isUnselectedVariant = computed(() =>
  hasVariants.value && !props.product?._isVariantOverride && (!props.selectedSize || props.selectedSize === '')
);

const { adjustPrice } = useCountrySelector();
const unitPrice = computed(() => adjustPrice(props.product.calculatedPrice?.unitPrice ?? props.product.price ?? 0));
const listPrice = computed(() => {
  const p = props.product.calculatedPrice?.listPrice?.price ?? null;
  return p != null ? adjustPrice(p) : null;
});
const discountPct = computed(() => {
  if (!listPrice.value || listPrice.value <= unitPrice.value) return null;
  return Math.round((1 - unitPrice.value / listPrice.value) * 100);
});

// Quantity stepper — bidirectional sync with parent via v-model:quantity
const localQty = computed({
  get: () => Math.max(1, props.quantity ?? 1),
  set: (val: number) => emit('update:quantity', Math.max(1, val)),
});
const decQty = () => { if (localQty.value > 1) localQty.value = localQty.value - 1; };
const incQty = () => { localQty.value = localQty.value + 1; };

// Scroll to variant selector — center in viewport. Use double-RAF to wait for any
// sticky-column layout shift after click before scrolling target.
const scrollToVariantSelector = () => {
  const el = document.getElementById('pdp-variant-selector');
  if (!el) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
};

// Mobile variant button — open bottom sheet AND scroll variant selector into view simultaneously
const openMobileVariantPanel = () => {
  isMobileVariantPanelOpen.value = true;
  scrollToVariantSelector();
};

const isMounted = ref(false);
onMounted(() => { isMounted.value = true; });
</script>

<template>
  <div>
    <!-- Desktop sticky product bar -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div
        v-if="visible"
        class="hidden lg:block fixed inset-x-0 bottom-0 z-50 bg-white border-t border-gray-200 shadow-[0_-10px_30px_rgba(0,0,0,0.15)]"
        role="complementary"
        aria-label="Rýchle pridanie do košíka"
      >
        <div class="container mx-auto px-4 lg:px-8 py-3 pb-safe flex items-center gap-6">
          <!-- Thumbnail -->
          <NuxtImg
            v-if="product.image"
            :src="product.image"
            :alt="product.name"
            class="w-14 h-14 object-contain mix-blend-multiply flex-shrink-0"
            format="webp"
            loading="lazy"
          />

          <!-- Name + Price -->
          <div class="flex-1 min-w-0">
            <p class="font-sans font-semibold text-sm leading-tight text-black truncate mb-1">
              {{ sanitizedProductName }}
            </p>
            <div class="flex items-center gap-3">
              <span class="text-brand font-bold font-tech text-lg leading-none">
                {{ getFormattedPrice(unitPrice) }}
              </span>
              <span v-if="listPrice" class="text-gray-400 line-through text-sm font-tech">
                {{ getFormattedPrice(listPrice) }}
              </span>
              <span v-if="discountPct" class="px-2 py-0.5 text-xs font-bold text-black bg-amber">
                -{{ discountPct }}%
              </span>
            </div>
          </div>

          <!-- Quantity + CTA -->
          <div class="flex items-center gap-3 flex-shrink-0">
            <!-- Quantity stepper -->
            <div class="flex items-center border border-gray-200 h-12">
              <button
                class="w-10 h-full flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                @click="decQty"
                aria-label="Znížiť množstvo"
              >
                <Minus class="w-4 h-4" />
              </button>
              <span class="w-8 text-center font-bold font-tech text-sm select-none">{{ localQty }}</span>
              <button
                class="w-10 h-full flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                @click="incQty"
                aria-label="Zvýšiť množstvo"
              >
                <Plus class="w-4 h-4" />
              </button>
            </div>

            <!-- Desktop: scroll to variant selector if unselected, otherwise add to cart -->
            <button
              v-if="isUnselectedVariant"
              class="h-12 px-8 whitespace-nowrap bg-brand text-white font-bold font-tech text-sm tracking-widest uppercase flex items-center gap-3 transition-opacity hover:opacity-90"
              @click="scrollToVariantSelector"
            >
              <ShoppingCart class="w-6 h-6" />
              PRIDAŤ DO KOŠÍKA
            </button>
            <AddToCartButton
              v-else
              :product="product"
              :quantity="localQty"
              :selectedSize="selectedSize || ''"
              :showText="true"
              class="h-12 px-8 whitespace-nowrap text-sm font-bold tracking-widest uppercase [&_svg]:w-6 [&_svg]:h-6"
            />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Mobile Persistent Bottom CTA (always visible, fixed at bottom) -->
    <ClientOnly>
      <div
        v-if="isMounted"
        class="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] pb-safe"
      >
        <div class="flex gap-2 px-4 pt-3 pb-2 h-[64px]">
          <button
            v-if="isUnselectedVariant"
            class="flex-1 h-full bg-brand text-white font-bold font-tech text-[11px] tracking-widest uppercase flex items-center justify-center gap-1.5 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
            @click="openMobileVariantPanel"
            aria-label="Otvoriť výber veľkosti"
          >
            <ShoppingCart class="w-4 h-4" /> VYBRAŤ VEĽKOSŤ
            <ChevronDown class="w-3.5 h-3.5 animate-bounce" aria-hidden="true" />
          </button>
          <AddToCartButton
            v-else
            :product="product"
            :quantity="localQty"
            :selectedSize="selectedSize || ''"
            :showText="true"
            class="flex-1 h-full text-[11px] rounded-default font-bold uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
          />
        </div>
      </div>
    </ClientOnly>
  </div>
</template>
