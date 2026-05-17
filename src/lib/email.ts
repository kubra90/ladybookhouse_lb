import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set. Add it to your .env.local file.");
    }
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

export type OrderEmailItem = {
  title: string;
  sku?: string;
  quantity: number;
  amount: number;
};

export type OrderEmailParams = {
  to: string;
  bcc?: string | string[];
  customerName?: string | null;
  orderId: string;
  items: OrderEmailItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress?: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country?: string | null;
  } | null;
};

const FROM = process.env.RESEND_FROM_EMAIL || "Lady Bookhouse <onboarding@resend.dev>";

function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function buildOrderEmailHtml(p: OrderEmailParams): string {
  const itemsRows = p.items
    .map(
      (it) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #eee;font-family:Georgia,serif;color:#3a2e1f;">
            ${escapeHtml(it.title)}${it.quantity > 1 ? ` × ${it.quantity}` : ""}
            ${it.sku ? `<div style="font-size:12px;color:#9a8a75;margin-top:2px;">SKU: ${escapeHtml(it.sku)}</div>` : ""}
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #eee;text-align:right;font-family:Georgia,serif;color:#3a2e1f;">
            ${formatMoney(it.amount)}
          </td>
        </tr>`
    )
    .join("");

  const addr = p.shippingAddress;
  const addressBlock = addr
    ? `
      <div style="margin-top:24px;padding:16px;background:#faf6ef;border-radius:8px;font-family:Georgia,serif;color:#3a2e1f;">
        <div style="font-weight:600;margin-bottom:8px;">Shipping to</div>
        ${addr.line1 ? `<div>${escapeHtml(addr.line1)}</div>` : ""}
        ${addr.line2 ? `<div>${escapeHtml(addr.line2)}</div>` : ""}
        <div>
          ${[addr.city, addr.state, addr.postal_code].filter((v): v is string => Boolean(v)).map(escapeHtml).join(", ")}
        </div>
        ${addr.country ? `<div>${escapeHtml(addr.country)}</div>` : ""}
      </div>`
    : "";

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f1e7;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f1e7;padding:32px 0;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 16px 32px;text-align:center;background:#ede4d3;">
                <div style="font-family:Georgia,serif;font-size:24px;font-weight:700;color:#7a4a1f;letter-spacing:0.5px;">
                  Lady Bookhouse
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 8px 0;font-family:Georgia,serif;font-size:22px;color:#3a2e1f;">
                  Thank you${p.customerName ? `, ${escapeHtml(p.customerName)}` : ""}!
                </h1>
                <p style="margin:0 0 24px 0;font-family:Georgia,serif;color:#5a4a35;line-height:1.6;">
                  Your order has been received and your payment was successful.
                  We&rsquo;ll pack your books with care and ship them out shortly.
                </p>

                <div style="font-family:Georgia,serif;color:#7a6a55;font-size:13px;margin-bottom:8px;">
                  Order ${escapeHtml(p.orderId)}
                </div>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
                  ${itemsRows}
                  <tr>
                    <td style="padding:12px 0;font-family:Georgia,serif;color:#5a4a35;">Subtotal</td>
                    <td style="padding:12px 0;text-align:right;font-family:Georgia,serif;color:#5a4a35;">${formatMoney(p.subtotal)}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;font-family:Georgia,serif;color:#5a4a35;">Shipping</td>
                    <td style="padding:4px 0;text-align:right;font-family:Georgia,serif;color:#5a4a35;">
                      ${p.shipping === 0 ? "Free" : formatMoney(p.shipping)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0 0 0;border-top:2px solid #3a2e1f;font-family:Georgia,serif;font-weight:700;color:#3a2e1f;">Total</td>
                    <td style="padding:12px 0 0 0;border-top:2px solid #3a2e1f;text-align:right;font-family:Georgia,serif;font-weight:700;color:#3a2e1f;">${formatMoney(p.total)}</td>
                  </tr>
                </table>

                ${addressBlock}

                <p style="margin:32px 0 0 0;font-family:Georgia,serif;color:#7a6a55;font-size:13px;line-height:1.6;">
                  Questions? Reply to this email and we&rsquo;ll get back to you.
                  <br />
                  &mdash; Lady Bookhouse
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendOrderConfirmationEmail(params: OrderEmailParams) {
  const html = buildOrderEmailHtml(params);
  const subject = `Order Confirmed · Lady Bookhouse`;
  const result = await getResend().emails.send({
    from: FROM,
    to: params.to,
    ...(params.bcc ? { bcc: params.bcc } : {}),
    subject,
    html,
  });
  return result;
}

export type ContactEmailParams = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const CONTACT_FROM =
  process.env.CONTACT_FROM_EMAIL || "Lady Bookhouse Contact <contact@theladybookhouse.com>";
const CONTACT_TO = process.env.CONTACT_TO_EMAIL || "info@theladybookhouse.com";

function buildContactEmailHtml(p: ContactEmailParams): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f1e7;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f1e7;padding:32px 0;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:24px 32px;background:#ede4d3;font-family:Georgia,serif;font-size:18px;font-weight:700;color:#7a4a1f;">
                New contact form message
              </td>
            </tr>
            <tr>
              <td style="padding:32px;font-family:Georgia,serif;color:#3a2e1f;line-height:1.6;">
                <div style="margin-bottom:8px;"><strong>From:</strong> ${escapeHtml(p.name)} &lt;${escapeHtml(p.email)}&gt;</div>
                <div style="margin-bottom:24px;"><strong>Subject:</strong> ${escapeHtml(p.subject)}</div>
                <div style="padding:16px;background:#faf6ef;border-radius:8px;white-space:pre-wrap;">${escapeHtml(p.message)}</div>
                <p style="margin-top:24px;color:#7a6a55;font-size:13px;">
                  Reply to this email to respond directly to ${escapeHtml(p.name)}.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendContactEmail(params: ContactEmailParams) {
  const html = buildContactEmailHtml(params);
  const subject = `[Contact] ${params.subject}`;
  const result = await getResend().emails.send({
    from: CONTACT_FROM,
    to: CONTACT_TO,
    replyTo: params.email,
    subject,
    html,
  });
  return result;
}

export type NewsletterFrequency = "weekly" | "monthly";

export type NewsletterSignupParams = {
  email: string;
  frequency: NewsletterFrequency;
};

const FREQUENCY_LABEL: Record<NewsletterFrequency, string> = {
  weekly: "Weekly digest",
  monthly: "Monthly roundup",
};

function audienceIdFor(frequency: NewsletterFrequency): string | null {
  const id =
    frequency === "weekly"
      ? process.env.NEWSLETTER_AUDIENCE_WEEKLY_ID
      : process.env.NEWSLETTER_AUDIENCE_MONTHLY_ID;
  return id && id.trim().length > 0 ? id.trim() : null;
}

export async function addNewsletterContact(params: NewsletterSignupParams) {
  const audienceId = audienceIdFor(params.frequency);
  if (!audienceId) return { skipped: true as const };
  const result = await getResend().contacts.create({
    email: params.email,
    unsubscribed: false,
    audienceId,
  });
  return { skipped: false as const, result };
}

const STORE_URL = (
  process.env.STORE_URL || "https://theladybookhouse.com"
).replace(/\/+$/, "");

export async function sendNewsletterWelcomeEmail(
  params: NewsletterSignupParams
) {
  const cadenceWord = params.frequency === "weekly" ? "weekly" : "monthly";
  const cadenceLabel =
    params.frequency === "weekly" ? "weekly digest" : "monthly roundup";
  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f1e7;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f1e7;padding:32px 0;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 16px 32px;text-align:center;background:#ede4d3;">
                <div style="font-family:Georgia,serif;font-size:24px;font-weight:700;color:#7a4a1f;letter-spacing:0.5px;">
                  Welcome to Lady Bookhouse
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;font-family:Georgia,serif;color:#3a2e1f;line-height:1.6;">
                <p style="margin:0 0 16px 0;">Hi there,</p>
                <p style="margin:0 0 16px 0;">
                  Thank you for joining us &mdash; you&rsquo;ll get our
                  <strong>${cadenceLabel}</strong> of newly listed books,
                  hand-picked from this ${cadenceWord}&rsquo;s arrivals.
                </p>
                <p style="margin:0 0 24px 0;">
                  While you wait for your first issue, you&rsquo;re always
                  welcome to browse our shelves.
                </p>
                <div style="text-align:center;margin:32px 0;">
                  <a href="${STORE_URL}/books"
                     style="display:inline-block;padding:12px 28px;background:#7a4a1f;color:#ffffff;text-decoration:none;border-radius:6px;font-family:Georgia,serif;font-weight:600;">
                    Browse Books
                  </a>
                </div>
                <p style="margin:0 0 0 0;">
                  With love,<br />
                  Lady Bookhouse
                </p>
                <p style="margin:32px 0 0 0;color:#7a6a55;font-size:12px;line-height:1.6;">
                  Don&rsquo;t want these emails? Just reply with
                  &ldquo;unsubscribe&rdquo; and we&rsquo;ll take you off the
                  list.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
  const subject = "Welcome to Lady Bookhouse — you're on the list";
  const result = await getResend().emails.send({
    from: FROM,
    to: params.email,
    subject,
    html,
  });
  return result;
}

export async function sendNewsletterSignupNotification(
  params: NewsletterSignupParams
) {
  const subject = `[Newsletter] New signup (${FREQUENCY_LABEL[params.frequency]})`;
  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f1e7;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f1e7;padding:32px 0;">
      <tr>
        <td align="center">
          <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:24px 32px;background:#ede4d3;font-family:Georgia,serif;font-size:18px;font-weight:700;color:#7a4a1f;">
                New newsletter signup
              </td>
            </tr>
            <tr>
              <td style="padding:32px;font-family:Georgia,serif;color:#3a2e1f;line-height:1.6;">
                <div style="margin-bottom:8px;"><strong>Email:</strong> ${escapeHtml(params.email)}</div>
                <div><strong>Frequency:</strong> ${escapeHtml(FREQUENCY_LABEL[params.frequency])}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
  const result = await getResend().emails.send({
    from: CONTACT_FROM,
    to: CONTACT_TO,
    replyTo: params.email,
    subject,
    html,
  });
  return result;
}
