import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { GreenRibbon } from "@/components/GreenRibbon";
import { ClearCart } from "@/components/ClearCart";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Thank you for your DMK Apparel order.",
  robots: { index: false },
};

type SearchParams = Promise<{ session_id?: string }>;

const usd = (cents: number) =>
  (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { session_id } = await searchParams;

  // Best-effort: confirm the payment and pull a few friendly details. If the
  // session can't be read (no key, expired id, etc.) we still thank the buyer.
  let email: string | null = null;
  let amountTotal: number | null = null;
  let paid = false;

  if (session_id && isStripeConfigured()) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(session_id);
      paid = session.payment_status === "paid";
      amountTotal = session.amount_total ?? null;
      email =
        session.customer_details?.email ?? session.customer_email ?? null;
    } catch {
      // ignore — fall back to the generic confirmation
    }
  }

  return (
    <div className="bg-grain relative isolate min-h-[80vh] overflow-hidden bg-dmk-black">
      <ClearCart />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(34,197,94,0.14),_transparent_60%)]"
      />
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
        <CheckCircle2 className="h-16 w-16 text-dmk-green" strokeWidth={1.5} />

        <div className="mt-6">
          <GreenRibbon size={28} />
        </div>

        <h1 className="font-display mt-6 text-5xl sm:text-6xl tracking-tight leading-[0.95]">
          ORDER
          <br />
          <span className="green-underline">CONFIRMED.</span>
        </h1>

        <p className="mt-6 max-w-md text-foreground/70 text-lg">
          {paid
            ? "Your payment went through — thank you for repping the message."
            : "Thank you for your order."}{" "}
          {email
            ? `A receipt is on its way to ${email}.`
            : "A receipt has been emailed to you."}
        </p>

        {amountTotal !== null && (
          <p className="mt-4 font-display text-2xl tracking-wide text-dmk-green">
            Total paid: {usd(amountTotal)}
          </p>
        )}

        <p className="mt-8 max-w-md text-sm text-foreground/50">
          <span className="text-foreground/80">
            We&apos;ll be in contact by email with all your shipping details.
          </span>{" "}
          Questions? DM us on Instagram{" "}
          <span className="text-foreground/70">@dmk_apparelll</span>.
        </p>

        <Link
          href="/shop"
          className="mt-12 inline-flex items-center justify-center gap-2 rounded-md bg-dmk-green px-7 py-4 font-display text-lg tracking-widest text-dmk-black transition-all hover:bg-dmk-green-dark hover:-translate-y-0.5"
        >
          KEEP SHOPPING
        </Link>
      </div>
    </div>
  );
}
