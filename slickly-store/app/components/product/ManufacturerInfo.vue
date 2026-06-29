<script setup lang="ts">
import { Building2, MapPin, Globe, Phone, Mail } from 'lucide-vue-next';
import { sanitizeHtml } from '~/utils/sanitize';

const props = withDefaults(defineProps<{
  manufacturer: any;
  /** Ak je zadané, zobrazí CTA „Zobraziť všetky produkty" → tento link. null = skryté (sme na brand page). */
  productsLink?: string | null;
  /** Render názvu ako <h1> (brand page) namiesto <h5> (PDP tab). */
  heading?: boolean;
}>(), {
  productsLink: null,
  heading: false,
});

const manufacturerName = computed(() =>
  props.manufacturer?.translated?.name || props.manufacturer?.name || 'Výrobca'
);

const logoUrl = computed(() => props.manufacturer?.media?.url || null);

const description = computed(() => {
  const raw = props.manufacturer?.translated?.description || props.manufacturer?.description || '';
  return raw ? sanitizeHtml(raw) : '';
});

const cf = computed(() => ({
  ...(props.manufacturer?.customFields ?? {}),
  ...(props.manufacturer?.translated?.customFields ?? {}),
}));

const address = computed(() => {
  const raw = cf.value?.mtsport_vyrobca_adresa || '';
  return raw ? raw.replace(/<[^>]*>/g, '').trim() : null;
});

const phone = computed(() => cf.value?.mtsport_vyrobca_telefon || null);
const email = computed(() => cf.value?.mtsport_vyrobca_email || null);
const website = computed(() => props.manufacturer?.link || null);
</script>

<template>
  <div class="animate-fade-in font-sans">
    <div class="flex flex-col md:flex-row gap-8 items-start">

      <!-- Left: Logo card -->
      <div class="w-full md:w-1/3 border border-gray-200 flex flex-col items-center text-center overflow-hidden">
        <div class="w-full bg-white flex items-center justify-center p-6 border-b border-gray-100" style="min-height: 120px">
          <NuxtImg
            v-if="logoUrl"
            :src="logoUrl"
            :alt="manufacturerName"
            class="w-full h-auto max-h-24 object-contain"
            loading="lazy"
          />
          <Building2 v-else class="w-12 h-12 text-gray-300" />
        </div>
        <div class="p-6 flex flex-col items-center w-full">
          <component :is="heading ? 'h1' : 'h5'" class="font-black font-tech text-2xl uppercase mb-4">
            {{ manufacturerName }}
          </component>
          <NuxtLink
            v-if="productsLink"
            :to="productsLink"
            class="text-brand font-bold uppercase text-xs hover:underline"
          >
            Zobraziť všetky produkty →
          </NuxtLink>
        </div>
      </div>

      <!-- Right: Description + info -->
      <div class="flex-1">
        <div
          v-if="description"
          class="text-gray-600 leading-relaxed mb-6 text-sm"
          v-html="description"
        />
        <p v-else class="text-gray-400 italic text-sm mb-6">Popis výrobcu nie je k dispozícii.</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-if="address" class="flex items-start">
            <MapPin class="w-5 h-5 text-brand mr-3 mt-0.5 shrink-0" />
            <div>
              <span class="font-bold text-gray-900 block text-sm uppercase">Adresa</span>
              <span class="text-sm text-gray-600">{{ address }}</span>
            </div>
          </div>
          <div v-if="website" class="flex items-start">
            <Globe class="w-5 h-5 text-brand mr-3 mt-0.5 shrink-0" />
            <div>
              <span class="font-bold text-gray-900 block text-sm uppercase">Web</span>
              <a :href="website" target="_blank" rel="noopener" class="text-sm text-gray-600 hover:text-brand break-all">
                {{ website.replace(/^https?:\/\/(www\.)?/, '') }}
              </a>
            </div>
          </div>
          <div v-if="phone" class="flex items-start">
            <Phone class="w-5 h-5 text-brand mr-3 mt-0.5 shrink-0" />
            <div>
              <span class="font-bold text-gray-900 block text-sm uppercase">Tel. kontakt</span>
              <a :href="`tel:${phone}`" class="text-sm text-gray-600 hover:text-brand">{{ phone }}</a>
            </div>
          </div>
          <div v-if="email" class="flex items-start">
            <Mail class="w-5 h-5 text-brand mr-3 mt-0.5 shrink-0" />
            <div>
              <span class="font-bold text-gray-900 block text-sm uppercase">Emailová adresa</span>
              <a :href="`mailto:${email}`" class="text-sm text-gray-600 hover:text-brand">{{ email }}</a>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
