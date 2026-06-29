/**
 * FIX-1.8: Upgraded XSS sanitization.
 *
 * Server (SSR): multi-pattern regex — no DOM available in Node.
 * Client: DOMParser — zero regex edge-cases, handles malformed HTML correctly.
 *
 * Old implementation missed: single-quote on* attrs, href=javascript:, data: URIs.
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';

  if (import.meta.server) {
    // Server: conservative regex strip (no DOMParser in Node.js)
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '')   // on* attrs (both quote styles)
      .replace(/javascript\s*:/gi, 'blocked:')           // href=javascript:void(0)
      .replace(/data\s*:/gi, 'data-blocked:');            // data: URIs in src/href
  }

  // Client: DOMParser is the gold standard — handles edge-cases regex can't
  const doc = new DOMParser().parseFromString(html, 'text/html');

  // Remove dangerous element types outright
  doc.querySelectorAll('script, iframe, object, embed, link[rel="import"]').forEach(el => el.remove());

  // Strip dangerous attributes from all remaining elements
  doc.querySelectorAll('*').forEach(el => {
    [...el.attributes].forEach(attr => {
      if (
        /^on/i.test(attr.name) ||                        // onclick, onload, etc.
        /javascript\s*:/i.test(attr.value) ||             // href="javascript:..."
        /data\s*:/i.test(attr.value)                      // src="data:..."
      ) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML;
};
