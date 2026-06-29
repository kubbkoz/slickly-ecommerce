<script setup lang="ts">
import { Fingerprint, CheckCircle, Loader2, AlertCircle, X } from 'lucide-vue-next';

const props = defineProps<{
  email: string;
}>();

const emit = defineEmits<{
  (e: 'dismiss'): void;
  (e: 'registered'): void;
}>();

const { isSupported, detectDeviceName, registerPasskey } = useWebAuthn();

const isLoading = ref(false);
const isDone = ref(false);
const error = ref<string | null>(null);
const supported = ref(false);
const deviceName = ref('');

onMounted(async () => {
  supported.value = await isSupported();
  deviceName.value = detectDeviceName();
});

async function setupBiometric() {
  if (isLoading.value || !props.email) return;
  error.value = null;
  isLoading.value = true;

  try {
    await registerPasskey(props.email, deviceName.value);
    isDone.value = true;
    emit('registered');
  } catch (err: any) {
    if (err?.name === 'NotAllowedError') {
      emit('dismiss');
      return;
    }
    if (err?.name === 'InvalidStateError') {
      error.value = 'Toto zariadenie je už zaregistrované.';
      return;
    }
    error.value = err?.data?.statusMessage ?? err?.message ?? 'Registrácia biometrie zlyhala';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div v-if="supported" class="relative bg-white border border-gray-100 p-5">
    <button
      type="button"
      @click="$emit('dismiss')"
      class="absolute top-3 right-3 text-gray-300 hover:text-gray-600 transition-colors"
      aria-label="Zatvoriť"
    >
      <X class="w-4 h-4" />
    </button>

    <!-- Success state -->
    <div v-if="isDone" class="text-center py-2">
      <CheckCircle class="w-10 h-10 text-green-500 mx-auto mb-3" />
      <p class="text-sm font-bold uppercase tracking-widest font-tech">Biometria aktivovaná!</p>
      <p class="text-xs text-gray-500 mt-1 font-sans">Nabudúce sa prihlásite odtlačkom prsta.</p>
      <button
        type="button"
        @click="$emit('dismiss')"
        class="mt-4 text-[10px] font-bold uppercase tracking-widest text-brand hover:underline"
      >
        Zatvoriť
      </button>
    </div>

    <!-- Setup prompt -->
    <div v-else>
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0 w-10 h-10 bg-gray-50 flex items-center justify-center">
          <Fingerprint class="w-5 h-5 text-brand" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-bold uppercase tracking-widest font-tech mb-1">Rýchle prihlásenie</p>
          <p class="text-xs text-gray-500 font-sans leading-relaxed">
            Nastaviť prihlásenie cez {{ deviceName || 'biometriu' }} pre rýchly prístup a potvrdenie objednávok.
          </p>
        </div>
      </div>

      <Transition name="fade">
        <div v-if="error" class="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 p-3 text-xs mt-4">
          <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>{{ error }}</p>
        </div>
      </Transition>

      <div class="flex gap-2 mt-4">
        <button
          type="button"
          :disabled="isLoading"
          @click="setupBiometric"
          class="flex-1 flex items-center justify-center gap-2 py-2.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
          <Fingerprint v-else class="w-4 h-4" />
          {{ isLoading ? 'Registrujem...' : 'Aktivovať' }}
        </button>
        <button
          type="button"
          @click="$emit('dismiss')"
          class="px-4 py-2.5 border border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:border-gray-400 transition-colors"
        >
          Neskôr
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
