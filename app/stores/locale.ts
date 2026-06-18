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

const STORAGE_KEY = 'slickly-locale'
const DEFAULT_COUNTRY = 'SK'

export const useLocaleStore = defineStore('locale', {
  state: () => ({
    countryCode: DEFAULT_COUNTRY,
  }),

  getters: {
    country: (state): CountryOption =>
      countries.find((c) => c.code === state.countryCode) ?? countries[0]!,
    currency(): CountryOption['currency'] { return this.country.currency },
    rate(): number { return this.country.rate },
    language(): string { return this.country.language },
    localeTag(): string { return this.country.locale },
  },

  actions: {
    setCountry(code: string) {
      if (!countries.some((c) => c.code === code)) return
      this.countryCode = code
      this.persist()
    },

    persist() {
      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY, this.countryCode)
      }
    },

    hydrate() {
      if (import.meta.client) {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw && countries.some((c) => c.code === raw)) {
          this.countryCode = raw
        }
      }
    },
  },
})
