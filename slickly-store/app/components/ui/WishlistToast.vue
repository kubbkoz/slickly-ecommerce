<script setup lang="ts">
import { Heart, X } from 'lucide-vue-next';
import { useState, ref, watch } from '#imports';

const toast = useState('wishlistToast', () => ({ show: false, productName: '', action: 'add' as 'add' | 'remove' }));
const visible = ref(false);
let timer: any = null;

const close = () => {
  visible.value = false;
  // Wait for transition to finish before resetting the global state
  setTimeout(() => {
    toast.value.show = false;
  }, 500);
};

watch(() => toast.value.show, (newVal) => {
  if (newVal) {
    visible.value = true;
    if (timer) clearTimeout(timer);
    timer = setTimeout(close, 4000);
  } else {
    visible.value = false;
  }
});
</script>

<template>
  <ClientOnly>
    <Transition name="toast">
      <div 
        v-if="visible" 
        class="fixed bottom-28 right-6 z-[100] flex items-center gap-4 bg-black text-white p-4 pr-12 border-l-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] font-sans min-w-[320px] transition-all duration-300"
        :class="toast.action === 'remove' ? 'border-gray-500 opacity-90' : 'border-brand'"
      >
        <div class="flex-shrink-0 w-12 h-12 bg-[#111] flex items-center justify-center border border-white/5">
          <Heart 
            class="w-6 h-6 transition-all duration-500" 
            :class="[
              toast.action === 'remove' ? 'text-gray-500 fill-none' : 'text-brand fill-brand animate-heartbeat'
            ]"
          />
        </div>
        <div class="flex flex-col">
          <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Obľúbené</span>
          <p class="text-sm font-bold leading-tight tracking-tight max-w-[200px] truncate">
            {{ toast.productName }}
          </p>
          <p class="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
            {{ toast.action === 'remove' ? 'Bol odstránený z wishlistu' : 'Bol pridaný do wishlistu' }}
          </p>
        </div>
        <button 
          @click="close" 
          class="absolute top-3 right-3 text-gray-600 hover:text-white transition-colors"
          aria-label="Zatvoriť"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </Transition>
  </ClientOnly>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from {
  transform: translateX(110%) scale(0.9);
  opacity: 0;
}
.toast-leave-to {
  transform: translateX(110%) scale(0.95);
  opacity: 0;
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  15% { transform: scale(1.25); }
  30% { transform: scale(1); }
  45% { transform: scale(1.25); }
  70% { transform: scale(1); }
}
.animate-heartbeat {
  animation: heartbeat 1.5s ease-in-out infinite;
}
</style>
