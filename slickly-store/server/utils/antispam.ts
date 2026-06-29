import { useStorage } from '#imports';
import type { H3Event } from 'h3';
import { getRequestIP } from 'h3';

export function isHoneypotFilled(body: any): boolean {
  return !!(body?.website && String(body.website).trim().length > 0);
}

export async function isRateLimited(
  event: H3Event,
  prefix: string,
  limit: number = 5,
  windowSec: number = 3600,
): Promise<boolean> {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown';
  const key = `ratelimit:${prefix}:${ip}`;
  const storage = useStorage('redis');

  try {
    const current = await storage.getItem<number>(key).catch(() => null);
    if (current !== null && current >= limit) return true;
    await storage.setItem(key, (current ?? 0) + 1, { ttl: windowSec }).catch(() => null);
    return false;
  } catch {
    return false;
  }
}
