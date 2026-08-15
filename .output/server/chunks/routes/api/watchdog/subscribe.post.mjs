import { d as defineEventHandler, r as readBody, y as isHoneypotFilled, z as isRateLimited, b as useStorage, A as sendMail, B as sendAdminNotification } from '../../../nitro/nitro.mjs';
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

const subscribe_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (isHoneypotFilled(body)) return { success: true };
  if (await isRateLimited(event, "watchdog", 5, 3600)) {
    return { success: false, error: "Pr\xEDli\u0161 ve\u013Ea po\u017Eiadaviek. Sk\xFAste nesk\xF4r." };
  }
  const { name, email, phone, productId, productName, variantLabel, productPrice, productStock, gdprConsent } = body;
  if (!(name == null ? void 0 : name.trim()) || !(email == null ? void 0 : email.trim()) || !productId || !gdprConsent) {
    return { success: false, error: "Vypl\u0148te povinn\xE9 polia." };
  }
  const storage = useStorage("db");
  const key = `watchdog:${productId}:${email.toLowerCase().trim()}`;
  await storage.setItem(key, {
    name,
    email: email.trim(),
    phone,
    productId,
    productName,
    variantLabel,
    productPrice,
    productStock,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  }, { ttl: 60 * 60 * 24 * 90 }).catch(() => null);
  const priceText = productPrice ? `${productPrice} \u20AC` : "neuveden\xE1";
  const stockText = productStock && productStock > 0 ? `Skladom (${productStock} ks)` : "Moment\xE1lne nedostupn\xFD";
  try {
    await sendMail({
      to: email.trim(),
      subject: `Str\xE1\u017Eenie produktu \u2013 ${productName}`,
      html: `
        <h2 style="font-family:'Space Grotesk',sans-serif;text-transform:uppercase;color:#000">Str\xE1\u017Eenie aktivovan\xE9</h2>
        <p>Dobr\xFD de\u0148 <strong>${name}</strong>,</p>
        <p>Budeme V\xE1s informova\u0165 o zmene dostupnosti alebo ceny produktu:</p>
        <table style="border-collapse:collapse;font-size:14px;margin:16px 0">
          <tr><td style="padding:6px 16px 6px 0;font-weight:bold;color:#333">Produkt:</td><td>${productName}${variantLabel ? ` (${variantLabel})` : ""}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;font-weight:bold;color:#333">Aktu\xE1lna cena:</td><td style="font-weight:bold;color:#000000">${priceText}</td></tr>
        </table>
        <p>Akon\xE1hle sa zmen\xED cena, dostupnos\u0165 alebo v\xFD\u0161ka akt\xEDvnej z\u013Eavy, budeme V\xE1s informova\u0165 emailom.</p>
        <p style="color:#999;font-size:12px;margin-top:32px;border-top:1px solid #eee;padding-top:16px">
          Tento email bol odoslan\xFD automaticky z SLICKLY<br>
          <a href="https://mtsport.store/api/watchdog/unsubscribe?pid=${productId}&email=${encodeURIComponent(email.trim())}" style="color:#999;text-decoration:underline">Zru\u0161i\u0165 str\xE1\u017Eenie tohto produktu</a>
        </p>
      `
    });
  } catch (e) {
  }
  try {
    await sendAdminNotification(
      `Nov\xE9 str\xE1\u017Eenie: ${productName}`,
      `
        <h3 style="font-family:'Space Grotesk',sans-serif;text-transform:uppercase">Nov\xFD po\u017Eiadavok na str\xE1\u017Eenie produktu</h3>
        <table style="border-collapse:collapse;font-size:14px">
          <tr><td style="padding:6px 16px 6px 0;font-weight:bold">Meno:</td><td>${name}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;font-weight:bold">Email:</td><td>${email}</td></tr>
          ${phone ? `<tr><td style="padding:6px 16px 6px 0;font-weight:bold">Tel.:</td><td>${phone}</td></tr>` : ""}
          <tr><td style="padding:6px 16px 6px 0;font-weight:bold">Produkt:</td><td>${productName}</td></tr>
          ${variantLabel ? `<tr><td style="padding:6px 16px 6px 0;font-weight:bold">Variant:</td><td>${variantLabel}</td></tr>` : ""}
          <tr><td style="padding:6px 16px 6px 0;font-weight:bold">Aktu\xE1lna cena:</td><td>${priceText}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;font-weight:bold">Stav skladu:</td><td>${stockText}</td></tr>
        </table>
        <p style="margin-top:16px;color:#666">Odp\xED\u0161te priamo na tento email \u2014 odpove\u010F p\xF4jde z\xE1kazn\xEDkovi.</p>
      `,
      email.trim()
    );
  } catch (e) {
  }
  return { success: true };
});

export { subscribe_post as default };
