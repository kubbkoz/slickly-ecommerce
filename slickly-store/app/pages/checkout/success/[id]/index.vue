<script setup lang="ts">
import { CheckCircle, Package, ArrowRight, Loader2, MapPin, CreditCard, Truck, Mail, Phone, Clock, User, UserCheck } from 'lucide-vue-next';

definePageMeta({ layout: 'checkout' });

const route = useRoute();
const orderId = route.params.id as string;
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
const config = useRuntimeConfig();
const dobierkaProductId = (config.public.shopware.ids.products as any)?.dobierka as string | undefined;
const balneBikeId = (config.public.shopware.ids.products as any)?.balneBike as string | undefined;
const balneEbikeId = (config.public.shopware.ids.products as any)?.balneEbike as string | undefined;

const {
    order,
    loadOrderDetails,
    shippingAddress,
    shippingMethod,
    paymentMethod,
    subtotal,
    total,
    shippingCosts,
    status,
} = useOrderDetails(orderId);

// Nastav navbar krok na 4 — všetky 3 kroky checkoutu sú dokončené
const checkoutNavStep = useState('checkoutNavStep', () => 4);
checkoutNavStep.value = 4;

// Registration success flag — set by useCheckoutFlow after auto-login
const justRegistered = useState('checkoutJustRegistered', () => false);
onUnmounted(() => { justRegistered.value = false; });

onMounted(async () => {
    await loadOrderDetails();

    const { paymentToken } = route.query;
    if (paymentToken && order.value?.transactions?.[0]) {
        // Payment confirmation handled by provider webhook
    }
});

const formatPrice = (price: number) =>
    new Intl.NumberFormat('sk-SK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);

// Dobierka virtual line item (COD surcharge)
const dobierkaLineItem = computed(() => {
    if (!dobierkaProductId || !order.value) return null;
    return (order.value as any).lineItems?.find((li: any) => li.referencedId === dobierkaProductId) ?? null;
});
const dobierkaPrice = computed(() => (dobierkaLineItem.value?.price?.totalPrice ?? 0) as number);

const balneBikeLineItem = computed(() => {
    if (!balneBikeId || !order.value) return null;
    return (order.value as any).lineItems?.find((li: any) => li.referencedId === balneBikeId) ?? null;
});
const balneEbikeLineItem = computed(() => {
    if (!balneEbikeId || !order.value) return null;
    return (order.value as any).lineItems?.find((li: any) => li.referencedId === balneEbikeId) ?? null;
});
const balneBikePrice = computed(() => (balneBikeLineItem.value?.price?.totalPrice ?? 0) as number);
const balneEbikePrice = computed(() => (balneEbikeLineItem.value?.price?.totalPrice ?? 0) as number);

const subtotalDisplayed = computed(() => Math.max(0, (subtotal.value || 0) - dobierkaPrice.value - balneBikePrice.value - balneEbikePrice.value));
</script>

<template>
  <div class="container mx-auto px-4 lg:px-8 max-w-3xl">

    <!-- Loading -->
    <div v-if="!order" class="flex flex-col items-center justify-center py-24 gap-4">
      <Loader2 class="w-10 h-10 animate-spin text-brand" />
      <p class="text-sm text-gray-500 font-bold uppercase tracking-widest">Načítavam objednávku...</p>
    </div>

    <!-- Potvrdenie objednávky -->
    <div v-else class="space-y-4 animate-fade-in">

      <!-- Registration success banner -->
      <div v-if="justRegistered" class="flex items-start gap-3 bg-green-50 border border-green-200 px-5 py-4">
        <UserCheck class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <div class="text-sm font-bold text-green-800">Účet bol úspešne vytvorený</div>
          <div class="text-xs text-green-700 mt-0.5 font-sans">Boli ste automaticky prihlásení. Všetky vaše objednávky nájdete v sekcii Môj účet.</div>
        </div>
      </div>

      <!-- Hero banner -->
      <div class="bg-white border-t-4 border-brand shadow-sm text-center px-8 pt-12 pb-8">
        <div class="w-20 h-20 bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-6">
          <CheckCircle class="w-10 h-10 text-green-600" />
        </div>
        <h1 class="text-3xl md:text-4xl font-black font-tech uppercase tracking-wide mb-2">
          Ďakujeme za <span class="text-brand">objednávku!</span>
        </h1>
        <div class="section-decorator mx-auto mt-4 mb-6"></div>
        <p class="text-gray-500 font-sans text-sm max-w-md mx-auto">
          Potvrdenie sme odoslali na váš email. Hneď ako tovar vyexpedujeme, budeme vás informovať správou.
        </p>
      </div>

      <!-- Číslo objednávky + stav -->
      <div class="bg-white border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between p-6">
          <div>
            <div class="form-label mb-1">Číslo objednávky</div>
            <div class="text-3xl font-black font-tech text-brand">#{{ order.orderNumber }}</div>
          </div>
          <div class="text-right">
            <div class="form-label mb-1">Stav</div>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <span class="text-xs font-bold uppercase tracking-widest text-green-700">
                {{ (order as any).stateMachineState?.translated?.name || status || 'Prijatá' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Cenový súhrn -->
      <div class="bg-white border border-gray-100 shadow-sm divide-y divide-gray-50">
        <div class="flex justify-between px-6 py-3.5 text-sm font-sans text-gray-600">
          <span>Hodnota tovaru</span>
          <span class="font-bold">{{ formatPrice(subtotalDisplayed) }} €</span>
        </div>
        <div class="flex justify-between px-6 py-3.5 text-sm font-sans text-gray-600">
          <span class="flex items-center gap-2">
            <Truck class="w-4 h-4 text-gray-400" />
            {{ shippingMethod?.translated?.name || shippingMethod?.name || 'Doprava' }}
          </span>
          <span :class="shippingCosts === 0 ? 'text-green-600 font-bold' : ''">
            {{ shippingCosts === 0 ? 'ZDARMA' : `${formatPrice(shippingCosts || 0)} €` }}
          </span>
        </div>
        <div v-if="balneBikeLineItem" class="flex justify-between px-6 py-3.5 text-sm font-sans text-gray-600">
          <span>Balné bicykel <span class="text-xs text-gray-400">×{{ balneBikeLineItem.quantity }}</span></span>
          <span>{{ formatPrice(balneBikePrice) }} €</span>
        </div>
        <div v-if="balneEbikeLineItem" class="flex justify-between px-6 py-3.5 text-sm font-sans text-gray-600">
          <span>Balné elektrobicykel <span class="text-xs text-gray-400">×{{ balneEbikeLineItem.quantity }}</span></span>
          <span>{{ formatPrice(balneEbikePrice) }} €</span>
        </div>
        <div v-if="dobierkaLineItem" class="flex justify-between px-6 py-3.5 text-sm font-sans text-gray-600">
          <span class="flex items-center gap-2">
            <CreditCard class="w-4 h-4 text-gray-400" />
            Dobierka
          </span>
          <span>{{ formatPrice(dobierkaPrice) }} €</span>
        </div>
        <div class="flex justify-between px-6 py-4 font-black">
          <span class="font-tech uppercase tracking-wide text-sm">Celkom</span>
          <span class="font-tech text-2xl text-brand">{{ formatPrice(total || 0) }} €</span>
        </div>
      </div>

      <!-- Detaily doručenia + platba -->
      <div v-if="shippingAddress" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-white border border-gray-100 shadow-sm p-5">
          <div class="flex items-center gap-2 form-label mb-3">
            <MapPin class="w-3.5 h-3.5 text-brand" /> Adresa doručenia
          </div>
          <div class="text-sm font-sans text-gray-700 leading-loose">
            <div class="font-bold">{{ shippingAddress.firstName }} {{ shippingAddress.lastName }}</div>
            <div>{{ shippingAddress.street }}</div>
            <div>{{ shippingAddress.zipcode }} {{ shippingAddress.city }}</div>
          </div>
        </div>

        <div class="bg-white border border-gray-100 shadow-sm p-5">
          <div class="flex items-center gap-2 form-label mb-3">
            <CreditCard class="w-3.5 h-3.5 text-brand" /> Spôsob platby
          </div>
          <div class="text-sm font-bold uppercase tracking-wide text-gray-700 mt-2">
            {{ paymentMethod?.translated?.name || paymentMethod?.name || '—' }}
          </div>
          <div class="mt-4 pt-3 border-t border-gray-100">
            <div class="flex items-center gap-2 form-label mb-1">
              <Package class="w-3.5 h-3.5" /> Odhadovaná expedícia
            </div>
            <div class="text-sm font-bold text-gray-700">1–3 pracovné dni</div>
          </div>
        </div>
      </div>

      <!-- Info kontakt -->
      <div class="bg-gray-50 border border-gray-100 p-5 flex flex-col sm:flex-row gap-4 text-sm font-sans text-gray-600">
        <div class="flex items-center gap-2">
          <Mail class="w-4 h-4 text-brand flex-shrink-0" />
          Potvrdenie sme odoslali na váš email
        </div>
        <div class="flex items-center gap-2">
          <Phone class="w-4 h-4 text-brand flex-shrink-0" />
          <span>Zákaznícka linka: <a href="tel:+421918564238" class="font-bold text-black hover:text-brand transition-colors">+421 918 564 238</a></span>
        </div>
      </div>

      <!-- Quick actions — objednávky + tracking -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <NuxtLink
          :to="formatLink('/account')"
          class="flex items-center gap-4 p-5 bg-white border border-gray-100 shadow-sm hover:border-brand/30 transition-all group"
        >
          <div class="w-10 h-10 bg-brand/5 border border-brand/20 flex items-center justify-center flex-shrink-0">
            <User class="w-5 h-5 text-brand" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-brand transition-colors">Prehľad objednávok</div>
            <div class="text-sm font-black uppercase text-black mt-0.5 font-tech">Môj účet</div>
          </div>
          <ArrowRight class="w-4 h-4 text-gray-300 group-hover:text-brand transition-colors flex-shrink-0" />
        </NuxtLink>

        <div class="flex items-center gap-4 p-5 bg-white border border-gray-100 shadow-sm">
          <div class="w-10 h-10 bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
            <Truck class="w-5 h-5 text-gray-400" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sledovanie zásielky</div>
            <div class="text-sm text-gray-500 font-sans mt-0.5">Po expedícii pošleme tracking link emailom</div>
          </div>
        </div>
      </div>

      <!-- Čo sa stane ďalej — timeline -->
      <div class="bg-white border border-gray-100 shadow-sm p-6">
        <div class="flex items-center gap-2 form-label mb-5">
          <Clock class="w-3.5 h-3.5 text-brand" /> Čo sa stane ďalej?
        </div>
        <div class="relative">
          <div class="absolute left-3.5 top-8 bottom-4 w-px bg-gray-100 z-0"></div>
          <div class="space-y-5">
            <div class="flex gap-4 relative z-10">
              <div class="flex-shrink-0 w-7 h-7 bg-brand text-white flex items-center justify-center text-[10px] font-black">✓</div>
              <div class="pt-0.5">
                <div class="text-sm font-black uppercase tracking-wide text-black font-tech">Objednávka prijatá</div>
                <div class="text-xs text-gray-400 mt-0.5 font-sans">Potvrdenie sme odoslali na váš email</div>
              </div>
            </div>
            <div class="flex gap-4 relative z-10">
              <div class="flex-shrink-0 w-7 h-7 bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-black text-gray-500">2</div>
              <div class="pt-0.5">
                <div class="text-sm font-black uppercase tracking-wide text-black font-tech">Spracovanie a príprava</div>
                <div class="text-xs text-gray-400 mt-0.5 font-sans">Do 1 pracovného dňa</div>
              </div>
            </div>
            <div class="flex gap-4 relative z-10">
              <div class="flex-shrink-0 w-7 h-7 bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-black text-gray-500">3</div>
              <div class="pt-0.5">
                <div class="text-sm font-black uppercase tracking-wide text-black font-tech">Expedícia — dostanete tracking link</div>
                <div class="text-xs text-gray-400 mt-0.5 font-sans">1–3 pracovné dni, sledovanie emailom</div>
              </div>
            </div>
            <div class="flex gap-4 relative z-10">
              <div class="flex-shrink-0 w-7 h-7 bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-black text-gray-500">4</div>
              <div class="pt-0.5">
                <div class="text-sm font-black uppercase tracking-wide text-black font-tech">Doručenie ku vám domov</div>
                <div class="text-xs text-gray-400 mt-0.5 font-sans">Kuriér vás kontaktuje pred doručením</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 pb-6">
        <NuxtLink
          :to="formatLink('/account')"
          class="flex items-center justify-center gap-2 border-2 border-black text-black font-black uppercase tracking-wide text-sm px-6 py-4 hover:bg-black hover:text-white transition-all duration-200 font-tech"
        >
          <User class="w-4 h-4" /> Moje objednávky
        </NuxtLink>
        <NuxtLink
          :to="formatLink('/')"
          class="btn-checkout flex items-center justify-center gap-2"
        >
          Pokračovať v nákupe <ArrowRight class="w-5 h-5" />
        </NuxtLink>
      </div>

    </div>
  </div>
</template>
