import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Lady Bookhouse collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-3xl font-bold md:text-4xl mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: May 2, 2026
        </p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <p>
              Lady Bookhouse (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates
              theladybookhouse.com. This policy explains what information we
              collect when you visit or buy from our store, how we use it, and
              the choices you have.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Information we collect
            </h2>
            <p>When you place an order, we collect:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your name and email address</li>
              <li>Your shipping address</li>
              <li>The items you purchased and the order total</li>
            </ul>
            <p>
              We do <strong>not</strong> collect or store your payment card
              details. All payments are processed directly by Stripe; your card
              information goes from your browser to Stripe and never touches our
              servers.
            </p>
            <p>
              When you contact us through the contact form, we receive the name,
              email address, and message you provide.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              How we use your information
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To process and ship your order</li>
              <li>
                To send you transactional emails about your order (confirmation,
                shipping updates)
              </li>
              <li>To respond to questions you send us</li>
              <li>
                To keep records required for tax, accounting, and legal purposes
              </li>
            </ul>
            <p>
              We do not send marketing emails or newsletters. We do not sell,
              rent, or share your personal information with third parties for
              their own marketing.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Service providers we use
            </h2>
            <p>
              To run the store we rely on a small number of trusted services,
              each of which receives only the information needed to do its job:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Stripe</strong> — payment processing
              </li>
              <li>
                <strong>Resend</strong> — sending order confirmation emails
              </li>
              <li>
                <strong>Cloudflare</strong> — website hosting and security
              </li>
            </ul>
            <p>
              Each of these providers has its own privacy policy governing how
              they handle data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Cookies
            </h2>
            <p>
              We use only essential cookies needed to keep your shopping cart
              working and to keep you signed in to the admin area. We do not use
              advertising or tracking cookies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Your rights
            </h2>
            <p>
              You may request a copy of the personal information we hold about
              you, ask us to correct it, or ask us to delete it (subject to
              records we are legally required to keep, such as tax records).
              Email us at{" "}
              <a
                href="mailto:info@theladybookhouse.com"
                className="text-primary hover:underline"
              >
                info@theladybookhouse.com
              </a>{" "}
              to make a request.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Data retention
            </h2>
            <p>
              We keep order records for as long as we are required to for tax
              and accounting purposes. Contact-form messages are kept only as
              long as needed to respond to your question.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Children
            </h2>
            <p>
              Our store is not directed at children under 13, and we do not
              knowingly collect personal information from them.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Changes to this policy
            </h2>
            <p>
              We may update this policy from time to time. The &ldquo;Last
              updated&rdquo; date at the top of this page will reflect any
              changes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Contact
            </h2>
            <p>
              Questions about this policy? Email{" "}
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
