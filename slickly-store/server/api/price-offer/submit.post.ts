import { defineEventHandler, readBody } from 'h3';
import { isHoneypotFilled, isRateLimited } from '~~/server/utils/antispam';
import { sendMail, sendAdminNotification } from '~~/server/utils/mail';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (isHoneypotFilled(body)) return { success: true };
  if (await isRateLimited(event, 'price-offer', 5, 3600)) {
    return { success: false, error: 'Príliš veľa požiadaviek. Skúste neskôr.' };
  }

  const { name, email, phone, productId, productName, variantLabel, competitorUrl, gdprConsent } = body;
  if (!name?.trim() || !email?.trim() || !productId || !gdprConsent) {
    return { success: false, error: 'Vyplňte povinné polia.' };
  }

  try {
    await sendMail({
      to: email.trim(),
      subject: `Dopyt na cenovú ponuku – ${productName}`,
      html: `
        <h2 style="font-family:'Space Grotesk',sans-serif;text-transform:uppercase">Dopyt prijatý</h2>
        <p>Dobrý deň <strong>${name}</strong>,</p>
        <p>Váš dopyt na cenovú ponuku pre produkt <strong>${productName}</strong>${variantLabel ? ` (${variantLabel})` : ''} bol prijatý.</p>
        <p>Ozveme sa Vám čo najskôr.</p>
        <p style="color:#666;font-size:13px;margin-top:24px">Tento email bol odoslaný automaticky z SLICKLY</p>
      `,
    });
  } catch (e: any) {
    if (process.dev) console.error('[price-offer] customer mail failed:', e?.message);
  }

  try {
    await sendAdminNotification(
      `Cenový dopyt: ${productName}`,
      `
        <h3>Nový cenový dopyt</h3>
        <table style="border-collapse:collapse;font-size:14px">
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Meno:</td><td>${name}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Email:</td><td>${email}</td></tr>
          ${phone ? `<tr><td style="padding:4px 12px 4px 0;font-weight:bold">Tel.:</td><td>${phone}</td></tr>` : ''}
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Produkt:</td><td>${productName}</td></tr>
          ${variantLabel ? `<tr><td style="padding:4px 12px 4px 0;font-weight:bold">Variant:</td><td>${variantLabel}</td></tr>` : ''}
          ${competitorUrl ? `<tr><td style="padding:4px 12px 4px 0;font-weight:bold">Lepšia cena:</td><td><a href="${competitorUrl}">${competitorUrl}</a></td></tr>` : ''}
        </table>
        <p style="margin-top:16px;color:#666">Odpíšte priamo na tento email — odpoveď pôjde zákazníkovi.</p>
      `,
      email.trim(),
    );
  } catch (e: any) {
    if (process.dev) console.error('[price-offer] admin mail failed:', e?.message);
  }

  return { success: true };
});
