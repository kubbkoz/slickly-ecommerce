const sanitizeHtml = (html) => {
  if (!html) return "";
  {
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, "").replace(/javascript\s*:/gi, "blocked:").replace(/data\s*:/gi, "data-blocked:");
  }
};

export { sanitizeHtml as s };
