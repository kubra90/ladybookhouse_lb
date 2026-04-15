import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { markSold, isConfigured } from "@/lib/aob-client";
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

    // Log the completed order
    console.log("Order completed:", {
      sessionId: session.id,
      customerEmail: session.customer_details?.email,
      amountTotal: session.amount_total,
      bookIds: session.metadata?.bookIds,
    });

    // Mark books as sold in AoB to remove from all venues
    if (isConfigured() && session.metadata?.bookIds) {
      const bookIds = session.metadata.bookIds.split(",");
      await Promise.all(bookIds.map((id) => markSold(id.trim())));
    }
  }

  return NextResponse.json({ received: true });
}
