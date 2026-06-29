import { computed } from "vue";
import {
  useShopwareContext,
  useAsyncData,
  useShopwareLanguage,
  useI18n
} from "#imports";

export interface ShippingMetadata {
  id: string;
  name: string;
  deliveryTime: string | null;
  basePrice: number | null;
  freeThreshold: number | null;
  logoUrl: string | null;
  availabilityRule: any | null;
  isAvailable: boolean;
}

/**
 * Recursively searches a Shopware rule conditions tree for a cart subtotal condition.
 * Shopware nests conditions inside andContainer / orContainer nodes.
 */
function findCartSubtotalCondition(conditions: any[]): any | null {
  for (const c of conditions) {
    if (
      c.type === 'cartSubtotal' &&
      (c.operator === '>=' || c.operator === '>')
    ) {
      return c;
    }
    // Recurse into container nodes (andContainer, orContainer, etc.)
    if (Array.isArray(c.conditions) && c.conditions.length > 0) {
      const found = findCartSubtotalCondition(c.conditions);
      if (found) return found;
    }
  }
  return null;
}

export function useShippingMetadata() {
  const { apiClient } = useShopwareContext();
  const { currentLanguageId } = useShopwareLanguage();
  const { locale } = useI18n();
  const config = useRuntimeConfig();

  const BALIKOVO_ID     = config.public.shopware.ids.shipping.balikovo;
  const TOPTRANS_ID     = config.public.shopware.ids.shipping.toptrans;
  const TOPTRANS_CZ_ID  = config.public.shopware.ids.shipping.toptransCz;
  const TOPTRANS_PL_ID  = config.public.shopware.ids.shipping.toptransPl;
  const SPS_ID          = config.public.shopware.ids.shipping.sps;
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
                  },
                },
              },
              deliveryTime: {},
              media: {},
              availabilityRule: {},
            },
          },
        });
        return response.data?.elements || [];
      } catch (err) {
        console.error("[useShippingMetadata] API fetch failed:", err);
        return [];
      }
    },
    { server: true }
  );

  const parseMethod = (method: any): ShippingMetadata => {
    if (!method) return {
      id: "", name: "", deliveryTime: null, basePrice: null,
      freeThreshold: null, logoUrl: null, availabilityRule: null, isAvailable: false,
    };

    const prices = [...(method.prices || [])].sort(
      (a: any, b: any) => a.quantityStart - b.quantityStart
    );

    // ── Base price ───────────────────────────────────────────────────────
    const basePriceRule = prices.find((p: any) => (p.currencyPrice?.[0]?.gross ?? 0) > 0);
    const basePrice = basePriceRule?.currencyPrice?.[0]?.gross ?? null;

    // ── Free shipping threshold ──────────────────────────────────────────
    // Shopware supports two configurations:
    //
    //  A) Tier-based (Calculation: Cart amount)
    //     quantityStart of the free tier IS the monetary threshold (e.g. 299).
    //     Reliable indicator: quantityStart > 1.
    //
    //  B) Rule-based (Calculation: none / flat rate with a conditional rule)
    //     Every tier has quantityStart = 1 (minimum item count, not money).
    //     The actual threshold lives in the Rule's conditions tree:
    //       { type: "cartSubtotal", operator: ">=", value: "299" }
    //     We fetch it via prices.rule.conditions association.
    const freePriceRule = prices.find((p: any) => (p.currencyPrice?.[0]?.gross ?? -1) === 0);

    let freeThreshold: number | null = null;

    if (freePriceRule) {
      const qs = Number(freePriceRule.quantityStart ?? 0);

      if (qs > 1) {
        // A) Tier-based — quantityStart is the monetary cart-amount threshold
        freeThreshold = qs;
      } else {
        // B) Rule-based — parse the cart subtotal condition from the rule tree
        const conditions: any[] = freePriceRule.rule?.conditions ?? [];
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
      isAvailable: !!method.active,
    };
  };

  const balikovoMetadata    = computed(() => parseMethod(rawData.value?.find((m: any) => m.id === BALIKOVO_ID)));
  const toptransMetadata    = computed(() => parseMethod(rawData.value?.find((m: any) => m.id === TOPTRANS_ID)));
  const toptransCzMetadata  = computed(() => parseMethod(rawData.value?.find((m: any) => m.id === TOPTRANS_CZ_ID)));
  const toptransPlMetadata  = computed(() => parseMethod(rawData.value?.find((m: any) => m.id === TOPTRANS_PL_ID)));
  const spsMetadata         = computed(() => parseMethod(rawData.value?.find((m: any) => m.id === SPS_ID)));
  const osobnyOdberMetadata = computed(() => parseMethod(rawData.value?.find((m: any) => m.id === OSOBNY_ODBER_ID)));

  /**
   * Doprava zadarmo platí IBA pre Slovensko (prahy 199 € / 299 €).
   * CZ/PL majú fixnú sadzbu (Toptrans CZ/PL) bez bezplatnej dopravy.
   */
  const isFreeShippingCountry = (iso: string): boolean =>
    ['SK', ''].includes((iso || '').toUpperCase());

  /**
   * Lowest free-shipping threshold across courier methods (Balíkovo + SPS).
   *
   * Returns null in two cases:
   *   1. API is still pending — prevents any premature UI state
   *   2. Shopware data did not yield a parseable threshold — bar stays hidden
   *      rather than showing incorrect information
   *
   * No hardcoded fallbacks. Every value is sourced from Shopware backend.
   */
  const lowestFreeThreshold = computed<number | null>(() => {
    if (pending.value) return null;

    const thresholds = [
      balikovoMetadata.value.freeThreshold,
      spsMetadata.value.freeThreshold,
    ].filter((v): v is number => typeof v === 'number' && v > 1);

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
    parseMethod,
  };
}
