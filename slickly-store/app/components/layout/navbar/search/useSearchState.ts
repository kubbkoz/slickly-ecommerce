import { ref, nextTick } from 'vue';

/**
 * Core search UI state — query, open/close, DOM refs, dropdown positioning.
 * One instance per SearchBar component.
 */
export const useSearchState = () => {
    const searchQuery      = ref('');
    const isOpen           = ref(false);
    const searchInputRef   = ref<HTMLInputElement | null>(null);
    const searchWrapperRef = ref<HTMLElement | null>(null);
    const dropdownTop      = ref(0);
    // Container-aligned dropdown geometry (matches site's .container width/offset)
    const dropdownLeft     = ref(0);
    const dropdownWidth    = ref(0);

    // ── Dropdown top-position tracking ───────────────────────────────────────
    const updateDropdownPosition = () => {
        if (!searchWrapperRef.value) return;
        // Align to BOTTOM of the main navbar row (logo + search + icons)
        const mainRow = document.getElementById('navbar-main-row');
        dropdownTop.value = mainRow
            ? mainRow.getBoundingClientRect().bottom
            : searchWrapperRef.value.getBoundingClientRect().bottom + 10;
        // Compute container boundaries so the dropdown aligns with the site’s content column
        const navContainer = document.querySelector<HTMLElement>('nav .container');
        if (navContainer) {
            const rect = navContainer.getBoundingClientRect();
            dropdownLeft.value  = rect.left;
            dropdownWidth.value = rect.width;
        }
    };

    // ── Click-outside — uses data attr so it works across Teleport boundary ──────
    const handleOutsideClick = (e: PointerEvent) => {
        const target = e.target as HTMLElement;
        if (
            searchWrapperRef.value?.contains(target) ||
            target.closest('[data-search-dropdown]')
        ) return;
        isOpen.value = false;
    };

    const mount = () => {
        updateDropdownPosition();
        window.addEventListener('scroll', updateDropdownPosition, { passive: true });
        window.addEventListener('resize', updateDropdownPosition, { passive: true });
        document.addEventListener('pointerdown', handleOutsideClick);
    };

    const unmount = () => {
        window.removeEventListener('scroll', updateDropdownPosition);
        window.removeEventListener('resize', updateDropdownPosition);
        document.removeEventListener('pointerdown', handleOutsideClick);
    };

    const open = () => {
        isOpen.value = true;
        nextTick(updateDropdownPosition);
    };

    const close = () => {
        isOpen.value = false;
    };

    const clearQuery = () => {
        searchQuery.value = '';
        searchInputRef.value?.focus();
    };

    const onKeydown = (e: KeyboardEvent, onEnter: () => void) => {
        if (e.key === 'Escape') { isOpen.value = false; searchInputRef.value?.blur(); }
        if (e.key === 'Enter')  { onEnter(); }
    };

    return {
        searchQuery,
        isOpen,
        searchInputRef,
        searchWrapperRef,
        dropdownTop,
        dropdownLeft,
        dropdownWidth,
        updateDropdownPosition,
        mount,
        unmount,
        open,
        close,
        clearQuery,
        onKeydown,
    };
};
