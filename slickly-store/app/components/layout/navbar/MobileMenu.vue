<script setup lang="ts">
import { X, User, MapPin, ChevronRight, ChevronDown, Phone, Info, BookOpen, Mail, Clock, Check } from 'lucide-vue-next';
import { useNavigation, useSessionContext, useInternationalization, useUser, useShopwareContext, useShopwareLanguage, useI18n, useLocalePath, useRuntimeConfig, useRoute, useRouter, useAsyncData, nextTick } from '#imports';
import type { Schemas } from '#shopware';
import { getLanguageName } from "@shopware/helpers";
import { useLanguageSwitcher } from '~/composables/useLanguageSwitcher';
import { getLanguageIdFromPath, getLocaleFromPath } from '~/utils/language';
import { getCategoryUrl } from '~/utils/url';
import Logo from '~/components/layout/navbar/Logo.vue';
import CountrySwitcher from '~/components/layout/navbar/CountrySwitcher.vue';

/**
 * SLICKLY Mobile Menu — v5 Performance & Layout Fix
 * ------------------------------------------------
 * This component is Teleported to <body> to avoid Navbar constraints.
 * It uses aggressive edge-to-edge styling to fix the white gap on the right.
 */

// ── SYNC COMPOSABLES (At the absolute top to prevent Nuxt instance loss) ────────
const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const localePath = useLocalePath();
const { t, locale: currentLocale } = useI18n();
const contact = useAppConfig().contact;
const { apiClient } = useShopwareContext();
const { currentLanguageId } = useShopwareLanguage();
const { user, isLoggedIn } = useUser();
// @ts-ignore
const { currency, currencies, setCurrency, refreshSessionContext } = useSessionContext();
const { languages, changeLanguage } = useInternationalization();
const { switchLanguage } = useLanguageSwitcher();

// State
const isLoginModalOpen = useState('loginModalOpen', () => false);
const mobileExpandedCategory = ref<string | null>(null);
const storeHours = ref<any>(null);

onMounted(async () => {
  try {
    const key = 'mtsport_hours_cache';
    const cached = sessionStorage.getItem(key);
    if (cached) {
      const { data, ts } = JSON.parse(cached);
      if (Date.now() - ts < 5 * 60 * 1000) { storeHours.value = data; return; }
    }
    const data = await $fetch('/api/store/hours');
    storeHours.value = data;
    sessionStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
});
// Set of expanded sub-category ids (level 2 → reveals level 3 children)
const expandedSubcategories = ref<Set<string>>(new Set());
const isLanguageOpen = ref(false);
const isCurrencyOpen = ref(false);

const toggleSubcategory = (id: string) => {
  if (expandedSubcategories.value.has(id)) {
    expandedSubcategories.value.delete(id);
  } else {
    expandedSubcategories.value.add(id);
  }
  // Trigger reactivity (Vue 3 Set mutation doesn't auto-trigger)
  expandedSubcategories.value = new Set(expandedSubcategories.value);
};

const rootCategoryId = config.public.shopware.ids.rootCategory;

// Emits
const emit = defineEmits(['close', 'navigate']);

// Props
const props = defineProps<{
  isOpen: boolean;
}>();

// ⚡ NO 'await' — sync component, žiadny Suspense re-mount pri SPA navigácii.
// SSR payload sa reuse-ne cez getCachedData → klient nefetchuje druhýkrát.
const { data: navigationElements } = useAsyncData(
  `mobile-nav-v5-${currentLanguageId.value}`,
  async () => {
    if (!rootCategoryId) return [];
    try {
      // Navigation route — rešpektuje Admin poradie súrodencov (raw /category
      // search defaultne triedi podľa technického ID, nie podľa Admin stromu).
      const response = await apiClient.invoke("readNavigation post /navigation/{activeId}/{rootId}", {
        pathParams: { activeId: rootCategoryId, rootId: rootCategoryId },
        body: { depth: 3 },
        headers: {
          'sw-language-id': currentLanguageId.value
        }
      });
      return response.data || [];
    } catch (e) {
      console.error('MobileMenu: Failed to fetch navigation', e);
      return [];
    }
  },
  {
    lazy: true,
    watch: [currentLanguageId],
    default: () => [],
    getCachedData(key) {
      const nuxtApp = useNuxtApp();
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    }
  }
);

const toggleMobileCategory = (categoryId: string) => {
  if (mobileExpandedCategory.value === categoryId) {
    mobileExpandedCategory.value = null;
    expandedSubcategories.value = new Set();
  } else {
    mobileExpandedCategory.value = categoryId;
    expandedSubcategories.value = new Set();
  }
};

const handleLinkClick = (path: string) => {
    // Zatvor menu FIRST → DOM transition začne okamžite
    // Navigovať až po nextTick → user vidí zatváranie počas route resolve
    emit('close');
    nextTick(() => router.push(path));
}

const handleLoginClick = () => {
    if (isLoggedIn.value) {
        handleLinkClick(localePath('/account', currentLocale.value as any));
    } else {
        emit('close');
        isLoginModalOpen.value = true;
    }
}

const buildChildUrl = (parent: any, child: any): string => {
    const parentSlug = getCategoryUrl(parent).replace(/^\//, '');
    const childSlug = getCategoryUrl(child).replace(/^\//, '');
    if (parentSlug && !parentSlug.startsWith('navigation/') && childSlug && !childSlug.startsWith('navigation/')) {
        return `/${parentSlug}/${childSlug}`;
    }
    return `/${childSlug}`;
};

const onClose = () => emit('close');

const getFlagAndLabel = (code: string | undefined | null) => {
  const short = code?.split('-')[0]?.toLowerCase();
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
  const match = map[short || ''];
  const flagCode = match?.flag ?? 'xx';
  return {
    flagUrl: `https://flagcdn.com/w40/${flagCode}.png`,
    label: match?.label ?? short?.substring(0, 2).toUpperCase() ?? '??'
  };
};

const languagesList = computed(() => {
    const ORDER = ['SK', 'CZ', 'PL', 'EN', 'DE', 'HU'];
    let list = (languages.value || []).map((language) => {
      const translationCode = language.translationCode?.code || '';
      const mapping = getFlagAndLabel(translationCode);
      return {
        id: language.id,
        ...mapping,
        code: translationCode
      };
    });
    // Fallback if languages not loaded
    if (list.length === 0) {
        const ids = config.public.shopware.ids;
        list = [
          { id: ids.languages.sk, label: "SK", code: "sk-SK", flagUrl: "https://flagcdn.com/w40/sk.png" },
          { id: ids.languages.cz, label: "CZ", code: "cs-CZ", flagUrl: "https://flagcdn.com/w40/cz.png" },
          { id: ids.languages.pl, label: "PL", code: "pl-PL", flagUrl: "https://flagcdn.com/w40/pl.png" },
          { id: ids.languages.en, label: "EN", code: "en-GB", flagUrl: "https://flagcdn.com/w40/gb.png" },
          { id: ids.languages.de, label: "DE", code: "de-DE", flagUrl: "https://flagcdn.com/w40/de.png" },
          { id: ids.languages.hu, label: "HU", code: "hu-HU", flagUrl: "https://flagcdn.com/w40/hu.png" },
        ];
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
        (refreshSessionContext as any)();
    } catch (e) {
        console.error('Failed to set currency', e);
    }
};

const toggleCurrency = () => {
    isCurrencyOpen.value = !isCurrencyOpen.value;
    isLanguageOpen.value = false;
}
</script>

<template>
  <Teleport to="body">
    <div 
      class="fixed inset-0 w-full h-[100dvh] z-[120] transition-transform duration-300 transform lg:hidden flex flex-col gpu-boost bg-white overflow-hidden shadow-2xl"
      :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
      style="left: 0 !important; right: 0 !important; top: 0 !important; bottom: 0 !important;"
    >
        <!-- Mobile Header — Enforced Dark Theme (§20.1) -->
        <div 
            class="w-full min-w-full h-[var(--navbar-height-unscrolled,72px)] flex items-center justify-between p-6 bg-black sticky top-0 z-10 shrink-0"
            style="background-color: #000000 !important; width: 100% !important;"
        >
            <Logo />

            <div class="flex items-center gap-4">
                <button @click="onClose" class="w-10 h-10 flex items-center justify-center bg-zinc-800 text-white group active:scale-95 transition-transform" aria-label="Zatvoriť menu">
                  <X class="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300" />
                </button>
            </div>
        </div>

        <!-- Mobile Body — Light Theme as requested -->
        <div class="w-full flex-1 overflow-y-auto bg-white p-6 pb-32">
        
        <!-- Quick Actions -->
        <div class="grid grid-cols-2 gap-4 mb-8">
            <button 
                @click="handleLoginClick"
                class="bg-gray-50 p-4 shrink-0 flex flex-col items-center justify-center rounded-default active:scale-95 transition-transform group gpu-boost border border-gray-100"
            >
                <ClientOnly>
                <User class="w-6 h-6 mb-2 group-hover:text-brand transition-colors" :class="isLoggedIn ? 'text-brand' : 'text-zinc-400'" />
                <span class="text-xs font-bold text-black uppercase tracking-wider">{{ isLoggedIn ? (user?.firstName || t('prihlasit')) : t('prihlasit') }}</span>
                <template #fallback>
                    <User class="w-6 h-6 mb-2 text-zinc-400" />
                    <span class="text-xs font-bold text-black uppercase tracking-wider">{{ t('prihlasit') }}</span>
                </template>
                </ClientOnly>
            </button>
        </div>

        <!-- Categories Section -->
        <div class="mb-8">
            <h3 class="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4 border-b border-zinc-100 pb-2">{{ t('prechadzat_kategorie') }}</h3>
            <div class="space-y-0.5">
                <div v-for="link in navigationElements" :key="link.id" class="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 transition-colors">
                    <div class="flex items-center justify-between py-4">
                        <NuxtLink 
                            :to="localePath(getCategoryUrl(link))"
                            class="flex-1 text-lg font-black font-tech uppercase tracking-wide transition-colors text-left leading-none"
                            :class="mobileExpandedCategory === link.id ? 'text-brand' : 'text-black'"
                            @click="onClose"
                        >
                            {{ link.name }}
                        </NuxtLink>
                        <button 
                            v-if="link.children && link.children.length > 0"
                            @click="toggleMobileCategory(link.id)"
                            class="w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-100 transition-colors"
                            :class="mobileExpandedCategory === link.id ? 'bg-zinc-100 border-zinc-200' : ''"
                            :aria-label="mobileExpandedCategory === link.id ? 'Zbaliť kategóriu' : 'Rozbaliť kategóriu'"
                        >
                            <ChevronDown 
                                class="w-5 h-5 transition-transform duration-300"
                                :class="mobileExpandedCategory === link.id ? 'rotate-180 text-brand' : 'text-zinc-400'" 
                            />
                        </button>
                    </div>
                    
                    <!-- Subcategories Accordion (L2 + L3) -->
                    <div
                        class="overflow-hidden transition-all duration-300 ease-in-out"
                        :class="mobileExpandedCategory === link.id && link.children && link.children.length > 0 ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'"
                    >
                        <div class="bg-gray-50 p-4 space-y-1 mb-4 rounded-default border-l-2 border-brand/50">
                        <!-- View All Link -->
                        <NuxtLink
                            :to="localePath(getCategoryUrl(link), currentLocale as any)"
                            @click="onClose"
                            class="block w-full text-left py-2 px-2 text-sm font-bold text-black uppercase tracking-wider hover:bg-white rounded-default border border-transparent hover:border-zinc-100"
                        >
                            Všetky {{ link.name }}
                        </NuxtLink>

                        <!-- L2 Subcategories (with optional L3 accordion) -->
                        <div v-for="sub in link.children" :key="sub.id">
                            <div class="flex items-center">
                                <NuxtLink
                                    :to="localePath(getCategoryUrl(sub), currentLocale as any)"
                                    @click="onClose"
                                    class="flex-1 py-2 px-2 text-sm font-medium uppercase tracking-wide transition-colors"
                                    :class="expandedSubcategories.has(sub.id) ? 'text-brand' : 'text-zinc-500 hover:text-brand'"
                                >
                                    {{ sub.name }}
                                </NuxtLink>
                                <button
                                    v-if="sub.children && sub.children.length > 0"
                                    @click="toggleSubcategory(sub.id)"
                                    class="w-8 h-8 flex items-center justify-center flex-shrink-0"
                                    :aria-label="expandedSubcategories.has(sub.id) ? 'Zbaliť' : 'Rozbaliť'"
                                >
                                    <ChevronRight
                                        class="w-4 h-4 transition-transform duration-200"
                                        :class="expandedSubcategories.has(sub.id) ? 'rotate-90 text-brand' : 'text-zinc-300'"
                                    />
                                </button>
                            </div>
                            <!-- L3 Children -->
                            <div
                                v-if="sub.children && sub.children.length > 0"
                                class="overflow-hidden transition-all duration-200"
                                :class="expandedSubcategories.has(sub.id) ? 'max-h-[600px]' : 'max-h-0'"
                            >
                                <div class="pl-4 pb-1 space-y-0.5 border-l border-brand/30 ml-2">
                                    <NuxtLink
                                        v-for="child in sub.children"
                                        :key="child.id"
                                        :to="localePath(buildChildUrl(sub, child), currentLocale as any)"
                                        @click="onClose"
                                        class="block py-1.5 px-2 text-xs font-medium text-zinc-400 uppercase tracking-wide hover:text-brand transition-colors"
                                    >
                                        {{ child.name }}
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- SLICKLY Magazín -->
        <button 
            @click="handleLinkClick(localePath('/blog', currentLocale as any))"
            class="w-full mb-8 p-4 bg-gray-50 border border-zinc-100 flex items-center justify-between group active:scale-[0.98] transition-all rounded-default gpu-boost"
        >
            <div class="flex items-center">
                <div class="w-10 h-10 bg-brand flex items-center justify-center mr-4">
                    <BookOpen class="w-5 h-5 text-white" />
                </div>
                <div class="text-left">
                    <span class="block text-black font-black font-tech text-lg uppercase leading-none mb-1 group-hover:text-brand transition-colors">{{ t('magazin') }}</span>
                    <span class="block text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{{ t('testy_recenzie_novinky') }}</span>
                </div>
            </div>
            <ChevronRight class="w-5 h-5 text-zinc-300 group-hover:text-brand group-hover:translate-x-1 transition-all" />
        </button>

        <!-- Footer Links — flipped to dark text -->
        <div class="space-y-4 text-black text-sm font-bold uppercase tracking-widest font-sans">
            <button @click="handleLinkClick(localePath('/kontakty', currentLocale as any))" class="flex items-center hover:text-brand py-2 transition-colors w-full text-left bg-transparent appearance-none border-none"><Phone class="w-4 h-4 mr-3 text-brand" /> {{ t('kontakty') }}</button>
            <button @click="handleLinkClick(localePath('/vsetko-o-nakupe', currentLocale as any))" class="flex items-center hover:text-brand py-2 transition-colors w-full text-left bg-transparent appearance-none border-none"><Info class="w-4 h-4 mr-3 text-brand" /> {{ t('vsetko_o_nakupe') }}</button>
            <button @click="handleLinkClick(localePath('/o-nas', currentLocale as any))" class="flex items-center hover:text-brand py-2 transition-colors w-full text-left bg-transparent appearance-none border-none"><User class="w-4 h-4 mr-3 text-brand" /> {{ t('o_nas') }}</button>

            <div class="border-t border-zinc-100 pt-8 mt-6 space-y-6">
                <a :href="contact.phone.mainHref" class="flex items-center hover:text-brand py-1 text-black text-base font-black font-tech tracking-wider transition-colors">
                    <Phone class="w-5 h-5 mr-4 text-brand" /> {{ contact.phone.mainDisplay }}
                </a>
                <a :href="contact.email.infoHref" class="flex items-center hover:text-brand py-1 text-zinc-600 font-bold transition-colors">
                    <Mail class="w-5 h-5 mr-4 text-brand" /> {{ contact.email.info }}
                </a>
            </div>
        </div>

        </div>

        <!-- Mobile Switcher Fixed Bottom — Light context -->
        <div class="w-full border-t border-zinc-100 bg-gray-50 p-6 sticky bottom-0 z-20 flex justify-end items-center gap-4 font-sans shrink-0">
            <!-- Country Switcher -->
            <CountrySwitcher variant="light" />
            <div class="h-4 w-px bg-zinc-200" v-if="safeCurrencies?.length > 1"></div>
            <!-- Currency Switcher -->
            <div class="relative" v-if="safeCurrencies?.length > 1">
                <button 
                    @click="toggleCurrency"
                    class="flex items-center gap-2 bg-white py-2 px-4 border border-zinc-200 text-black text-xs font-bold uppercase tracking-widest"
                >
                    <span>{{ currency?.symbol || '€' }}</span>
                    <ChevronDown class="w-4 h-4 text-zinc-400 transition-transform" :class="{'rotate-180': isCurrencyOpen}" />
                </button>
                
                <!-- Dropdown -->
                <div 
                    v-if="isCurrencyOpen"
                    class="absolute bottom-full right-0 mb-2 w-32 bg-white border border-zinc-200 shadow-2xl overflow-hidden z-30 rounded-default"
                >
                    <button 
                        v-for="curr in safeCurrencies" 
                        :key="curr.id"
                        @click="handleCurrencyChange(curr.id)"
                        class="w-full text-left px-4 py-3 hover:bg-black hover:text-white text-xs font-bold uppercase text-black flex justify-between items-center border-b border-gray-100 last:border-0 transition-colors tracking-widest"
                        :class="{'text-brand': curr.id === currency?.id}"
                    >
                        <span>{{ curr.symbol }}</span>
                        <Check v-if="curr.id === currency?.id" class="w-4 h-4 text-brand" />
                    </button>
                </div>
            </div>
        </div>
    </div>
  </Teleport>
</template>
