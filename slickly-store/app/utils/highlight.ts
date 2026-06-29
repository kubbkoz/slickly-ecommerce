/**
 * Accent-insensitive, case-insensitive text highlight utility for search results.
 *
 * Strategy:
 *   1. Strip diacritics from BOTH input text and query → for matching only.
 *   2. Record match positions from the normalized string.
 *   3. Return original character slices (with Slovak diacritics intact) wrapped in <mark>.
 *
 * XSS safety: all non-mark text is HTML-escaped. The only HTML injected is <mark>...</mark>.
 *
 * @example
 *   highlightText('Hľadám elektrobicykel', 'elektro')
 *   → 'Hľadám <mark class="...">elektro</mark>bicykel'
 *
 *   highlightText('Trek Marlin 5', 'trek')
 *   → '<mark class="...">Trek</mark> Marlin 5'
 */

/** Remove all combining diacritical marks (NFD decompose → strip). */
function stripAccents(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/** Escape regex metacharacters in a literal search string. */
function escapeForRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Minimal HTML-escape for text nodes (outside <mark> tags).
 * Prevents XSS when result is bound with v-html.
 */
export function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/** CSS classes applied to the <mark> element in search results. */
const MARK_CLASS = 'bg-yellow-100 text-yellow-900 font-semibold not-italic rounded-[2px] px-[1px]';

/**
 * Returns an HTML string with all accent-insensitive, case-insensitive matches
 * of `query` inside `text` wrapped in <mark> tags.
 *
 * If `query` is empty or no match is found, returns the HTML-escaped original text.
 */
export function highlightText(text: string, query: string): string {
    if (!text) return '';
    if (!query?.trim()) return escapeHtml(text);

    const normalizedText  = stripAccents(text);
    const normalizedQuery = stripAccents(query.trim());
    const escaped = escapeForRegex(normalizedQuery);

    const regex = new RegExp(escaped, 'gi');

    let result    = '';
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(normalizedText)) !== null) {
        // Text before the match
        result += escapeHtml(text.slice(lastIndex, match.index));
        // The matched substring — taken from ORIGINAL (diacritics-preserved) text
        result += `<mark class="${MARK_CLASS}">${escapeHtml(text.slice(match.index, match.index + match[0].length))}</mark>`;
        lastIndex = match.index + match[0].length;

        // Guard against zero-length matches causing infinite loops
        if (match[0].length === 0) {
            regex.lastIndex++;
        }
    }

    result += escapeHtml(text.slice(lastIndex));
    return result;
}

/**
 * Truncates a plain-text description and highlights query matches.
 * Strips HTML tags before highlighting (descriptions may contain markup).
 */
export function highlightDescription(html: string, query: string, maxLength = 160): string {
    if (!html) return '';
    // Strip HTML tags → plain text
    const plain = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const truncated = plain.length > maxLength ? plain.slice(0, maxLength) + '…' : plain;
    return highlightText(truncated, query);
}
