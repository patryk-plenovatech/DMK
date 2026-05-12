"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Minus, Plus } from "lucide-react";
import {
  COLORWAY_HEX,
  COLORWAY_LABEL,
  PRODUCT_TYPE_LABEL,
  SIZES,
  type Product,
  type Colorway,
  type Size,
  getDesignColorways,
  getDesignImages,
  getSizesFor,
} from "@/lib/products";

type Props = {
  product: Product;
};

export function ProductDetail({ product }: Props) {
  const [designId, setDesignId] = useState(product.designs[0].id);
  const design = product.designs.find((d) => d.id === designId)!;
  const designColorways = getDesignColorways(design);

  const [colorway, setColorway] = useState<Colorway>(designColorways[0]);
  const [size, setSize] = useState<Size | null>(
    getSizesFor(product.type) ? "M" : null,
  );
  const [qty, setQty] = useState(1);
  const [imageIdx, setImageIdx] = useState(0);

  const images = getDesignImages(design, colorway);

  function selectDesign(id: string) {
    const next = product.designs.find((d) => d.id === id)!;
    const nextColorways = getDesignColorways(next);
    setDesignId(id);
    if (!nextColorways.includes(colorway)) setColorway(nextColorways[0]);
    setImageIdx(0);
  }

  function selectColorway(c: Colorway) {
    setColorway(c);
    setImageIdx(0);
  }

  const sizesAvailable = getSizesFor(product.type);

  const checkoutHref = useMemo(() => {
    const params = new URLSearchParams({
      item: product.slug,
      design: design.id,
      color: colorway,
      qty: String(qty),
    });
    if (size) params.set("size", size);
    return `/checkout?${params.toString()}`;
  }, [product.slug, design.id, colorway, size, qty]);

  const currentImage = images[imageIdx] ?? images[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="mb-8">
        <Link
          href="/shop"
          className="text-sm text-foreground/60 hover:text-dmk-green transition-colors"
        >
          ← Back to shop
        </Link>
      </div>

      <div className="grid gap-10 lg:gap-16 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <motion.div
            key={design.id + colorway + imageIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-white/5 bg-[#111]"
          >
            {currentImage && (
              <Image
                src={currentImage}
                alt={`${product.name} — ${design.name} — ${COLORWAY_LABEL[colorway]}`}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            )}
          </motion.div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setImageIdx(i)}
                  aria-label={`Show image ${i + 1}`}
                  className={[
                    "relative h-20 w-20 overflow-hidden rounded-md border transition-colors",
                    i === imageIdx
                      ? "border-dmk-green"
                      : "border-white/10 hover:border-white/30",
                  ].join(" ")}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info + pickers */}
        <div>
          <p className="font-display text-sm tracking-[0.3em] text-dmk-green">
            {PRODUCT_TYPE_LABEL[product.type].toUpperCase()}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl tracking-tight mt-2">
            {product.name.toUpperCase()}
          </h1>
          <p className="mt-3 font-display text-3xl tracking-wide text-dmk-green">
            ${product.price}
          </p>
          {design.tagline && (
            <p className="mt-3 text-foreground/65 italic">{design.tagline}</p>
          )}

          {/* Design picker */}
          <div className="mt-10">
            <p className="font-display text-sm tracking-widest text-foreground/50">
              DESIGN
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.designs.map((d) => {
                const isActive = d.id === designId;
                return (
                  <button
                    key={d.id}
                    onClick={() => selectDesign(d.id)}
                    className={[
                      "rounded-md border px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "border-dmk-green bg-dmk-green/10 text-dmk-green"
                        : "border-white/10 text-foreground/80 hover:border-white/30",
                    ].join(" ")}
                  >
                    {d.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colorway picker — only colorways actually photographed */}
          <div className="mt-8">
            <p className="font-display text-sm tracking-widest text-foreground/50">
              COLOR ·{" "}
              <span className="text-foreground/80">
                {COLORWAY_LABEL[colorway]}
              </span>
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {designColorways.map((c) => {
                const isActive = c === colorway;
                return (
                  <button
                    key={c}
                    onClick={() => selectColorway(c)}
                    aria-label={COLORWAY_LABEL[c]}
                    className={[
                      "h-10 w-10 rounded-full border-2 transition-all",
                      isActive
                        ? "border-dmk-green scale-110"
                        : "border-white/20 hover:border-white/40",
                    ].join(" ")}
                    style={{ backgroundColor: COLORWAY_HEX[c] }}
                  />
                );
              })}
            </div>
          </div>

          {/* Size picker */}
          {sizesAvailable && (
            <div className="mt-8">
              <p className="font-display text-sm tracking-widest text-foreground/50">
                SIZE
              </p>
              <div className="mt-3 grid grid-cols-6 gap-2 max-w-md">
                {SIZES.map((s) => {
                  const isActive = s === size;
                  return (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={[
                        "rounded-md border py-2 font-display tracking-wide transition-colors",
                        isActive
                          ? "border-dmk-green bg-dmk-green text-dmk-black"
                          : "border-white/10 text-foreground/80 hover:border-white/30",
                      ].join(" ")}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-8">
            <p className="font-display text-sm tracking-widest text-foreground/50">
              QTY
            </p>
            <div className="mt-3 inline-flex items-center gap-3 rounded-md border border-white/10">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                aria-label="Decrease quantity"
                className="px-3 py-2 text-foreground/70 hover:text-dmk-green transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-display text-lg min-w-6 text-center">
                {qty}
              </span>
              <button
                onClick={() => setQty(Math.min(99, qty + 1))}
                aria-label="Increase quantity"
                className="px-3 py-2 text-foreground/70 hover:text-dmk-green transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* CTA */}
          <Link
            href={checkoutHref}
            className="mt-10 group inline-flex w-full items-center justify-center gap-2 rounded-md bg-dmk-green px-7 py-4 font-display text-lg tracking-widest text-dmk-black transition-all hover:bg-dmk-green-dark hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-10px_rgba(34,197,94,0.6)] sm:w-auto"
          >
            BUY NOW
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <p className="mt-4 text-xs text-foreground/40">
            Checkout coming soon — you'll be sent to a temporary order page.
          </p>
        </div>
      </div>
    </div>
  );
}
