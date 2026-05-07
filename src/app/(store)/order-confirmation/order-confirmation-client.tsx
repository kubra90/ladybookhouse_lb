"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";

type Status = "loading" | "success" | "error";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const paypalOrderId = searchParams.get("token");
  const { clearCart } = useCart();

  const [status, setStatus] = useState<Status>(
    paypalOrderId ? "loading" : "success"
  );
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const captureStarted = useRef(false);

  useEffect(() => {
    if (!paypalOrderId) return;
    if (captureStarted.current) return;
    captureStarted.current = true;

    (async () => {
      try {
        const res = await fetch("/api/paypal/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: paypalOrderId }),
        });
        const data = (await res.json()) as { orderId?: string; error?: string };
        if (!res.ok || !data.orderId) {
          setStatus("error");
          return;
        }
        setConfirmedOrderId(data.orderId);
        setStatus("success");
        clearCart();
      } catch {
        setStatus("error");
      }
    })();
  }, [paypalOrderId, clearCart]);

  if (status === "loading") {
    return (
      <div className="container py-20 text-center">
        <div className="mx-auto max-w-md space-y-6">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-warm-olive" />
          <h1 className="font-heading text-2xl font-bold">
            Confirming your order…
          </h1>
          <p className="text-muted-foreground">
            Please wait while we finalize your payment with PayPal.
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="container py-20 text-center">
        <div className="mx-auto max-w-md space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="font-heading text-3xl font-bold">
            We couldn&apos;t confirm your order
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Something went wrong while finalizing your payment. If you were
            charged, please contact us and we&apos;ll sort it out right away.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link href="/contact">
              <Button size="lg">Contact Us</Button>
            </Link>
            <Link href="/cart">
              <Button variant="outline" size="lg">
                Return to Cart
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const orderRef = confirmedOrderId ?? paypalOrderId;

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

        {orderRef && (
          <p className="text-xs text-muted-foreground">
            Order reference:{" "}
            <span className="font-mono">
              LBH-{orderRef.slice(-8).toUpperCase()}
            </span>
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
