import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';

export default defineEventHandler(async (event) => {
  await checkRateLimit(event, { key: 'wa:login', limit: 10, windowMs: 60_000 });

  const body = await readBody<{ credential: Record<string, unknown> }>(event);
  if (!body?.credential) {
    throw createError({ statusCode: 400, statusMessage: 'credential required' });
  }

  const credId = (body.credential as any).id as string;
  const email = await getEmailByCredId(credId);
  if (!email) {
    throw createError({ statusCode: 404, statusMessage: 'Unknown credential' });
  }

  const user = await getWebAuthnUser(email);
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' });
  }

  const storedCred = user.credentials.find((c) => c.id === credId);
  if (!storedCred) {
    throw createError({ statusCode: 404, statusMessage: 'Credential not found' });
  }

  // Challenge was stored by login-options and attached by the browser component
  const challenge = (body.credential as any).challenge as string | undefined;
  const expectedChallenge = challenge
    ? await consumeChallenge(`auth:${challenge}`)
    : null;

  if (!expectedChallenge) {
    throw createError({ statusCode: 400, statusMessage: 'Challenge expired or invalid' });
  }

  const config = useRuntimeConfig();

  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response: body.credential as any,
      expectedChallenge,
      expectedOrigin: config.public.siteUrl,
      expectedRPID: config.webauthnRpId,
      // storedCred.id is Base64URLString; publicKey stored as base64url → decode to Uint8Array
      credential: {
        id: storedCred.id,
        publicKey: isoBase64URL.toBuffer(storedCred.publicKey),
        counter: storedCred.counter,
        transports: storedCred.transports,
      },
      requireUserVerification: false,
    });
  } catch (err: any) {
    throw createError({ statusCode: 400, statusMessage: err?.message ?? 'Auth failed' });
  }

  if (!verification.verified) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication not verified' });
  }

  // Update counter to prevent replay attacks
  storedCred.counter = verification.authenticationInfo.newCounter;
  await saveWebAuthnUser(user);

  // Log in to Shopware and set session cookie
  const swToken = await shopwareLoginByEmail(email);
  if (!swToken) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Shopware login failed — link account via password first',
    });
  }

  setCookie(event, 'sw-context-token', swToken, {
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });

  return { ok: true, email };
});
