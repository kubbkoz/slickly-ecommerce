<script setup lang="ts">
import { ref, computed } from 'vue';
import { Truck, CreditCard, RotateCcw, Eye, ChevronDown, ChevronUp, Smartphone, Banknote, HandCoins, Coins, Zap, Archive, MapPin } from 'lucide-vue-next';
import { type Product } from '~/types';
import { useShippingMetadata } from '~/composables/useShippingMetadata';
import { useShopwareContext, useShopwareLanguage, useAsyncData } from '#imports';
// @ts-ignore
import { useCart } from '@shopware/composables';

const props = defineProps<{
  product?: Product;
}>();

const emit = defineEmits<{
  (e: 'openWatchdog'): void;
}>();

const openIndex = ref<number | null>(null);
const { balikovoMetadata, toptransMetadata, toptransCzMetadata, toptransPlMetadata, spsMetadata, osobnyOdberMetadata, isLoading } = useShippingMetadata();
const { cart } = useCart();
const { selectedCountryDisplay } = useCountrySelector();

// Krajina doručenia (navbar globálny výber) — určuje dostupné dopravy a free shipping
const iso = computed(() => (selectedCountryDisplay.value.iso || 'SK').toUpperCase());
const isForeign = computed(() => iso.value === 'CZ' || iso.value === 'PL');

// Use cart total as the reference price — free shipping is triggered by cart total, not single product price
const referencePrice = computed(() => {
  const cartTotal = cart.value?.price?.totalPrice ?? 0;
  const productPrice = props.product?.calculatedPrice?.unitPrice ?? 0;
  // If cart has items, use cart total; otherwise fall back to product price for "would be free" UX
  return cartTotal > 0 ? cartTotal : productPrice;
});

const toggleAccordion = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

/**
 * Requirement #3: Robustness and Fallback Logic
 * If metadata is missing or API fails, we use hardcoded defaults.
 */
const displayBalikovo = computed(() => {
  const meta = balikovoMetadata.value;
  const isHealthy = meta && meta.basePrice !== null;

  return {
    name: isHealthy ? meta.name : 'Balíkovo',
    price: isHealthy ? meta.basePrice : 2.99,
    delivery: isHealthy ? meta.deliveryTime : '1-3 dni',
    threshold: isHealthy && meta.freeThreshold !== null ? meta.freeThreshold : 299,
    logoUrl: isHealthy ? meta.logoUrl : null
  };
});

const isBalikovoFree = computed(() => referencePrice.value > displayBalikovo.value.threshold);

const displaySps = computed(() => {
  const meta = spsMetadata.value;
  const isHealthy = meta && meta.basePrice !== null;

  return {
    name: isHealthy ? meta.name : 'Kuriér SPS',
    price: isHealthy ? meta.basePrice : 3.99,
    delivery: isHealthy ? meta.deliveryTime : '1-2 dni',
    threshold: isHealthy && meta.freeThreshold !== null ? meta.freeThreshold : 299,
    logoUrl: isHealthy ? meta.logoUrl : null
  };
});

const isSpsFree = computed(() => referencePrice.value > displaySps.value.threshold);

const displayToptrans = computed(() => {
  const meta = toptransMetadata.value;
  const isHealthy = meta && meta.basePrice !== null;

  return {
    name: isHealthy ? meta.name : 'Expresný kuriér Toptrans',
    price: isHealthy ? meta.basePrice : 4.99,
    delivery: isHealthy ? meta.deliveryTime : '1-3 dni',
    threshold: isHealthy && meta.freeThreshold !== null ? meta.freeThreshold : 1999,
    logoUrl: isHealthy ? meta.logoUrl : null
  };
});

const isToptransFree = computed(() => referencePrice.value > displayToptrans.value.threshold);

const displayOsobnyOdber = computed(() => {
  const meta = osobnyOdberMetadata.value;
  const isHealthy = meta !== undefined && meta.name !== '';

  return {
    name: isHealthy ? meta.name : 'Osobný odber v predajni SLICKLY',
    price: 0, // Always 0 as requested
    delivery: isHealthy ? meta.deliveryTime : null,
    logoUrl: isHealthy ? meta.logoUrl : null
  };
});

// CZ/PL — jediná doprava (Toptrans CZ/PL), fixná cena, žiadne free shipping
const displayForeign = computed(() => {
  if (!isForeign.value) return null;
  const meta = iso.value === 'CZ' ? toptransCzMetadata.value : toptransPlMetadata.value;
  if (!meta || !meta.id) return null;
  return {
    name: meta.name || 'Kuriér Toptrans',
    price: meta.basePrice ?? null,
    delivery: meta.deliveryTime,
    logoUrl: meta.logoUrl,
  };
});

const config = useRuntimeConfig();

// ── Spôsoby platby — reálne dáta zo Shopware (žiadny mockup) ──────────────
const { apiClient } = useShopwareContext();
const { currentLanguageId } = useShopwareLanguage();
const paymentIds = config.public.shopware.ids.payment as Record<string, string>;
const dobierkaProductId = config.public.shopware.ids.products?.dobierka as string | undefined;

const { data: paymentMethodsData } = useAsyncData('pdp-payment-methods', async () => {
  try {
    const res = await apiClient.invoke('readPaymentMethod post /payment-method' as any, {
      headers: { 'sw-language-id': currentLanguageId.value },
      body: { onlyAvailable: true, associations: { media: {} } },
    });
    return (res as any)?.data?.elements || [];
  } catch (e) {
    console.error('[TrustBadges] payment-method fetch failed:', e);
    return [];
  }
}, { server: true });

// Cena dobierky = unitPrice virtuálneho produktu (UUID z .env)
const { data: dobierkaPrice } = useAsyncData('pdp-dobierka-price', async () => {
  if (!dobierkaProductId) return null;
  try {
    const res = await apiClient.invoke('readProduct post /product' as any, {
      body: {
        filter: [{ type: 'equals', field: 'id', value: dobierkaProductId }],
        includes: { product: ['id', 'calculatedPrice'] },
      },
    });
    return (res as any)?.data?.elements?.[0]?.calculatedPrice?.unitPrice ?? null;
  } catch {
    return null;
  }
}, { server: true });

const getPaymentIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('dobierka') || n.includes('cash') || n.includes('hotovos') || n.includes('v hotovosti')) return HandCoins;
  if (n.includes('prevod') || n.includes('transfer') || n.includes('bank')) return Banknote;
  if (n.includes('apple') || n.includes('google') || n.includes('pay')) return Smartphone;
  if (n.includes('splátk') || n.includes('quatro') || n.includes('home credit') || n.includes('splat')) return Coins;
  return CreditCard;
};

const paymentLines = computed(() => {
  const methods = paymentMethodsData.value || [];
  if (!methods.length) {
    // Fallback kým API nenačíta — minimálny neutrálny zoznam
    return [{ label: 'Platobné metódy', value: 'Zadarmo', icon: CreditCard }];
  }
  return methods.map((m: any) => {
    const name = m.translated?.name || m.name || '';
    const isDobierka = m.id === paymentIds?.dobierka;
    const price = isDobierka && dobierkaPrice.value ? dobierkaPrice.value : 0;
    return {
      label: name,
      value: price > 0 ? `${price.toFixed(2).replace('.', ',')} €` : 'Zadarmo',
      icon: m.media?.url ? undefined : getPaymentIcon(name),
      logoUrl: m.media?.url || undefined,
    };
  });
});

// UUIDs for Bicykle and Elektrobicykle
const BIKE_CATEGORY_IDS = [
  config.public.shopware.ids.categories.bikes,
  config.public.shopware.ids.categories.ebikes
];

// Detekcia bicykla (skryje Balíkovo + použije prah 299 €).
// POZOR: žiadna property-skupina ('veľkosť'/'zdvih') ani 'rám'/'frame' keyword —
// spôsobovali false-positive pri doplnkoch/komponentoch/oblečení s veľkostnými variantmi.
const isBike = computed(() => {
  const p: any = props.product;
  if (!p) return false;

  const bikeIds = BIKE_CATEGORY_IDS.filter(Boolean) as string[];

  // 1. Priame category ID
  if (p.categoryIds?.some((id: any) => bikeIds.includes(id))) return true;

  // 2. Ancestor path (chytí bicykle zaradené iba v podkategórii Bicyklov)
  const cats = p._raw?.categories || p.categories || [];
  if (cats.some((c: any) => bikeIds.some((bid: string) => (c.path || '').includes(bid)))) return true;

  // 3. Silné name keywords (celé bicykle, nie komponenty rámov)
  const name = (p.translated?.name || p.name || '').toLowerCase();
  return ['bicykel', 'e-bike', 'elektrobicykel', 'ebajk', 'bicycle'].some(k => name.includes(k));
});

const items = computed(() => {
  const b = displayBalikovo.value;
  const t = displayToptrans.value;
  const s = displaySps.value;
  const o = displayOsobnyOdber.value;

  let dpName: string;
  let dpBadge = '';
  let dpFooter: string | undefined;
  let contentLines: any[];

  if (isForeign.value) {
    // ── CZ/PL — jediná doprava, fixná cena, žiadne "od", žiadny free badge ──
    const f = displayForeign.value;
    const price = f?.price ?? null;
    const priceStr = price != null ? price.toFixed(2).replace('.', ',') : null;
    dpName = priceStr ? `Doprava ${priceStr} €` : 'Doprava';
    dpFooter = undefined;
    contentLines = f ? [
      {
        label: f.name,
        value: price != null ? `${price.toFixed(2).replace('.', ',')} €` : '—',
        icon: f.logoUrl ? undefined : Truck,
        logoUrl: f.logoUrl,
        description: f.delivery ? `Doručenie: ${f.delivery}` : undefined,
      },
    ] : [];
  } else {
    // ── SK — viacero kuriérov + doprava zadarmo nad prahom ──
    const sEffective = isSpsFree.value ? 0 : (s.price !== null ? s.price : 3.99);
    const tEffective = isToptransFree.value ? 0 : (t.price !== null ? t.price : 4.99);
    const bEffective = isBalikovoFree.value ? 0 : (b.price !== null ? b.price : 2.99);

    let lowestPrice = sEffective;
    if (!isBike.value) {
      lowestPrice = Math.min(lowestPrice, bEffective);
    }
    lowestPrice = Math.min(lowestPrice, tEffective);

    // Počet platených dopráv → "Doprava od X" (viac) vs "Doprava X" (jedna)
    const paidPrices = [sEffective, tEffective, ...(isBike.value ? [] : [bEffective])];
    const paidCount = paidPrices.filter(p => p > 0).length;

    const formattedPrice = lowestPrice.toFixed(2).replace('.', ',');
    const effectiveThreshold = isBike.value ? s.threshold : b.threshold;

    dpName = lowestPrice === 0
      ? 'Doprava ZADARMO'
      : (paidCount > 1 ? `Doprava od ${formattedPrice} €` : `Doprava ${formattedPrice} €`);
    dpBadge = lowestPrice === 0 ? '' : `ZADARMO NAD ${effectiveThreshold} €`;
    dpFooter = lowestPrice === 0
      ? 'Pri objednávke tohto produktu máte dopravu ZADARMO.'
      : `Pri objednávke nad ${effectiveThreshold} € máte dopravu úplne ZADARMO.`;

    contentLines = [
      {
        label: s.name,
        value: isSpsFree.value ? 'Zadarmo' : `${(s.price ?? 3.99).toFixed(2).replace('.', ',')} €`,
        icon: s.logoUrl ? undefined : Truck,
        logoUrl: s.logoUrl,
        description: s.delivery ? `Doručenie: ${s.delivery}` : undefined,
      },
      {
        label: t.name,
        value: isToptransFree.value ? 'Zadarmo' : `${(t.price ?? 4.99).toFixed(2).replace('.', ',')} €`,
        icon: t.logoUrl ? undefined : Zap,
        logoUrl: t.logoUrl,
        description: t.delivery ? `Doručenie: ${t.delivery}` : undefined,
      },
      ...(isBike.value ? [] : [
        {
          label: b.name,
          value: isBalikovoFree.value ? 'Zadarmo' : `${(b.price ?? 2.99).toFixed(2).replace('.', ',')} €`,
          icon: b.logoUrl ? undefined : Archive,
          logoUrl: b.logoUrl,
          description: b.delivery ? `Doručenie: ${b.delivery}` : undefined,
        },
      ]),
      {
        label: o.name,
        value: 'Zadarmo',
        icon: o.logoUrl ? undefined : MapPin,
        logoUrl: o.logoUrl,
        description: o.delivery ? `Pripravené: ${o.delivery}` : undefined,
      },
    ];
  }

  return [
  {
    id: 1,
    icon: Truck,
    title: dpName,
    badge: dpBadge,
    contentLines,
    footer: dpFooter,
  },
  {
    id: 2,
    icon: CreditCard,
    title: 'Platba',
    contentLines: paymentLines.value
  },
  {
    id: 3,
    icon: RotateCcw,
    title: 'Vrátenie tovaru do 60 dní',
    content: 'Nevyhovuje? Žiadny problém. Ponúkame predĺženú lehotu na vrátenie nepoužitého tovaru až na 60 dní bez udania dôvodu.'
  },
]});
</script>

<template>
  <div class="mt-8 mb-8 border-t border-gray-200">
    <div 
      v-for="(item, index) in items" 
      :key="item.id"
      class="border-b border-gray-200 md:px-0"
    >
      <button 
        @click="toggleAccordion(index)"
        :aria-label="`Toggle ${item.title}`"
        :aria-expanded="openIndex === index"
        class="w-full flex items-center justify-between py-2.5 px-2 transition-colors text-left focus:outline-none group"
      >
        <div class="flex items-center gap-4 w-full">
          <!-- Icon (Red on Hover/Active) -->
          <component 
            :is="item.icon" 
            class="w-4 h-4 transition-colors duration-200" 
            :class="openIndex === index ? 'text-brand' : 'text-black group-hover:text-brand'"
          />
          
          <!-- Title & Optional Badge Row -->
          <div class="flex items-center justify-between w-full">
            <span 
              :class="openIndex === index ? 'text-brand font-tech' : 'text-black group-hover:text-brand font-tech'"
            >
              {{ item.title }}
            </span>
            <span 
              v-if="item.badge" 
              class="bg-gray-500 text-white text-[10px] font-normal px-2 py-1 rounded-sm uppercase tracking-wider leading-tight whitespace-nowrap ml-auto mr-4"
            >
              {{ item.badge }}
            </span>
          </div>
        </div>

        <!-- Chevron (Red on Hover/Active) -->
        <ChevronDown 
          class="w-4 h-4 flex-shrink-0 ml-2 transition-all duration-300" 
          :class="[
            openIndex === index ? 'rotate-180 text-brand' : 'text-gray-400 group-hover:text-brand'
          ]"
        />
      </button>

      <!-- Expandable Content (Smoother Transition) -->
      <Transition
        enter-active-class="transition-all duration-150 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-[400px]"
        leave-active-class="transition-all duration-100 ease-in"
        leave-from-class="opacity-100 max-h-[400px]"
        leave-to-class="opacity-0 max-h-0"
      >
        <div 
          v-show="openIndex === index"
          class="overflow-hidden pb-5 px-6 md:px-10 bg-white"
        >
          <div v-if="item.contentLines" class="divide-y divide-gray-100">
             <div v-for="(line, lIndex) in item.contentLines" :key="lIndex" class="py-2.5 text-sm font-sans flex justify-between items-center group/line">
                <div class="flex items-center gap-3">
                  <img v-if="(line as any).logoUrl" :src="(line as any).logoUrl" :alt="line.label" class="w-8 h-auto object-contain max-h-6 grayscale hover:grayscale-0 transition-all duration-200" />
                  <component v-else-if="line.icon" :is="line.icon" class="w-3.5 h-3.5 text-gray-400 group-hover/line:text-black transition-colors" />
                  <div class="flex flex-col">
                    <span class="text-gray-500 group-hover/line:text-black transition-colors">{{ line.label }}</span>
                    <span v-if="(line as any).description" class="text-xs font-medium text-gray-500 leading-tight mt-0.5">{{ (line as any).description }}</span>
                  </div>
                </div>
                <span 
                  :class="line.value.toLowerCase().includes('0,00') || line.value.toLowerCase().includes('zadarmo') ? 'text-success' : 'text-black'"
                >
                  {{ line.value }}
                </span>
             </div>
             <p v-if="item.footer" class="text-xs text-gray-400 mt-4 pt-3 text-center italic">{{ item.footer }}</p>
          </div>
          <p v-else class="text-sm text-gray-600 font-sans leading-relaxed py-2">
            {{ item.content }}
          </p>
          <div v-if="item.actionLabel" class="mt-3 flex justify-center">
             <button 
               @click="emit('openWatchdog')" 
               :aria-label="item.actionLabel"
               class="text-xs font-bold text-brand uppercase hover:underline transition-colors pb-1"
             >
               {{ item.actionLabel }}
             </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>


