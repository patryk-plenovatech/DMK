"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import {
  COLORWAY_HEX,
  COLORWAY_LABEL,
  PLACEMENT_BLURB,
  PLACEMENT_LABEL,
  PRODUCT_TYPE_LABEL,
  type Colorway,
  type Placement,
  type Product,
  type Size,
  getDesignColorways,
  getDesignImages,
  getPlacementPrice,
  getProductSizes,
  getShirtColors,
} from "@/lib/products";

type Props = {
  product: Product;
};

export function ProductDetail({ product }: Props) {
  const [designId, setDesignId] = useState(product.designs[0].id);
  const design = product.designs.find((d) => d.id === designId)!;
  const designColorways = getDesignColorways(design);

  const [colorway, setColorway] = useState<Colorway>(designColorways[0]);

  const shirtColorOptions = getShirtColors(product, colorway);
  const [shirtColor, setShirtColor] = useState<Colorway | null>(
    shirtColorOptions ? shirtColorOptions[0] : null,
  );

  const [placement, setPlacement] = useState<Placement>(
    product.placements[0].id,
  );

  const sizesAvailable = getProductSizes(product);
  const [size, setSize] = useState<Size | null>(
    sizesAvailable ? "M" : null,
  );
  const [qty, setQty] = useState(1);
  const [imageIdx, setImageIdx] = useState(0);

  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  // When the print color changes, the available shirt colors may shrink
  // (e.g. tan disappears when leaving orange). Snap back to a valid shirt
  // color if the current one is no longer offered.
  useEffect(() => {
    if (!shirtColorOptions) {
      if (shirtColor !== null) setShirtColor(null);
      return;
    }
    if (!shirtColor || !shirtColorOptions.includes(shirtColor)) {
      setShirtColor(shirtColorOptions[0]);
    }
  }, [colorway, product]); // eslint-disable-line react-hooks/exhaustive-deps

  // When placement changes to front-only, hide the crest-front image since
  // the front no longer carries the crest.
  const images = useMemo(() => {
    const all = getDesignImages(design, colorway);
    if (placement === "front-only") return all.slice(0, 1);
    return all;
  }, [design, colorway, placement]);

  const currentImage = images[imageIdx] ?? images[0];
  const price = getPlacementPrice(product, placement);

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

  function selectPlacement(p: Placement) {
    setPlacement(p);
    setImageIdx(0);
  }

  // Reset the "added" confirmation whenever the configuration changes, so the
  // button reflects the current selection rather than a stale add.
  useEffect(() => {
    setAdded(false);
  }, [design.id, colorway, shirtColor, placement, size, qty]);

  function handleAddToCart() {
    addItem({
      slug: product.slug,
      designId: design.id,
      colorway,
      shirtColor,
      placement,
      size,
      qty,
      name: product.name,
      unitPrice: price,
      image: images[0] ?? "/brand/logo-silver.png",
    });
    setAdded(true);
  }

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
            key={design.id + colorway + placement + imageIdx}
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
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-display text-sm tracking-[0.3em] text-dmk-green">
              {PRODUCT_TYPE_LABEL[product.type].toUpperCase()}
            </p>
            {product.limitedNote && (
              <span className="rounded-full border border-dmk-green/40 bg-dmk-green/10 px-3 py-1 font-display text-xs tracking-widest text-dmk-green">
                {product.limitedNote.toUpperCase()}
              </span>
            )}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl tracking-tight mt-2">
            {product.name.toUpperCase()}
          </h1>
          <p className="mt-3 font-display text-3xl tracking-wide text-dmk-green">
            ${price}
          </p>
          {design.tagline && (
            <p className="mt-3 text-foreground/65 italic">{design.tagline}</p>
          )}

          {/* Design picker — hidden when the product has a single design. */}
          {product.designs.length > 1 && (
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
          )}

          {/* Print color picker — drives which back-print is shown. */}
          {designColorways.length > 1 && (
            <div className="mt-10">
              <p className="font-display text-sm tracking-widest text-foreground/50">
                PRINT COLOR ·{" "}
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
          )}

          {/* Shirt color picker — fabric color of the garment, independent
              of print color. Hidden if the product doesn't expose one. */}
          {shirtColorOptions && shirtColor && (
            <div className="mt-10">
              <p className="font-display text-sm tracking-widest text-foreground/50">
                SHIRT COLOR ·{" "}
                <span className="text-foreground/80">
                  {COLORWAY_LABEL[shirtColor]}
                </span>
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {shirtColorOptions.map((c) => {
                  const isActive = c === shirtColor;
                  return (
                    <button
                      key={c}
                      onClick={() => setShirtColor(c)}
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
          )}

          {/* Placement picker — design on front, or DMK crest front + back
              print. Hidden when the product only offers one placement. */}
          {product.placements.length > 1 && (
            <div className="mt-10">
              <p className="font-display text-sm tracking-widest text-foreground/50">
                STYLE
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 max-w-2xl">
                {product.placements.map((p) => {
                  const isActive = p.id === placement;
                  return (
                    <button
                      key={p.id}
                      onClick={() => selectPlacement(p.id)}
                      className={[
                        "rounded-md border p-3 text-left transition-colors",
                        isActive
                          ? "border-dmk-green bg-dmk-green/10"
                          : "border-white/10 hover:border-white/30",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={[
                            "font-display text-sm tracking-wider",
                            isActive
                              ? "text-dmk-green"
                              : "text-foreground/85",
                          ].join(" ")}
                        >
                          {PLACEMENT_LABEL[p.id]}
                        </span>
                        <span
                          className={[
                            "font-display text-base tracking-wide",
                            isActive
                              ? "text-dmk-green"
                              : "text-foreground/70",
                          ].join(" ")}
                        >
                          ${p.price}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-foreground/55 leading-snug">
                        {PLACEMENT_BLURB[p.id]}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size picker */}
          {sizesAvailable && (
            <div className="mt-8">
              <p className="font-display text-sm tracking-widest text-foreground/50">
                SIZE
              </p>
              <div className="mt-3 grid grid-cols-6 gap-2 max-w-md">
                {sizesAvailable.map((s) => {
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
          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-10 group inline-flex w-full items-center justify-center gap-2 rounded-md bg-dmk-green px-7 py-4 font-display text-lg tracking-widest text-dmk-black transition-all hover:bg-dmk-green-dark hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-10px_rgba(34,197,94,0.6)] sm:w-auto"
          >
            {added ? (
              <>
                ADDED TO CART
                <Check className="h-5 w-5" />
              </>
            ) : (
              <>
                ADD TO CART
                <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110" />
              </>
            )}
          </button>

          {added && (
            <Link
              href="/checkout"
              className="mt-3 group inline-flex w-full items-center justify-center gap-2 rounded-md border border-dmk-green/50 bg-dmk-green/5 px-7 py-3 font-display text-base tracking-widest text-dmk-green transition-all hover:bg-dmk-green/10 sm:w-auto"
            >
              VIEW CART &amp; CHECKOUT
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          )}

          <p className="mt-4 text-xs text-foreground/40">
            Secure checkout powered by Stripe. Free local pickup or $7 delivery.
          </p>
        </div>
      </div>
    </div>
  );
}
