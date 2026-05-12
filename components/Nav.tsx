"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useState } from "react";
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
            width={56}
            height={36}
            priority
            className="h-9 w-auto"
          />
          <span className="font-display text-xl tracking-wider hidden sm:inline-block">
            DMK APPAREL
          </span>
        </Link>

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
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
