import type { Metadata } from "next";
import { BookOpen, Truck, ShieldCheck, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Lady Bookhouse — our curated non-fiction collection, fast shipping, and commitment to pristine condition.",
};

const storefronts = [
  {
    name: "AbeBooks",
    href: "https://www.abebooks.com/book-search/vi/86527136/",
    description: "Used books & more",
  },
  {
    name: "eBay",
    href: "https://www.ebay.com/str/ladybookhouse",
    description: "Deals & everyday reads",
  },
  {
    name: "Alibris",
    href: "https://www.alibris.com/stores/lady0520",
    description: "Independent bookseller marketplace",
  },
];

const values = [
  {
    icon: BookOpen,
    title: "Curated Collection",
    description:
      "Every book is hand-selected for quality and relevance. From social sciences to cooking, we stock titles that inform and inspire.",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    description:
      "Because the joy of a new book shouldn't be kept waiting. We ship quickly so your next read arrives as soon as possible.",
  },
  {
    icon: ShieldCheck,
    title: "Pristine Condition",
    description:
      "Each book is carefully inspected and honestly graded. What you see is what you get — no surprises.",
  },
];

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-16">
      {/* Hero section */}
      <div className="mx-auto max-w-2xl text-center mb-16">
        <h1 className="font-heading text-3xl font-bold md:text-4xl mb-6">
          About Lady Bookhouse
        </h1>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            At Lady Bookhouse, we believe every reader deserves their perfect
            next book. Our collection focuses primarily on non-fiction titles
            that inform, inspire, and enrich — from social sciences and
            psychology to design, art, natural sciences, and cooking.
          </p>
          <p>
            We also carry carefully selected fiction, children&apos;s books, and
            bestselling titles to round out our offerings. Whether you&apos;re
            deepening your knowledge, exploring a new interest, or searching for
            that perfect gift, we stock quality books from renowned authors
            worldwide.
          </p>
          <p>
            And because we know the joy of a new book shouldn&apos;t be kept
            waiting, we&apos;re committed to fast shipping and pristine
            condition with every order.
          </p>
        </div>
      </div>

      {/* Why buy from us */}
      <section className="mb-16">
        <h2 className="font-heading text-2xl font-bold text-center mb-10">
          Why Buy From Us
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {values.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border bg-warm-sand/30 p-6 text-center space-y-3"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Also find us on */}
      <section>
        <h2 className="font-heading text-2xl font-bold text-center mb-10">
          Also Find Us On
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {storefronts.map((store) => (
            <a
              key={store.name}
              href={store.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-lg border p-6 text-center space-y-2 transition-colors hover:border-primary/40 hover:bg-warm-sand/30"
            >
              <h3 className="font-heading text-lg font-semibold inline-flex items-center gap-1.5">
                {store.name}
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </h3>
              <p className="text-sm text-muted-foreground">
                {store.description}
              </p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
