"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-warm-cream px-6 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="font-heading text-2xl font-bold">
          Something went wrong
        </h1>
        <p className="font-serif text-muted-foreground leading-relaxed">
          We hit an unexpected error loading this page. Give it another try, or
          head back to the homepage.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground">
            Error reference:{" "}
            <span className="font-mono">{error.digest}</span>
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button size="lg" onClick={() => reset()}>
            Try Again
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
