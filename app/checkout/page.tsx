import type { Metadata } from "next";
import { CheckoutClient } from "@/components/CheckoutClient";

export const metadata: Metadata = {
  title: "Cart & Checkout",
  description:
    "Review your DMK Apparel cart, choose delivery or pickup, and pay securely with Stripe.",
};

export default function CheckoutPage() {
  return (
    <div className="bg-grain relative isolate min-h-[80vh] overflow-hidden bg-dmk-black">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(34,197,94,0.10),_transparent_60%)]"
      />
      <CheckoutClient />
    </div>
  );
}
