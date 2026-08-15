import { computed } from 'vue';
import { R as useContext, Y as ContextError } from './server.mjs';

function useProduct(product, configurator) {
  const _product = useContext("product", { context: product });
  if (!_product.value) {
    throw new ContextError("Product");
  }
  const _configurator = useContext("configurator", {
    context: product && configurator
  });
  function changeVariant(variant) {
    if (!variant) {
      return;
    }
    _product.value = Object.assign({}, _product.value, variant);
  }
  return {
    product: computed(() => _product.value),
    configurator: computed(() => _configurator.value),
    changeVariant
  };
}

export { useProduct as u };
