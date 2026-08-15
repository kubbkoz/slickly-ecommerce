import { inject, ref, provide, computed } from 'vue';
import { e as useShopwareContext } from './server.mjs';

function useNavigation(params) {
  const type = params?.type || "main-navigation";
  const { apiClient } = useShopwareContext();
  const sharedElements = inject(
    `swNavigation-${type}`,
    ref([])
  );
  provide(`swNavigation-${type}`, sharedElements);
  const navigationElements = computed(() => sharedElements.value);
  async function loadNavigationElements(params2) {
    try {
      const navigationResponse = await apiClient.invoke(
        "readNavigation post /navigation/{activeId}/{rootId}",
        {
          headers: {
            "sw-include-seo-urls": true
          },
          pathParams: {
            activeId: type,
            rootId: type
          },
          body: params2
        }
      );
      sharedElements.value = navigationResponse.data || [];
      return sharedElements.value;
    } catch (e) {
      sharedElements.value = [];
      return [];
    }
  }
  return {
    navigationElements,
    loadNavigationElements
  };
}

export { useNavigation as u };
