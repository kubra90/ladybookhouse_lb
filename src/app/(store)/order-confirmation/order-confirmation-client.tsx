"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();

  useEffect(() => {
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div className="container py-20 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warm-olive/10">
          <CheckCircle className="h-10 w-10 text-warm-olive" />
        </div>

        <h1 className="font-heading text-3xl font-bold">
          Thank you for your order!
        </h1>

        <p className="text-muted-foreground leading-relaxed">
          Your order has been received and is being prepared with care.
          You&apos;ll receive a confirmation email shortly with your order
          details and tracking information.
        </p>

        {sessionId && (
          <p className="text-xs text-muted-foreground">
            Order reference:{" "}
            <span className="font-mono">{sessionId.slice(-8)}</span>
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href="/books">
            <Button size="lg">Continue Browsing</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationClient() {
  return (
    <Suspense>
      <OrderConfirmationContent />
    </Suspense>
  );
}
