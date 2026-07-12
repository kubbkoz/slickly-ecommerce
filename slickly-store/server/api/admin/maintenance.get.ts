import { getQuery, getHeader, createError } from 'h3';

// Toggle maintenance mode at runtime (no rebuild). Secret-protected so only the
// owner can flip it. Browser-friendly: pass the secret as ?key=… so it works
// from a plain URL; the x-admin-secret header is also accepted.
//
//   Enable :  /api/admin/maintenance?key=<WEBHOOK_SECRET>&on=1
//   Disable:  /api/admin/maintenance?key=<WEBHOOK_SECRET>&on=0
//   Status :  /api/admin/maintenance?key=<WEBHOOK_SECRET>
//
// Returns 404 (not 401) on a bad/absent key so the endpoint isn't advertised,
// and fails closed when WEBHOOK_SECRET is unset.
export default defineEventHandler(async (event) => {
  const secret = useRuntimeConfig().maintenanceSecret as string;
  const q = getQuery(event);
  const provided = (typeof q.key === 'string' ? q.key : '') || getHeader(event, 'x-admin-secret') || '';
  if (!secret || provided !== secret) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' });
  }

  const on = q.on;
  if (on === '1' || on === 'true') {
    await setMaintenanceEnabled(true);
    return { ok: true, maintenance: true, message: 'Maintenance mode ENABLED — the site is now covered.' };
  }
  if (on === '0' || on === 'false') {
    await setMaintenanceEnabled(false);
    return { ok: true, maintenance: false, message: 'Maintenance mode DISABLED — the site is live again.' };
  }

  return { ok: true, maintenance: await readMaintenanceRaw() };
});
