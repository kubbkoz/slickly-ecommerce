function proxyMediaUrl(url) {
  if (!url) return url;
  return url;
}
function getSafeMediaUrl(media) {
  if (!media) return "";
  if (media.url) return proxyMediaUrl(media.url);
  if (!media.thumbnails || media.thumbnails.length === 0) return "";
  const sorted = [...media.thumbnails].sort((a, b) => b.width - a.width);
  const safeExtensions = [".jpg", ".jpeg", ".png"];
  const safeThumb = sorted.find((t) => {
    const url = t.url.toLowerCase();
    return safeExtensions.some((ext) => url.endsWith(ext)) && !url.endsWith(".webp");
  });
  if (safeThumb) return proxyMediaUrl(safeThumb.url);
  return proxyMediaUrl(sorted[0]?.url || "");
}

export { getSafeMediaUrl as g, proxyMediaUrl as p };
