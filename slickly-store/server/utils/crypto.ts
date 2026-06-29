import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const ALG = 'aes-256-gcm';

function getKey(): Buffer {
  const k = process.env.OAUTH_ENCRYPTION_KEY ?? '';
  if (k.length < 32) throw new Error('OAUTH_ENCRYPTION_KEY must be ≥ 32 chars');
  return Buffer.from(k.slice(0, 32), 'utf-8');
}

/** AES-256-GCM encrypt — returns "iv:tag:ciphertext" hex string. */
export function encryptText(plain: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALG, getKey(), iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf-8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${enc.toString('hex')}`;
}

/** AES-256-GCM decrypt — accepts output of encryptText. */
export function decryptText(data: string): string {
  const [ivHex, tagHex, encHex] = data.split(':');
  const dec = createDecipheriv(ALG, getKey(), Buffer.from(ivHex!, 'hex'));
  dec.setAuthTag(Buffer.from(tagHex!, 'hex'));
  return dec.update(Buffer.from(encHex!, 'hex')).toString('utf-8') + dec.final('utf-8');
}
