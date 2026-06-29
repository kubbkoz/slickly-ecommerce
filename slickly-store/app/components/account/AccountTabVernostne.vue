<script setup lang="ts">
import { Gift, ShoppingBag, UserPlus, Star, MessageSquare, Loader2, Copy, Check, Tag, Truck, Percent } from 'lucide-vue-next';
import { useLoyalty } from '~/composables/useLoyalty';
import type { LoyaltyReward } from '~/types/loyalty';

const { summary, transactions, rewards, fetchAll, redeemReward } = useLoyalty();

const isLoading = ref(true);
onMounted(async () => {
  await fetchAll();
  isLoading.value = false;
});

// ── Redeem modal ──
const redeemModalOpen = ref(false);
const redeemingId = ref<string | null>(null);
const redeemedCode = ref<{ code: string; expiresAt: string; pointsSpent: number } | null>(null);
const redeemError = ref('');
const copied = ref(false);

const onRedeem = async (reward: LoyaltyReward) => {
  if (!reward.canRedeem || redeemingId.value) return;
  redeemingId.value = reward.id;
  redeemError.value = '';
  const res = await redeemReward(reward.id);
  redeemingId.value = null;
  if (res.success && res.code) {
    redeemedCode.value = { code: res.code, expiresAt: res.expiresAt || '', pointsSpent: res.pointsSpent || 0 };
    redeemModalOpen.value = true;
  } else {
    redeemError.value = res.error || 'Nepodarilo sa uplatniť odmenu.';
  }
};

const copyCode = () => {
  if (!redeemedCode.value) return;
  navigator.clipboard.writeText(redeemedCode.value.code).catch(() => {});
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 3000);
};

// ── Helpers ──
const formatPoints = (n: number) => new Intl.NumberFormat('sk-SK').format(n);
const formatDate = (iso: string) => iso ? new Date(iso).toLocaleDateString('sk-SK', { day: 'numeric', month: 'numeric', year: 'numeric' }) : '';
const formatExpiry = (iso: string) => iso ? new Date(iso).toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

const txIcon = (type: string) => {
  switch (type) {
    case 'purchase': return ShoppingBag;
    case 'registration': return UserPlus;
    case 'review': return Star;
    case 'redemption': return Tag;
    default: return Gift;
  }
};

const rewardIcon = (type: string) => {
  switch (type) {
    case 'free_shipping': return Truck;
    case 'gift': return Gift;
    default: return Percent;
  }
};

const isFoil = computed(() => summary.value?.colorType === 'gradient' || summary.value?.levelColor === 'foil');
const levelStyle = computed(() => {
  if (isFoil.value) return {};
  return { backgroundColor: summary.value?.levelColor || '#94A3B8' };
});
</script>

<template>
  <div class="bg-white shadow-sm p-8 animate-fade-in">
    <!-- Loading -->
    <div v-if="isLoading" class="space-y-6">
      <div class="h-40 bg-gray-100 animate-pulse"></div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="h-24 bg-gray-100 animate-pulse"></div>
      </div>
    </div>

    <template v-else-if="summary">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 class="text-xl font-black uppercase tracking-wide font-tech">Vernostný program</h2>
          <p class="text-sm text-gray-500 font-sans mt-1">Zbierajte body a vymeňte ich za zľavy.</p>
        </div>
        <div class="text-right">
          <span class="block text-[10px] uppercase tracking-widest text-gray-400 font-sans">Aktuálny stav</span>
          <span class="text-3xl font-black font-tech text-brand">{{ formatPoints(summary.availablePoints) }} b</span>
        </div>
      </div>

      <!-- Hero card: level + progress -->
      <div class="relative p-6 md:p-8 text-white overflow-hidden mb-10" :class="isFoil ? 'foil-gradient' : 'bg-black'" :style="levelStyle">
        <Gift class="absolute top-5 right-5 w-24 h-24 opacity-[0.07] pointer-events-none" />
        <div class="relative z-10">
          <span class="text-[10px] uppercase tracking-[0.2em] opacity-70 font-sans">Úroveň</span>
          <h3 class="text-2xl font-black font-tech uppercase mb-4">{{ summary.levelName }}</h3>

          <template v-if="summary.nextLevel">
            <div class="flex items-center justify-between text-xs font-tech mb-2">
              <span>{{ formatPoints(summary.availablePoints) }} b</span>
              <span class="opacity-70">{{ formatPoints(summary.nextLevelMinPoints || 0) }} b</span>
            </div>
            <div class="h-2 w-full bg-white/20 overflow-hidden">
              <div class="h-full bg-white transition-all duration-700" :style="{ width: summary.progressPercent + '%' }"></div>
            </div>
            <p class="text-sm font-sans mt-3 opacity-90">
              Chýba vám <strong>{{ formatPoints(summary.pointsToNextLevel || 0) }} b</strong> do úrovne <strong>{{ summary.nextLevelName }}</strong>
            </p>
          </template>
          <p v-else class="text-sm font-sans opacity-90">Dosiahli ste najvyššiu úroveň.</p>
        </div>
      </div>

      <!-- Ako zbierať body -->
      <h3 class="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4 font-sans">Ako zbierať body</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <div class="border border-gray-100 p-4 text-center">
          <ShoppingBag class="w-5 h-5 mx-auto mb-2 text-brand" />
          <p class="text-[11px] font-bold uppercase font-tech">Nákup</p>
          <p class="text-[10px] text-gray-500 font-sans mt-0.5">hodnota / 10</p>
        </div>
        <div class="border border-gray-100 p-4 text-center">
          <UserPlus class="w-5 h-5 mx-auto mb-2 text-brand" />
          <p class="text-[11px] font-bold uppercase font-tech">Registrácia</p>
          <p class="text-[10px] text-gray-500 font-sans mt-0.5">+10 b</p>
        </div>
        <div class="border border-gray-100 p-4 text-center">
          <Star class="w-5 h-5 mx-auto mb-2 text-brand" />
          <p class="text-[11px] font-bold uppercase font-tech">Prvá recenzia</p>
          <p class="text-[10px] text-gray-500 font-sans mt-0.5">+50 b</p>
        </div>
        <div class="border border-gray-100 p-4 text-center">
          <MessageSquare class="w-5 h-5 mx-auto mb-2 text-brand" />
          <p class="text-[11px] font-bold uppercase font-tech">Ďalšie recenzie</p>
          <p class="text-[10px] text-gray-500 font-sans mt-0.5">+20 b</p>
        </div>
      </div>

      <!-- Dostupné odmeny -->
      <template v-if="rewards.length">
        <h3 class="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4 font-sans">Dostupné odmeny</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          <div v-for="reward in rewards" :key="reward.id" class="border border-gray-200 p-5 flex flex-col">
            <component :is="rewardIcon(reward.type)" class="w-6 h-6 text-brand mb-3" />
            <p class="font-bold text-sm uppercase font-tech leading-tight mb-1">{{ reward.name }}</p>
            <p v-if="reward.description" class="text-xs text-gray-500 font-sans mb-3 flex-1">{{ reward.description }}</p>
            <p class="text-[10px] text-gray-400 font-sans mb-3">Platnosť: {{ reward.validDays }} dní</p>
            <div class="mt-auto">
              <p class="font-black font-tech text-lg mb-2">{{ formatPoints(reward.pointsRequired) }} b</p>
              <button
                @click="onRedeem(reward)"
                :disabled="!reward.canRedeem || redeemingId === reward.id"
                class="w-full py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                :class="reward.canRedeem ? 'bg-brand text-white hover:bg-brand-dark' : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
              >
                <Loader2 v-if="redeemingId === reward.id" class="w-3.5 h-3.5 animate-spin" />
                {{ reward.canRedeem ? 'Generovať kód' : 'Málo bodov' }}
              </button>
            </div>
          </div>
        </div>
        <p v-if="redeemError" class="text-sm text-red-500 mb-6">{{ redeemError }}</p>
      </template>

      <!-- História bodov -->
      <h3 class="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4 font-sans">História bodov</h3>
      <div v-if="transactions.length" class="space-y-3 mb-10">
        <div v-for="tx in transactions" :key="tx.id" class="flex items-center justify-between pb-3 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <component :is="txIcon(tx.type)" class="w-4 h-4 text-gray-400" />
            <div>
              <span class="text-sm font-medium text-gray-700 font-sans block">{{ tx.description }}</span>
              <span class="text-[10px] text-gray-400 font-sans">{{ formatDate(tx.createdAt) }}</span>
            </div>
          </div>
          <span class="font-bold font-tech text-sm" :class="tx.points >= 0 ? 'text-green-600' : 'text-brand'">
            {{ tx.points >= 0 ? '+' : '' }}{{ formatPoints(tx.points) }} b
          </span>
        </div>
      </div>
      <p v-else class="text-sm text-gray-400 font-sans mb-10">Zatiaľ žiadna aktivita.</p>

      <!-- Prehľad úrovní -->
      <h3 class="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4 font-sans">Prehľad úrovní</h3>
      <div class="space-y-2">
        <div
          v-for="lvl in summary.levels"
          :key="lvl.level"
          class="flex items-center justify-between p-3 border transition-colors"
          :class="lvl.level === summary.level ? 'border-brand bg-brand/5' : 'border-gray-100'"
        >
          <div class="flex items-center gap-3">
            <span class="w-3 h-3 rounded-full flex-shrink-0" :class="lvl.colorType === 'gradient' ? 'foil-gradient' : ''" :style="lvl.colorType !== 'gradient' ? { backgroundColor: lvl.color } : {}"></span>
            <span class="text-sm font-bold uppercase font-tech" :class="lvl.level === summary.level ? 'text-brand' : 'text-gray-700'">{{ lvl.name }}</span>
          </div>
          <span class="text-xs text-gray-500 font-sans">od {{ formatPoints(lvl.minPoints) }} b</span>
        </div>
      </div>
    </template>

    <!-- Not logged in / no data -->
    <div v-else class="text-center py-12">
      <Gift class="w-12 h-12 text-gray-200 mx-auto mb-4" />
      <p class="text-gray-400 font-sans text-sm">Vernostný program nie je momentálne dostupný.</p>
    </div>

    <!-- Redeem code modal -->
    <AppModal :is-open="redeemModalOpen" title="Kód vygenerovaný" @close="redeemModalOpen = false">
      <div v-if="redeemedCode" class="text-center py-4">
        <div class="w-16 h-16 bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-6">
          <Check class="w-8 h-8 text-green-600" />
        </div>
        <p class="text-sm text-gray-500 font-sans mb-4">Váš zľavový kód je pripravený. Použite ho pri pokladni.</p>
        <div class="flex items-center justify-center gap-2 mb-4">
          <span class="text-2xl font-black font-tech tracking-wider bg-gray-100 px-6 py-3">{{ redeemedCode.code }}</span>
          <button @click="copyCode" class="w-12 h-12 flex items-center justify-center bg-black text-white hover:bg-brand transition-colors">
            <Check v-if="copied" class="w-5 h-5" />
            <Copy v-else class="w-5 h-5" />
          </button>
        </div>
        <p class="text-xs text-gray-500 font-sans">Platnosť do: <strong>{{ formatExpiry(redeemedCode.expiresAt) }}</strong></p>
        <p class="text-xs text-gray-500 font-sans">Odčítané: <strong class="text-brand">−{{ formatPoints(redeemedCode.pointsSpent) }} b</strong></p>
        <button @click="redeemModalOpen = false" class="mt-6 px-8 py-3 bg-black text-white font-tech font-bold uppercase tracking-widest text-sm hover:bg-brand transition-colors">Zavrieť</button>
      </div>
    </AppModal>
  </div>
</template>

<style scoped>
.foil-gradient {
  background: linear-gradient(135deg, #FFD700 0%, #FF6B35 25%, #A855F7 50%, #3B82F6 75%, #22C55E 100%);
  background-size: 400% 400%;
  animation: foilShift 4s ease infinite;
}
@keyframes foilShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>
