import { computed } from 'vue';
import { R as useContext } from './server.mjs';

function useNavigationContext(context) {
  const _context = useContext("navigation", { context });
  const routeName = computed(() => _context.value?.routeName);
  const foreignKey = computed(() => _context.value?.foreignKey || "");
  return {
    navigationContext: computed(() => _context.value),
    routeName,
    foreignKey
  };
}

export { useNavigationContext as u };
