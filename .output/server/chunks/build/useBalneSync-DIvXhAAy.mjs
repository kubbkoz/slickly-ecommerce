import { computed, ref, watch } from 'vue';
import { a as useCart, i as useRuntimeConfig, o as useDebounceFn } from './server.mjs';

const useBalneSync = (shippingMethodId) => {
  const { cartItems, addProduct, removeItem, changeProductQuantity } = useCart();
  const config = useRuntimeConfig();
  const bikeCatId = config.public.shopware.ids.categories?.bikes;
  const ebikeCatId = config.public.shopware.ids.categories?.ebikes;
  const balneBikeId = config.public.shopware.ids.products?.balneBike;
  const balneEbikeId = config.public.shopware.ids.products?.balneEbike;
  const osobnyOdberId = config.public.shopware.ids.shipping?.osobnyOdber;
  const isOsobnyOdber = computed(
    () => shippingMethodId?.value === osobnyOdberId
  );
  const isProcessing = ref(false);
  const isInCategory = (item, catId) => {
    if (item.referencedId === balneBikeId || item.referencedId === balneEbikeId) return false;
    if (item.type !== "product") return false;
    return item.payload?.categoryTree?.includes(catId) || item.payload?.categoryIds?.includes(catId);
  };
  const bikeQuantity = computed(
    () => bikeCatId ? cartItems.value.filter((i) => isInCategory(i, bikeCatId)).reduce((sum, i) => sum + (i.quantity || 0), 0) : 0
  );
  const ebikeQuantity = computed(
    () => ebikeCatId ? cartItems.value.filter((i) => isInCategory(i, ebikeCatId)).reduce((sum, i) => sum + (i.quantity || 0), 0) : 0
  );
  const desiredBalneBike = computed(() => isOsobnyOdber.value ? 0 : bikeQuantity.value);
  const desiredBalneEbike = computed(() => isOsobnyOdber.value ? 0 : ebikeQuantity.value);
  const reconcile = async (balneId, desired) => {
    const existing = cartItems.value.find((i) => i.referencedId === balneId);
    if (desired > 0) {
      if (!existing) {
        await addProduct({ id: balneId, quantity: desired });
      } else if (existing.quantity !== desired) {
        await changeProductQuantity({ id: existing.id, quantity: desired });
      }
    } else if (existing) {
      await removeItem(existing);
    }
  };
  const syncBalne = useDebounceFn(async () => {
    if (isProcessing.value || !balneBikeId || !balneEbikeId) return;
    isProcessing.value = true;
    try {
      await reconcile(balneBikeId, desiredBalneBike.value);
      await reconcile(balneEbikeId, desiredBalneEbike.value);
    } catch (e) {
    } finally {
      isProcessing.value = false;
    }
  }, 500);
  watch(cartItems, syncBalne, { deep: true });
  if (shippingMethodId) {
    watch(shippingMethodId, syncBalne);
  }
  return { isProcessing, hasBikeProduct: computed(() => bikeQuantity.value > 0), hasEbikeProduct: computed(() => ebikeQuantity.value > 0) };
};

export { useBalneSync as u };
