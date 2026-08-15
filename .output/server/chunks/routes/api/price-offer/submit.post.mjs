import { d as defineEventHandler, r as readBody, y as isHoneypotFilled, z as isRateLimited, A as sendMail, B as sendAdminNotification } from '../../../nitro/nitro.mjs';
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

const submit_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (isHoneypotFilled(body)) return { success: true };
  if (await isRateLimited(event, "price-offer", 5, 3600)) {
    return { success: false, error: "Pr\xEDli\u0161 ve\u013Ea po\u017Eiadaviek. Sk\xFAste nesk\xF4r." };
  }
  const { name, email, phone, productId, productName, variantLabel, competitorUrl, gdprConsent } = body;
  if (!(name == null ? void 0 : name.trim()) || !(email == null ? void 0 : email.trim()) || !productId || !gdprConsent) {
    return { success: false, error: "Vypl\u0148te povinn\xE9 polia." };
  }
  try {
    await sendMail({
      to: email.trim(),
      subject: `Dopyt na cenov\xFA ponuku \u2013 ${productName}`,
      html: `
        <h2 style="font-family:'Space Grotesk',sans-serif;text-transform:uppercase">Dopyt prijat\xFD</h2>
        <p>Dobr\xFD de\u0148 <strong>${name}</strong>,</p>
        <p>V\xE1\u0161 dopyt na cenov\xFA ponuku pre produkt <strong>${productName}</strong>${variantLabel ? ` (${variantLabel})` : ""} bol prijat\xFD.</p>
        <p>Ozveme sa V\xE1m \u010Do najsk\xF4r.</p>
        <p style="color:#666;font-size:13px;margin-top:24px">Tento email bol odoslan\xFD automaticky z SLICKLY</p>
      `
    });
  } catch (e) {
  }
  try {
    await sendAdminNotification(
      `Cenov\xFD dopyt: ${productName}`,
      `
        <h3>Nov\xFD cenov\xFD dopyt</h3>
        <table style="border-collapse:collapse;font-size:14px">
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Meno:</td><td>${name}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Email:</td><td>${email}</td></tr>
          ${phone ? `<tr><td style="padding:4px 12px 4px 0;font-weight:bold">Tel.:</td><td>${phone}</td></tr>` : ""}
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Produkt:</td><td>${productName}</td></tr>
          ${variantLabel ? `<tr><td style="padding:4px 12px 4px 0;font-weight:bold">Variant:</td><td>${variantLabel}</td></tr>` : ""}
          ${competitorUrl ? `<tr><td style="padding:4px 12px 4px 0;font-weight:bold">Lep\u0161ia cena:</td><td><a href="${competitorUrl}">${competitorUrl}</a></td></tr>` : ""}
        </table>
        <p style="margin-top:16px;color:#666">Odp\xED\u0161te priamo na tento email \u2014 odpove\u010F p\xF4jde z\xE1kazn\xEDkovi.</p>
      `,
      email.trim()
    );
  } catch (e) {
  }
  return { success: true };
});

export { submit_post as default };
