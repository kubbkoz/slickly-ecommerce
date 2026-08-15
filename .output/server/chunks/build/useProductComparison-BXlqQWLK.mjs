import { computed, ref } from 'vue';

const MAX_ITEMS = 4;
const items = ref([]);
function useProductComparison() {
  const comparisonCount = computed(() => items.value.length);
  function addToComparison(product) {
    if (items.value.length >= MAX_ITEMS) return false;
    if (items.value.some((i) => i.id === product.id)) return false;
    items.value.push(product);
    return true;
  }
  function removeFromComparison(id) {
    items.value = items.value.filter((i) => i.id !== id);
  }
  function clearComparison() {
    items.value = [];
  }
  function isInComparison(id) {
    return items.value.some((i) => i.id === id);
  }
  return {
    comparisonItems: items,
    comparisonCount,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    MAX_ITEMS
  };
}

export { useProductComparison as u };
