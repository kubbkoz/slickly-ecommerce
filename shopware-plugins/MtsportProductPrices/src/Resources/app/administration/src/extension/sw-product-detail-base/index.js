/**
 * MTSPORT MOC / PMOC / B2B injector — polling-based with multi-source product lookup.
 *
 * Storage:
 *   customFields.mtsport_moc        — float, brutto €
 *   customFields.mtsport_pmoc       — float, brutto €
 *   customFields.mtsport_b2b_gross  — float, brutto € (user input)
 *   customFields.mtsport_b2b_net    — float, netto € (auto = gross / 1.23)
 */

const CARD_ID = 'mtsport-prices-card';
const B2B_VAT_DIVISOR = 1.23; // SK VAT 23%
const POLL_INTERVAL_MS = 500;

let lastProductId = null;
let pollHandle = null;

// One-shot diagnostic flags (to avoid spamming console)
const diag = {
    productNotFound: false,
    priceFormNotFound: false,
    priceCardNotFound: false,
};

// eslint-disable-next-line no-console
console.log('[MtsportProductPrices] Module loaded');

/**
 * Try multiple paths to get the current product entity.
 * SW 6.7 may use Vuex (`Shopware.State`), Pinia (`Shopware.Store`), or expose
 * it only via the Vue component instance.
 */
function getProduct() {
    try {
        // Path 1: Vuex (legacy SW pattern)
        const vuex = window.Shopware?.State?.get?.('swProductDetail');
        if (vuex?.product) return vuex.product;

        // Path 2: Pinia (newer SW)
        const pinia = window.Shopware?.Store?.get?.('swProductDetail');
        if (pinia?.product) return pinia.product;

        // Path 3: Walk Vue 3 component tree from the price form upward
        const priceForm = document.querySelector('.sw-product-price-form');
        if (priceForm) {
            let node = priceForm;
            while (node) {
                const vc = node.__vueParentComponent;
                if (vc?.proxy?.product?.id) return vc.proxy.product;
                if (vc?.ctx?.product?.id) return vc.ctx.product;
                node = node.parentElement;
            }
        }

        // Path 4: Walk from the detail base element
        const detailBase = document.querySelector('.sw-product-detail-base, [class*="product-detail"]');
        if (detailBase) {
            let node = detailBase;
            while (node) {
                const vc = node.__vueParentComponent;
                if (vc?.proxy?.product?.id) return vc.proxy.product;
                node = node.parentElement;
            }
        }

        return null;
    } catch (e) {
        return null;
    }
}

function parseDecimal(raw) {
    if (raw === null || raw === undefined) return null;
    const normalized = String(raw).replace(',', '.').trim();
    if (normalized === '') return null;
    const n = parseFloat(normalized);
    return Number.isFinite(n) ? n : null;
}

function setCustomField(key, value) {
    const product = getProduct();
    if (!product) return;
    const v = parseDecimal(value);
    product.customFields = {
        ...(product.customFields || {}),
        [key]: v,
    };
}

function updateB2B(grossRaw) {
    const product = getProduct();
    if (!product) return;
    const gross = parseDecimal(grossRaw);
    const net = gross != null ? +(gross / B2B_VAT_DIVISOR).toFixed(4) : null;
    product.customFields = {
        ...(product.customFields || {}),
        mtsport_b2b_gross: gross,
        mtsport_b2b_net: net,
    };
    const netInput = document.getElementById('mtsport-b2b-net-input');
    if (netInput) netInput.value = net ?? '';
}

function buildFieldHtml(id, label, value, readonly) {
    const ro = readonly ? 'readonly' : '';
    const bg = readonly ? '#f4f5f7' : '#fff';
    const safeVal = value === null || value === undefined ? '' : String(value);
    return `
        <div>
            <label style="display:block;margin-bottom:8px;font-size:13px;color:#14161f;font-weight:600;">${label}</label>
            <div class="mtsport-field-wrap" style="display:flex;align-items:stretch;border:1px solid #d8dde6;border-radius:4px;background:${bg};overflow:hidden;">
                <input id="${id}" type="text" inputmode="decimal" placeholder="0.00" value="${safeVal}" ${ro}
                       style="flex:1;min-width:0;padding:8px 12px;border:none;outline:none;background:transparent;font-size:14px;color:#14161f;" />
                <span style="display:flex;align-items:center;padding:0 12px;background:#f4f5f7;border-left:1px solid #d8dde6;font-size:14px;color:#52545b;">€</span>
            </div>
        </div>
    `;
}

function inject() {
    if (document.getElementById(CARD_ID)) return false;

    const product = getProduct();
    if (!product) {
        if (!diag.productNotFound) {
            // eslint-disable-next-line no-console
            console.warn('[MtsportProductPrices] inject: product not found (tried Vuex / Pinia / Vue tree walk)');
            diag.productNotFound = true;
        }
        return false;
    }
    diag.productNotFound = false; // reset once we find it

    const priceForm = document.querySelector('.sw-product-price-form');
    if (!priceForm) {
        if (!diag.priceFormNotFound) {
            // eslint-disable-next-line no-console
            console.warn('[MtsportProductPrices] inject: .sw-product-price-form not in DOM');
            diag.priceFormNotFound = true;
        }
        return false;
    }
    diag.priceFormNotFound = false;

    const priceCard = priceForm.closest('.mt-card, .sw-card');
    if (!priceCard) {
        if (!diag.priceCardNotFound) {
            // eslint-disable-next-line no-console
            console.warn('[MtsportProductPrices] inject: parent .mt-card/.sw-card not found');
            diag.priceCardNotFound = true;
        }
        return false;
    }
    diag.priceCardNotFound = false;

    const cf = product.customFields || {};
    const moc = cf.mtsport_moc ?? '';
    const pmoc = cf.mtsport_pmoc ?? '';
    const b2bGross = cf.mtsport_b2b_gross ?? '';
    const b2bNet = cf.mtsport_b2b_net ?? '';

    const wrapper = document.createElement('div');
    wrapper.id = CARD_ID;
    // Centered card, max 800px wide — narrower than other full-width cards by design
    wrapper.style.cssText = 'background:#fff;border:1px solid #d8dde6;border-radius:4px;padding:24px;margin:16px auto;max-width:900px;';

    wrapper.innerHTML = `
        <h3 style="margin:0 0 24px 0;font-size:16px;font-weight:600;color:#14161f;">MT-SPORT — MOC / PMOC / B2B</h3>
        <div style="display:flex;flex-direction:column;gap:24px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
                ${buildFieldHtml('mtsport-moc-input',       'Maloobchodná odporúčaná cena (MOC) — brutto',          moc,      false)}
                ${buildFieldHtml('mtsport-pmoc-input',      'Pôvodná maloobchodná odporúčaná cena (PMOC) — brutto', pmoc,     false)}
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
                ${buildFieldHtml('mtsport-b2b-gross-input', 'B2B Cena (brutto)',                                    b2bGross, false)}
                ${buildFieldHtml('mtsport-b2b-net-input',   'B2B Cena (netto, automaticky)',                        b2bNet,   true)}
            </div>
        </div>
    `;

    priceCard.parentNode.insertBefore(wrapper, priceCard.nextSibling);

    const setupInput = (id, handler) => {
        const el = document.getElementById(id);
        if (!el || el.readOnly) return;
        el.addEventListener('input', (e) => handler(e.target.value));
        const wrap = el.closest('.mtsport-field-wrap');
        if (wrap) {
            el.addEventListener('focus', () => { wrap.style.borderColor = '#189eff'; });
            el.addEventListener('blur', () => { wrap.style.borderColor = '#d8dde6'; });
        }
    };

    setupInput('mtsport-moc-input',       (v) => setCustomField('mtsport_moc', v));
    setupInput('mtsport-pmoc-input',      (v) => setCustomField('mtsport_pmoc', v));
    setupInput('mtsport-b2b-gross-input', (v) => updateB2B(v));

    // eslint-disable-next-line no-console
    console.log('[MtsportProductPrices] Card injected for product:', product.id);
    return true;
}

function tick() {
    try {
        const product = getProduct();
        const currentId = product?.id || null;

        if (currentId !== lastProductId) {
            const existing = document.getElementById(CARD_ID);
            if (existing) existing.remove();
            lastProductId = currentId;
            // Reset diagnostic flags on product change
            diag.productNotFound = false;
            diag.priceFormNotFound = false;
            diag.priceCardNotFound = false;
        }

        if (currentId && !document.getElementById(CARD_ID)) {
            inject();
        }
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[MtsportProductPrices] Tick error:', err);
    }
}

function start() {
    if (pollHandle) return;
    pollHandle = setInterval(tick, POLL_INTERVAL_MS);

    // Expose for manual debugging from F12 console:
    //   window.mtsportDebug.getProduct()   → returns current product
    //   window.mtsportDebug.tick()         → manual tick
    //   window.mtsportDebug.inject()       → manual inject attempt
    window.mtsportDebug = { getProduct, tick, inject };

    // eslint-disable-next-line no-console
    console.log('[MtsportProductPrices] Watcher started (polling every ' + POLL_INTERVAL_MS + 'ms). Debug: window.mtsportDebug');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
} else {
    start();
}
