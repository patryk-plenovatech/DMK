import Link from "next/link";
import { GreenRibbon } from "@/components/GreenRibbon";

const SOCIALS = [
  {
    label: "Instagram",
    handle: "@dmk_apparelll",
    href: "https://instagram.com/dmk_apparelll",
  },
  {
    label: "TikTok",
    handle: "@dmk.apparel7",
    href: "https://tiktok.com/@dmk.apparel7",
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-dmk-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <GreenRibbon size={36} />
            <div>
              <p className="font-display text-2xl tracking-wider">
                DMK APPAREL
              </p>
              <p className="mt-1 text-sm text-foreground/60 max-w-sm">
                Mental strength is trained. Built for everyone using the gym to
                fight for their mental health.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-display text-sm tracking-widest text-foreground/50">
              FOLLOW
            </p>
            {SOCIALS.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-dmk-green transition-colors"
              >
                <span className="font-display text-lg tracking-wider">
                  {s.label}
                </span>
                <span className="ml-3 text-sm text-foreground/50">
                  {s.handle}
                </span>
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <Link
              href="/shop"
              className="font-display tracking-wider hover:text-dmk-green transition-colors"
            >
              SHOP
            </Link>
            <Link
              href="/story"
              className="font-display tracking-wider hover:text-dmk-green transition-colors"
            >
              STORY
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/5 pt-6 text-xs text-foreground/40 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} DMK Apparel. All rights reserved.</p>
          <p>Mental health awareness. Fitness as recovery.</p>
        </div>
      </div>
    </footer>
  );
}
