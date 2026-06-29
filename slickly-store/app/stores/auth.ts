import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
    const isLoading = ref(false);

    return { isLoading };
});
