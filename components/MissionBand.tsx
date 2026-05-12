"use client";

import { motion } from "framer-motion";
import { GreenRibbon } from "@/components/GreenRibbon";

export function MissionBand() {
  return (
    <section className="bg-grain relative border-y border-white/5 bg-[#0d0d0d]">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <GreenRibbon size={56} />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight max-w-3xl"
        >
          Built for everyone using the gym to{" "}
          <span className="text-dmk-green">fight for their mental health.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="max-w-2xl text-foreground/65"
        >
          The green ribbon represents mental health awareness. Every design is
          made for the people who lean on training and movement to keep going.
        </motion.p>
      </div>
    </section>
  );
}
