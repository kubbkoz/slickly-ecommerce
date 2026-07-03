/**
 * Slovak pluralization for the word 'hodnotenie' (review)
 * 1 -> hodnotenie
 * 2-4 -> hodnotenia
 * 5+ -> hodnotení (Nominative)
 * Locative case (na ...):
 * 1 -> hodnotení
 * 2+ -> hodnoteniach
 */
export const formatReviewLabel = (count: number, isLocative = false): string => {
  const absCount = Math.abs(count);
  if (isLocative) {
    return absCount === 1 ? 'hodnotení' : 'hodnoteniach';
  }
  if (absCount === 1) return 'hodnotenie';
  if (absCount >= 2 && absCount <= 4) return 'hodnotenia';
  return 'hodnotení';
};

/**
 * Rounds rating to 1 decimal place and ensures it returns a string
 */
export const formatRating = (rating: number | string | null | undefined): string => {
  const val = Number(rating);
  if (rating === null || rating === undefined || isNaN(val)) return '0,0';
  return val.toLocaleString('sk-SK', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
};

/**
 * Extrahuje ČISTÝ plain-text úryvok z HTML (Shopware richtext description).
 * Pure / SSR-safe (regex, žiadny DOM) — beží na serveri aj klientovi.
 * - vyhodí <script>/<style> obsah
 * - block-close tagy (</p>, <br>, …) → medzera (nezlepí susedné odseky)
 * - odstráni zvyšné tagy
 * - dekóduje bežné named + číselné entity (&amp; &lt; &gt; &quot; &#39; &nbsp; &#NNN; &#xHH;)
 * - NBSP → medzera, collapse whitespace/newlinov, trim
 * - voliteľné orezanie na maxChars + „…"
 */
export const plainTextExcerpt = (html: string | null | undefined, maxChars = 200): string => {
  if (!html) return '';
  let t = String(html)
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '');

  const named: Record<string, string> = {
    nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#39': "'",
  };
  t = t.replace(/&(#x?[0-9a-f]+|[a-z0-9]+);/gi, (m, e) => {
    const k = String(e).toLowerCase();
    if (named[k] !== undefined) return named[k];
    if (k[0] === '#') {
      const code = k[1] === 'x' ? parseInt(k.slice(2), 16) : parseInt(k.slice(1), 10);
      return isNaN(code) ? m : String.fromCodePoint(code);
    }
    return m;
  });

  t = t.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
  return maxChars > 0 && t.length > maxChars ? t.slice(0, maxChars).trimEnd() + '…' : t;
};
