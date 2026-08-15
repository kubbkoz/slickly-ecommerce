import { d as defineEventHandler, l as checkRateLimit, I as storeChallenge } from '../../../nitro/nitro.mjs';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
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

const loginOptions_post = defineEventHandler(async (event) => {
  await checkRateLimit(event, { key: "wa:login-options", limit: 20, windowMs: 6e4 });
  const options = await generateAuthenticationOptions({
    userVerification: "preferred"
    // Empty allowCredentials → discoverable credential flow (passkey)
  });
  await storeChallenge(`auth:${options.challenge}`, options.challenge);
  return options;
});

export { loginOptions_post as default };
