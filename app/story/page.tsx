import type { Metadata } from "next";
import { GreenRibbon } from "@/components/GreenRibbon";

export const metadata: Metadata = {
  title: "Story",
  description:
    "How DMK Apparel started — built out of recovery from severe anxiety and dissociation, fueled by training and movement.",
};

export default function StoryPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <header className="mb-12 text-center">
        <div className="flex justify-center">
          <GreenRibbon size={56} />
        </div>
        <p className="font-display text-sm tracking-[0.3em] text-dmk-green mt-6">
          THE STORY
        </p>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl tracking-tight mt-3">
          WHY DMK EXISTS
        </h1>
      </header>

      <section className="space-y-6">
        <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-dmk-green">
          Where It Started
        </h2>
        <p className="text-foreground/80 leading-relaxed">
          I went through a period of extreme stress where multiple life events
          and medication side effects overwhelmed my nervous system. While all
          this was occurring my dad had started dialysis every other day —
          which was at home or at the center — and most of you know the
          relationship I have with him.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          I developed severe anxiety and dissociation (DPDR), which was
          terrifying and isolating at the time. After proper medical care,
          support, and lifestyle changes — especially returning to training and
          movement — my system slowly stabilized.
        </p>
      </section>

      <figure className="my-14 border-l-4 border-dmk-green pl-6">
        <blockquote className="font-display text-2xl sm:text-3xl tracking-tight leading-snug">
          “Training and discipline gave me my sense of self back when I felt
          lost.”
        </blockquote>
      </figure>

      <section className="space-y-6">
        <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-dmk-green">
          What The Brand Represents
        </h2>
        <p className="text-foreground/80 leading-relaxed">
          These are designs I created to represent mental health awareness —
          the green ribbon and the green around it — and to represent the
          people who use working out and any type of physical activity to help
          cope and improve their mental health.
        </p>
      </section>

      <section className="space-y-6 mt-14">
        <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-dmk-green">
          Why It Matters
        </h2>
        <p className="text-foreground/80 leading-relaxed">
          Getting the chance to coach and be around the next generation of
          athletes gave me the mindset that these athletes needed a role model
          — one who could steer them in the right direction and be there for
          them at the same time. That experience is why I'm passionate about
          creating spaces where people can use fitness as a tool for mental
          resilience and recovery.
        </p>
      </section>

      <div className="mt-16 border-t border-white/5 pt-10 text-center">
        <p className="font-display text-2xl tracking-wider text-foreground/70">
          MENTAL STRENGTH <span className="text-dmk-green">IS TRAINED.</span>
        </p>
      </div>
    </article>
  );
}
