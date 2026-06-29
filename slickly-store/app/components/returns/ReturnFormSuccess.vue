<script setup lang="ts">
import { CheckCircle2 } from 'lucide-vue-next';

const props = defineProps<{
  referenceNumber: string;
  email: string;
  formType: 'vratenie' | 'reklamacia';
}>();
</script>

<template>
  <div class="text-center py-8 px-4">
    <div class="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
      <CheckCircle2 class="w-10 h-10 text-green-600" />
    </div>

    <h2 class="font-tech text-2xl font-black uppercase tracking-wider mb-3">
      Žiadosť bola úspešne prijatá
    </h2>

    <p class="text-sm text-gray-600 mb-6">
      {{ formType === 'reklamacia' ? 'Reklamačné' : 'Vrátenie' }} konanie sme prijali a začneme ho spracovávať.
    </p>

    <div class="inline-block border-2 border-brand bg-brand/5 px-6 py-3 mb-6">
      <p class="text-[10px] uppercase tracking-widest text-brand font-tech mb-1">Referenčné číslo</p>
      <p class="text-2xl font-bold font-tech text-brand">{{ referenceNumber }}</p>
    </div>

    <div class="text-sm text-gray-600 max-w-md mx-auto space-y-2">
      <p>📧 Potvrdenie o prijatí sme poslali na <strong>{{ email }}</strong></p>
      <p>📦 Tovar zasielajte na adresu <strong>SLICKLY, Hradská 141/22, 029 51 Lokca</strong></p>
      <p>⏱ Naše oddelenie vás bude kontaktovať do <strong>3 pracovných dní</strong></p>
    </div>
  </div>
</template>
