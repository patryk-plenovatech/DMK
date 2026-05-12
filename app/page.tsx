import Link from "next/link";
import { Hero } from "@/components/Hero";
import { MissionBand } from "@/components/MissionBand";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/products";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Story teaser */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
          <p className="font-display text-sm tracking-[0.3em] text-dmk-green">
            THE STORY
          </p>
          <div>
            <h2 className="font-display text-4xl sm:text-5xl tracking-tight leading-tight">
              Built out of the worst stretch of my life.
            </h2>
            <p className="mt-6 text-foreground/70 leading-relaxed">
              DMK started in a period of extreme stress, severe anxiety, and
              dissociation. Returning to training and movement is what slowly
              stabilized everything. These designs exist for the people who use
              physical activity to cope and improve their mental health.
            </p>
            <Link
              href="/story"
              className="mt-6 inline-flex items-center gap-2 font-display tracking-widest text-dmk-green hover:gap-3 transition-all"
            >
              READ THE FULL STORY <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-[#0d0d0d] border-y border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-12">
            <div>
              <p className="font-display text-sm tracking-[0.3em] text-dmk-green">
                THE DROP
              </p>
              <h2 className="font-display text-4xl sm:text-5xl tracking-tight mt-2">
                Shop The Collection
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 font-display tracking-widest text-foreground/80 hover:text-dmk-green transition-colors"
            >
              VIEW ALL <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      <MissionBand />
    </>
  );
}
