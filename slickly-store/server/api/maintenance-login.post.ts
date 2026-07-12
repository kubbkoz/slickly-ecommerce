import { readBody, setCookie, createError } from 'h3';

// Admin login for maintenance mode. Called by the form on the maintenance page.
// On correct credentials it sets an httpOnly session cookie; the middleware then
// lets that browser through to the real site while maintenance stays up for
// everyone else. No url-parameter bypass — credentials are posted in the body.
export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => null);
  const email = String(body?.email ?? '').trim().toLowerCase();
  const password = String(body?.password ?? '');

  if (email === MAINTENANCE_LOGIN_EMAIL && password === MAINTENANCE_LOGIN_PASSWORD) {
    setCookie(event, MAINTENANCE_COOKIE, MAINTENANCE_SESSION_TOKEN, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return { ok: true };
  }

  throw createError({ statusCode: 401, statusMessage: 'Neplatné prihlasovacie údaje' });
});
