<script setup lang="ts">
import { ref } from 'vue';
import { Mail, AlertCircle, CheckCircle, Loader2 } from 'lucide-vue-next';
import { useAuth } from '~/composables/useAuth';
import BaseButton from '~/components/ui/BaseButton.vue';

const emit = defineEmits<{
  (e: 'back'): void;
}>();

// sendPasswordRecovery uses direct $fetch — no inject() issues
const { sendPasswordRecovery, isLoading } = useAuth();

const email = ref('');
const error = ref<string | null>(null);
const success = ref(false);

async function handleReset() {
  if (!email.value) return;
  error.value = null;
  try {
    await sendPasswordRecovery(email.value);
    success.value = true;
  } catch (err: any) {
    error.value = err.message ?? 'Nepodarilo sa odoslať email na obnovenie hesla.';
  }
}
</script>

<template>
  <div class="font-sans">
    <Transition name="fade" mode="out-in">
      <!-- Success -->
      <div v-if="success" key="success" class="flex flex-col items-center py-8 text-center">
        <CheckCircle class="w-16 h-16 text-green-500 mb-5" />
        <h3 class="text-lg font-black uppercase font-tech mb-2">Email bol odoslaný</h3>
        <p class="text-sm text-gray-500 mb-8 max-w-xs">
          Ak je tento email v našej databáze, čoskoro dostanete odkaz na zmenu hesla.
        </p>
        <BaseButton variant="secondary" @click="emit('back')">Späť na prihlásenie</BaseButton>
      </div>

      <!-- Form -->
      <form v-else key="form" @submit.prevent="handleReset" class="space-y-6">
        <p class="text-sm text-gray-500">
          Zadajte Váš email a pošleme Vám odkaz na vytvorenie nového hesla.
        </p>

        <div>
          <label for="recovery-email" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">E-mail</label>
          <div class="relative">
            <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              id="recovery-email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              placeholder="vas@email.sk"
              class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"
              :disabled="isLoading"
            />
          </div>
        </div>

        <Transition name="fade">
          <div v-if="error" class="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 p-4 text-sm">
            <AlertCircle class="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{{ error }}</p>
          </div>
        </Transition>

        <BaseButton type="submit" variant="primary" block size="lg" :disabled="isLoading">
          <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
          {{ isLoading ? 'Odosielam...' : 'Odoslať odkaz' }}
        </BaseButton>
      </form>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
