import { ref, computed } from 'vue';
import { e as useShopwareContext } from './server.mjs';

function useCustomerOrders() {
  const { apiClient } = useShopwareContext();
  const orders = ref([]);
  const currentPaginationPage = ref(1);
  const limit = ref(15);
  const totalOrderItemsCount = ref(0);
  const currentParams = ref({});
  const loadOrders = async (parameters = {}) => {
    const params = {
      ...parameters,
      limit: limit.value
    };
    currentParams.value = params;
    const fetchedOrders = await apiClient.invoke("readOrder post /order", {
      body: { ...params, "total-count-mode": "exact" }
    });
    orders.value = fetchedOrders.data.orders.elements;
    totalOrderItemsCount.value = fetchedOrders.data.orders.total ?? 0;
    currentPaginationPage.value = fetchedOrders.data.orders.page ?? 1;
  };
  const changeCurrentPage = async (pageNumber) => {
    await loadOrders({ ...currentParams.value, page: pageNumber });
    currentPaginationPage.value = pageNumber;
  };
  const currentPage = computed(() => currentPaginationPage.value);
  const totalPages = computed(() => {
    return Math.ceil(totalOrderItemsCount.value / limit.value);
  });
  return {
    orders,
    changeCurrentPage,
    loadOrders,
    currentPage,
    totalPages,
    limit
  };
}

export { useCustomerOrders as u };
