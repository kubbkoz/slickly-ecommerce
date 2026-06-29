import type { LoyaltySummary, LoyaltyTransaction, LoyaltyReward, RedeemResult } from '~/types/loyalty';

export function useLoyalty() {
  const summary = ref<LoyaltySummary | null>(null);
  const transactions = ref<LoyaltyTransaction[]>([]);
  const rewards = ref<LoyaltyReward[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchSummary = async () => {
    try {
      const res = await $fetch<LoyaltySummary | { error: string }>('/api/loyalty/summary');
      if ('error' in res) { summary.value = null; return; }
      summary.value = res;
    } catch { summary.value = null; }
  };

  const fetchTransactions = async (page = 1) => {
    try {
      const res = await $fetch<{ transactions: LoyaltyTransaction[]; total: number }>('/api/loyalty/transactions', {
        params: { page, limit: 20 },
      });
      transactions.value = res.transactions || [];
    } catch { transactions.value = []; }
  };

  const fetchRewards = async () => {
    try {
      const res = await $fetch<{ rewards: LoyaltyReward[] }>('/api/loyalty/rewards');
      rewards.value = res.rewards || [];
    } catch { rewards.value = []; }
  };

  const fetchAll = async () => {
    isLoading.value = true;
    error.value = null;
    await Promise.all([fetchSummary(), fetchTransactions(), fetchRewards()]);
    isLoading.value = false;
  };

  const redeemReward = async (rewardId: string): Promise<RedeemResult> => {
    try {
      const res = await $fetch<RedeemResult>('/api/loyalty/redeem', {
        method: 'POST',
        body: { rewardId },
      });
      if (res.success) {
        // refresh points + history
        await Promise.all([fetchSummary(), fetchTransactions(), fetchRewards()]);
      }
      return res;
    } catch (e: any) {
      return { success: false, error: e?.data?.error || 'Nepodarilo sa uplatniť odmenu.' };
    }
  };

  return { summary, transactions, rewards, isLoading, error, fetchSummary, fetchTransactions, fetchRewards, fetchAll, redeemReward };
}
