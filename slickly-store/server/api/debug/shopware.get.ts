import { defineEventHandler } from 'h3';
import { useRuntimeConfig } from '#imports';

/**
 * Debug endpoint — overí dosiahnuteľnosť + platnosť Shopware Store API
 * priamo zo SERVERA (HostCreators). Otvor `https://slickly.sk/api/debug/shopware`.
 *
 * Interpretácia:
 *  - httpStatus 200  → endpoint + token OK; 500 frontendu je inde.
 *  - httpStatus 401/403 → access token je neplatný/zlý.
 *  - reachable:false / error obsahuje ENOTFOUND/ECONNREFUSED/timeout
 *      → server HostCreators NEDOSIAHNE backend (outbound blokovaný).
 */
export default defineEventHandler(async (event) => {
  requireDebugAuth(event);
  const config = useRuntimeConfig();
  const sw = (config.public as any).shopware ?? {};
  const endpoint = String(sw.endpoint || '').replace(/\/+$/, '');
  const token = String(sw.accessToken || '');
  const url = `${endpoint}/context`;

  const base = {
    endpoint,
    contextUrl: url,
    tokenPresent: token.length > 0,
    tokenPreview: token ? `${token.slice(0, 6)}…(${token.length})` : '(prázdny)',
    ids: {
      salesChannel: sw.ids?.salesChannel ?? null,
      rootCategory: sw.ids?.rootCategory ?? null,
      homeSlider: sw.ids?.categories?.homeSlider ?? null,
    },
    node: process.version,
    time: new Date().toISOString(),
  };

  if (!endpoint || !token) {
    return { ok: false, reachable: null, httpStatus: null, ...base,
      hint: 'Chýba endpoint alebo accessToken v runtimeConfig (build-time NUXT_PUBLIC_SHOPWARE_*).' };
  }

  const started = Date.now();
  try {
    const res = await $fetch.raw(url, {
      method: 'GET',
      headers: { 'sw-access-key': token, accept: 'application/json' },
      timeout: 8000,
      ignoreResponseError: true,
    });
    const body: any = res._data;
    return {
      ok: res.status >= 200 && res.status < 300,
      reachable: true,
      httpStatus: res.status,
      ms: Date.now() - started,
      ...base,
      responseKeys: body && typeof body === 'object' ? Object.keys(body).slice(0, 12) : null,
      errorDetail: res.status >= 400 ? (body?.errors ?? body) : null,
      hint:
        res.status >= 200 && res.status < 300
          ? 'Backend OK zo servera — token aj endpoint fungujú.'
          : res.status === 401 || res.status === 403
            ? 'Token je neplatný/zlý (401/403). Skontroluj NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN.'
            : `HTTP ${res.status} z backendu.`,
    };
  } catch (e: any) {
    return {
      ok: false,
      reachable: false,
      httpStatus: null,
      ms: Date.now() - started,
      ...base,
      error: String(e?.message || e),
      code: e?.code ?? e?.cause?.code ?? null,
      hint: 'Server NEDOSIAHOL backend (network/timeout). Outbound z HostCreators je pravdepodobne blokovaný — treba povoliť odchádzajúce spojenie na backend.',
    };
  }
});
