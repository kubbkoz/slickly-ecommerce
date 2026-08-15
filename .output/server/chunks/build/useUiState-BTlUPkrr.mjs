import { storeToRefs, defineStore } from 'pinia';
import { ref } from 'vue';

const useUiStore = defineStore("ui", () => {
  const isCartSidebarOpen = ref(false);
  const isMobileMenuOpen = ref(false);
  const isMobileSearchOpen = ref(false);
  function toggleCartSidebar(state) {
    isCartSidebarOpen.value = state ?? !isCartSidebarOpen.value;
  }
  function toggleMobileMenu(state) {
    isMobileMenuOpen.value = state ?? !isMobileMenuOpen.value;
  }
  function toggleMobileSearch(state) {
    isMobileSearchOpen.value = state ?? !isMobileSearchOpen.value;
  }
  return {
    isCartSidebarOpen,
    isMobileMenuOpen,
    isMobileSearchOpen,
    toggleCartSidebar,
    toggleMobileMenu,
    toggleMobileSearch
  };
});
const useUiState = () => {
  const store = useUiStore();
  const { isCartSidebarOpen, isMobileMenuOpen, isMobileSearchOpen } = storeToRefs(store);
  return {
    isCartSidebarOpen,
    isMobileMenuOpen,
    isMobileSearchOpen,
    toggleCartSidebar: store.toggleCartSidebar,
    toggleMobileMenu: store.toggleMobileMenu,
    toggleMobileSearch: store.toggleMobileSearch
  };
};

export { useUiState as u };
