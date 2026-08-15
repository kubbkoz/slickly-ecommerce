import { h as useAsyncData, j as useNuxtApp } from './server.mjs';

const badgeSizeClass = (size = "md") => {
  switch (size) {
    case "sm":
      return "px-1.5 py-0.5 text-[10px] rounded-sm";
    case "lg":
      return "px-3 py-1.5 text-[13px] rounded-sm";
    case "md":
    default:
      return "px-2 py-1 text-[11px] rounded-sm";
  }
};
const useProductBadges = () => {
  const { data: badges } = useAsyncData("product-badges", () => $fetch("/api/badges"), {
    default: () => [],
    getCachedData(key) {
      const nuxtApp = useNuxtApp();
      return nuxtApp.payload.data?.[key] ?? nuxtApp.static?.data?.[key];
    }
  });
  const normId = (id) => typeof id === "string" ? id.toLowerCase().replace(/-/g, "") : "";
  const normSet = (arr) => {
    const s = /* @__PURE__ */ new Set();
    if (!Array.isArray(arr)) return s;
    for (const v of arr) {
      const n = normId(v);
      if (n) s.add(n);
    }
    return s;
  };
  const passesGating = (badge, product) => {
    const price = Number(product?.calculatedPrice?.unitPrice ?? NaN);
    if (badge.applyMinPrice != null && !isNaN(price) && price < badge.applyMinPrice) return false;
    if (badge.applyMaxPrice != null && !isNaN(price) && price > badge.applyMaxPrice) return false;
    const stock = Number(product?.availableStock ?? NaN);
    if (badge.applyMinStock != null && !isNaN(stock) && stock < badge.applyMinStock) return false;
    if (badge.applyMaxStock != null && !isNaN(stock) && stock > badge.applyMaxStock) return false;
    const rating = Number(product?.ratingAverage ?? 0);
    if (badge.applyMinRating != null && rating < badge.applyMinRating) return false;
    const now = Date.now();
    if (badge.applyDateFrom) {
      const t = new Date(badge.applyDateFrom).getTime();
      if (!isNaN(t) && now < t) return false;
    }
    if (badge.applyDateTo) {
      const t = new Date(badge.applyDateTo).getTime();
      if (!isNaN(t) && now > t) return false;
    }
    return true;
  };
  const getProductBadges = (product, position) => {
    if (!badges.value?.length) return [];
    const results = [];
    const productId = normId(product?.parentId || product?.id);
    const manufacturerId = normId(product?.manufacturerId || product?.manufacturer?.id);
    const productCategorySet = normSet(product?.categoryTree);
    const productTagSet = normSet(product?.tagIds);
    for (const badge of badges.value) {
      if (!badge.active) continue;
      if (badge.position !== "both" && badge.position !== position) continue;
      if (badge.assignedProductIds?.length) {
        const hit = badge.assignedProductIds.some((id) => normId(id) === productId);
        if (hit) {
          results.push(badge);
          continue;
        }
      }
      let matched = false;
      if (!matched && badge.applyProductIds?.length) {
        matched = badge.applyProductIds.some((id) => normId(id) === productId);
      }
      if (!matched && badge.applyCategoryIds?.length && productCategorySet.size) {
        matched = badge.applyCategoryIds.some((id) => productCategorySet.has(normId(id)));
      }
      if (!matched && badge.applyTagIds?.length && productTagSet.size) {
        matched = badge.applyTagIds.some((id) => productTagSet.has(normId(id)));
      }
      if (!matched && badge.applyManufacturerIds?.length && manufacturerId) {
        matched = badge.applyManufacturerIds.some((id) => normId(id) === manufacturerId);
      }
      if (!matched && badge.applyResolvedStreamProductIds?.length) {
        matched = badge.applyResolvedStreamProductIds.some((id) => normId(id) === productId);
      }
      if (!matched && badge.applyIsNewDays && product.createdAt) {
        const days = (Date.now() - new Date(product.createdAt).getTime()) / 864e5;
        if (days <= badge.applyIsNewDays) matched = true;
      }
      if (!matched && badge.applyHasDiscount && product.calculatedPrice?.listPrice) {
        matched = true;
      }
      const hasAnyOrRule = !!(badge.applyProductIds?.length || badge.applyCategoryIds?.length || badge.applyTagIds?.length || badge.applyManufacturerIds?.length || badge.applyResolvedStreamProductIds?.length || badge.applyIsNewDays || badge.applyHasDiscount);
      if (!hasAnyOrRule) matched = true;
      if (!matched) continue;
      if (!passesGating(badge, product)) continue;
      results.push(badge);
    }
    return results.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
  };
  const splitPdpBadges = (product) => {
    const all = getProductBadges(product, "pdp");
    return {
      topBadges: all.filter((b) => (b.pdpPosition ?? "top") === "top"),
      imageBadges: all.filter((b) => b.pdpPosition === "image")
    };
  };
  return { badges, getProductBadges, splitPdpBadges };
};

export { badgeSizeClass as b, useProductBadges as u };
