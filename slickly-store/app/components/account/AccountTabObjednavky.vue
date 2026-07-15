<script setup lang="ts">
import { ref } from 'vue';
import { Package, Eye, RotateCcw, ChevronRight, Loader2, Star, Truck, CreditCard, ShieldAlert, Undo2 } from 'lucide-vue-next';
// @ts-ignore
import { useCart, useShopwareContext, useUser } from '@shopware/composables';
// @ts-ignore
import { useUiState } from '~/composables/useUiState';
import BaseButton from '~/components/ui/BaseButton.vue';
import AppModal from '~/components/ui/AppModal.vue';
import BaseLink from '~/components/ui/BaseLink.vue';
import ReturnFormModal from '~/components/returns/ReturnFormModal.vue';
import type { FormType } from '~/composables/useReturnForm';
import { SW_OP } from '~/utils/shopware-api-ops';
import { useProductHelpers } from '~/composables/useProductHelpers';

defineProps<{ orders: any[] }>();

// ── Return / Complaint modal ───────────────────────────────────────────────
const isReturnModalOpen = ref(false);

const formatAddress = (addr: any): string => {
  if (!addr) return '';
  const parts: string[] = [];
  if (addr.street) parts.push(String(addr.street));
  const cityLine = [addr.zipcode, addr.city].filter(Boolean).join(' ');
  if (cityLine) parts.push(cityLine);
  if (addr.country?.name || addr.country?.translated?.name) {
    parts.push(addr.country?.translated?.name || addr.country?.name);
  }
  return parts.join('\n');
};

const returnInitialData = ref<{
  formType: FormType;
  orderNumber: string;
  orderDate?: string;
  orderId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  itemsDescription?: string;
}>({ formType: 'vratenie', orderNumber: '' });

// Vrátiť/Reklamovať dostupné len ak VŠETKY 3 stavy sú v poriadku:
//   - stav platby     = paid
//   - stav dodávky    = shipped (alebo delivered)
//   - stav objednávky = completed (= "Done" / "Doručená")
const canReturnOrder = (order: any): boolean => {
  const orderState = order?.stateMachineState?.technicalName;
  if (orderState !== 'completed') return false;

  const deliveryState = order?.deliveries?.[0]?.stateMachineState?.technicalName;
  if (deliveryState !== 'shipped' && deliveryState !== 'delivered') return false;

  // Posledná transakcia rozhoduje (refunded vždy posledná, paid pred ňou — tu chceme paid)
  const transactions = order?.transactions ?? [];
  const lastTx = transactions[transactions.length - 1];
  const paymentState = lastTx?.stateMachineState?.technicalName;
  if (paymentState !== 'paid') return false;

  return true;
};

const openReturnModal = (order: any, type: FormType) => {
  if (!canReturnOrder(order)) return;
  const items: string[] = [];
  const lineItems = order.lineItems ?? [];
  for (const li of lineItems) {
    items.push(`${li.quantity ?? 1}× ${li.label ?? ''}`);
  }

  // Priorita: 1) billing adresa z objednávky, 2) defaultBillingAddress z účtu, 3) defaultShipping
  const u: any = user.value;
  const orderBilling = (order.addresses ?? []).find((a: any) => a.id === order.billingAddressId);
  const orderShipping = order.deliveries?.[0]?.shippingOrderAddress;

  const phone = orderBilling?.phoneNumber
             || orderShipping?.phoneNumber
             || u?.defaultBillingAddress?.phoneNumber
             || u?.defaultShippingAddress?.phoneNumber
             || '';

  const address = formatAddress(orderBilling)
               || formatAddress(orderShipping)
               || formatAddress(u?.defaultBillingAddress)
               || formatAddress(u?.defaultShippingAddress)
               || '';

  returnInitialData.value = {
    formType:         type,
    orderNumber:      order.orderNumber ?? '',
    orderDate:        order.orderDateTime ? String(order.orderDateTime).substring(0, 10) : (order.orderDate ?? undefined),
    orderId:          order.id,
    email:            u?.email,
    firstName:        u?.firstName,
    lastName:         u?.lastName,
    phone,
    address,
    itemsDescription: items.join('\n'),
  };
  isReturnModalOpen.value = true;
};

const expandedOrderId = ref<string | null>(null);

function toggleOrder(id: string) {
    expandedOrderId.value = expandedOrderId.value === id ? null : id;
}

function orderStatusStyle(state: string) {
    const map: Record<string, string> = {
        open: 'bg-blue-50 text-blue-700 border border-blue-200',
        in_progress: 'bg-amber-50 text-amber-700 border border-amber-200',
        completed: 'bg-green-50 text-green-700 border border-green-200',
        cancelled: 'bg-red-50 text-red-700 border border-red-200',
    };
    return map[state] || 'bg-gray-100 text-gray-600 border border-gray-200';
}

function orderStatusLabel(state: string) {
    if (!state) return 'Spracováva sa';
    const map: Record<string, string> = {
        open: 'Otvorená',
        in_progress: 'Spracováva sa',
        completed: 'Doručená',
        cancelled: 'Zrušená',
    };
    return map[state] || state;
}

function formatProductName(name: string) {
    if (!name) return '';
    return name.replace(/\s*\(VARIANT\)\s*/gi, '').trim();
}

function getProductVariantLabel(lineItem: any) {
    if (!lineItem.payload?.options) return '';
    return lineItem.payload.options.map((o: any) => o.option).join(', ');
}

const { addProduct } = useCart();
const { toggleCartSidebar } = useUiState();
const { getProductImageUrl } = useProductHelpers();
const { user } = useUser();
const isOrderingAgain = ref<string | null>(null);
const orderAgainErrors = ref<Record<string, string>>({});

async function orderAgain(order: any) {
    if (!order.lineItems?.length) return;
    
    isOrderingAgain.value = order.id;
    orderAgainErrors.value[order.id] = '';
    
    try {
        const itemsToAdd = order.lineItems.filter((li: any) => li.type === 'product' && li.referencedId);

        if (itemsToAdd.length > 0) {
            let successCount = 0;
            for (const li of itemsToAdd) {
                try {
                    await addProduct({ id: li.referencedId, quantity: li.quantity });
                    successCount++;
                } catch (e) {
                    console.error(`Failed to add product ${li.referencedId}:`, e);
                }
            }
            if (successCount > 0) {
                toggleCartSidebar(true);
            }
            if (successCount < itemsToAdd.length) {
                 orderAgainErrors.value[order.id] = 'Niektoré produkty sa nepodarilo pridať do košíka (môžu byť vypredané).';
            }
        } else {
            orderAgainErrors.value[order.id] = 'Objednávka neobsahuje žiadne produkty, ktoré by bolo možné pridať do košíka.';
        }
    } catch (e) {
        console.error('[orderAgain] Failed to process order again:', e);
        orderAgainErrors.value[order.id] = 'Nastala chyba pri spracovaní požiadavky.';
    } finally {
        isOrderingAgain.value = null;
    }
}

// ── Review Modal ─────────────────────────────────────────────────────────────
const isReviewModalOpen = ref(false);
const reviewOrder = ref<any>(null);
const reviewData = ref<Record<string, { rating: number; text: string }>>({});
const isSubmittingReviews = ref(false);
const { apiClient } = useShopwareContext();
const toast = useState('wishlistToast', () => ({ show: false, productName: '', action: 'add' as 'add' | 'remove' }));

function openReviewModal(order: any) {
    reviewOrder.value = order;
    reviewData.value = {};
    order.lineItems?.forEach((li: any) => {
        if (li.type === 'product') {
            reviewData.value[li.id] = { rating: 0, text: '' };
        }
    });
    isReviewModalOpen.value = true;
}

function setRating(itemId: string, rating: number) {
    if (reviewData.value[itemId]) {
        reviewData.value[itemId].rating = rating;
    }
}

async function submitReviews() {
    isSubmittingReviews.value = true;
    try {
        for (const [itemId, review] of Object.entries(reviewData.value)) {
            if (review.rating > 0 || review.text) {
                const lineItem = reviewOrder.value.lineItems.find((li: any) => li.id === itemId);
                if (lineItem?.referencedId) {
                    await apiClient.invoke(SW_OP.product.saveReview(lineItem.referencedId) as any, {
                        pathParams: { productId: lineItem.referencedId },
                        body: {
                            name: user.value?.firstName || 'Zákazník',
                            email: user.value?.email || '',
                            points: review.rating || 5,
                            content: review.text || 'Bez komentára',
                            title: 'Hodnotenie k nákupu'
                        }
                    });
                }
            }
        }
        isReviewModalOpen.value = false;
        toast.value = { show: true, productName: 'Hodnotenie odoslané. Ďakujeme!', action: 'add' };
    } catch (e) {
        console.error('Failed to submit reviews', e);
        alert('Pri ukladaní hodnotenia nastala chyba. Možno ste tento produkt už ohodnotili.');
    } finally {
        isSubmittingReviews.value = false;
    }
}

function getDeliveryInfo(order: any) {
    const delivery = order.deliveries?.[0];
    if (!delivery) return null;
    return {
        method: delivery.shippingMethod?.name || 'Štandardné doručenie',
        cost: delivery.shippingCosts?.totalPrice || 0,
        state: delivery.stateMachineState?.name || 'Spracováva sa'
    };
}

function getPaymentInfo(order: any) {
    const transaction = order.transactions?.[0];
    if (!transaction) return null;
    return {
        method: transaction.paymentMethod?.name || 'Štandardná platba',
        state: transaction.stateMachineState?.name || 'Čaká na platbu'
    };
}

function resolveLineItemImage(lineItem: any) {
    if (lineItem.cover?.url) return lineItem.cover.url;
    if (lineItem.product?.cover?.media?.url) return lineItem.product.cover.media.url;
    if (lineItem.product?.media?.[0]?.media?.url) return lineItem.product.media[0].media.url;
    return null;
}
</script>

<template>
    <div class="bg-white shadow-sm p-8 animate-fade-in">
        <h2 class="text-xl font-black uppercase tracking-wide font-tech mb-8">História objednávok</h2>
        <div v-if="orders && orders.length > 0" class="space-y-6">
            <div v-for="order in orders" :key="order.id" class="border border-gray-100 bg-gray-50/30">
                <!-- Header -->
                <div class="flex flex-col md:flex-row md:items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors" @click="toggleOrder(order.id)">
                    <div class="flex items-center gap-5 mb-4 md:mb-0">
                        <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0" :class="order.stateMachineState?.technicalName === 'completed' ? 'bg-green-50' : 'bg-blue-50'">
                            <Package class="w-5 h-5" :class="order.stateMachineState?.technicalName === 'completed' ? 'text-green-500' : 'text-blue-500'" />
                        </div>
                        <div>
                            <span class="block text-lg font-black font-tech text-black mb-1">#{{ order.orderNumber }}</span>
                            <span class="flex items-center text-xs text-gray-600 font-medium">
                                <Eye class="w-3 h-3 mr-1.5 opacity-50" /> {{ new Date(order.orderDateTime).toLocaleDateString('sk-SK') }}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row items-end md:items-center gap-6">
                        <div class="text-right">
                            <div class="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Celkom</div>
                            <div class="font-black font-tech text-xl text-black">{{ order.amountTotal?.toFixed(2) || '0.00' }} €</div>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-center min-w-[120px]" :class="orderStatusStyle(order.stateMachineState?.technicalName || '')">
                                {{ orderStatusLabel(order.stateMachineState?.technicalName || '') }}
                            </span>
                            <ChevronRight class="w-5 h-5 text-gray-300 transition-transform duration-200 cursor-pointer hover:text-black" :class="expandedOrderId === order.id ? 'rotate-90' : ''" />
                        </div>
                    </div>
                </div>

                <!-- Error Banner -->
                <div v-if="orderAgainErrors[order.id]" class="px-6 py-3 text-red-600 text-sm bg-red-50 border-t border-red-100 font-medium">
                    {{ orderAgainErrors[order.id] }}
                </div>

                <!-- Expanded Details -->
                <div v-if="expandedOrderId === order.id" class="border-t border-gray-100 bg-gray-50 animate-fade-in">
                    <!-- Shipping & Payment Info -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b border-gray-200 bg-white">
                        <div>
                            <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center"><Truck class="w-3.5 h-3.5 mr-2" /> Doprava</p>
                            <template v-if="getDeliveryInfo(order)">
                                <p class="text-sm font-bold text-black">{{ getDeliveryInfo(order)?.method }}</p>
                                <p class="text-xs text-gray-500 mt-1">Stav doručenia: {{ getDeliveryInfo(order)?.state }}</p>
                                <p class="text-xs text-gray-500 mt-1">Cena: {{ getDeliveryInfo(order)?.cost?.toFixed(2) }} €</p>
                            </template>
                            <p v-else class="text-xs text-gray-500">Informácie o doprave nie sú dostupné.</p>
                        </div>
                        <div>
                            <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center"><CreditCard class="w-3.5 h-3.5 mr-2" /> Platba</p>
                            <template v-if="getPaymentInfo(order)">
                                <p class="text-sm font-bold text-black">{{ getPaymentInfo(order)?.method }}</p>
                                <p class="text-xs text-gray-500 mt-1">Stav platby: {{ getPaymentInfo(order)?.state }}</p>
                            </template>
                            <p v-else class="text-xs text-gray-500">Informácie o platbe nie sú dostupné.</p>
                        </div>
                    </div>

                    <!-- Line Items -->
                    <div class="p-6 space-y-4">
                        <h3 class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Položky objednávky</h3>
                        <div v-for="lineItem in order.lineItems" :key="lineItem.id" class="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                            <BaseLink :to="lineItem" class="flex items-center gap-4 group flex-1">
                                <div class="w-14 h-14 bg-white border border-gray-200 flex-shrink-0 flex items-center justify-center">
                                    <NuxtImg v-if="resolveLineItemImage(lineItem)" :src="resolveLineItemImage(lineItem)" :alt="lineItem.label" class="w-full h-full object-contain p-1 mix-blend-multiply" />
                                    <Package v-else class="w-5 h-5 text-gray-300" />
                                </div>
                                <div>
                                    <p class="text-sm font-bold text-black mb-1 font-tech leading-tight group-hover:text-brand transition-colors">{{ formatProductName(lineItem.label) }}</p>
                                    <p class="text-[10px] text-gray-600 font-bold uppercase flex gap-3">
                                        <span>Množstvo: {{ lineItem.quantity }}</span>
                                        <span v-if="lineItem.payload?.productNumber">SKU: {{ lineItem.payload.productNumber }}</span>
                                        <span v-if="getProductVariantLabel(lineItem)" class="text-brand">{{ getProductVariantLabel(lineItem) }}</span>
                                    </p>
                                </div>
                            </BaseLink>
                            <span class="font-black font-tech text-base text-black whitespace-nowrap ml-4">{{ lineItem.totalPrice?.toFixed(2) }} €</span>
                        </div>
                    </div>
                </div>

                <!-- Footer Actions -->
                <div class="px-6 py-4 border-t border-gray-100 bg-white flex flex-col xl:flex-row items-center gap-4 justify-between">
                    <div class="flex flex-wrap gap-2 w-full xl:w-auto justify-center xl:justify-start">
                        <BaseButton variant="white" size="sm" @click="toggleOrder(order.id)">
                            <Eye class="w-3.5 h-3.5 mr-2" /> Detail
                        </BaseButton>
                        <BaseButton 
                            variant="primary" 
                            size="sm"
                            :disabled="isOrderingAgain === order.id"
                            @click="orderAgain(order)"
                        >
                            <Loader2 v-if="isOrderingAgain === order.id" class="w-3.5 h-3.5 mr-2 animate-spin" />
                            <RotateCcw v-else class="w-3.5 h-3.5 mr-2" /> 
                            Znova
                        </BaseButton>
                    </div>
                    <div class="flex flex-wrap gap-2 w-full xl:w-auto justify-center xl:justify-end">
                        <BaseButton
                            variant="white"
                            size="sm"
                            :disabled="!canReturnOrder(order)"
                            :title="!canReturnOrder(order) ? 'Vrátenie je možné len pri doručených objednávkach' : undefined"
                            @click.stop="openReturnModal(order, 'vratenie')"
                        >
                            <Undo2 class="w-3.5 h-3.5 mr-2" /> Vrátiť
                        </BaseButton>
                        <BaseButton
                            variant="white"
                            size="sm"
                            :disabled="!canReturnOrder(order)"
                            :title="!canReturnOrder(order) ? 'Reklamácia je možná len pri doručených objednávkach' : undefined"
                            @click.stop="openReturnModal(order, 'reklamacia')"
                        >
                            <ShieldAlert class="w-3.5 h-3.5 mr-2" /> Reklamovať
                        </BaseButton>
                        <BaseButton variant="white" size="sm" class="text-yellow-600 border-yellow-200 hover:bg-yellow-50" @click="openReviewModal(order)">
                            <Star class="w-3.5 h-3.5 mr-2 fill-current" /> Ohodnotiť
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="py-16 text-center text-sm text-gray-400 bg-gray-50 border border-gray-100">
            Zatiaľ nemáte žiadne objednávky.
        </div>

        <!-- Review Modal -->
        <AppModal :is-open="isReviewModalOpen" title="Ohodnotiť produkty" @close="isReviewModalOpen = false">
            <div v-if="reviewOrder" class="p-2 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-hide pr-2">
                <div v-for="lineItem in reviewOrder.lineItems" :key="lineItem.id">
                    <template v-if="lineItem.type === 'product'">
                        <div class="flex items-center gap-4 mb-4">
                            <div class="w-16 h-16 bg-gray-50 border border-gray-200 flex-shrink-0 p-1">
                                <NuxtImg v-if="resolveLineItemImage(lineItem)" :src="resolveLineItemImage(lineItem)" :alt="lineItem.label" class="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            <div>
                                <p class="text-sm font-bold text-black font-tech leading-tight">{{ formatProductName(lineItem.label) }}</p>
                                <p class="text-xs text-gray-500 mt-1">{{ lineItem.totalPrice?.toFixed(2) }} €</p>
                            </div>
                        </div>
                        
                        <div class="bg-gray-50 p-4 border border-gray-100">
                            <div class="flex items-center gap-1 mb-4">
                                <span class="text-[10px] font-bold uppercase tracking-widest text-gray-500 mr-3">Hodnotenie:</span>
                                <button 
                                    v-for="i in 5" 
                                    :key="i"
                                    type="button"
                                    @click="setRating(lineItem.id, i)"
                                    class="p-1 focus:outline-none hover:scale-110 transition-transform"
                                >
                                    <Star 
                                        class="w-6 h-6 transition-colors" 
                                        :class="i <= (reviewData[lineItem.id]?.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'" 
                                    />
                                </button>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Vaša recenzia</label>
                                <textarea 
                                    v-model="reviewData[lineItem.id].text"
                                    rows="3" 
                                    placeholder="Ako ste spokojný s týmto produktom?"
                                    class="w-full px-4 py-3 bg-white border border-gray-200 focus:border-brand transition-all outline-none text-sm font-medium font-sans resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
            
            <div class="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
                <BaseButton variant="white" @click="isReviewModalOpen = false">Zrušiť</BaseButton>
                <BaseButton variant="primary" :disabled="isSubmittingReviews" @click="submitReviews">
                    <Loader2 v-if="isSubmittingReviews" class="w-4 h-4 mr-2 animate-spin" />
                    Odoslať hodnotenia
                </BaseButton>
            </div>
        </AppModal>

        <!-- Vrátenie / Reklamácia formulár modal — pre-filled z objednávky -->
        <ReturnFormModal
          :is-open="isReturnModalOpen"
          :initial-form-type="returnInitialData.formType"
          :initial-order-number="returnInitialData.orderNumber"
          :initial-order-date="returnInitialData.orderDate"
          :initial-order-id="returnInitialData.orderId"
          :initial-email="returnInitialData.email"
          :initial-first-name="returnInitialData.firstName"
          :initial-last-name="returnInitialData.lastName"
          :initial-customer-phone="returnInitialData.phone"
          :initial-customer-address="returnInitialData.address"
          :initial-items-description="returnInitialData.itemsDescription"
          :skip-order-lookup="true"
          @close="isReturnModalOpen = false"
        />
    </div>
</template>
