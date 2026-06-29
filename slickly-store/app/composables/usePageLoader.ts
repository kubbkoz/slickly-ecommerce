export const usePageLoader = () => {
    const store = usePageLoaderStore();
    const { isLoading, suppressOverlay } = storeToRefs(store);
    return {
        isLoading,
        suppressOverlay,
        showLoader: store.showLoader,
        hideLoader: store.hideLoader,
        suppressNextOverlay: store.suppressNextOverlay,
    };
};
