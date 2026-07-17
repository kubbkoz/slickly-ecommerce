#!/usr/bin/env node
/**
 * One-time batch migration: translate product name + description from Polish
 * (as currently stored in Shopware) to Slovak, and write the SK translation
 * back via the Admin API.
 *
 * This is a standalone script, NOT a server route — it's an ops/migration
 * tool you run manually once (or re-run safely; see "Idempotency" below), not
 * something that should be reachable over HTTP or run automatically.
 *
 * Prerequisites
 * -------------
 * 1. LibreTranslate reachable from wherever you run this (e.g. on the same
 *    VPS as the Shopware backend, bound to localhost:5000 — see the Docker
 *    command discussed separately). Load only the languages you need:
 *      docker run -d --name libretranslate -p 127.0.0.1:5000:5000 \
 *        -e LT_LOAD_ONLY=sk,pl -e LT_API_KEYS=true libretranslate/libretranslate
 *
 * 2. Env vars (export in your shell, or place in slickly-store/.env and run
 *    with `node --env-file=.env scripts/translate-products-pl-to-sk.mjs`):
 *      SHOPWARE_ADMIN_ENDPOINT       e.g. https://admin.slickly.sk/api/
 *      SHOPWARE_ADMIN_CLIENT_ID
 *      SHOPWARE_ADMIN_CLIENT_SECRET
 *      NUXT_PUBLIC_SW_ID_LANG_PL     source language id (Shopware language entity)
 *      NUXT_PUBLIC_SW_ID_LANG_SK     target language id
 *      LIBRETRANSLATE_URL            e.g. http://127.0.0.1:5000
 *      LIBRETRANSLATE_API_KEY        optional, if LT_API_KEYS=true
 *
 * Usage
 * -----
 *   node scripts/translate-products-pl-to-sk.mjs --dry-run              # preview only, no writes
 *   node scripts/translate-products-pl-to-sk.mjs                        # translate + write, whole catalog
 *   node scripts/translate-products-pl-to-sk.mjs --limit=20             # first 20 products only (testing)
 *   node scripts/translate-products-pl-to-sk.mjs --product-id=<uuid>    # single product (testing)
 *   node scripts/translate-products-pl-to-sk.mjs --force                # retranslate even if SK already has content
 *
 * Idempotency
 * -----------
 * By default a product is SKIPPED if it already has a non-empty SK name
 * (assumed already translated or manually curated). Re-running the script
 * after an interruption only fills in what's still missing. Pass --force to
 * override and retranslate everything regardless of existing SK content.
 */

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);
const DRY_RUN = !!args['dry-run'];
const FORCE = !!args.force;
const LIMIT = args.limit ? parseInt(args.limit, 10) : null;
const SINGLE_PRODUCT_ID = args['product-id'] || null;
const PAGE_SIZE = 50;
const DELAY_MS = 250; // gentle pacing between LibreTranslate calls

const {
  SHOPWARE_ADMIN_ENDPOINT,
  SHOPWARE_ADMIN_CLIENT_ID,
  SHOPWARE_ADMIN_CLIENT_SECRET,
  NUXT_PUBLIC_SW_ID_LANG_PL: PL_ID,
  NUXT_PUBLIC_SW_ID_LANG_SK: SK_ID,
  LIBRETRANSLATE_URL,
  LIBRETRANSLATE_API_KEY,
} = process.env;

for (const [name, val] of Object.entries({
  SHOPWARE_ADMIN_ENDPOINT, SHOPWARE_ADMIN_CLIENT_ID, SHOPWARE_ADMIN_CLIENT_SECRET,
  PL_ID, SK_ID, LIBRETRANSLATE_URL,
})) {
  if (!val) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
}

const endpoint = SHOPWARE_ADMIN_ENDPOINT.replace(/\/+$/, '') + '/';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- Admin OAuth (mirrors server/utils/shopwareAdmin.ts, standalone) ----
let adminToken = null;
async function getToken() {
  if (adminToken) return adminToken;
  const res = await fetch(`${endpoint}oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: SHOPWARE_ADMIN_CLIENT_ID,
      client_secret: SHOPWARE_ADMIN_CLIENT_SECRET,
    }),
  });
  if (!res.ok) throw new Error(`OAuth token fetch failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  adminToken = json.access_token;
  return adminToken;
}

async function adminFetch(path, opts = {}, retried = false) {
  const token = await getToken();
  const res = await fetch(`${endpoint}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  if (res.status === 401 && !retried) {
    adminToken = null; // token expired mid-run — refresh once and retry
    return adminFetch(path, opts, true);
  }
  return res;
}

// ---- LibreTranslate ----
async function translate(text, format) {
  if (!text || !text.trim()) return text;
  const res = await fetch(`${LIBRETRANSLATE_URL.replace(/\/+$/, '')}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text,
      source: 'pl',
      target: 'sk',
      format,
      ...(LIBRETRANSLATE_API_KEY ? { api_key: LIBRETRANSLATE_API_KEY } : {}),
    }),
  });
  if (!res.ok) throw new Error(`LibreTranslate ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.translatedText;
}

// ---- Fetch one page of products with all their translations ----
async function fetchProductPage(page) {
  const filter = SINGLE_PRODUCT_ID
    ? [{ type: 'equals', field: 'id', value: SINGLE_PRODUCT_ID }]
    : [];
  const res = await adminFetch('search/product', {
    method: 'POST',
    body: JSON.stringify({
      page,
      limit: SINGLE_PRODUCT_ID ? 1 : PAGE_SIZE,
      filter,
      includes: {
        product: ['id', 'productNumber', 'translations'],
        product_translation: ['languageId', 'name', 'description'],
      },
      associations: { translations: {} },
    }),
  });
  if (!res.ok) throw new Error(`search/product failed: ${res.status} ${await res.text()}`);
  return res.json();
}

function pickTranslation(product, languageId) {
  return (product.translations || []).find((t) => t.languageId === languageId) || null;
}

async function main() {
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE (will write to Shopware)'}${FORCE ? ' [force]' : ''}`);
  console.log(`PL language id: ${PL_ID}  |  SK language id: ${SK_ID}`);

  let page = 1;
  let processed = 0, translated = 0, skipped = 0, failed = 0;
  let total = Infinity;

  while ((page - 1) * PAGE_SIZE < total && (!LIMIT || processed < LIMIT)) {
    const json = await fetchProductPage(page);
    total = json.meta?.total ?? (json.data || []).length;
    const products = json.data || [];
    if (products.length === 0) break;

    for (const product of products) {
      if (LIMIT && processed >= LIMIT) break;
      processed++;

      const pl = pickTranslation(product, PL_ID);
      const sk = pickTranslation(product, SK_ID);
      const label = product.productNumber || product.id;

      if (!pl || (!pl.name && !pl.description)) {
        console.log(`[skip] ${label} — no PL content`);
        skipped++;
        continue;
      }

      const needsName = FORCE || !sk?.name;
      const needsDesc = FORCE || !sk?.description;
      if (!needsName && !needsDesc) {
        console.log(`[skip] ${label} — SK already translated`);
        skipped++;
        continue;
      }

      try {
        const payload = {};
        if (needsName && pl.name) {
          payload.name = await translate(pl.name, 'text');
          await sleep(DELAY_MS);
        }
        if (needsDesc && pl.description) {
          payload.description = await translate(pl.description, 'html');
          await sleep(DELAY_MS);
        }

        console.log(`[${DRY_RUN ? 'preview' : 'write'}] ${label}: "${pl.name}" -> "${payload.name ?? '(unchanged)'}"`);

        if (!DRY_RUN) {
          const res = await adminFetch(`product/${product.id}`, {
            method: 'PATCH',
            headers: { 'sw-language-id': SK_ID },
            body: JSON.stringify(payload),
          });
          if (!res.ok && res.status !== 204) {
            throw new Error(`PATCH failed: ${res.status} ${await res.text()}`);
          }
        }
        translated++;
      } catch (err) {
        console.error(`[FAIL] ${label}:`, err.message);
        failed++;
      }
    }
    page++;
  }

  console.log('\n--- Summary ---');
  console.log(`Processed: ${processed}  Translated: ${translated}  Skipped: ${skipped}  Failed: ${failed}`);
  if (DRY_RUN) console.log('This was a dry run — nothing was written. Re-run without --dry-run to apply.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
