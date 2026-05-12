"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="bg-grain relative isolate overflow-hidden bg-dmk-black">
      {/* Background gradient */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(34,197,94,0.10),_transparent_60%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dmk-green/60 to-transparent"
      />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 sm:px-6 lg:px-8 py-24 sm:py-32 md:py-40 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Image
            src="/brand/logo-silver.png"
            alt="DMK Apparel crest"
            width={520}
            height={340}
            priority
            className="mx-auto h-auto w-44 sm:w-56 md:w-64"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="font-display mt-8 text-5xl sm:text-6xl md:text-7xl lg:text-[8rem] leading-[0.95] tracking-tight"
        >
          MENTAL STRENGTH
          <br />
          <span className="green-underline">IS TRAINED.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          className="mt-6 max-w-xl text-base sm:text-lg text-foreground/70"
        >
          Streetwear built for everyone using the gym to fight for their mental
          health. Hoodies, tees, and trucker hats from DMK.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.45 }}
          className="mt-10"
        >
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 rounded-md bg-dmk-green px-7 py-4 font-display text-lg tracking-widest text-dmk-black transition-all hover:bg-dmk-green-dark hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-10px_rgba(34,197,94,0.6)]"
          >
            SHOP THE DROP
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
