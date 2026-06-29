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
    client_id: config.facebookAppId,
    redirect_uri: `${config.public.siteUrl}/auth/facebook/callback`,
    response_type: 'code',
    scope: 'email,public_profile',
    state,
  });

  return sendRedirect(event, `https://www.facebook.com/v19.0/dialog/oauth?${params}`);
});
