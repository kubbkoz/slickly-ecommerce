export function useCurrency() {
  const locale = useLocaleStore()

  const formatPrice = (priceEur: number): string => {
    const converted = priceEur * locale.rate
    const fractionDigits = locale.currency === 'HUF' ? 0 : 2
    return new Intl.NumberFormat(locale.localeTag, {
      style: 'currency',
      currency: locale.currency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(converted)
  }

  return { formatPrice }
}
