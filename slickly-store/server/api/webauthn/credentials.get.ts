// GET /api/webauthn/credentials
// Vracia zoznam passkey credentialov pre prihláseného customera (bez verejných kľúčov).
// Použité v AccountTabProfil.vue pre zobrazenie + správu zariadení.

export default defineEventHandler(async (event) => {
  const { email } = await verifySwCustomerWithEmail(event);

  const user = await getWebAuthnUser(email);
  if (!user) return { credentials: [] };

  // Nevraciam publicKey ani counter — citlivé/zbytočné na klientovi
  const credentials = user.credentials.map((c) => ({
    id: c.id,
    deviceName: c.deviceName,
    createdAt: c.createdAt,
    transports: c.transports ?? [],
  }));

  return { credentials };
});
