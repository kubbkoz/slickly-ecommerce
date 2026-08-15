import { ref, watch, computed } from 'vue';
import { k as createSharedComposable, l as useSessionContext, e as useShopwareContext } from './server.mjs';

function _usePrice(params) {
  const { sessionContext } = useSessionContext();
  const { browserLocale } = useShopwareContext();
  const currencyLocale = ref(browserLocale);
  const currencyCode = ref("");
  if (params) {
    currencyCode.value = params.currencyCode;
    _setLocaleCode(params.localeCode);
  }
  function update(params2) {
    _setCurrencyCode(params2.currencyCode);
    _setLocaleCode(params2.localeCode);
  }
  function _setCurrencyCode(code) {
    currencyCode.value = code;
  }
  function _setLocaleCode(locale) {
    currencyLocale.value = locale || currencyLocale.value;
  }
  function getFormattedPrice(value) {
    if (typeof value === "undefined") {
      return "";
    }
    if (!currencyLocale.value || !currencyCode.value) {
      return value.toString();
    }
    return new Intl.NumberFormat(currencyLocale.value, {
      style: "currency",
      currency: currencyCode.value
    }).format(+value);
  }
  watch(
    () => sessionContext.value?.currency,
    (newCurrency) => {
      if (newCurrency)
        update({
          // locale code is read only once on SSR because it's unavailable in the context
          currencyCode: newCurrency?.isoCode
        });
    },
    {
      immediate: true
    }
  );
  return {
    getFormattedPrice,
    update,
    currencyCode: computed(() => currencyCode.value),
    currencyLocale: computed(() => currencyLocale.value)
  };
}
const usePrice = createSharedComposable(_usePrice);

export { usePrice as u };
