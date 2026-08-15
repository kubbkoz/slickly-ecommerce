import { d as defineEventHandler, v as verifySwCustomer, r as readBody, c as createError, H as getWebAuthnUser, I as storeChallenge, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import { generateRegistrationOptions } from '@simplewebauthn/server';
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

const registerOptions_post = defineEventHandler(async (event) => {
  var _a;
  await verifySwCustomer(event);
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.email)) {
    throw createError({ statusCode: 400, statusMessage: "email required" });
  }
  const config = useRuntimeConfig();
  const rpID = config.webauthnRpId;
  const rpName = config.webauthnRpName;
  const existing = await getWebAuthnUser(body.email);
  const excludeCredentials = ((_a = existing == null ? void 0 : existing.credentials) != null ? _a : []).map((c) => ({
    id: c.id,
    transports: c.transports
  }));
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName: body.email,
    attestationType: "none",
    excludeCredentials,
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred"
    }
  });
  await storeChallenge(`reg:${body.email}`, options.challenge);
  return options;
});

export { registerOptions_post as default };
