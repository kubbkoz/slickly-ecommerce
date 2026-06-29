import { getCookie, deleteCookie, getQuery, sendRedirect } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { code, state, error } = getQuery(event);

  if (error) {
    return sendRedirect(event, '/?oauth_error=oauth_cancelled');
  }

  const storedState = getCookie(event, 'oauth_state');
  deleteCookie(event, 'oauth_state');
  if (!storedState || storedState !== state) {
    return sendRedirect(event, '/?oauth_error=oauth_state_mismatch');
  }

  if (!code || typeof code !== 'string') {
    return sendRedirect(event, '/?oauth_error=oauth_no_code');
  }

  let tokens: { access_token: string };
  try {
    tokens = await $fetch<{ access_token: string }>('https://graph.facebook.com/v19.0/oauth/access_token', {
      query: {
        client_id: config.facebookAppId,
        client_secret: config.facebookAppSecret,
        redirect_uri: `${config.public.siteUrl}/auth/facebook/callback`,
        code,
      },
    });
  } catch {
    return sendRedirect(event, '/?oauth_error=oauth_token_exchange');
  }

  let fbProfile: { id: string; email?: string; first_name?: string; last_name?: string };
  try {
    fbProfile = await $fetch('https://graph.facebook.com/me', {
      query: {
        fields: 'id,email,first_name,last_name',
        access_token: tokens.access_token,
      },
    });
  } catch {
    return sendRedirect(event, '/?oauth_error=oauth_profile_fetch');
  }

  if (!fbProfile.email) {
    return sendRedirect(event, '/?oauth_error=oauth_no_email');
  }

  try {
    const swToken = await loginOrRegisterOAuth({
      provider: 'facebook',
      providerId: fbProfile.id,
      email: fbProfile.email,
      firstName: fbProfile.first_name || '',
      lastName: fbProfile.last_name || '',
    });

    setCookie(event, 'sw-context-token', swToken, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    });

    return sendRedirect(event, `/?oauth_success=${encodeURIComponent(fbProfile.email)}`);
  } catch (err: any) {
    if (err?.statusCode === 409) {
      return sendRedirect(event, `/?oauth_error=email_exists&oauth_email=${encodeURIComponent(fbProfile.email)}`);
    }
    return sendRedirect(event, '/?oauth_error=oauth_registration_failed');
  }
});
