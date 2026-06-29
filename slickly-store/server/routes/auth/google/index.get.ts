import { setCookie, sendRedirect } from 'h3';
import { randomBytes } from 'node:crypto';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const state = randomBytes(16).toString('hex');

  setCookie(event, 'oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });

  const params = new URLSearchParams({
    client_id: config.googleClientId,
    redirect_uri: `${config.public.siteUrl}/auth/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'select_account',
  });

  return sendRedirect(event, `https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});
