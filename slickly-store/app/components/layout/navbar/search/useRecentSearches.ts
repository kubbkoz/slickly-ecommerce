import { ref } from 'vue';

const RECENT_KEY = 'mts_recent_searches';
const MAX_RECENT = 6;

/**
 * Persists and manages the last N search terms in localStorage.
 * Safe on SSR (no localStorage access during server render).
 */
export const useRecentSearches = () => {
    const recentSearches = ref<string[]>([]);

    const load = () => {
        if (!import.meta.client) return;
        try {
            recentSearches.value = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
        } catch {
            recentSearches.value = [];
        }
    };

    const save = (term: string) => {
        if (!import.meta.client || !term.trim()) return;
        const existing = recentSearches.value.filter(
            s => s.toLowerCase() !== term.toLowerCase()
        );
        const next = [term.trim(), ...existing].slice(0, MAX_RECENT);
        recentSearches.value = next;
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    };

    const remove = (term: string, e?: Event) => {
        e?.stopPropagation();
        recentSearches.value = recentSearches.value.filter(s => s !== term);
        localStorage.setItem(RECENT_KEY, JSON.stringify(recentSearches.value));
    };

    const clear = () => {
        recentSearches.value = [];
        localStorage.removeItem(RECENT_KEY);
    };

    return { recentSearches, load, save, remove, clear };
};
