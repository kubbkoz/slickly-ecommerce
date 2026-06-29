// DELETE /api/webauthn/credentials
// Zmaže konkrétny passkey credential pre prihláseného customera.
// Body: { credentialId: string }
//
// Bezpečnosť: kredenciál sa zmaže iba ak patrí prihlásenému emailu (overené cez verifySwCustomerWithEmail).

export default defineEventHandler(async (event) => {
  const { email } = await verifySwCustomerWithEmail(event);

  const body = await readBody<{ credentialId?: string }>(event);
  if (!body?.credentialId) {
    throw createError({ statusCode: 400, statusMessage: 'credentialId required' });
  }

  const ok = await deleteWebAuthnCredential(email, body.credentialId);
  if (!ok) {
    throw createError({ statusCode: 404, statusMessage: 'Credential not found' });
  }

  return { ok: true };
});
