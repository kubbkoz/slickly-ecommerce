import { useAsyncData, useNuxtApp } from '#imports';

export interface Badge {
  id: string;
  text: string;
  bgColor: string;
  textColor: string;
  position: 'card' | 'pdp' | 'both';
  pdpPosition: 'top' | 'image';
  size: 'sm' | 'md' | 'lg';
  sort: number;
  active: boolean;
  applyProductIds: string[];
  applyCategoryIds: string[];
  applyTagIds: string[];
  applyManufacturerIds: string[];
  applyProductStreamIds: string[];
  applyResolvedStreamProductIds: string[];
  applyIsNewDays: number | null;
  applyHasDiscount: boolean;
  // ── Advanced gating filters (v2.0) ──
  applyMinPrice: number | null;
  applyMaxPrice: number | null;
  applyMinStock: number | null;
  applyMaxStock: number | null;
  applyMinRating: number | null;
  applyDateFrom: string | null;
  applyDateTo: string | null;
  // ── Manuálne ManyToMany assignment (najvyššia priorita, obíde gating) ──
  assignedProductIds: string[];
}

/** Tailwind/UnoCSS classy podľa veľkosti badge. */
export const badgeSizeClass = (size: Badge['size'] = 'md'): string => {
  switch (size) {
    case 'sm':
      return 'px-1.5 py-0.5 text-[10px] rounded-sm';
    case 'lg':
      return 'px-3 py-1.5 text-[13px] rounded-sm';
    case 'md':
    default:
      return 'px-2 py-1 text-[11px] rounded-sm';
  }
};

export const useProductBadges = () => {
  const { data: badges } = useAsyncData<Badge[]>('product-badges', () => $fetch('/api/badges'), {
    default: () => [] as Badge[],
    getCachedData(key) {
      const nuxtApp = useNuxtApp();
      return nuxtApp.payload.data?.[key] ?? (nuxtApp as any).static?.data?.[key];
    },
  });

  /** Normalizuje UUID: lowercase + strip dashes — zhoduje rôzne formáty zo Shopware. */
  const normId = (id: any): string => (typeof id === 'string' ? id.toLowerCase().replace(/-/g, '') : '');

  /** Vráti Set normalizovaných UUIDs z array. */
  const normSet = (arr: any): Set<string> => {
    const s = new Set<string>();
    if (!Array.isArray(arr)) return s;
    for (const v of arr) {
      const n = normId(v);
      if (n) s.add(n);
    }
    return s;
  };

  /** Hľadanie prieniku dvoch UUID arrays s normalizáciou. */
  const intersects = (badgeIds: any, productIds: any): boolean => {
    if (!Array.isArray(badgeIds) || !badgeIds.length) return false;
    if (!Array.isArray(productIds) || !productIds.length) return false;
    const set = normSet(productIds);
    for (const v of badgeIds) {
      if (set.has(normId(v))) return true;
    }
    return false;
  };

  /** Gating filters — vráti false ak badge prepadne aspoň jedným z nich. */
  const passesGating = (badge: Badge, product: any): boolean => {
    // Cena (calculatedPrice.unitPrice je číslo so zľavou)
    const price = Number(product?.calculatedPrice?.unitPrice ?? NaN);
    if (badge.applyMinPrice != null && !isNaN(price) && price < badge.applyMinPrice) return false;
    if (badge.applyMaxPrice != null && !isNaN(price) && price > badge.applyMaxPrice) return false;

    // Sklad (availableStock)
    const stock = Number(product?.availableStock ?? NaN);
    if (badge.applyMinStock != null && !isNaN(stock) && stock < badge.applyMinStock) return false;
    if (badge.applyMaxStock != null && !isNaN(stock) && stock > badge.applyMaxStock) return false;

    // Rating
    const rating = Number(product?.ratingAverage ?? 0);
    if (badge.applyMinRating != null && rating < badge.applyMinRating) return false;

    // Časové okno
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

  const getProductBadges = (product: any, position: 'card' | 'pdp'): Badge[] => {
    if (!badges.value?.length) return [];
    const results: Badge[] = [];
    const productId       = normId(product?.parentId || product?.id);
    const manufacturerId  = normId(product?.manufacturerId || product?.manufacturer?.id);
    const productCategorySet = normSet(product?.categoryTree);
    const productTagSet      = normSet(product?.tagIds);

    for (const badge of badges.value) {
      if (!badge.active) continue;
      if (badge.position !== 'both' && badge.position !== position) continue;

      // 0. Manuálne ManyToMany priradenie — najvyššia priorita, OBÍDE gating filtre
      if (badge.assignedProductIds?.length) {
        const hit = badge.assignedProductIds.some((id: string) => normId(id) === productId);
        if (hit) { results.push(badge); continue; }
      }

      // ── 1–7: OR pravidlá (badge sa pridá ak match aspoň jedno, AND s gating) ──
      let matched = false;

      // 1. Konkrétny produkt (parent UUID)
      if (!matched && badge.applyProductIds?.length) {
        matched = badge.applyProductIds.some((id: string) => normId(id) === productId);
      }
      // 2. Kategória (cez categoryTree predkov)
      if (!matched && badge.applyCategoryIds?.length && productCategorySet.size) {
        matched = badge.applyCategoryIds.some((id: string) => productCategorySet.has(normId(id)));
      }
      // 3. Tag
      if (!matched && badge.applyTagIds?.length && productTagSet.size) {
        matched = badge.applyTagIds.some((id: string) => productTagSet.has(normId(id)));
      }
      // 4. Výrobca
      if (!matched && badge.applyManufacturerIds?.length && manufacturerId) {
        matched = badge.applyManufacturerIds.some((id: string) => normId(id) === manufacturerId);
      }
      // 5. Dynamická skupina (server pre-resolvoval streamy → product UUIDs)
      if (!matched && badge.applyResolvedStreamProductIds?.length) {
        matched = badge.applyResolvedStreamProductIds.some((id: string) => normId(id) === productId);
      }
      // 6. Nový produkt (createdAt < N dní)
      if (!matched && badge.applyIsNewDays && product.createdAt) {
        const days = (Date.now() - new Date(product.createdAt).getTime()) / 86_400_000;
        if (days <= badge.applyIsNewDays) matched = true;
      }
      // 7. So zľavou
      if (!matched && badge.applyHasDiscount && product.calculatedPrice?.listPrice) {
        matched = true;
      }

      // ── Špeciálny prípad: žiadne OR pravidlá nie sú nakonfigurované → použij len gating ──
      const hasAnyOrRule = !!(
        badge.applyProductIds?.length ||
        badge.applyCategoryIds?.length ||
        badge.applyTagIds?.length ||
        badge.applyManufacturerIds?.length ||
        badge.applyResolvedStreamProductIds?.length ||
        badge.applyIsNewDays ||
        badge.applyHasDiscount
      );
      if (!hasAnyOrRule) matched = true; // len gating → každý produkt je kandidát

      if (!matched) continue;

      // ── Gating filtery (AND) ──
      if (!passesGating(badge, product)) continue;

      results.push(badge);
    }

    return results.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
  };

  /** PDP-only: rozdelí badges podľa pdpPosition na 'top' (nad logom) a 'image' (na hero obrázku). */
  const splitPdpBadges = (product: any): { topBadges: Badge[]; imageBadges: Badge[] } => {
    const all = getProductBadges(product, 'pdp');
    return {
      topBadges: all.filter((b) => (b.pdpPosition ?? 'top') === 'top'),
      imageBadges: all.filter((b) => b.pdpPosition === 'image'),
    };
  };

  return { badges, getProductBadges, splitPdpBadges };
};
