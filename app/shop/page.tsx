import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import {
  PRODUCTS,
  PRODUCT_TYPE_LABEL,
  type ProductType,
} from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Hoodies, tees, long sleeves, and trucker hats from DMK Apparel. Streetwear built for mental strength.",
};

const TYPE_FILTERS: { value: ProductType | "all"; label: string }[] = [
  { value: "all", label: "ALL" },
  { value: "hoodie", label: "HOODIES" },
  { value: "short-sleeve", label: "SHORT SLEEVE" },
  { value: "long-sleeve", label: "LONG SLEEVE" },
  { value: "hat", label: "HATS" },
];

type ShopSearchParams = Promise<{ type?: string }>;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: ShopSearchParams;
}) {
  const params = await searchParams;
  const active = (params?.type ?? "all") as ProductType | "all";

  const filtered =
    active === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.type === active);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <header className="mb-12">
        <p className="font-display text-sm tracking-[0.3em] text-dmk-green">
          THE COLLECTION
        </p>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl tracking-tight mt-2">
          SHOP
        </h1>
        <p className="mt-4 max-w-xl text-foreground/65">
          Every piece supports the message: train the body to train the mind.
          Designs available across our hoodies, tees, long sleeves, and trucker
          hats.
        </p>
      </header>

      <div className="mb-10 flex flex-wrap gap-2 sm:gap-3">
        {TYPE_FILTERS.map((f) => {
          const isActive = active === f.value;
          const href = f.value === "all" ? "/shop" : `/shop?type=${f.value}`;
          return (
            <Link
              key={f.value}
              href={href}
              className={[
                "rounded-md border px-4 py-2 font-display text-sm tracking-widest transition-colors",
                isActive
                  ? "border-dmk-green bg-dmk-green/10 text-dmk-green"
                  : "border-white/10 text-foreground/70 hover:text-foreground hover:border-white/30",
              ].join(" ")}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-foreground/60">
          No products in {PRODUCT_TYPE_LABEL[active as ProductType]} yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
