// Lightweight scroll-entrance reveal: exposes a `target` ref to attach to an
// element and an `isVisible` flag that flips true once it enters the
// viewport. Consumers toggle `reveal`/`reveal-visible` (uno.config.ts) —
// transform + opacity only, so this stays GPU-safe on scroll.
export function useScrollReveal(options: { rootMargin?: string; threshold?: number } = {}) {
    const target = ref<HTMLElement | null>(null);
    const isVisible = ref(false);

    onMounted(() => {
        if (typeof window === 'undefined') return;

        // Respect reduced-motion and no-IO environments by just showing content.
        if (
            window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
            typeof IntersectionObserver === 'undefined' ||
            !target.value
        ) {
            isVisible.value = true;
            return;
        }

        const io = new IntersectionObserver((entries) => {
            if (entries.some((e) => e.isIntersecting)) {
                isVisible.value = true;
                io.disconnect();
            }
        }, { rootMargin: options.rootMargin ?? '0px 0px -10% 0px', threshold: options.threshold ?? 0.1 });

        io.observe(target.value);
        onUnmounted(() => io.disconnect());
    });

    return { target, isVisible };
}
