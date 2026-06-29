import { generateAuthenticationOptions } from '@simplewebauthn/server';

export default defineEventHandler(async (event) => {
  await checkRateLimit(event, { key: 'wa:login-options', limit: 20, windowMs: 60_000 });

  const options = await generateAuthenticationOptions({
    userVerification: 'preferred',
    // Empty allowCredentials → discoverable credential flow (passkey)
  });

  // Challenge keyed by options.challenge itself (discoverable flow has no known user yet)
  await storeChallenge(`auth:${options.challenge}`, options.challenge);

  return options;
});
