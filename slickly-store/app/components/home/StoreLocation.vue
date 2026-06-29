<script setup lang="ts">
import { ArrowRight, PhoneCall, MapPin, Clock, Mail, Navigation } from 'lucide-vue-next';
import { useShopwareContext, useAsyncData, useRuntimeConfig, useLocalePath } from '#imports';
import { sanitizeHtml } from '~/utils/sanitize';

const config = useRuntimeConfig();
const localePath = useLocalePath();
const { apiClient } = useShopwareContext();
const { currentLanguageId } = useShopwareLanguage();
const contact = useAppConfig().contact;

const KAMENNA_CATEGORY_ID = config.public.shopware.ids.categories.kamenna as string;

// ─── Kategória „Kamenná predajňa" — nadpis + popis + obrázok (language-aware) ──
const { data: category } = await useAsyncData(
  `kamenna-category-${currentLanguageId.value}`,
  async () => {
    try {
      const res: any = await apiClient.invoke('readCategoryList post /category' as any, {
        headers: { 'sw-language-id': currentLanguageId.value },
        body: {
          filter: [{ type: 'equals', field: 'id', value: KAMENNA_CATEGORY_ID }],
          associations: { media: {} },
          includes: {
            category: ['id', 'name', 'translated', 'description', 'media'],
            media: ['url', 'alt'],
          },
          limit: 1,
        },
      });
      const cat = res.data?.elements?.[0];
      if (!cat) return null;
      return {
        name: cat.translated?.name || cat.name || '',
        description: cat.translated?.description || cat.description || '',
        image: cat.media?.url || '',
      };
    } catch {
      return null;
    }
  },
  { watch: [currentLanguageId] }
);

const heading = computed(() => category.value?.name || 'Kamenná predajňa');
const popis = computed(() => category.value?.description || '');
const storeImage = computed(
  () => category.value?.image
    || 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?q=80&w=1200&auto=format&fit=crop'
);

// ─── Otváracie hodiny — rovnaký zdroj ako TopBar modal (/api/store/hours) ──────
const { data: hours } = await useAsyncData('store-hours-section', () =>
  $fetch<any>('/api/store/hours')
);

const SK_DAYS = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'];

function isToday(val: string): boolean {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const ymd = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const dmy = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}`;
  const dmyShort = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
  return val === ymd || val === dmy || val === dmyShort;
}

const isMounted = ref(false);
onMounted(() => { isMounted.value = true; });

const isDovolenka = computed(() => !!(hours.value as any)?.dovolenka);

const isOpen = computed(() => {
  if (!isMounted.value || !hours.value) return false;
  if (isDovolenka.value) return false;

  const h = hours.value as any;
  const now = new Date();
  const today = SK_DAYS[now.getDay()];
  const z = String(h.zatvorene ?? '').trim();
  if (z && (today === z || isToday(z))) return false;

  const parse = (t: string) => { const [hh, mm] = (t || '').split(':').map(Number); return (hh || 0) * 60 + (mm || 0); };
  const nowMin = now.getHours() * 60 + now.getMinutes();
  return nowMin >= parse(h.od) && nowMin < parse(h.do);
});

const openStatusLabel = computed(() => {
  if (!isMounted.value || !hours.value || isDovolenka.value) return null;
  const h = hours.value as any;
  const now = new Date();
  const today = SK_DAYS[now.getDay()];
  const z = String(h.zatvorene ?? '').trim();
  if (z && (today === z || isToday(z))) return null;

  const parse = (t: string) => { const [hh, mm] = (t || '').split(':').map(Number); return (hh || 0) * 60 + (mm || 0); };
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const openMin = parse(h.od);
  const closeMin = parse(h.do);

  if (nowMin < openMin && (openMin - nowMin) <= 30) return 'opening';
  if (nowMin >= openMin && nowMin < closeMin && (closeMin - nowMin) <= 20) return 'closing';
  return null;
});

// Adresa — Google Maps deeplink (rovnaká logika ako TopBar modal)
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Hradsk%C3%A1+141%2F22%2C+029+51+Lokca';
</script>

<template>
  <section class="py-20 md:py-24 bg-black text-white">
    <div class="container mx-auto px-4 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

        <!-- LEFT — text + info box -->
        <div>
          <h2 class="section-h2 text-white mb-4">Predajňa <span class="text-brand">MT</span>SPORT Lokca</h2>
          <div class="section-decorator mb-8"></div>

          <!-- Popis — z kategórie -->
          <div
            v-if="popis"
            class="font-sans text-base md:text-lg text-gray-400 font-light leading-relaxed mtsport-rich"
            v-html="sanitizeHtml(popis)"
          ></div>

          <!-- Info bloky — tmavá šedá, bez borderov, veľká odseknutá brand ikona -->
          <div class="mt-10 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <!-- Adresa — celý blok NIE je klikateľný, iba button „Získať trasu" -->
              <div class="relative overflow-hidden bg-zinc-900 p-6">
                <MapPin class="absolute top-5 right-5 w-12 h-12 text-brand opacity-30 pointer-events-none" />
                <div class="relative z-10">
                  <h3 class="font-tech font-black uppercase tracking-wide text-white text-lg mb-4">Adresa</h3>
                  <p class="font-sans text-sm font-bold text-white mb-1">SLICKLY</p>
                  <p class="font-sans text-sm text-gray-400 leading-relaxed">Hradská 141/22</p>
                  <p class="font-sans text-sm text-gray-400 leading-relaxed">029 51 Lokca</p>

                  <a
                    :href="MAPS_URL"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 mt-5 px-4 py-2.5 border border-white/20 hover:border-brand hover:bg-brand text-white font-tech font-bold uppercase tracking-widest text-xs transition-colors"
                  >
                    <Navigation class="w-4 h-4" /> Získať trasu
                  </a>
                </div>
              </div>

              <!-- Otváracie hodiny — hodiny + dostupnosť + tel. predajne -->
              <div class="relative overflow-hidden bg-zinc-900 p-6">
                <Clock class="absolute top-5 right-5 w-12 h-12 text-brand opacity-30 pointer-events-none" />
                <div class="relative z-10">
                  <h3 class="font-tech font-black uppercase tracking-wide text-white text-lg mb-4">Otváracie hodiny</h3>
                  <div class="font-sans text-sm text-gray-400 leading-relaxed space-y-1">
                    <p>{{ hours?.denOd }} – {{ hours?.denDo }}: <strong class="text-white font-semibold">{{ hours?.od }} – {{ hours?.do }}</strong></p>
                    <p v-if="hours?.zatvorene && String(hours.zatvorene).trim() && hours.zatvorene !== 'false'">
                      {{ hours.zatvorene }}: <span class="text-gray-500">Zatvorené</span>
                    </p>
                  </div>

                  <!-- Dovolenka — mimoriadne zatvorenie (custom field), ako v modale -->
                  <ClientOnly>
                    <div v-if="isDovolenka" class="mt-4 bg-brand/10 border-l-2 border-brand pl-3 py-2">
                      <p class="text-brand font-bold uppercase tracking-wide text-xs font-tech mb-0.5">Dnes zatvorené</p>
                      <p class="text-gray-400 text-xs font-sans">Kamenná predajňa má dovolenku.</p>
                    </div>
                  </ClientOnly>

                  <!-- Info o dostupnosti -->
                  <ClientOnly>
                    <div v-if="!isDovolenka" class="flex items-center gap-2 mt-4">
                      <span class="relative flex h-2.5 w-2.5">
                        <span
                          v-if="isOpen && !openStatusLabel"
                          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
                        ></span>
                        <span
                          class="relative inline-flex rounded-full h-2.5 w-2.5"
                          :class="openStatusLabel ? 'bg-orange-500' : isOpen ? 'bg-green-500' : 'bg-gray-600'"
                        ></span>
                      </span>
                      <span
                        class="text-xs font-bold uppercase tracking-widest font-sans"
                        :class="openStatusLabel ? 'text-orange-400' : isOpen ? 'text-green-400' : 'text-gray-500'"
                      >
                        {{ openStatusLabel === 'opening' ? 'Čoskoro otvárame' : openStatusLabel === 'closing' ? 'Čoskoro zatvárame' : isOpen ? 'Otvorené teraz' : 'Momentálne zatvorené' }}
                      </span>
                    </div>
                  </ClientOnly>

                  <!-- Tel. predajne -->
                  <a
                    :href="`tel:${contact.phone.store}`"
                    class="flex items-center gap-2 mt-3 font-sans text-sm text-gray-400 hover:text-brand transition-colors"
                  >
                    <PhoneCall class="w-4 h-4 text-brand flex-shrink-0" />
                    <span>Predajňa: <strong class="text-white font-semibold">{{ contact.phone.storeDisplay }}</strong></span>
                  </a>
                </div>
              </div>

            </div>

            <!-- Oznam predajne — vlastný blok pod adresou a hodinami -->
            <div
              v-if="hours?.oznam && String(hours.oznam).trim()"
              class="relative overflow-hidden bg-zinc-900 p-6"
            >
              <Mail class="absolute top-5 right-5 w-12 h-12 text-brand opacity-30 pointer-events-none" />
              <div class="relative z-10">
                <h3 class="font-tech font-black uppercase tracking-wide text-white text-lg mb-4">Oznam predajne</h3>
                <div
                  class="font-sans text-sm text-gray-300 leading-relaxed mtsport-rich"
                  v-html="sanitizeHtml(String(hours.oznam))"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT — obrázok + button pod ním -->
        <div class="relative">
          <!-- Obrovský vertikálny overlay text — trčí zpod obrázka -->
          <span
            class="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-visible"
            aria-hidden="true"
          >
            <span class="font-tech font-black uppercase tracking-tighter text-white/[0.07] leading-none text-[4.5rem] lg:text-[6.5rem] [writing-mode:vertical-rl]">
              SLICKLY
            </span>
          </span>

          <NuxtLink
            :to="localePath('/kamenna-predajna')"
            class="relative z-10 block aspect-square w-full overflow-hidden group"
          >
            <NuxtImg
              :src="storeImage"
              :alt="heading"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </NuxtLink>

          <div class="flex justify-end mt-6">
            <NuxtLink
              :to="localePath('/kamenna-predajna')"
              class="inline-flex items-center gap-3 bg-brand hover:bg-brand-dark text-white font-tech font-bold uppercase tracking-widest text-sm px-8 py-4 transition-colors"
            >
              Viac o predajni <ArrowRight class="w-5 h-5" />
            </NuxtLink>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
