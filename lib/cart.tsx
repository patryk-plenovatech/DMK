"use client";

// Client-side shopping cart for DMK Apparel.
//
// The cart lives in React state and is mirrored to localStorage so it survives
// navigation and refreshes. Each distinct product configuration (design +
// print color + shirt color + placement + size) is one line; adding the same
// configuration again just bumps its quantity.
//
// Prices stored here are for DISPLAY only — the Stripe Checkout Session
// recomputes every price server-side from the catalog (see app/checkout/
// actions.ts) so a tampered cart can never change what's charged.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Colorway, Placement, Size } from "./products";

export type CartItem = {
  key: string; // stable id for this exact configuration
  slug: string;
  designId: string;
  colorway: Colorway;
  shirtColor: Colorway | null;
  placement: Placement;
  size: Size | null;
  qty: number;
  // denormalized for display only
  name: string;
  unitPrice: number;
  image: string;
};

export type NewCartItem = Omit<CartItem, "key">;

function makeKey(i: {
  slug: string;
  designId: string;
  colorway: Colorway;
  shirtColor: Colorway | null;
  placement: Placement;
  size: Size | null;
}): string {
  return [
    i.slug,
    i.designId,
    i.colorway,
    i.shirtColor ?? "",
    i.placement,
    i.size ?? "",
  ].join("|");
}

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  addItem: (item: NewCartItem) => void;
  removeItem: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "dmk-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // corrupt storage — start empty
    }
    setReady(true);
  }, []);

  // Persist on every change (after initial hydrate).
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage full / unavailable — non-fatal
    }
  }, [items, ready]);

  const addItem = useCallback((item: NewCartItem) => {
    const key = makeKey(item);
    setItems((prev) => {
      const existing = prev.find((p) => p.key === key);
      if (existing) {
        return prev.map((p) =>
          p.key === key ? { ...p, qty: Math.min(99, p.qty + item.qty) } : p,
        );
      }
      return [...prev, { ...item, key }];
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((p) => p.key !== key));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    const clamped = Math.min(99, Math.max(1, Math.floor(qty) || 1));
    setItems((prev) =>
      prev.map((p) => (p.key === key ? { ...p, qty: clamped } : p)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    return { items, count, subtotal, ready, addItem, removeItem, setQty, clear };
  }, [items, ready, addItem, removeItem, setQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
