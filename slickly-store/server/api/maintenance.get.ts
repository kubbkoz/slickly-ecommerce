import { getQuery, getHeader, createError } from 'h3';

// Clean maintenance toggle, password-protected (no webhook secret involved).
// Browser-friendly — pass the password as ?pass=… so it works from a plain URL.
//
// IMPORTANT: the password contains '#', which a browser treats as a URL fragment,
// so it must be percent-encoded in the URL ('#' -> %23):
//
//   Enable :  /api/maintenance?pass=Fmhpx8g8@%23&on=1
//   Disable:  /api/maintenance?pass=Fmhpx8g8@%23&on=0
//   Status :  /api/maintenance?pass=Fmhpx8g8@%23
//
// (getQuery decodes %23 back to '#'.) The x-maintenance-pass header is also
// accepted. Returns 404 on a wrong password so the endpoint isn't advertised.
export default defineEventHandler(async (event) => {
  const q = getQuery(event);
  const provided = (typeof q.pass === 'string' ? q.pass : '') || getHeader(event, 'x-maintenance-pass') || '';
  if (provided !== MAINTENANCE_PASSWORD) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' });
  }

  const on = q.on;
  if (on === '1' || on === 'true' || on === 'on') {
    await setMaintenanceEnabled(true);
    return { ok: true, maintenance: true, message: 'Maintenance ON — the site is now covered.' };
  }
  if (on === '0' || on === 'false' || on === 'off') {
    await setMaintenanceEnabled(false);
    return { ok: true, maintenance: false, message: 'Maintenance OFF — the site is live again.' };
  }

  return { ok: true, maintenance: await readMaintenanceRaw() };
});
