<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Mail, Lock, AlertCircle, Loader2, CheckCircle } from 'lucide-vue-next';
// @ts-ignore
import { useUser, useSessionContext } from '@shopware/composables';
import { mapSwError } from '~/composables/useAuth';
import BaseButton from '~/components/ui/BaseButton.vue';
import AppHoneypot from '~/components/ui/AppHoneypot.vue';
import ForgotPasswordForm from '~/components/auth/ForgotPasswordForm.vue';
import SocialLoginButtons from '~/components/auth/SocialLoginButtons.vue';
import BiometricLogin from '~/components/auth/BiometricLogin.vue';

const props = defineProps<{
  /** Email zákazníka po úspešnom OAuth prihlásení — zobrazí success state. */
  oauthSuccess?: string;
  /** Error code z OAuth flow query string — zobrazí error banner v login forme. */
  oauthError?: string;
  /** Email z OAuth providera — pre-fill do email inputu pri email_exists chybe. */
  oauthPrefillEmail?: string;
}>();

const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'close'): void;
}>();

const { login, isLoggedIn, refreshUser } = useUser();
const { refreshSessionContext } = useSessionContext();

const email = ref(props.oauthPrefillEmail ?? '');
const password = ref('');
const honeypot = ref('');
const error = ref<string | null>(null);
const isLoading = ref(false);
const showForgotPassword = ref(false);

// Reaguj na zmenu prefill emailu (po druhom OAuth pokuse z otvoreného modalu)
watch(() => props.oauthPrefillEmail, (newEmail) => {
  if (newEmail) email.value = newEmail;
});

// ── OAuth state translation ────────────────────────────────────────────────
const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  oauth_cancelled: 'Prihlásenie bolo zrušené.',
  oauth_state_mismatch: 'Bezpečnostná chyba (state mismatch). Skús to znova.',
  oauth_no_code: 'Google/Facebook nevrátili overovací kód.',
  oauth_token_exchange: 'Chyba pri výmene tokenu s poskytovateľom.',
  oauth_profile_fetch: 'Nepodarilo sa získať profil od poskytovateľa.',
  oauth_no_email: 'Facebook nezdieľal email — povoľ ho v nastaveniach Facebook účtu.',
  email_exists: 'Tento email je už registrovaný v SLICKLY s heslom. Zadaj heslo nižšie alebo si ho obnov cez "Zabudli ste heslo?".',
  oauth_registration_failed: 'Vytvorenie zákazníckeho účtu zlyhalo. Pozri server log alebo kontaktuj podporu.',
};
const oauthErrorMsg = computed(() =>
  props.oauthError ? (OAUTH_ERROR_MESSAGES[props.oauthError] ?? `Chyba: ${props.oauthError}`) : null,
);

async function goToAccount() {
  // KRITICKÉ: SPA navigation, NIE window.location.href.
  // OAuth callback nastavil sw-context-token cookie server-side, ale Vue stav
  // o tom nevie. refreshSessionContext() nahodí customer do session contextu →
  // useUser().isLoggedIn sa zmení na true. Po tomto smie auth middleware prejsť.
  // Plný reload by spravil novú app instance a stratil just-loaded session.
  if (!import.meta.client) return;
  try {
    await refreshSessionContext();
    await refreshUser();
  } catch (e) {
    console.warn('[OAuth] refreshSessionContext failed:', e);
  }
  emit('close');
  await navigateTo('/account');
}

async function handleLogin() {
  if (honeypot.value) return; // Bot check

  error.value = null;
  isLoading.value = true;
  try {
    await login({ username: email.value, password: password.value });
    emit('success');
  } catch (err: any) {
    error.value = mapSwError(err);
  } finally {
    isLoading.value = false;
  }
}

function goToRegister() {
  emit('close');
  navigateTo('/register');
}
</script>

<template>
  <div class="font-sans">
    <Transition name="fade" mode="out-in">
      <!-- ── OAuth SUCCESS state ─────────────────────────────────────────── -->
      <div v-if="oauthSuccess" key="oauth-success" class="text-center py-6">
        <div class="w-16 h-16 mx-auto mb-5 bg-green-50 border-2 border-green-200 flex items-center justify-center">
          <CheckCircle class="w-9 h-9 text-green-600" />
        </div>
        <h3 class="text-2xl font-black font-tech uppercase tracking-wide leading-none mb-2">
          Prihlásenie <span class="text-brand">úspešné</span>
        </h3>
        <div class="w-16 h-1 bg-brand skew-x-[-20deg] mx-auto mb-5"></div>
        <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Prihlásený ako</p>
        <p class="text-sm font-bold text-black mb-8 break-all">{{ oauthSuccess }}</p>
        <BaseButton
          variant="primary"
          block
          size="lg"
          class="uppercase font-bold tracking-widest py-5"
          @click="goToAccount"
        >
          Pokračovať na môj účet
        </BaseButton>
        <button
          type="button"
          class="mt-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
          @click="$emit('close')"
        >
          Zavrieť a pokračovať v nákupe
        </button>
      </div>

      <!-- Forgot Password -->
      <div v-else-if="showForgotPassword" key="forgot">
        <div class="flex items-center gap-3 mb-6">
          <button
            type="button"
            @click="showForgotPassword = false"
            class="text-gray-400 hover:text-black transition-colors"
            aria-label="Späť"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M5 12l7 7M5 12l7-7"/>
            </svg>
          </button>
          <h2 class="text-xl font-black font-tech uppercase tracking-wider">Obnovenie hesla</h2>
        </div>
        <ForgotPasswordForm @back="showForgotPassword = false" />
      </div>

      <!-- Login -->
      <div v-else key="login">
        <!-- OAuth ERROR banner — viditeľný hneď po návrate z neúspešného OAuth flow -->
        <div
          v-if="oauthErrorMsg"
          class="mb-5 flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 p-4 text-sm"
        >
          <AlertCircle class="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{{ oauthErrorMsg }}</p>
        </div>

        <form @submit.prevent="handleLogin" novalidate class="space-y-5">
          <AppHoneypot v-model="honeypot" />

          <!-- Email -->
          <div>
            <label for="login-email" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">E-mail</label>
            <div class="relative">
              <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                id="login-email"
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

          <!-- Password -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label for="login-password" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500">Heslo</label>
              <button
                type="button"
                @click="showForgotPassword = true"
                class="text-[10px] font-bold uppercase tracking-widest text-brand hover:underline"
              >
                Zabudli ste heslo?
              </button>
            </div>
            <div class="relative">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                id="login-password"
                v-model="password"
                type="password"
                required
                autocomplete="current-password"
                placeholder="••••••••"
                class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"
                :disabled="isLoading"
              />
            </div>
          </div>

          <!-- Error -->
          <Transition name="fade">
            <div v-if="error" class="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 p-4 text-sm">
              <AlertCircle class="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{{ error }}</p>
            </div>
          </Transition>

          <BaseButton 
            type="submit" 
            variant="primary" 
            block 
            size="lg" 
            :disabled="isLoading" 
            class="mt-2 uppercase font-bold tracking-widest py-5"
          >
            <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
            {{ isLoading ? 'Prihlasujem...' : 'Prihlásiť sa' }}
          </BaseButton>

          <!-- Biometric login -->
          <BiometricLogin @success="$emit('success')" />

          <!-- Social login (Google, Facebook) -->
          <SocialLoginButtons context="login" />

          <div class="mt-4 pt-6 border-t border-gray-100 text-center">
            <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Ešte nemáte účet?</p>
            <BaseButton
              variant="white"
              block
              class="border border-gray-200 uppercase font-black tracking-widest"
              @click="goToRegister"
            >
              Zaregistrovať sa
            </BaseButton>
          </div>
        </form>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
