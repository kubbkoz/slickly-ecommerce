import { defineStore } from 'pinia'

const STORAGE_KEY = 'slickly-recently-viewed'
const MAX_ITEMS = 8

export const useRecentlyViewedStore = defineStore('recentlyViewed', {
  state: () => ({
    slugs: [] as string[],
  }),

  actions: {
    addProduct(slug: string) {
      this.slugs = [slug, ...this.slugs.filter((s) => s !== slug)].slice(0, MAX_ITEMS)
      this.persist()
    },

    persist() {
      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.slugs))
      }
    },

    hydrate() {
      if (import.meta.client) {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          try {
            this.slugs = JSON.parse(raw)
          } catch {
            this.slugs = []
          }
        }
      }
    },
  },
})
