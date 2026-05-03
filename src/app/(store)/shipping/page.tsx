import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "How Lady Bookhouse processes, packs, and ships your order — handling time, rates, and where we ship.",
};

export default function ShippingPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-3xl font-bold md:text-4xl mb-2">
          Shipping Policy
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: May 2, 2026
        </p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <p>
              Every order is packed with care and shipped from the United
              States. Here&rsquo;s what to expect after you place an order.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Where we ship
            </h2>
            <p>
              We currently ship within the United States only. We hope to offer
              international shipping in the future.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Shipping rates
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Orders under $35:</strong> $4.99 flat-rate shipping
              </li>
              <li>
                <strong>Orders $35 and over:</strong> Free shipping
              </li>
            </ul>
            <p>
              Shipping is calculated and shown to you before you complete
              checkout.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Handling time
            </h2>
            <p>
              We aim to pack and ship orders within 1&ndash;2 business days of
              payment. Orders placed on weekends or U.S. holidays will go out
              the next business day.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Delivery time
            </h2>
            <p>
              Once shipped, most orders arrive within 3&ndash;8 business days
              depending on your location and the carrier. These are estimates,
              not guarantees, and delivery times can vary during busy seasons or
              due to carrier delays.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Tracking
            </h2>
            <p>
              When your order ships, we&rsquo;ll send you the tracking number
              by email so you can follow it to your door.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Packaging
            </h2>
            <p>
              Books are wrapped and packed in protective mailers or boxes
              appropriate to their size and condition. We reuse packaging
              materials whenever they&rsquo;re clean and protective &mdash; good
              for your book and good for the planet.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Lost, damaged, or incorrect orders
            </h2>
            <p>
              If your package arrives damaged, is lost in transit, or contains
              the wrong book, please see our{" "}
              <a href="/refunds" className="text-primary hover:underline">
                Refund Policy
              </a>{" "}
              for next steps. We&rsquo;ll work with you to make it right.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Address accuracy
            </h2>
            <p>
              Please double-check your shipping address at checkout. We ship to
              the address Stripe captures during checkout, and we&rsquo;re
              unable to reroute packages once they&rsquo;ve been handed to the
              carrier. If you spot a mistake right after ordering, email us
              within an hour and we&rsquo;ll do our best to catch it before it
              ships.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Contact
            </h2>
            <p>
              Questions about shipping? Email{" "}
              <a
                href="mailto:info@theladybookhouse.com"
                className="text-primary hover:underline"
              >
                info@theladybookhouse.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
