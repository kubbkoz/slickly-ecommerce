import { computed } from 'vue';
import { e as useShopwareContext, m as useI18n, h as useAsyncData, i as useRuntimeConfig } from './server.mjs';
import { u as useShopwareLanguage } from './useShopwareLanguage-CGPCneCN.mjs';

function findCartSubtotalCondition(conditions) {
  for (const c of conditions) {
    if (c.type === "cartSubtotal" && (c.operator === ">=" || c.operator === ">")) {
      return c;
    }
    if (Array.isArray(c.conditions) && c.conditions.length > 0) {
      const found = findCartSubtotalCondition(c.conditions);
      if (found) return found;
    }
  }
  return null;
}
function useShippingMetadata() {
  const { apiClient } = useShopwareContext();
  const { currentLanguageId } = useShopwareLanguage();
  const { locale } = useI18n();
  const config = useRuntimeConfig();
  const BALIKOVO_ID = config.public.shopware.ids.shipping.balikovo;
  const TOPTRANS_ID = config.public.shopware.ids.shipping.toptrans;
  const TOPTRANS_CZ_ID = config.public.shopware.ids.shipping.toptransCz;
  const TOPTRANS_PL_ID = config.public.shopware.ids.shipping.toptransPl;
  const SPS_ID = config.public.shopware.ids.shipping.sps;
  const OSOBNY_ODBER_ID = config.public.shopware.ids.shipping.osobnyOdber;
  const { data: rawData, pending, error } = useAsyncData(
    `shipping-methods-metadata-${locale.value}`,
    async () => {
      try {
        const response = await apiClient.invoke("readShippingMethod post /shipping-method", {
          headers: { "sw-language-id": currentLanguageId.value },
          body: {
            associations: {
              prices: {
                associations: {
                  // Fetch the Shopware Rule bound to each price entry,
                  // including its full conditions tree — this is where the
                  // monetary threshold (e.g. "cart subtotal >= 299") lives
                  // when free shipping is configured via Rule Engine.
                  rule: {
                    associations: { conditions: {} }
                  }
                }
              },
              deliveryTime: {},
              media: {},
              availabilityRule: {}
            }
          }
        });
        return response.data?.elements || [];
      } catch (err) {
        return [];
      }
    },
    { server: true }
  );
  const parseMethod = (method) => {
    if (!method) return {
      id: "",
      name: "",
      deliveryTime: null,
      basePrice: null,
      freeThreshold: null,
      logoUrl: null,
      availabilityRule: null,
      isAvailable: false
    };
    const prices = [...method.prices || []].sort(
      (a, b) => a.quantityStart - b.quantityStart
    );
    const basePriceRule = prices.find((p) => (p.currencyPrice?.[0]?.gross ?? 0) > 0);
    const basePrice = basePriceRule?.currencyPrice?.[0]?.gross ?? null;
    const freePriceRule = prices.find((p) => (p.currencyPrice?.[0]?.gross ?? -1) === 0);
    let freeThreshold = null;
    if (freePriceRule) {
      const qs = Number(freePriceRule.quantityStart ?? 0);
      if (qs > 1) {
        freeThreshold = qs;
      } else {
        const conditions = freePriceRule.rule?.conditions ?? [];
        const cartCond = findCartSubtotalCondition(conditions);
        if (cartCond?.value != null) {
          const parsed = parseFloat(String(cartCond.value));
          if (!isNaN(parsed) && parsed > 0) {
            freeThreshold = parsed;
          }
        }
      }
    }
    return {
      id: method.id,
      name: method.translated?.name || method.name,
      deliveryTime: method.deliveryTime?.translated?.name || method.deliveryTime?.name || null,
      basePrice,
      freeThreshold,
      logoUrl: method.media?.url || null,
      availabilityRule: method.availabilityRule || null,
      isAvailable: !!method.active
    };
  };
  const balikovoMetadata = computed(() => parseMethod(rawData.value?.find((m) => m.id === BALIKOVO_ID)));
  const toptransMetadata = computed(() => parseMethod(rawData.value?.find((m) => m.id === TOPTRANS_ID)));
  const toptransCzMetadata = computed(() => parseMethod(rawData.value?.find((m) => m.id === TOPTRANS_CZ_ID)));
  const toptransPlMetadata = computed(() => parseMethod(rawData.value?.find((m) => m.id === TOPTRANS_PL_ID)));
  const spsMetadata = computed(() => parseMethod(rawData.value?.find((m) => m.id === SPS_ID)));
  const osobnyOdberMetadata = computed(() => parseMethod(rawData.value?.find((m) => m.id === OSOBNY_ODBER_ID)));
  const isFreeShippingCountry = (iso) => ["SK", ""].includes((iso || "").toUpperCase());
  const lowestFreeThreshold = computed(() => {
    if (pending.value) return null;
    const thresholds = [
      balikovoMetadata.value.freeThreshold,
      spsMetadata.value.freeThreshold
    ].filter((v) => typeof v === "number" && v > 1);
    return thresholds.length > 0 ? Math.min(...thresholds) : null;
  });
  return {
    shippingMethods: rawData,
    balikovoMetadata,
    toptransMetadata,
    toptransCzMetadata,
    toptransPlMetadata,
    spsMetadata,
    osobnyOdberMetadata,
    lowestFreeThreshold,
    isFreeShippingCountry,
    isLoading: pending,
    fetchError: error,
    parseMethod
  };
}

export { useShippingMetadata as u };
