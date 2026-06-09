"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/story", label: "Story" },
];

function CartButton({ onNavigate }: { onNavigate?: () => void }) {
  const { count, ready } = useCart();
  return (
    <Link
      href="/checkout"
      onClick={onNavigate}
      aria-label={`Cart${ready && count ? ` (${count})` : ""}`}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-foreground/80 hover:text-dmk-green hover:border-dmk-green/40 transition-colors"
    >
      <ShoppingBag className="h-5 w-5" />
      {ready && count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-dmk-green px-1 font-display text-xs leading-none text-dmk-black">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-dmk-black/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="DMK Apparel — home"
          className="flex items-center gap-3"
        >
          <Image
            src="/brand/logo-silver.png"
            alt="DMK Apparel"
            width={414}
            height={289}
            priority
            className="h-9 w-auto"
          />
          <span className="font-display text-xl tracking-wider hidden sm:inline-block">
            DMK APPAREL
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden md:flex items-center gap-8">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-display text-lg tracking-wide text-foreground/80 hover:text-dmk-green transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <CartButton />

          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                aria-label="Open menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-foreground/80 hover:text-dmk-green hover:border-dmk-green/40 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-dmk-black border-l border-white/10"
              >
                <SheetHeader>
                  <SheetTitle className="font-display text-2xl tracking-wider">
                    DMK APPAREL
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-6 px-6 pt-2">
                  {LINKS.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="font-display text-2xl tracking-wider text-foreground hover:text-dmk-green transition-colors"
                    >
                      {l.label}
                    </Link>
                  ))}
                  <Link
                    href="/checkout"
                    onClick={() => setOpen(false)}
                    className="font-display text-2xl tracking-wider text-foreground hover:text-dmk-green transition-colors"
                  >
                    Cart
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
