<script setup lang="ts">
import { PhoneCall, Mail, Clock, MessageCircle } from 'lucide-vue-next';

const { data: hours } = useAsyncData('store-hours-section', () =>
  $fetch<any>('/api/store/hours'),
  { getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key] }
);

const SK_DAYS = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'];

const isMounted = ref(false);
onMounted(() => { isMounted.value = true; });

const isDovolenka = computed(() => !!(hours.value as any)?.dovolenka);

function isToday(val: string): boolean {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const ymd = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const dmy = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}`;
  return val === ymd || val === dmy;
}

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
</script>

<template>
  <section class="bg-black text-white">
    <div class="max-w-[1536px] mx-auto px-4 lg:px-8 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

        <!-- LEFT — text -->
        <div>
          <h2 class="font-tech font-black uppercase text-2xl tracking-wide text-white mb-4">
            Potrebujete pomôcť s výberom?
          </h2>
          <div class="section-decorator mb-8"></div>

          <p class="font-sans text-base text-gray-400 font-normal leading-relaxed mb-8 max-w-xl">
            V prípade akýchkoľvek otázok ohľadom výberu produktu, jeho špecifikácie,
            alebo ak chcete iba doladiť správne príslušenstvo, neváhajte nás kontaktovať.
          </p>

          <!-- Info bloky -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <!-- Kontakt -->
            <div class="relative overflow-hidden bg-zinc-900 p-6">
              <MessageCircle class="absolute top-5 right-5 w-12 h-12 text-brand opacity-30 pointer-events-none" />
              <div class="relative z-10">
                <h3 class="font-tech font-black uppercase tracking-wide text-white text-lg mb-4">Kontakt</h3>
                <a
                  href="tel:+421918564238"
                  class="flex items-center gap-2 font-sans text-sm text-gray-400 hover:text-brand transition-colors mb-2"
                >
                  <PhoneCall class="w-4 h-4 text-brand flex-shrink-0" />
                  <span>E-shop: <strong class="text-white font-bold">+421 918 564 238</strong></span>
                </a>
                <a
                  href="mailto:info@slickly.sk"
                  class="flex items-center gap-2 font-sans text-sm text-gray-400 hover:text-brand transition-colors"
                >
                  <Mail class="w-4 h-4 text-brand flex-shrink-0" />
                  <span><strong class="text-white font-bold">info@slickly.sk</strong></span>
                </a>
              </div>
            </div>

            <!-- Online hodiny -->
            <div class="relative overflow-hidden bg-zinc-900 p-6">
              <Clock class="absolute top-5 right-5 w-12 h-12 text-brand opacity-30 pointer-events-none" />
              <div class="relative z-10">
                <h3 class="font-tech font-black uppercase tracking-wide text-white text-lg mb-4">Online podpora</h3>
                <div class="font-sans text-sm text-gray-400 leading-relaxed space-y-1">
                  <p>{{ hours?.denOd }} – {{ hours?.denDo }}: <strong class="text-white font-bold">{{ hours?.od }} – {{ hours?.do }}</strong></p>
                  <p v-if="hours?.zatvorene && String(hours.zatvorene).trim() && hours.zatvorene !== 'false'">
                    {{ hours.zatvorene }}: <span class="text-gray-500">Nedostupné</span>
                  </p>
                </div>

                <ClientOnly>
                  <div v-if="!isDovolenka" class="flex items-center gap-2 mt-4">
                    <span class="relative flex h-2.5 w-2.5">
                      <span v-if="isOpen" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2.5 w-2.5" :class="isOpen ? 'bg-green-500' : 'bg-gray-600'"></span>
                    </span>
                    <span class="text-xs font-bold uppercase tracking-widest font-sans" :class="isOpen ? 'text-green-400' : 'text-gray-500'">
                      {{ isOpen ? 'Sme online' : 'Momentálne offline' }}
                    </span>
                  </div>
                  <div v-else class="mt-4 bg-brand/10 border-l-2 border-brand pl-3 py-2">
                    <p class="text-brand font-bold uppercase tracking-wide text-xs font-tech">Dovolenka</p>
                  </div>
                </ClientOnly>
              </div>
            </div>

          </div>
        </div>

        <!-- RIGHT — CTA buttons -->
        <div class="flex flex-col items-start lg:items-end justify-center lg:pt-16 gap-4">
          <a
            href="tel:+421918564238"
            class="inline-flex items-center gap-3 bg-brand hover:bg-red-700 text-white font-tech font-bold uppercase tracking-widest text-sm px-8 py-4 transition-colors w-full sm:w-auto justify-center"
          >
            <PhoneCall class="w-5 h-5" /> Zavolajte nám
          </a>
          <a
            href="mailto:info@mtsport.sk"
            class="inline-flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-tech font-bold uppercase tracking-widest text-sm px-8 py-4 transition-colors w-full sm:w-auto justify-center"
          >
            <Mail class="w-5 h-5" /> Napíšte nám
          </a>
        </div>

      </div>
    </div>
  </section>
</template>
