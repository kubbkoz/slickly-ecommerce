import { getProductTierPrices } from '@shopware/helpers';
import { computed } from 'vue';

function useProductPrice(product) {
  const _cheapest = computed(() => product.value?.calculatedCheapestPrice);
  const _real = computed(
    () => (product.value?.calculatedPrices?.length ?? 0) > 0 ? product.value?.calculatedPrices?.[0] : product.value?.calculatedPrice
  );
  const referencePrice = computed(() => _real?.value?.referencePrice);
  const displayFrom = computed(() => {
    return (product.value?.calculatedPrices?.length ?? 0) > 1;
  });
  const displayFromVariants = computed(
    () => {
      return !!product.value?.parentId && product.value?.calculatedCheapestPrice?.hasRange && _real?.value?.unitPrice !== _cheapest?.value?.unitPrice && _cheapest?.value?.unitPrice;
    }
  );
  const _price = computed(
    () => {
      if (displayFrom.value && getProductTierPrices(product.value).length > 1) {
        return product.value?.calculatedPrices?.reduce((previous, current) => {
          return current.unitPrice < previous.unitPrice ? current : previous;
        });
      }
      return _real.value;
    }
  );
  const unitPrice = computed(
    () => _price.value?.unitPrice
  );
  const totalPrice = computed(
    () => _price.value?.totalPrice
  );
  const price = computed(
    () => _price.value
  );
  const isListPrice = computed(() => {
    return !!_price.value?.listPrice?.percentage;
  });
  const regulationPrice = computed(
    () => product.value?.calculatedPrice?.regulationPrice?.price
  );
  const tierPrices = computed(() => getProductTierPrices(product.value));
  return {
    price,
    totalPrice,
    unitPrice,
    displayFromVariants,
    displayFrom,
    tierPrices,
    referencePrice,
    isListPrice,
    regulationPrice
  };
}

export { useProductPrice as u };
