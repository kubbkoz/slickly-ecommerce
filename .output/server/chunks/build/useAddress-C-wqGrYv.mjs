import { ApiClientError } from '@shopware/api-client';
import { inject, ref, provide, computed } from 'vue';
import { e as useShopwareContext } from './server.mjs';

function useAddress() {
  const { apiClient } = useShopwareContext();
  const _storeCustomerAddresses = inject(
    "swCustomerAddresses",
    ref([])
  );
  provide("swCustomerAddresses", _storeCustomerAddresses);
  async function loadCustomerAddresses(parameters = {}) {
    try {
      const result = await apiClient.invoke(
        "listAddress post /account/list-address",
        {
          body: parameters
        }
      );
      _storeCustomerAddresses.value = result.data.elements;
    } catch (error) {
      if (error instanceof ApiClientError) {
        if (error.status === 403) {
          _storeCustomerAddresses.value = [];
        }
      }
      throw error;
    }
    return _storeCustomerAddresses.value;
  }
  async function createCustomerAddress(customerAddress) {
    const result = await apiClient.invoke(
      "createCustomerAddress post /account/address",
      {
        body: customerAddress
      }
    );
    return result.data;
  }
  async function updateCustomerAddress(customerAddress) {
    const result = await apiClient.invoke(
      "updateCustomerAddress patch /account/address/{addressId}",
      {
        pathParams: {
          addressId: customerAddress.id
        },
        body: customerAddress
      }
    );
    return result.data;
  }
  async function deleteCustomerAddress(addressId) {
    await apiClient.invoke(
      "deleteCustomerAddress delete /account/address/{addressId}",
      { pathParams: { addressId } }
    );
  }
  async function setDefaultCustomerBillingAddress(addressId) {
    const result = await apiClient.invoke(
      "defaultBillingAddress patch /account/address/default-billing/{addressId}",
      {
        pathParams: {
          addressId
        }
      }
    );
    return result.data;
  }
  async function setDefaultCustomerShippingAddress(addressId) {
    const result = await apiClient.invoke(
      "defaultShippingAddress patch /account/address/default-shipping/{addressId}",
      {
        pathParams: { addressId }
      }
    );
    return result.data;
  }
  function errorMessageBuilder(error) {
    switch (error.code) {
      case "VIOLATION::IS_BLANK_ERROR":
        return `${error?.source?.pointer?.slice(1)} - ${error.detail}`;
      default:
        return null;
    }
  }
  return {
    customerAddresses: computed(() => _storeCustomerAddresses.value || []),
    loadCustomerAddresses,
    createCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    setDefaultCustomerBillingAddress,
    setDefaultCustomerShippingAddress,
    errorMessageBuilder
  };
}

export { useAddress as u };
