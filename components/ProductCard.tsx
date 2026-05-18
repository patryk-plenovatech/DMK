"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  COLORWAY_HEX,
  COLORWAY_LABEL,
  type Product,
  getAllColorways,
  getPrimaryImage,
} from "@/lib/products";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const colorways = getAllColorways(product);
  const primaryImage = product.designs[0]
    ? getPrimaryImage(product.designs[0])
    : "/brand/logo-silver.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Link
        href={`/product/${product.slug}`}
        className="group relative block overflow-hidden rounded-lg border border-white/5 bg-[#111] transition-all hover:-translate-y-1 hover:border-dmk-green/30 hover:shadow-[0_20px_60px_-20px_rgba(34,197,94,0.25)]"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-black">
          <Image
            src={primaryImage}
            alt={`${product.name} — ${product.designs[0]?.name ?? ""}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex items-end justify-between gap-4 p-5">
          <div>
            <h3 className="font-display text-2xl tracking-wide leading-none">
              {product.name.toUpperCase()}
            </h3>
            <p className="mt-2 text-sm text-foreground/60">
              {colorways.length === 1
                ? COLORWAY_LABEL[colorways[0]]
                : `${colorways.length} colors`}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-2xl tracking-wide text-dmk-green">
              ${product.price}
            </p>
            <div className="mt-2 flex items-center justify-end gap-1.5">
              {colorways.map((c) => (
                <span
                  key={c}
                  title={COLORWAY_LABEL[c]}
                  aria-label={COLORWAY_LABEL[c]}
                  className="h-3 w-3 rounded-full border border-white/20"
                  style={{ backgroundColor: COLORWAY_HEX[c] }}
                />
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
