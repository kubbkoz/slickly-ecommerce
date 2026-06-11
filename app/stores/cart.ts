import { defineStore } from 'pinia'
import type { Product } from '~/data/products'

export interface CartLineItem {
  productId: string
  slug: string
  name: string
  price: number
  image: string
  sku: string
  quantity: number
}

const STORAGE_KEY = 'slickly-cart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartLineItem[],
    isDrawerOpen: false,
  }),

  getters: {
    itemCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    subtotal: (state) =>
      state.items.reduce((total, item) => total + item.price * item.quantity, 0),
  },

  actions: {
    addItem(product: Product, quantity = 1) {
      const existing = this.items.find((item) => item.productId === product.id)
      if (existing) {
        existing.quantity += quantity
      } else {
        this.items.push({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          sku: product.sku,
          quantity,
        })
      }
      this.persist()
    },

    updateQuantity(productId: string, quantity: number) {
      const item = this.items.find((item) => item.productId === productId)
      if (!item) return
      if (quantity <= 0) {
        this.removeItem(productId)
        return
      }
      item.quantity = quantity
      this.persist()
    },

    removeItem(productId: string) {
      this.items = this.items.filter((item) => item.productId !== productId)
      this.persist()
    },

    clear() {
      this.items = []
      this.persist()
    },

    persist() {
      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
      }
    },

    hydrate() {
      if (import.meta.client) {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          try {
            this.items = JSON.parse(raw)
          } catch {
            this.items = []
          }
        }
      }
    },
  },
})
