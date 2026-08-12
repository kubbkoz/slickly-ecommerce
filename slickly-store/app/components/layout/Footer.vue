<script setup lang="ts">
import { Facebook, Instagram, Youtube, Phone, Mail, ChevronRight, RotateCcw } from 'lucide-vue-next';
import { getCategoryUrl } from '~/utils/url';
import type { Schemas } from '#shopware';

const { t, locale: currentLocale } = useI18n();
const localePath = useLocalePath();
const appConfig = useAppConfig();
const contact = appConfig.contact;
const config = useRuntimeConfig();
const { apiClient } = useShopwareContext();
const { currentLanguageId } = useShopwareLanguage();

// Separate cache key per language — same pattern as DesktopNav
const navCacheKey = `footer-nav-${currentLanguageId.value}`;

const { data: navCategories } = useAsyncData<Schemas['Category'][]>(
  navCacheKey,
  async () => {
    try {
      const res = await apiClient.invoke('readCategoryList post /category', {
        body: {
          // Only top-level categories are needed (to pick the 4 in TARGET_IDS);
          // 25 is plenty and keeps this SSR payload (inlined into the HTML because
          // payloadExtraction is off) small instead of serializing 100 categories.
          limit: 25,
          filter: [
            { type: 'equals', field: 'parentId', value: config.public.shopware.ids.rootCategory },
            { type: 'equals', field: 'active', value: true },
            { type: 'equals', field: 'visible', value: true },
          ],
          associations: { seoUrls: {} },
        },
        headers: { 'sw-language-id': currentLanguageId.value },
      });
      return (res.data?.elements ?? []) as Schemas['Category'][];
    } catch {
      return [];
    }
  },
  {
    watch: [currentLanguageId],
    getCachedData(key) {
      const nuxtApp = useNuxtApp();
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
  },
);

// The 4 level-2 categories exposed in the footer (order matters)
const TARGET_IDS = [
  config.public.shopware.ids.categories.bikes,
  config.public.shopware.ids.categories.ebikes,
  config.public.shopware.ids.categories.doplnky,
  config.public.shopware.ids.categories.komponenty,
] as string[];

const footerCategories = computed(() => {
  const all = navCategories.value ?? [];
  return TARGET_IDS
    .map((id) => all.find((c) => c.id === id))
    .filter((c): c is Schemas['Category'] => !!c);
});
</script>

<template>
  <footer class="bg-black text-white border-t border-zinc-900 font-sans relative overflow-hidden">
    <!-- Top Tech Border -->
    <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber to-transparent opacity-70"></div>
    <div class="pt-20 pb-10">
      <div class="container mx-auto px-4">

        <!-- Even 4-column content grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          <!-- 1. Quick Links — live categories from Shopware -->
          <div>
            <h2 class="font-black font-tech text-lg mb-8 uppercase tracking-widest text-white flex items-center">
              <span class="w-1 h-4 bg-amber mr-3"></span>
              {{ t('footer.menu.categories') }}
            </h2>
            <ul class="space-y-4 text-sm text-gray-300 font-medium">
              <li v-for="cat in footerCategories" :key="cat.id">
                <NuxtLink
                  :to="localePath(getCategoryUrl(cat))"
                  class="hover:text-amber hover:pl-2 transition-all flex items-center group"
                >
                  <ChevronRight class="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-amber" />
                  {{ cat.translated?.name || cat.name }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- 2. Contact Info -->
          <div>
            <h2 class="font-black font-tech text-lg mb-8 uppercase tracking-widest text-white flex items-center">
              <span class="w-1 h-4 bg-amber mr-3"></span>
              Kontakt
            </h2>
            <ul class="space-y-6">
              <li class="flex items-start group">
                <Phone class="w-5 h-5 text-amber mr-4 mt-1" />
                <div>
                  <span class="block text-[10px] text-white/60 uppercase font-normal tracking-wider mb-1">Infolinka</span>
                  <a :href="contact.phone.mainHref" class="text-xl font-bold text-white group-hover:text-amber transition-colors font-tech">{{ contact.phone.mainDisplay }}</a>
                </div>
              </li>
              <li class="flex items-start group">
                <Mail class="w-5 h-5 text-amber mr-4 mt-1" />
                <div>
                  <span class="block text-[10px] text-white/60 uppercase font-normal tracking-wider mb-1">Email</span>
                  <a :href="contact.email.infoHref" class="text-base text-gray-300 group-hover:text-white transition-colors">{{ contact.email.info }}</a>
                </div>
              </li>
              <li class="flex items-start group">
                <RotateCcw class="w-5 h-5 text-amber mr-4 mt-1" />
                <div>
                  <span class="block text-[10px] text-white/60 uppercase font-normal tracking-wider mb-1">Reklamácia / Vrátenie</span>
                  <NuxtLink to="/odstupenie-od-zmluvy"
                            class="text-base text-gray-300 group-hover:text-amber transition-colors">
                    Vyplniť formulár
                  </NuxtLink>
                </div>
              </li>
            </ul>
          </div>

          <!-- 3. Online support -->
          <div>
             <h2 class="font-black font-tech text-lg mb-8 uppercase tracking-widest text-white flex items-center">
              <span class="w-1 h-4 bg-amber mr-3"></span>
              Zákaznícka podpora
            </h2>

            <p class="text-sm text-gray-300 mb-4 leading-relaxed">
              SLICKLY je výhradne online obchod zameraný na starostlivosť o vaše auto —
              exteriér, interiér, leštenie aj ochranu karosérie. Sme tu pre vás každý
              pracovný deň a radi poradíme s výberom tých najlepších produktov.
            </p>

            <a
              :href="contact.email.infoHref"
              class="inline-flex items-center text-sm font-bold text-amber uppercase tracking-widest hover:text-white transition-colors"
            >
              <Mail class="w-4 h-4 mr-2" /> {{ contact.email.info }}
            </a>
          </div>

          <!-- 4. O značke -->
          <div>
            <h2 class="font-black font-tech text-lg mb-8 uppercase tracking-widest text-white flex items-center">
              <span class="w-1 h-4 bg-amber mr-3"></span>
              SLICKLY
            </h2>
            <p class="text-gray-300 leading-relaxed text-sm">
              U nás nájdete širokú ponuku autokozmetiky, detailing produktov a príslušenstva.
              Poradenstvo a vášeň pre starostlivosť o auto.
            </p>
          </div>

        </div>

        <!-- Centered brand lockup + socials -->
        <div class="border-t border-zinc-900 pt-12 pb-12 flex flex-col items-center gap-6">
          <NuxtLink :to="localePath('/', currentLocale)" class="block" aria-label="SLICKLY Domov">
            <div class="flex items-baseline font-tech font-black uppercase leading-none tracking-tighter text-white text-[3rem] md:text-[4rem]">
              <span>SL</span><span class="logo-i-wrap"><span class="logo-i-dot bg-amber"></span>I</span><span>CKLY</span>
            </div>
          </NuxtLink>
          <div class="flex items-center gap-3">
            <a href="#" aria-label="Sledujte nás na Facebooku" class="w-9 h-9 bg-white/5 hover:bg-amber hover:text-black flex items-center justify-center text-white transition-colors duration-200 rounded-default">
              <Facebook class="w-4 h-4" />
            </a>
            <a href="#" aria-label="Sledujte nás na Instagrame" class="w-9 h-9 bg-white/5 hover:bg-amber hover:text-black flex items-center justify-center text-white transition-colors duration-200 rounded-default">
              <Instagram class="w-4 h-4" />
            </a>
            <a href="#" aria-label="Sledujte nás na Youtube" class="w-9 h-9 bg-white/5 hover:bg-amber hover:text-black flex items-center justify-center text-white transition-colors duration-200 rounded-default">
              <Youtube class="w-4 h-4" />
            </a>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-normal uppercase tracking-wider text-white/40">
          <p>&copy; {{ new Date().getFullYear() }} SLICKLY. Všetky práva vyhradené.</p>
          <button type="button" @click="$cc?.showPreferences()" class="hover:text-white/80 transition-colors cursor-pointer bg-transparent border-none p-0 text-[10px] font-normal uppercase tracking-wider text-white/40">Nastavenia cookies</button>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Decorative amber dot above the "I" (uppercase has no natural tittle) */
.logo-i-wrap {
  position: relative;
  display: inline-block;
}
.logo-i-dot {
  position: absolute;
  top: -0.32em;
  left: 50%;
  transform: translateX(-50%);
  width: 0.16em;
  height: 0.16em;
  border-radius: 9999px;
}
</style>
