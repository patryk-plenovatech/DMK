// Server-only Stripe client.
//
// The secret key (STRIPE_SECRET_KEY) must NEVER be exposed to the browser, so
// this module is only ever imported from server code (Server Actions / Route
// Handlers). We initialise lazily so the app still builds and runs before the
// key has been added — the error only surfaces when someone actually tries to
// pay without a key configured.
import Stripe from "stripe";

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (cached) return cached;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local for local dev " +
        "(or to your Vercel project's Environment Variables in production).",
    );
  }

  cached = new Stripe(key);
  return cached;
}

/** True once a Stripe secret key is present in the environment. */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
