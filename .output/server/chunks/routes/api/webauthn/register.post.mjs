import { d as defineEventHandler, v as verifySwCustomer, r as readBody, c as createError, K as consumeChallenge, H as getWebAuthnUser, L as saveWebAuthnUser, O as setCredIdEmail, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
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

const register_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  await verifySwCustomer(event);
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.email) || !(body == null ? void 0 : body.credential)) {
    throw createError({ statusCode: 400, statusMessage: "email and credential required" });
  }
  const config = useRuntimeConfig();
  const expectedChallenge = await consumeChallenge(`reg:${body.email}`);
  if (!expectedChallenge) {
    throw createError({ statusCode: 400, statusMessage: "Challenge expired or not found" });
  }
  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response: body.credential,
      expectedChallenge,
      expectedOrigin: config.public.siteUrl,
      expectedRPID: config.webauthnRpId,
      requireUserVerification: false
    });
  } catch (err) {
    throw createError({ statusCode: 400, statusMessage: (_a = err == null ? void 0 : err.message) != null ? _a : "Verification failed" });
  }
  if (!verification.verified || !verification.registrationInfo) {
    throw createError({ statusCode: 400, statusMessage: "Registration not verified" });
  }
  const { credential } = verification.registrationInfo;
  const credId = credential.id;
  const publicKey = isoBase64URL.fromBuffer(credential.publicKey);
  const existing = await getWebAuthnUser(body.email);
  const credentials = (_b = existing == null ? void 0 : existing.credentials) != null ? _b : [];
  credentials.push({
    id: credId,
    publicKey,
    counter: credential.counter,
    transports: (_c = body.credential.response) == null ? void 0 : _c.transports,
    deviceName: body.deviceName || "Zariadenie",
    createdAt: Date.now()
  });
  await saveWebAuthnUser({ email: body.email, credentials });
  await setCredIdEmail(credId, body.email);
  return { ok: true };
});

export { register_post as default };
