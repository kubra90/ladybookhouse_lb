"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterSignup() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !EMAIL_RE.test(trimmed)) {
      setEmailError("Please enter a valid email");
      return;
    }
    setEmailError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          website: honeypot,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        toast({
          title: "Couldn't sign you up",
          description:
            data.error || "Something went wrong. Please try again in a moment.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "You're on the list!",
        description: "We'll send you our monthly roundup of new arrivals.",
      });
      setEmail("");
    } catch {
      toast({
        title: "Couldn't sign you up",
        description: "Network error. Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="newsletter" className="bg-background border-y scroll-mt-20">
      <div className="container py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center space-y-5">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h2 className="font-heading text-2xl font-bold md:text-3xl">
              Don&apos;t miss a good book
            </h2>
            <p className="font-serif text-muted-foreground leading-relaxed">
              Get our hand picked new arrivals once a month.
              No spam, just stories. Unsubscribe anytime.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-md space-y-4 text-left"
            noValidate
          >
            <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="newsletter-website">Website</label>
              <input
                id="newsletter-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="newsletter-email"
                className="text-sm font-medium mb-1.5 block"
              >
                Email
              </label>
              <Input
                id="newsletter-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                className={emailError ? "border-destructive" : ""}
                autoComplete="email"
              />
              {emailError && (
                <p className="text-xs text-destructive mt-1">{emailError}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full font-medium"
              disabled={submitting}
            >
              {submitting ? "Signing you up..." : "Sign me up"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
