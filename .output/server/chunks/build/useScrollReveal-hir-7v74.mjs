import { ref } from 'vue';

function useScrollReveal(options = {}) {
  const target = ref(null);
  const isVisible = ref(false);
  return { target, isVisible };
}

export { useScrollReveal as u };
