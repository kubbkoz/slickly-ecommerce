import { computed } from 'vue';
import { f as useUser, U as useLocalWishlist, V as useSyncWishlist } from './server.mjs';

function useProductWishlist(productId) {
  const { isLoggedIn } = useUser();
  const {
    addToWishlist: addItem,
    removeFromWishlist: removeItem,
    items
  } = useLocalWishlist();
  const {
    addToWishlistSync: addItemSync,
    removeFromWishlistSync: removeItemSync,
    items: itemsSync,
    getWishlistProducts
  } = useSyncWishlist();
  async function removeFromWishlist() {
    if (isLoggedIn.value) {
      await removeItemSync(productId);
      await getWishlistProducts();
    } else {
      await removeItem(productId);
    }
  }
  async function addToWishlist() {
    if (isLoggedIn.value) {
      await addItemSync(productId);
      await getWishlistProducts();
    } else {
      await addItem(productId);
    }
  }
  const isInWishlist = computed(
    () => isLoggedIn.value ? itemsSync.value?.includes(productId) : items.value?.includes(productId)
  );
  return {
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  };
}

export { useProductWishlist as u };
