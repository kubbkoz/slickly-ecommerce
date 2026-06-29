<script setup lang="ts">
import { ChevronDown, MapPin } from 'lucide-vue-next';
import { useSessionContext } from '#imports';
import MegaMenu from './MegaMenu.vue';
import { getCategoryUrl } from '~/utils/url';
import { getLanguageIdFromPath, getLocaleFromPath } from '~/utils/language';
import type { Schemas } from '#shopware';

const localePath = useLocalePath();
const { t } = useStaticTranslations();
const { apiClient } = useShopwareContext();
const route = useRoute();
const { currentLanguageId } = useShopwareLanguage();
const currentLocale = getLocaleFromPath(route.path);

const config = useRuntimeConfig();

const cacheKey = `desktop-nav-${currentLanguageId.value}`;

// ⚡ CRITICAL: Do NOT use 'await' here. If this composable is awaited,
// Nuxt treats DesktopNav as an async component and wraps it in <Suspense>.
// Each SPA navigation triggers a Suspense re-mount which RESETS all local
// reactive state — isMegaMenuVisible, activeCategory — breaking hover.
// Without 'await', the component is synchronous. Data arrives reactively
// from the SSR payload cache (getCachedData) with zero client-side fetch.
const { data: navigationElements } = useAsyncData(
  cacheKey,
  async () => {
    try {
      const response = await apiClient.invoke("readCategoryList post /category", {
        body: {
          limit: 100,
          filter: [
            { type: "equals", field: "parentId", value: config.public.shopware.ids.rootCategory },
            { type: "equals", field: "active", value: true },
            { type: "equals", field: "visible", value: true }
          ],
          associations: {
            children: {
              filter: [{ type: "equals", field: "active", value: true }],
              associations: {
                media: {},
                seoUrls: {}
              }
            },
            media: {},
            seoUrls: {}
          },
        },
        headers: {
          'sw-language-id': currentLanguageId.value
        }
      });
      return response.data.elements || [];
    } catch (e) {
      console.error('DesktopNav: Failed to fetch navigation', e);
      if (import.meta.client) {
         const nuxtApp = useNuxtApp();
         return nuxtApp.payload.data[cacheKey] || nuxtApp.static.data[cacheKey] || [];
      }
      return [];
    }
  },
  { 
    // Only re-fetch when language changes (locale switch), not on every navigation
    watch: [currentLanguageId],
    // Return cached SSR payload immediately — prevents any client-side flash
    getCachedData(key) {
      const nuxtApp = useNuxtApp();
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    }
  }
);

defineProps<{ isScrolled: boolean; isHidden?: boolean; }>();

const navItems = computed(() => {
  return (navigationElements.value as Schemas['Category'][]) || [];
});

const activeCategory = ref<Schemas['Category'] | null>(null);
const isMegaMenuVisible = ref(false);
let closeTimeout: NodeJS.Timeout | null = null;

function handleMouseEnter(category: Schemas['Category']) {
  if (closeTimeout) clearTimeout(closeTimeout);
  if (category.children && category.children.length > 0) {
    activeCategory.value = category;
    isMegaMenuVisible.value = true;
  } else {
    isMegaMenuVisible.value = false;
  }
}

function handleMouseLeave() {
  closeTimeout = setTimeout(() => {
    isMegaMenuVisible.value = false;
  }, 150); // Small delay to allow moving to the MegaMenu itself
}

function handleMenuEnter() {
  if (closeTimeout) clearTimeout(closeTimeout);
  isMegaMenuVisible.value = true;
}

function closeMegaMenu() {
  if (closeTimeout) clearTimeout(closeTimeout);
  isMegaMenuVisible.value = false;
  activeCategory.value = null;
}

// Close mega menu on every client-side navigation.
// Vue Router does not trigger mouseleave on DOM elements during SPA navigation,
// so the hover-based close timeout never fires after clicking a NuxtLink inside the menu.
watch(() => route.path, closeMegaMenu);
</script>

<template>
  <!-- Wrapper: collapsed on category pages via max-height so no gap is left.
       overflow-hidden only when collapsing, otherwise overflow-visible for MegaMenu dropdowns. -->
  <div 
    class="hidden lg:block relative z-30 w-full desktop-nav-container transition-[max-height,opacity] duration-150 ease-linear gpu-boost"
    :class="isHidden ? 'overflow-hidden' : 'overflow-visible'"
    :style="isHidden ? 'max-height: 0' : 'max-height: 80px'"
  >
    <div 
      class="bg-black border-t border-black transition-all duration-150 ease-linear w-full overflow-visible gpu-boost"
      :class="{ 'opacity-0 pointer-events-none': isHidden, 'opacity-100 pointer-events-auto': !isHidden }"
    >
      <div class="container mx-auto px-4 lg:px-8">
        <div class="flex items-center justify-between">
          
          <div class="flex items-center space-x-8">
            <div 
              v-for="link in navItems" 
              :key="link.id" 
              class="static py-4 px-2"
              @mouseenter="handleMouseEnter(link)"
              @mouseleave="handleMouseLeave"
              @click="closeMegaMenu"
            >
              <NuxtLink 
                :to="localePath(getCategoryUrl(link as any), currentLocale as any)"
                class="flex items-center text-sm font-bold uppercase tracking-widest transition-all duration-300 font-tech text-white hover:text-brand"
                :class="{ 'text-brand': activeCategory?.id === link.id && isMegaMenuVisible }"
              >
                {{ link.name }}
                <ChevronDown 
                  v-if="link.children && link.children.length > 0" 
                  class="w-3 h-3 ml-1 transition-transform duration-300"
                  :class="{ 'rotate-180': activeCategory?.id === link.id && isMegaMenuVisible }"
                />
              </NuxtLink>
            </div>
          </div>

          <MegaMenu 
            :category="activeCategory" 
            :is-visible="isMegaMenuVisible"
            @mouseenter="handleMenuEnter"
            @mouseleave="handleMouseLeave"
            @click="closeMegaMenu"
          />

        </div>
      </div>
    </div>
  </div>
</template>