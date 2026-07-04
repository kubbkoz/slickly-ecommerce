<script setup lang="ts">
import { getPrefix } from "#imports";
import type { Schemas } from "#shopware";
import ProductDetailSkeleton from "~/components/product/ProductDetailSkeleton.vue";
import { getLocaleFromPath } from "~/utils/language";


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
// Guarded — a cold/fresh session's context payload can have a different shape
// than a reused one (e.g. missing customer/paymentMethod), and this composable
// wasn't previously wrapped: an unexpected shape here would throw uncaught
// and crash SSR to the 500 error page instead of degrading gracefully.
try {
  if (sessionContextData.value) {
    useSessionContext(sessionContextData.value);
  }
} catch (e) {
  console.error('[SLICKLY] useSessionContext init failed:', e);
}

const { locale, availableLocales, defaultLocale, localeProperties, messages } =
  useI18n();
const router = useRouter();
const route = useRoute();

// The catch-all page resolver ([...all].vue) blocks its own render on an
// awaited SEO-URL lookup before FrontendDetailPage (which has its own
// pending/skeleton handling) ever mounts — so without a Suspense fallback
// here, navigating to a product shows a blank white screen for however long
// that lookup takes. Product URLs always follow /[slug]/[product-number]
// (see utils/url.ts getProductUrl), so a simple path-shape check lets us
// show the real PDP skeleton instead of nothing during that gap.
//
// Deliberately uses router.currentRoute (not the `route` ref above/useRoute())
// — Nuxt defers syncing its own route ref until the incoming page's Suspense
// resolves (see nuxtApp._route.sync() in page.js's onResolve), so useRoute()
// would still report the PREVIOUS route while this fallback is visible.
// router.currentRoute updates as soon as Vue Router confirms the navigation,
// before the destination page's async setup even starts, so it already
// reflects the destination during pending.
const isLikelyProductRoute = computed(() => {
  const targetPath = router.currentRoute.value.path;
  const locale = getLocaleFromPath(targetPath);
  let path = targetPath;
  if (path === `/${locale}` || path.startsWith(`/${locale}/`)) {
    path = path.slice(locale.length + 1);
  }
  const segments = path.split('/').filter(Boolean);
  return segments.length === 2 && segments[1].length >= 3;
});

const { languageIdChain, refreshSessionContext } = useSessionContext();

let languageToChangeId: string | null = null;

// Jazyková logika len ak máme context aj languages.
// Guarded end-to-end — a cold session's context/languageIdChain shape can
// differ from a reused one, and none of getPrefix/getLanguageCodeFromId/
// getLanguageIdFromCode were previously protected: any unexpected input here
// would throw uncaught and crash SSR to the 500 error page. On failure we
// still fall back to the default locale instead of leaving `locale` unset.
try {
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
} catch (e) {
  console.error('[SLICKLY] Language resolution failed:', e);
  locale.value = defaultLocale as keyof typeof messages.value;
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
    <NuxtLoadingIndicator color="#FFBF00" :height="3" />
    <NuxtLayout>
      <!-- NuxtPage's own internal <Suspense suspensible> delegates its pending
           state up to this wrapping <Suspense> — its #fallback is what actually
           shows while a new route's page-level async data is resolving
           (see node_modules/nuxt/dist/pages/runtime/page.js). Without this,
           the catch-all resolver ([...all].vue) blocks its own render on an
           awaited SEO-URL lookup and Vue shows nothing at all during that gap. -->
      <Suspense>
        <template #fallback>
          <ProductDetailSkeleton v-if="isLikelyProductRoute" />
        </template>
        <NuxtPage />
      </Suspense>
    </NuxtLayout>
  </div>
</template>
