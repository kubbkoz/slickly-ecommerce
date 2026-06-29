<script setup lang="ts">
import { Eye, Loader2, Check } from 'lucide-vue-next';
import AppModal from '~/components/ui/AppModal.vue';

const props = defineProps<{
  isOpen: boolean;
  product: any;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const name = ref('');
const email = ref('');
const phone = ref('');
const selectedVariant = ref('');
const gdprConsent = ref(false);
const honeypot = ref('');
const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle');
const errorMsg = ref('');

const variants = computed(() =>
  props.product?.variants?.map((v: any) => ({ value: v.id, label: v.size })) || []
);

const isValid = computed(() =>
  name.value.trim() && email.value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) && gdprConsent.value
);

watch(() => props.isOpen, (open) => {
  if (open) { state.value = 'idle'; errorMsg.value = ''; }
});

const handleSubmit = async () => {
  if (!isValid.value || state.value === 'loading') return;
  state.value = 'loading';
  try {
    const res = await $fetch<any>('/api/watchdog/subscribe', {
      method: 'POST',
      body: {
        name: name.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim() || undefined,
        productId: props.product?.id,
        productName: props.product?.name,
        variantLabel: selectedVariant.value || undefined,
        productPrice: props.product?.price || props.product?.calculatedPrice?.unitPrice || null,
        productStock: props.product?._raw?.availableStock ?? props.product?.availableStock ?? null,
        gdprConsent: gdprConsent.value,
        website: honeypot.value,
      },
    });
    if (res.success) { state.value = 'success'; }
    else { state.value = 'error'; errorMsg.value = res.error || 'Nastala chyba.'; }
  } catch {
    state.value = 'error';
    errorMsg.value = 'Nastala chyba pri odosielaní.';
  }
};
</script>

<template>
  <AppModal :is-open="isOpen" title="Stráženie dostupnosti" @close="emit('close')">
    <div class="px-2 py-4">
      <!-- Success -->
      <div v-if="state === 'success'" class="text-center py-8 animate-fade-in">
        <div class="w-16 h-16 bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-6">
          <Check class="w-8 h-8 text-green-600" />
        </div>
        <h3 class="font-tech font-bold uppercase text-lg mb-2">Stráženie aktivované</h3>
        <p class="text-gray-500 text-sm font-sans mb-6">Budeme Vás informovať o zmene dostupnosti alebo ceny produktu.</p>
        <button @click="emit('close')" class="px-8 py-3 bg-black text-white font-tech font-bold uppercase tracking-widest text-sm hover:bg-brand transition-colors">Zavrieť</button>
      </div>

      <!-- Form -->
      <template v-else>
        <p class="text-sm text-gray-500 font-sans mb-6">Vyplňte údaje a budeme Vás informovať, keď sa zmení dostupnosť alebo cena produktu <strong class="text-black">{{ product?.name }}</strong>.</p>

        <div class="space-y-4">
          <div>
            <label class="form-label">Meno *</label>
            <input v-model="name" type="text" class="form-input w-full" placeholder="Vaše meno" />
          </div>
          <div>
            <label class="form-label">Email *</label>
            <input v-model="email" type="email" class="form-input w-full" placeholder="vas@email.sk" />
          </div>
          <div>
            <label class="form-label">Telefón</label>
            <input v-model="phone" type="tel" class="form-input w-full" placeholder="+421 ..." />
          </div>
          <div v-if="variants.length > 1">
            <label class="form-label">Variant</label>
            <select v-model="selectedVariant" class="form-input w-full">
              <option value="">Všetky varianty</option>
              <option v-for="v in variants" :key="v.value" :value="v.label">{{ v.label }}</option>
            </select>
          </div>

          <!-- Honeypot -->
          <div class="absolute -left-[9999px]" aria-hidden="true">
            <input v-model="honeypot" type="text" name="website" tabindex="-1" autocomplete="off" />
          </div>

          <label class="flex items-start gap-2 cursor-pointer">
            <input v-model="gdprConsent" type="checkbox" class="mt-1 w-4 h-4 accent-brand flex-shrink-0" />
            <span class="text-xs text-gray-500 font-sans">Súhlasím so spracovaním osobných údajov za účelom notifikácie o dostupnosti produktu. *</span>
          </label>
        </div>

        <p v-if="errorMsg" class="text-sm text-red-500 mt-3">{{ errorMsg }}</p>

        <button
          @click="handleSubmit"
          :disabled="!isValid || state === 'loading'"
          class="w-full mt-6 py-4 bg-brand text-white font-tech font-bold uppercase tracking-widest text-sm hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Loader2 v-if="state === 'loading'" class="w-4 h-4 animate-spin" />
          <Eye v-else class="w-4 h-4" />
          {{ state === 'loading' ? 'Odosielam...' : 'Aktivovať stráženie' }}
        </button>
      </template>
    </div>
  </AppModal>
</template>
