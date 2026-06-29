<script setup lang="ts">
import { RefreshCcw, AlertTriangle, MessageSquare } from 'lucide-vue-next';
const contact = useAppConfig().contact;

/**
 * BackendErrorState.vue — Aero Maintenance UI
 * ──────────────────────────────────────────
 * Stylizovaný "Partial Maintenance" komponent pre ošetrenie 500 chýb (Elasticsearch).
 * Zabezpečuje, aby e-shop nepôsobil rozbite, ale profesionálne "v údržbe".
 */

interface Props {
  title?: string;
  message?: string;
  retryAction?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'REŽIM ÚDRŽBY SYSTÉMU',
  message: 'Naše vyhľadávacie servery momentálne prechádzajú optimalizáciou. Ostatné časti webu sú plne funkčné.',
});

const emit = defineEmits(['retry']);

const handleRetry = () => {
  emit('retry');
  if (props.retryAction) props.retryAction();
};
</script>

<template>
  <div class="relative w-full py-16 md:py-24 bg-gray-50 overflow-hidden border border-gray-100 group">
    <!-- MTShape background elements -->
    <div class="absolute -right-10 -bottom-10 w-64 h-64 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity duration-700">
      <img src="~/assets/MTShape.svg" alt="" class="w-full h-full object-contain" />
    </div>

    <!-- Tech Corners -->
    <div class="tech-corner-tl group-hover:scale-125 transition-transform"></div>
    <div class="tech-corner-br group-hover:scale-125 transition-transform"></div>

    <div class="container mx-auto px-4 flex flex-col items-center text-center relative z-10">
      <!-- Animated Icon -->
      <div class="mb-8 relative">
        <div class="absolute inset-0 bg-brand/10 blur-3xl rounded-full scale-150 animate-pulse-slow"></div>
        <div class="w-20 h-20 bg-white border border-gray-100 flex items-center justify-center relative shadow-xl transform rotate-3">
          <AlertTriangle class="w-10 h-10 text-brand" :stroke-width="1.5" />
        </div>
      </div>

      <!-- Title & Text -->
      <h3 class="text-3xl md:text-4xl font-black italic uppercase font-tech tracking-wider text-gray-900 mb-6 underline decoration-brand/30 decoration-8 underline-offset-4">
        {{ title }}
      </h3>
      
      <p class="max-w-xl text-gray-500 font-sans text-sm md:text-base leading-relaxed mb-10 px-4">
        {{ message }}
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center justify-center gap-4">
        <button 
          @click="handleRetry"
          class="btn-tab-active flex items-center gap-3 group/retry"
        >
          <RefreshCcw class="w-4 h-4 group-hover/retry:rotate-180 transition-transform duration-500" />
          <span>SKÚSIŤ ZNOVA</span>
        </button>

        <a
          :href="contact.phone.mainHref"
          class="btn-secondary h-[42px] px-6 flex items-center gap-3 border border-gray-200"
        >
          <MessageSquare class="w-4 h-4" />
          <span>PODPORA</span>
        </a>
      </div>

      <!-- Tech decoration -->
      <div class="mt-12 flex items-center gap-2">
        <div class="w-1 h-1 bg-brand animate-ping"></div>
        <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">System Monitoring Active</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tech-corner-tl { @apply absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand/50 m-4; }
.tech-corner-br { @apply absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand/50 m-4; }

.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.1; transform: scale(1.5); }
  50% { opacity: 0.3; transform: scale(2); }
}
</style>
