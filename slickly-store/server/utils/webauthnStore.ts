import type { AuthenticatorTransportFuture } from '@simplewebauthn/types';

export interface StoredCredential {
  id: string;
  publicKey: string;       // Uint8Array serialized as base64url
  counter: number;
  transports?: AuthenticatorTransportFuture[];
  deviceName: string;
  createdAt: number;
}

interface UserWebAuthn {
  email: string;
  credentials: StoredCredential[];
}

const TTL = 365 * 24 * 3600;
const store = () => useStorage('nitro:cache');

export async function getWebAuthnUser(email: string) {
  return store().getItem<UserWebAuthn>(`wa:user:${email}`);
}

export async function saveWebAuthnUser(data: UserWebAuthn) {
  await store().setItem(`wa:user:${data.email}`, data, { ttl: TTL });
}

export async function getEmailByCredId(credId: string) {
  return store().getItem<string>(`wa:cid:${credId}`);
}

export async function setCredIdEmail(credId: string, email: string) {
  await store().setItem(`wa:cid:${credId}`, email, { ttl: TTL });
}

export async function storeChallenge(key: string, challenge: string) {
  await store().setItem(`wa:ch:${key}`, challenge, { ttl: 300 }); // 5 min
}

export async function consumeChallenge(key: string): Promise<string | null> {
  const s = store();
  const ch = await s.getItem<string>(`wa:ch:${key}`);
  if (ch) await s.removeItem(`wa:ch:${key}`);
  return ch;
}

export async function removeCredIdMapping(credId: string) {
  await store().removeItem(`wa:cid:${credId}`);
}

export async function deleteWebAuthnCredential(email: string, credId: string): Promise<boolean> {
  const user = await getWebAuthnUser(email);
  if (!user) return false;
  const before = user.credentials.length;
  user.credentials = user.credentials.filter((c) => c.id !== credId);
  if (user.credentials.length === before) return false;
  await saveWebAuthnUser(user);
  await removeCredIdMapping(credId);
  return true;
}
