const formatReviewLabel = (count, isLocative = false) => {
  const absCount = Math.abs(count);
  if (isLocative) {
    return absCount === 1 ? "hodnotení" : "hodnoteniach";
  }
  if (absCount === 1) return "hodnotenie";
  if (absCount >= 2 && absCount <= 4) return "hodnotenia";
  return "hodnotení";
};
const formatRating = (rating) => {
  const val = Number(rating);
  if (rating === null || rating === void 0 || isNaN(val)) return "0,0";
  return val.toLocaleString("sk-SK", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
};
const plainTextExcerpt = (html, maxChars = 200) => {
  if (!html) return "";
  let t = String(html).replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "").replace(/<\/(p|div|li|h[1-6]|tr)>/gi, " ").replace(/<br\s*\/?>/gi, " ").replace(/<[^>]*>/g, "");
  const named = {
    nbsp: " ",
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    "#39": "'"
  };
  t = t.replace(/&(#x?[0-9a-f]+|[a-z0-9]+);/gi, (m, e) => {
    const k = String(e).toLowerCase();
    if (named[k] !== void 0) return named[k];
    if (k[0] === "#") {
      const code = k[1] === "x" ? parseInt(k.slice(2), 16) : parseInt(k.slice(1), 10);
      return isNaN(code) ? m : String.fromCodePoint(code);
    }
    return m;
  });
  t = t.replace(/\u00A0/g, " ").replace(/\s+/g, " ").trim();
  return maxChars > 0 && t.length > maxChars ? t.slice(0, maxChars).trimEnd() + "…" : t;
};

export { formatReviewLabel as a, formatRating as f, plainTextExcerpt as p };
