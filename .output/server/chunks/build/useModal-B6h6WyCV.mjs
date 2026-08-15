import { ref, watch, computed } from 'vue';
import { d as useRoute, k as createSharedComposable } from './server.mjs';

function useModal() {
  const isOpen = ref(false);
  const open = () => {
    isOpen.value = true;
  };
  const close = () => {
    isOpen.value = false;
  };
  const route = useRoute();
  watch(
    () => route.path,
    () => {
      close();
    }
  );
  return {
    isOpen: computed(() => isOpen.value),
    open,
    close
  };
}
const useSideMenuModal = createSharedComposable(useModal);

export { useSideMenuModal as a, useModal as u };
