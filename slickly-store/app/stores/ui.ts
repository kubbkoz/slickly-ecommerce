import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', () => {
    const isCartSidebarOpen = ref(false);
    const isMobileMenuOpen = ref(false);
    const isMobileSearchOpen = ref(false);

    function toggleCartSidebar(state?: boolean) {
        isCartSidebarOpen.value = state ?? !isCartSidebarOpen.value;
    }

    function toggleMobileMenu(state?: boolean) {
        isMobileMenuOpen.value = state ?? !isMobileMenuOpen.value;
    }

    function toggleMobileSearch(state?: boolean) {
        isMobileSearchOpen.value = state ?? !isMobileSearchOpen.value;
    }

    return {
        isCartSidebarOpen,
        isMobileMenuOpen,
        isMobileSearchOpen,
        toggleCartSidebar,
        toggleMobileMenu,
        toggleMobileSearch,
    };
});
