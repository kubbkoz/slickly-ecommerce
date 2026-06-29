import { generateRegistrationOptions } from '@simplewebauthn/server';
import { getCookie, getHeader } from 'h3';

export default defineEventHandler(async (event) => {
  // Must be logged in to Shopware
  await verifySwCustomer(event);

  const body = await readBody<{ email: string }>(event);
  if (!body?.email) {
    throw createError({ statusCode: 400, statusMessage: 'email required' });
  }

  const config = useRuntimeConfig();
  const rpID = config.webauthnRpId;
  const rpName = config.webauthnRpName;

  const existing = await getWebAuthnUser(body.email);
  const excludeCredentials = (existing?.credentials ?? []).map((c) => ({
    id: c.id,
    transports: c.transports,
  }));

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName: body.email,
    attestationType: 'none',
    excludeCredentials,
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
    },
  });

  // Store challenge keyed by email, 5-min TTL
  await storeChallenge(`reg:${body.email}`, options.challenge);

  return options;
});
