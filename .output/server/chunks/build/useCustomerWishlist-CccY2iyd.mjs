import { storeToRefs, defineStore } from 'pinia';
import { f as useUser, i as useRuntimeConfig, p as useCookie } from './server.mjs';
import { ref } from 'vue';

const useWishlistStore = defineStore("wishlist", () => {
  const config = useRuntimeConfig();
  const shopwareEndpoint = config.public?.shopware?.endpoint ?? `${config.public.siteUrl || "https://mtsport.store"}/store-api/`;
  const accessToken = config.public?.shopware?.accessToken ?? "";
  const { isLoggedIn } = useUser();
  const wishlistItems = ref([]);
  const isWishlistLoading = ref(false);
  const getHeaders = () => {
    const tokenCookie = useCookie("sw-context-token");
    return {
      "sw-access-key": accessToken,
      "Content-Type": "application/json",
      ...tokenCookie.value ? { "sw-context-token": tokenCookie.value } : {}
    };
  };
  async function loadWishlist() {
    if (!isLoggedIn.value) return;
    isWishlistLoading.value = true;
    try {
      const base = shopwareEndpoint.replace(/\/$/, "");
      const res = await $fetch(`${base}/customer/wishlist`, {
        method: "POST",
        headers: getHeaders(),
        body: {
          limit: 100,
          associations: { cover: {}, seoUrls: {} }
        }
      });
      wishlistItems.value = res?.elements || res?.products?.elements || [];
    } catch (e) {
      if (e?.response?.status === 404 || e?.statusCode === 404) {
        wishlistItems.value = [];
      }
    } finally {
      isWishlistLoading.value = false;
    }
  }
  function isInWishlist(productId) {
    return wishlistItems.value.some((p) => p.id === productId);
  }
  async function toggleWishlist(productId, productDataForOptimisticUI) {
    if (!isLoggedIn.value) return false;
    const base = shopwareEndpoint.replace(/\/$/, "");
    isWishlistLoading.value = true;
    if (isInWishlist(productId)) {
      try {
        await $fetch(`${base}/customer/wishlist/delete/${productId}`, {
          method: "DELETE",
          headers: getHeaders()
        });
        wishlistItems.value = wishlistItems.value.filter((p) => p.id !== productId);
      } catch (e) {
      }
    } else {
      try {
        await $fetch(`${base}/customer/wishlist/add/${productId}`, {
          method: "POST",
          headers: getHeaders(),
          body: {}
        });
        if (!isInWishlist(productId)) {
          wishlistItems.value.push({ id: productId, ...productDataForOptimisticUI });
        }
      } catch (e) {
      }
    }
    isWishlistLoading.value = false;
    return true;
  }
  return { wishlistItems, isWishlistLoading, loadWishlist, isInWishlist, toggleWishlist };
});
const useCustomerWishlist = () => {
  const store = useWishlistStore();
  const { wishlistItems, isWishlistLoading } = storeToRefs(store);
  return {
    wishlistItems,
    isWishlistLoading,
    loadWishlist: store.loadWishlist,
    isInWishlist: store.isInWishlist,
    toggleWishlist: store.toggleWishlist
  };
};

export { useCustomerWishlist as u };
