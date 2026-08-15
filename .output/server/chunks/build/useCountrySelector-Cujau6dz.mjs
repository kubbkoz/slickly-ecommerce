import { p as useCookie, g as useState, h as useAsyncData } from './server.mjs';
import { computed } from 'vue';

const COOKIE_NAME = "mtsport_delivery_country";
const SK_RATE = 23;
const useCountrySelector = () => {
  const countryCookie = useCookie(COOKIE_NAME, {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax"
  });
  const selectedCountryId = useState(
    "selectedDeliveryCountryId",
    () => countryCookie.value || ""
  );
  const { data: availableCountries, status } = useAsyncData(
    "delivery-countries",
    () => $fetch("/api/checkout/countries"),
    { server: false, lazy: true, default: () => [] }
  );
  const { data: taxRatesMap } = useAsyncData(
    "delivery-tax-rates",
    () => $fetch("/api/checkout/tax-rates"),
    { server: false, lazy: true, default: () => ({}) }
  );
  const isLoading = computed(() => status.value === "pending");
  const selectedCountry = computed(
    () => availableCountries.value?.find((c) => c.id === selectedCountryId.value) ?? null
  );
  const selectedCountryDisplay = computed(() => {
    const c = selectedCountry.value;
    const iso = c?.iso || "SK";
    return {
      iso,
      name: c?.name || "Slovensko",
      flagUrl: `https://flagcdn.com/w40/${iso.toLowerCase()}.png`
    };
  });
  const selectedCountryTaxRate = computed(() => {
    const countryId = selectedCountryId.value;
    const map = taxRatesMap.value;
    if (!map || !Object.keys(map).length) return SK_RATE;
    if (countryId && map[countryId] != null) return map[countryId];
    return map._default ?? SK_RATE;
  });
  const adjustPrice = (skGrossPrice) => {
    if (!skGrossPrice) return 0;
    const rate = selectedCountryTaxRate.value;
    if (rate === SK_RATE) return skGrossPrice;
    const net = skGrossPrice / (1 + SK_RATE / 100);
    return Math.round(net * (1 + rate / 100) * 100) / 100;
  };
  const selectCountry = (country) => {
    selectedCountryId.value = country.id;
    countryCookie.value = country.id;
  };
  return {
    availableCountries,
    isLoading,
    selectedCountryId,
    selectedCountry,
    selectedCountryDisplay,
    selectedCountryTaxRate,
    adjustPrice,
    selectCountry
  };
};

export { useCountrySelector as u };
