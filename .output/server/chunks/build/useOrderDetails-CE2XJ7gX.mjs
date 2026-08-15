import { e as useShopwareContext, N as defu } from './server.mjs';
import { ref, inject, provide, computed } from 'vue';
import { u as useDefaultOrderAssociations } from './useDefaultOrderAssociations-WycTFxJ-.mjs';

function useOrderDetails(orderId, associations) {
  const { apiClient } = useShopwareContext();
  const paymentChangeableList = ref({});
  const _sharedOrder = inject(
    "swOrderDetails",
    ref()
  );
  provide("swOrderDetails", _sharedOrder);
  const orderAssociations = useDefaultOrderAssociations();
  const paymentMethod = computed(() => {
    const transactions = _sharedOrder.value?.transactions;
    if (!transactions?.length) return void 0;
    return transactions[transactions.length - 1]?.paymentMethod;
  });
  const shippingMethod = computed(() => {
    const deliveries = _sharedOrder.value?.deliveries;
    if (!deliveries?.length) return void 0;
    return deliveries[deliveries.length - 1]?.shippingMethod;
  });
  const paymentUrl = ref();
  const personalDetails = computed(() => ({
    email: _sharedOrder.value?.orderCustomer?.email,
    firstName: _sharedOrder.value?.orderCustomer?.firstName,
    lastName: _sharedOrder.value?.orderCustomer?.lastName
  }));
  const billingAddress = computed(
    () => _sharedOrder.value?.addresses?.find(
      ({ id }) => id === _sharedOrder.value?.billingAddressId
    )
  );
  const shippingAddress = computed(
    () => _sharedOrder.value?.deliveries?.[0]?.shippingOrderAddress
  );
  const shippingCosts = computed(() => _sharedOrder.value?.shippingTotal);
  const subtotal = computed(() => _sharedOrder.value?.price?.positionPrice);
  const total = computed(() => _sharedOrder.value?.price?.totalPrice);
  const status = computed(
    () => _sharedOrder.value?.stateMachineState?.translated.name
  );
  const statusTechnicalName = computed(
    () => _sharedOrder.value?.stateMachineState?.technicalName
  );
  async function loadOrderDetails() {
    const mergedAssociations = defu(
      orderAssociations,
      {}
    );
    const params = {
      ids: [orderId],
      associations: mergedAssociations,
      checkPromotion: true
    };
    const orderDetailsResponse = await apiClient.invoke(
      "readOrder post /order",
      {
        body: params
      }
    );
    _sharedOrder.value = orderDetailsResponse.data.orders?.elements?.[0] ?? void 0;
    paymentChangeableList.value = orderDetailsResponse.data.paymentChangeable ?? {};
    return orderDetailsResponse.data;
  }
  async function handlePayment(finishUrl, errorUrl) {
    const resp = await apiClient.invoke(
      "handlePaymentMethod post /handle-payment",
      {
        body: {
          orderId,
          finishUrl,
          errorUrl
        }
      }
    );
    paymentUrl.value = resp.data.redirectUrl;
  }
  async function cancel() {
    const resp = await apiClient.invoke(
      "cancelOrder post /order/state/cancel",
      {
        body: {
          orderId
        }
      }
    );
    await loadOrderDetails();
    return resp.data;
  }
  async function changePaymentMethod(paymentMethodId) {
    const response = await apiClient.invoke(
      "orderSetPayment post /order/payment",
      {
        body: {
          orderId,
          paymentMethodId
        }
      }
    );
    await loadOrderDetails();
    return response.data;
  }
  async function getMediaFile(downloadId) {
    const response = await apiClient.invoke(
      "orderDownloadFile get /order/download/{orderId}/{downloadId}",
      {
        accept: "application/octet-stream",
        pathParams: {
          orderId,
          downloadId
        }
      }
    );
    return response.data;
  }
  async function getDocumentFile(documentId, deepLinkCode) {
    const response = await apiClient.invoke(
      "download post /document/download/{documentId}/{deepLinkCode}",
      {
        pathParams: {
          documentId,
          deepLinkCode
        },
        accept: "application/pdf"
      }
    );
    return response.data;
  }
  const hasDocuments = computed(() => !!_sharedOrder.value?.documents.length);
  const documents = computed(() => _sharedOrder.value?.documents || []);
  const paymentChangeable = computed(() => {
    return paymentChangeableList.value?.[orderId] ?? false;
  });
  const getPaymentMethods = async () => {
    const response = await apiClient.invoke(
      "readPaymentMethod post /payment-method",
      {
        body: { onlyAvailable: true }
      }
    );
    return response.data.elements || [];
  };
  return {
    order: computed(() => _sharedOrder.value),
    status,
    statusTechnicalName,
    total,
    subtotal,
    shippingCosts,
    shippingAddress,
    billingAddress,
    personalDetails,
    paymentUrl,
    shippingMethod,
    paymentMethod,
    hasDocuments,
    documents,
    loadOrderDetails,
    handlePayment,
    cancel,
    changePaymentMethod,
    getMediaFile,
    getDocumentFile,
    paymentChangeable,
    getPaymentMethods
  };
}

export { useOrderDetails as u };
