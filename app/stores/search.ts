import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
  state: () => ({
    isOpen: false,
    query: '',
  }),

  actions: {
    open() {
      this.isOpen = true
    },

    close() {
      this.isOpen = false
      this.query = ''
    },

    toggle() {
      this.isOpen = !this.isOpen
    },
  },
})
