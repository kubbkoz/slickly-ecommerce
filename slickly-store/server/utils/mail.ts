import { createTransport, type Transporter } from 'nodemailer';
import { useRuntimeConfig } from '#imports';

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;
  const config = useRuntimeConfig();
  const host = config.smtpHost as string;
  const port = Number(config.smtpPort) || 587;
  const user = config.smtpUser as string;
  const pass = config.smtpPass as string;

  if (!host || !user || !pass) {
    throw new Error('SMTP not configured (SMTP_HOST/SMTP_USER/SMTP_PASS missing)');
  }

  transporter = createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return transporter;
}

interface MailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendMail(opts: MailOptions): Promise<void> {
  const config = useRuntimeConfig();
  const from = (config.smtpFrom as string) || 'info@mtsport.sk';
  try {
    const transport = getTransporter();
    await transport.sendMail({
      from: `"SLICKLY" <${from}>`,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
    });
  } catch (e: any) {
    // Auth error → invalidate cached transporter so next call re-creates
    if (e?.message?.includes('authentication') || e?.responseCode === 535) {
      transporter = null;
    }
    throw e;
  }
}

export async function sendAdminNotification(subject: string, html: string, replyTo?: string): Promise<void> {
  await sendMail({
    to: 'jakub@mt-sport.sk',
    subject: `[SLICKLY] ${subject}`,
    html,
    replyTo,
  });
}
