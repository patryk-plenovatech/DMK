"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart";

/** Empties the cart on the order-confirmation page so a completed purchase
 *  doesn't leave the bought items sitting in the cart.
 *
 *  We gate on `ready`: Stripe redirects here as a fresh page load, so the cart
 *  provider hydrates from localStorage on mount. Clearing must happen AFTER
 *  that hydration, otherwise the just-loaded items would overwrite the clear. */
export function ClearCart() {
  const { clear, ready } = useCart();
  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);
  return null;
}
