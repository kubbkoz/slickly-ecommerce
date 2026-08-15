import { computed, unref, ref } from 'vue';
import { a as useCart } from './server.mjs';

function useAddToCart(product) {
  const _product = computed(() => unref(product));
  const { addProduct, cartItems } = useCart();
  const quantity = ref(1);
  async function addToCart() {
    if (!_product.value?.id) throw new Error("Product id is required");
    const addToCartResponse = await addProduct({
      id: _product.value?.id,
      quantity: quantity.value
    });
    quantity.value = 1;
    return addToCartResponse;
  }
  const getStock = computed(() => _product.value?.stock);
  const getAvailableStock = computed(() => _product.value?.availableStock);
  const isInCart = computed(
    () => cartItems.value.some(
      (item) => item.referencedId === _product.value?.id
    )
  );
  return {
    addToCart,
    quantity,
    getStock,
    getAvailableStock,
    isInCart,
    count: computed(
      () => cartItems.value.find(
        (item) => item.referencedId === _product.value?.id
      )?.quantity || 0
    )
  };
}
function useCartErrorParamsResolver() {
  const resolveCartError = (errorObject) => {
    let params = null;
    let messageKey = errorObject.messageKey;
    const { cartItems } = useCart();
    const extractProductId = (message, error) => {
      return message.replace(error, "");
    };
    const buildProductStockReached = () => {
      const productId = extractProductId(
        errorObject.key,
        "product-stock-reached"
      );
      const product = getItem(productId);
      return {
        name: product?.label || "",
        quantity: product?.quantityInformation?.maxPurchase || null
      };
    };
    const getItem = (id) => {
      return cartItems.value.find((item) => item.id === id);
    };
    const buildShippingMethodBlocked = () => {
      return errorObject.message?.replace("shipping-method-blocked-", "") || "";
    };
    switch (errorObject.messageKey) {
      case "product-stock-reached":
        params = buildProductStockReached();
        if (!params.name || !params.quantity) {
          messageKey = "product-stock-reached-empty";
          params = null;
        }
        break;
      case "shipping-method-blocked":
        params = {
          name: buildShippingMethodBlocked()
        };
        break;
      default:
        params = { ...errorObject };
    }
    return {
      params,
      messageKey
    };
  };
  return {
    resolveCartError
  };
}

export { useCartErrorParamsResolver as a, useAddToCart as u };
