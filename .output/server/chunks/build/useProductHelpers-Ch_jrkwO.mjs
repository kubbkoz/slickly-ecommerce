import { c as useRouter, b as useLocalePath, E as getProductUrl, i as useRuntimeConfig } from './server.mjs';

const useProductHelpers = () => {
  const router = useRouter();
  const config = useRuntimeConfig();
  const FALLBACK_IMAGE = "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
  const handleImageError = (e, product) => {
    const target = e.target;
    if (target.src === FALLBACK_IMAGE) return;
    target.src = FALLBACK_IMAGE;
  };
  const rewriteForDev = (url) => {
    return url;
  };
  const getProductImageUrl = (product) => {
    if (!product) return FALLBACK_IMAGE;
    if (product.cover?.media?.url) return rewriteForDev(product.cover.media.url);
    if (Array.isArray(product.media) && product.media.length > 0) {
      return rewriteForDev(product.media[0]?.media?.url || FALLBACK_IMAGE);
    }
    return FALLBACK_IMAGE;
  };
  const getSecondaryImageUrl = (product) => {
    if (!product || !Array.isArray(product.media) || product.media.length < 2) return FALLBACK_IMAGE;
    const sortedMedia = [...product.media].sort((a, b) => (a.position || 0) - (b.position || 0));
    const url = sortedMedia[1]?.media?.url ?? null;
    return url ? rewriteForDev(url) : FALLBACK_IMAGE;
  };
  const calculateDiscount = (product) => {
    const price = product.calculatedPrice?.unitPrice ?? product.price?.[0]?.gross;
    const listPrice = product.calculatedPrice?.listPrice?.price ?? product.price?.[0]?.listPrice?.gross;
    if (listPrice && price && listPrice > price) {
      return Math.round((listPrice - price) / listPrice * 100);
    }
    return 0;
  };
  const getPrice = (product) => product.calculatedPrice?.unitPrice ?? product.price?.[0]?.gross;
  const getOldPrice = (product) => product.calculatedPrice?.listPrice?.price ?? null;
  const getProductUrl$1 = (product) => {
    return getProductUrl(product);
  };
  const navigateToProduct = (product) => {
    const localePath = useLocalePath();
    router.push(localePath(getProductUrl$1(product)));
  };
  const getVariantLabel = (child, parent) => {
    if (Array.isArray(child.variation) && child.variation.length > 0) {
      return child.variation.map((v) => v.name || v.translated?.name).filter(Boolean).join(", ");
    }
    let allOptions = [...child.options || [], ...child.properties || []];
    if (parent?.configuratorSettings && child.optionIds) {
      const parentOptions = parent.configuratorSettings.filter((cs) => child.optionIds.includes(cs.optionId)).map((cs) => cs.option);
      allOptions = [...allOptions, ...parentOptions];
    }
    if (allOptions.length === 0) {
      const n = child.translated?.name || child.name || "";
      if (n.toUpperCase().includes("(VARIANT)")) return "";
      return n;
    }
    const FRAME_SIZE_GROUP_IDS = [
      config.public.shopware.ids.properties.frameSize,
      config.public.shopware.ids.properties.size
    ];
    const exactMatch = allOptions.find(
      (o) => FRAME_SIZE_GROUP_IDS.includes(o.groupId) || FRAME_SIZE_GROUP_IDS.includes(o.group?.id)
    );
    if (exactMatch) return exactMatch.translated?.name || exactMatch.name;
    const SIZE_GROUP_NAMES = ["veľkosť rámu", "veľkosť", "size", "frame size"];
    const nameMatch = allOptions.find(
      (o) => SIZE_GROUP_NAMES.includes((o.group?.translated?.name || o.group?.name || "").toLowerCase())
    );
    if (nameMatch) return nameMatch.translated?.name || nameMatch.name;
    const sizelike = allOptions.find((o) => {
      const n = o.translated?.name || o.name || "";
      return n.length < 20 && /\d/.test(n);
    });
    if (sizelike) return sizelike.translated?.name || sizelike.name;
    return allOptions[0]?.translated?.name || allOptions[0]?.name || "";
  };
  const hasPriceVariance = (product) => {
    const variants = product.children || product.variants || [];
    if (variants.length === 0) return false;
    const firstPrice = getPrice(variants[0]);
    return variants.some((v) => getPrice(v) !== firstPrice);
  };
  const sortVariants = (children, parent) => [...children].sort((a, b) => {
    const labelA = getVariantLabel(a, parent);
    const labelB = getVariantLabel(b, parent);
    const numA = parseFloat(labelA.match(/\d+(\.\d+)?/)?.[0] || "0");
    const numB = parseFloat(labelB.match(/\d+(\.\d+)?/)?.[0] || "0");
    if (numA && numB && numA !== numB) return numA - numB;
    return labelA.localeCompare(labelB, void 0, { numeric: true, sensitivity: "base" });
  });
  const getFormattedName = (product) => {
    let name = product.translated?.name || product.name || "";
    if (name.toUpperCase().includes("(VARIANT)")) {
      name = name.replace(/\(VARIANT\)/gi, "").trim().replace(/[,.]$/, "").trim();
      const label = getVariantLabel(product, null);
      if (label && label.length > 0) {
        const cleanLabel = label.trim();
        const alreadyContains = name.toLowerCase().includes(cleanLabel.toLowerCase());
        if (!alreadyContains && cleanLabel !== name) {
          return `${name} - ${cleanLabel}`;
        }
      }
    }
    return name;
  };
  return {
    FALLBACK_IMAGE,
    handleImageError,
    getProductImageUrl,
    getSecondaryImageUrl,
    calculateDiscount,
    getPrice,
    getOldPrice,
    getProductUrl: getProductUrl$1,
    navigateToProduct,
    getVariantLabel,
    getFormattedName,
    hasPriceVariance,
    sortVariants
  };
};

export { useProductHelpers as u };
