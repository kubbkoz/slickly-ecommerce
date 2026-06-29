import { useDebounceFn } from '@vueuse/core';

export function useOrderLookup() {
  const form = ref({ orderNumber: '', email: '', firstName: '', lastName: '' });
  const noNumber = ref(false);
  const result = ref<any>(null);
  const error = ref<string | null>(null);
  const loading = ref(false);

  const reset = () => {
    form.value = { orderNumber: '', email: '', firstName: '', lastName: '' };
    noNumber.value = false;
    result.value = null;
    error.value = null;
  };

  const performLookup = async () => {
    const { orderNumber, email, firstName, lastName } = form.value;

    if (!noNumber.value && !orderNumber.trim()) {
      error.value = 'Zadajte číslo objednávky.';
      return;
    }
    if (noNumber.value && (!email.trim() || !lastName.trim())) {
      error.value = 'Email a priezvisko sú povinné.';
      return;
    }

    loading.value = true;
    error.value = null;
    result.value = null;

    try {
      const res = await $fetch<any>('/api/orders/status', {
        method: 'POST',
        body: {
          orderNumber: !noNumber.value ? orderNumber.trim() : undefined,
          email: email.trim() || undefined,
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined
        }
      });
      result.value = res;
      if (!res.found) error.value = res.message;
    } catch {
      error.value = 'Chyba pri vyhľadávaní. Skúste neskôr.';
    } finally {
      loading.value = false;
    }
  };

  const handleLookup = useDebounceFn(performLookup, 300);

  return { form, noNumber, result, error, loading, reset, handleLookup };
}
