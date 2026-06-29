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
