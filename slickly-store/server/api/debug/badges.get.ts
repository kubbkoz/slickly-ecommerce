import { defineEventHandler } from 'h3';
import { useRuntimeConfig } from '#imports';
import { getAdminToken } from '../../utils/shopwareAdmin';

/**
 * Debug endpoint — overí, prečo `/api/badges` vracia `[]`. Testuje Admin API
 * priamo zo SERVERA (HostCreators), obchádza cache. Otvor
 * `https://slickly.sk/api/debug/badges`.
 *
 * Interpretácia:
 *  - oauthStatus 401           → client_id/secret je zlý (integrácia).
 *  - oauthStatus 200 + searchStatus 403 → integrácia nemá práva na `mtsport_badge`.
 *      V Shopware: Nastavenia → Systém → Integrácie → daj jej rolu „Administrator"
 *      (alebo ACL rolu s read na mtsport_badge).
 *  - searchStatus 200 + total 0 → na backende nie sú aktívne `mtsport_badge` záznamy
 *      alebo plugin MtsportBadge tam nie je nainštalovaný.
 *  - reachable:false / ENOTFOUND/ECONNREFUSED/timeout → outbound z HostCreators blokovaný.
 *
 * Secret NEleakuje — reportuje sa len clientIdPreview.
 */
export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const endpoint = String(config.shopwareAdminEndpoint || '');
  const clientId = String(config.shopwareAdminClientId || '');
  const clientSecret = String(config.shopwareAdminClientSecret || '');

  const base = {
    adminEndpoint: endpoint,
    clientIdPresent: clientId.length > 0,
    clientIdPreview: clientId ? `${clientId.slice(0, 6)}…(${clientId.length})` : '(prázdny)',
    clientSecretPresent: clientSecret.length > 0,
    node: process.version,
    time: new Date().toISOString(),
  };

  if (!endpoint || !clientId || !clientSecret) {
    return {
      ok: false,
      ...base,
      hint: 'Chýba SHOPWARE_ADMIN_ENDPOINT / CLIENT_ID / CLIENT_SECRET v build-time env (deploy.yml).',
    };
  }

  const out: any = { ok: false, ...base };

  // 1) OAuth token — priamy raw call (zachytí presný HTTP status)
  const t0 = Date.now();
  try {
    const res = await $fetch.raw(`${endpoint}oauth/token`, {
      method: 'POST',
      body: { grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret },
      timeout: 8000,
      ignoreResponseError: true,
    });
    out.oauthStatus = res.status;
    out.oauthMs = Date.now() - t0;
    const body: any = res._data;
    if (res.status >= 200 && res.status < 300) {
      out.tokenObtained = !!body?.access_token;
    } else {
      out.oauthError = body?.errors ?? body ?? null;
    }
  } catch (e: any) {
    out.reachable = false;
    out.oauthError = String(e?.message || e);
    out.code = e?.code ?? e?.cause?.code ?? null;
    out.hint = 'Server NEDOSIAHOL Admin API (network/timeout). Outbound z HostCreators je blokovaný.';
    return out;
  }

  // Ak OAuth zlyhal, ďalej nemá zmysel testovať search.
  if (out.oauthStatus === 401) {
    out.hint = 'OAuth 401 — client_id/secret integrácie je zlý. Over/regeneruj kľúč a znovu zapečieš.';
    return out;
  }
  if (out.oauthStatus >= 400) {
    out.hint = `OAuth HTTP ${out.oauthStatus} — pozri oauthError.`;
    return out;
  }

  // 2) search/mtsport-badge — cez rovnaký helper ako produkčná route (getAdminToken)
  const t1 = Date.now();
  try {
    const token = await getAdminToken();
    const res = await $fetch.raw(`${endpoint}search/mtsport-badge`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      body: {
        filter: [{ type: 'equals', field: 'active', value: true }],
        limit: 5,
        includes: { mtsport_badge: ['id', 'name', 'text', 'active'] },
      },
      timeout: 10000,
      ignoreResponseError: true,
    });
    out.searchStatus = res.status;
    out.searchMs = Date.now() - t1;
    const body: any = res._data;
    if (res.status >= 200 && res.status < 300) {
      out.total = body?.total ?? (Array.isArray(body?.data) ? body.data.length : 0);
      out.firstNames = Array.isArray(body?.data)
        ? body.data.map((b: any) => b?.name ?? b?.id).slice(0, 10)
        : [];
      out.ok = out.total > 0;
      out.hint =
        out.total > 0
          ? `OK — ${out.total} aktívnych badge na backende. Ak sa stále nezobrazujú, je to na FE strane (matchovanie produktov / cache).`
          : 'search 200 ale total 0 — na `mtsport.store` backende nie sú aktívne mtsport_badge záznamy alebo plugin MtsportBadge nie je nainštalovaný na tomto backende.';
    } else {
      out.searchError = body?.errors ?? body ?? null;
      out.hint =
        res.status === 403
          ? 'search 403 — integrácia „MTSPORT Nuxt Frontend" nemá práva na entitu mtsport_badge. V Shopware jej daj rolu „Administrator" (alebo ACL read na mtsport_badge). Netreba redeploy.'
          : res.status === 404
            ? 'search 404 — entita mtsport_badge neexistuje → plugin MtsportBadge NIE je nainštalovaný na tomto Shopware backende.'
            : `search HTTP ${res.status} — pozri searchError.`;
    }
  } catch (e: any) {
    out.searchError = String(e?.message || e);
    out.hint = 'search zlyhal (pozri searchError). Ak "credentials not configured" → chýba env.';
  }

  return out;
});
