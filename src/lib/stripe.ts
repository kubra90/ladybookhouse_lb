// Stripe server-side client
//
// To get your Stripe keys:
// 1. Go to https://dashboard.stripe.com/test/apikeys
// 2. Copy your "Secret key" (starts with sk_test_) → STRIPE_SECRET_KEY
// 3. Copy your "Publishable key" (starts with pk_test_) → NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
// 4. For webhooks, run `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
//    and copy the webhook signing secret → STRIPE_WEBHOOK_SECRET

import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error(
        "STRIPE_SECRET_KEY is not set. Add it to your .env.local file."
      );
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-04-10",
      typescript: true,
    });
  }
  return _stripe;
}
