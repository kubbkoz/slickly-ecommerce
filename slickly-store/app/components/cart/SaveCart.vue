<script setup lang="ts">
import { Bookmark, Check, Loader2, Lock } from 'lucide-vue-next';
// @ts-ignore
import { useUser, useCart } from '@shopware/composables';

const { isLoggedIn, user } = useUser();
const { cartItems } = useCart();
const isLoginModalOpen = useState('loginModalOpen', () => false);

const isSaving = ref(false);
const savedHash = ref('');
const copied = ref(false);
const error = ref('');

const savedUrl = computed(() => {
  if (!savedHash.value || !import.meta.client) return '';
  return `${window.location.origin}/cart?share=${savedHash.value}`;
});

const userId = computed(() => (user.value as any)?.id);

// Po monte: ak je user prihlásený, načítaj jeho posledný uložený košík
onMounted(async () => {
  if (!isLoggedIn.value || !userId.value) return;
  try {
    // Server reads userId from session cookie — no userId in query
    const saves = await $fetch<{ hash: string; createdAt: number }[]>('/api/cart/user-saves');
    if (saves?.length) {
      // Zobraziť posledný uložený hash
      savedHash.value = saves[0].hash;
    }
  } catch { /* Silent — neblokuje UI */ }
});

async function handleSave() {
  if (!isLoggedIn.value) {
    isLoginModalOpen.value = true;
    return;
  }
  await doSave();
}

async function doSave() {
  isSaving.value = true;
  error.value = '';
  try {
    const items = (cartItems.value || [])
      .filter((i: any) => i.type === 'product')
      .map((i: any) => ({ id: i.referencedId, quantity: i.quantity }));

    if (!items.length) { error.value = 'Košík je prázdny'; return; }

    // userId not sent — server verifies from session cookie
    const res = await $fetch<{ hash: string }>('/api/cart/save', {
      method: 'POST',
      body: { items },
    });

    if (res.hash) savedHash.value = res.hash;
  } catch {
    error.value = 'Chyba pri ukladaní';
  } finally {
    isSaving.value = false;
  }
}

async function copyUrl() {
  try {
    await navigator.clipboard.writeText(savedUrl.value);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2500);
  } catch {}
}

// Re-save keď user klikne znova (aktualizácia)
async function handleResave() {
  savedHash.value = '';
  await doSave();
}
</script>

<template>
  <div>
    <!-- Nie je uložené: tlačidlo Uložiť -->
    <button
      v-if="!savedHash"
      @click="handleSave"
      :disabled="isSaving"
      class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-colors focus:outline-none disabled:opacity-50 group bg-transparent border-0 p-0"
      :class="isLoggedIn ? 'text-gray-500 hover:text-brand' : 'text-gray-400 hover:text-gray-600'"
      :title="isLoggedIn ? 'Uložiť košík na 30 dní' : 'Vyžaduje prihlásenie'"
    >
      <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin text-brand" />
      <Lock v-else-if="!isLoggedIn" class="w-4 h-4" />
      <Bookmark v-else class="w-4 h-4 group-hover:fill-brand transition-all" />
      <span class="hidden sm:block">Uložiť košík</span>
    </button>

    <!-- Je uložené: zobraziť stav + link -->
    <div v-else class="flex items-center gap-2 group">
      <Check class="w-4 h-4 text-green-600 flex-shrink-0" />
      <button
        @click="copyUrl"
        class="text-[11px] font-bold uppercase tracking-widest transition-colors focus:outline-none"
        :class="copied ? 'text-green-600' : 'text-gray-500 hover:text-brand'"
        :title="savedUrl"
      >
        {{ copied ? 'Skopírované!' : 'Uložené' }}
      </button>
      <!-- Aktualizovať uloženie -->
      <button
        @click="handleResave"
        class="text-[9px] text-gray-300 hover:text-gray-500 transition-colors focus:outline-none ml-1 hidden group-hover:block"
        title="Uložiť znovu (aktualizovať)"
      >
        ↺
      </button>
    </div>

    <p v-if="error" class="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1">{{ error }}</p>
  </div>
</template>
