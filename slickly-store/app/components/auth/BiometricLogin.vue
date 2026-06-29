<script setup lang="ts">
import { Fingerprint, Loader2, AlertCircle } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'success'): void;
}>();

const { isSupported, loginWithPasskey } = useWebAuthn();

const isLoading = ref(false);
const error = ref<string | null>(null);
const supported = ref(false);

onMounted(async () => {
  supported.value = await isSupported();
});

async function loginBiometric() {
  if (isLoading.value) return;
  error.value = null;
  isLoading.value = true;

  try {
    await loginWithPasskey();
    emit('success');
    await navigateTo('/account');
  } catch (err: any) {
    // User cancelled / timed out — silent
    if (err?.name === 'NotAllowedError') return;
    error.value = err?.data?.statusMessage ?? err?.message ?? 'Biometrické overenie zlyhalo';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div v-if="supported">
    <div class="flex items-center gap-3 my-4">
      <div class="flex-1 h-px bg-gray-200" />
      <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">alebo</span>
      <div class="flex-1 h-px bg-gray-200" />
    </div>

    <button
      type="button"
      :disabled="isLoading"
      @click="loginBiometric"
      class="flex items-center justify-center gap-3 w-full py-3 px-4 border border-gray-200 bg-white hover:bg-gray-50 hover:border-black transition-all duration-200 text-sm font-bold uppercase tracking-widest text-gray-800 font-sans disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin text-brand" />
      <Fingerprint v-else class="w-5 h-5 text-brand" />
      {{ isLoading ? 'Overujem...' : 'Prihlásiť biometriou' }}
    </button>

    <Transition name="fade">
      <div v-if="error" class="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 p-3 text-xs mt-3">
        <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>{{ error }}</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
