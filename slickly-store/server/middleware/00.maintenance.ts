import { getCookie, setResponseStatus, setResponseHeader } from 'h3';

// Runs first (00. prefix) on every request. While the hard override MAINTENANCE_ON
// is set, it covers the whole site with a 503 maintenance page — EXCEPT the admin
// login endpoint (so the form can authenticate) and browsers that have logged in
// (valid session cookie). No url-parameter toggle or bypass.
export default defineEventHandler((event) => {
  if (!MAINTENANCE_ON) return;

  const path = event.path || '';

  // Login endpoint must stay reachable so the maintenance page's form can post to it.
  if (path.startsWith('/api/maintenance-login')) return;

  // Logged-in admin passes through to the real site.
  if (getCookie(event, MAINTENANCE_COOKIE) === MAINTENANCE_SESSION_TOKEN) return;

  // Cover the site. 503 + Retry-After keeps search engines from deindexing.
  setResponseStatus(event, 503);
  setResponseHeader(event, 'content-type', 'text/html; charset=utf-8');
  setResponseHeader(event, 'cache-control', 'no-store, no-cache, must-revalidate');
  setResponseHeader(event, 'retry-after', '3600');
  return maintenancePageHtml();
});
