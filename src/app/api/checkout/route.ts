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

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
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
