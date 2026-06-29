<script setup lang="ts">
import { ShoppingCart, Link, Trash2, Copy, Check, Loader2, ShoppingBag } from 'lucide-vue-next';
// @ts-ignore
import { useUser } from '@shopware/composables';
import { useShopwareContext } from '#imports';

const { user } = useUser();
const { apiClient } = useShopwareContext();
const { locale } = useI18n();

interface SavedCart {
  hash: string;
  createdAt: number;
  itemCount: number;
  items: { id: string; quantity: number }[];
}

const saves = ref<SavedCart[]>([]);
const isLoading = ref(true);
const restoringHash = ref('');
const deletingHash = ref('');
const copiedHash = ref('');

const userId = computed(() => (user.value as any)?.id);

async function loadSaves() {
  if (!userId.value) return;
  isLoading.value = true;
  try {
    // userId is no longer in the query — server reads it from the session cookie
    const res = await $fetch<SavedCart[]>('/api/cart/user-saves');
    saves.value = res;
  } catch {
    saves.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadSaves);

function cartUrl(hash: string) {
  return `${window.location.origin}/cart?share=${hash}`;
}

async function copyUrl(hash: string) {
  await navigator.clipboard.writeText(cartUrl(hash));
  copiedHash.value = hash;
  setTimeout(() => { copiedHash.value = ''; }, 2500);
}

async function restoreCart(save: SavedCart) {
  restoringHash.value = save.hash;
  try {
    await apiClient.invoke('addLineItem post /checkout/cart/line-item' as any, {
      body: {
        items: save.items.map(item => ({
          id: item.id,
          referencedId: item.id,
          quantity: item.quantity,
          type: 'product',
        })),
      },
    });
    await navigateTo('/cart');
  } catch (e) {
    console.error('[AccountTabUlozenKosik] restore failed:', e);
  } finally {
    restoringHash.value = '';
  }
}

async function deleteCart(hash: string) {
  deletingHash.value = hash;
  try {
    // userId no longer sent — server verifies ownership via session cookie
    await $fetch(`/api/cart/delete/${hash}`, { method: 'DELETE' });
    saves.value = saves.value.filter(s => s.hash !== hash);
  } catch {
    // Silent fail
  } finally {
    deletingHash.value = '';
  }
}

function formatDate(ts: number) {
  const loc = locale.value === 'cz' ? 'cs-CZ' : `${locale.value}-${locale.value.toUpperCase()}`;
  return new Date(ts).toLocaleDateString(loc, {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}
</script>

<template>
  <div class="bg-white shadow-sm p-8 animate-fade-in">
    <div class="mb-8">
      <h2 class="text-xl font-black uppercase tracking-wide font-tech">Uložené košíky</h2>
      <p class="text-sm text-gray-500 font-sans mt-1">Košíky uložené na 30 dní. Zdieľajte ich alebo obnovte neskôr.</p>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <Loader2 class="w-8 h-8 animate-spin text-brand" />
    </div>

    <!-- Empty -->
    <div v-else-if="saves.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
      <ShoppingBag class="w-16 h-16 text-gray-200 mb-4" />
      <h3 class="text-sm font-bold uppercase font-tech text-gray-400 mb-2">Zatiaľ žiadne uložené košíky</h3>
      <p class="text-sm text-gray-400 font-sans max-w-xs">
        V košíku kliknite na <strong class="text-gray-600">„Uložiť košík"</strong> a link bude dostupný tu.
      </p>
    </div>

    <!-- List -->
    <div v-else class="space-y-3">
      <div
        v-for="save in saves"
        :key="save.hash"
        class="bg-white border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center gap-4"
      >
        <!-- Icon + meta -->
        <div class="flex items-center gap-4 flex-1 min-w-0">
          <div class="w-10 h-10 bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
            <ShoppingCart class="w-5 h-5 text-gray-400" />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-bold text-black uppercase tracking-wide font-tech">
              {{ save.itemCount }} {{ save.itemCount === 1 ? 'produkt' : save.itemCount < 5 ? 'produkty' : 'produktov' }}
            </p>
            <p class="text-[11px] text-gray-400 font-sans mt-0.5">{{ formatDate(save.createdAt) }}</p>
            <!-- URL preview -->
            <div class="flex items-center gap-1.5 mt-1.5">
              <Link class="w-3 h-3 text-gray-300 flex-shrink-0" />
              <code class="text-[10px] text-gray-400 font-mono truncate max-w-[220px]">
                /cart?share={{ save.hash }}
              </code>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <!-- Copy link -->
          <button
            @click="copyUrl(save.hash)"
            class="flex items-center gap-1.5 px-3 py-2 border text-[10px] font-bold uppercase tracking-widest transition-all"
            :class="copiedHash === save.hash
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-gray-200 text-gray-500 hover:border-black hover:text-black'"
          >
            <Check v-if="copiedHash === save.hash" class="w-3.5 h-3.5" />
            <Copy v-else class="w-3.5 h-3.5" />
            {{ copiedHash === save.hash ? 'Skopírované' : 'Kopírovať' }}
          </button>

          <!-- Restore to cart -->
          <button
            @click="restoreCart(save)"
            :disabled="restoringHash === save.hash"
            class="flex items-center gap-1.5 px-3 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-brand transition-all disabled:opacity-50"
          >
            <Loader2 v-if="restoringHash === save.hash" class="w-3.5 h-3.5 animate-spin" />
            <ShoppingCart v-else class="w-3.5 h-3.5" />
            Obnoviť
          </button>

          <!-- Delete -->
          <button
            @click="deleteCart(save.hash)"
            :disabled="deletingHash === save.hash"
            class="flex items-center justify-center w-9 h-9 border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 transition-all disabled:opacity-50"
            aria-label="Odstrániť"
          >
            <Loader2 v-if="deletingHash === save.hash" class="w-3.5 h-3.5 animate-spin" />
            <Trash2 v-else class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
