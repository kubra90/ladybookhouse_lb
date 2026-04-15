import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-warm-cream px-6 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-heading text-4xl font-bold text-primary">404</h1>
        <h2 className="font-heading text-2xl font-semibold">
          This page has wandered off the shelf
        </h2>
        <p className="font-serif text-muted-foreground leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist — it may have
          moved, sold out, or never been here at all. Let&apos;s get you back to
          the books.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href="/books">
            <Button size="lg">Browse Books</Button>
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
