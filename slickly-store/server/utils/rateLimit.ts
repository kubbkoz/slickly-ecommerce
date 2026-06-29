import { type H3Event, getRequestIP, createError } from 'h3';

interface RateLimitOpts {
  key: string;
  limit: number;
  windowMs: number;
}

/**
 * IP-based sliding-window rate limiter backed by Nitro KV cache.
 * Throws 429 when the caller exceeds `limit` requests in `windowMs`.
 */
export async function checkRateLimit(event: H3Event, opts: RateLimitOpts): Promise<void> {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown';
  const cacheKey = `rl:${opts.key}:${ip}`;
  const cache = useStorage('nitro:cache');

  const now = Date.now();
  const windowStart = now - opts.windowMs;

  const existing = await cache.getItem<{ ts: number[] }>(cacheKey).catch(() => null);
  const timestamps = (existing?.ts ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= opts.limit) {
    const retryAfter = Math.ceil(opts.windowMs / 1000);
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      data: { retryAfter },
    });
  }

  timestamps.push(now);
  const ttl = Math.ceil(opts.windowMs / 1000);
  await cache.setItem(cacheKey, { ts: timestamps }, { ttl }).catch(() => null);
}
