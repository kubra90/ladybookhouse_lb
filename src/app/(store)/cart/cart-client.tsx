"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";

export default function CartClient() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } =
    useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  async function handleCheckout() {
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
        setIsCheckingOut(false);
      }
    } catch {
      alert("Something went wrong. Please try again.");
      setIsCheckingOut(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <div className="mx-auto max-w-md space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="font-heading text-2xl font-bold">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground">
            Looks like you haven&apos;t added any books yet. Browse our
            collection and find your next great read.
          </p>
          <Link href="/books">
            <Button size="lg" className="mt-2">
              Browse Books
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const shipping = totalPrice >= 35 ? 0 : 4.99;
  const orderTotal = totalPrice + shipping;

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">Shopping Cart</h1>
        <Button variant="ghost" size="sm" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Cart items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div
              key={item.book.id}
              className="flex gap-4 rounded-lg border bg-card p-4"
            >
              {/* Book thumbnail */}
              <div className="relative h-24 w-16 shrink-0 rounded bg-warm-sand overflow-hidden">
                {item.book.imageUrl ? (
                  <Image
                    src={item.book.imageUrl}
                    alt={`${item.book.title} cover`}
                    fill
                    sizes="64px"
                    className="object-contain p-0.5"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-[8px] text-muted-foreground text-center leading-tight px-1">
                      {item.book.title}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div>
                  <Link
                    href={`/books/${item.book.id}`}
                    className="font-heading text-sm font-semibold hover:text-primary transition-colors line-clamp-1"
                  >
                    {item.book.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {item.book.author}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2">
                  {/* Quantity controls */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() =>
                        updateQuantity(item.book.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() =>
                        updateQuantity(item.book.id, item.quantity + 1)
                      }
                      disabled={item.quantity >= 5}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Price + remove */}
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-primary">
                      ${(item.book.price * item.quantity).toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.book.id)}
                      aria-label={`Remove ${item.book.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        {/* Order summary */}
        <div className="lg:w-80">
          <div className="rounded-lg border bg-card p-6 space-y-4 lg:sticky lg:top-24">
            <h2 className="font-heading text-lg font-semibold">
              Order Summary
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-warm-olive font-medium">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Free shipping on orders over $35
                </p>
              )}
              <div className="border-t pt-2 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span className="text-primary">${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isCheckingOut ? "Redirecting..." : "Proceed to Checkout"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
