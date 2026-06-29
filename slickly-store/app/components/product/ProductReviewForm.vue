<script setup lang="ts">
import { useShopwareContext, useShopwareLanguage, useRoute, useRouter, useState } from '#imports';
import { ref, computed } from 'vue';
import { Star, AlertCircle, CheckCircle } from 'lucide-vue-next';
// @ts-ignore
import { useUser } from '@shopware/composables';
import BaseButton from '~/components/ui/BaseButton.vue';
import AppHoneypot from '~/components/ui/AppHoneypot.vue';

const { isLoggedIn } = useUser();

const props = defineProps<{
  productId: string;
}>();

const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'cancel'): void;
}>();

const { apiClient } = useShopwareContext();
const { currentLanguageId } = useShopwareLanguage();

const formData = ref({
  name: '',
  email: '',
  title: '',
  content: '',
  points: 0,
  shopware_honeypot: ''
});

const isSubmitting = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

const MIN_CONTENT_LENGTH = 40;
const currentContentLength = computed(() => formData.value.content.length);

const setRating = (points: number) => {
  formData.value.points = points;
};

const submitReview = async () => {
  if (formData.value.shopware_honeypot) {
    console.warn('Honeypot triggered - blocking bot submission.');
    success.value = true; // Pretend it worked for the bot
    setTimeout(() => emit('success'), 1000);
    return;
  }

  if (formData.value.points === 0) {
    error.value = 'Prosím vyberte počet hviezdičiek.';
    return;
  }

  if (formData.value.content.length < MIN_CONTENT_LENGTH) {
    error.value = `Vaša recenzia je príliš krátka. Prosím napíšte aspoň ${MIN_CONTENT_LENGTH} znakov (aktuálne ${formData.value.content.length}).`;
    return;
  }

  isSubmitting.value = true;
  error.value = null;

  try {
    const res = await apiClient.invoke(`saveProductReview post /product/${props.productId}/review` as any, {
      body: {
        name: formData.value.name,
        email: formData.value.email,
        title: formData.value.title,
        content: formData.value.content,
        points: formData.value.points,
        shopware_honeypot: formData.value.shopware_honeypot
      } as any,
      headers: {
        'sw-language-id': currentLanguageId.value
      }
    });

    success.value = true;
    setTimeout(() => {
      emit('success');
    }, 2000);
  } catch (err: any) {
    console.error('Failed to submit review:', err);
    
    const errorMsg = err.message?.toLowerCase() || '';

    // 1. Duplicate review check (Shopware constraint)
    if (errorMsg.includes('already exists') && errorMsg.includes('product_review')) {
      error.value = 'Pre tento produkt ste už recenziu napísali. Každý zákazník môže pridať len jednu recenziu na produkt.';
      return;
    }
    
    // 2. Check for Captcha/Honeypot error (Shopware returns 400 for Captcha failures)
    if (err.statusCode === 400 && errorMsg.includes('captcha')) {
       error.value = 'Odosielanie bolo zablokované bezpečnostným systémom. Skúste to prosím neskôr.';
       return;
    }

    error.value = 'Nepodarilo sa odoslať recenziu. Skontrolujte prosím údaje a skúste to znovu.';
  } finally {
    isSubmitting.value = false;
  }
};

const route = useRoute();
const router = useRouter();

const openLoginModal = () => {
  useState('loginModalOpen', () => false).value = true;
  emit('cancel');
};

const goToRegister = () => {
  emit('cancel');
  router.push(`/register?redirectTo=${encodeURIComponent(route.fullPath)}`);
};
</script>

<template>
  <div class="font-sans">
    <div v-if="!isLoggedIn" class="px-6 pt-8 pb-4 md:px-12 animate-fade-in bg-white font-sans text-center flex flex-col items-center">
      <div class="w-24 h-24 bg-gray-50 flex items-center justify-center mb-8 border border-gray-100">
        <Star class="w-12 h-12 text-yellow-400 animate-pulse-slow" />
      </div>
      <h4 class="text-xl font-black text-black mb-4 uppercase font-tech tracking-widest">Recenzie sú len pre prihlásených</h4>
      <p class="text-gray-500 mb-8 max-w-sm font-sans text-sm leading-relaxed">
        Aby sme zabezpečili autenticitu recenzií, pridávať ich môžu len registrovaní zákazníci. Prosím, prihláste sa do svojho účtu.
      </p>
      <div class="flex flex-col items-center gap-6 w-full">
        <BaseButton
          variant="primary"
          size="lg"
          class="w-full md:w-auto md:min-w-[280px] uppercase font-bold tracking-widest py-5"
          @click="openLoginModal"
        >
          Prihlásiť sa
        </BaseButton>
        
        <div class="flex flex-col items-center gap-3 mt-4 pt-6 border-t border-gray-100 w-full text-center">
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
      </div>
    </div>

    <div v-else-if="success" class="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
      <CheckCircle class="w-16 h-16 text-green-500 mb-4" />
      <h3 class="text-xl font-bold text-black mb-2 uppercase font-tech">Ďakujeme za vašu recenziu!</h3>
      <p class="text-gray-500">Vaša recenzia bola úspešne odoslaná a po schválení administrátorom sa zobrazí na stránke.</p>
    </div>

    <form v-else @submit.prevent="submitReview" class="space-y-6">
      <AppHoneypot v-model="formData.shopware_honeypot" />
      
      <!-- Star Rating Selector -->
      <div>
        <label class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Vaše hodnotenie *</label>
        <div class="flex gap-2">
          <button
            v-for="i in 5"
            :key="i"
            type="button"
            @click="setRating(i)"
            class="transition-transform active:scale-95 group focus:outline-none"
            :aria-label="`Hodnotiť ${i} z 5 hviezdičiek`"
          >
            <Star
              class="w-8 h-8 transition-colors"
              :class="i <= formData.points ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-transparent group-hover:text-yellow-200'"
            />
          </button>
        </div>
      </div>

      <!-- Input Fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="review-name" class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Meno *</label>
          <input
            id="review-name"
            v-model="formData.name"
            type="text"
            required
            placeholder="Vaše meno"
            class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium"
          />
        </div>
        <div>
          <label for="review-email" class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email *</label>
          <input
            id="review-email"
            v-model="formData.email"
            type="email"
            required
            placeholder="vas@email.sk"
            class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium"
          />
        </div>
      </div>

      <div>
        <label for="review-title" class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Titulok recenzie *</label>
        <input
          id="review-title"
          v-model="formData.title"
          type="text"
          required
          placeholder="Stručné zhrnutie (napr. Skvelý bicykel!)"
          class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium"
        />
      </div>

      <div>
        <label for="review-content" class="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Vaša skúsenosť *</label>
        <textarea
          id="review-content"
          v-model="formData.content"
          required
          rows="5"
          :placeholder="`Napíšte nám viac o vašej skúsenosti (minimálne ${MIN_CONTENT_LENGTH} znakov)...`"
          class="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-brand focus:bg-white transition-all outline-none text-sm font-medium resize-none mb-1"
        ></textarea>
        <div class="flex justify-between items-center px-1">
          <p class="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Zostáva aspoň {{ Math.max(0, MIN_CONTENT_LENGTH - currentContentLength) }} znakov</p>
          <p :class="[currentContentLength >= MIN_CONTENT_LENGTH ? 'text-green-500' : 'text-gray-400']" class="text-[10px] font-bold">
            {{ currentContentLength }} znakov
          </p>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 text-red-600 p-4 flex items-start gap-3 text-sm animate-shake">
        <AlertCircle class="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p>{{ error }}</p>
      </div>

      <!-- Footer Buttons -->
      <div class="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
        <button
          type="button"
          @click="emit('cancel')"
          class="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          Zrušiť
        </button>
        <BaseButton
          type="submit"
          variant="primary"
          class="min-w-[180px]"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Odosielam...' : 'Odoslať recenziu' }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
.animate-shake {
  animation: shake 0.2s ease-in-out 0s 2;
}

@keyframes pulse-slow {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}
.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}
</style>
