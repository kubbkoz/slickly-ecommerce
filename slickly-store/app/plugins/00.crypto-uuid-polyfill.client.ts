export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return;
  if (typeof window.crypto === 'undefined') return;
  if (typeof window.crypto.randomUUID === 'function') return;

  // crypto.randomUUID() requires a secure context (HTTPS/localhost).
  // On LAN via HTTP, patch it using getRandomValues() which is always available.
  const toHex = (b: Uint8Array, s: number, e: number) =>
    Array.from(b.slice(s, e), (x) => x.toString(16).padStart(2, '0')).join('');

  // @ts-expect-error – patching read-only property in non-secure context
  window.crypto.randomUUID = () => {
    const b = window.crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    return `${toHex(b, 0, 4)}-${toHex(b, 4, 6)}-${toHex(b, 6, 8)}-${toHex(b, 8, 10)}-${toHex(b, 10, 16)}` as `${string}-${string}-${string}-${string}-${string}`;
  };
});
