<script setup lang="ts">
import { HomeIcon, ArrowLeft } from 'lucide-vue-next';

const props = defineProps<{
  error: {
    statusCode: number;
    statusMessage?: string;
    message?: string;
    url?: string;
  };
}>();

const route = useRoute();
const is404 = computed(() => props.error?.statusCode === 404);

// Surface the REAL error so the intermittent first-load 500 becomes diagnosable.
// Previously this page hardcoded a "page not found" message for EVERY status —
// including 500 — which hid what actually threw during SSR. Now:
//   - server-side: the full error is logged to stdout (→ HostCreators logs)
//   - client: shown on-screen only when ?debug=1 (same pattern as app.vue's
//     backendError banner), so a cold-load 500 can be screenshotted with cause.
if (import.meta.server && props.error?.statusCode >= 500) {
  console.error(
    '[SLICKLY][error.vue] SSR error rendered:',
    props.error?.statusCode,
    props.error?.statusMessage || props.error?.message,
    '| url:', (props.error as any)?.url || route.fullPath,
  );
}
const showDebug = computed(() => route.query.debug !== undefined);

const handleError = () => clearError({ redirect: '/' });
</script>

<template>
  <NuxtLayout name="default">
    <section class="min-h-[70vh] flex items-center justify-center bg-white py-24">
      <div class="container mx-auto px-4 lg:px-8 text-center">

        <!-- 404 číslo -->
        <div class="relative mb-8 select-none">
          <span class="text-[180px] md:text-[240px] font-tech font-black italic text-gray-100 leading-none">
            {{ error.statusCode }}
          </span>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-20 h-1 bg-brand"></div>
          </div>
        </div>

        <!-- Text — správa podľa typu chyby (404 vs server error) -->
        <h1 class="font-tech font-black uppercase italic text-3xl md:text-5xl text-black leading-none mb-4">
          {{ is404 ? 'Stránka sa nenašla' : 'Ups! Niečo sa pokazilo' }}
        </h1>
        <div class="section-decorator mx-auto mb-6"></div>
        <p class="text-gray-500 font-sans text-lg mb-10 max-w-md mx-auto">
          {{ is404
            ? 'Požadovaná stránka nebola nájdená.'
            : 'Nastala dočasná chyba. Skúste to prosím znova.' }}
        </p>

        <!-- CTA -->
        <button
          class="btn-checkout inline-flex items-center justify-center gap-2 px-8 py-4 max-w-xs mx-auto"
          @click="handleError"
        >
          <HomeIcon class="w-4 h-4" aria-hidden="true" />
          Späť na domovskú stránku
        </button>

        <!-- Debug detail — len s ?debug=1, aby sa dala diagnostikovať 500 -->
        <pre
          v-if="showDebug"
          class="mt-10 mx-auto max-w-2xl text-left text-[11px] text-gray-500 bg-gray-50 border border-gray-200 rounded-default p-4 overflow-x-auto whitespace-pre-wrap"
        >[{{ error.statusCode }}] {{ error.statusMessage || error.message }}
url: {{ (error as any).url || route.fullPath }}</pre>

      </div>
    </section>
  </NuxtLayout>
</template>
