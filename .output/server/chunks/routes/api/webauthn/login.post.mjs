import { d as defineEventHandler, l as checkRateLimit, r as readBody, c as createError, J as getEmailByCredId, H as getWebAuthnUser, K as consumeChallenge, L as saveWebAuthnUser, M as shopwareLoginByEmail, N as setCookie, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
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

const login_post = defineEventHandler(async (event) => {
  var _a;
  await checkRateLimit(event, { key: "wa:login", limit: 10, windowMs: 6e4 });
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.credential)) {
    throw createError({ statusCode: 400, statusMessage: "credential required" });
  }
  const credId = body.credential.id;
  const email = await getEmailByCredId(credId);
  if (!email) {
    throw createError({ statusCode: 404, statusMessage: "Unknown credential" });
  }
  const user = await getWebAuthnUser(email);
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }
  const storedCred = user.credentials.find((c) => c.id === credId);
  if (!storedCred) {
    throw createError({ statusCode: 404, statusMessage: "Credential not found" });
  }
  const challenge = body.credential.challenge;
  const expectedChallenge = challenge ? await consumeChallenge(`auth:${challenge}`) : null;
  if (!expectedChallenge) {
    throw createError({ statusCode: 400, statusMessage: "Challenge expired or invalid" });
  }
  const config = useRuntimeConfig();
  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response: body.credential,
      expectedChallenge,
      expectedOrigin: config.public.siteUrl,
      expectedRPID: config.webauthnRpId,
      // storedCred.id is Base64URLString; publicKey stored as base64url → decode to Uint8Array
      credential: {
        id: storedCred.id,
        publicKey: isoBase64URL.toBuffer(storedCred.publicKey),
        counter: storedCred.counter,
        transports: storedCred.transports
      },
      requireUserVerification: false
    });
  } catch (err) {
    throw createError({ statusCode: 400, statusMessage: (_a = err == null ? void 0 : err.message) != null ? _a : "Auth failed" });
  }
  if (!verification.verified) {
    throw createError({ statusCode: 401, statusMessage: "Authentication not verified" });
  }
  storedCred.counter = verification.authenticationInfo.newCounter;
  await saveWebAuthnUser(user);
  const swToken = await shopwareLoginByEmail(email);
  if (!swToken) {
    throw createError({
      statusCode: 502,
      statusMessage: "Shopware login failed \u2014 link account via password first"
    });
  }
  setCookie(event, "sw-context-token", swToken, {
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    secure: true
  });
  return { ok: true, email };
});

export { login_post as default };
