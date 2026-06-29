/**
 * withRetry — obalí async funkciu retry logikou s exponenciálnym backoffom.
 *
 * Použitie:
 *   const data = await withRetry(() => apiClient.invoke(...));
 *   const data = await withRetry(() => fetchX(), { retries: 3, baseDelayMs: 500 });
 *
 * Default: 2 retry (3 pokusy spolu), backoff 300ms → 600ms.
 * Po vyčerpaní pokusov re-throwne poslednú chybu (caller ju zachytí).
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: { retries?: number; baseDelayMs?: number } = {}
): Promise<T> {
  const retries = opts.retries ?? 2;
  const baseDelayMs = opts.baseDelayMs ?? 300;
  let lastErr: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, baseDelayMs * 2 ** attempt));
      }
    }
  }

  throw lastErr;
}
