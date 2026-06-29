import { defineEventHandler, readBody, getHeader } from 'h3';
import { useStorage, useRuntimeConfig } from '#imports';
import { getAdminToken } from '~~/server/utils/shopwareAdmin';
import { sendMail, sendAdminNotification } from '~~/server/utils/mail';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const secret = getHeader(event, 'x-webhook-secret');
  if (!secret || secret !== config.webhookSecret) {
    return { error: 'Unauthorized' };
  }

  const body = await readBody(event);
  const productIds: string[] = Array.isArray(body.productIds) ? body.productIds : body.productId ? [body.productId] : [];
  if (!productIds.length) return { checked: 0, notified: 0 };

  const storage = useStorage('db');
  const endpoint = config.shopwareAdminEndpoint as string;
  let notified = 0;

  for (const productId of productIds) {
    // 1. Fetch aktuálny produkt z Admin API
    let product: any;
    try {
      const token = await getAdminToken();
      const res: any = await $fetch(`${endpoint}search/product`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json' },
        body: {
          filter: [{ type: 'equals', field: 'id', value: productId }],
          limit: 1,
        },
      });
      product = res?.data?.[0];
    } catch (e: any) {
      console.error(`[watchdog-check] Admin API failed for ${productId}:`, e?.message);
      continue;
    }

    if (!product) continue;

    // Admin API: price je pole [{gross, net, currencyId}], nie calculatedPrice
    const priceArr = product.price || [];
    const currentPrice = priceArr[0]?.gross ?? null;
    const currentStock = product.availableStock ?? product.stock ?? 0;
    const productName = product.translated?.name || product.name || productId;

    // 2. Scan Redis pre subscribers tohto produktu
    // getKeys() vracia kľúče relatívne k storage base — skúsime viacero prefixov
    const prefix = `watchdog:${productId}:`;
    let keys: string[] = [];
    try {
      const allKeys = await storage.getKeys();
      keys = allKeys.filter(k => k.startsWith(prefix) || k.includes(prefix));
      if (process.dev) console.log(`[watchdog-check] product=${productId} keys=${keys.length}/${allKeys.length} sample=${allKeys.slice(0, 3).join(', ')}`);
    } catch { keys = []; }
    // Fallback: priamy getItem ak vieme email (pre single subscriber test)
    if (!keys.length) {
      // Skúsime scan cez getKeys s base prefixom
      try {
        const wKeys = await storage.getKeys('watchdog');
        keys = wKeys.filter(k => k.includes(productId));
        if (process.dev && wKeys.length) console.log(`[watchdog-check] fallback scan: ${wKeys.length} watchdog keys, ${keys.length} matching`);
      } catch {}
    }
    if (!keys.length) continue;

    for (const key of keys) {
      const sub = await storage.getItem<any>(key).catch(() => null);
      if (!sub?.email) continue;

      const oldPrice = sub.productPrice;
      const oldStock = sub.productStock;

      const priceChanged = oldPrice != null && currentPrice != null && Math.abs(oldPrice - currentPrice) > 0.01;
      const stockBecameAvailable = (oldStock == null || oldStock <= 0) && currentStock > 0;
      const stockBecameUnavailable = (oldStock != null && oldStock > 0) && currentStock <= 0;
      const stockChanged = stockBecameAvailable || stockBecameUnavailable;

      if (!priceChanged && !stockChanged) continue;

      // 3. Poslať notifikáciu zákazníkovi
      const changes: string[] = [];
      if (priceChanged) {
        const direction = currentPrice < oldPrice ? 'znížila' : 'zvýšila';
        changes.push(`Cena sa ${direction} z <strong>${oldPrice} €</strong> na <strong style="color:#000000">${currentPrice} €</strong>`);
      }
      if (stockBecameAvailable) {
        changes.push(`Produkt je opäť <strong style="color:#16a34a">skladom</strong>`);
      }
      if (stockBecameUnavailable) {
        changes.push(`Produkt je momentálne <strong style="color:#000000">nedostupný</strong>`);
      }

      try {
        await sendMail({
          to: sub.email,
          subject: `Zmena na stráženom produkte – ${productName}`,
          html: `
            <h2 style="font-family:'Geist Sans',sans-serif;text-transform:uppercase;color:#000">Strážený produkt sa zmenil</h2>
            <p>Dobrý deň <strong>${sub.name || 'zákazník'}</strong>,</p>
            <p>Na produkte, ktorý strážite, nastala zmena:</p>
            <table style="border-collapse:collapse;font-size:14px;margin:16px 0">
              <tr><td style="padding:6px 16px 6px 0;font-weight:bold;color:#333">Produkt:</td><td>${productName}${sub.variantLabel ? ` (${sub.variantLabel})` : ''}</td></tr>
              ${changes.map(c => `<tr><td colspan="2" style="padding:6px 0">${c}</td></tr>`).join('')}
              <tr><td style="padding:6px 16px 6px 0;font-weight:bold;color:#333">Aktuálna cena:</td><td style="font-weight:bold;font-size:16px;color:#000000">${currentPrice != null ? currentPrice + ' €' : '—'}</td></tr>
            </table>
            <p style="margin-top:16px">
              <a href="https://mtsport.store" style="display:inline-block;padding:12px 24px;background:#000000;color:#fff;text-decoration:none;font-weight:bold;text-transform:uppercase;font-size:13px;letter-spacing:0.1em">Zobraziť produkt</a>
            </p>
            <p style="color:#999;font-size:12px;margin-top:32px;border-top:1px solid #eee;padding-top:16px">
              Tento email bol odoslaný automaticky z SLICKLY<br>
              <a href="https://mtsport.store/api/watchdog/unsubscribe?pid=${productId}&email=${encodeURIComponent(sub.email)}" style="color:#999;text-decoration:underline">Zrušiť stráženie tohto produktu</a>
            </p>
          `,
        });
        notified++;
      } catch (e: any) {
        console.error(`[watchdog-check] mail to ${sub.email} failed:`, e?.message);
      }

      // 3b. Admin notifikácia
      try {
        await sendAdminNotification(
          `Stráženie — zmena: ${productName}`,
          `
            <h3>Notifikácia odoslaná zákazníkovi</h3>
            <table style="border-collapse:collapse;font-size:14px">
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Zákazník:</td><td>${sub.name} (${sub.email})</td></tr>
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Produkt:</td><td>${productName}</td></tr>
              ${changes.map(c => `<tr><td colspan="2" style="padding:4px 0">${c}</td></tr>`).join('')}
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Aktuálna cena:</td><td>${currentPrice} €</td></tr>
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Sklad:</td><td>${currentStock > 0 ? currentStock + ' ks' : 'Nedostupný'}</td></tr>
            </table>
          `,
          sub.email,
        );
      } catch (e: any) {
        console.error(`[watchdog-check] admin mail failed:`, e?.message);
      }

      // 4. Aktualizuj uložené hodnoty
      sub.productPrice = currentPrice;
      sub.productStock = currentStock;
      sub.lastChecked = new Date().toISOString();
      await storage.setItem(key, sub, { ttl: 60 * 60 * 24 * 90 }).catch(() => null);
    }
  }

  return { checked: productIds.length, notified };
});
