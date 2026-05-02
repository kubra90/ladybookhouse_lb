import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { markSold, isConfigured } from "@/lib/aob-client";
import { sendOrderConfirmationEmail } from "@/lib/email";
import Stripe from "stripe";

export const runtime = "edge";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = await getStripe().webhooks.constructEventAsync(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook error: ${message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("Order completed:", {
      sessionId: session.id,
      customerEmail: session.customer_details?.email,
      amountTotal: session.amount_total,
      bookIds: session.metadata?.bookIds,
    });

    if (isConfigured() && session.metadata?.bookIds) {
      const bookIds = session.metadata.bookIds.split(",");
      await Promise.all(bookIds.map((id) => markSold(id.trim())));
    }

    const customerEmail = session.customer_details?.email;
    if (customerEmail && process.env.RESEND_API_KEY) {
      try {
        const lineItems = await getStripe().checkout.sessions.listLineItems(
          session.id,
          { limit: 100 }
        );
        const items = lineItems.data.map((li) => ({
          title: li.description || "Book",
          quantity: li.quantity ?? 1,
          amount: li.amount_total,
        }));
        const total = session.amount_total ?? 0;
        const shipping = session.shipping_cost?.amount_total ?? 0;
        const subtotal = total - shipping;

        await sendOrderConfirmationEmail({
          to: customerEmail,
          customerName: session.customer_details?.name ?? null,
          orderId: `LBH-${session.id.slice(-8).toUpperCase()}`,
          items,
          subtotal,
          shipping,
          total,
          shippingAddress:
            session.collected_information?.shipping_details?.address ?? null,
        });
      } catch (err) {
        console.error("Failed to send order confirmation email:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
