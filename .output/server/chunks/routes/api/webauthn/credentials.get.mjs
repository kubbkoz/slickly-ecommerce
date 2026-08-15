import { d as defineEventHandler, F as verifySwCustomerWithEmail, H as getWebAuthnUser } from '../../../nitro/nitro.mjs';
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

const credentials_get = defineEventHandler(async (event) => {
  const { email } = await verifySwCustomerWithEmail(event);
  const user = await getWebAuthnUser(email);
  if (!user) return { credentials: [] };
  const credentials = user.credentials.map((c) => {
    var _a;
    return {
      id: c.id,
      deviceName: c.deviceName,
      createdAt: c.createdAt,
      transports: (_a = c.transports) != null ? _a : []
    };
  });
  return { credentials };
});

export { credentials_get as default };
