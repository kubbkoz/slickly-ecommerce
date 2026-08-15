import { d as defineEventHandler, m as requireDebugAuth, a as getAdminToken, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import 'nodemailer';
import 'node:crypto';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'anymatch';
import 'lru-cache';
import 'vue-router';
import 'node:url';
import '@iconify/utils';
import 'consola';

const badges_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  requireDebugAuth(event);
  const config = useRuntimeConfig();
  const endpoint = String(config.shopwareAdminEndpoint || "");
  const clientId = String(config.shopwareAdminClientId || "");
  const clientSecret = String(config.shopwareAdminClientSecret || "");
  const base = {
    adminEndpoint: endpoint,
    clientIdPresent: clientId.length > 0,
    clientIdPreview: clientId ? `${clientId.slice(0, 6)}\u2026(${clientId.length})` : "(pr\xE1zdny)",
    clientSecretPresent: clientSecret.length > 0,
    node: process.version,
    time: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (!endpoint || !clientId || !clientSecret) {
    return {
      ok: false,
      ...base,
      hint: "Ch\xFDba SHOPWARE_ADMIN_ENDPOINT / CLIENT_ID / CLIENT_SECRET v build-time env (deploy.yml)."
    };
  }
  const out = { ok: false, ...base };
  const t0 = Date.now();
  try {
    const res = await $fetch.raw(`${endpoint}oauth/token`, {
      method: "POST",
      body: { grant_type: "client_credentials", client_id: clientId, client_secret: clientSecret },
      timeout: 8e3,
      ignoreResponseError: true
    });
    out.oauthStatus = res.status;
    out.oauthMs = Date.now() - t0;
    const body = res._data;
    if (res.status >= 200 && res.status < 300) {
      out.tokenObtained = !!(body == null ? void 0 : body.access_token);
    } else {
      out.oauthError = (_b = (_a = body == null ? void 0 : body.errors) != null ? _a : body) != null ? _b : null;
    }
  } catch (e) {
    out.reachable = false;
    out.oauthError = String((e == null ? void 0 : e.message) || e);
    out.code = (_e = (_d = e == null ? void 0 : e.code) != null ? _d : (_c = e == null ? void 0 : e.cause) == null ? void 0 : _c.code) != null ? _e : null;
    out.hint = "Server NEDOSIAHOL Admin API (network/timeout). Outbound z HostCreators je blokovan\xFD.";
    return out;
  }
  if (out.oauthStatus === 401) {
    out.hint = "OAuth 401 \u2014 client_id/secret integr\xE1cie je zl\xFD. Over/regeneruj k\u013E\xFA\u010D a znovu zape\u010Die\u0161.";
    return out;
  }
  if (out.oauthStatus >= 400) {
    out.hint = `OAuth HTTP ${out.oauthStatus} \u2014 pozri oauthError.`;
    return out;
  }
  const t1 = Date.now();
  try {
    const token = await getAdminToken();
    const res = await $fetch.raw(`${endpoint}search/mtsport-badge`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      body: {
        filter: [{ type: "equals", field: "active", value: true }],
        limit: 5,
        includes: { mtsport_badge: ["id", "name", "text", "active"] }
      },
      timeout: 1e4,
      ignoreResponseError: true
    });
    out.searchStatus = res.status;
    out.searchMs = Date.now() - t1;
    const body = res._data;
    if (res.status >= 200 && res.status < 300) {
      out.total = (_f = body == null ? void 0 : body.total) != null ? _f : Array.isArray(body == null ? void 0 : body.data) ? body.data.length : 0;
      out.firstNames = Array.isArray(body == null ? void 0 : body.data) ? body.data.map((b) => {
        var _a2;
        return (_a2 = b == null ? void 0 : b.name) != null ? _a2 : b == null ? void 0 : b.id;
      }).slice(0, 10) : [];
      out.ok = out.total > 0;
      out.hint = out.total > 0 ? `OK \u2014 ${out.total} akt\xEDvnych badge na backende. Ak sa st\xE1le nezobrazuj\xFA, je to na FE strane (matchovanie produktov / cache).` : "search 200 ale total 0 \u2014 na `mtsport.store` backende nie s\xFA akt\xEDvne mtsport_badge z\xE1znamy alebo plugin MtsportBadge nie je nain\u0161talovan\xFD na tomto backende.";
    } else {
      out.searchError = (_h = (_g = body == null ? void 0 : body.errors) != null ? _g : body) != null ? _h : null;
      out.hint = res.status === 403 ? 'search 403 \u2014 integr\xE1cia \u201EMTSPORT Nuxt Frontend" nem\xE1 pr\xE1va na entitu mtsport_badge. V Shopware jej daj rolu \u201EAdministrator" (alebo ACL read na mtsport_badge). Netreba redeploy.' : res.status === 404 ? "search 404 \u2014 entita mtsport_badge neexistuje \u2192 plugin MtsportBadge NIE je nain\u0161talovan\xFD na tomto Shopware backende." : `search HTTP ${res.status} \u2014 pozri searchError.`;
    }
  } catch (e) {
    out.searchError = String((e == null ? void 0 : e.message) || e);
    out.hint = 'search zlyhal (pozri searchError). Ak "credentials not configured" \u2192 ch\xFDba env.';
  }
  return out;
});

export { badges_get as default };
