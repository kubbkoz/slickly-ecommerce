<script setup lang="ts">
import { ref, computed } from 'vue';
import { RotateCcw, Wrench, Loader2, Package, Plus } from 'lucide-vue-next';
// @ts-ignore
import { useUser } from '@shopware/composables';
import BaseButton from '~/components/ui/BaseButton.vue';
import ReturnFormModal from '~/components/returns/ReturnFormModal.vue';
import type { FormType } from '~/composables/useReturnForm';

const { user } = useUser();
const userEmail = computed(() => (user.value as any)?.email || '');

// Pre-fill z účtu — preferuje defaultBillingAddress, fallback shipping
const userPhone = computed(() => {
  const u: any = user.value;
  return u?.defaultBillingAddress?.phoneNumber
      || u?.defaultShippingAddress?.phoneNumber
      || '';
});

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

const userAddress = computed(() => {
  const u: any = user.value;
  return formatAddress(u?.defaultBillingAddress)
      || formatAddress(u?.defaultShippingAddress)
      || '';
});

// ── Fetch vlastné requesty ─────────────────────────────────────────────────
const { data, pending, error, refresh } = useAsyncData(
  () => `account-returns-${userEmail.value}`,
  async () => {
    if (!userEmail.value) return { total: 0, elements: [] };
    return await $fetch<any>('/api/account/returns', {
      params: { email: userEmail.value },
    });
  },
  { default: () => ({ total: 0, elements: [] }), watch: [userEmail] },
);

const requests = computed(() => data.value?.elements ?? []);
const isEmpty = computed(() => !pending.value && requests.value.length === 0);

// ── Modal state ────────────────────────────────────────────────────────────
const isModalOpen = ref(false);
const modalFormType = ref<FormType>('reklamacia');

const openModal = (type: FormType) => {
  modalFormType.value = type;
  isModalOpen.value = true;
};

const onSubmitted = async () => {
  // Refresh list after successful submission
  setTimeout(() => refresh(), 1500);
};

// ── Helpers ───────────────────────────────────────────────────────────────
const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('sk-SK', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch { return iso; }
};

const typeLabel = (t: string) => t === 'reklamacia' ? 'Reklamácia' : 'Vrátenie';
const typeClass = (t: string) => t === 'reklamacia' ? 'text-orange-700 bg-orange-50 border-orange-200' : 'text-blue-700 bg-blue-50 border-blue-200';

const statusLabel = (s: string) => {
  switch (s) {
    case 'received':   return 'Prijatá';
    case 'processing': return 'Spracováva sa';
    case 'approved':   return 'Schválená';
    case 'rejected':   return 'Zamietnutá';
    default:           return s;
  }
};
const statusClass = (s: string) => {
  switch (s) {
    case 'approved':   return 'bg-green-50 text-green-700 border border-green-200';
    case 'rejected':   return 'bg-red-50 text-red-700 border border-red-200';
    case 'processing': return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'received':
    default:           return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};
</script>

<template>
  <div class="bg-white p-8 shadow-sm animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-xl font-black uppercase tracking-wide font-tech">Reklamácie a vrátenie</h2>
      <BaseButton v-if="!isEmpty" variant="primary" size="sm" @click="openModal('reklamacia')">
        <Plus class="w-3.5 h-3.5 mr-2" /> Nová žiadosť
      </BaseButton>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="py-16 flex justify-center">
      <Loader2 class="w-8 h-8 text-gray-300 animate-spin" />
    </div>

    <!-- Empty state -->
    <div v-else-if="isEmpty" class="bg-gray-50 py-20 px-8 border border-gray-100 text-center flex flex-col items-center justify-center">
      <RotateCcw class="w-12 h-12 text-gray-300 mb-6" />
      <h3 class="text-[13px] font-bold uppercase tracking-widest text-gray-600 mb-3">Žiadne aktívne prípady</h3>
      <p class="text-gray-400 text-sm mb-8 max-w-md">Momentálne neevidujeme žiadne reklamácie ani vrátenia tovaru.</p>
      <div class="flex flex-col sm:flex-row gap-3">
        <button class="border-2 border-brand text-brand px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-brand hover:text-white transition-colors bg-white flex items-center justify-center"
                @click="openModal('vratenie')">
          <RotateCcw class="w-3.5 h-3.5 mr-2" /> Vrátenie tovaru
        </button>
        <button class="border-2 border-gray-300 text-gray-700 px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:border-brand hover:text-brand transition-colors bg-white flex items-center justify-center"
                @click="openModal('reklamacia')">
          <Wrench class="w-3.5 h-3.5 mr-2" /> Nová reklamácia
        </button>
      </div>
    </div>

    <!-- List -->
    <div v-else class="space-y-3">
      <div v-for="req in requests" :key="req.id"
           class="border border-gray-200 hover:border-brand transition-colors p-4 sm:p-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-tech text-base font-bold tracking-wider">{{ req.referenceNumber }}</span>
              <span class="text-[10px] px-2 py-0.5 uppercase tracking-wider font-tech font-bold border" :class="typeClass(req.formType)">
                {{ typeLabel(req.formType) }}
              </span>
            </div>
            <div class="text-xs text-gray-500 flex items-center gap-3 flex-wrap">
              <span class="flex items-center"><Package class="w-3 h-3 mr-1" /> Objednávka #{{ req.orderNumber }}</span>
              <span>·</span>
              <span>{{ formatDate(req.createdAt) }}</span>
            </div>
          </div>
          <div>
            <span class="text-[10px] px-3 py-1.5 uppercase tracking-wider font-tech font-bold" :class="statusClass(req.status)">
              {{ statusLabel(req.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <ReturnFormModal
      :is-open="isModalOpen"
      :initial-form-type="modalFormType"
      :initial-email="userEmail"
      :initial-first-name="(user as any)?.firstName"
      :initial-last-name="(user as any)?.lastName"
      :initial-customer-phone="userPhone"
      :initial-customer-address="userAddress"
      @close="isModalOpen = false"
      @submitted="onSubmitted"
    />
  </div>
</template>
