import { inject, ref, provide, computed } from 'vue';
import { e as useShopwareContext } from './server.mjs';

function useSalutations() {
  const { apiClient } = useShopwareContext();
  const _salutations = inject("swSalutations", ref());
  provide("swSalutations", _salutations);
  const fetchSalutations = async () => {
    const result = await apiClient.invoke("readSalutation post /salutation");
    _salutations.value = result.data.elements;
    return result.data;
  };
  const getSalutations = computed(() => {
    return _salutations.value || [];
  });
  return {
    fetchSalutations,
    getSalutations
  };
}

export { useSalutations as u };
