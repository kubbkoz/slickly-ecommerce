import { defineStore } from 'pinia'

const STORAGE_KEY = 'slickly-wishlist'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    productIds: [] as string[],
  }),

  getters: {
    count: (state) => state.productIds.length,
  },

  actions: {
    has(productId: string) {
      return this.productIds.includes(productId)
    },

    toggle(productId: string) {
      if (this.has(productId)) {
        this.productIds = this.productIds.filter((id) => id !== productId)
      } else {
        this.productIds = [...this.productIds, productId]
      }
      this.persist()
    },

    remove(productId: string) {
      this.productIds = this.productIds.filter((id) => id !== productId)
      this.persist()
    },

    persist() {
      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.productIds))
      }
    },

    hydrate() {
      if (import.meta.client) {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          try {
            this.productIds = JSON.parse(raw)
          } catch {
            this.productIds = []
          }
        }
      }
    },
  },
})
