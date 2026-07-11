<script setup lang="ts">
import { ref } from 'vue';
import { CheckCircle, AlertCircle, Mail } from 'lucide-vue-next';
import { useShopwareContext, useShopwareLanguage } from '#imports';
import AppHoneypot from '~/components/ui/AppHoneypot.vue';

const { apiClient } = useShopwareContext();
const { currentLanguageId } = useShopwareLanguage();

const email = ref('');
const shopware_honeypot = ref('');
const isSubmitting = ref(false);
const success = ref(false);
const error = ref<string | null>(null);

const subscribeNewsletter = async () => {
  if (shopware_honeypot.value) { success.value = true; return; }
  if (!email.value) return;
  isSubmitting.value = true;
  error.value = null;
  try {
    await apiClient.invoke('subscribeToNewsletter post /newsletter/subscribe', {
      body: { email: email.value, option: 'subscribe', shopware_honeypot: shopware_honeypot.value },
      headers: { 'sw-language-id': currentLanguageId.value }
    } as any);
    success.value = true;
    email.value = '';
  } catch (err: any) {
    if (err.statusCode === 400 && err.message?.toLowerCase().includes('captcha')) {
      error.value = 'Odosielanie bolo zablokované bezpečnostným systémom.';
      return;
    }
    error.value = 'Nepodarilo sa prihlásiť na odber. Skúste to prosím neskôr.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <section
    class="relative overflow-hidden text-white"
    style="background-image: url('https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=2000&auto=format&fit=crop'); background-size: cover; background-position: center;"
  >
    <!-- Tmavý overlay -->
    <div class="absolute inset-0 bg-black/75 pointer-events-none"></div>

    <div class="container mx-auto px-4 lg:px-8 py-16 relative z-10">
      <div class="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">

        <!-- Ľavý stĺpec — text -->
        <div class="lg:w-[45%] flex-shrink-0">
          <h2 class="section-h2 text-2xl md:text-3xl mb-3">
            Nezmeškajte žiadnu <span class="text-amber">ponuku</span>
          </h2>
          <div class="section-decorator mb-5"></div>
          <p class="text-gray-300 text-sm font-sans leading-relaxed">
            Zostaňte v obraze a prihláste sa na odber našich noviniek.<br />
            Ako darček Vám dáme <span class="font-bold text-white">zľavový kód v hodnote 10 €</span> na nákup.
          </p>
        </div>

        <!-- Pravý stĺpec — formulár -->
        <div class="flex-1 w-full">
          <div v-if="success" class="flex items-center gap-3 text-green-400 font-sans font-medium">
            <CheckCircle class="w-6 h-6 flex-shrink-0" />
            Ďakujeme! Skontrolujte si e-mailovú schránku.
          </div>

          <template v-else>
            <form class="flex flex-col gap-3 max-w-sm ml-auto" @submit.prevent="subscribeNewsletter">
              <AppHoneypot v-model="shopware_honeypot" />
              <input
                v-model="email"
                type="email"
                required
                placeholder="Váš e-mail"
                class="form-input bg-white text-gray-900 placeholder-gray-400"
                :disabled="isSubmitting"
              />
              <p class="text-gray-500 text-xs font-sans -mt-1">
                *Neposielame žiadne spamy, iba novonaskladnené produkty :)
              </p>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="btn-checkout flex items-center justify-center gap-2"
              >
                <Mail class="w-4 h-4" aria-hidden="true" />
                {{ isSubmitting ? 'Odosielam…' : 'Odoberať newsletter' }}
              </button>
            </form>

            <div v-if="error" class="mt-3 text-red-400 text-xs font-sans flex items-center gap-1.5">
              <AlertCircle class="w-3.5 h-3.5" />{{ error }}
            </div>
          </template>
        </div>

      </div>
    </div>
  </section>
</template>
