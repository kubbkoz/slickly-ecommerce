import { defineEventHandler, readBody } from 'h3';
import { useStorage, useRuntimeConfig } from '#imports';
import { isHoneypotFilled, isRateLimited } from '~~/server/utils/antispam';
import { sendMail, sendAdminNotification } from '~~/server/utils/mail';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (isHoneypotFilled(body)) return { success: true };
  if (await isRateLimited(event, 'watchdog', 5, 3600)) {
    return { success: false, error: 'Príliš veľa požiadaviek. Skúste neskôr.' };
  }

  const { name, email, phone, productId, productName, variantLabel, productPrice, productStock, gdprConsent } = body;
  if (!name?.trim() || !email?.trim() || !productId || !gdprConsent) {
    return { success: false, error: 'Vyplňte povinné polia.' };
  }

  const storage = useStorage('db');
  const key = `watchdog:${productId}:${email.toLowerCase().trim()}`;
  await storage.setItem(key, {
    name, email: email.trim(), phone, productId, productName, variantLabel,
    productPrice, productStock,
    createdAt: new Date().toISOString(),
  }, { ttl: 60 * 60 * 24 * 90 }).catch(() => null);

  const priceText = productPrice ? `${productPrice} €` : 'neuvedená';
  const stockText = productStock && productStock > 0 ? `Skladom (${productStock} ks)` : 'Momentálne nedostupný';

  try {
    await sendMail({
      to: email.trim(),
      subject: `Stráženie produktu – ${productName}`,
      html: `
        <h2 style="font-family:'Space Grotesk',sans-serif;text-transform:uppercase;color:#000">Stráženie aktivované</h2>
        <p>Dobrý deň <strong>${name}</strong>,</p>
        <p>Budeme Vás informovať o zmene dostupnosti alebo ceny produktu:</p>
        <table style="border-collapse:collapse;font-size:14px;margin:16px 0">
          <tr><td style="padding:6px 16px 6px 0;font-weight:bold;color:#333">Produkt:</td><td>${productName}${variantLabel ? ` (${variantLabel})` : ''}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;font-weight:bold;color:#333">Aktuálna cena:</td><td style="font-weight:bold;color:#000000">${priceText}</td></tr>
        </table>
        <p>Akonáhle sa zmení cena, dostupnosť alebo výška aktívnej zľavy, budeme Vás informovať emailom.</p>
        <p style="color:#999;font-size:12px;margin-top:32px;border-top:1px solid #eee;padding-top:16px">
          Tento email bol odoslaný automaticky z SLICKLY<br>
          <a href="https://mtsport.store/api/watchdog/unsubscribe?pid=${productId}&email=${encodeURIComponent(email.trim())}" style="color:#999;text-decoration:underline">Zrušiť stráženie tohto produktu</a>
        </p>
      `,
    });
  } catch (e: any) {
    if (process.dev) console.error('[watchdog] customer mail failed:', e?.message);
  }

  try {
    await sendAdminNotification(
      `Nové stráženie: ${productName}`,
      `
        <h3 style="font-family:'Space Grotesk',sans-serif;text-transform:uppercase">Nový požiadavok na stráženie produktu</h3>
        <table style="border-collapse:collapse;font-size:14px">
          <tr><td style="padding:6px 16px 6px 0;font-weight:bold">Meno:</td><td>${name}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;font-weight:bold">Email:</td><td>${email}</td></tr>
          ${phone ? `<tr><td style="padding:6px 16px 6px 0;font-weight:bold">Tel.:</td><td>${phone}</td></tr>` : ''}
          <tr><td style="padding:6px 16px 6px 0;font-weight:bold">Produkt:</td><td>${productName}</td></tr>
          ${variantLabel ? `<tr><td style="padding:6px 16px 6px 0;font-weight:bold">Variant:</td><td>${variantLabel}</td></tr>` : ''}
          <tr><td style="padding:6px 16px 6px 0;font-weight:bold">Aktuálna cena:</td><td>${priceText}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;font-weight:bold">Stav skladu:</td><td>${stockText}</td></tr>
        </table>
        <p style="margin-top:16px;color:#666">Odpíšte priamo na tento email — odpoveď pôjde zákazníkovi.</p>
      `,
      email.trim(),
    );
  } catch (e: any) {
    if (process.dev) console.error('[watchdog] admin mail failed:', e?.message);
  }

  return { success: true };
});
