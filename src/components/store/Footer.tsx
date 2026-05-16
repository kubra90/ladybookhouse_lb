import Link from "next/link";
import { BookOpen, ExternalLink } from "lucide-react";

const storefronts = [
  {
    name: "AbeBooks",
    href: "https://www.abebooks.com/book-search/vi/86527136/",
  },
  {
    name: "eBay",
    href: "https://www.ebay.com/str/ladybookhouse",
  },
  {
    name: "Alibris",
    href: "https://www.alibris.com/stores/lady0520",
  },
];

export default function Footer() {
  return (
    <footer className="border-t bg-warm-sand/50">
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="font-heading text-lg font-semibold text-primary">
                Lady Bookhouse
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Curated books with care, shipped with love. Every book finds its
              reader.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-semibold">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/books"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Browse Books
              </Link>
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/#newsletter"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Newsletter
              </Link>
            </nav>
          </div>

          {/* Policies */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-semibold">Policies</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/shipping"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Shipping
              </Link>
              <Link
                href="/refunds"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Refunds
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </Link>
            </nav>
          </div>

          {/* Other storefronts */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-semibold">
              Also Find Us On
            </h3>
            <nav className="flex flex-col gap-2">
              {storefronts.map((store) => (
                <a
                  key={store.name}
                  href={store.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit Lady Bookhouse on ${store.name} (opens in new tab)`}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {store.name}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Lady Bookhouse. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
