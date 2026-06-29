<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ChevronUp } from 'lucide-vue-next';

const isVisible = ref(false);

const handleScroll = () => {
  // Zobrazí sa, keď používateľ odscrolluje viac ako 400px
  isVisible.value = window.scrollY > 400;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  // Initial check
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <button
    @click="scrollToTop"
    aria-label="Späť navrch"
    class="hidden lg:flex fixed bottom-8 right-4 md:right-8 z-50 items-center justify-center w-12 h-12 bg-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:bg-brand hover:-translate-y-1 focus:outline-none opacity-100"
    :class="isVisible ? 'translate-y-0' : 'translate-y-24 pointer-events-none'"
  >
    <ChevronUp class="w-6 h-6 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
  </button>
</template>
