<script setup lang="ts">
import { Phone, Clock, BookOpen, Mail, ChevronDown, Check, MapPin, PhoneCall } from 'lucide-vue-next';
import CountrySwitcher from './CountrySwitcher.vue';
import { sanitizeHtml } from '~/utils/sanitize';
import AppModal from '~/components/ui/AppModal.vue';

const showHoursModal = ref(false);
const hours = ref<any>(null);

// Fetch otváracích hodín pri otvorení modalu
// sessionStorage cache 5 minút — vždy čerstvé, no rýchle opakované otvorenia
const SESSION_KEY = 'mtsport_hours_cache';
const SESSION_TTL = 5 * 60 * 1000; // 5 minút

const fetchHours = async () => {
  if (import.meta.client) {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const { ts, data } = JSON.parse(raw);
        if (Date.now() - ts < SESSION_TTL) {
          hours.value = data;
          return;
        }
      }
    } catch {}
  }
  try {
    const data = await $fetch('/api/store/hours');
    hours.value = data;
    if (import.meta.client) {
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ts: Date.now(), data })); } catch {}
    }
  } catch {
    hours.value = { od: '07:00', do: '17:00', denOd: 'Pondelok', denDo: 'Sobota', zatvorene: '', oznam: '', dovolenka: false };
  }
};

const openHoursModal = () => {
  showHoursModal.value = true;
  fetchHours();
};

const SK_DAYS = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'];

// Porovná dátumový string (rôzne formáty) s dnešným dátumom
function isToday(val: string): boolean {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const ymd = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const dmy = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}`;
  const dmyShort = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
  return val === ymd || val === dmy || val === dmyShort;
}

const isDovolenka = computed(() => !!(hours.value as any)?.dovolenka);

const isOpen = computed(() => {
  if (!isMounted.value || !hours.value) return false;
  if (isDovolenka.value) return false;          // dovolenka = vždy zatvorené

  const h = hours.value as any;
  const now   = new Date();
  const today = SK_DAYS[now.getDay()];
  const z     = String(h.zatvorene ?? '').trim();

  // Zatvorené: deň (napr. "Nedeľa") ALEBO dátum (napr. "2026-05-20", "20.5.2026")
  if (z && (today === z || isToday(z))) return false;

  const parse = (t: string) => { const [hh, mm] = (t || '').split(':').map(Number); return (hh || 0) * 60 + (mm || 0); };
  const nowMin = now.getHours() * 60 + now.getMinutes();
  return nowMin >= parse(h.od) && nowMin < parse(h.do);
});
import { useSessionContext, useInternationalization } from '#imports';
import { getLanguageName } from "@shopware/helpers";
import { useLanguageSwitcher } from '~/composables/useLanguageSwitcher';
import { useShopwareLanguage } from '~/composables/useShopwareLanguage';
import { getLocaleFromPath } from '~/utils/language';

const { sessionContext, currency, currencies, setCurrency, refreshSessionContext, languageIdChain } = useSessionContext() as any;
const { languages } = useInternationalization();
const { switchLanguage } = useLanguageSwitcher();
const route = useRoute();
const config = useRuntimeConfig();
const { t, locale: currentLocale } = useI18n();
const localePath = useLocalePath();
const contact = useAppConfig().contact;

const isMounted = ref(false);
onMounted(() => {
    isMounted.value = true;
});

const getFlagAndLabel = (code: string | undefined | null) => {
  const short = code?.split('-')[0]?.toLowerCase() || 'xx';
  
  const map: Record<string, { flag: string, label: string }> = {
    'sk': { flag: 'sk', label: 'SK' },
    'cs': { flag: 'cz', label: 'CZ' },
    'cz': { flag: 'cz', label: 'CZ' },
    'en': { flag: 'gb', label: 'EN' },
    'gb': { flag: 'gb', label: 'EN' },
    'hu': { flag: 'hu', label: 'HU' },
    'pl': { flag: 'pl', label: 'PL' },
    'de': { flag: 'de', label: 'DE' },
  };

  const match = map[short];
  const flagCode = match?.flag ?? 'xx';
  return {
    flagUrl: `https://flagcdn.com/w40/${flagCode}.png`,
    label: match?.label ?? short.toUpperCase().substring(0, 2)
  };
};

// PRIMARY: use URL path to strictly determine Flag (prevents Shopware Session hydration mismatch)
const currentLanguageLabel = computed(() => {
  const p = useRoute().path;
  if (p.startsWith('/cz') || p === '/cz') return getFlagAndLabel('cz');
  if (p.startsWith('/de') || p === '/de') return getFlagAndLabel('de');
  if (p.startsWith('/hu') || p === '/hu') return getFlagAndLabel('hu');
  if (p.startsWith('/en') || p === '/en') return getFlagAndLabel('en');
  if (p.startsWith('/pl') || p === '/pl') return getFlagAndLabel('pl');

  // Fallback to i18n locale
  if (currentLocale.value) {
    return getFlagAndLabel(currentLocale.value);
  }

  // 2nd priority: Shopware session context
  if (languages.value && languages.value.length > 0) {
    const currentLang = languages.value.find((l: any) => l.id === sessionContext.value?.context?.languageIdChain?.[0]);
    return getFlagAndLabel(currentLang?.translationCode?.code || 'sk');
  }

  const { getLocaleForLanguageId } = useShopwareLanguage();
  const langId = sessionContext.value?.context?.languageIdChain?.[0] as string;
  return getFlagAndLabel(langId ? getLocaleForLanguageId(langId) : 'sk');
});

const languagesList = computed(() => {
    const ORDER = ['SK', 'CZ', 'PL', 'EN', 'DE', 'HU'];

    // Ensure we safely map languages, avoiding undefined accesses during SSR
    let list = (languages.value || []).map((language) => {
      const translationCode = language.translationCode?.code || '';
      const mapping = getFlagAndLabel(translationCode);
      return {
        id: language.id,
        ...mapping,
        code: translationCode
      };
    });

    const ids = config.public.shopware.ids;

    if (list.length === 0) {
        list = [
          { id: ids.languages.sk, label: "SK", code: "sk-SK", flagUrl: "https://flagcdn.com/w40/sk.png" },
          { id: ids.languages.cz, label: "CZ", code: "cs-CZ", flagUrl: "https://flagcdn.com/w40/cz.png" },
          { id: ids.languages.pl, label: "PL", code: "pl-PL", flagUrl: "https://flagcdn.com/w40/pl.png" },
          { id: ids.languages.en, label: "EN", code: "en-GB", flagUrl: "https://flagcdn.com/w40/gb.png" },
          { id: ids.languages.de, label: "DE", code: "de-DE", flagUrl: "https://flagcdn.com/w40/de.png" },
          { id: ids.languages.hu, label: "HU", code: "hu-HU", flagUrl: "https://flagcdn.com/w40/hu.png" },
        ];
    }

    // Manually inject DE if missing
    const hasDe = list.some(l => l.code === 'de-DE' || l.label === 'DE');
    if (!hasDe && list.length > 0) {
        list.push({ id: ids.languages.de, flagUrl: 'https://flagcdn.com/w40/de.png', label: 'DE', code: 'de-DE' });
    }

    return list.sort((a, b) => {
        const ai = ORDER.indexOf(a.label);
        const bi = ORDER.indexOf(b.label);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
});


const safeCurrencies = computed(() => {
    if (currencies?.value && currencies.value.length > 0) return currencies.value;
    return [{ id: config.public.shopware.ids.currencies.eur, symbol: '€' }];
});
const handleCurrencyChange = async (currencyId: string) => {
    try {
        await setCurrency({ id: currencyId });
        refreshSessionContext();
    } catch (e) {
        console.error('Failed to set currency', e);
    }
};

const handleLanguageChange = async (languageId: string) => {
    console.log('[TopBar] Language switch clicked for ID:', languageId);
    try {
        await switchLanguage(languageId);
    } catch (e) {
        console.error('[TopBar] switchLanguage failed:', e);
    }
};

defineProps<{
  isScrolled: boolean;
  isHidden?: boolean;
}>();
</script>

<template>
  <div 
    class="bg-black text-white/80 text-[10px] font-normal uppercase tracking-wider hidden xl:block transition-all duration-150 ease-linear z-50 relative gpu-boost"
    :class="isHidden ? 'max-h-0 py-0 opacity-0 overflow-hidden pointer-events-none' : 'max-h-[44px] py-2 opacity-100 overflow-visible pointer-events-auto'"
    style="background-color: #000000 !important;"
  >
    <div class="container mx-auto px-4 lg:px-8 flex justify-between items-center h-full overflow-visible">
      <div class="flex items-center space-x-6">
        <a :href="contact.phone.mainHref" class="flex items-center hover:text-white transition-colors cursor-pointer">
          <Phone class="w-3 h-3 mr-2 text-brand" /> {{ contact.phone.mainDisplay }}
        </a>
        <a :href="contact.email.infoHref" class="flex items-center hover:text-white transition-colors cursor-pointer">
          <Mail class="w-3 h-3 mr-2 text-brand" /> {{ contact.email.info }}
        </a>
        <button
          class="flex items-center hover:text-white transition-colors cursor-pointer bg-transparent border-none text-white/80 font-normal uppercase tracking-wider text-[10px]"
          @click="openHoursModal"
        >
          <Clock class="w-3 h-3 mr-2 text-brand" /> {{ t('otvaracie_hodiny') }}
        </button>
      </div>
      <div class="flex items-center space-x-6">
        <!-- Language & Currency Switcher -->
        <div class="flex items-center space-x-4">
            <!-- Language Switcher (DISABLED for single-lang SK)
            <div class="relative group" v-if="languagesList.length > 1">
                <button class="flex items-center hover:text-white transition-colors space-x-1 cursor-pointer bg-black" style="background-color: #000000;">
                   <img :key="currentLanguageLabel.label + '_flag'" :src="currentLanguageLabel.flagUrl" :alt="currentLanguageLabel.label" class="mr-2 w-5 h-3.5 rounded-[1px] shadow-sm object-cover" />
                   <span :key="currentLanguageLabel.label + '_text'" class="uppercase">{{ currentLanguageLabel.label }}</span>
                   <ChevronDown class="w-3 h-3 ml-1" />
                </button>
                <div class="absolute top-full right-0 bg-white border border-gray-200 shadow-lg rounded-sm py-1 min-w-[120px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <button 
                        type="button"
                        v-for="lang in languagesList" 
                        :key="lang.id"
                        @click="handleLanguageChange(lang.id)"
                        class="w-full text-left px-4 py-2 hover:bg-black hover:text-white text-xs font-bold uppercase text-black flex justify-between items-center transition-colors"
                        :class="{'text-brand': lang.label === currentLanguageLabel.label}"
                    >
                        <span class="flex items-center gap-3">
                             <img :src="lang.flagUrl" :alt="lang.label" class="w-5 h-3.5 rounded-[1px] shadow-sm object-cover" />
                             <span>{{ lang.label }}</span>
                        </span>
                        <Check v-if="lang.label === currentLanguageLabel.label" class="w-3 h-3 text-brand" />
                    </button>
                </div>
            </div>

            <div class="h-3 w-px bg-zinc-800" v-if="languagesList.length > 1"></div>
            -->

            <!-- Currency Switcher -->
            <div class="relative group" v-if="safeCurrencies?.length > 1">
                <button class="flex items-center hover:text-white transition-colors space-x-1 cursor-pointer bg-transparent border-none text-white/80 font-normal" aria-label="Zmeniť menu">
                   <span>{{ currency?.symbol || '€' }}</span>
                   <ChevronDown class="w-3 h-3" />
                </button>
                 <div class="absolute top-full right-0 bg-white border border-gray-200 shadow-lg rounded-sm py-1 min-w-[80px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <button 
                        v-for="curr in safeCurrencies" 
                        :key="curr.id"
                        @click="handleCurrencyChange(curr.id)"
                        class="w-full text-left px-4 py-2 hover:bg-black hover:text-white text-xs font-bold uppercase text-black flex justify-between items-center transition-colors"
                         :class="{'text-brand': curr.id === currency?.id}"
                    >
                        {{ curr.symbol }}
                        <Check v-if="curr.id === currency?.id" class="w-3 h-3 text-brand" />
                    </button>
                </div>
            </div>
             <div class="h-3 w-px bg-zinc-800" v-if="safeCurrencies?.length > 1"></div>
        </div>

        <NuxtLink 
          :to="localePath('/blog', currentLocale as any)"
          class="flex items-center text-white hover:text-brand transition-colors font-medium tracking-[0.1em]"
        >
          <BookOpen class="w-3.5 h-3.5 mr-1.5 text-brand" />
          {{ t('magazin') }}
        </NuxtLink>
        <div class="h-3 w-px bg-white/10"></div>
        <NuxtLink to="/kontakty" class="hover:text-white transition-colors">
          {{ t('kontakty') }}
        </NuxtLink>
        <NuxtLink to="/vsetko-o-nakupe" class="hover:text-white transition-colors">
          {{ t('vsetko_o_nakupe') }}
        </NuxtLink>
        <NuxtLink to="/o-nas" class="hover:text-white transition-colors">
          {{ t('o_nas') }}
        </NuxtLink>
        <div class="h-3 w-px bg-white/10"></div>
        <!-- Country Switcher — krajina doručenia / DPH prepočet -->
        <ClientOnly>
          <CountrySwitcher variant="dark" />
        </ClientOnly>
      </div>
    </div>
  </div>

  <!-- Mobilný kontaktný pruh (skrytý na xl+, kde je plný TopBar) -->
  <div class="flex xl:hidden items-center justify-between bg-black text-white/70 text-[10px] uppercase tracking-wider px-4 py-2">
    <a
      :href="contact.phone.mainHref"
      class="flex items-center gap-1.5 hover:text-white transition-colors"
    >
      <Phone class="w-3 h-3 text-brand" aria-hidden="true" />
      {{ contact.phone.mainDisplay }}
    </a>
    <button
      class="flex items-center gap-1.5 hover:text-white transition-colors bg-transparent border-none text-white/70 uppercase tracking-wider text-[10px] cursor-pointer"
      @click="openHoursModal"
    >
      <Clock class="w-3 h-3 text-brand" aria-hidden="true" />
      {{ t('otvaracie_hodiny') }}
    </button>
  </div>

  <!-- Otváracie hodiny modal — štandardný AppModal (design.md §23) -->
  <AppModal :is-open="showHoursModal" title="KEDY MÁME OTVORENÉ?" @close="showHoursModal = false">
    <!-- Prefix: ikona + červený label nad titulkom -->
    <template #prefix>
      <div class="flex items-center gap-2 mb-3">
        <Clock class="w-4 h-4 text-brand" />
        <span class="text-brand text-xs font-bold uppercase tracking-widest font-sans">Otváracie hodiny</span>
      </div>
    </template>

    <div class="flex flex-col gap-5">

      <!-- Dovolenka / mimoriadne zatvorenie -->
      <div v-if="isDovolenka" class="bg-gray-900 text-white px-4 py-3 text-sm font-sans leading-snug">
        <p class="font-bold text-brand uppercase tracking-wide text-xs font-tech mb-1">Dnes zatvorené</p>
        <p>Kamenná predajňa je dnes zatvorená. Online podpora e-shopu je obmedzená.</p>
      </div>

      <!-- Hours -->
      <div class=">">
        <div class="flex justify-between items-center py-3 border-b border-gray-100">
          <span class="text-xs font-bold uppercase tracking-widest text-gray-500 font-sans">
            {{ hours?.denOd }} — {{ hours?.denDo }}
          </span>
          <span class="font-tech font-black text-lg text-black">
            {{ hours?.od }} – {{ hours?.do }}
          </span>
        </div>
        <div v-if="hours?.zatvorene && String(hours.zatvorene).trim() && hours.zatvorene !== 'false'" class="flex justify-between items-center py-3 border-b border-gray-100">
          <span class="text-xs font-bold uppercase tracking-widest text-gray-500 font-sans">{{ hours.zatvorene }}</span>
          <span class="font-tech font-black text-sm text-gray-400">Zatvorené</span>
        </div>
      </div>

      <!-- Oznam — šedé pozadie, o niečo väčší text -->
      <div
        v-if="hours?.oznam && String(hours.oznam).trim()"
        class="text-sm text-gray-700 font-sans leading-relaxed bg-gray-50 px-4 py-3 border-l-2 border-brand"
        v-html="sanitizeHtml(String(hours.oznam))"
      ></div>

      <!-- Sme k dispozícii -->
      <div v-if="isOpen" class="bg-green-50 border border-green-100 p-4">
        <div class="flex items-center gap-2 mb-4">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span class="text-xs font-bold uppercase tracking-widest text-green-700 font-sans">Sme k dispozícii</span>
        </div>
        <div class="flex flex-col gap-3">
          <a href="tel:+421910199178" class="flex items-center gap-3 text-sm font-sans text-gray-700 hover:text-brand transition-colors">
            <PhoneCall class="w-4 h-4 text-brand flex-shrink-0" />
            <span>Predajňa: <strong>0910 199 178</strong></span>
          </a>
          <a href="tel:+421948993236" class="flex items-center gap-3 text-sm font-sans text-gray-700 hover:text-brand transition-colors">
            <PhoneCall class="w-4 h-4 text-brand flex-shrink-0" />
            <span>E-shop: <strong>0948 993 236</strong></span>
          </a>
        </div>
      </div>

      <!-- Adresa → Google Maps -->
      <a
        href="https://www.google.com/maps/search/?api=1&query=Hradsk%C3%A1+141%2F22%2C+029+51+Lokca"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-start gap-4 bg-gray-50 p-4 hover:bg-gray-100 transition-colors group"
      >
        <MapPin class="w-5 h-5 text-brand mt-0.5 flex-shrink-0" />
        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-gray-500 font-sans mb-1">Adresa predajne</p>
          <p class="font-tech font-black uppercase text-sm text-black leading-tight mb-0.5">SLICKLY</p>
          <p class="font-sans text-sm text-gray-600 group-hover:text-brand transition-colors">Hradská 141/22, 029 51 Lokca</p>
        </div>
      </a>

    </div>
  </AppModal>
</template>
