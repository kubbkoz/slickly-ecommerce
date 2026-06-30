<script setup lang="ts">
import { getPrefix } from "#imports";
import type { Schemas } from "#shopware";

useHead({
  title: "SLICKLY",
  meta: [{ name: "description", content: "SLICKLY" }],
  htmlAttrs: {
    lang: "sk",
  },
});

const { apiClient } = useShopwareContext();
const sessionContextData = ref<Schemas["SalesChannelContext"]>();

const { refreshCart } = useCart();
const { getWishlistProducts } = useWishlist();

useNotifications();

const {
  getAvailableLanguages,
  getLanguageCodeFromId,
  getLanguageIdFromCode,
  changeLanguage,
  languages: storeLanguages,
} = useInternationalization();

// ── RESILIENT CONTEXT (SLICKLY) ─────────────────────────────────────────────
// Pôvodný layer app.vue robil `await Promise.all([apiClient.invoke(context), …])`
// BEZ try/catch → akékoľvek zlyhanie Store API zhodilo celý SSR (500).
// Tu to obalíme: pri chybe logneme, nastavíme `backendError` (fallback banner)
// a pokračujeme v renderi (shell + prázdne/resilient sekcie namiesto 500).
const backendError = ref<{ message: string; status: number | null } | null>(null);

try {
  const contextResponse = await apiClient.invoke("readContext get /context");
  sessionContextData.value = contextResponse.data;
} catch (e: any) {
  backendError.value = {
    message: String(e?.details?.title || e?.message || e),
    status: e?.statusCode ?? e?.status ?? e?.response?.status ?? null,
  };
  // Debug do server stdout (HostCreators log) + viditeľné cez /api/debug/shopware
  console.error("[SLICKLY] Shopware context FAILED:", backendError.value.status, backendError.value.message);
}

provide("backendError", backendError);

// Jazyky — cez useAsyncData (chytá chybu do .error, nehádže), navyše vlastný guard.
const { data: languagesData } = await useAsyncData("languages", async () => {
  try {
    return await getAvailableLanguages();
  } catch {
    return null;
  }
});
const languages = unref(languagesData);

// Session context inicializuj len ak context prešiel.
if (sessionContextData.value) {
  useSessionContext(sessionContextData.value);
}

const { locale, availableLocales, defaultLocale, localeProperties, messages } =
  useI18n();
const router = useRouter();
const route = useRoute();

const { languageIdChain, refreshSessionContext } = useSessionContext();

let languageToChangeId: string | null = null;

// Jazyková logika len ak máme context aj languages.
if (sessionContextData.value && languages && router.currentRoute.value.name) {
  storeLanguages.value = languages.elements;
  const prefix = getPrefix(
    availableLocales,
    router.currentRoute.value.name as string,
    defaultLocale,
  );

  provide(
    "cmsTranslations",
    messages.value[(prefix as keyof typeof messages.value) || defaultLocale] ??
      {},
  );

  if (localeProperties.value.localeId) {
    if (languageIdChain.value !== localeProperties.value.localeId) {
      languageToChangeId = localeProperties.value.localeId as string;
    }
  } else {
    const sessionLanguage = getLanguageCodeFromId(languageIdChain.value);
    if (sessionLanguage !== prefix) {
      languageToChangeId = getLanguageIdFromCode(prefix ? prefix : defaultLocale);
    }
  }

  if (languageToChangeId) {
    try {
      apiClient.defaultHeaders.apply({ "sw-language-id": languageToChangeId });
      await changeLanguage(languageToChangeId);
      await refreshSessionContext();
    } catch (e) {
      console.error("[SLICKLY] changeLanguage failed:", e);
    }
  }

  locale.value = (prefix ? prefix : defaultLocale) as keyof typeof messages.value;
  provide("urlPrefix", prefix);
}

const showDebug = computed(() => route.query.debug !== undefined);

onMounted(() => {
  try {
    refreshCart();
    const isWishlistPage = route.name?.toString().endsWith("wishlist") ?? false;
    if (!isWishlistPage) {
      getWishlistProducts();
    }
  } catch (e) {
    console.error("[SLICKLY] cart/wishlist refresh failed:", e);
  }
});
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <div
      v-if="backendError"
      class="bg-amber text-black text-center text-xs font-sans px-4 py-2 leading-snug"
      role="status"
    >
      Práve dolaďujeme katalóg — niektoré dáta môžu byť dočasne nedostupné.
      <template v-if="showDebug">
        <br />
        <span class="font-tech">[{{ backendError.status ?? 'ERR' }}]</span>
        {{ backendError.message }} — detail: <a href="/api/debug/shopware" class="underline">/api/debug/shopware</a>
      </template>
    </div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
