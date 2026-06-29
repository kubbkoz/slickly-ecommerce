import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';

export default defineEventHandler(async (event) => {
  await verifySwCustomer(event);

  const body = await readBody<{
    email: string;
    deviceName?: string;
    credential: Record<string, unknown>;
  }>(event);

  if (!body?.email || !body?.credential) {
    throw createError({ statusCode: 400, statusMessage: 'email and credential required' });
  }

  const config = useRuntimeConfig();
  const expectedChallenge = await consumeChallenge(`reg:${body.email}`);
  if (!expectedChallenge) {
    throw createError({ statusCode: 400, statusMessage: 'Challenge expired or not found' });
  }

  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response: body.credential as any,
      expectedChallenge,
      expectedOrigin: config.public.siteUrl,
      expectedRPID: config.webauthnRpId,
      requireUserVerification: false,
    });
  } catch (err: any) {
    throw createError({ statusCode: 400, statusMessage: err?.message ?? 'Verification failed' });
  }

  if (!verification.verified || !verification.registrationInfo) {
    throw createError({ statusCode: 400, statusMessage: 'Registration not verified' });
  }

  const { credential } = verification.registrationInfo;
  // credential.id is already Base64URLString; publicKey is Uint8Array — serialize it
  const credId = credential.id as string;
  const publicKey = isoBase64URL.fromBuffer(credential.publicKey);

  const existing = await getWebAuthnUser(body.email);
  const credentials = existing?.credentials ?? [];

  credentials.push({
    id: credId,
    publicKey,
    counter: credential.counter,
    transports: (body.credential as any).response?.transports,
    deviceName: body.deviceName || 'Zariadenie',
    createdAt: Date.now(),
  });

  await saveWebAuthnUser({ email: body.email, credentials });
  await setCredIdEmail(credId, body.email);

  return { ok: true };
});
