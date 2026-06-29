import { defineStore } from 'pinia';

export const usePageLoaderStore = defineStore('pageLoader', () => {
    const isLoading = ref(import.meta.server);
    const suppressOverlay = ref(false);

    function showLoader() {
        isLoading.value = true;
    }

    function hideLoader() {
        isLoading.value = false;
        suppressOverlay.value = false;
    }

    // Call before NuxtLink subcategory navigation.
    // Immediately hides any visible overlay AND prevents it from showing again
    // until page:finish resets the flag.
    function suppressNextOverlay() {
        suppressOverlay.value = true;
        isLoading.value = false;
    }

    return { isLoading, suppressOverlay, showLoader, hideLoader, suppressNextOverlay };
});
