<script setup lang="ts">
import { Share2, Check } from 'lucide-vue-next';
import { type Product } from '~/types';

const props = defineProps<{ product: Product }>();

const copied = ref(false);

const productName = computed(() => props.product.translated?.name || props.product.name || 'SLICKLY');
const shareUrl = computed(() => (import.meta.client ? window.location.href : ''));
const shareTitle = computed(() => `${productName.value} — SLICKLY`);
const shareText = computed(() => `Pozri si tento produkt na SLICKLY: ${productName.value}`);

async function handleShare() {
  // Native OS share sheet (Android/iOS/desktop Chrome/Edge) — already includes
  // WhatsApp, Email, copy-link, social apps, etc. via the platform itself, so
  // there is intentionally NO custom fallback panel: only one share UI ever
  // appears, and cancelling it does nothing further.
  if (navigator.share) {
    try {
      await navigator.share({ title: shareTitle.value, text: shareText.value, url: shareUrl.value });
    } catch { /* user cancelled — nothing further to do */ }
    return;
  }
  // No Web Share API (rare desktop browsers) — silently copy the link, with a
  // brief inline confirmation on the button itself instead of a second panel.
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2500);
  } catch {}
}
</script>

<template>
  <button
    @click="handleShare"
    class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand transition-colors group py-2"
  >
    <Check v-if="copied" class="w-4 h-4 text-green-500" />
    <Share2 v-else class="w-4 h-4 text-gray-400 group-hover:text-brand transition-colors" />
    {{ copied ? 'Skopírované' : 'Zdieľať' }}
  </button>
</template>
