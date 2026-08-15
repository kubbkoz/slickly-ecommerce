import { d as defineEventHandler, g as getQuery, E as sendRedirect, P as getCookie, Q as deleteCookie, R as loginOrRegisterOAuth, N as setCookie, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import 'nodemailer';
import 'node:crypto';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'anymatch';
import 'lru-cache';
import 'vue-router';
import 'node:url';
import '@iconify/utils';
import 'consola';

const callback_get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { code, state, error } = getQuery(event);
  if (error) {
    return sendRedirect(event, "/?oauth_error=oauth_cancelled");
  }
  const storedState = getCookie(event, "oauth_state");
  deleteCookie(event, "oauth_state");
  if (!storedState || storedState !== state) {
    return sendRedirect(event, "/?oauth_error=oauth_state_mismatch");
  }
  if (!code || typeof code !== "string") {
    return sendRedirect(event, "/?oauth_error=oauth_no_code");
  }
  let tokens;
  try {
    tokens = await $fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      body: {
        code,
        client_id: config.googleClientId,
        client_secret: config.googleClientSecret,
        redirect_uri: `${config.public.siteUrl}/auth/google/callback`,
        grant_type: "authorization_code"
      }
    });
  } catch {
    return sendRedirect(event, "/?oauth_error=oauth_token_exchange");
  }
  let profile;
  try {
    profile = await $fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });
  } catch {
    return sendRedirect(event, "/?oauth_error=oauth_profile_fetch");
  }
  try {
    const swToken = await loginOrRegisterOAuth({
      provider: "google",
      providerId: profile.sub,
      email: profile.email,
      firstName: profile.given_name || "",
      lastName: profile.family_name || ""
    });
    setCookie(event, "sw-context-token", swToken, {
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      secure: true
    });
    return sendRedirect(event, `/?oauth_success=${encodeURIComponent(profile.email)}`);
  } catch (err) {
    if ((err == null ? void 0 : err.statusCode) === 409) {
      return sendRedirect(event, `/?oauth_error=email_exists&oauth_email=${encodeURIComponent(profile.email)}`);
    }
    return sendRedirect(event, "/?oauth_error=oauth_registration_failed");
  }
});

export { callback_get as default };
