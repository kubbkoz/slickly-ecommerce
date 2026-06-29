<script setup lang="ts">
import { ShoppingCart, Check, Loader2, ArrowRight } from 'lucide-vue-next';
// @ts-ignore
import { useCart } from '@shopware/composables';
import BaseButton from '~/components/ui/BaseButton.vue';
import { useUiState } from '~/composables/useUiState';

const props = defineProps<{
  product: any;
  quantity?: number;
  selectedSize?: string;
  variant?: 'primary' | 'white' | 'outline' | 'compact';
  fullWidth?: boolean;
  showText?: boolean;
  isCloseout?: boolean;
  label?: string;
  iconRight?: boolean;
}>();

const emit = defineEmits<{
  (e: 'success'): void;
}>();

const { addProduct } = useCart();
const { toggleCartSidebar } = useUiState();
const router = useRouter();
const state = ref<'idle' | 'loading' | 'success'>('idle');
const isShakeActive = ref(false);

const triggerShake = () => {
    isShakeActive.value = true;
    setTimeout(() => {
        isShakeActive.value = false;
    }, 500);
};

const isUnselectedVariant = computed(() => props.product.hasVariants && !props.product._isVariantOverride);
const isEffectivelyCloseout = computed(() => {
    const raw = props.product?._raw || props.product;
    const closeout = props.isCloseout || raw?.isCloseout === true || props.product?.isCloseout === true;
    const stock = Number(props.product?.availableStock ?? raw?.availableStock ?? props.product?.stock ?? raw?.stock ?? 0);
    return closeout && stock <= 0;
});

const handleClick = async (e: Event) => {
    e.stopPropagation();
    
    // Block closeout items — they cannot be purchased
    if (isEffectivelyCloseout.value) return;

    if (isUnselectedVariant.value) {
        triggerShake();
        return;
    }

    if (state.value !== 'idle') return;

    const { start: resetState } = useTimeoutFn(() => {
        state.value = 'idle';
    }, 2000, { immediate: false });

    state.value = 'loading';
    try {
        // Prevent adding a parent product if no variant was effectively passed
        if (props.product.isParentProduct && !props.product._isVariantOverride) {
            console.error('SLICKLY: Cannot add a parent product to the cart without a selected variant');
            state.value = 'idle';
            return;
        }

        if (!props.product?.id || props.product.id.length < 32) {
            console.error("Cart Blocked: Invalid Product UUID during hydration state.");
            state.value = 'idle';
            return;
        }

        const cartResponse: any = await addProduct({ id: props.product.id, quantity: props.quantity || 1 });

        state.value = 'success';
        emit('success');
        
        // Brief visual feedback → open side drawer
        setTimeout(() => toggleCartSidebar(true), 350);
        resetState();
    } catch (error) {
        console.error('Add to cart failed', error);
        state.value = 'idle';
    }
};

const buttonVariant = computed(() => props.variant === 'compact' ? 'primary' : props.variant);
</script>

<template>
  <div v-if="product.hasVariants && !selectedSize && variant === 'compact'">
      <BaseButton 
         :variant="'primary'"
         :full-width="fullWidth"
         class="shadow-xl"
         @click.stop="router.push(`/product/${product.id}`)"
      >
        <ArrowRight class="w-4 h-4 mr-2" /> Detail
      </BaseButton>
  </div>

  <BaseButton
    v-else-if="isEffectivelyCloseout"
    variant="white"
    :full-width="fullWidth"
    class="!bg-gray-100 !border-gray-200 !text-gray-400 !cursor-not-allowed hover:!bg-gray-100 !opacity-100 gap-2 font-tech"
    disabled
  >
      <span v-if="showText" class="ml-2 uppercase tracking-wider text-xs font-bold">{{ $t('pdp.sold_out') }}</span>
  </BaseButton>

  <BaseButton
    v-else
    :variant="buttonVariant"
    :full-width="fullWidth"
    :class="[
        'transition-all duration-300 gap-2 font-tech',
        state === 'success' ? '!bg-green-600 !border-green-600 !text-white hover:!bg-green-700' : '',
        isUnselectedVariant ? '!bg-[#f7f9fa] !border-gray-200 !text-gray-400 !cursor-not-allowed hover:!bg-[#f7f9fa] !opacity-100' : '',
        isShakeActive ? 'animate-shake' : ''
    ]"
    @click="handleClick"
    :disabled="state !== 'idle' && !isUnselectedVariant"
  >
      <template v-if="state === 'loading'">
          <Loader2 class="w-5 h-5 animate-spin" />
          <span v-if="showText" class="ml-2">{{ $t('pdp.adding') }}</span>
      </template>
      <template v-else-if="state === 'success'">
          <Check class="w-5 h-5" />
          <span v-if="showText" class="ml-2">{{ $t('pdp.added') }}</span>
      </template>
      <template v-else>
          <ShoppingCart v-if="!isUnselectedVariant && !iconRight" :class="iconRight ? 'w-3.5 h-3.5' : 'w-5 h-5'" />
          <span v-if="showText" :class="iconRight ? '' : 'ml-2'">
            {{ isUnselectedVariant ? $t('pdp.select_size') : (label || $t('pdp.add_to_cart')) }}
          </span>
          <ShoppingCart v-if="!isUnselectedVariant && iconRight" class="w-[1rem] h-[1rem] shrink-0 [stroke-width:2]" />
      </template>
  </BaseButton>
</template>

<style scoped>
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  50% { transform: translateX(4px); }
  75% { transform: translateX(-4px); }
  100% { transform: translateX(0); }
}

.animate-shake {
  animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
}
</style>
