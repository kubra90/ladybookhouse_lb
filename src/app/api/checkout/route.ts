import { NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal";
import type { CartItem } from "@/types/book";

export const runtime = "edge";

function money(n: number): string {
  return n.toFixed(2);
}

export async function POST(request: Request) {
  try {
    const { items } = (await request.json()) as { items: CartItem[] };

    const origin = new URL(request.url).origin;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.book.price * item.quantity,
      0
    );
    const shipping = subtotal >= 35 ? 0 : 4.99;
    const total = subtotal + shipping;

    const paypalItems = items.map((item) => ({
      name: item.book.title.slice(0, 127),
      description: `${item.book.author} — ${item.book.condition} condition`.slice(
        0,
        127
      ),
      sku: item.book.id.slice(0, 127),
      quantity: String(item.quantity),
      unit_amount: {
        currency_code: "USD",
        value: money(item.book.price),
      },
      category: "PHYSICAL_GOODS" as const,
    }));

    const order = await createPayPalOrder({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: money(total),
            breakdown: {
              item_total: { currency_code: "USD", value: money(subtotal) },
              shipping: { currency_code: "USD", value: money(shipping) },
            },
          },
          items: paypalItems,
        },
      ],
      application_context: {
        brand_name: "Lady Bookhouse",
        landing_page: "NO_PREFERENCE",
        shipping_preference: "GET_FROM_FILE",
        user_action: "PAY_NOW",
        return_url: `${origin}/order-confirmation`,
        cancel_url: `${origin}/cart`,
      },
    });

    const approve = order.links.find((l) => l.rel === "approve");
    if (!approve) {
      return NextResponse.json(
        { error: "PayPal did not return an approval URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: approve.href });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
