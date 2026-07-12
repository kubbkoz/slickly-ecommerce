import { type H3Event, getHeader, createError } from 'h3';

/**
 * Guards diagnostic/debug endpoints for production.
 *
 * Requires the caller to present the admin secret via the `x-admin-secret`
 * header — the same WEBHOOK_SECRET pattern already used by
 * /api/admin/catalog-refresh. Without it these endpoints expose internal
 * reconnaissance (Shopware IDs, admin endpoint URLs, token/client-id previews,
 * Node version, storage keys, raw error stacks/upstream bodies) to anyone.
 *
 * Responds 404 (not 401) so the endpoint's existence isn't advertised, and
 * fails closed: if WEBHOOK_SECRET is unset, the endpoint is always 404.
 *
 * NOTE: the strength of this gate depends on WEBHOOK_SECRET being rotated and
 * moved out of the committed CI workflow (audit S1) — until then the secret is
 * public and this gate is only defense-in-depth.
 */
export function requireDebugAuth(event: H3Event): void {
  const secret = useRuntimeConfig().webhookSecret as string;
  if (!secret || getHeader(event, 'x-admin-secret') !== secret) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' });
  }
}
