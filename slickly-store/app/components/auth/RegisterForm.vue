<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Mail, Lock, User, MapPin, AlertCircle, CheckCircle, Loader2 } from 'lucide-vue-next';
// @ts-ignore
import { useSalutations, useCountries, useUser } from '@shopware/composables';
import { useAuth } from '~/composables/useAuth';
import BaseButton from '~/components/ui/BaseButton.vue';
import AppHoneypot from '~/components/ui/AppHoneypot.vue';
import SocialLoginButtons from '~/components/auth/SocialLoginButtons.vue';

const { register } = useUser();
const { isLoading } = useAuth();
const { getSalutations, fetchSalutations } = useSalutations();
const { getCountries, fetchCountries } = useCountries();

// ---------------------------------------------------------------------------
// Form state
// ---------------------------------------------------------------------------
const honeypot = ref('');
const error = ref<string | null>(null);
const success = ref(false);

const form = ref({
  salutationId: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirm: '',
  street: '',
  zipcode: '',
  city: '',
  countryId: '',
});

const route = useRoute();
const redirectTo = computed(() => route.query.redirectTo as string | undefined);

// ---------------------------------------------------------------------------
// Boot: load salutations + countries from Shopware
// ---------------------------------------------------------------------------
onMounted(async () => {
  await Promise.all([fetchSalutations(), fetchCountries()]);

  // Set SK as default country
  const skCountry = getCountries.value?.find(
    (c: any) => c.iso === 'SK' || c.iso3 === 'SVK',
  );
  if (skCountry) form.value.countryId = skCountry.id;

  // Default salutation to first entry
  if (getSalutations.value?.length) form.value.salutationId = getSalutations.value[0]?.id || '';
});

// ---------------------------------------------------------------------------
// Submit
// ---------------------------------------------------------------------------
async function handleRegister() {
  // Honeypot — bot check
  if (honeypot.value) {
    success.value = true; // Fake success for bots
    return;
  }

  // Password match
  if (form.value.password !== form.value.passwordConfirm) {
    error.value = 'Heslá sa nezhodujú.';
    return;
  }

  error.value = null;

  try {
    await register({
      salutationId: form.value.salutationId,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password,
      billingAddress: {
        salutationId: form.value.salutationId,
        street: form.value.street,
        zipcode: form.value.zipcode,
        city: form.value.city,
        countryId: form.value.countryId,
      } as any,
      acceptedDataProtection: true,
    } as any);

    success.value = true;
    // Auto-redirect after 2s to redirectTo param or /account
    const route = useRoute();
    const redirectTo = route.query.redirectTo as string | undefined;
    setTimeout(() => navigateTo(redirectTo || '/account'), 2000);
  } catch (err: any) {
    error.value = err.message ?? 'Nastala chyba pri registrácii.';
  }
}
</script>

<template>
  <div class="font-sans max-w-2xl mx-auto">
    <!-- Success -->
    <Transition name="fade" mode="out-in">
      <div v-if="success" key="success" class="flex flex-col items-center py-16 text-center">
        <CheckCircle class="w-20 h-20 text-green-500 mb-6" />
        <h2 class="text-3xl font-black uppercase font-tech tracking-tight mb-3">Registrácia úspešná!</h2>
        <p class="text-gray-500 mb-8">Váš účet bol vytvorený. Presmerúvame Vás {{ redirectTo ? 'späť k produktu' : 'do profilu' }}&hellip;</p>
        <BaseButton :to="redirectTo || '/account'" variant="primary">{{ redirectTo ? 'Späť k produktu' : 'Prejsť do profilu' }}</BaseButton>
      </div>

      <!-- Form -->
      <form v-else key="form" @submit.prevent="handleRegister" novalidate class="space-y-8">
        <AppHoneypot v-model="honeypot" />

        <div class="flex items-center gap-4">
          <span class="w-1.5 h-8 bg-brand flex-shrink-0"></span>
          <h1 class="text-3xl font-black font-tech uppercase tracking-tighter">Registrácia</h1>
        </div>

        <!-- ── Personal info ──────────────────────────────────────────────── -->
        <section class="space-y-5">
          <h2 class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 pb-2">
            Osobné údaje
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Salutation -->
            <div class="md:col-span-2">
              <label for="reg-salutation" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                Oslovenie
              </label>
              <select
                id="reg-salutation"
                v-model="form.salutationId"
                required
                class="w-full p-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"
                :disabled="isLoading"
              >
                <option v-for="sal in getSalutations" :key="sal.id" :value="sal.id">
                  {{ sal.displayName }}
                </option>
              </select>
            </div>

            <!-- First name -->
            <div>
              <label for="reg-firstname" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Meno *</label>
              <div class="relative">
                <User class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id="reg-firstname"
                  v-model="form.firstName"
                  type="text"
                  required
                  autocomplete="given-name"
                  placeholder="Jozef"
                  class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"
                  :disabled="isLoading"
                />
              </div>
            </div>

            <!-- Last name -->
            <div>
              <label for="reg-lastname" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Priezvisko *</label>
              <div class="relative">
                <User class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id="reg-lastname"
                  v-model="form.lastName"
                  type="text"
                  required
                  autocomplete="family-name"
                  placeholder="Novák"
                  class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"
                  :disabled="isLoading"
                />
              </div>
            </div>

            <!-- Email -->
            <div class="md:col-span-2">
              <label for="reg-email" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">E-mail *</label>
              <div class="relative">
                <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id="reg-email"
                  v-model="form.email"
                  type="email"
                  required
                  autocomplete="email"
                  placeholder="email@priklad.sk"
                  class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"
                  :disabled="isLoading"
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <label for="reg-password" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Heslo * (min. 8 znakov)</label>
              <div class="relative">
                <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id="reg-password"
                  v-model="form.password"
                  type="password"
                  required
                  minlength="8"
                  autocomplete="new-password"
                  placeholder="••••••••"
                  class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"
                  :disabled="isLoading"
                />
              </div>
            </div>

            <!-- Confirm password -->
            <div>
              <label for="reg-password-confirm" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Potvrďte heslo *</label>
              <div class="relative">
                <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id="reg-password-confirm"
                  v-model="form.passwordConfirm"
                  type="password"
                  required
                  minlength="8"
                  autocomplete="new-password"
                  placeholder="••••••••"
                  class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"
                  :disabled="isLoading"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- ── Billing address ────────────────────────────────────────────── -->
        <section class="space-y-5">
          <h2 class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 pb-2">
            Fakturačná adresa
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Street -->
            <div class="md:col-span-2">
              <label for="reg-street" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Ulica a číslo *</label>
              <div class="relative">
                <MapPin class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id="reg-street"
                  v-model="form.street"
                  type="text"
                  required
                  autocomplete="street-address"
                  placeholder="Hlavná 123"
                  class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"
                  :disabled="isLoading"
                />
              </div>
            </div>

            <!-- City -->
            <div>
              <label for="reg-city" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Mesto *</label>
              <input
                id="reg-city"
                v-model="form.city"
                type="text"
                required
                autocomplete="address-level2"
                placeholder="Bratislava"
                class="w-full p-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"
                :disabled="isLoading"
              />
            </div>

            <!-- ZIP -->
            <div>
              <label for="reg-zip" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">PSČ *</label>
              <input
                id="reg-zip"
                v-model="form.zipcode"
                type="text"
                required
                autocomplete="postal-code"
                placeholder="831 01"
                class="w-full p-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"
                :disabled="isLoading"
              />
            </div>

            <!-- Country -->
            <div class="md:col-span-2">
              <label for="reg-country" class="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Krajina *</label>
              <select
                id="reg-country"
                v-model="form.countryId"
                required
                class="w-full p-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium disabled:opacity-50"
                :disabled="isLoading"
              >
                <option v-for="country in getCountries" :key="country.id" :value="country.id">
                  {{ country.name }}
                </option>
              </select>
            </div>
          </div>
        </section>

        <!-- Error -->
        <Transition name="fade">
          <div v-if="error" class="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 p-4 text-sm">
            <AlertCircle class="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{{ error }}</p>
          </div>
        </Transition>

        <!-- Submit -->
        <BaseButton type="submit" variant="primary" block size="lg" :disabled="isLoading">
          <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
          {{ isLoading ? 'Registrujem...' : 'Vytvoriť účet' }}
        </BaseButton>

        <p class="text-center text-xs text-gray-400">
          Kliknutím súhlasíte s
          <a href="/obchodne-podmienky" class="text-brand hover:underline font-bold">obchodnými podmienkami</a>
          a
          <a href="/ochrana-sukromia" class="text-brand hover:underline font-bold">ochranou súkromia</a>.
        </p>

        <!-- Social registration -->
        <SocialLoginButtons context="register" />
      </form>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
