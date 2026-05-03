import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Lady Bookhouse return and refund policy — when returns are accepted and how refunds are processed.",
};

export default function RefundsPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-3xl font-bold md:text-4xl mb-2">
          Refund Policy
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: May 2, 2026
        </p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <p>
              We want you to be happy with every order. If something
              isn&rsquo;t right, please reach out within 14 days of receiving
              your book and we&rsquo;ll do our best to make it right.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              When we accept returns
            </h2>
            <p>You may return a book if:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                The book arrived damaged in transit, or with a defect not
                disclosed in its listing
              </li>
              <li>
                The book is materially different from how it was described (e.g.
                wrong edition, wrong title, condition graded inaccurately)
              </li>
              <li>You received the wrong book</li>
            </ul>
            <p>
              In each of these cases, please email us within 14 days of delivery
              with your order number and a photo of the issue.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              When we cannot accept returns
            </h2>
            <p>
              Because we sell many used and one-of-a-kind copies, we generally
              cannot accept returns for:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Buyer&rsquo;s remorse or change of mind</li>
              <li>
                Used books with normal wear that was disclosed in the condition
                grade
              </li>
              <li>
                Books returned more than 14 days after delivery, or returned
                without contacting us first
              </li>
              <li>Books damaged after delivery</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              How to start a return
            </h2>
            <ol className="list-decimal pl-6 space-y-1">
              <li>
                Email{" "}
                <a
                  href="mailto:info@theladybookhouse.com"
                  className="text-primary hover:underline"
                >
                  info@theladybookhouse.com
                </a>{" "}
                with your order number, the book title, and a brief description
                (with photos for damaged or misdescribed books).
              </li>
              <li>
                We&rsquo;ll reply within 2 business days with next steps,
                including a return address if a return is needed.
              </li>
              <li>
                For returns we&rsquo;ve approved, please ship the book back in
                packaging that protects it during transit. Keep your tracking
                number.
              </li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Refunds
            </h2>
            <p>
              Once we receive and inspect the returned book, we&rsquo;ll issue
              your refund to the original payment method within 5 business days.
              Your bank may take a few additional days to post the refund.
            </p>
            <p>
              If the return is because of an error on our part (damaged in
              transit, wrong book, misdescribed), we&rsquo;ll refund the
              original shipping cost and cover return shipping. Otherwise return
              shipping is the buyer&rsquo;s responsibility, and the original
              shipping cost is non-refundable.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Lost or undelivered packages
            </h2>
            <p>
              If your tracking shows delivered but you haven&rsquo;t received
              the package, please check with neighbors and your local carrier
              first. If it&rsquo;s still missing, email us &mdash; we&rsquo;ll
              help you file a claim with the carrier and figure out next steps.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Contact
            </h2>
            <p>
              Questions about a return? Email{" "}
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
