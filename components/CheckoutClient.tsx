"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Lock,
  Minus,
  Plus,
  ShoppingBag,
  Store,
  Trash2,
  Truck,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { startCheckout } from "@/app/checkout/actions";
import {
  COLORWAY_LABEL,
  PLACEMENT_LABEL,
  PRODUCT_TYPE_LABEL,
  getDesignColorways,
  getProductBySlug,
} from "@/lib/products";

const DELIVERY_FEE = 7;

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

/** Build the small grey "M · Orange print · Tan hoodie · …" line for an item. */
function describe(item: ReturnType<typeof useCart>["items"][number]): string {
  const parts: string[] = [];
  if (item.size) parts.push(item.size);

  const product = getProductBySlug(item.slug);
  const design = product?.designs.find((d) => d.id === item.designId);
  const colorways = design ? getDesignColorways(design) : [];
  if (colorways.length > 1) parts.push(`${COLORWAY_LABEL[item.colorway]} print`);
  if (item.shirtColor && product)
    parts.push(
      `${COLORWAY_LABEL[item.shirtColor]} ${PRODUCT_TYPE_LABEL[product.type].toLowerCase()}`,
    );
  parts.push(PLACEMENT_LABEL[item.placement]);
  return parts.join(" · ");
}

export function CheckoutClient() {
  const { items, count, subtotal, ready, setQty, removeItem } = useCart();
  const [delivery, setDelivery] = useState(true);

  const deliveryFee = delivery ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  // Before localStorage hydrates, render a quiet placeholder (matches SSR).
  if (!ready) {
    return (
      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 py-24 text-center text-foreground/40">
        Loading your cart…
      </div>
    );
  }

  // Empty cart.
  if (count === 0) {
    return (
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
        <ShoppingBag className="h-12 w-12 text-foreground/30" strokeWidth={1.5} />
        <h1 className="font-display mt-6 text-5xl sm:text-6xl tracking-tight">
          YOUR CART IS EMPTY
        </h1>
        <p className="mt-4 max-w-md text-foreground/65">
          Pick a piece, choose your size and colors, and add it to your cart.
        </p>
        <Link
          href="/shop"
          className="mt-10 inline-flex items-center gap-2 rounded-md bg-dmk-green px-7 py-4 font-display text-lg tracking-widest text-dmk-black transition-all hover:bg-dmk-green-dark hover:-translate-y-0.5"
        >
          BROWSE THE SHOP
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    );
  }

  const cartPayload = JSON.stringify(
    items.map((i) => ({
      slug: i.slug,
      design: i.designId,
      color: i.colorway,
      shirt: i.shirtColor,
      placement: i.placement,
      size: i.size,
      qty: i.qty,
    })),
  );

  return (
    <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24">
      <p className="font-display text-sm tracking-[0.3em] text-dmk-green">
        YOUR CART
      </p>
      <h1 className="font-display text-5xl sm:text-6xl tracking-tight mt-2">
        CHECKOUT
      </h1>

      {/* Line items */}
      <ul className="mt-10 space-y-3">
        {items.map((item) => (
          <li
            key={item.key}
            className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4"
          >
            <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#111]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-display text-lg tracking-wide leading-tight">
                    {item.name.toUpperCase()}
                  </h2>
                  <p className="mt-1 text-xs text-foreground/55 leading-snug">
                    {describe(item)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.key)}
                  aria-label={`Remove ${item.name}`}
                  className="shrink-0 text-foreground/40 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-auto flex items-end justify-between pt-3">
                {/* Quantity stepper */}
                <div className="inline-flex items-center gap-2 rounded-md border border-white/10">
                  <button
                    type="button"
                    onClick={() => setQty(item.key, item.qty - 1)}
                    aria-label="Decrease quantity"
                    className="px-2.5 py-1.5 text-foreground/70 hover:text-dmk-green transition-colors disabled:opacity-30"
                    disabled={item.qty <= 1}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="font-display min-w-5 text-center text-sm">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(item.key, item.qty + 1)}
                    aria-label="Increase quantity"
                    className="px-2.5 py-1.5 text-foreground/70 hover:text-dmk-green transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-display text-lg tracking-wide text-dmk-green">
                    {usd(item.unitPrice * item.qty)}
                  </p>
                  {item.qty > 1 && (
                    <p className="text-xs text-foreground/40">
                      {usd(item.unitPrice)} each
                    </p>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Link
        href="/shop"
        className="mt-4 inline-block text-sm text-foreground/55 hover:text-dmk-green transition-colors"
      >
        + Add more items
      </Link>

      {/* Delivery vs pickup */}
      <div className="mt-10">
        <p className="font-display text-sm tracking-widest text-foreground/50">
          HOW DO YOU WANT IT?
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setDelivery(true)}
            className={[
              "flex items-center gap-3 rounded-md border p-4 text-left transition-colors",
              delivery
                ? "border-dmk-green bg-dmk-green/10"
                : "border-white/10 hover:border-white/30",
            ].join(" ")}
          >
            <Truck
              className={delivery ? "h-6 w-6 text-dmk-green" : "h-6 w-6 text-foreground/60"}
            />
            <div>
              <p
                className={[
                  "font-display text-base tracking-wide",
                  delivery ? "text-dmk-green" : "text-foreground/85",
                ].join(" ")}
              >
                Delivery · +{usd(DELIVERY_FEE)}
              </p>
              <p className="text-xs text-foreground/55">
                Shipped to your address (entered at payment).
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDelivery(false)}
            className={[
              "flex items-center gap-3 rounded-md border p-4 text-left transition-colors",
              !delivery
                ? "border-dmk-green bg-dmk-green/10"
                : "border-white/10 hover:border-white/30",
            ].join(" ")}
          >
            <Store
              className={!delivery ? "h-6 w-6 text-dmk-green" : "h-6 w-6 text-foreground/60"}
            />
            <div>
              <p
                className={[
                  "font-display text-base tracking-wide",
                  !delivery ? "text-dmk-green" : "text-foreground/85",
                ].join(" ")}
              >
                Local pickup · Free
              </p>
              <p className="text-xs text-foreground/55">
                We&apos;ll message you to arrange pickup.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Totals */}
      <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        <div className="flex items-center justify-between py-1 text-foreground/75">
          <span>Subtotal ({count} {count === 1 ? "item" : "items"})</span>
          <span>{usd(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between py-1 text-foreground/75">
          <span>{delivery ? "Delivery" : "Local pickup"}</span>
          <span>{deliveryFee === 0 ? "Free" : usd(deliveryFee)}</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="font-display text-lg tracking-widest text-foreground/80">
            TOTAL
          </span>
          <span className="font-display text-3xl tracking-wide text-dmk-green">
            {usd(total)}
          </span>
        </div>
      </div>

      {/* Pay */}
      <form action={startCheckout} className="mt-6">
        <input type="hidden" name="cart" value={cartPayload} />
        <input type="hidden" name="delivery" value={delivery ? "1" : "0"} />
        <button
          type="submit"
          className="group inline-flex w-full items-center justify-center gap-2 rounded-md bg-dmk-green px-7 py-4 font-display text-lg tracking-widest text-dmk-black transition-all hover:bg-dmk-green-dark hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-10px_rgba(34,197,94,0.6)]"
        >
          PAY {usd(total)}
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
      </form>

      <div className="mt-5 flex items-center justify-center gap-2 text-xs tracking-wider text-foreground/45">
        <Lock className="h-3.5 w-3.5" />
        <span>Secure payment powered by Stripe</span>
      </div>
    </div>
  );
}
