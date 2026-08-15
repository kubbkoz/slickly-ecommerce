import { d as defineEventHandler, F as verifySwCustomerWithEmail, r as readBody, c as createError, G as deleteWebAuthnCredential } from '../../../nitro/nitro.mjs';
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

const credentials_delete = defineEventHandler(async (event) => {
  const { email } = await verifySwCustomerWithEmail(event);
  const body = await readBody(event);
  if (!(body == null ? void 0 : body.credentialId)) {
    throw createError({ statusCode: 400, statusMessage: "credentialId required" });
  }
  const ok = await deleteWebAuthnCredential(email, body.credentialId);
  if (!ok) {
    throw createError({ statusCode: 404, statusMessage: "Credential not found" });
  }
  return { ok: true };
});

export { credentials_delete as default };
