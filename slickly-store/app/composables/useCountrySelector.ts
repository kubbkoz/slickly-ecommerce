export interface DeliveryCountry {
  id: string;
  name: string;
  iso: string;
}

const COOKIE_NAME = 'mtsport_delivery_country';
// SK VAT rate — všetky produktové ceny sú zadané ako SK brutto (napr. 199,99 € pri 23 %)
const SK_RATE = 23;

export const useCountrySelector = () => {

  // Cookie stores countryId — readable on both SSR and client
  const countryCookie = useCookie<string>(COOKIE_NAME, {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });

  // Global state — init from cookie so SSR and client agree on the ID
  const selectedCountryId = useState<string>(
    'selectedDeliveryCountryId',
    () => countryCookie.value || '',
  );

  // Countries loaded client-side only (no SSR — avoids hydration diff in lists)
  const { data: availableCountries, status } = useAsyncData(
    'delivery-countries',
    () => $fetch<DeliveryCountry[]>('/api/checkout/countries'),
    { server: false, lazy: true, default: () => [] as DeliveryCountry[] },
  );

  // Tax rates map: countryId → sadzba — rovnaký endpoint ako checkout
  const { data: taxRatesMap } = useAsyncData(
    'delivery-tax-rates',
    () => $fetch<Record<string, number>>('/api/checkout/tax-rates'),
    { server: false, lazy: true, default: () => ({} as Record<string, number>) },
  );

  const isLoading = computed(() => status.value === 'pending');

  const selectedCountry = computed(
    () => availableCountries.value?.find(c => c.id === selectedCountryId.value) ?? null,
  );

  // ISO/flag displayed on the button — falls back to SK until countries load
  const selectedCountryDisplay = computed(() => {
    const c = selectedCountry.value;
    const iso = c?.iso || 'SK';
    return {
      iso,
      name: c?.name || 'Slovensko',
      flagUrl: `https://flagcdn.com/w40/${iso.toLowerCase()}.png`,
    };
  });

  // DPH sadzba pre vybratú krajinu (reaktívna — zmena krajiny → okamžité prepočítanie cien)
  const selectedCountryTaxRate = computed<number>(() => {
    const countryId = selectedCountryId.value;
    const map = taxRatesMap.value;
    if (!map || !Object.keys(map).length) return SK_RATE;
    if (countryId && map[countryId] != null) return map[countryId];
    return map._default ?? SK_RATE;
  });

  /**
   * Prepočíta SK brutto cenu na brutto cenu pre vybratú krajinu.
   * netto = skGross / 1.23 (fixné pre všetky krajiny)
   * countryGross = netto × (1 + countryRate/100)
   *
   * Keď je táto funkcia volaná z computed(), Vue sleduje selectedCountryTaxRate
   * ako závislosť → zmena krajiny okamžite prepočíta všetky zobrazené ceny.
   */
  const adjustPrice = (skGrossPrice: number): number => {
    if (!skGrossPrice) return 0;
    const rate = selectedCountryTaxRate.value; // reaktívna závislosť
    if (rate === SK_RATE) return skGrossPrice;
    const net = skGrossPrice / (1 + SK_RATE / 100);
    return Math.round(net * (1 + rate / 100) * 100) / 100;
  };

  const selectCountry = (country: DeliveryCountry) => {
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
    selectCountry,
  };
};
