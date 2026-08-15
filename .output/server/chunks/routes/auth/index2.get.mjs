import { d as defineEventHandler, N as setCookie, E as sendRedirect, u as useRuntimeConfig } from '../../nitro/nitro.mjs';
import { randomBytes } from 'node:crypto';
import 'nodemailer';
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

const index_get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const state = randomBytes(16).toString("hex");
  setCookie(event, "oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
    secure: true
  });
  const params = new URLSearchParams({
    client_id: config.googleClientId,
    redirect_uri: `${config.public.siteUrl}/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "select_account"
  });
  return sendRedirect(event, `https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

export { index_get as default };
