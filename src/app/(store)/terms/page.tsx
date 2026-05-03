import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that apply when you use theladybookhouse.com or buy from our store.",
};

export default function TermsPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-3xl font-bold md:text-4xl mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: May 2, 2026
        </p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <p>
              Welcome to Lady Bookhouse. By using theladybookhouse.com or
              placing an order with us, you agree to these terms. Please read
              them before using the site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              About us
            </h2>
            <p>
              Lady Bookhouse is an independent online bookstore based in the
              United States, selling new and used books.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Orders and pricing
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                All prices are listed in U.S. dollars and may change without
                notice.
              </li>
              <li>
                We reserve the right to refuse or cancel any order, including
                orders where a book has sold out, where pricing or product
                information is inaccurate, or where we suspect fraud.
              </li>
              <li>
                If we cancel your order after you&rsquo;ve been charged,
                you&rsquo;ll receive a full refund to your original payment
                method.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Payment
            </h2>
            <p>
              Payments are processed by Stripe. By placing an order you confirm
              that the payment information you provide is yours and is accurate.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Book condition
            </h2>
            <p>
              We carry both new and used books. Used books are inspected and
              graded honestly. Minor signs of previous ownership (light wear,
              shelf marks, occasional notes or stamps) may be present on used
              copies and are not considered defects.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Shipping and returns
            </h2>
            <p>
              Shipping details are described in our{" "}
              <a href="/shipping" className="text-primary hover:underline">
                Shipping Policy
              </a>
              . Returns and refunds are governed by our{" "}
              <a href="/refunds" className="text-primary hover:underline">
                Refund Policy
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Use of the site
            </h2>
            <p>
              You agree not to misuse the site &mdash; for example, by
              attempting to gain unauthorized access, scraping content at scale,
              interfering with other users, or using the site for any unlawful
              purpose.
            </p>
            <p>
              All site content (text, graphics, logos, layout) is the property
              of Lady Bookhouse or its licensors and may not be reproduced
              without permission.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Disclaimer and limitation of liability
            </h2>
            <p>
              The site and the products are provided &ldquo;as is&rdquo;. To the
              fullest extent permitted by law, Lady Bookhouse is not liable for
              indirect, incidental, or consequential damages arising from your
              use of the site or any product purchased. Our total liability for
              any order will not exceed the amount you paid for that order.
            </p>
            <p>
              Nothing in these terms limits any rights you have under applicable
              consumer protection law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Governing law
            </h2>
            <p>
              These terms are governed by the laws of the United States and the
              state in which Lady Bookhouse is established, without regard to
              conflict-of-law principles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Changes to these terms
            </h2>
            <p>
              We may update these terms from time to time. The &ldquo;Last
              updated&rdquo; date at the top will reflect any changes. Continued
              use of the site after a change means you accept the updated
              terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Contact
            </h2>
            <p>
              Questions? Email{" "}
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
