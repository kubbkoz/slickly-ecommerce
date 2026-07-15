<script setup lang="ts">
import { Share2, Link, Check } from 'lucide-vue-next';
import { onClickOutside } from '@vueuse/core';
import { type Product } from '~/types';

const props = defineProps<{ product: Product }>();

const isOpen = ref(false);
const copied = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
onClickOutside(dropdownRef, () => { isOpen.value = false; });

const productName = computed(() => props.product.translated?.name || props.product.name || 'SLICKLY');
const shareUrl = computed(() => (import.meta.client ? window.location.href : ''));
const shareTitle = computed(() => `${productName.value} — SLICKLY`);
const shareText = computed(() => `Pozri si tento produkt na SLICKLY: ${productName.value}`);

async function handleShare() {
  // Pokus o native Web Share API (mobile + desktop Chrome)
  if (navigator.share) {
    try {
      await navigator.share({ title: shareTitle.value, text: shareText.value, url: shareUrl.value });
      return;
    } catch { /* user cancelled */ }
  }
  // Fallback: vlastný dropdown
  isOpen.value = !isOpen.value;
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2500);
  } catch {}
}

const socials = computed(() => [
  {
    label: 'Facebook',
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.value)}`,
    color: 'bg-[#1877F2]',
  },
  {
    label: 'WhatsApp',
    href: `https://wa.me/?text=${encodeURIComponent(shareText.value + ' ' + shareUrl.value)}`,
    color: 'bg-[#25D366]',
  },
  {
    label: 'X / Twitter',
    href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl.value)}&text=${encodeURIComponent(shareText.value)}`,
    color: 'bg-black border border-gray-600',
  },
  {
    label: 'Email',
    href: `mailto:?subject=${encodeURIComponent(shareTitle.value)}&body=${encodeURIComponent(shareText.value + '\n\n' + shareUrl.value)}`,
    color: 'bg-gray-600',
  },
]);
</script>

<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="handleShare"
      class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand transition-colors group py-2"
    >
      <Share2 class="w-4 h-4 text-gray-400 group-hover:text-brand transition-colors" /> Zdieľať
    </button>

    <!-- Fallback dropdown (ak native share nie je dostupný) -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-1 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 max-w-[90vw] bg-white border border-gray-100 shadow-xl z-50 origin-top"
      >
        <div class="px-4 py-3 border-b border-gray-100">
          <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Zdieľať produkt</p>
        </div>

        <!-- URL preview -->
        <div class="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <p class="text-[10px] text-gray-400 font-sans mb-1 uppercase font-bold tracking-widest">Link na produkt</p>
          <div class="flex items-center gap-2">
            <code class="text-[11px] text-gray-700 truncate flex-1 font-mono">{{ shareUrl }}</code>
            <button
              @click="copyLink"
              class="flex-shrink-0 flex items-center gap-1 px-2 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              <Check v-if="copied" class="w-3 h-3 text-green-400" />
              <Link v-else class="w-3 h-3" />
              {{ copied ? 'OK' : 'Kopírovať' }}
            </button>
          </div>
        </div>

        <!-- Sociálne siete -->
        <div class="px-4 py-3">
          <p class="text-[9px] font-bold uppercase tracking-widest text-gray-300 mb-2">Sociálne siete</p>
          <div class="grid grid-cols-4 gap-2">
            <a
              v-for="social in socials"
              :key="social.label"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-col items-center gap-1 group"
              :aria-label="social.label"
              @click="isOpen = false"
            >
              <div :class="['w-10 h-10 flex items-center justify-center text-white text-[11px] font-black transition-all group-hover:scale-110', social.color]">
                {{ social.label.charAt(0) }}
              </div>
              <span class="text-[9px] text-gray-400 group-hover:text-brand transition-colors font-sans text-center">
                {{ social.label.split('/')[0].trim() }}
              </span>
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
