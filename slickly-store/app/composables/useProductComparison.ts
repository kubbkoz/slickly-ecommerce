export interface ComparisonProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice: number | null;
  productNumber: string;
  categoryName: string;
  manufacturer: string;
  properties: Array<{ group: string; value: string }>;
}

const MAX_ITEMS = 4;
const STORAGE_KEY = 'mtsport_comparison';

const items = ref<ComparisonProduct[]>([]);
let initialized = false;

function load() {
  if (initialized || !import.meta.client) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) items.value = JSON.parse(raw);
  } catch { items.value = []; }
  initialized = true;
}

function persist() {
  if (!import.meta.client) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value));
}

export function useProductComparison() {
  load();

  const comparisonCount = computed(() => items.value.length);

  function addToComparison(product: ComparisonProduct): boolean {
    if (items.value.length >= MAX_ITEMS) return false;
    if (items.value.some(i => i.id === product.id)) return false;
    items.value.push(product);
    persist();
    return true;
  }

  function removeFromComparison(id: string) {
    items.value = items.value.filter(i => i.id !== id);
    persist();
  }

  function clearComparison() {
    items.value = [];
    persist();
  }

  function isInComparison(id: string): boolean {
    return items.value.some(i => i.id === id);
  }

  return {
    comparisonItems: items,
    comparisonCount,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    MAX_ITEMS,
  };
}
