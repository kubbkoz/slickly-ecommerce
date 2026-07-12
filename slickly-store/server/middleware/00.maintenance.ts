import { getQuery, getCookie, setCookie, setResponseStatus, setResponseHeader } from 'h3';

// Runs first (00. prefix) on every request. When the maintenance KV flag is set,
// it covers the whole site with a 503 maintenance page — EXCEPT the toggle
// endpoint (so it can always be turned back off) and holders of the admin bypass
// cookie (so an admin can preview the live site while it's down for everyone else).
export default defineEventHandler(async (event) => {
  const path = event.path || '';

  // Toggle endpoint must stay reachable to disable maintenance.
  if (path.startsWith('/api/maintenance')) return;

  if (!(await isMaintenanceEnabled())) return;

  // Admin bypass: hit any URL once with ?bypass=<password> to drop a cookie, then
  // browse the real site normally while maintenance stays up for everyone else.
  const q = getQuery(event);
  if (typeof q.bypass === 'string' && q.bypass === MAINTENANCE_PASSWORD) {
    setCookie(event, 'slickly_maint_bypass', MAINTENANCE_PASSWORD, {
      path: '/', httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 8,
    });
    return;
  }
  if (getCookie(event, 'slickly_maint_bypass') === MAINTENANCE_PASSWORD) return;

  // Cover the site. 503 + Retry-After keeps search engines from deindexing.
  setResponseStatus(event, 503);
  setResponseHeader(event, 'content-type', 'text/html; charset=utf-8');
  setResponseHeader(event, 'cache-control', 'no-store, no-cache, must-revalidate');
  setResponseHeader(event, 'retry-after', '3600');
  return maintenancePageHtml();
});
