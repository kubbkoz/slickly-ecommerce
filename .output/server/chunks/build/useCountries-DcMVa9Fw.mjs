import { inject, ref, provide, computed } from 'vue';
import { e as useShopwareContext } from './server.mjs';

function useCountries() {
  const { apiClient } = useShopwareContext();
  const _sharedCountries = inject("swCountries", ref());
  provide("swCountries", _sharedCountries);
  async function fetchCountries() {
    const result = await apiClient.invoke("readCountry post /country", {
      body: {
        associations: {
          states: {}
        }
      }
    });
    _sharedCountries.value = result.data.elements;
    return result.data;
  }
  const getCountries = computed(() => {
    return _sharedCountries.value ?? [];
  });
  const getCountriesOptions = computed(() => {
    return _sharedCountries.value?.map((element) => ({
      label: element.translated.name,
      value: element.id
    })) ?? [];
  });
  const mountedCallback = async () => {
    if (!_sharedCountries.value) {
      await fetchCountries();
    }
  };
  const getStatesForCountry = (countryId) => {
    return getCountries.value.find((element) => {
      return element.id === countryId;
    })?.states || null;
  };
  return {
    mountedCallback,
    fetchCountries,
    getStatesForCountry,
    getCountries,
    getCountriesOptions
  };
}

export { useCountries as u };
