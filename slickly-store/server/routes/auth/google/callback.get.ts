import { getCookie, deleteCookie, getQuery, sendRedirect, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { code, state, error } = getQuery(event);

  if (error) {
    return sendRedirect(event, '/?oauth_error=oauth_cancelled');
  }

  // CSRF check
  const storedState = getCookie(event, 'oauth_state');
  deleteCookie(event, 'oauth_state');
  if (!storedState || storedState !== state) {
    return sendRedirect(event, '/?oauth_error=oauth_state_mismatch');
  }

  if (!code || typeof code !== 'string') {
    return sendRedirect(event, '/?oauth_error=oauth_no_code');
  }

  // Exchange code for tokens
  let tokens: { access_token: string };
  try {
    tokens = await $fetch<{ access_token: string }>('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: {
        code,
        client_id: config.googleClientId,
        client_secret: config.googleClientSecret,
        redirect_uri: `${config.public.siteUrl}/auth/google/callback`,
        grant_type: 'authorization_code',
      },
    });
  } catch {
    return sendRedirect(event, '/?oauth_error=oauth_token_exchange');
  }

  // Fetch user profile
  let profile: { sub: string; email: string; given_name?: string; family_name?: string };
  try {
    profile = await $fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
  } catch {
    return sendRedirect(event, '/?oauth_error=oauth_profile_fetch');
  }

  try {
    const swToken = await loginOrRegisterOAuth({
      provider: 'google',
      providerId: profile.sub,
      email: profile.email,
      firstName: profile.given_name || '',
      lastName: profile.family_name || '',
    });

    setCookie(event, 'sw-context-token', swToken, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    });

    return sendRedirect(event, `/?oauth_success=${encodeURIComponent(profile.email)}`);
  } catch (err: any) {
    if (err?.statusCode === 409) {
      return sendRedirect(event, `/?oauth_error=email_exists&oauth_email=${encodeURIComponent(profile.email)}`);
    }
    return sendRedirect(event, '/?oauth_error=oauth_registration_failed');
  }
});
