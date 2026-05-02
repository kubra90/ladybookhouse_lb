import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import type { CartItem } from "@/types/book";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { items } = (await request.json()) as { items: CartItem[] };

    // Derive base URL from the incoming request so it works in dev and prod
    const origin = new URL(request.url).origin;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.book.title,
          description: `${item.book.author} — ${item.book.condition} condition`,
          metadata: {
            bookId: item.book.id,
            isbn: item.book.isbn,
          },
        },
        unit_amount: Math.round(item.book.price * 100),
      },
      quantity: item.quantity,
    }));

    const bookIds = items.map((item) => item.book.id).join(",");

    const subtotal = items.reduce(
      (sum, item) => sum + item.book.price * item.quantity,
      0
    );
    const shippingAmount = subtotal >= 35 ? 0 : 499;

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ["US"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: shippingAmount, currency: "usd" },
            display_name:
              shippingAmount === 0 ? "Free shipping" : "Standard shipping",
          },
        },
      ],
      metadata: {
        bookIds,
      },
      success_url: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
