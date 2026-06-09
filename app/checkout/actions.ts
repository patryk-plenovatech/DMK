"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import {
  COLORWAY_LABEL,
  PLACEMENT_LABEL,
  PRODUCT_TYPE_LABEL,
  SIZES,
  getDesignColorways,
  getPlacementPrice,
  getProductBySlug,
  getShirtColors,
  getSizesFor,
  type Colorway,
  type Placement,
  type Size,
} from "@/lib/products";

const DELIVERY_FEE_CENTS = 700; // $7 flat, once per order

// Resolve the public origin so Stripe knows where to send the customer back.
async function getOrigin(): Promise<string> {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : "http://localhost:3000";
}

type RawCartItem = {
  slug?: string;
  design?: string;
  color?: string;
  shirt?: string | null;
  placement?: string;
  size?: string | null;
  qty?: number;
};

type BuiltLine = {
  lineItem: Stripe.Checkout.SessionCreateParams.LineItem;
  summary: string;
};

/** Validate one raw cart entry against the catalog and build its Stripe line
 *  item. Returns null if the product slug is unknown. Price is taken from the
 *  catalog, never from the client. */
function buildLine(raw: RawCartItem): BuiltLine | null {
  const product = getProductBySlug(String(raw.slug ?? ""));
  if (!product) return null;

  const design =
    product.designs.find((d) => d.id === raw.design) ?? product.designs[0];

  const colorways = getDesignColorways(design);
  const colorway: Colorway = colorways.includes(raw.color as Colorway)
    ? (raw.color as Colorway)
    : colorways[0];

  const placement: Placement = product.placements.some(
    (p) => p.id === raw.placement,
  )
    ? (raw.placement as Placement)
    : product.placements[0].id;

  const shirtOptions = getShirtColors(product, colorway);
  const shirtColor: Colorway | null =
    shirtOptions && shirtOptions.includes(raw.shirt as Colorway)
      ? (raw.shirt as Colorway)
      : null;

  const size: Size | null =
    getSizesFor(product.type) && SIZES.includes(raw.size as Size)
      ? (raw.size as Size)
      : null;

  const qty = Math.min(
    99,
    Math.max(1, Number.isFinite(raw.qty) ? Math.floor(Number(raw.qty)) : 1),
  );

  const unitPrice = getPlacementPrice(product, placement);

  const descParts: string[] = [];
  if (size) descParts.push(`Size ${size}`);
  if (colorways.length > 1) descParts.push(`${COLORWAY_LABEL[colorway]} print`);
  if (shirtColor)
    descParts.push(
      `${COLORWAY_LABEL[shirtColor]} ${PRODUCT_TYPE_LABEL[product.type].toLowerCase()}`,
    );
  descParts.push(PLACEMENT_LABEL[placement]);
  const description = descParts.join(" · ");

  return {
    lineItem: {
      quantity: qty,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(unitPrice * 100),
        product_data: { name: product.name, description },
      },
    },
    summary: `${qty}× ${product.name} (${description})`,
  };
}

/**
 * Creates a Stripe Checkout Session for the whole cart and redirects to
 * Stripe's hosted payment page.
 *
 * Form fields:
 *   - cart:     JSON array of cart entries (validated + repriced server-side)
 *   - delivery: "1" to add a single $7 delivery fee + collect a shipping
 *               address; "0" for free local pickup (no address collected)
 */
export async function startCheckout(formData: FormData) {
  let raw: RawCartItem[] = [];
  try {
    const parsed = JSON.parse(String(formData.get("cart") ?? "[]"));
    if (Array.isArray(parsed)) raw = parsed;
  } catch {
    redirect("/checkout");
  }

  const built = raw.map(buildLine).filter((b): b is BuiltLine => b !== null);
  if (built.length === 0) redirect("/checkout");

  const wantsDelivery = String(formData.get("delivery") ?? "0") === "1";
  const origin = await getOrigin();

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    line_items: built.map((b) => b.lineItem),
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout`,
    metadata: {
      fulfillment: wantsDelivery ? "delivery" : "pickup",
      item_count: String(built.reduce((n, b) => n + (b.lineItem.quantity ?? 1), 0)),
      // Human-readable order recap (Stripe caps metadata values at 500 chars).
      order: built.map((b) => b.summary).join("; ").slice(0, 480),
    },
  };

  if (wantsDelivery) {
    // Collect a shipping address and add a single $7 delivery fee for the
    // whole order (Stripe applies shipping once, not per item).
    params.shipping_address_collection = { allowed_countries: ["US"] };
    params.shipping_options = [
      {
        shipping_rate_data: {
          display_name: "Delivery",
          type: "fixed_amount",
          fixed_amount: { amount: DELIVERY_FEE_CENTS, currency: "usd" },
          delivery_estimate: {
            minimum: { unit: "business_day", value: 3 },
            maximum: { unit: "business_day", value: 7 },
          },
        },
      },
    ];
  }

  const session = await getStripe().checkout.sessions.create(params);

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  // Must be outside any try/catch — redirect() works by throwing.
  redirect(session.url);
}
