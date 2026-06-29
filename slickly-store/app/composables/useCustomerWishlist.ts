export const useCustomerWishlist = () => {
    const store = useWishlistStore();
    const { wishlistItems, isWishlistLoading } = storeToRefs(store);
    return {
        wishlistItems,
        isWishlistLoading,
        loadWishlist: store.loadWishlist,
        isInWishlist: store.isInWishlist,
        toggleWishlist: store.toggleWishlist,
    };
};
