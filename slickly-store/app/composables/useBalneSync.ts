import { useCart } from '@shopware/composables';
import { useDebounceFn } from '@vueuse/core';

export const useBalneSync = (shippingMethodId?: Ref<string | undefined>) => {
    const { cartItems, addProduct, removeItem, changeProductQuantity } = useCart();
    const config = useRuntimeConfig();

    const bikeCatId    = config.public.shopware.ids.categories?.bikes   as string | undefined;
    const ebikeCatId   = config.public.shopware.ids.categories?.ebikes  as string | undefined;
    const balneBikeId  = config.public.shopware.ids.products?.balneBike  as string | undefined;
    const balneEbikeId = config.public.shopware.ids.products?.balneEbike as string | undefined;
    const osobnyOdberId = config.public.shopware.ids.shipping?.osobnyOdber as string | undefined;

    const isOsobnyOdber = computed(() =>
        shippingMethodId?.value === osobnyOdberId
    );

    const isProcessing = ref(false);

    const isInCategory = (item: any, catId: string) => {
        if (item.referencedId === balneBikeId || item.referencedId === balneEbikeId) return false;
        if (item.type !== 'product') return false;
        return item.payload?.categoryTree?.includes(catId) ||
               item.payload?.categoryIds?.includes(catId);
    };

    // Súčet kusov naprieč všetkými produktmi danej kategórie (2× bicykel → balné ×2)
    const bikeQuantity = computed(() =>
        bikeCatId
            ? cartItems.value
                .filter((i: any) => isInCategory(i, bikeCatId))
                .reduce((sum: number, i: any) => sum + (i.quantity || 0), 0)
            : 0
    );
    const ebikeQuantity = computed(() =>
        ebikeCatId
            ? cartItems.value
                .filter((i: any) => isInCategory(i, ebikeCatId))
                .reduce((sum: number, i: any) => sum + (i.quantity || 0), 0)
            : 0
    );

    // Pri osobnom odbere balné odpadá
    const desiredBalneBike = computed(() => isOsobnyOdber.value ? 0 : bikeQuantity.value);
    const desiredBalneEbike = computed(() => isOsobnyOdber.value ? 0 : ebikeQuantity.value);

    const reconcile = async (balneId: string, desired: number) => {
        const existing = cartItems.value.find((i: any) => i.referencedId === balneId);
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
            console.error('[useBalneSync] error:', e);
        } finally {
            isProcessing.value = false;
        }
    }, 500);

    watch(cartItems, syncBalne, { deep: true });
    if (shippingMethodId) {
        watch(shippingMethodId, syncBalne);
    }
    if (import.meta.client) {
        onMounted(() => syncBalne());
    }

    return { isProcessing, hasBikeProduct: computed(() => bikeQuantity.value > 0), hasEbikeProduct: computed(() => ebikeQuantity.value > 0) };
};
