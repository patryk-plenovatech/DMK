import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GreenRibbon } from "@/components/GreenRibbon";

export const metadata: Metadata = {
  title: "Checkout — Coming Soon",
  description:
    "DMK Apparel checkout launches soon. In the meantime, DM us on Instagram or TikTok to place an order.",
};

// Inline brand glyphs — lucide-react has dropped brand icons.
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.81a8.16 8.16 0 0 0 4.77 1.52V6.88a4.85 4.85 0 0 1-1.84-.19z" />
    </svg>
  );
}

export default function CheckoutPage() {
  return (
    <div className="bg-grain relative isolate min-h-[80vh] overflow-hidden bg-dmk-black">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(34,197,94,0.12),_transparent_60%)]"
      />
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center">
        <Image
          src="/brand/logo-silver.png"
          alt="DMK Apparel"
          width={520}
          height={340}
          priority
          className="h-auto w-36 sm:w-44"
        />

        <div className="mt-10">
          <GreenRibbon size={32} className="mx-auto" />
        </div>

        <h1 className="font-display mt-6 text-5xl sm:text-6xl md:text-7xl tracking-tight leading-[0.95]">
          CHECKOUT
          <br />
          <span className="green-underline">COMING SOON.</span>
        </h1>

        <p className="mt-6 max-w-lg text-foreground/70 text-lg">
          We're finalizing our store. To order now, DM us on Instagram or
          TikTok.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="https://instagram.com/dmk_apparelll"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-3 rounded-md bg-dmk-green px-7 py-4 font-display text-lg tracking-widest text-dmk-black transition-all hover:bg-dmk-green-dark hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-10px_rgba(34,197,94,0.6)]"
          >
            <InstagramIcon className="h-5 w-5" />
            <span>@DMK_APPARELLL</span>
          </Link>

          <Link
            href="https://tiktok.com/@dmk.apparel7"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-3 rounded-md border border-white/15 bg-white/[0.02] px-7 py-4 font-display text-lg tracking-widest text-foreground transition-all hover:border-dmk-green/60 hover:text-dmk-green hover:-translate-y-0.5"
          >
            <TikTokIcon className="h-5 w-5" />
            <span>@DMK.APPAREL7</span>
          </Link>
        </div>

        <p className="mt-16 text-xs tracking-widest text-foreground/40">
          NO PAYMENT IS BEING TAKEN ON THIS PAGE.
        </p>
      </div>
    </div>
  );
}
