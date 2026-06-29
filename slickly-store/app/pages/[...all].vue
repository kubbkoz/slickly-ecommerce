<script setup lang="ts">
import { pascalCase } from "scule";
import { resolveComponent, h, computed } from "vue";
import type { Ref } from "vue";
import { sanitizeHtml } from '~/utils/sanitize';
import { proxyMediaUrl } from '~/utils/media';
import {
  useNavigationContext,
  useNuxtApp,
  useShopwareLanguage,
  useRoute,
  useI18n,
  useAsyncData,
  useShopwareContext,
  useRuntimeConfig,
  createError,
  navigateTo,
  useSeoMeta,
} from "#imports";
import type { Schemas } from "#shopware";
import { getLanguageIdFromPath, getLocaleFromPath } from '~/utils/language';
import { slugify } from '~/utils/url';

defineOptions({
  name: "PageResolver",
});

const { apiClient } = useShopwareContext();
const route = useRoute();
// FIX-1.4: Both `locale` and `locales` captured synchronously at setup top-level.
// They MUST NOT be called inside async callbacks where the Nuxt context is lost.
const { locale, locales } = useI18n();
// FIX-1.6: salesChannelId from runtimeConfig — not hardcoded anymore.
const config = useRuntimeConfig();
const salesChannelId = config.public.shopware.ids.salesChannel as string;

const routePath = route.path;
const currentLangId = getLanguageIdFromPath(routePath);
const currentLocale = getLocaleFromPath(routePath);

// Vyčistenie path od locale prefixu pre potreby API
// This line was previously `const routePath = route.path.replace(...)`.
// Now `routePath` already holds the full path, and `cleanSlug` will be derived from it later.
// The original intent of this line was to get the path *without* the locale prefix.
// We will use `cleanSlug` for that purpose.

/**
 * ELITE SEO RESOLVER
 * Priorita: 1. SEO URL (Databáza) -> 2. Product Number Fallback
 */
async function resolvePathParallel(cleanSlug: string, langId: string): Promise<Schemas["SeoUrl"] | null> {
  const slugParts = cleanSlug.split('/');
  const lastSegment = slugParts[slugParts.length - 1];

  try {
    // ── 0) PRODUCT FAST-PATH pre SLICKLY URL pattern /{slug}/{sku} ──────────
    // Väčšina produktových URL má 2 segmenty kde posledný = productNumber.
    // Priamy lookup šetrí 3-5 API callov (exact/hierarchical/flat category resolution).
    if (slugParts.length === 2 && lastSegment.length >= 3) {
      const productResult = await apiClient.invoke("readProduct post /product", {
        headers: { "sw-language-id": langId },
        body: {
          limit: 1,
          filter: [{ type: "equals", field: "productNumber", value: lastSegment }],
          includes: { product: ["id"] },
        }
      }).catch(() => null);
      const product = (productResult as any)?.data?.elements?.[0];
      if (product) {
        return {
          routeName: "frontend.detail.page",
          foreignKey: product.id,
          pathInfo: `/detail/${product.id}`,
          seoPathInfo: cleanSlug,
          isCanonical: true,
        } as any;
      }
    }

    // ── 1) EXACT FULL-PATH MATCH (len hierarchické URL) ──────────────────────
    // Ak Shopware ukladá SEO URL hierarchicky ("horske-bicykle/panske"), presný
    // match na celý cleanSlug je jednoznačný — žiadna ambiguita. Pre single-segment
    // URL (produkty, L2/L3 kategórie) preskočené — rieši flat lookup nižšie.
    if (slugParts.length >= 2) {
      const exactRes = await apiClient.invoke("readSeoUrl post /seo-url", {
        headers: { "sw-language-id": langId },
        body: {
          filter: [
            { type: "equals", field: "seoPathInfo",   value: cleanSlug },
            { type: "equals", field: "isDeleted",      value: false },
            { type: "equals", field: "isCanonical",    value: true },
            { type: "equals", field: "salesChannelId", value: salesChannelId },
            { type: "equals", field: "routeName",      value: "frontend.navigation.page" },
          ],
          limit: 1,
        },
      });
      const exactHit = exactRes?.data?.elements?.[0];
      if (exactHit?.foreignKey) {
        return {
          routeName:   "frontend.navigation.page",
          foreignKey:  exactHit.foreignKey,
          pathInfo:    `/navigation/${exactHit.foreignKey}`,
          seoPathInfo: cleanSlug,
          isCanonical: true,
        } as any;
      }
    }

    // ── 2) HIERARCHICAL URL (parent → child cez parentId) ────────────────────
    // "panske" existuje pod viacerými rodičmi. Resolvuj rodiča a vyber dieťa
    // podľa parentId — jednoznačná disambiguácia.
    let parentCategoryId: string | undefined;
    if (slugParts.length >= 2) {
      const parentSlug = slugParts[slugParts.length - 2];
      const parentPath = slugParts.slice(0, -1).join('/');

      // Krok 1: rodič podľa SEO slug — tolerantne (flat aj hierarchicky uložený)
      const parentSeoRes = await apiClient.invoke("readSeoUrl post /seo-url", {
        headers: { "sw-language-id": langId },
        body: {
          filter: [
            { type: "equalsAny", field: "seoPathInfo",   value: [parentSlug, parentPath] as any },
            { type: "equals",    field: "isDeleted",      value: false },
            { type: "equals",    field: "isCanonical",    value: true },
            { type: "equals",    field: "salesChannelId", value: salesChannelId },
            { type: "equals",    field: "routeName",      value: "frontend.navigation.page" },
          ],
          limit: 5,
        },
      });
      const parentEls = parentSeoRes?.data?.elements || [];
      parentCategoryId = (parentEls.find((e: any) => e.seoPathInfo === parentPath)
        || parentEls.find((e: any) => e.seoPathInfo === parentSlug)
        || parentEls[0])?.foreignKey as string | undefined;

      if (parentCategoryId) {
        // Krok 2: deti rodiča (parentId zaručuje správnu vetvu), match na lastSegment tolerantne
        const childCatRes = await apiClient.invoke("readCategoryList post /category", {
          headers: { "sw-language-id": langId },
          body: {
            filter: [
              { type: "equals", field: "parentId", value: parentCategoryId },
              { type: "equals", field: "active",   value: true },
            ],
            associations: { seoUrls: {} },
            limit: 100,
          },
        });

        const children: any[] = childCatRes?.data?.elements || [];

        // Match dieťa: 1) cez kanonickú SEO URL, 2) FALLBACK cez slugify(name) —
        // mnohé subkategórie nemajú vygenerovanú SEO URL (seoUrls: []), preto karta
        // generuje URL cez slugify(name). parentId zaručuje správnu vetvu.
        const matched = children.find((c: any) =>
          (c.seoUrls || []).some((s: any) =>
            !s.isDeleted && s.isCanonical &&
            (s.seoPathInfo === lastSegment ||
             s.seoPathInfo === cleanSlug ||
             (typeof s.seoPathInfo === 'string' && s.seoPathInfo.endsWith('/' + lastSegment)))
          )
        ) || children.find((c: any) => {
          const nm = c.translated?.name || c.name || '';
          return nm && slugify(nm) === lastSegment;
        });

        if (matched) {
          return {
            routeName:   "frontend.navigation.page",
            foreignKey:  matched.id,
            pathInfo:    `/navigation/${matched.id}`,
            seoPathInfo: cleanSlug,
            isCanonical: true,
          } as any;
        }
      }
      // rodič/dieťa nenájdené → flat lookup s parent-disambiguáciou nižšie
    }

    // ── 3) FLAT LOOKUP (+ parent-disambiguácia, nikdy slepo prvý) ─────────────
    const seoResult = await apiClient.invoke("readSeoUrl post /seo-url", {
      headers: { "sw-language-id": langId },
      body: {
        filter: [
          { type: "equalsAny", field: "seoPathInfo", value: [cleanSlug, lastSegment] as any },
          { type: "equals", field: "isDeleted", value: false },
          { type: "equals", field: "isCanonical", value: true },
          { type: "equals", field: "salesChannelId", value: salesChannelId },
          { type: "equals", field: "languageId", value: langId }
        ],
        limit: 10,
      }
    });

    const elements = seoResult?.data?.elements || [];
    // Presný full-path má vždy prednosť
    let seoData = elements.find((e: any) => e.seoPathInfo === cleanSlug);

    if (!seoData) {
      const lastMatches = elements.filter((e: any) => e.seoPathInfo === lastSegment);
      if (lastMatches.length === 1) {
        seoData = lastMatches[0];
      } else if (lastMatches.length > 1 && slugParts.length >= 2) {
        // Viac kategórií zdieľa rovnaký slug (napr. "panske" pod Horské bicykle aj Krosové).
        // Vyber tú, ktorej rodič zodpovedá rodičovi z URL — NIKDY slepo prvú zhodu.
        const candidateIds = lastMatches.map((e: any) => e.foreignKey).filter(Boolean);
        try {
          const catRes = await apiClient.invoke("readCategoryList post /category", {
            headers: { "sw-language-id": langId },
            body: {
              filter: [{ type: "equalsAny", field: "id", value: candidateIds }],
              includes: { category: ['id', 'parentId', 'path'] },
              limit: candidateIds.length,
            },
          });
          const cats: any[] = catRes?.data?.elements || [];
          const byId = new Map(cats.map((c: any) => [c.id, c]));
          const pick = parentCategoryId
            ? lastMatches.find((e: any) => {
                const c: any = byId.get(e.foreignKey);
                if (!c) return false;
                return c.parentId === parentCategoryId ||
                       (typeof c.path === 'string' && c.path.includes(parentCategoryId as string));
              })
            : undefined;
          seoData = pick || lastMatches[0];
        } catch {
          seoData = lastMatches[0];
        }
      }
    }

    // EMERGENCY FALLBACK: Category by exact name (if SEO URL missing)
    if (!seoData && lastSegment) {
      const categoryRes = await apiClient.invoke("readCategoryList post /category", {
        headers: { "sw-language-id": langId },
        body: {
          filter: [
            { type: "equals", field: "name", value: lastSegment }
          ],
          limit: 1,
          associations: { seoUrls: {} }
        }
      });

      const category = categoryRes?.data?.elements?.[0];
      if (category) {
        seoData = {
          routeName: "frontend.navigation.page",
          foreignKey: category.id,
          pathInfo: `/navigation/${category.id}`,
          seoPathInfo: cleanSlug,
          isCanonical: true,
        } as any;
      }
    }

    if (seoData) return seoData as Schemas["SeoUrl"];

    // FALLBACK PROD: Ak slug neexistuje v SEO URL, skúsime lookup podľa productNumber (posledný segment)
    if (lastSegment && lastSegment.length > 3) {
      const productResult = await apiClient.invoke("readProduct post /product", {
        headers: { "sw-language-id": langId },
        body: {
          limit: 1,
          filter: [{ type: "equals", field: "productNumber", value: lastSegment }],
          associations: { seoUrls: {} }
        }
      });

      const product = productResult?.data?.elements?.[0];
      if (product) {
        return {
          routeName: "frontend.detail.page",
          foreignKey: product.id,
          pathInfo: `/detail/${product.id}`,
          seoPathInfo: cleanSlug,
          isCanonical: true,
        } as any;
      }
    }
  } catch (e) {
    console.error("[SLICKLY Resolver Error]", e);
  }

  return null;
}


const { data: seoResult, error } = await useAsyncData(
  `cmsResponse:${routePath}:${currentLangId}`,
  async () => {
    // 0. GUARD: Ignore obviously broken technical paths or assets leaking into the catch-all
    if (
      !routePath || 
      routePath === '/undefined' || 
      routePath === '/null' || 
      routePath === '/1x' ||
      routePath.includes('undefined') ||
      routePath.includes('null') ||
      /\.(png|jpg|jpeg|gif|svg|webp|avif|ico|js|css|map|json|woff|woff2|ttf|otf)$/i.test(routePath)
    ) {
      console.warn(`[PageResolver] Ignoring technical or asset path: ${routePath}`);
      return null;
    }

    // A0. Nuxt pages — nechytaj routy s vlastným page komponentom
    if (routePath.startsWith("/porovnanie/") || routePath.startsWith("/znacka/") || routePath.startsWith("/znacky")) {
      return null;
    }

    // A. Technická cesta pre kategórie
    if (routePath.startsWith("/navigation/")) {
      const parts = routePath.split("/");
      const navigationId = parts[2];
      if (!navigationId || navigationId === 'undefined' || navigationId === 'null') return null;
      return {
        routeName: "frontend.navigation.page",
        foreignKey: navigationId,
        pathInfo: routePath,
        seoPathInfo: routePath,
      } as any;
    }

    // B. Technická cesta pre produkty
    if (routePath.startsWith("/detail/") || routePath.startsWith("/product/")) {
      const productId = routePath.split("/")[2];
      return {
        routeName: "frontend.detail.page",
        foreignKey: productId,
        pathInfo: routePath,
        seoPathInfo: routePath,
      } as any;
    }

    // C. Štandardný slug (SEO URL) - Striktná sanitizácia lomiek a prefixov
    let cleanSlug = routePath.replace(/^\/+|\/+$/g, '');
    // FIX-1.4: `locales` captured in closure — NOT called here via useI18n() which would crash on SSR.
    locales.value.forEach((l: any) => {
      const prefix = typeof l === 'string' ? l : l.code;
      if (cleanSlug.startsWith(`${prefix}/`)) {
        cleanSlug = cleanSlug.substring(prefix.length + 1);
      } else if (cleanSlug === prefix) {
        cleanSlug = '';
      }
    });
    
    if (!cleanSlug) {
      // Home page fallback
      return {
        routeName: "frontend.navigation.page",
        foreignKey: "home", 
      } as any;
    }

    return await resolvePathParallel(cleanSlug, currentLangId);
  }
);

// Static page — MtsportBlog type=page články (priorita pred Shopware SEO URL)
const cleanSlugForPage = routePath.replace(/^\/+|\/+$/g, '');
const localeStrippedSlug = (() => {
  let s = cleanSlugForPage;
  locales.value.forEach((l: any) => {
    const prefix = typeof l === 'string' ? l : l.code;
    if (s.startsWith(`${prefix}/`)) s = s.substring(prefix.length + 1);
    else if (s === prefix) s = '';
  });
  return s;
})();
const { data: staticPage } = await useAsyncData(
  `static-page:${localeStrippedSlug}`,
  async () => {
    if (!localeStrippedSlug) return null;
    // Multi-segment URL (slug/sku) = produkt → blog článok nikdy nemá lomítko v slugu
    if (localeStrippedSlug.includes('/')) return null;
    try {
      return (await $fetch(`/api/page/${localeStrippedSlug}`)) ?? null;
    } catch {
      return null;
    }
  }
);

// SEO meta pre statické stránky — title z article.title
if (staticPage.value) {
  const sp = staticPage.value as any;
  useSeoMeta({
    title: sp.metaTitle || sp.title,
    description: sp.metaDescription || sp.teaser || '',
    ogTitle: sp.title,
    ogDescription: sp.teaser || '',
  });
}

// Ak nič nenájdeme (ani Shopware ani statická stránka) → 404
if (!staticPage.value && (error.value || !seoResult.value?.foreignKey)) {
  throw createError({
    statusCode: 404,
    message: `Page not found: ${routePath}`,
    fatal: true
  });
}

// Inicializácia kontextu stránky (CMS, Product detail, etc.)
const { routeName, foreignKey } = useNavigationContext(
  seoResult as Ref<Schemas["SeoUrl"]>,
);

// GUARD: foreignKey.value must always be a plain UUID string.
// useNavigationContext may occasionally return a Proxy/object during CSR hydration.
// Coercing to String prevents "[object Object]" being sent as a Shopware API path param.
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const safeNavigationId = computed(() => {
  const raw = foreignKey.value;
  if (!raw) return '';
  // If already a valid UUID string, return as-is
  const str = typeof raw === 'string' ? raw : String(raw);
  // Reject mangled values like "[object Object]" or empty strings
  if (!str || str.startsWith('[object')) {
    console.warn('[PageResolver] Invalid foreignKey value — skipping render:', str);
    return '';
  }
  return str;
});

const resolvedComponent = computed(() => {
  const componentName = routeName.value;
  const navId = safeNavigationId.value;
  if (!componentName || !navId) return null;

  // Mapovanie Shopware route na Nuxt komponenty (napr. frontend.detail.page -> FrontendDetailPage)
  const componentNameToResolve = pascalCase(componentName);
  const cmsPageView = resolveComponent(componentNameToResolve);
  
  if (!cmsPageView || typeof cmsPageView === 'string') {
    console.error(`Missing component for route: ${componentName}`);
    return h("div", "Chýbajúci komponent šablóny.");
  }

  return h(cmsPageView as any, { 
    navigationId: navId, 
    key: navId 
  });
});
</script>

<template>
  <!-- Static page (type=page articles bez /blog prefixu, napr. /kamenna-predajna) -->
  <template v-if="staticPage">
    <article class="min-h-screen bg-white">
      <div class="relative bg-black overflow-hidden py-20">
        <div v-if="(staticPage as any).heroCoverUrl || (staticPage as any).coverUrl" class="absolute inset-0">
          <NuxtImg
            :src="proxyMediaUrl(((staticPage as any).heroCoverUrl || (staticPage as any).coverUrl)!)"
            :alt="(staticPage as any).title"
            class="w-full h-full object-cover opacity-30"
            format="webp"
            loading="eager"
            sizes="100vw"
          />
        </div>
        <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-70"></div>
        <div class="container mx-auto px-4 lg:px-8 relative z-10">
          <h1 class="text-3xl md:text-5xl font-tech font-black uppercase italic text-white leading-none max-w-4xl">
            {{ (staticPage as any).title }}
          </h1>
          <div class="section-decorator mt-6"></div>
          <p v-if="(staticPage as any).teaser" class="mt-6 text-gray-300 font-sans text-lg leading-relaxed max-w-2xl">
            {{ (staticPage as any).teaser }}
          </p>
        </div>
      </div>
      <div class="container mx-auto px-4 lg:px-8 py-16">
        <div class="mtsport-blog-content">
          <CmsPage v-if="(staticPage as any).cmsPage?.sections?.length" :content="(staticPage as any).cmsPage" />
          <div
            v-else-if="(staticPage as any).content"
            v-html="sanitizeHtml((staticPage as any).content)"
          ></div>
        </div>
      </div>
    </article>
  </template>

  <!-- Shopware CMS / Product pages -->
  <component :is="resolvedComponent" v-else-if="resolvedComponent" />
</template>