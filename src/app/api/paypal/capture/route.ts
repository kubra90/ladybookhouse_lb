import { NextResponse } from "next/server";
import { capturePayPalOrder, getPayPalOrder } from "@/lib/paypal";
import { sendOrderConfirmationEmail } from "@/lib/email";

export const runtime = "edge";

async function runSideEffects(orderId: string): Promise<void> {
  // Re-fetch the order — capture response strips items/breakdown
  const order = await getPayPalOrder(orderId);
  const unit = order.purchase_units?.[0];

  const payerEmail = order.payer?.email_address;
  const isSandbox = process.env.PAYPAL_ENVIRONMENT !== "live";
  const customerEmail =
    isSandbox && process.env.TEST_ORDER_EMAIL
      ? process.env.TEST_ORDER_EMAIL
      : payerEmail;

  const tasks: Promise<unknown>[] = [];

  if (customerEmail && process.env.RESEND_API_KEY) {
    const items =
      unit?.items?.map((i) => {
        const qty = parseInt(i.quantity, 10) || 1;
        const unitDollars = parseFloat(i.unit_amount?.value ?? "0");
        return {
          title: i.name,
          sku: i.sku || undefined,
          quantity: qty,
          amount: Math.round(unitDollars * qty * 100),
        };
      }) ?? [];

    const totalDollars = parseFloat(unit?.amount?.value ?? "0");
    const shippingDollars = parseFloat(
      unit?.amount?.breakdown?.shipping?.value ?? "0"
    );
    const subtotalDollars = parseFloat(
      unit?.amount?.breakdown?.item_total?.value ?? "0"
    );

    const total = Math.round(totalDollars * 100);
    const shipping = Math.round(shippingDollars * 100);
    const subtotal = Math.round(subtotalDollars * 100);

    const addr = unit?.shipping?.address;
    const shippingAddress = addr
      ? {
          line1: addr.address_line_1 ?? null,
          line2: addr.address_line_2 ?? null,
          city: addr.admin_area_2 ?? null,
          state: addr.admin_area_1 ?? null,
          postal_code: addr.postal_code ?? null,
          country: addr.country_code ?? null,
        }
      : null;

    const payerFullName =
      [order.payer?.name?.given_name, order.payer?.name?.surname]
        .filter(Boolean)
        .join(" ") || null;
    const fullName = unit?.shipping?.name?.full_name ?? payerFullName;

    // BCC the seller on the customer receipt so they can see new orders.
    // Skip if it would just dupe the recipient (sandbox: TEST_ORDER_EMAIL is
    // often the same inbox).
    const sellerEmail =
      process.env.SELLER_NOTIFICATION_EMAIL || "info@theladybookhouse.com";
    const bcc =
      sellerEmail && sellerEmail !== customerEmail ? sellerEmail : undefined;

    tasks.push(
      sendOrderConfirmationEmail({
        to: customerEmail,
        bcc,
        customerName: fullName,
        orderId: `LBH-${order.id.slice(-8).toUpperCase()}`,
        items,
        subtotal,
        shipping,
        total,
        shippingAddress,
      }).catch((err) =>
        console.error("sendOrderConfirmationEmail failed:", err)
      )
    );
  }

  await Promise.all(tasks);
}

export async function POST(request: Request) {
  try {
    const { orderId } = (await request.json()) as { orderId?: string };
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const captured = await capturePayPalOrder(orderId);

    // Await side effects so they actually run on Cloudflare Workers — fire-and-forget
    // gets killed when the Response returns. The client is already on a loading
    // spinner, so the extra ~1s is fine. Errors are caught so a failed email
    // doesn't break the customer's confirmation page.
    await runSideEffects(orderId).catch((err) =>
      console.error("Order side effects failed:", err)
    );

    return NextResponse.json({
      orderId: captured.id,
      status: captured.status,
    });
  } catch (error) {
    console.error("PayPal capture error:", error);
    return NextResponse.json(
      { error: "Failed to capture PayPal order" },
      { status: 500 }
    );
  }
}
