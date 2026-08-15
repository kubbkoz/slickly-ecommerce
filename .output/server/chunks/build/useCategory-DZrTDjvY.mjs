import { unref, computed } from 'vue';
import { e as useShopwareContext, m as useI18n, h as useAsyncData, j as useNuxtApp, G as getCategoryUrl, i as useRuntimeConfig } from './server.mjs';
import { u as useShopwareLanguage } from './useShopwareLanguage-CGPCneCN.mjs';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$|^[0-9a-f]{32}$/i;
const isValidUuid = (id) => typeof id === "string" && UUID_REGEX.test(id);
const useCategory = (navigationIdProp) => {
  const _rawId = unref(navigationIdProp);
  const navigationId = typeof _rawId === "string" ? _rawId : _rawId && typeof _rawId === "object" && typeof _rawId.id === "string" ? _rawId.id : "";
  const { apiClient } = useShopwareContext();
  const { locale } = useI18n();
  const { currentLanguageId } = useShopwareLanguage();
  const config = useRuntimeConfig();
  const rootCategoryId = config.public.rootCategoryId;
  const { data: navigationElements } = useAsyncData(
    `global-navigation-tree-${locale.value}`,
    async () => {
      try {
        const response = await apiClient.invoke("readCategoryList post /category", {
          headers: { "sw-language-id": currentLanguageId.value },
          body: {
            limit: 100,
            filter: [
              { type: "equals", field: "parentId", value: rootCategoryId },
              { type: "equals", field: "active", value: true },
              { type: "equals", field: "visible", value: true }
            ],
            associations: {
              children: {
                filter: [
                  { type: "equals", field: "active", value: true },
                  { type: "equals", field: "visible", value: true }
                ],
                associations: {
                  seoUrls: {},
                  media: {}
                }
              },
              seoUrls: {},
              media: {}
            }
          }
        });
        return response.data.elements || [];
      } catch (e) {
        return [];
      }
    },
    {
      lazy: true,
      getCachedData(key) {
        const nuxtApp = useNuxtApp();
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      }
    }
  );
  const { data: categoryDataResponse, status: categoryStatusVal } = useAsyncData(
    `category-${navigationId}-${locale.value}`,
    async () => {
      if (!isValidUuid(navigationId)) {
        return null;
      }
      try {
        const res = await apiClient.invoke(`readCategory post /category/${navigationId}`, {
          headers: { "sw-language-id": currentLanguageId.value },
          body: { associations: { media: {} } }
        });
        return res.data;
      } catch (e) {
        return null;
      }
    },
    {
      lazy: true,
      getCachedData(key) {
        const nuxtApp = useNuxtApp();
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      }
    }
  );
  const { data: categoryChildrenResponse } = useAsyncData(
    `category-children-${navigationId}-${locale.value}`,
    async () => {
      if (!isValidUuid(navigationId)) {
        return [];
      }
      try {
        const response = await apiClient.invoke("readCategoryList post /category", {
          headers: { "sw-language-id": currentLanguageId.value },
          body: {
            filter: [
              { type: "equals", field: "parentId", value: navigationId },
              { type: "equals", field: "active", value: true }
            ],
            associations: {
              media: {},
              seoUrls: {}
            }
          }
        });
        return response.data?.elements || [];
      } catch (e) {
        return [];
      }
    },
    {
      lazy: true,
      getCachedData(key) {
        const nuxtApp = useNuxtApp();
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      }
    }
  );
  const { data: ancestorCategories } = useAsyncData(
    `category-ancestors-${navigationId}-${locale.value}`,
    async () => {
      if (!isValidUuid(navigationId)) return [];
      try {
        const res = await apiClient.invoke(`readCategory post /category/${navigationId}`, {
          headers: { "sw-language-id": currentLanguageId.value },
          body: {}
        });
        const cat = res.data;
        if (!cat?.path) return [];
        const pathIds = cat.path.split("|").filter((id) => id.trim() && isValidUuid(id.trim())).filter((id) => id !== rootCategoryId);
        if (pathIds.length === 0) return [];
        const ancestorRes = await apiClient.invoke("readCategoryList post /category", {
          headers: { "sw-language-id": currentLanguageId.value },
          body: {
            filter: [
              { type: "equalsAny", field: "id", value: pathIds }
            ],
            associations: {
              seoUrls: {}
            },
            limit: 20
          }
        });
        const cats = ancestorRes.data?.elements || [];
        cats.sort((a, b) => (a.level || 0) - (b.level || 0));
        return cats;
      } catch (e) {
        return [];
      }
    },
    {
      lazy: true,
      getCachedData(key) {
        const nuxtApp = useNuxtApp();
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      }
    }
  );
  const categoryData = computed(() => categoryDataResponse.value);
  const categoryStatus = computed(() => categoryStatusVal.value);
  const categoryName = computed(() => categoryData.value?.translated?.name || categoryData.value?.name || "");
  const categoryDescription = computed(() => categoryData.value?.translated?.description || "");
  const categoryImage = computed(() => categoryData.value?.media?.url || "");
  const categoryLevel = computed(() => categoryData.value?.level || 2);
  const categoryMetaTitle = computed(() => categoryData.value?.translated?.metaTitle || categoryData.value?.metaTitle || "");
  const categoryMetaDescription = computed(() => categoryData.value?.translated?.metaDescription || categoryData.value?.metaDescription || "");
  const categoryKeywords = computed(() => categoryData.value?.translated?.keywords || categoryData.value?.keywords || "");
  const parentCategory = computed(() => {
    if (!navigationElements.value) return null;
    const isTopLevel = navigationElements.value.find((cat) => cat.id === navigationId);
    if (isTopLevel) return null;
    for (const parent of navigationElements.value) {
      if (parent.children?.find((child) => child.id === navigationId)) {
        return parent;
      }
    }
    if (ancestorCategories.value && ancestorCategories.value.length > 0) {
      return ancestorCategories.value[ancestorCategories.value.length - 1];
    }
    return null;
  });
  const isTopLevelCategory = computed(() => categoryLevel.value <= 2);
  const breadcrumbChain = computed(() => {
    const ancestors = ancestorCategories.value || [];
    if (ancestors.length === 0) return [];
    return ancestors.map((cat) => ({
      id: cat.id,
      name: cat.translated?.name || cat.name || "",
      url: getCategoryUrl(cat)
    }));
  });
  const currentCategoryUrl = computed(() => {
    if (!categoryData.value) return "/";
    if (categoryLevel.value <= 3) return getCategoryUrl(categoryData.value);
    const ownSlug = getCategoryUrl(categoryData.value).replace(/^\//, "");
    const parentAncestor = ancestorCategories.value?.find((a) => a.level === categoryLevel.value - 1);
    if (parentAncestor) {
      const parentSlug = getCategoryUrl(parentAncestor).replace(/^\//, "");
      if (parentSlug && !parentSlug.startsWith("navigation/")) {
        return `/${parentSlug}/${ownSlug}`;
      }
    }
    return `/${ownSlug}`;
  });
  const subcategories = computed(() => {
    const buildChildUrl = (child) => {
      const childSlug = getCategoryUrl(child).replace(/^\//, "");
      const parentSlug = categoryLevel.value >= 3 ? getCategoryUrl(categoryData.value).replace(/^\//, "") : null;
      if (parentSlug && !parentSlug.startsWith("navigation/") && childSlug && !childSlug.startsWith("navigation/")) {
        return `/${parentSlug}/${childSlug}`;
      }
      return `/${childSlug}`;
    };
    if (categoryChildrenResponse.value && categoryChildrenResponse.value.length > 0) {
      return categoryChildrenResponse.value.map((c) => ({
        id: c.id,
        name: (c.translated?.name || c.name || "").trim(),
        image: c.media?.url || "",
        description: c.translated?.description || c.description || "",
        url: buildChildUrl(c)
      }));
    }
    let source = [];
    if (isTopLevelCategory.value) {
      const navItem = navigationElements.value?.find((cat) => cat.id === navigationId);
      source = navItem?.children || [];
    } else {
      source = parentCategory.value?.children || [];
    }
    return source.filter((c) => c.id !== navigationId).map((c) => ({
      id: c.id,
      name: (c.translated?.name || c.name || "").trim(),
      image: c.media?.url || "",
      description: c.translated?.description || c.description || "",
      url: getCategoryUrl(c)
    }));
  });
  const parentCategoryUrl = computed(() => {
    if (parentCategory.value) return getCategoryUrl(parentCategory.value);
    return getCategoryUrl({ id: navigationId });
  });
  const activeSubcategory = computed(() => isTopLevelCategory.value ? null : navigationId);
  return {
    parentCategory,
    isTopLevelCategory,
    categoryData,
    categoryStatus,
    categoryName,
    categoryDescription,
    categoryImage,
    categoryLevel,
    categoryMetaTitle,
    categoryMetaDescription,
    categoryKeywords,
    breadcrumbChain,
    currentCategoryUrl,
    subcategories,
    parentCategoryUrl,
    activeSubcategory
  };
};

export { useCategory as u };
