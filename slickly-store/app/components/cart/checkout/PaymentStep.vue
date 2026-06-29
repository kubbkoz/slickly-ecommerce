<script setup lang="ts">
import { CreditCard, CheckCircle, Truck, MapPin, Check, Banknote, HandCoins, Smartphone, Coins } from 'lucide-vue-next';
import type { PickupPoint, ShippingAddressForm } from '~/composables/useCheckoutFlow';

const props = defineProps<{
    paymentMethod: string;
    agreedToTerms: boolean;
    isExpressShipping: boolean;
    paymentMethods: any[];
    shippingMethods: any[];
    shippingMethod: string;
    expressProduct?: any;
    dobierkaProduct?: any;
    shippingAddress: ShippingAddressForm;
    countries: { value: string; label: string; iso: string }[];
    pickupPoint: PickupPoint | null;
}>();

const emit = defineEmits<{
    (e: 'update:paymentMethod', val: string): void;
    (e: 'update:shippingMethod', val: string): void;
    (e: 'update:agreedToTerms', val: boolean): void;
    (e: 'update:isExpressShipping', val: boolean): void;
    (e: 'update:pickupPoint', val: PickupPoint | null): void;
}>();

const localePath = useLocalePath();
const { cartItems } = useCart();
const config = useRuntimeConfig();
const { parseMethod } = useShippingMetadata();
const { adjustPrice } = useCountrySelector();

// Logo URL — method.media je priamo dostupné (useShippingMetadata fetchuje s associations: { media: {} })
const getMethodLogo = (method: any): string | null => {
    const url = method.media?.url || null;
    if (!url) return null;
    if (import.meta.dev && url.startsWith('https://mtsport.store')) {
        return url.replace(/^https:\/\/mtsport\.store/, '/mts-proxy');
    }
    return url;
};

// --- Shipping Logic (Moved from DeliveryStep) ---
const BIKE_CATEGORY_IDS = computed(() => [
    config.public.shopware.ids.categories.bikes,
    config.public.shopware.ids.categories.ebikes,
].filter(Boolean) as string[]);

const hasBikeInCart = computed(() =>
    cartItems.value.some((i: any) =>
        i.payload?.categoryTree?.some((id: string) => BIKE_CATEGORY_IDS.value.includes(id)) ||
        i.payload?.categoryIds?.some((id: string) => BIKE_CATEGORY_IDS.value.includes(id))
    )
);

const productSubtotal = computed(() =>
    cartItems.value
        .filter((i: any) => i.type === 'product')
        .reduce((sum: number, i: any) => sum + (i.price?.totalPrice ?? 0), 0)
);

// --- Payment restriction logic (UUID-based) ---
const shippingIds = config.public.shopware.ids.shipping as Record<string, string>;
const paymentIds = config.public.shopware.ids.payment as Record<string, string>;

// Krajina doručenia (ISO) — určuje, ktoré dopravy sú relevantné (Toptrans CZ/PL, SK-only kuriéri)
const selectedCountryIso = computed(() => {
    const c = props.countries.find(c => c.value === props.shippingAddress.countryId);
    return (c?.iso || '').toUpperCase();
});

const SK_ONLY_SHIPPING_IDS = computed(() => [
    shippingIds.balikovo,
    shippingIds.sps,
    shippingIds.osobnyOdber,
    shippingIds.toptrans,
].filter(Boolean));

const filteredShippingMethods = computed(() => {
    if (!props.shippingMethods?.length) return [];
    const iso = selectedCountryIso.value;
    return props.shippingMethods.filter(method => {
        const name = (method.translated?.name || method.name || '').toLowerCase();
        if (hasBikeInCart.value && name.includes('balíkovo')) return false;

        if (method.id === shippingIds.toptransCz) return iso === 'CZ';
        if (method.id === shippingIds.toptransPl) return iso === 'PL';
        if (SK_ONLY_SHIPPING_IDS.value.includes(method.id)) return iso === 'SK' || !iso;

        return true;
    });
});

const getMethodPriceLabel = (method: any): { text: string; free: boolean } => {
    const meta = parseMethod(method);
    if (meta.freeThreshold !== null && productSubtotal.value >= meta.freeThreshold) {
        return { text: 'ZADARMO', free: true };
    }
    if (meta.basePrice !== null && meta.basePrice > 0) {
        return {
            text: new Intl.NumberFormat('sk-SK', { minimumFractionDigits: 2 }).format(meta.basePrice) + ' €',
            free: false,
        };
    }
    return { text: 'ZADARMO', free: true };
};

const getDisplayName = (method: any) => {
    let name = method.translated?.name || method.name || '';
    if (name.toLowerCase().includes('osobný odber')) {
        return name.split(/ v predajni/i)[0] + ' v predajni';
    }
    return name;
};

const getShippingIcon = (method: any) => {
    const name = (method.translated?.name || method.name || '').toLowerCase();
    if (name.includes('odber') || name.includes('pickup') || name.includes('personal')) return MapPin;
    return Truck;
};

const formatPrice = (price: number) =>
    new Intl.NumberFormat('sk-SK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);

const getPaymentIcon = (method: any) => {
    const name = (method.translated?.name || method.name || '').toLowerCase();
    if (name.includes('dobierka') || name.includes('cash') || name.includes('hotovos') || name.includes('platba v') || name.includes('v hotovosti')) return HandCoins;
    if (name.includes('prevod') || name.includes('transfer') || name.includes('bank')) return Banknote;
    if (name.includes('apple') || name.includes('google') || name.includes('pay')) return Smartphone;
    if (name.includes('splátk') || name.includes('quatro') || name.includes('home credit') || name.includes('splat')) return Coins;
    return CreditCard;
};

const isPersonalPickup = computed(() =>
    props.shippingMethod === shippingIds.osobnyOdber
);

const isCourierShipping = computed(() =>
    props.shippingMethod === shippingIds.sps ||
    props.shippingMethod === shippingIds.toptrans ||
    props.shippingMethod === shippingIds.toptransCz ||
    props.shippingMethod === shippingIds.toptransPl ||
    props.shippingMethod === shippingIds.balikovo
);

const isPaymentDisabled = (method: any): boolean => {
    if (isPersonalPickup.value && method.id === paymentIds.dobierka) return true;
    if (isCourierShipping.value && method.id === paymentIds.hotovost) return true;
    return false;
};

// Auto-deselect disabled payment when shipping changes
watch(() => props.shippingMethod, () => {
    if (!props.paymentMethod) return;
    const current = props.paymentMethods?.find((m: any) => m.id === props.paymentMethod);
    if (current && isPaymentDisabled(current)) {
        emit('update:paymentMethod', '');
    }
});
</script>

<template>
  <div class="space-y-4 animate-fade-in font-sans">

    <!-- ── Spôsob dopravy ── -->
    <div class="bg-white border border-gray-200">
      <div class="flex items-center gap-3 px-5 md:px-6 py-5 border-b border-gray-100 bg-white">
        <Truck class="w-4 h-4 text-gray-900" :stroke-width="1.8" />
        <h2 class="text-xs font-bold tracking-[0.2em] text-gray-900 font-sans uppercase leading-none">Spôsob dopravy</h2>
      </div>
      <div class="p-5">
        <div v-if="!shippingMethods?.length" class="space-y-3">
          <div v-for="i in 3" :key="i" class="h-[72px] bg-gray-50 border border-gray-100 animate-pulse" />
        </div>
        <div v-else class="space-y-3">
          <template v-for="method in filteredShippingMethods" :key="method.id">
          <label
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
            <div
              class="w-12 h-10 border flex items-center justify-center mr-4 flex-shrink-0 transition-colors duration-200 overflow-hidden"
              :class="shippingMethod === method.id ? 'border-brand/30 bg-brand/5' : 'border-gray-100 bg-gray-50'"
            >
              <img
                v-if="getMethodLogo(method)"
                :src="getMethodLogo(method)!"
                :alt="getDisplayName(method)"
                class="w-full h-full object-contain p-1"
              />
              <component v-else :is="getShippingIcon(method)" class="w-5 h-5" :class="shippingMethod === method.id ? 'text-brand' : 'text-gray-400'" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="block font-bold uppercase text-sm tracking-wide text-black">
                {{ getDisplayName(method) }}
              </span>
              <div class="flex flex-col gap-0.5 mt-0.5">
                <span v-if="method.deliveryTime" class="text-[10px] text-gray-500 font-medium">
                  <span class="text-gray-400">Doručenie:</span> {{ method.deliveryTime?.translated?.name || method.deliveryTime?.name }}
                </span>
                <span v-if="method.translated?.description || method.description" class="text-[11px] text-gray-400 leading-tight">
                  {{ method.translated?.description || method.description }}
                </span>
              </div>
            </div>
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
          <div
            v-if="method.id === shippingIds.balikovo && shippingMethod === method.id"
            class="pl-0 sm:pl-16"
          >
            <SpsPickupPointPicker
              :model-value="pickupPoint"
              :shipping-address="shippingAddress"
              :countries="countries"
              @update:model-value="emit('update:pickupPoint', $event)"
            />
          </div>
          </template>
        </div>
      </div>
    </div>

    <!-- ── Spôsob platby ── -->
    <div class="bg-white border border-gray-200">
      <div class="flex items-center gap-3 px-5 md:px-6 py-5 border-b border-gray-100 bg-white">
        <CreditCard class="w-4 h-4 text-gray-900" :stroke-width="1.8" />
        <h2 class="text-xs font-bold tracking-[0.2em] text-gray-900 font-sans uppercase leading-none">Spôsob platby</h2>
      </div>
      <div class="p-5">
        <div v-if="!paymentMethods?.length" class="space-y-3">
          <div v-for="i in 3" :key="i" class="h-[72px] bg-gray-50 border border-gray-100 animate-pulse" />
        </div>
        <div v-else class="space-y-3">
          <label
            v-for="method in paymentMethods"
            :key="method.id"
            class="flex items-center p-4 border-2 transition-all duration-200 gpu-boost select-none"
            :class="isPaymentDisabled(method)
              ? 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed'
              : paymentMethod === method.id
                ? 'border-brand bg-brand/[0.03] cursor-pointer'
                : 'border-gray-100 hover:border-gray-300 cursor-pointer'"
          >
            <input
              type="radio"
              name="payment-method"
              :value="method.id"
              class="sr-only"
              :checked="paymentMethod === method.id"
              :disabled="isPaymentDisabled(method)"
              @change="!isPaymentDisabled(method) && emit('update:paymentMethod', method.id)"
            />
            <div
              class="w-10 h-10 border flex items-center justify-center mr-4 flex-shrink-0 transition-colors duration-200"
              :class="paymentMethod === method.id ? 'border-brand/30 bg-brand/5' : 'border-gray-100 bg-gray-50'"
            >
              <component :is="getPaymentIcon(method)" class="w-5 h-5" :class="paymentMethod === method.id ? 'text-brand' : 'text-gray-400'" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="block font-bold uppercase text-sm tracking-wide text-black">
                {{ method.translated?.name || method.name }}
              </span>
              <span class="text-xs text-gray-400 line-clamp-1">
                {{ method.translated?.description || method.description }}
              </span>
            </div>
            <div class="flex items-center gap-3 flex-shrink-0 ml-3">
              <span
                v-if="method.id === paymentIds.dobierka && dobierkaProduct"
                class="font-black font-tech text-sm text-black"
              >
                {{ formatPrice(adjustPrice(dobierkaProduct?.calculatedPrice?.unitPrice ?? 0)) }} €
              </span>
              <CheckCircle
                class="w-5 h-5 text-brand transition-opacity duration-200"
                :class="paymentMethod === method.id ? 'opacity-100' : 'opacity-0'"
              />
            </div>
          </label>
        </div>
      </div>
    </div>

    <!-- ── Súhlas s podmienkami ── -->
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
          <BaseLink to="/ochrana-osobnych-udajov" class="underline font-bold hover:text-black transition-colors" target="_blank">osobných údajov</BaseLink>. *
        </span>
      </label>
    </div>

  </div>
</template>
