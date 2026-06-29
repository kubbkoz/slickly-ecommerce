<script setup lang="ts">
import { Fingerprint, Plus, Trash2, Loader2, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-vue-next';
import type { PasskeyCredential } from '~/composables/useWebAuthn';

const props = defineProps<{
  email: string;
}>();

const { isSupported, detectDeviceName, registerPasskey, listPasskeys, deletePasskey } = useWebAuthn();

const supported = ref(false);
const passkeys = ref<PasskeyCredential[]>([]);
const isLoadingList = ref(true);
const isAdding = ref(false);
const deletingId = ref<string | null>(null);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

const detectedDevice = computed(() => detectDeviceName());

async function refresh() {
  try {
    passkeys.value = await listPasskeys();
  } catch (err: any) {
    error.value = err?.data?.statusMessage ?? 'Načítanie zariadení zlyhalo';
  } finally {
    isLoadingList.value = false;
  }
}

onMounted(async () => {
  supported.value = await isSupported();
  if (supported.value) await refresh();
  else isLoadingList.value = false;
});

async function addPasskey() {
  if (isAdding.value || !props.email) return;
  error.value = null;
  success.value = null;
  isAdding.value = true;

  try {
    await registerPasskey(props.email, detectedDevice.value);
    success.value = `Passkey "${detectedDevice.value}" pridaný`;
    await refresh();
  } catch (err: any) {
    if (err?.name === 'NotAllowedError') return; // user cancelled silently
    if (err?.name === 'InvalidStateError') {
      error.value = 'Toto zariadenie už máte pridané.';
      return;
    }
    error.value = err?.data?.statusMessage ?? err?.message ?? 'Pridanie zlyhalo';
  } finally {
    isAdding.value = false;
  }
}

async function removePasskey(credentialId: string, deviceName: string) {
  if (deletingId.value) return;
  if (!confirm(`Naozaj odstrániť "${deviceName}"? Po odstránení sa nedáte prihlásiť bez hesla cez toto zariadenie.`)) return;

  deletingId.value = credentialId;
  error.value = null;
  success.value = null;

  try {
    await deletePasskey(credentialId);
    success.value = 'Passkey odstránený';
    await refresh();
  } catch (err: any) {
    error.value = err?.data?.statusMessage ?? err?.message ?? 'Odstránenie zlyhalo';
  } finally {
    deletingId.value = null;
  }
}

function formatDate(ts: number): string {
  return new Intl.DateTimeFormat('sk-SK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(ts));
}
</script>

<template>
  <div class="bg-white border border-gray-100">
    <!-- Header -->
    <div class="flex items-center gap-3 px-5 md:px-6 py-5 border-b border-gray-100">
      <Fingerprint class="w-4 h-4 text-gray-900" :stroke-width="1.8" />
      <h2 class="text-xs font-bold tracking-[0.2em] text-gray-900 font-sans uppercase leading-none">
        Passkey / Biometria
      </h2>
      <span
        v-if="passkeys.length"
        class="ml-auto inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-green-600"
      >
        <ShieldCheck class="w-3 h-3" /> Aktívne
      </span>
    </div>

    <div class="px-5 md:px-8 py-6 space-y-5">
      <!-- Browser unsupported -->
      <div v-if="!supported" class="flex items-start gap-3 bg-gray-50 border border-gray-100 p-4 text-xs text-gray-600">
        <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" />
        <p>
          Tento prehliadač/zariadenie nepodporuje biometrické prihlasovanie.
          Použite moderný prehliadač na zariadení s Face ID, Touch ID alebo Windows Hello.
        </p>
      </div>

      <template v-else>
        <p class="text-sm text-gray-600 font-sans leading-relaxed">
          Prihlasujte sa rýchlejšie a bezpečnejšie — bez hesla, jediným dotykom prsta alebo pohľadom.
          Passkey je viazaný na konkrétne zariadenie a nedá sa odcudziť.
        </p>

        <!-- Feedback -->
        <Transition name="fade">
          <div v-if="error" class="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 p-3 text-xs">
            <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>{{ error }}</p>
          </div>
        </Transition>
        <Transition name="fade">
          <div v-if="success" class="flex items-start gap-3 bg-green-50 border border-green-100 text-green-700 p-3 text-xs">
            <CheckCircle class="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>{{ success }}</p>
          </div>
        </Transition>

        <!-- Passkey list -->
        <div v-if="isLoadingList" class="flex items-center gap-2 text-xs text-gray-400 font-sans">
          <Loader2 class="w-4 h-4 animate-spin" />
          Načítavam zariadenia...
        </div>

        <div v-else-if="passkeys.length === 0" class="text-xs text-gray-500 font-sans italic">
          Zatiaľ nemáte pridané žiadne passkey. Pridajte si toto zariadenie nižšie.
        </div>

        <ul v-else class="space-y-2">
          <li
            v-for="pk in passkeys"
            :key="pk.id"
            class="flex items-center gap-3 border border-gray-100 px-4 py-3 hover:border-gray-200 transition-colors"
          >
            <div class="flex-shrink-0 w-9 h-9 bg-gray-50 flex items-center justify-center">
              <Fingerprint class="w-4 h-4 text-brand" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-bold uppercase tracking-widest font-tech truncate">{{ pk.deviceName }}</p>
              <p class="text-[10px] text-gray-400 font-sans mt-0.5">Pridané {{ formatDate(pk.createdAt) }}</p>
            </div>
            <button
              type="button"
              :disabled="deletingId === pk.id"
              @click="removePasskey(pk.id, pk.deviceName)"
              class="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :aria-label="`Odstrániť ${pk.deviceName}`"
            >
              <Loader2 v-if="deletingId === pk.id" class="w-4 h-4 animate-spin" />
              <Trash2 v-else class="w-4 h-4" />
            </button>
          </li>
        </ul>

        <!-- Add button -->
        <button
          type="button"
          :disabled="isAdding"
          @click="addPasskey"
          class="flex items-center justify-center gap-2 w-full py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Loader2 v-if="isAdding" class="w-4 h-4 animate-spin" />
          <Plus v-else class="w-4 h-4" />
          {{ isAdding ? 'Registrujem...' : `Pridať passkey (${detectedDevice})` }}
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
