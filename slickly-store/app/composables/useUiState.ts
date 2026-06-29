export const useUiState = () => {
    const store = useUiStore();
    const { isCartSidebarOpen, isMobileMenuOpen, isMobileSearchOpen } = storeToRefs(store);
    return {
        isCartSidebarOpen,
        isMobileMenuOpen,
        isMobileSearchOpen,
        toggleCartSidebar: store.toggleCartSidebar,
        toggleMobileMenu: store.toggleMobileMenu,
        toggleMobileSearch: store.toggleMobileSearch,
    };
};
