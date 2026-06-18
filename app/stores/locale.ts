import { defineStore } from 'pinia'

export interface CountryOption {
  code: string
  name: string
  language: string
  languageLabel: string
  currency: 'EUR' | 'CZK' | 'PLN' | 'HUF'
  locale: string
  rate: number
}

export const countries: CountryOption[] = [
  { code: 'SK', name: 'Slovensko', language: 'sk', languageLabel: 'Slovenčina', currency: 'EUR', locale: 'sk-SK', rate: 1 },
  { code: 'CZ', name: 'Česko', language: 'cs', languageLabel: 'Čeština', currency: 'CZK', locale: 'cs-CZ', rate: 25.3 },
  { code: 'PL', name: 'Poľsko', language: 'pl', languageLabel: 'Polski', currency: 'PLN', locale: 'pl-PL', rate: 4.3 },
  { code: 'HU', name: 'Maďarsko', language: 'hu', languageLabel: 'Magyar', currency: 'HUF', locale: 'hu-HU', rate: 396 },
  { code: 'DE', name: 'Nemecko', language: 'de', languageLabel: 'Deutsch', currency: 'EUR', locale: 'de-DE', rate: 1 },
  { code: 'AT', name: 'Rakúsko', language: 'de', languageLabel: 'Deutsch (AT)', currency: 'EUR', locale: 'de-AT', rate: 1 },
]

const DEFAULT_COUNTRY = 'SK'

export const useLocaleStore = defineStore('locale', () => {
  const cookie = useCookie<string>('slickly-locale', {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    default: () => DEFAULT_COUNTRY,
  })

  const countryCode = ref(
    (cookie.value && countries.some((c) => c.code === cookie.value) ? cookie.value : DEFAULT_COUNTRY),
  )

  const country = computed((): CountryOption =>
    countries.find((c) => c.code === countryCode.value) ?? countries[0]!,
  )
  const currency = computed((): CountryOption['currency'] => country.value.currency)
  const rate = computed((): number => country.value.rate)
  const language = computed((): string => country.value.language)
  const localeTag = computed((): string => country.value.locale)

  function setCountry(code: string) {
    if (!countries.some((c) => c.code === code)) return
    countryCode.value = code
    cookie.value = code
  }

  return { countryCode, country, currency, rate, language, localeTag, setCountry }
})
