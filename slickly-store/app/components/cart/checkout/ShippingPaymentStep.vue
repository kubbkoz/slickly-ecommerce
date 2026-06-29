<script setup lang="ts">
import { Truck, CreditCard, MapPin, Loader2, CheckCircle } from 'lucide-vue-next';

const props = defineProps<{
    shippingMethod: string;
    paymentMethod: string;
    agreedToTerms: boolean;
    shippingMethods: any[];
    paymentMethods: any[];
}>();

const emit = defineEmits<{
    (e: 'update:shippingMethod', val: string): void;
    (e: 'update:paymentMethod', val: string): void;
    (e: 'update:agreedToTerms', val: boolean): void;
}>();

const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

const getMethodPriceLabel = (method: any): { text: string; free: boolean } => {
    if (!method.prices?.length) return { text: 'ZDARMA', free: true };
    const paid = method.prices.find((p: any) => (p.currencyPrice?.[0]?.gross ?? 0) > 0);
    if (!paid) return { text: 'ZDARMA', free: true };
    const gross = paid.currencyPrice[0].gross as number;
    return {
        text: new Intl.NumberFormat('sk-SK', { minimumFractionDigits: 2 }).format(gross) + ' €',
        free: false,
    };
};

const getShippingIcon = (method: any) => {
    const name = (method.translated?.name || method.name || '').toLowerCase();
    if (name.includes('odber') || name.includes('pickup') || name.includes('personal')) return MapPin;
    return Truck;
};
</script>

<template>
  <div class="space-y-6 animate-fade-in font-sans">

    <!-- ── Doprava ── -->
    <div class="bg-white border border-gray-200">
      <div class="flex items-center gap-3 px-5 md:px-6 py-5 border-b border-gray-100">
        <span class="w-1 h-5 bg-brand inline-block flex-shrink-0"></span>
        <h2 class="text-sm font-bold tracking-[0.2em] text-gray-900 uppercase font-sans">Spôsob dopravy</h2>
      </div>

      <div class="p-5">
        <!-- Loading skeleton -->
        <div v-if="!shippingMethods?.length" class="space-y-3">
          <div v-for="i in 3" :key="i" class="h-[72px] bg-gray-50 border border-gray-100 animate-pulse" />
        </div>

        <div v-else class="space-y-3">
          <label
            v-for="method in shippingMethods"
            :key="method.id"
            class="flex items-center p-4 border-2 cursor-pointer transition-all duration-200 gpu-boost select-none"
            :class="shippingMethod === method.id
              ? 'border-brand bg-brand/[0.03]'
              : 'border-gray-100 hover:border-gray-300'"
          >
            <input
              type="radio"
              name="shipping-method"
              :value="method.id"
              class="sr-only"
              :checked="shippingMethod === method.id"
              @change="emit('update:shippingMethod', method.id)"
            />
            <!-- Icon -->
            <div
              class="w-10 h-10 border flex items-center justify-center mr-4 flex-shrink-0 transition-colors duration-200"
              :class="shippingMethod === method.id ? 'border-brand/30 bg-brand/5' : 'border-gray-100 bg-gray-50'"
            >
              <component :is="getShippingIcon(method)" class="w-5 h-5" :class="shippingMethod === method.id ? 'text-brand' : 'text-gray-400'" />
            </div>
            <!-- Label -->
            <div class="flex-1 min-w-0">
              <span class="block font-bold uppercase text-sm tracking-wide text-black">
                {{ method.translated?.name || method.name }}
              </span>
              <span class="text-xs text-gray-400">
                {{ method.deliveryTime?.translated?.name || method.deliveryTime?.name }}
              </span>
            </div>
            <!-- Price + check -->
            <div class="flex items-center gap-3 flex-shrink-0 ml-3">
              <span
                class="font-black font-tech text-sm"
                :class="getMethodPriceLabel(method).free ? 'text-green-600' : 'text-black'"
              >
                {{ getMethodPriceLabel(method).text }}
              </span>
              <CheckCircle
                class="w-5 h-5 text-brand transition-opacity duration-200"
                :class="shippingMethod === method.id ? 'opacity-100' : 'opacity-0'"
              />
            </div>
          </label>
        </div>
      </div>
    </div>

    <!-- ── Platba ── -->
    <div class="bg-white border border-gray-200">
      <div class="flex items-center gap-3 px-5 md:px-6 py-5 border-b border-gray-100">
        <span class="w-1 h-5 bg-brand inline-block flex-shrink-0"></span>
        <h2 class="text-sm font-bold tracking-[0.2em] text-gray-900 uppercase font-sans">Spôsob platby</h2>
      </div>

      <div class="p-5">
        <!-- Loading skeleton -->
        <div v-if="!paymentMethods?.length" class="space-y-3">
          <div v-for="i in 3" :key="i" class="h-[72px] bg-gray-50 border border-gray-100 animate-pulse" />
        </div>

        <div v-else class="space-y-3">
          <label
            v-for="method in paymentMethods"
            :key="method.id"
            class="flex items-center p-4 border-2 cursor-pointer transition-all duration-200 gpu-boost select-none"
            :class="paymentMethod === method.id
              ? 'border-brand bg-brand/[0.03]'
              : 'border-gray-100 hover:border-gray-300'"
          >
            <input
              type="radio"
              name="payment-method"
              :value="method.id"
              class="sr-only"
              :checked="paymentMethod === method.id"
              @change="emit('update:paymentMethod', method.id)"
            />
            <!-- Icon -->
            <div
              class="w-10 h-10 border flex items-center justify-center mr-4 flex-shrink-0 transition-colors duration-200"
              :class="paymentMethod === method.id ? 'border-brand/30 bg-brand/5' : 'border-gray-100 bg-gray-50'"
            >
              <CreditCard class="w-5 h-5" :class="paymentMethod === method.id ? 'text-brand' : 'text-gray-400'" />
            </div>
            <!-- Label -->
            <div class="flex-1 min-w-0">
              <span class="block font-bold uppercase text-sm tracking-wide text-black">
                {{ method.translated?.name || method.name }}
              </span>
              <span class="text-xs text-gray-400 line-clamp-1">
                {{ method.translated?.description || method.description }}
              </span>
            </div>
            <!-- Check -->
            <CheckCircle
              class="w-5 h-5 text-brand flex-shrink-0 ml-3 transition-opacity duration-200"
              :class="paymentMethod === method.id ? 'opacity-100' : 'opacity-0'"
            />
          </label>
        </div>
      </div>
    </div>

    <!-- ── Súhlas s podmienkami — custom checkbox ── -->
    <div class="bg-white border border-gray-200 px-5 md:px-8 py-6">
      <label class="flex items-start gap-3 cursor-pointer group">
        <div class="relative flex items-center justify-center w-4 h-4 border border-gray-300 group-hover:border-black transition-colors bg-white flex-shrink-0 mt-0.5">
          <input
            type="checkbox"
            class="sr-only"
            :checked="agreedToTerms"
            @change="(e) => emit('update:agreedToTerms', (e.target as HTMLInputElement).checked)"
          />
          <div v-if="agreedToTerms" class="w-2.5 h-2.5 bg-black"></div>
        </div>
        <span class="text-[11px] text-gray-600 font-sans leading-relaxed">
          Súhlasím s
          <BaseLink to="/obchodne-podmienky" class="underline font-bold hover:text-black transition-colors" target="_blank">obchodnými podmienkami</BaseLink> a so spracovaním 
          <BaseLink to="/ochrana-osobnych-udajov" class="underline font-bold hover:text-black transition-colors" target="_blank">osobných údajov</BaseLink>.
        </span>
      </label>
    </div>
  </div>
</template>

