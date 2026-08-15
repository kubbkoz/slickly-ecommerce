import { computed } from 'vue';
import { M as useInternationalization, l as useSessionContext, e as useShopwareContext, m as useI18n, d as useRoute, h as useAsyncData, j as useNuxtApp } from './server.mjs';
import { u as useShopwareLanguage } from './useShopwareLanguage-CGPCneCN.mjs';

async function withRetry(fn, opts = {}) {
  const retries = opts.retries ?? 2;
  const baseDelayMs = opts.baseDelayMs ?? 300;
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, baseDelayMs * 2 ** attempt));
      }
    }
  }
  throw lastErr;
}
const useCategoryCache = () => {
  const { apiClient } = useShopwareContext();
  const { locale } = useI18n();
  const { currentLanguageId } = useShopwareLanguage();
  const langId = currentLanguageId.value;
  const slugify = (text) => text.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").trim();
  const { data: allCategories } = useAsyncData(
    `category-cache-${locale.value}`,
    async () => {
      try {
        const response = await withRetry(() => apiClient.invoke("readCategoryList post /category", {
          headers: { "sw-language-id": langId },
          body: {
            limit: 100,
            filter: [
              { type: "equals", field: "active", value: true },
              { type: "equals", field: "visible", value: true }
            ],
            associations: {
              seoUrls: {},
              media: {},
              children: {
                filter: [
                  { type: "equals", field: "active", value: true },
                  { type: "equals", field: "visible", value: true }
                ],
                associations: {
                  seoUrls: {},
                  media: {}
                }
              }
            },
            // §4 — payload trim: len polia použité v resolveSlug/getNavCategories/getSubcategories
            includes: {
              category: ["id", "name", "translated", "parentId", "seoUrls", "media", "children"],
              seo_url: ["seoPathInfo", "isCanonical"],
              media: ["url"]
            }
          }
        }));
        const elements = response.data.elements || [];
        return elements.map((cat) => {
          const seoPath = cat.seoUrls?.[0]?.seoPathInfo;
          const name = cat.translated?.name || cat.name || "";
          return {
            id: cat.id,
            name,
            slug: slugify(name),
            parentId: cat.parentId,
            seoPathInfo: seoPath,
            url: seoPath ? `/${seoPath}` : `/${slugify(name)}`,
            children: cat.children?.map((child) => {
              const childSeoPath = child.seoUrls?.[0]?.seoPathInfo;
              const childName = child.translated?.name || child.name || "";
              return {
                id: child.id,
                name: childName,
                slug: slugify(childName),
                parentId: child.parentId,
                seoPathInfo: childSeoPath,
                url: childSeoPath ? `/${childSeoPath}` : `/${slugify(childName)}`
              };
            }) || []
          };
        });
      } catch (e) {
        return [];
      }
    },
    {
      lazy: true,
      // ← non-blocking: loads in background after first page render
      getCachedData(key) {
        const nuxtApp = useNuxtApp();
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      }
    }
  );
  const resolveSlug = (slug) => {
    if (!allCategories.value) return null;
    const normalizedSlug = slug.replace(/^\//, "").replace(/\/$/, "").toLowerCase();
    for (const cat of allCategories.value) {
      if (cat.seoPathInfo === normalizedSlug) return cat;
      if (cat.slug === normalizedSlug) return cat;
      if (slugify(cat.name) === normalizedSlug) return cat;
      for (const child of cat.children || []) {
        if (child.seoPathInfo === normalizedSlug) return child;
        if (child.slug === normalizedSlug) return child;
        if (slugify(child.name) === normalizedSlug) return child;
      }
    }
    return null;
  };
  const getNavCategories = (rootParentId) => {
    return computed(() => {
      if (!allCategories.value) return [];
      return allCategories.value.filter((c) => c.parentId === rootParentId);
    });
  };
  const getSubcategories = (categoryId) => {
    return computed(() => {
      if (!allCategories.value) return [];
      const topLevel = allCategories.value.find((c) => c.id === categoryId);
      if (topLevel) return topLevel.children || [];
      for (const parent of allCategories.value) {
        if (parent.children?.some((c) => c.id === categoryId)) {
          return parent.children;
        }
      }
      return [];
    });
  };
  return {
    allCategories,
    resolveSlug,
    getNavCategories,
    getSubcategories,
    slugify
  };
};
const useLanguageSwitcher = () => {
  useInternationalization();
  useSessionContext();
  useShopwareContext();
  const { locales, locale } = useI18n();
  useRoute();
  useCategoryCache();
  useShopwareLanguage();
  const switchLanguage = async (languageId) => {
  };
  return { switchLanguage };
};

export { useLanguageSwitcher as u };
