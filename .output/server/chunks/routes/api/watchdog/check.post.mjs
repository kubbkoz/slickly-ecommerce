import { d as defineEventHandler, e as getHeader, r as readBody, b as useStorage, a as getAdminToken, A as sendMail, B as sendAdminNotification, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const check_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f;
  const config = useRuntimeConfig();
  const secret = getHeader(event, "x-webhook-secret");
  if (!secret || secret !== config.webhookSecret) {
    return { error: "Unauthorized" };
  }
  const body = await readBody(event);
  const productIds = Array.isArray(body.productIds) ? body.productIds : body.productId ? [body.productId] : [];
  if (!productIds.length) return { checked: 0, notified: 0 };
  const storage = useStorage("db");
  const endpoint = config.shopwareAdminEndpoint;
  let notified = 0;
  for (const productId of productIds) {
    let product;
    try {
      const token = await getAdminToken();
      const res = await $fetch(`${endpoint}search/product`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json" },
        body: {
          filter: [{ type: "equals", field: "id", value: productId }],
          limit: 1
        }
      });
      product = (_a = res == null ? void 0 : res.data) == null ? void 0 : _a[0];
    } catch (e) {
      console.error(`[watchdog-check] Admin API failed for ${productId}:`, e == null ? void 0 : e.message);
      continue;
    }
    if (!product) continue;
    const priceArr = product.price || [];
    const currentPrice = (_c = (_b = priceArr[0]) == null ? void 0 : _b.gross) != null ? _c : null;
    const currentStock = (_e = (_d = product.availableStock) != null ? _d : product.stock) != null ? _e : 0;
    const productName = ((_f = product.translated) == null ? void 0 : _f.name) || product.name || productId;
    const prefix = `watchdog:${productId}:`;
    let keys = [];
    try {
      const allKeys = await storage.getKeys();
      keys = allKeys.filter((k) => k.startsWith(prefix) || k.includes(prefix));
      if (false) ;
    } catch {
      keys = [];
    }
    if (!keys.length) {
      try {
        const wKeys = await storage.getKeys("watchdog");
        keys = wKeys.filter((k) => k.includes(productId));
        if (false) ;
      } catch {
      }
    }
    if (!keys.length) continue;
    for (const key of keys) {
      const sub = await storage.getItem(key).catch(() => null);
      if (!(sub == null ? void 0 : sub.email)) continue;
      const oldPrice = sub.productPrice;
      const oldStock = sub.productStock;
      const priceChanged = oldPrice != null && currentPrice != null && Math.abs(oldPrice - currentPrice) > 0.01;
      const stockBecameAvailable = (oldStock == null || oldStock <= 0) && currentStock > 0;
      const stockBecameUnavailable = oldStock != null && oldStock > 0 && currentStock <= 0;
      const stockChanged = stockBecameAvailable || stockBecameUnavailable;
      if (!priceChanged && !stockChanged) continue;
      const changes = [];
      if (priceChanged) {
        const direction = currentPrice < oldPrice ? "zn\xED\u017Eila" : "zv\xFD\u0161ila";
        changes.push(`Cena sa ${direction} z <strong>${oldPrice} \u20AC</strong> na <strong style="color:#000000">${currentPrice} \u20AC</strong>`);
      }
      if (stockBecameAvailable) {
        changes.push(`Produkt je op\xE4\u0165 <strong style="color:#16a34a">skladom</strong>`);
      }
      if (stockBecameUnavailable) {
        changes.push(`Produkt je moment\xE1lne <strong style="color:#000000">nedostupn\xFD</strong>`);
      }
      try {
        await sendMail({
          to: sub.email,
          subject: `Zmena na str\xE1\u017Eenom produkte \u2013 ${productName}`,
          html: `
            <h2 style="font-family:'Space Grotesk',sans-serif;text-transform:uppercase;color:#000">Str\xE1\u017Een\xFD produkt sa zmenil</h2>
            <p>Dobr\xFD de\u0148 <strong>${sub.name || "z\xE1kazn\xEDk"}</strong>,</p>
            <p>Na produkte, ktor\xFD str\xE1\u017Eite, nastala zmena:</p>
            <table style="border-collapse:collapse;font-size:14px;margin:16px 0">
              <tr><td style="padding:6px 16px 6px 0;font-weight:bold;color:#333">Produkt:</td><td>${productName}${sub.variantLabel ? ` (${sub.variantLabel})` : ""}</td></tr>
              ${changes.map((c) => `<tr><td colspan="2" style="padding:6px 0">${c}</td></tr>`).join("")}
              <tr><td style="padding:6px 16px 6px 0;font-weight:bold;color:#333">Aktu\xE1lna cena:</td><td style="font-weight:bold;font-size:16px;color:#000000">${currentPrice != null ? currentPrice + " \u20AC" : "\u2014"}</td></tr>
            </table>
            <p style="margin-top:16px">
              <a href="https://mtsport.store" style="display:inline-block;padding:12px 24px;background:#000000;color:#fff;text-decoration:none;font-weight:bold;text-transform:uppercase;font-size:13px;letter-spacing:0.1em">Zobrazi\u0165 produkt</a>
            </p>
            <p style="color:#999;font-size:12px;margin-top:32px;border-top:1px solid #eee;padding-top:16px">
              Tento email bol odoslan\xFD automaticky z SLICKLY<br>
              <a href="https://mtsport.store/api/watchdog/unsubscribe?pid=${productId}&email=${encodeURIComponent(sub.email)}" style="color:#999;text-decoration:underline">Zru\u0161i\u0165 str\xE1\u017Eenie tohto produktu</a>
            </p>
          `
        });
        notified++;
      } catch (e) {
        console.error(`[watchdog-check] mail to ${sub.email} failed:`, e == null ? void 0 : e.message);
      }
      try {
        await sendAdminNotification(
          `Str\xE1\u017Eenie \u2014 zmena: ${productName}`,
          `
            <h3>Notifik\xE1cia odoslan\xE1 z\xE1kazn\xEDkovi</h3>
            <table style="border-collapse:collapse;font-size:14px">
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Z\xE1kazn\xEDk:</td><td>${sub.name} (${sub.email})</td></tr>
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Produkt:</td><td>${productName}</td></tr>
              ${changes.map((c) => `<tr><td colspan="2" style="padding:4px 0">${c}</td></tr>`).join("")}
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Aktu\xE1lna cena:</td><td>${currentPrice} \u20AC</td></tr>
              <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Sklad:</td><td>${currentStock > 0 ? currentStock + " ks" : "Nedostupn\xFD"}</td></tr>
            </table>
          `,
          sub.email
        );
      } catch (e) {
        console.error(`[watchdog-check] admin mail failed:`, e == null ? void 0 : e.message);
      }
      sub.productPrice = currentPrice;
      sub.productStock = currentStock;
      sub.lastChecked = (/* @__PURE__ */ new Date()).toISOString();
      await storage.setItem(key, sub, { ttl: 60 * 60 * 24 * 90 }).catch(() => null);
    }
  }
  return { checked: productIds.length, notified };
});

export { check_post as default };
